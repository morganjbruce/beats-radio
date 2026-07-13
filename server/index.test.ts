import { describe, test, expect, beforeAll, afterAll } from 'bun:test'
import { boot, shutdown, postSong } from './test-helpers'

describe('api (no auth)', () => {
  let ctx: ReturnType<typeof boot>
  beforeAll(() => {
    ctx = boot()
  })
  afterAll(() => shutdown(ctx))

  test('health returns ok and a version', async () => {
    const res = await fetch(`${ctx.url}/api/health`)
    expect(res.status).toBe(200)
    const body = (await res.json()) as { status: string; version: string }
    expect(body.status).toBe('ok')
    expect(typeof body.version).toBe('string')
  })

  test('POST /api/beats rejects a missing code', async () => {
    const res = await postSong(ctx.url, { title: 'no code' })
    expect(res.status).toBe(400)
  })

  test('POST /api/beats rejects an empty code', async () => {
    const res = await postSong(ctx.url, { code: '   ' })
    expect(res.status).toBe(400)
  })

  test('POST /api/beats drops a non-string title instead of erroring', async () => {
    const res = await postSong(ctx.url, { title: {}, code: 's("bd sd")' })
    expect(res.status).toBe(200)
    const history = (await (await fetch(`${ctx.url}/api/beats/history`)).json()) as { code: string; title: string | null }[]
    const song = history.find((s) => s.code === 's("bd sd")')
    expect(song).toBeDefined()
    expect(song!.title).toBeNull()
  })

  test('POST /api/beats drops a negative cycles so the player default applies', async () => {
    const res = await postSong(ctx.url, { title: 'neg cycles', cycles: -3, code: 's("bd")' })
    expect(res.status).toBe(200)
    const history = (await (await fetch(`${ctx.url}/api/beats/history`)).json()) as { title: string; cycles: number | null }[]
    const song = history.find((s) => s.title === 'neg cycles')
    expect(song).toBeDefined()
    expect(song!.cycles).toBeNull()
  })

  test('history clamps limit at both ends', async () => {
    // seed enough rows that "unlimited" would visibly differ from a clamped LIMIT 1
    for (let i = 0; i < 3; i++) await postSong(ctx.url, { title: `seed ${i}`, code: 's("bd")' })

    // SQLite treats LIMIT -1 as unlimited; the clamp must turn it into a bounded (>=1) query
    const neg = await fetch(`${ctx.url}/api/beats/history?limit=-1`)
    expect(neg.status).toBe(200)
    const negRows = (await neg.json()) as unknown[]
    expect(Array.isArray(negRows)).toBe(true)
    expect(negRows.length).toBe(1)

    const huge = await fetch(`${ctx.url}/api/beats/history?limit=99999`)
    expect(huge.status).toBe(200)
    const hugeRows = (await huge.json()) as unknown[]
    expect(hugeRows.length).toBeLessThanOrEqual(500)

    const garbage = await fetch(`${ctx.url}/api/beats/history?limit=banana`)
    expect(garbage.status).toBe(200)
    expect(Array.isArray(await garbage.json())).toBe(true)
  })

  test('DELETE rejects a non-numeric id with 400', async () => {
    const res = await fetch(`${ctx.url}/api/beats/abc`, { method: 'DELETE' })
    expect(res.status).toBe(400)
  })

  test('DELETE returns 404 for an unknown id', async () => {
    const res = await fetch(`${ctx.url}/api/beats/999999`, { method: 'DELETE' })
    expect(res.status).toBe(404)
  })
})

describe('sse', () => {
  let ctx: ReturnType<typeof boot>
  beforeAll(() => {
    ctx = boot()
  })
  afterAll(() => shutdown(ctx))

  // Structural reader type: bun-types and lib.dom disagree on ReadableStreamDefaultReader.
  interface SSEReader {
    read(): Promise<{ done: boolean; value?: Uint8Array }>
    cancel(): Promise<unknown>
  }

  // Reads SSE frames until `predicate` matches or the stream ends.
  async function readUntil(reader: SSEReader, predicate: (chunk: string) => boolean): Promise<string> {
    const decoder = new TextDecoder()
    let buffer = ''
    for (;;) {
      const { done, value } = await reader.read()
      if (done) return buffer
      buffer += decoder.decode(value, { stream: true })
      if (predicate(buffer)) return buffer
    }
  }

  test('a client receives the hello event, and broadcast survives a destroyed peer', async () => {
    const aborted = new AbortController()
    const doomed = await fetch(`${ctx.url}/api/beats/stream`, { signal: aborted.signal })
    const survivor = await fetch(`${ctx.url}/api/beats/stream`)
    const doomedReader = doomed.body!.getReader()
    const survivorReader = survivor.body!.getReader()

    expect(await readUntil(doomedReader, (b) => b.includes('event: hello'))).toContain('event: hello')
    expect(await readUntil(survivorReader, (b) => b.includes('event: hello'))).toContain('event: hello')

    // tear down one client mid-stream; fan-out to the other must not be aborted by it
    aborted.abort()

    const post = await postSong(ctx.url, { title: 'sse survivor', code: 's("bd")' })
    expect(post.status).toBe(200)

    const received = await readUntil(survivorReader, (b) => b.includes('sse survivor'))
    expect(received).toContain('event: song')
    expect(received).toContain('sse survivor')

    await survivorReader.cancel()
  }, 10_000)
})

// Env-mutating: BEATS_TOKEN is read inside startServer at call time, so it must be set before
// boot and restored after. Kept in its own group so no other server instance sees the token.
describe('auth', () => {
  let ctx: ReturnType<typeof boot>
  let previousToken: string | undefined

  beforeAll(() => {
    previousToken = process.env.BEATS_TOKEN
    process.env.BEATS_TOKEN = 'sekrit'
    ctx = boot()
    if (previousToken === undefined) delete process.env.BEATS_TOKEN
    else process.env.BEATS_TOKEN = previousToken
  })
  afterAll(() => shutdown(ctx))

  test('POST without a token is rejected', async () => {
    const res = await postSong(ctx.url, { code: 's("bd")' })
    expect(res.status).toBe(401)
  })

  test('POST with a wrong token is rejected', async () => {
    const res = await postSong(ctx.url, { code: 's("bd")' }, { Authorization: 'Bearer wrong' })
    expect(res.status).toBe(401)
  })

  test('POST with the correct token succeeds', async () => {
    const res = await postSong(ctx.url, { code: 's("bd")' }, { Authorization: 'Bearer sekrit' })
    expect(res.status).toBe(200)
    const body = (await res.json()) as { ok: boolean }
    expect(body.ok).toBe(true)
  })

  test('reads stay public', async () => {
    const health = await fetch(`${ctx.url}/api/health`)
    expect(health.status).toBe(200)
    const history = await fetch(`${ctx.url}/api/beats/history`)
    expect(history.status).toBe(200)
  })
})
