import express, { type Response } from 'express'
import cors from 'cors'
import { Database } from 'bun:sqlite'
import { mkdirSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { timingSafeEqual } from 'node:crypto'
import pkg from '../package.json'
import type { BeatsSong } from '../src/types'
import { withSongMeta, type SongMeta, type SongMetaLookup } from './og'

function setSSEHeaders(res: Response): void {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
}

// Trim an optional string body field and clamp its length; undefined if absent/blank.
const str = (v: unknown, max: number): string | undefined =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : undefined

// SSE envelope.
const sseEvent = (event: string, data: unknown): string => `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`

// --- /beats: browser-player radio over SSE ---
// A composer agent POSTs songs here; the browser player tab receives them over SSE
// and plays each with the real Web Audio engine (full fidelity, worklets reclaimed).
// The song payload shape is the shared BeatsSong type in src/types.ts.

// Port precedence, in one place: explicit option > PORT env > 3001. The CLI uses this
// too when printing the player URL, so the two can't disagree.
export const resolvePort = (port?: number): number => port ?? Number(process.env.PORT ?? 3001)

export interface StartServerOptions {
  port?: number
  stateDir?: string
  staticDir?: string
}

export function startServer(opts?: StartServerOptions) {
  const port = resolvePort(opts?.port)
  // BEATS_STATE_DIR env always wins over the built-in default; an explicit opt wins over both.
  const stateDir = opts?.stateDir ?? process.env.BEATS_STATE_DIR ?? '.beats'
  // Package-relative default resolves identically in the repo, the Docker image
  // (/app/server -> /app/dist), and bunx's global cache.
  const staticDir = opts?.staticDir ?? join(import.meta.dir, '..', 'dist')

  const app = express()

  // BEATS_CORS_ORIGIN (comma-separated origins) restricts CORS when deployed; unset stays
  // permissive so local dev needs zero config.
  const corsOrigins = process.env.BEATS_CORS_ORIGIN?.split(',').map((o) => o.trim()).filter(Boolean)
  app.use(corsOrigins?.length ? cors({ origin: corsOrigins }) : cors())
  app.use(express.json())

  // --- auth ---
  // Set BEATS_TOKEN when deployed (e.g. fly.io) to require `Authorization: Bearer <token>` on
  // every mutating (POST) /api route — i.e. posting songs. Reads stay public: anyone can load
  // the player, fetch history, and listen to the SSE stream. Unset = auth disabled, so local
  // dev needs no configuration.
  const AUTH_TOKEN = process.env.BEATS_TOKEN

  // only called from the middleware below, which has already established AUTH_TOKEN is set
  function tokenMatches(supplied: string): boolean {
    if (!AUTH_TOKEN) return false
    const a = Buffer.from(supplied)
    const b = Buffer.from(AUTH_TOKEN)
    return a.length === b.length && timingSafeEqual(a, b)
  }

  app.use('/api', (req, res, next) => {
    // reads (GET/HEAD) stay public; mutations (POST song, DELETE song) require the token
    if (!AUTH_TOKEN || req.method === 'GET' || req.method === 'HEAD') {
      next()
      return
    }
    const header = req.headers.authorization
    const supplied = header?.startsWith('Bearer ') ? header.slice(7) : undefined
    if (supplied && tokenMatches(supplied)) {
      next()
      return
    }
    res.status(401).json({ error: 'missing or invalid token' })
  })

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', version: pkg.version })
  })

  // --- persistent history (SQLite via bun:sqlite, no extra dependency) ---
  // Every posted song is recorded here so history survives reloads AND server restarts,
  // and captures songs posted while no player tab was connected.
  mkdirSync(stateDir, { recursive: true })
  const db = new Database(join(stateDir, 'history.db'))
  db.run(`CREATE TABLE IF NOT EXISTS songs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  title TEXT,
  genre TEXT,
  mood TEXT,
  cycles INTEGER,
  code TEXT NOT NULL
)`)
  // migrations: add columns that post-date the original schema, idempotently (each ALTER is
  // guarded by a column check). author = who pushed it; model/prompt = provenance of the
  // generation (which model composed it, and the brief it was given) for future analysis.
  const cols = new Set((db.query(`PRAGMA table_info(songs)`).all() as { name: string }[]).map((c) => c.name))
  for (const col of ['author', 'model', 'prompt']) if (!cols.has(col)) db.run(`ALTER TABLE songs ADD COLUMN ${col} TEXT`)
  const insertSong = db.query(
    'INSERT INTO songs (ts, title, genre, mood, author, model, prompt, cycles, code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
  )
  const recentSongs = db.query('SELECT id, title, genre, mood, author, model, cycles, code FROM songs ORDER BY id DESC LIMIT ?')
  const songMetaById = db.query('SELECT id, title, genre, mood, author FROM songs WHERE id = ?')
  const deleteSong = db.query('DELETE FROM songs WHERE id = ?')

  const beatsClients = new Set<Response>()

  // Guarded write: a throwing client is evicted so one broken socket can't abort fan-out.
  function writeTo(client: Response, payload: string): void {
    try {
      client.write(payload)
    } catch {
      beatsClients.delete(client)
      client.destroy()
    }
  }

  // SSE fan-out to every connected player.
  function broadcast(event: string, data: unknown): void {
    const payload = sseEvent(event, data)
    for (const client of beatsClients) writeTo(client, payload)
  }

  // Heartbeat keeps idle streams alive through proxies (fly) and flushes out dead sockets.
  const heartbeat = setInterval(() => {
    for (const client of beatsClients) writeTo(client, ': ping\n\n')
  }, 25_000)
  heartbeat.unref()

  app.post('/api/beats', (req, res) => {
    const { title, genre, mood, author, model, prompt, cycles, code } = req.body ?? {}
    if (typeof code !== 'string' || !code.trim()) {
      res.status(400).json({ error: 'a non-empty "code" string is required' })
      return
    }
    // One shaping policy for every optional field: str() drops non-strings (so nothing
    // mistyped reaches the SQLite bind), cycles must be a positive int or the player
    // default applies (a negative would make the radio insta-skip every track).
    // `prompt` is stored for later analysis but never sent to clients, so it stays a local
    // (below) rather than a field on `song` — the song object IS the SSE/history payload.
    const cyclesNum = Math.trunc(Number(cycles))
    const song: BeatsSong = {
      title: str(title, 200), genre: str(genre, 300), mood: str(mood, 1000),
      author: str(author, 40), model: str(model, 60),
      cycles: cyclesNum >= 1 && cyclesNum <= 10000 ? cyclesNum : undefined, code,
    }

    const inserted = insertSong.run(
      Date.now(), song.title ?? null, song.genre ?? null, song.mood ?? null,
      song.author ?? null, song.model ?? null, str(prompt, 8000) ?? null, song.cycles ?? null, song.code,
    )
    song.id = Number(inserted.lastInsertRowid)

    // The DB is the source of truth (the player seeds its playlist from /api/beats/history);
    // SSE only pushes this newly-posted song so connected tabs can append it live.
    broadcast('song', song)

    res.json({ ok: true, listeners: beatsClients.size, title: song.title ?? null })
  })

  // Delete a song by id (token-gated cleanup). Broadcasts an `unsong` SSE event so any
  // connected player drops it from its queue live; players that reload just won't re-seed it.
  app.delete('/api/beats/:id', (req, res) => {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'a positive integer song id is required' })
      return
    }
    const { changes } = deleteSong.run(id)
    if (!changes) {
      res.status(404).json({ error: `no song with id ${id}` })
      return
    }
    broadcast('unsong', { id })
    res.json({ ok: true, deleted: id })
  })

  // The full library (most recent first) — the player seeds its looping playlist from this.
  app.get('/api/beats/history', (req, res) => {
    // SQLite treats LIMIT -1 as "no limit", so the clamp must bound both ends; garbage → 100.
    const requested = Math.trunc(Number(req.query.limit))
    const limit = Number.isFinite(requested) && requested !== 0 ? Math.min(Math.max(requested, 1), 500) : 100
    res.json(recentSongs.all(limit))
  })

  app.get('/api/beats/stream', (req, res) => {
    setSSEHeaders(res)
    res.write(sseEvent('hello', {}))
    beatsClients.add(res)
    req.on('close', () => beatsClients.delete(res))
    // unhandled 'error' on the stream would crash the process
    res.on('error', () => {
      beatsClients.delete(res)
      res.destroy()
    })
  })

  // --- static frontend (deployed mode) ---
  // In dev, vite serves the frontend on :5173 and proxies /api here, so dist/ doesn't exist
  // and this is skipped. In the deployed image the vite build is baked in and served directly.
  // The page itself is public; every /api call it makes is what the token protects.
  if (existsSync(staticDir)) {
    const indexHtml = readFileSync(join(staticDir, 'index.html'), 'utf8')
    const lookupSongMeta: SongMetaLookup = (id) => songMetaById.get(id) as SongMeta | null

    // Vite fingerprints everything in /assets, so browsers can keep each build's files
    // indefinitely; new deploys get new URLs. Other paths still revalidate normally.
    app.use('/assets', express.static(join(staticDir, 'assets'), { maxAge: '1y', immutable: true }))

    // index:false so `/` reaches the handler below — it must see ?song=<id> to inject tags
    app.use(express.static(staticDir, { index: false }))
    app.use((req, res, next) => {
      if (req.path.startsWith('/api')) {
        next()
        return
      }
      res.type('html').send(withSongMeta(indexHtml, req, lookupSongMeta)) // SPA fallback
    })
  }

  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
  })
  // belt-and-braces alongside unref(): tests start/stop many servers in one process
  server.on('close', () => clearInterval(heartbeat))
  return server
}

// Run directly (repo dev via `bun --watch server/index.ts`, Dockerfile CMD `bun server/index.ts`).
if (import.meta.main) startServer()
