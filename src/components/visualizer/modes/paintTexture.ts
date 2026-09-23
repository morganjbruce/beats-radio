import type { BrushPosition } from './brushMotion'

export interface Point {
  x: number
  y: number
  nx: number
  ny: number
  width: number
  time: number
  stroke: number
}
export interface Brush {
  points: Point[]; color: string; bristles: number; life: number
  highlight?: string; shadow?: string; naturalTip?: boolean
}

const PAPER = '#f5efdf'
export const noise = (seed: number) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return value - Math.floor(value)
}

export function createPaper(width: number, height: number) {
  const paper = document.createElement('canvas')
  paper.width = width
  paper.height = height
  const ctx = paper.getContext('2d')!
  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, width, height)
  // Bake paper grain once on resize, never generate per-pixel noise in the draw loop.
  let seed = 37
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) | 0; return (seed >>> 0) / 4294967296 }
  const grain = ctx.getImageData(0, 0, width, height)
  for (let i = 0; i < grain.data.length; i += 4) {
    const variation = Math.round((random() - 0.5) * 9)
    grain.data[i] += variation
    grain.data[i + 1] += variation
    grain.data[i + 2] += variation
  }
  ctx.putImageData(grain, 0, 0)
  ctx.strokeStyle = 'rgba(121,97,60,0.035)'
  ctx.lineWidth = 0.5
  ctx.beginPath()
  for (let i = 0; i < width * height / 100; i++) {
    const x = random() * width, y = random() * height
    ctx.moveTo(x, y)
    ctx.lineTo(x + random() * 3, y + random() * 1.5)
  }
  ctx.stroke()
  return paper
}

export function addPoint(brush: Brush, position: BrushPosition, canvasWidth: number, canvasHeight: number,
  width: number, time: number) {
  const previous = brush.points.at(-1)
  const continuous = previous && previous.stroke === position.stroke && time - previous.time < 0.12
  const dx = position.dx * canvasWidth, dy = position.dy * canvasHeight
  const length = Math.hypot(dx, dy) || 1
  let nx = -dy / length, ny = dx / length
  if (continuous) {
    nx = previous.nx * 0.7 + nx * 0.3
    ny = previous.ny * 0.7 + ny * 0.3
    const normalLength = Math.hypot(nx, ny) || 1
    nx /= normalLength
    ny /= normalLength
  }
  brush.points.push({ x: position.x * canvasWidth, y: position.y * canvasHeight,
    nx, ny, width: width * position.pressure, time, stroke: position.stroke })
}

// The same bristle profile travels with a stroke, keeping its wet edge stable.
function tipDepth(spread: number, stroke: number) {
  const across = Math.max(0, Math.min(1, spread + 0.5))
  const lane = across * 10
  const first = Math.floor(lane), fraction = lane - first
  const blend = fraction * fraction * (3 - 2 * fraction)
  const a = noise(stroke * 71 + first * 13), b = noise(stroke * 71 + (first + 1) * 13)
  return Math.pow(Math.sin(Math.PI * across), 0.65) * (0.14 + (a + (b - a) * blend) * 0.14)
}

function paintTip(ctx: CanvasRenderingContext2D, point: Point, backwards = false) {
  for (let i = 1; i <= 28; i++) {
    const spread = (0.5 - i / 28) * (backwards ? -1 : 1)
    const offset = spread * point.width * 0.89
    const depth = point.width * tipDepth(spread, point.stroke) * (backwards ? -0.55 : 1)
    ctx.lineTo(point.x + point.nx * offset + point.ny * depth,
      point.y + point.ny * offset - point.nx * depth)
  }
}

