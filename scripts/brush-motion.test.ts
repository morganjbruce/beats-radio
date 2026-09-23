import { describe, expect, test } from 'bun:test'
import { createBrushMotion, type BrushPosition } from '../src/components/visualizer/modes/brushMotion'

const randomFrom = (initial: number) => {
  let seed = initial
  return () => { seed = (Math.imul(seed, 1664525) + 1013904223) | 0; return (seed >>> 0) / 4294967296 }
}

describe('brush gestures', () => {
  test('different random seeds produce different initial placements', () => {
    const a = createBrushMotion(false, randomFrom(7)).update(1 / 60, true, 0.6)!
    const b = createBrushMotion(false, randomFrom(100)).update(1 / 60, true, 0.6)!
    expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(0.1)
  })

  test('gestures stay within the paper and lift before each reposition', () => {
    for (const fine of [false, true]) {
      const motion = createBrushMotion(fine, randomFrom(31))
      let last: BrushPosition | null = null
      let lastDrawn: BrushPosition | undefined
      let changes = 0
      for (let i = 0; i < 2400; i++) {
        const current = motion.update(1 / 60, true, 0.65)
        if (current) {
          expect(current.x).toBeGreaterThanOrEqual(0.1)
          expect(current.x).toBeLessThanOrEqual(0.9)
          expect(current.y).toBeGreaterThanOrEqual(0.13)
          expect(current.y).toBeLessThanOrEqual(0.87)
          expect(Number.isFinite(current.dx + current.dy)).toBe(true)
          if (lastDrawn && current.stroke !== lastDrawn.stroke) {
            expect(last).toBeNull()
            expect(Math.hypot(current.x - lastDrawn.x, current.y - lastDrawn.y)).toBeGreaterThan(0.2)
            changes++
          }
          lastDrawn = current
        }
        last = current
      }
      expect(changes).toBeGreaterThan(5)
    }
  })

  test('silence lifts the brush and the next phrase starts a new stroke', () => {
    const motion = createBrushMotion(true, randomFrom(42))
    const before = motion.update(1 / 60, true, 0.8)!
    for (let i = 0; i < 60; i++) expect(motion.update(1 / 60, false, 0)).toBeNull()
    const after = motion.update(1 / 60, true, 0.8)!
    expect(after.stroke).toBeGreaterThan(before.stroke)
    expect(Math.hypot(after.x - before.x, after.y - before.y)).toBeGreaterThan(0.1)
  })
})
