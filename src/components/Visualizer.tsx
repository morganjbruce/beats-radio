import { useRef, useEffect, useState, useCallback } from 'react'

interface VisualizerProps {
  audioContext: AudioContext | null
  sourceNode: AudioNode | null
  isPlaying: boolean
  /** Override the default height/sizing classes (e.g. for a full-width hero). */
  sizeClass?: string
  /** Blend into the page: no border/shadow, transparent panel (only lit LEDs draw). */
  seamless?: boolean
  /** Show the idle "scanner" animation when nothing is playing (default true). */
  idleAnimation?: boolean
  /** When paused, freeze the last frame (hold it on screen) instead of fading to blank. */
  paused?: boolean
  /** Internal render resolution per cell, in px (default 4). Set equal to the on-screen
   *  cell size for 1:1 crisp rendering where a near-full square can center on integers. */
  sub?: number
}

// Each LED cell is SUB x SUB canvas px (lit area SUB-1, 1px gap).
// 4px cells: small enough for a rich matrix, big enough to read as pixels.
const SUB = 4

const MODES = ['spectrum', 'mirror', 'scope', 'pixelfall', 'rain', 'tunnel', 'radial', 'outrun'] as const
type Mode = (typeof MODES)[number]

const PANEL = '#f4f6fc' // light screen background
const UNLIT = '#e2e7f2' // dormant LED (faintly visible against the panel)
const CAP = '#5b6b8c' // peak caps + standby scanner head
const SCAN_TAIL = '#c9d3e4' // standby scanner tail

// ---- palettes (quantized steps -- color comes from LUTs, never smooth gradients) ----
// Light-mode rule: ramps end dark/saturated, never pale -- pale tips vanish on a light panel.
// spectrum, bottom -> top: gold rising through the theme red into hot magenta
const HEAT = ['#d98e1f', '#f0a02e', '#f25c1f', '#de1a1a', '#b3123f', '#ff2e92']
// mirror, center -> edge: deep violet core exploding into pink and gold
const SYNTH = ['#2f1b69', '#6431c9', '#b148e8', '#ff4fd8', '#ff8a5c', '#e8a13c']
// scope, by distance from center line: deep teal core, hot pink extremes
const MIAMI = ['#0f6f7a', '#1b9aaa', '#3fd0d4', '#f25fd0', '#ff2e92']
// pixelfall, by loudness: faint slate through teal and green to hot pink
const AURORA = ['', '#b8c6dd', '#5b8bbf', '#1b9aaa', '#27a86b', '#e8a13c', '#f25c1f', '#ff2e92']
// rain, tail -> head: pale mist deepening to ink-navy (head darkest, so it pops on light)
const RAIN = ['#dcebf7', '#b7d4ee', '#8fb8e0', '#5fa8d8', '#2a6f97', '#123350']
const SPLASH = '#5fa8d8' // splash crowns where a drop hits the floor
// outrun: sega-sunset sun bands (horizon gold climbing into hot pink), ink silhouettes
const SUNSET = ['#e8a13c', '#f25c1f', '#de1a1a', '#ff2e92']
const OUTRUN_INK = '#123350' // road edges + palm trunks (ink-navy silhouette)
const OUTRUN_FROND = '#0f6f7a' // palm fronds (deep teal)
const OUTRUN_HORIZON = '#6431c9' // neon horizon line
// scene fills — light washes (background, so pale is correct here): sunset sky glowing
// up from the horizon, desert sand with darker scroll lines, cool asphalt road bed
const OUTRUN_SKY = ['#f7d9c2', '#f6e2d4', '#f2e9ec'] // horizon glow -> panel blue-white
const OUTRUN_SAND = '#eee4cf'
const OUTRUN_SAND_LINE = '#ddcfae'
const OUTRUN_ROAD = '#d5dcec'
// palm frond fans (offset from the crown, [dc, dr]) — constant, keyed by palm height
const FAN_BIG: [number, number][] = [[0, 1], [-1, 1], [1, 1], [-2, 0], [2, 0], [-3, -1], [3, -1], [-1, 2], [1, 2]]
const FAN_SMALL: [number, number][] = [[0, 1], [-1, 0], [1, 0], [-2, -1], [2, -1]]

