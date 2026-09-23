import { describe, expect, test } from 'bun:test'
import { createCityScroll } from '../src/components/visualizer/modes/cityScroll'

const run = (bpm: number, fps: number, duration = 6) => {
  const motion = createCityScroll()
  let distance = 0
  for (let frame = 0; frame <= fps * duration; frame++) {
    const seconds = frame / fps
    distance = motion.advance(seconds * 1000, { seconds, cyclesPerSecond: bpm / 240 })
  }
  return distance
}

describe('city tempo scrolling', () => {
  test('tempo controls distance consistently at different display frame rates', () => {
    for (const fps of [30, 60, 120]) {
      expect(run(60, fps)).toBeCloseTo(72, 8)
      expect(run(120, fps)).toBeCloseTo(144, 8)
      expect(run(180, fps)).toBeCloseTo(216, 8)
    }
  })

  test('live tempo changes adjust speed without resetting position', () => {
    const motion = createCityScroll()
    const step = (seconds: number, cyclesPerSecond: number) =>
      motion.advance(seconds * 1000, { seconds, cyclesPerSecond })
    step(0, 0.25)
    const slow = step(0.1, 0.25)
    const fast = step(0.2, 0.5)
    expect(fast - slow).toBeCloseTo(slow * 2, 8)
    expect(step(0.3, 0)).toBe(fast)
    expect(step(0.4, 0.25) - fast).toBeCloseTo(slow, 8)
  })

  test('audio pause freezes motion even when wall time advances', () => {
    const motion = createCityScroll()
    motion.advance(0, { seconds: 0, cyclesPerSecond: 0.5 })
    const before = motion.advance(100, { seconds: 0.1, cyclesPerSecond: 0.5 })
    expect(motion.advance(60100, { seconds: 0.1, cyclesPerSecond: 0.5 })).toBe(before)
    const resumed = motion.advance(60200, { seconds: 0.2, cyclesPerSecond: 0.5 })
    expect(resumed - before).toBeCloseTo(before, 8)
  })

  test('returning to a scene or resetting the audio clock cannot cause a jump', () => {
    const motion = createCityScroll()
    motion.advance(0)
    const before = motion.advance(100)
    expect(motion.advance(60000)).toBe(before)
    expect(motion.advance(0)).toBe(before)
    expect(motion.advance(100)).toBeCloseTo(before * 2, 8)
    motion.reset()
    expect(motion.advance(100000)).toBe(0)
  })
})
