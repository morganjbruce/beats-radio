import { describe, expect, test } from 'bun:test'
import { createBrushPigment } from '../src/components/visualizer/modes/brushPigment'

describe('broad brush pigment', () => {
  test('keeps orange for three or four whole strokes before changing', () => {
    for (const [random, count] of [[0, 3], [0.99, 4]]) {
      const pigment = createBrushPigment(() => random)
      const first = pigment.forStroke(1)
      expect(first.color).toBe('#cc4929')
      for (let stroke = 1; stroke <= count; stroke++) {
        for (let frame = 0; frame < 100; frame++) expect(pigment.forStroke(stroke)).toBe(first)
      }
      expect(pigment.forStroke(count + 1).color).not.toBe(first.color)
      expect(first.color).toBe('#cc4929')
    }
  })

  test('repeated reloads use different pigments and only three- or four-stroke batches', () => {
    let seed = 39
    const pigment = createBrushPigment(() => {
      seed = (Math.imul(seed, 1664525) + 1013904223) | 0
      return (seed >>> 0) / 4294967296
    })
    let previous = pigment.forStroke(1)
    let count = 1
    const lengths = new Set<number>()
    const history = [{ paint: previous, color: previous.color }]
    for (let stroke = 2; stroke <= 50; stroke++) {
      const paint = pigment.forStroke(stroke)
      if (paint.color === previous.color) count++
      else {
        expect([3, 4]).toContain(count)
        lengths.add(count)
        count = 1
        history.push({ paint, color: paint.color })
      }
      previous = paint
    }
    expect(lengths.size).toBe(2)
    for (const entry of history) expect(entry.paint.color).toBe(entry.color)
  })
})
