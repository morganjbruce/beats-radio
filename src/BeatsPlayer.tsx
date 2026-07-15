import { lazy, memo, Suspense, useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Visualizer, EngineLoading } from './components'
import type { StrudelAdapter } from './components'
import type { BeatsSong } from './types'

// lazy so the Strudel/CodeMirror graph (>500kB) only downloads on the Start click
const StrudelHost = lazy(() => import('./components/StrudelHost'))

// /?song=<id> permalink — read once at load; playback starts on that song if it's in
// the queue. Left in the address bar so the URL stays shareable while listening.
const PERMALINK_SONG_ID: number | null = (() => {
  const raw = new URLSearchParams(window.location.search).get('song')
  const id = raw ? Number(raw) : NaN
  return Number.isInteger(id) && id > 0 ? id : null
})()

const DEFAULT_CYCLES = 16
// breath of silence between tracks on auto-advance (manual skips stay immediate)
const TRACK_GAP_MS = 2500

// Parse the cps a song runs at from its `setcps(...)` call so we can count cycles
// elapsed. The arg may be arithmetic (setcps(90/60/4)); eval only if it's safe numeric.
function parseCps(code: string): number {
  const m = code.match(/setcps\(\s*([0-9.\s/*+\-()]+?)\s*\)/)
  if (m && /^[0-9.\s/*+\-()]+$/.test(m[1])) {
    try {
      const v = Function(`"use strict"; return (${m[1]})`)()
      if (typeof v === 'number' && isFinite(v) && v > 0) return v
    } catch {
      /* fall through */
    }
  }
  return 0.5
}

// Flat light page — the only grid on the page is the visualizer's (below).
const PAGE_BG: CSSProperties = {
  backgroundColor: '#f4f6fc',
}

// Tight 6px grid under the visualizer only (matching its 6px LED pitch), in translucent
// grey, fading out toward its bottom edge into the flat page.
const FINE_GRID: CSSProperties = {
  backgroundImage:
    'linear-gradient(to right, #e2e7f2 1px, transparent 1px), linear-gradient(to bottom, #e2e7f2 1px, transparent 1px)',
  backgroundSize: '6px 6px',
  // anchor the tiling to the bottom edge so gridlines stay phase-aligned with the
  // visualizer's bottom-anchored LED cells (container height isn't a multiple of 6)
  backgroundPosition: 'left bottom',
  maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
}

// Transport buttons: uniform squares with a hard offset shadow; pressing sinks the
// button into its shadow.
const DECK_BTN =
  'shrink-0 w-12 h-12 inline-flex items-center justify-center border border-[#2d3748] bg-white shadow-[3px_3px_0_#2d3748] transition enabled:hover:border-[#de1a1a] enabled:hover:text-[#de1a1a] enabled:active:translate-x-[2px] enabled:active:translate-y-[2px] enabled:active:shadow-[1px_1px_0_#2d3748] disabled:opacity-40'

// Transport glyphs drawn as inline SVG in currentColor: the emoji codepoints (⏮ ⏸ ⏭)
// get forced color-emoji rendering on iOS/Android no matter the CSS, so the deck draws
// its own monochrome icons — consistent ink everywhere, and they inherit the hover red.
const deckIcon = (d: string) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d={d} />
  </svg>
)
const ICONS = {
  prev: deckIcon('M6 4h2.5v16H6zM20 4v16l-9.5-8z'),
  play: deckIcon('M7 4l13 8-13 8z'),
  pause: deckIcon('M6.5 4h4v16h-4zM13.5 4h4v16h-4z'),
  next: deckIcon('M15.5 4H18v16h-2.5zM4 4v16l9.5-8z'),
  restart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  ),
}

// Header chips that open the queue/engine drawers.
const CHIP_BTN =
  'h-7 px-2.5 flex items-center gap-1.5 border text-[10px] uppercase tracking-[0.2em] transition'

const subtitle = (s: BeatsSong) =>
  [s.author ? `by ${s.author}` : null, s.genre, s.mood].filter(Boolean).join(' · ')

