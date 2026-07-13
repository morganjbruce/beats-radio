import { lazy, memo, Suspense, useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Visualizer } from './components'
import type { StrudelAdapter } from './components'
import type { BeatsSong } from './types'

// lazy so the Strudel/CodeMirror graph (>500kB) only downloads on the Start click; must
// import the file directly — the barrel would eagerly pull the module into the main chunk
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

const DECK_BTN =
  'w-10 h-10 shrink-0 border border-[#acbed8] bg-white text-base leading-none transition enabled:hover:border-[#de1a1a] enabled:hover:text-[#de1a1a] disabled:opacity-40'

const subtitle = (s: BeatsSong) =>
  [s.author ? `by ${s.author}` : null, s.genre, s.mood].filter(Boolean).join(' · ')

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
  // mobile: the engine panel is a bottom drawer (closed by default) so the queue gets
  // the screen; on lg+ it's always the open side panel. Once mounted (on Start) the
  // engine stays MOUNTED either way — StrudelHost owns the audio pipeline and must
  // never unmount; gating on `started` is safe because started never goes back to false.
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
  // playAt races with itself (awaits inside; callers include the 250ms interval, queue
  // clicks, next/restart): the seq token lets every new call supersede the in-flight
  // one — stale calls bail after each await instead of blocking newer ones, so a manual
  // pick can always override an in-flight auto-advance
  const playSeqRef = useRef(0)
  const playInFlightRef = useRef(false)

  const nowPlaying = queue[currentIdx] ?? null

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
      // the live scheduler knows the real tempo once run() has evaluated the song's
      // setcps(); the regex parse is only the fallback when it can't report one
      cpsRef.current = adapter.getCps() ?? parseCps(song.code)
      startTimeRef.current = ctx ? ctx.currentTime : 0
      if (ctx) setVizCtx(ctx)
      const out = adapter.getOutputNode()
      if (out) setVizNode(out)
      // preload the NEXT song's samples too, so the track change lands warm
      const upNext = queueRef.current[(index + 1) % queueRef.current.length]
      if (upNext && upNext !== song) adapter.warmup(upNext.code)
    } finally {
      // superseded calls leave the flag to the call that superseded them
      if (playSeqRef.current === seq) playInFlightRef.current = false
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
        // pause pressed during the gap: advancing would resume the ctx (playAt always
        // resumes), un-pausing without user intent. Bail instead — ctx.currentTime is
        // frozen while suspended, so the 250ms interval's cyclesElapsed stays past
        // target and it re-arms this advance once the user resumes.
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
      {/* slim header */}
      <header className="flex items-center justify-between px-4 h-12 shrink-0 bg-white/85 backdrop-blur-sm border-b border-[#acbed8]">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 bg-[#de1a1a] animate-pulse" />
          <span className="font-semibold tracking-[0.25em] text-xs uppercase">beats</span>
        </div>
      </header>

      {/* visualizer, over a finer 6px grid that dissolves down into the page's 12px grid */}
      <div className="relative shrink-0">
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={FINE_GRID} />
        <Visualizer
          audioContext={vizCtx}
          sourceNode={vizNode}
          isPlaying={playing && !paused}
          paused={paused}
          sizeClass="relative h-[33vh] w-full"
          seamless
          sub={6}
          idleAnimation={false}
        />
      </div>

      {/* transport deck — pinned; never scrolls away no matter how long the queue gets */}
      {started && (
        <div className="shrink-0 border-y border-[#acbed8] bg-white/90 backdrop-blur-sm">
          {/* song progress bar */}
          <div className="h-[4px] bg-[#eef1f8]" title="progress through this song">
            <div
              className="h-full bg-[#de1a1a] transition-[width] duration-300 ease-linear"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-2 px-3 h-16">
            <button
              onClick={() => void togglePause()}
              disabled={!nowPlaying}
              title={paused ? 'Play' : 'Pause'}
              className={DECK_BTN}
            >
              {paused ? '▶' : '⏸'}
            </button>
            <button onClick={() => void restartSong()} disabled={!nowPlaying} title="Restart this song" className={DECK_BTN}>
              ↻
            </button>
            <button onClick={() => void advance()} disabled={!nowPlaying} title="Next song" className={DECK_BTN}>
              ⏭
            </button>
            <div className="min-w-0 flex-1 pl-2">
              {nowPlaying ? (
                <>
                  <div className="truncate font-semibold leading-tight">
                    {nowPlaying.title ?? '(untitled)'}
                    {nowPlaying.id != null && (
                      <a
                        href={`?song=${nowPlaying.id}`}
                        title="Permalink — opens the radio starting on this song"
                        className="ml-2 font-normal text-[11px] text-[#acbed8] hover:text-[#de1a1a] transition"
                      >
                        [#{nowPlaying.id}]
                      </a>
                    )}
                  </div>
                  <div className="truncate text-[11px] text-[#8595b5] mt-0.5">{subtitle(nowPlaying)}</div>
                </>
              ) : (
                <div className="text-sm text-[#8595b5]">
                  waiting for the first track — run <code>/beats &lt;theme&gt;</code>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* body: the queue is the only thing that scrolls; the engine sits in its own panel */}
      <main className="flex-1 min-h-0 flex flex-col lg:flex-row">
        <section className="flex-1 lg:flex-none lg:w-[440px] min-h-0 flex flex-col border-b lg:border-b-0 lg:border-r border-[#acbed8]">
          <div className="shrink-0 px-4 h-9 flex items-center bg-white/70 border-b border-[#dbe2ef]">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8595b5]">queue ({queue.length})</span>
          </div>
          {/* onPick must stay referentially stable (playAt is a stable useCallback) or the memo is defeated */}
          <QueueList queue={queue} currentIdx={currentIdx} started={started} onPick={playAt} />
        </section>

        {/* Strudel engine — code-split behind the Start click (>500kB with CodeMirror),
            then kept mounted forever: `started` never reverts to false, so the audio
            pipeline the host owns can never be torn down by an unmount.
            On mobile it collapses to its header bar; tapping toggles the drawer. */}
        <section
          className={`${engineOpen ? 'h-56' : 'h-9'} lg:h-auto lg:flex-1 min-h-0 flex flex-col overflow-hidden transition-[height] duration-200`}
        >
          <button
            onClick={() => setEngineOpen((o) => !o)}
            aria-expanded={engineOpen}
            title="Show/hide the engine"
            className="shrink-0 px-4 h-9 flex items-center justify-between bg-white/70 border-b border-[#dbe2ef] text-left lg:pointer-events-none"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8595b5]">engine</span>
            <span aria-hidden className="lg:hidden text-[11px] text-[#8595b5]">{engineOpen ? '▾' : '▴'}</span>
          </button>
          <div className="flex-1 min-h-0 bg-white/85">
            {started && (
              <Suspense
                fallback={
                  <div className="h-full flex items-center justify-center bg-white/80">
                    <div className="text-[#acbed8] text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#de1a1a] animate-pulse" />
                      loading strudel...
                    </div>
                  </div>
                }
              >
                <StrudelHost onReady={onReady} onPlayingChange={setPlaying} />
              </Suspense>
            )}
          </div>
        </section>
      </main>

      {/* Start overlay — the click both grants the audio gesture (sticky activation)
          and triggers the lazy engine chunk's download + mount */}
      {!started && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3" style={PAGE_BG}>
          <button
            onClick={() => setStarted(true)}
            className="px-8 py-3 bg-[#de1a1a] text-white font-semibold uppercase tracking-[0.15em] hover:opacity-90 transition shadow-sm"
          >
            ▶ Start radio
          </button>
          <p className="text-[#acbed8] text-xs">
            click to enable audio · then run <code className="text-[#8595b5]">/beats &lt;theme&gt;</code>
          </p>
        </div>
      )}
    </div>
  )
}
