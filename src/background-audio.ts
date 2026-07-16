// Background playback on iOS.
//
// Two separate iOS behaviors stop the radio when the phone locks or the user switches
// apps, and this module works around both:
//
// 1. Safari only keeps a page's audio session alive in the background while an
//    <audio>/<video> element is audibly playing — a bare WebAudio graph gets its
//    AudioContext flipped to "interrupted" the moment the page leaves the foreground.
//    So on iOS the engine's master tap is routed into a MediaStreamAudioDestinationNode
//    feeding a hidden <audio> element instead of ctx.destination. Bonus: media-element
//    audio also plays with the ringer/silent switch on, which bare WebAudio does not.
//
// 2. Backgrounded pages get their main-thread timers throttled to >=1s. Strudel's clock
//    (zyklus) is a plain setInterval ticking every 100ms with only ~200ms of scheduling
//    lookahead, so throttling starves it and the music stutters into silence. Dedicated
//    Worker timers are exempt from that throttling, so the clock is driven from a tiny
//    inline worker instead (workerSetInterval/workerClearInterval, injected through
//    StrudelMirror -> repl -> Cyclist -> createClock, which all forward the overrides).

// iPadOS 13+ masquerades as macOS in the UA, but is the only "Mac" with multi-touch.
export const isIOS =
  typeof navigator !== 'undefined' &&
  (/iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.userAgent.includes('Mac') && navigator.maxTouchPoints > 1))

// A ~50-byte silent WAV: something the media element can audibly "play" during priming.
const SILENT_WAV =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA=='

let mediaEl: HTMLAudioElement | null = null

/**
 * Must be called synchronously inside the Start click. Creates the background <audio>
 * element and starts it on a silent loop while the engine chunk downloads — playing
 * within the user gesture "unlocks" the element, so the later srcObject swap and play()
 * (which happen outside any gesture) are allowed. iOS only; a no-op elsewhere.
 */
export function primeMediaElement(): void {
  if (!isIOS || mediaEl) return
  const el = document.createElement('audio')
  el.setAttribute('playsinline', '')
  el.loop = true
  el.src = SILENT_WAV
  el.style.display = 'none'
  document.body.appendChild(el)
  el.play().catch(() => {
    // gesture didn't take (very old iOS, odd embed context) — drop the element so
    // connectOutput falls back to the direct ctx.destination path
    el.remove()
    mediaEl = null
  })
  mediaEl = el
}

/**
 * Wire the engine's master tap to the speakers. On iOS with a primed media element the
 * tap goes tap -> MediaStreamAudioDestinationNode -> <audio>, which makes Safari treat
 * the page as a media player (background playback + lock-screen controls). Everywhere
 * else — or if stream playback is refused — it's the plain tap -> ctx.destination.
 * Never both: the stream path lags the direct path by its buffering, so doubling up
 * flanges.
 */
export function connectOutput(ctx: AudioContext, tap: AudioNode): void {
  const el = mediaEl
  if (!el) {
    tap.connect(ctx.destination)
    return
  }
  const dest = ctx.createMediaStreamDestination()
  tap.connect(dest)
  el.loop = false
  el.srcObject = dest.stream // srcObject takes priority over the silent-wav src
  el.play().catch((err) => {
    console.warn('[background-audio] stream playback refused, using direct output:', err)
    try {
      tap.disconnect(dest)
    } catch {
      /* already disconnected */
    }
    el.remove()
    mediaEl = null
    tap.connect(ctx.destination)
  })
}

/**
 * Keep the media element and the lock-screen playback state in step with the radio's
 * pause state (pausing only suspends the AudioContext, which just makes the stream go
 * silent — without this iOS would keep showing the lock screen as "playing").
 */
export function setMediaPaused(paused: boolean): void {
  if (mediaEl) {
    if (paused) mediaEl.pause()
    else mediaEl.play().catch(() => {})
  }
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = paused ? 'paused' : 'playing'
  }
}

// --- worker-driven timers -------------------------------------------------------------
// Interval timers that tick from a dedicated Worker (main-thread callbacks, worker-side
// scheduling), so they keep their cadence while the page is backgrounded. Falls back to
// the global timers if Worker construction fails; the fallback is all-or-nothing, so ids
// from workerSetInterval are always cleared by the matching path in workerClearInterval.

const WORKER_SRC = `
const timers = new Map();
onmessage = (e) => {
  const { type, id, ms } = e.data;
  if (type === 'set') timers.set(id, setInterval(() => postMessage(id), ms));
  else if (type === 'clear') { clearInterval(timers.get(id)); timers.delete(id); }
};
`

let worker: Worker | null = null
let workerFailed = false
let nextId = 1
const callbacks = new Map<number, () => void>()

function getWorker(): Worker | null {
  if (worker || workerFailed) return worker
  try {
    worker = new Worker(URL.createObjectURL(new Blob([WORKER_SRC], { type: 'application/javascript' })))
    worker.onmessage = (e: MessageEvent<number>) => callbacks.get(e.data)?.()
  } catch (err) {
    console.warn('[background-audio] worker timer unavailable, using main-thread timers:', err)
    workerFailed = true
    worker = null
  }
  return worker
}

export function workerSetInterval(fn: () => void, ms: number): number {
  const w = getWorker()
  if (!w) return globalThis.setInterval(fn, ms) as unknown as number
  const id = nextId++
  callbacks.set(id, fn)
  w.postMessage({ type: 'set', id, ms })
  return id
}

export function workerClearInterval(id: number): void {
  if (!worker) {
    globalThis.clearInterval(id)
    return
  }
  callbacks.delete(id)
  worker.postMessage({ type: 'clear', id })
}
