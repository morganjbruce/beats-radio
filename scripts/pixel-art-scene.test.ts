import { describe, expect, test } from 'bun:test'
import { createPixelArtMode, type SceneAudio } from '../src/components/visualizer/modes/pixelArtScene'
import type { ModeFrame } from '../src/components/visualizer/types'

// Verify the shared contract independently of any scene's drawing implementation.
function withCanvas(run: (frame: ModeFrame) => void) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'document')
  const context = { save() {}, restore() {}, drawImage() {}, imageSmoothingEnabled: true }
  const surface = { width: 0, height: 0, getContext: () => context }
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: { createElement: () => surface },
  })
  try {
    run({
      canvas: { width: 1280, height: 304 } as HTMLCanvasElement,
      context: context as unknown as CanvasRenderingContext2D,
      cols: 214, rows: 51, cell() {}, line() {}, resetFillCache() {},
      frequency: new Uint8Array(2048).fill(100),
      waveform: new Uint8Array(4096).fill(128),
      now: 1000, tick: 1, flash: 0,
    })
  } finally {
    if (previous) Object.defineProperty(globalThis, 'document', previous)
    else Reflect.deleteProperty(globalThis, 'document')
  }
}

describe('pixel-art music integration', () => {
  test('beat envelopes emit one event and choreography follows the actual song clock', () => withCanvas(frame => {
    const received: SceneAudio[] = []
    const deltas: number[] = []
    const mode = createPixelArtMode(() => ({
      resize() {},
      draw(_ctx, _width, _height, audio, dt) {
        received.push({ ...audio })
        deltas.push(dt)
      },
    }))
    mode.resize(frame)
    frame.musicTiming = { seconds: 1.125, cyclesPerSecond: 0.5 }
    for (const flash of [5, 4, 3, 0, 5]) {
      mode.draw({ ...frame, flash })
      frame.now += 16
    }
    expect(received.map(audio => audio.beat)).toEqual([true, false, false, false, true])
    expect(received[0].beatCount).toBe(2)
    expect(received[0].beatPhase).toBeCloseTo(0.25)
    expect(received[0].bass).toBeGreaterThan(0)
    expect(received[0].treble).toBeGreaterThan(0)
    // A tempo change must not recalculate all prior beats at the new tempo.
    mode.draw({ ...frame, musicTiming: { seconds: 12, cyclesPerSecond: 1.5, cycles: 3.3125 } })
    expect(received.at(-1)?.beatCount).toBe(13)
    expect(received.at(-1)?.beatPhase).toBeCloseTo(0.25)
    mode.draw({ ...frame, now: frame.now + 60_000, frequency: new Uint8Array(0), musicTiming: undefined })
    expect(deltas.at(-1)).toBeLessThanOrEqual(0.05)
    expect(received.at(-1)?.bass).toBe(0)
    expect(received.at(-1)?.beatPhase).toBeUndefined()
  }))

  test('inactive scenes avoid expensive geometry and selected scenes resize once', () => withCanvas(frame => {
    let creations = 0
    const sizes: number[][] = []
    const mode = createPixelArtMode(() => {
      creations++
      return { resize(width, height) { sizes.push([width, height]) }, draw() {} }
    })
    mode.resize({ cols: 200, rows: 50 })
    mode.resize({ cols: 214, rows: 51 })
    expect(creations).toBe(0)
    mode.draw(frame)
    mode.draw({ ...frame, now: 1016 })
    expect(creations).toBe(1)
    expect(sizes).toEqual([[320, 76]])
    mode.resize({ cols: 65, rows: 145 })
    expect(sizes).toHaveLength(1)
    mode.draw({ ...frame, canvas: { width: 392, height: 580 } as HTMLCanvasElement })
    expect(sizes).toEqual([[320, 76], [98, 145]])
  }))
})