const ramp = (palette: string[], f: number) =>
  palette[Math.min(palette.length - 1, Math.floor(f * palette.length))]

const TUNNEL_BANDS = 10 // spectrum bands cycled through the tunnel rings
const RADIAL_SPOKES = 48

const STOP_TAIL_MS = 2500
const PEAK_HOLD_MS = 420
const PEAK_FALL = 0.16
const MODE_KEY = 'vis-mode'

export function Visualizer({
  audioContext,
  sourceNode,
  isPlaying,
  sizeClass,
  seamless,
  idleAnimation,
  paused,
  sub: subProp,
}: VisualizerProps) {
  const seamlessRef = useRef(seamless)
  const idleAnimationRef = useRef(idleAnimation)
  const pausedRef = useRef(paused)
  // keep refs current for the async draw loop without touching them during render
  useEffect(() => {
    seamlessRef.current = seamless
    idleAnimationRef.current = idleAnimation
    pausedRef.current = paused
  }, [seamless, idleAnimation, paused])
  const sub = subProp ?? SUB // internal canvas px per cell
  const cellPx = sub // on-screen size of one LED cell
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)

  const [grid, setGrid] = useState<{ cols: number; rows: number }>({ cols: 0, rows: 0 })
  const [mode, setMode] = useState<Mode>(() => {
    const saved = localStorage.getItem(MODE_KEY)
    return (MODES as readonly string[]).includes(saved ?? '') ? (saved as Mode) : 'spectrum'
  })

  // mutable per-frame state, outside React
  const drawRef = useRef({
    freq: new Uint8Array(0),
    wave: new Uint8Array(0),
    peaks: new Float32Array(0),
    peakHold: new Float32Array(0),
    fall: new Uint8Array(0),
    drops: [] as { c: number; y: number; spd: number; len: number }[],
    splashes: [] as { c: number; ttl: number }[],
    puddle: new Float32Array(0),
    rad: new Float32Array(0), // per-cell circular radius from center (cells), for tunnel
    eRad: new Float32Array(0), // per-cell normalized elliptical radius (1.0 at panel edges), for radial
    eAng: new Float32Array(0), // per-cell normalized angle, 0..1, for radial
    tunnelBands: new Float32Array(0), // scratch: tunnel spectrum bands (avoids per-frame alloc)
    spokes: new Float32Array(0), // scratch: radial petal lengths (avoids per-frame alloc)
    zoom: 0, // tunnel ring offset
    spin: 0, // radial rotation
    roadZ: 0, // outrun: centerline dash scroll
    palms: [] as { z: number; side: number }[], // outrun: nearness 0 (horizon) -> 1 (windshield)
    // outrun road geometry, precomputed per scanline in the resize effect (pure fn of grid):
    roadLe: new Int16Array(0), // left edge column
    roadRe: new Int16Array(0), // right edge column
    roadDX2: new Float32Array(0), // (world distance) * 2, for the scroll phase
    roadFlags: new Uint8Array(0), // bit0: near-field (double edge); bit1: very near (widen dash)
    roadHalf: 0, // near-field road half-width (cells) — shared with the palm shoulders
    tick: 0,
    bassEma: 0,
    flash: 0,
    stoppedAt: 0,
    unlitGrid: null as HTMLCanvasElement | null,
  })
  const playingRef = useRef(isPlaying)
  const modeRef = useRef<Mode>(mode)

  // audio tap: outputGain -> analyser (dead-end, not in the signal path)
  useEffect(() => {
    if (!audioContext || !sourceNode) return
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 4096
    analyser.smoothingTimeConstant = 0.8
    sourceNode.connect(analyser)
    analyserRef.current = analyser
    const d = drawRef.current
    d.freq = new Uint8Array(analyser.frequencyBinCount)
    d.wave = new Uint8Array(analyser.fftSize)
    return () => {
      try {
        sourceNode.disconnect(analyser)
      } catch {
        /* already torn down */
      }
      analyserRef.current = null
    }
  }, [audioContext, sourceNode])

  useEffect(() => {
    if (playingRef.current && !isPlaying) drawRef.current.stoppedAt = performance.now()
    playingRef.current = isPlaying
  }, [isPlaying])

  useEffect(() => {
    modeRef.current = mode
    localStorage.setItem(MODE_KEY, mode)
  }, [mode])

  // derive the LED grid from container size
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const measure = () => {
      // ceil: fill the container completely; the sub-cell overflow is clipped (top/right,
      // since the canvas is anchored bottom-left) so no dead strip shows under the bars.
      const cols = Math.max(16, Math.ceil(el.clientWidth / cellPx))
      const rows = Math.max(8, Math.ceil(el.clientHeight / cellPx))
      setGrid(g => (g.cols === cols && g.rows === rows ? g : { cols, rows }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [cellPx])

  // (re)allocate buffers + pre-render the dormant grid on resize
  useEffect(() => {
    const { cols, rows } = grid
    if (!cols || !rows) return
    const d = drawRef.current
    d.peaks = new Float32Array(cols)
    d.peakHold = new Float32Array(cols)
    d.fall = new Uint8Array(cols * rows)
    d.drops = []
    d.splashes = []
    d.puddle = new Float32Array(cols)
    d.rad = new Float32Array(cols * rows)
    d.eRad = new Float32Array(cols * rows)
    d.eAng = new Float32Array(cols * rows)
    d.tunnelBands = new Float32Array(TUNNEL_BANDS)
    d.spokes = new Float32Array(RADIAL_SPOKES / 2)
    const cx = (cols - 1) / 2
    const cy = (rows - 1) / 2
    // radial uses normalized ELLIPTICAL coords: radius hits 1.0 at every panel edge, so the
    // flower stretches horizontally and fills the full width instead of a height-bound circle
    const ix = 1 / (cols * 0.5)
    const iy = 1 / (rows * 0.5)
    for (let c = 0; c < cols; c++)
      for (let r = 0; r < rows; r++) {
        const i = c * rows + r
        d.rad[i] = Math.hypot(c - cx, r - cy)
        const nx = (c - cx) * ix
        const ny = (r - cy) * iy
        d.eRad[i] = Math.hypot(nx, ny)
        d.eAng[i] = Math.atan2(ny, nx) / (2 * Math.PI) + 0.5
      }
    // outrun road: edge columns, scroll distance, and near-field flags per scanline are pure
    // functions of grid size, so compute them once here instead of every animation frame.
    const hor = Math.floor(rows * 0.55)
    // near-field half-width: 30% of the panel on landscape, widening toward 44% as the
    // panel goes portrait — a fixed 0.3 reads pinched when cols are scarce (mobile)
    const roadHalfNear = cols * Math.min(0.44, Math.max(0.3, 0.3 * (rows / cols)))
    d.roadHalf = roadHalfNear
    d.roadLe = new Int16Array(rows)
    d.roadRe = new Int16Array(rows)
    d.roadDX2 = new Float32Array(rows)
    d.roadFlags = new Uint8Array(rows)
    for (let r = 0; r < hor; r++) {
      const z = (hor - r) / hor // nearness: 1 at the bottom edge, 0 at the horizon
      const half = Math.max(1, roadHalfNear * Math.pow(z, 1.2))
      d.roadLe[r] = Math.round(cx - half)
      d.roadRe[r] = Math.round(cx + half)
      d.roadDX2[r] = (1 / Math.max(0.04, z)) * 2
      d.roadFlags[r] = (z > 0.55 ? 1 : 0) | (z > 0.7 ? 2 : 0)
    }
    const off = document.createElement('canvas')
    off.width = cols * sub
    off.height = rows * sub
    const octx = off.getContext('2d')
    if (octx) {
      octx.fillStyle = PANEL
      octx.fillRect(0, 0, off.width, off.height)
      octx.fillStyle = UNLIT
      for (let c = 0; c < cols; c++)
        for (let r = 0; r < rows; r++) octx.fillRect(c * sub, r * sub, sub - 1, sub - 1)
    }
    d.unlitGrid = off
  }, [grid, sub])

  // render loop
  useEffect(() => {
    const { cols, rows } = grid
    const canvas = canvasRef.current
    if (!cols || !rows || !canvas) return
    canvas.width = cols * sub
    canvas.height = rows * sub
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Lit-square geometry. Default: a (sub-1) square at the cell's top-left (gap on
    // right/bottom). Seamless: inset 1px so the square fills the box interior between the
    // page grid's 1px borders — centered, near-full, and crisp (integer coords; with sub
    // = on-screen cell px the canvas renders 1:1, so no fractional anti-aliasing).
    const ledInset = seamlessRef.current ? 1 : 0
    const ledSize = sub - 1
    // fillStyle assignment is comparatively expensive and long runs of cells share a color
    // (outrun sky/road, tunnel rings), so skip it when the color is unchanged. Reset the
    // cache at the start of every frame in case anything else touched ctx.fillStyle.
    let lastFill = ''
    const cell = (c: number, r: number, color: string) => {
      // r counts from the bottom
      if (color !== lastFill) {
        ctx.fillStyle = color
        lastFill = color
      }
      ctx.fillRect(c * sub + ledInset, (rows - 1 - r) * sub + ledInset, ledSize, ledSize)
    }

    const binRange = (t0: number, t1: number, binCount: number): [number, number] => {
      const minB = 2
      const maxB = Math.floor(binCount * 0.72)
      const b0 = Math.floor(minB * Math.pow(maxB / minB, t0))
      const b1 = Math.max(b0 + 1, Math.floor(minB * Math.pow(maxB / minB, t1)))
      return [b0, Math.min(b1, binCount)]
    }

    const magnitude = (freq: Uint8Array, t0: number, t1: number) => {
      const [b0, b1] = binRange(t0, t1, freq.length)
      let sum = 0
      for (let b = b0; b < b1; b++) sum += freq[b]
      let v = sum / (b1 - b0) / 255
      v *= 0.7 + 0.6 * t0
      return Math.min(1, v)
    }

    // beats flash the caps near-black -- white would vanish on a light panel
    const capColor = (d: typeof drawRef.current) => (d.flash > 0 ? '#14161f' : CAP)

    const overallEnergy = (d: typeof drawRef.current) => {
      let e = 0
      for (let b = 2; b < 42; b++) e += d.freq[b]
      return e / (40 * 255)
    }

    const bassEnergy = (freq: Uint8Array) => {
      let bass = 0
      for (let b = 2; b < 14; b++) bass += freq[b]
      return bass / (12 * 255)
    }

    const drawSpectrum = (d: typeof drawRef.current, now: number) => {
      for (let c = 0; c < cols; c++) {
        const v = magnitude(d.freq, c / cols, (c + 1) / cols)
        const h = Math.round(v * rows)
        for (let r = 0; r < h; r++) cell(c, r, ramp(HEAT, r / rows))
        if (h >= d.peaks[c]) {
          d.peaks[c] = h
          d.peakHold[c] = now + PEAK_HOLD_MS
        } else if (now > d.peakHold[c]) {
          d.peaks[c] = Math.max(0, d.peaks[c] - PEAK_FALL)
        }
        const cap = Math.ceil(d.peaks[c]) - 1
        if (cap >= h && cap >= 0) cell(c, cap, capColor(d))
      }
    }

    const drawMirror = (d: typeof drawRef.current) => {
      const half = rows / 2
      for (let c = 0; c < cols; c++) {
        const v = magnitude(d.freq, c / cols, (c + 1) / cols)
        const h = Math.round(v * half) + (d.flash > 0 && v > 0.4 ? 1 : 0)
        for (let i = 0; i < h; i++) {
          const color = ramp(SYNTH, i / half)
          const up = Math.floor(half) + i
          const down = Math.ceil(half) - 1 - i
          if (up < rows) cell(c, up, color)
          if (down >= 0) cell(c, down, color)
        }
      }
    }

    const drawScope = (d: typeof drawRef.current) => {
      const half = Math.floor(d.wave.length / 2)
      let prevY = -1
      for (let c = 0; c < cols; c++) {
        const idx = Math.floor((c / cols) * (half - 1))
        const y = Math.round((rows - 1) * (d.wave[idx] / 255))
        const from = prevY < 0 ? y : Math.min(prevY, y)
        const to = prevY < 0 ? y : Math.max(prevY, y)
        for (let r = from; r <= to; r++) {
          const dist = Math.abs(r - (rows - 1) / 2) / (rows / 2)
          cell(c, r, ramp(MIAMI, Math.min(0.999, dist)))
        }
        prevY = y
      }
    }

    const drawPixelfall = (d: typeof drawRef.current) => {
      if (d.tick % 2 === 0) {
        d.fall.copyWithin(0, rows)
        const base = (cols - 1) * rows
        for (let r = 0; r < rows; r++) {
          const v = magnitude(d.freq, r / rows, (r + 1) / rows)
          d.fall[base + r] = v < 0.15 ? 0 : Math.min(AURORA.length - 1, Math.ceil(v * (AURORA.length - 1)))
        }
      }
      for (let c = 0; c < cols; c++)
        for (let r = 0; r < rows; r++) {
          const p = d.fall[c * rows + r]
          if (p > 0) cell(c, r, AURORA[p])
        }
    }

    const drawRain = (d: typeof drawRef.current) => {
      // physics at half frame-rate so drops read as discrete LED motion
      if (d.tick % 2 === 0) {
        // spawn: ambient drizzle scaled by overall energy, downpour bursts on beats
        const energy = overallEnergy(d)
        const spawn = Math.min(
          cols >> 2,
          Math.round(energy * energy * cols * 0.15) +
            (d.flash > 0 ? Math.round(cols * 0.06) : 0) +
            (energy > 0.05 ? 1 : 0),
        )
        for (let i = 0; i < spawn && d.drops.length < 500; i++) {
          const c = Math.floor(Math.random() * cols)
          const v = magnitude(d.freq, c / cols, (c + 1) / cols)
          d.drops.push({
            c,
            y: rows - 1 + Math.random() * 6,
            spd: 0.7 + v * 1.6 + Math.random() * 0.5,
            len: 4 + Math.round(v * 6),
          })
        }
        // fall; landing on the floor throws a splash and tops up the puddle
        for (const drop of d.drops) {
          const wasAbove = drop.y >= 0
          drop.y -= drop.spd
          if (wasAbove && drop.y < 0) {
            d.splashes.push({ c: drop.c, ttl: 5 })
            d.puddle[drop.c] = Math.min(1, d.puddle[drop.c] + 0.45)
            if (drop.c > 0) d.puddle[drop.c - 1] = Math.min(1, d.puddle[drop.c - 1] + 0.18)
            if (drop.c < cols - 1) d.puddle[drop.c + 1] = Math.min(1, d.puddle[drop.c + 1] + 0.18)
          }
        }
        d.drops = d.drops.filter(drop => drop.y > -8)
        for (const s of d.splashes) s.ttl--
        d.splashes = d.splashes.filter(s => s.ttl > 0)
        for (let c = 0; c < cols; c++) d.puddle[c] *= 0.93
      }
      // the floor holds water: a puddle row that glows where drops land and slowly drains
      for (let c = 0; c < cols; c++) {
        const p = d.puddle[c]
        if (p > 0.06) {
          cell(c, 0, ramp(RAIN, Math.min(0.999, 0.35 + p * 0.6)))
          if (p > 0.55) cell(c, 1, ramp(RAIN, p * 0.5))
        }
      }
      // splash crowns kick outward from the impact point
      for (const s of d.splashes) {
        const spread = s.ttl > 3 ? 1 : 2
        if (s.c - spread >= 0) cell(s.c - spread, 1, SPLASH)
        if (s.c + spread < cols) cell(s.c + spread, 1, SPLASH)
        if (s.ttl > 3) cell(s.c, 2, ramp(RAIN, 0.7))
      }
      // streaks: trail fades upward, head darkest (ink on the light panel; beats flash it black)
      for (const drop of d.drops) {
        const head = Math.round(drop.y)
        for (let i = drop.len; i >= 1; i--) {
          const r = head + i
          if (r >= 0 && r < rows) cell(drop.c, r, ramp(RAIN, Math.max(0, 1 - i / drop.len) * 0.75))
        }
        if (head >= 0 && head < rows) cell(drop.c, head, d.flash > 0 ? '#14161f' : RAIN[RAIN.length - 1])
      }
    }

    // zooming tunnel: concentric rings race outward on bass, each ring lit by one spectrum band
    const drawTunnel = (d: typeof drawRef.current) => {
      d.zoom += 0.12 + bassEnergy(d.freq) * 0.9
      const RING_W = 3 // cells per ring
      const NB = TUNNEL_BANDS
      const bands = d.tunnelBands
      bands.fill(0)
      for (let b = 0; b < NB; b++) bands[b] = magnitude(d.freq, b / NB, (b + 1) / NB)
      for (let c = 0; c < cols; c++)
        for (let r = 0; r < rows; r++) {
          const i = c * rows + r
          const ring = Math.floor((d.rad[i] - d.zoom) / RING_W)
          const band = ((ring % NB) + NB) % NB
          const v = bands[band]
          // quiet bands leave gaps between rings (that's the depth); each ring keeps a
          // stable color from its band, so distinct multicolor rings race outward
          if (v > 0.24) cell(c, r, ramp(MIAMI, (band + 0.5) / NB))
        }
    }

    // radial kaleidoscope: two counter-rotating spectrum flowers, hue wheeling around the
    // circle, hot petal tips, beat-synced spin kicks and length bursts
    const drawRadial = (d: typeof drawRef.current) => {
      const SPOKES = RADIAL_SPOKES
      const HALF = SPOKES / 2
      if (d.flash === 5) d.spin += 0.02 // beat: a visible kick in the rotation
      d.spin += 0.002 + bassEnergy(d.freq) * 0.014
      const boost = d.flash > 0 ? 1.18 : 1 // beats throw the petals outward
      const spokes = d.spokes // petal lengths, normalized 0..1
      spokes.fill(0)
      for (let k = 0; k < HALF; k++) {
        const v = magnitude(d.freq, k / HALF, (k + 1) / HALF)
        spokes[k] = Math.min(1, Math.pow(v, 1.3) * 1.35 * boost) // sharpened, scaled so loud spokes reach the edges
      }
      // elliptical radius + angle come from the resize-time LUTs (d.eRad / d.eAng): the
      // flower's radius hits 1.0 at every panel edge, so it fills the full width
      for (let c = 0; c < cols; c++)
        for (let r = 0; r < rows; r++) {
          const i = c * rows + r
          const rn = d.eRad[i]
          if (rn > 1) continue
          const rawA = d.eAng[i]
          const a = (rawA + d.spin) % 1
          const k = Math.floor(a * SPOKES)
          const km = k < HALF ? k : SPOKES - 1 - k // mirror for symmetry
          // outer flower: petals with unlit gaps; hue rotates around AND against the spin
          if (k % 2 === 0 && rn <= spokes[km]) {
            const f = rn / Math.max(0.02, spokes[km])
            if (f > 0.78) cell(c, r, d.flash > 0 ? '#14161f' : '#ff2e92') // hot tips, black on beats
            else cell(c, r, ramp(SYNTH, (k / SPOKES + d.spin * 2.5) % 1))
            continue
          }
          // inner counter-rotating flower, half scale — kaleidoscope depth in the gaps
          const a2 = (1 - rawA + d.spin * 1.6) % 1
          const k2 = Math.floor(a2 * SPOKES)
          const km2 = k2 < HALF ? k2 : SPOKES - 1 - k2
          const len2 = spokes[km2] * 0.45
          if (k2 % 2 === 0 && rn <= len2)
            cell(c, r, ramp(MIAMI, Math.min(0.999, rn / Math.max(0.02, len2))))
        }
      if (d.flash > 0) cell(Math.floor(cols / 2), Math.floor(rows / 2), '#14161f')
    }

    // sega-outrun desert drive: banded sunset sun on the horizon, spectrum dunes, a
    // perspective road whose dashes race toward the windshield at song-energy speed,
    // and pixel palms streaming past on both shoulders
    const drawOutrun = (d: typeof drawRef.current) => {
      const energy = overallEnergy(d)
      const bass = bassEnergy(d.freq)
      const hor = Math.floor(rows * 0.55) // horizon row (from the bottom)
      const cx = (cols - 1) / 2
      d.roadZ += 0.08 + energy * 0.55 // cruise speed follows the song

      // sky: sunset wash glowing up from the horizon, filled to the top edge
      // (sun + dunes paint over it; the topmost tint is near-panel so it stays soft)
      for (let r = hor + 1; r < rows; r++) {
        const f = (r - hor) / (rows - hor)
        const tint = OUTRUN_SKY[f < 0.35 ? 0 : f < 0.7 ? 1 : 2]
        for (let c = 0; c < cols; c++) cell(c, r, tint)
      }

      // sun: half-disc resting on the horizon, scanline slits low, bass swells it
      const sunR = rows * 0.34 * (1 + bass * 0.12) + (d.flash > 0 ? 1 : 0)
      for (let r = hor; r < rows; r++) {
        const dy = r - hor
        if (dy >= sunR) break
        const f = dy / sunR
        if (f < 0.45 && dy % 2 === 0) continue // the classic slit bands near the base
        const half = Math.sqrt(sunR * sunR - dy * dy)
        for (let c = Math.max(0, Math.ceil(cx - half)); c <= Math.min(cols - 1, Math.floor(cx + half)); c++)
          cell(c, r, ramp(SUNSET, Math.min(0.999, f)))
      }

      // dunes: a low spectrum-driven skyline silhouetted over the sun
      for (let c = 0; c < cols; c++) {
        const v = magnitude(d.freq, c / cols, (c + 1) / cols)
        const h = Math.round(Math.pow(v, 1.4) * rows * 0.14)
        for (let r = hor + 1; r <= Math.min(rows - 1, hor + h); r++) cell(c, r, CAP)
      }
      for (let c = 0; c < cols; c++) cell(c, hor, OUTRUN_HORIZON) // neon horizon line

      // ground + road: desert sand with perspective scroll lines either side of a solid
      // asphalt bed; edges converge on the vanishing point, dashes flow toward the viewer
      const roadHalfNear = d.roadHalf // palm shoulders track the (aspect-aware) road width
      const ctr = Math.round(cx)
      const dash = d.flash > 0 ? '#14161f' : '#d98e1f'
      for (let r = 0; r < hor; r++) {
        const le = d.roadLe[r]
        const re = d.roadRe[r]
        const flags = d.roadFlags[r]
        const phase = Math.floor(d.roadDX2[r] - d.roadZ)
        // desert floor: sand wash with darker lines racing by (same scroll as the dashes)
        const sand = phase % 4 === 0 ? OUTRUN_SAND_LINE : OUTRUN_SAND
        for (let c = 0; c < Math.min(le, cols); c++) cell(c, r, sand)
        for (let c = Math.max(re + 1, 0); c < cols; c++) cell(c, r, sand)
        // asphalt bed between the edges
        for (let c = Math.max(0, le + 1); c <= Math.min(cols - 1, re - 1); c++) cell(c, r, OUTRUN_ROAD)
        if (le >= 0) cell(le, r, OUTRUN_INK)
        if (re < cols) cell(re, r, OUTRUN_INK)
        if (flags & 1) {
          // near-field: double-width edges so the road reads solid at the windshield
          if (le - 1 >= 0) cell(le - 1, r, OUTRUN_INK)
          if (re + 1 < cols) cell(re + 1, r, OUTRUN_INK)
        }
        if (phase % 2 === 0) {
          // dashed centerline — highway-paint gold, flashing ink on beats
          cell(ctr, r, dash)
          if (flags & 2) cell(ctr - 1, r, dash)
        }
      }

      // palms: spawn at the horizon, accelerate past the shoulders
      if (d.palms.length < 7 && !d.palms.some(p => p.z < 0.14))
        d.palms.push({ z: 0.05, side: Math.random() < 0.5 ? -1 : 1 })
      for (const p of d.palms) p.z += (0.0025 + energy * 0.011) * (0.25 + p.z * 1.6)
      d.palms = d.palms.filter(p => p.z < 1.25)
      for (const p of d.palms) {
        const zc = Math.min(1, p.z)
        const rb = Math.round(hor * (1 - zc)) // base row
        const half = roadHalfNear * Math.pow(zc, 1.2)
        const px = Math.round(cx + p.side * (half + 3 + zc * 7))
        if (px < -3 || px > cols + 2) continue
        const hgt = Math.max(2, Math.round(zc * rows * 0.4))
        for (let r = rb; r <= Math.min(rows - 1, rb + hgt); r++)
          if (px >= 0 && px < cols) cell(px, r, OUTRUN_INK)
        // fronds fan out from the crown, drooping at the tips; bigger palm, wider fan
        const rt = rb + hgt
        const fan = hgt >= 5 ? FAN_BIG : FAN_SMALL
        for (const [dc, dr] of fan) {
          const c = px + dc
          const r = rt + dr
          if (c >= 0 && c < cols && r >= 0 && r < rows) cell(c, r, OUTRUN_FROND)
        }
      }
    }

    // mode -> painter; normalized to (d, now) so the frame loop is a single lookup.
    // scope is the one mode that needs time-domain data, so it fetches its own.
    const painters: Record<Mode, (d: typeof drawRef.current, now: number) => void> = {
      spectrum: drawSpectrum,
      mirror: drawMirror,
      scope: d => {
        analyserRef.current?.getByteTimeDomainData(d.wave)
        drawScope(d)
      },
      pixelfall: drawPixelfall,
      rain: drawRain,
      tunnel: drawTunnel,
      radial: drawRadial,
      outrun: drawOutrun,
    }

    const drawIdle = (now: number) => {
      const period = cols * 24
      const t = (now % (2 * period)) / period
      const pos = t < 1 ? t * (cols - 1) : (2 - t) * (cols - 1)
      const head = Math.round(pos)
      const dir = t < 1 ? 1 : -1
      const midRow = Math.floor(rows / 2)
      for (let i = 3; i >= 1; i--) {
        const c = head - dir * i
        if (c >= 0 && c < cols) cell(c, midRow, SCAN_TAIL)
      }
      cell(Math.max(0, Math.min(cols - 1, head)), midRow, CAP)
    }

    let raf = 0
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      // While paused, freeze: leave the last painted frame on the canvas (don't clear/redraw)
      // so the visualization stays put instead of fading to blank.
      if (pausedRef.current) return
      const d = drawRef.current
      const analyser = analyserRef.current
      d.tick++
      lastFill = '' // fillStyle cache: assume nothing about ctx state across frames
      // seamless: clear to transparent so the page shows through and only lit LEDs draw;
      // otherwise paint the dormant LED panel.
      if (seamlessRef.current) ctx.clearRect(0, 0, canvas.width, canvas.height)
      else if (d.unlitGrid) ctx.drawImage(d.unlitGrid, 0, 0)
      const active = playingRef.current || now - d.stoppedAt < STOP_TAIL_MS
      if (analyser && active) {
        analyser.getByteFrequencyData(d.freq)
        // beat detector: bass energy spiking above its own rolling average
        const bass = bassEnergy(d.freq)
        d.bassEma = d.bassEma === 0 ? bass : d.bassEma * 0.95 + bass * 0.05
        if (bass > 0.3 && bass > d.bassEma * 1.35 && d.flash <= 0) d.flash = 5
        else if (d.flash > 0) d.flash--

        painters[modeRef.current](d, now)
      } else if (idleAnimationRef.current !== false) {
        drawIdle(now)
      }
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [grid, sub])

  const cycleMode = useCallback(() => {
    setMode(m => MODES[(MODES.indexOf(m) + 1) % MODES.length])
  }, [])

  return (
    <section
      role="button"
      tabIndex={0}
      aria-label={`Music visualizer (${mode} mode) — click to change mode`}
      title="Click to change visualization"
      onClick={cycleMode}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          cycleMode()
        }
      }}
      className={`${sizeClass ?? 'flex-shrink-0 h-20 md:h-28'} ${seamless ? '' : 'border-b border-[#acbed8]'} select-none cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#acbed8]`}
    >
      <div
        ref={wrapperRef}
        className={`relative w-full h-full overflow-hidden flex ${
          seamless
            ? 'items-end justify-start bg-transparent' // anchor bottom-left: bars sit flush on the bottom edge; ceil-overflow clips at the top
            : 'items-center justify-center bg-[#f4f6fc] shadow-[inset_0_1px_4px_rgba(45,55,72,0.15)]'
        }`}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: grid.cols * cellPx,
            height: grid.rows * cellPx,
            imageRendering: 'pixelated',
          }}
        />
      </div>
    </section>
  )
}
