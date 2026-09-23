import { describe, expect, test } from 'bun:test'
import { strokeOpacity } from '../src/components/visualizer/modes/paintTexture'

describe('whole-stroke fading', () => {
  test('fades continuously and monotonically without opacity bands', () => {
    for (const life of [10, 12]) {
      let previous = 1
      let transitions = 0
      for (let frame = 0; frame <= life * 100; frame++) {
        const alpha = strokeOpacity(frame / 100, life)
        expect(alpha).toBeGreaterThanOrEqual(0)
        expect(alpha).toBeLessThanOrEqual(previous)
        expect(previous - alpha).toBeLessThan(0.002)
        if (alpha < previous) transitions++
        previous = alpha
      }
      expect(transitions).toBeGreaterThan(900)
      expect(previous).toBe(0)
    }
  })

  test('fresh paint holds briefly and zero lifetime paint expires', () => {
    expect(strokeOpacity(0, 12)).toBe(1)
    expect(strokeOpacity(0.5, 12)).toBe(1)
    expect(strokeOpacity(100, 12)).toBe(0)
    expect(strokeOpacity(0, 0)).toBe(0)
  })
})
