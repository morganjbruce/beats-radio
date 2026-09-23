interface Position { x: number; y: number }
export interface BrushPosition extends Position {
  dx: number
  dy: number
  stroke: number
  pressure: number
}

/** Independent, bounded gestures with a deliberate brush lift between them. */
export function createBrushMotion(fine: boolean, random = Math.random) {
  const point = (): Position => ({ x: 0.1 + random() * 0.8, y: 0.13 + random() * 0.74 })
  let controls: Position[] = []
  let stroke = 0
  let elapsed = 0
  let duration = 1
  let lifted = 0
  let silence = 0
  let lastEnd: Position | undefined

  const begin = () => {
    let start = point()
    if (lastEnd) {
      // Take the most separated candidate, so lifting really changes placement.
      for (let i = 0; i < 5; i++) {
        const candidate = point()
        if (Math.hypot(candidate.x - lastEnd.x, candidate.y - lastEnd.y)
          > Math.hypot(start.x - lastEnd.x, start.y - lastEnd.y)) start = candidate
      }
    }
    let end = point()
    for (let i = 0; i < 5; i++) {
      const candidate = point()
      if (Math.hypot(candidate.x - start.x, candidate.y - start.y)
        > Math.hypot(end.x - start.x, end.y - start.y)) end = candidate
    }
    controls = [start, point(), point(), end]
    duration = fine ? 2.3 + random() * 2 : 1.8 + random() * 1.8
    elapsed = 0
    stroke++
  }

  return {
    update(dt: number, active: boolean, energy: number): BrushPosition | null {
      const step = Math.max(0, Math.min(dt, 0.05))
      if (!active) {
        silence += step
        if (silence > 0.3 && controls.length) {
          lastEnd = controls[3]
          controls = []
          lifted = 0
        }
        return null
      }
      silence = 0
      if (lifted > 0) {
        lifted = Math.max(0, lifted - step)
        return null
      }
      if (!controls.length) begin()
      elapsed += step * (0.8 + energy * 0.6)
      const t = Math.min(1, elapsed / duration), inverse = 1 - t
      const [a, b, c, d] = controls
      const result: BrushPosition = {
        x: inverse ** 3 * a.x + 3 * inverse ** 2 * t * b.x + 3 * inverse * t * t * c.x + t ** 3 * d.x,
        y: inverse ** 3 * a.y + 3 * inverse ** 2 * t * b.y + 3 * inverse * t * t * c.y + t ** 3 * d.y,
        dx: 3 * inverse ** 2 * (b.x - a.x) + 6 * inverse * t * (c.x - b.x) + 3 * t * t * (d.x - c.x),
        dy: 3 * inverse ** 2 * (b.y - a.y) + 6 * inverse * t * (c.y - b.y) + 3 * t * t * (d.y - c.y),
        stroke,
        pressure: 0.65 + 0.35 * Math.sin(Math.PI * t),
      }
      if (t === 1) {
        lastEnd = d
        controls = []
        lifted = 0.18 + random() * 0.3
      }
      return result
    },
  }
}
