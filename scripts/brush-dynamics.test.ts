import { describe, expect, test } from 'bun:test'
import { createBrushDynamics } from '../src/components/visualizer/modes/brushDynamics'

const spectrum = (from = 0, to = 0) => {
  const data = new Uint8Array(2048)
  data.fill(230, from, to)
  return data
}

describe('three-brush audio dynamics', () => {
  test('silence and empty input do not paint or emit percussion hits', () => {
    const dynamics = createBrushDynamics()
    for (const input of [new Uint8Array(0), spectrum()]) {
      for (let i = 0; i < 120; i++) {
        expect(dynamics.update(input, 1 / 60)).toEqual({ bass: 0, melody: 0, percussion: 0, hit: false })
      }
    }
  })

  test('low and middle tones independently activate their brush', () => {
    const low = createBrushDynamics(), mid = createBrushDynamics()
    let bass, melody
    for (let i = 0; i < 60; i++) {
      bass = low.update(spectrum(3, 18), 1 / 60)
      melody = mid.update(spectrum(30, 150), 1 / 60)
    }
    expect(bass!.bass).toBeGreaterThan(0.7)
    expect(bass!.melody).toBe(0)
    expect(bass!.hit).toBe(false)
    expect(melody!.melody).toBeGreaterThan(0.7)
    expect(melody!.bass).toBe(0)
    expect(melody!.hit).toBe(false)
  })

  test('a sustained high tone triggers once, and a later attack triggers again', () => {
    const dynamics = createBrushDynamics()
    let hits = 0
    for (let i = 0; i < 120; i++) if (dynamics.update(spectrum(200, 1000), 1 / 60).hit) hits++
    expect(hits).toBe(1)
    for (let i = 0; i < 90; i++) dynamics.update(spectrum(), 1 / 60)
    for (let i = 0; i < 60; i++) if (dynamics.update(spectrum(200, 1000), 1 / 60).hit) hits++
    expect(hits).toBe(2)
  })

  test('envelopes settle equally at 30 and 120 fps, then decay in silence', () => {
    const a = createBrushDynamics(), b = createBrushDynamics()
    let slow, fast
    for (let i = 0; i < 30; i++) slow = a.update(spectrum(3, 180), 1 / 30)
    for (let i = 0; i < 120; i++) fast = b.update(spectrum(3, 180), 1 / 120)
    expect(slow!.bass).toBeCloseTo(fast!.bass, 6)
    expect(slow!.melody).toBeCloseTo(fast!.melody, 6)
    for (let i = 0; i < 120; i++) slow = a.update(spectrum(), 1 / 60)
    expect(slow!.bass).toBeLessThan(0.001)
    expect(slow!.melody).toBeLessThan(0.001)
  })
})