// LED accent dots on the start screen — the visualizer's `spectrum` heat ramp.
const LED_RAMP = ['#d98e1f', '#f0a02e', '#f25c1f', '#de1a1a', '#b3123f', '#ff2e92']

// The queue list is memoized so the 4Hz progress tick (which re-renders BeatsPlayer)
// doesn't re-render up to 500 rows — this only re-renders when the queue or the
// playing row actually changes.
const QueueList = memo(function QueueList({
  queue,
  currentIdx,
  started,
  onPick,
}: {
  queue: BeatsSong[]
  currentIdx: number
  started: boolean
  onPick: (index: number) => void | Promise<void>
}) {
  return (
    <ul className="flex-1 min-h-0 overflow-y-auto bg-white/40">
      {queue.map((s, i) => {
        const isCurrent = i === currentIdx
        const isPlayed = currentIdx >= 0 && i < currentIdx
        return (
          // content-visibility skips layout/paint for offscreen rows (queue can be 500 long)
          <li key={s.id ?? s.code} id={`queue-row-${i}`} className="[content-visibility:auto] [contain-intrinsic-size:auto_54px]">
            <button
              onClick={() => void onPick(i)}
              title={isCurrent ? 'Now playing' : 'Play this'}
              className={`w-full text-left px-3 py-2 flex items-center gap-2.5 border-b border-[#eef1f8] transition ${
                isCurrent ? 'bg-white' : isPlayed ? 'opacity-50 hover:opacity-100 hover:bg-white/80' : 'hover:bg-white/80'
              }`}
            >
              <span className={`w-2 h-2 shrink-0 ${isCurrent ? 'bg-[#de1a1a] animate-pulse' : 'bg-[#dbe2ef]'}`} />
              <span className={`w-6 shrink-0 text-[11px] tabular-nums ${isCurrent ? 'text-[#de1a1a]' : 'text-[#acbed8]'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block truncate text-sm ${isCurrent ? 'font-semibold text-[#de1a1a]' : 'font-medium'}`}>
                  {s.title ?? '(untitled)'}
                </span>
                <span className="block truncate text-[11px] text-[#8595b5]">{subtitle(s)}</span>
              </span>
            </button>
          </li>
        )
      })}
      {started && queue.length === 0 && (
        <li className="px-4 py-6 text-xs text-[#8595b5]">
          queue is empty — run <code>/beats &lt;theme&gt;</code> to add the first track
        </li>
      )}
    </ul>
  )
})