/** Opaque pigment joins the bristles into a loaded brush, leaving texture at the edges. */
function paintBody(ctx: CanvasRenderingContext2D, points: Point[], first: number, last: number, naturalTip = false) {
  let start = first
  while (start <= last) {
    let end = start
    while (end < last && points[end + 1].stroke === points[start].stroke) end++
    if (end > start) {
      ctx.beginPath()
      for (let i = start; i <= end; i++) {
        const p = points[i]
        const edge = p.width * (0.445 + 0.008 * Math.sin(p.time * 23))
        const x = p.x + p.nx * edge, y = p.y + p.ny * edge
        if (i === start) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      if (naturalTip && (end === points.length - 1 || points[end + 1].stroke !== points[end].stroke)) {
        paintTip(ctx, points[end])
      }
      for (let i = end; i >= start; i--) {
        const p = points[i]
        const edge = p.width * (0.445 + 0.008 * Math.cos(p.time * 21))
        ctx.lineTo(p.x - p.nx * edge, p.y - p.ny * edge)
      }
      if (naturalTip && (start === 0 || points[start - 1].stroke !== points[start].stroke)) {
        paintTip(ctx, points[start], true)
      }
      ctx.closePath()
      ctx.fill()
    }
    start = end + 1
  }
}

function paintStroke(ctx: CanvasRenderingContext2D, brush: Brush, points: Point[], unit: number) {
  const { bristles, naturalTip } = brush
  if (points.length < 2) return
  ctx.save()
  const loaded = bristles > 10
  ctx.globalCompositeOperation = loaded ? 'source-over' : 'multiply'
  ctx.strokeStyle = brush.color
  ctx.fillStyle = brush.color
  ctx.lineCap = naturalTip ? 'round' : 'butt'
  ctx.lineJoin = 'round'
  if (loaded) {
    ctx.globalAlpha = 0.98
    paintBody(ctx, points, 0, points.length - 1, naturalTip)
  }
  for (let bristle = 0; bristle < bristles; bristle++) {
    const spread = ((bristle + noise(bristle * 17) * 0.6) / (bristles - 0.4) - 0.5) * 0.98
    const uneven = noise(bristle + bristles * 19)
    const edgeBristle = Math.abs(spread) > 0.4
    ctx.strokeStyle = loaded && !edgeBristle ? (uneven > 0.5 ? brush.highlight ?? brush.color : brush.shadow ?? brush.color) : brush.color
    ctx.globalAlpha = loaded && !edgeBristle ? 0.1 + uneven * 0.05 : 0.75 + uneven * 0.2
    ctx.lineWidth = Math.max(0.55, unit * (bristles > 10 ? 0.0045 : 0.002)) * (0.65 + uneven)
    ctx.beginPath()
    let previous: Point | undefined
    const end = naturalTip ? points.length - 1 : Math.max(0, points.length - 1 - Math.floor(uneven * 4))
    for (let i = 0; i <= end; i++) {
      const point = points[i]
      const grain = Math.sin(point.time * 19 + bristle * 7) * 0.4
      const dry = noise(point.time * 331 + bristle * 77) > 0.98
      const offset = spread * point.width + grain
      const x = point.x + point.nx * offset
      const y = point.y + point.ny * offset
      if (!previous || previous.stroke !== point.stroke || dry) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
      if (naturalTip && (i === points.length - 1 || points[i + 1].stroke !== point.stroke)) {
        const depth = point.width * (tipDepth(spread / 0.89, point.stroke) + (edgeBristle ? uneven * 0.035 : 0))
        ctx.lineTo(x + point.ny * depth, y - point.nx * depth)
      }
      previous = point
    }
    ctx.stroke()
  }
  ctx.restore()
}

export function strokeOpacity(age: number, life: number) {
  if (life <= 0) return 0
  const hold = Math.min(0.6, life * 0.1)
  const fade = Math.max(0, Math.min(1, (age - hold) / (life - hold)))
  return 1 - fade * fade * (3 - 2 * fade)
}

interface StrokeImage {
  canvas: HTMLCanvasElement
  x: number; y: number
  first: Point; last: Point; count: number; unit: number; style: string
}
const strokeImages = new WeakMap<Brush, Map<number, StrokeImage>>()

function renderStroke(brush: Brush, points: Point[], unit: number, style: string, previous?: StrokeImage): StrokeImage {
  let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity
  for (const point of points) {
    const margin = Math.max(point.width * 0.85, unit * 0.008) + 3
    left = Math.min(left, point.x - margin)
    top = Math.min(top, point.y - margin)
    right = Math.max(right, point.x + margin)
    bottom = Math.max(bottom, point.y + margin)
  }
  left = Math.floor(left)
  top = Math.floor(top)
  const width = Math.ceil(right) - left, height = Math.ceil(bottom) - top
  const canvas = previous?.canvas ?? document.createElement('canvas')
  if (canvas.width !== width) canvas.width = width
  if (canvas.height !== height) canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, width, height)
  ctx.save()
  ctx.translate(-left, -top)
  paintStroke(ctx, brush, points, unit)
  ctx.restore()
  return { canvas, x: left, y: top, first: points[0], last: points[points.length - 1], count: points.length, unit, style }
}

export function paintBrush(ctx: CanvasRenderingContext2D, brush: Brush, time: number, unit: number) {
  let images = strokeImages.get(brush)
  if (!images) {
    images = new Map()
    strokeImages.set(brush, images)
  }
  const live = new Set<number>()
  const { points } = brush
  const style = [brush.color, brush.highlight, brush.shadow, brush.bristles, brush.naturalTip].join('|')
  let first = 0
  while (first < points.length) {
    let end = first + 1
    while (end < points.length && points[end].stroke === points[first].stroke) end++
    const last = points[end - 1]
    const opacity = strokeOpacity(time - last.time, brush.life)
    if (opacity === 0) {
      // Remove a whole finished stroke, never cut off individual ageing points.
      images.delete(last.stroke)
      points.splice(first, end - first)
      continue
    }
    live.add(last.stroke)
    if (end - first >= 2) {
      let painted = images.get(last.stroke)
      if (!painted || painted.first !== points[first] || painted.last !== last
        || painted.count !== end - first || painted.unit !== unit || painted.style !== style) {
        painted = renderStroke(brush, points.slice(first, end), unit, style, painted)
        images.set(last.stroke, painted)
      }
      // Body, overlapping bristles and tips fade together in a single composite.
      ctx.save()
      ctx.globalCompositeOperation = brush.bristles > 10 ? 'source-over' : 'multiply'
      ctx.globalAlpha = opacity
      ctx.drawImage(painted.canvas, painted.x, painted.y)
      ctx.restore()
    }
    first = end
  }
  for (const stroke of images.keys()) if (!live.has(stroke)) images.delete(stroke)
}