export default function BeatsPlayer() {
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  // ONE plain FIFO queue: seeded chronologically from the server's song log, new songs
  // append to the end, playback walks it top to bottom and loops back to the start.
  const [queue, setQueue] = useState<BeatsSong[]>([])
  const [currentIdx, setCurrentIdx] = useState(-1)
  const [progress, setProgress] = useState(0) // 0..1 through the current song's cycles
  const [vizCtx, setVizCtx] = useState<AudioContext | null>(null)
  const [vizNode, setVizNode] = useState<AudioNode | null>(null)
  // The queue and engine live in slide-in drawers (closed by default) so the stage —
  // visualizer + now playing — keeps the screen. Once mounted (on Start) the engine
  // must never unmount, even with its drawer off-screen — it owns the audio pipeline;
  // `started` never reverts.
  const [queueOpen, setQueueOpen] = useState(false)
  const [engineOpen, setEngineOpen] = useState(false)

  const adapterRef = useRef<StrudelAdapter | null>(null)
  // refs mirror queue/index/paused for the advance interval + SSE + gap-timer closures
  // (no stale captures)
  const queueRef = useRef<BeatsSong[]>([])
  const idxRef = useRef(-1)
  const pausedRef = useRef(false)
  const startTimeRef = useRef(0)
  const cpsRef = useRef(0.5)
  // between-tracks gap state: truthy while the auto-advance pause is in flight
  const gapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // playAt awaits internally and has multiple callers — the seq token lets a newer call
  // supersede an in-flight one (manual picks always win over auto-advance)
  const playSeqRef = useRef(0)
  const playInFlightRef = useRef(false)

  const nowPlaying = queue[currentIdx] ?? null
  // brief "copied!" confirmation after the share link is used
  const [shared, setShared] = useState(false)
  // tap the title/description to lift their line clamps and read the full copy;
  // collapses again when the track changes
  const [textExpanded, setTextExpanded] = useState(false)
  useEffect(() => setTextExpanded(false), [currentIdx])

  // Copy a permalink to the current song to the clipboard; fall back to navigating to
  // the permalink if the Clipboard API is unavailable (e.g. non-secure context).
  const shareSong = useCallback(async () => {
    if (nowPlaying?.id == null) return
    const url = `${window.location.origin}${window.location.pathname}?song=${nowPlaying.id}`
    try {
      await navigator.clipboard.writeText(url)
      setShared(true)
      setTimeout(() => setShared(false), 1600)
    } catch {
      window.location.href = `?song=${nowPlaying.id}`
    }
  }, [nowPlaying])

  // Escape closes whichever drawers are open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setQueueOpen(false)
      setEngineOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.title = playing && nowPlaying?.title ? `Beats (♪ ${nowPlaying.title})` : 'Beats'
  }, [playing, nowPlaying])

  const onReady = useCallback((adapter: StrudelAdapter) => {
    adapterRef.current = adapter
  }, [])

  // state+ref pairs write through these so the two copies can never drift
  const setList = useCallback((next: BeatsSong[]) => {
    queueRef.current = next
    setQueue(next)
  }, [])
  const setIndex = useCallback((next: number) => {
    idxRef.current = next
    setCurrentIdx(next)
  }, [])
  const setPausedFlag = useCallback((next: boolean) => {
    pausedRef.current = next
    setPaused(next)
  }, [])

  // Play the queue entry at `index` and make it current.
  const playAt = useCallback(async (index: number) => {
    const adapter = adapterRef.current
    const song = queueRef.current[index]
    if (!adapter || !song) return
    const seq = ++playSeqRef.current
    playInFlightRef.current = true
    try {
      // a manual pick cancels any pending between-tracks gap
      if (gapTimerRef.current) {
        clearTimeout(gapTimerRef.current)
        gapTimerRef.current = null
      }
      // Resume the context BEFORE evaluating (picking a song always plays it, even if the
      // radio was paused). Order matters: suspend leaves ~0.2s of the old pattern's audio
      // queued, and evaluating while still suspended schedules the new song's downbeat into
      // that same frozen window — resuming then fires both at once (the burst of noise).
      // Resuming first drains the old tail under a running clock before the new pattern lands.
      const ctx = adapter.getAudioContext()
      if (ctx && ctx.state !== 'running') {
        await ctx.resume()
        if (playSeqRef.current !== seq) return // a newer playAt superseded this one
        setPausedFlag(false)
      }
      // start this song's sample fetches BEFORE the engine evaluates, so opening hits land warm
      adapter.warmup(song.code)
      try {
        adapter.setCode(song.code)
        await adapter.run()
      } catch (err) {
        console.error('[beats] play error:', err)
        return
      }
      if (playSeqRef.current !== seq) return // superseded mid-run: the newer call owns the engine
      setIndex(index)
      setProgress(0)
      cpsRef.current = adapter.getCps() ?? parseCps(song.code) // regex parse = fallback only
      startTimeRef.current = ctx ? ctx.currentTime : 0
      if (ctx) setVizCtx(ctx)
      const out = adapter.getOutputNode()
      if (out) setVizNode(out)
      // preload the NEXT song's samples too, so the track change lands warm
      const upNext = queueRef.current[(index + 1) % queueRef.current.length]
      if (upNext && upNext !== song) adapter.warmup(upNext.code)
    } finally {
      if (playSeqRef.current === seq) playInFlightRef.current = false // superseded calls leave the flag to the winner
    }
  }, [setIndex, setPausedFlag])

  // Advance to the next track, wrapping to the start at the end of the queue.
  // `gap` inserts the between-tracks breath of silence (auto-advance); manual skips omit it.
  // (named function expression so the gap timer can re-enter it without a TDZ read)
  const advance = useCallback(async function advance(opts?: { gap?: boolean }) {
    const list = queueRef.current
    if (!list.length) return
    const next = (idxRef.current + 1) % list.length
    if (next === idxRef.current) {
      // single-song queue: Strudel loops the pattern itself, so just reset the clock
      const ctx = adapterRef.current?.getAudioContext()
      startTimeRef.current = ctx ? ctx.currentTime : 0
      setProgress(0)
      return
    }
    if (opts?.gap) {
      // stop the engine for a short breath of silence, then re-advance for real
      // (recomputed then, in case the queue changed during the gap)
      void adapterRef.current?.stop()
      gapTimerRef.current = setTimeout(() => {
        gapTimerRef.current = null
        // paused during the gap: bail rather than un-pause; the interval re-arms this
        // advance after resume (cyclesElapsed stays past target while suspended)
        if (pausedRef.current) return
        void advance()
      }, TRACK_GAP_MS)
      return
    }
    await playAt(next)
  }, [playAt])

  // Pause/resume by suspending the AudioContext — freezes audio AND the cycle clock
  // (ctx.currentTime stops), so the radio doesn't advance while paused.
  const togglePause = useCallback(async () => {
    const ctx = adapterRef.current?.getAudioContext()
    if (!ctx) return
    try {
      if (ctx.state === 'running') {
        await ctx.suspend()
        setPausedFlag(true)
      } else {
        await ctx.resume()
        setPausedFlag(false)
      }
    } catch (err) {
      console.error('[beats] pause toggle:', err)
    }
  }, [setPausedFlag])

  // Step back to the previous track — no wrap-around: disabled on the queue's first song.
  const playPrev = useCallback(() => {
    if (idxRef.current > 0) void playAt(idxRef.current - 1)
  }, [playAt])

  // Restart the current track from the top: replaying the current index re-evaluates
  // (stop -> start), which resets Strudel's scheduler to cycle 0, resets our advance
  // clock, and resumes if paused — exactly playAt's contract. Warmup/viz re-sets are no-ops.
  const restartSong = useCallback(() => playAt(idxRef.current), [playAt])

  // On start, seed the queue from the server's persisted song log (SQLite), oldest →
  // newest, so the list reads chronologically and new songs naturally extend the end.
  useEffect(() => {
    if (!started) return
    let cancelled = false
    fetch('/api/beats/history?limit=500')
      .then((r) => r.json())
      .then((songs: BeatsSong[]) => {
        if (cancelled || !Array.isArray(songs)) return
        setList([...songs].reverse()) // endpoint returns newest-first; we want chronological
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [started, setList])

  // SSE feed: a newly-posted song appends to the end of the queue (plain FIFO).
  // Dedupe by id (the server mints one before broadcasting) — covers the SSE/history
  // overlap without treating code content as identity.
  useEffect(() => {
    if (!started) return
    const es = new EventSource('/api/beats/stream')
    es.addEventListener('song', (e) => {
      try {
        const song = JSON.parse((e as MessageEvent).data) as BeatsSong
        const list = queueRef.current
        if (song.id != null && list.some((s) => s.id === song.id)) return
        setList([...list, song])
        // warm the new arrival's samples right away, so it plays clean whenever it comes up
        adapterRef.current?.warmup(song.code)
      } catch {
        /* ignore malformed */
      }
    })
    // a song deleted on the server (DELETE /api/beats/:id) drops out of the queue live
    es.addEventListener('unsong', (e) => {
      try {
        const { id } = JSON.parse((e as MessageEvent).data) as { id: number }
        const list = queueRef.current
        if (!list.some((s) => s.id === id)) return
        // preserve the currently-playing song's position across the removal
        const current = idxRef.current >= 0 ? list[idxRef.current] : null
        const next = list.filter((s) => s.id !== id)
        const newIdx = current ? next.indexOf(current) : idxRef.current
        // if the current song itself was deleted (indexOf -> -1), clamp into range; the
        // engine keeps playing its audio until the next cycle-boundary advance
        setIndex(newIdx >= 0 ? newIdx : Math.min(idxRef.current, next.length - 1))
        setList(next)
      } catch {
        /* ignore malformed */
      }
    })
    return () => es.close()
  }, [started, setList, setIndex])

  // Advance on the cycle boundary after the current song's `cycles`, tracking progress
  // for the LED strip. Also kicks off playback once the engine is ready and the queue
  // has something to play.
  useEffect(() => {
    if (!started) return
    const id = setInterval(() => {
      const adapter = adapterRef.current
      const ctx = adapter?.getAudioContext()
      if (!adapter || !ctx) return
      const list = queueRef.current
      if (idxRef.current < 0) {
        // in-flight guard: playAt awaits before idxRef updates, so without it the next
        // 250ms tick would start the first song twice
        if (list.length && !playInFlightRef.current) {
          // a /?song=<id> permalink starts the radio on that song; otherwise the top
          const linked = PERMALINK_SONG_ID != null ? list.findIndex((s) => s.id === PERMALINK_SONG_ID) : -1
          void playAt(linked >= 0 ? linked : 0)
        }
        return
      }
      const current = list[idxRef.current]
      if (!current) return
      const cyclesElapsed = (ctx.currentTime - startTimeRef.current) * cpsRef.current
      const target = current.cycles ?? DEFAULT_CYCLES
      setProgress(Math.min(1, cyclesElapsed / target))
      if (cyclesElapsed >= target && !gapTimerRef.current) {
        // one console line per track change — if the radio ever advances at the wrong
        // time, this shows the clock state that did it
        console.warn(
          `[beats] auto-advance idx=${idxRef.current} elapsed=${cyclesElapsed.toFixed(1)} target=${target} cps=${cpsRef.current} now=${ctx.currentTime.toFixed(1)} start=${startTimeRef.current.toFixed(1)}`,
        )
        void advance({ gap: true })
      }
    }, 250)
    return () => clearInterval(id)
  }, [started, playAt, advance])

  // Once playback is up, gradually warm every queued song's samples (the sound palette is
  // small, so this settles after a few MB) — jumps anywhere in the queue then land warm.
  const engineLive = started && currentIdx >= 0
  useEffect(() => {
    if (!engineLive) return
    let i = 0
    const id = setInterval(() => {
      const adapter = adapterRef.current
      const list = queueRef.current
      if (!adapter || i >= list.length) {
        clearInterval(id)
        return
      }
      adapter.warmup(list[i].code)
      i++
    }, 2000)
    return () => clearInterval(id)
  }, [engineLive])

  // Keep the playing row in view as the radio walks the queue.
  useEffect(() => {
    if (currentIdx < 0) return
    document.getElementById(`queue-row-${currentIdx}`)?.scrollIntoView({ block: 'nearest' })
  }, [currentIdx])

  return (
    <div className="relative h-screen overflow-hidden flex flex-col text-[#2d3748] font-mono" style={PAGE_BG}>
      {/* slim header: wordmark + ON AIR lamp on the left, drawer chips on the right */}
      <header className="flex items-center justify-between gap-3 px-4 h-12 shrink-0 bg-white/85 backdrop-blur-sm border-b border-[#acbed8] z-30">
        <div className="flex items-center gap-3 min-w-0">
          {/* the wordmark IS the on-air lamp: red while songs play, ink when paused/idle */}
          <span
            className={`font-bold tracking-[0.25em] text-sm uppercase leading-none transition-colors duration-300 ${
              playing && !paused ? 'text-[#de1a1a]' : ''
            }`}
          >
            beats
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQueueOpen((o) => !o)}
            aria-expanded={queueOpen}
            title="Show/hide the queue"
            className={`${CHIP_BTN} ${queueOpen ? 'border-[#de1a1a] text-[#de1a1a] bg-white' : 'border-[#acbed8] text-[#8595b5] hover:border-[#de1a1a] hover:text-[#de1a1a]'}`}
          >
            queue <span className="tabular-nums">({queue.length})</span>
          </button>
          <button
            onClick={() => setEngineOpen((o) => !o)}
            aria-expanded={engineOpen}
            title="Show/hide the live Strudel code"
            className={`${CHIP_BTN} ${engineOpen ? 'border-[#de1a1a] text-[#de1a1a] bg-white' : 'border-[#acbed8] text-[#8595b5] hover:border-[#de1a1a] hover:text-[#de1a1a]'}`}
          >
            strudel
          </button>
        </div>
      </header>

      {/* the stage: visualizer takes all free space, over a finer 6px grid that fades out */}
      <div className="relative flex-1 min-h-[160px]">
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={FINE_GRID} />
        <Visualizer
          audioContext={vizCtx}
          sourceNode={vizNode}
          isPlaying={playing && !paused}
          paused={paused}
          sizeClass="relative h-full w-full"
          seamless
          sub={6}
          idleAnimation={false}
        />
      </div>

      {/* now playing — the centered marquee under the stage */}
      {started && (
        <section className="shrink-0 border-t border-[#acbed8] bg-white/90 backdrop-blur-sm">
          {/* song progress — full width, directly under the visualizer */}
          <div className="h-[4px] bg-[#eef1f8]" title="progress through this song">
            <div
              className="h-full bg-[#de1a1a] transition-[width] duration-300 ease-linear"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="flex flex-col items-center text-center gap-3 px-6 pt-4 pb-6">
            {nowPlaying ? (
              <>
                <h1
                  className={`font-song font-normal text-3xl sm:text-5xl leading-tight max-w-full break-words px-2 ${
                    textExpanded ? '' : 'line-clamp-2 sm:line-clamp-1'
                  }`}
                >
                  {nowPlaying.title ?? '(untitled)'}
                </h1>
                {(nowPlaying.genre || nowPlaying.mood) && (
                  // tapping the description lifts the clamps (title too) to read the full copy
                  <button
                    type="button"
                    onClick={() => setTextExpanded((e) => !e)}
                    aria-expanded={textExpanded}
                    title={textExpanded ? 'Show less' : 'Show the full description'}
                    className={`max-w-2xl text-xs text-[#8595b5] text-balance cursor-pointer transition-colors hover:text-[#5b6b8c] ${
                      textExpanded ? '' : 'line-clamp-2'
                    }`}
                  >
                    {[nowPlaying.genre, nowPlaying.mood].filter(Boolean).join(' · ')}
                  </button>
                )}
                {(nowPlaying.author || nowPlaying.model) && (
                  <div className="truncate max-w-full text-[11px] text-[#acbed8]">
                    {[nowPlaying.author ? `by ${nowPlaying.author}` : null, nowPlaying.model]
                      .filter(Boolean)
                      .join(' · ')}
                  </div>
                )}
                <div className="flex items-center gap-3 mt-1">
                  <button onClick={() => playPrev()} disabled={currentIdx <= 0} title="Previous song" className={DECK_BTN}>
                    {ICONS.prev}
                  </button>
                  <button onClick={() => void restartSong()} disabled={!nowPlaying} title="Restart this song" className={DECK_BTN}>
                    {ICONS.restart}
                  </button>
                  <button
                    onClick={() => void togglePause()}
                    disabled={!nowPlaying}
                    title={paused ? 'Play' : 'Pause'}
                    className={DECK_BTN}
                  >
                    {paused ? ICONS.play : ICONS.pause}
                  </button>
                  <button onClick={() => void advance()} disabled={!nowPlaying} title="Next song" className={DECK_BTN}>
                    {ICONS.next}
                  </button>
                </div>
                {nowPlaying.id != null && (
                  <button
                    onClick={() => void shareSong()}
                    title="Copy a link to this song"
                    className="text-[11px] uppercase tracking-[0.2em] text-[#8595b5] hover:text-[#de1a1a] transition"
                  >
                    {shared ? '✓ link copied' : '↗ share song'}
                  </button>
                )}
              </>
            ) : (
              <div className="py-6 text-sm text-[#8595b5]">
                waiting for the first track — run <code>/beats &lt;theme&gt;</code>
              </div>
            )}
          </div>
        </section>
      )}

      {/* queue drawer — slides in from the left; the stage stays visible behind it */}
      <aside
        aria-hidden={!queueOpen}
        inert={!queueOpen}
        className={`fixed left-0 top-12 bottom-0 z-20 w-[min(420px,88vw)] flex flex-col bg-[#fbfcfe] border-r border-[#acbed8] shadow-xl transition-transform duration-300 ${
          queueOpen ? 'translate-x-0' : '-translate-x-[110%]'
        }`}
      >
        <div className="shrink-0 px-4 h-9 flex items-center justify-between bg-white/70 border-b border-[#dbe2ef]">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8595b5]">queue ({queue.length})</span>
          <button onClick={() => setQueueOpen(false)} title="Close the queue" className="text-[#8595b5] hover:text-[#de1a1a] transition text-sm leading-none">
            ✕
          </button>
        </div>
        {/* onPick must stay referentially stable (playAt is a stable useCallback) or the memo is defeated */}
        <QueueList queue={queue} currentIdx={currentIdx} started={started} onPick={playAt} />
      </aside>

      {/* engine drawer — slides up from the bottom. Code-split behind the Start click,
          then mounted forever, even with the drawer off-screen: StrudelHost owns the
          audio pipeline and must never unmount. */}
      <section
        aria-hidden={!engineOpen}
        inert={!engineOpen}
        className={`fixed inset-x-0 bottom-0 z-20 h-[46vh] flex flex-col bg-white border-t border-[#acbed8] shadow-[0_-4px_16px_rgba(45,55,72,0.12)] transition-transform duration-300 ${
          engineOpen ? 'translate-y-0' : 'translate-y-[110%]'
        }`}
      >
        <div className="shrink-0 px-4 h-9 flex items-center justify-between bg-white/70 border-b border-[#dbe2ef]">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8595b5]">strudel</span>
          <button onClick={() => setEngineOpen(false)} title="Close Strudel" className="text-[#8595b5] hover:text-[#de1a1a] transition text-sm leading-none">
            ✕
          </button>
        </div>
        <div className="relative flex-1 min-h-0 bg-white/85">
          {started && (
            <Suspense fallback={<EngineLoading />}>
              <StrudelHost onReady={onReady} onPlayingChange={setPlaying} />
            </Suspense>
          )}
        </div>
      </section>

      {/* Start overlay — the click both grants the audio gesture (sticky activation)
          and triggers the lazy engine chunk's download + mount */}
      {!started && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-5" style={PAGE_BG}>
          <div className="font-bold text-4xl sm:text-5xl uppercase tracking-[0.2em] leading-none">beats</div>
          <div aria-hidden className="flex gap-[3px]">
            {LED_RAMP.map((c) => (
              <span key={c} className="w-[7px] h-[7px]" style={{ backgroundColor: c }} />
            ))}
          </div>
          <button
            onClick={() => setStarted(true)}
            className="px-8 py-3 inline-flex items-center gap-2.5 bg-[#de1a1a] text-white font-semibold uppercase tracking-[0.15em] hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition shadow-sm"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M4 2l18 10L4 22z" />
            </svg>
            Start radio
          </button>
          <p className="text-[#acbed8] text-xs">
            click to enable audio · then run <code className="text-[#8595b5]">/beats &lt;theme&gt;</code>
          </p>
        </div>
      )}
    </div>
  )
}
