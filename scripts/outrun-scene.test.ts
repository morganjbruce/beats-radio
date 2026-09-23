import { describe, expect, test } from 'bun:test'
import { createOutrunMode } from '../src/components/visualizer/modes/outrun'

const render = () => {
  const cols = 360
  const rows = 171
  const pixels = new Map<number, string>()
  const scene = createOutrunMode()
  scene.resize({ cols, rows })
  scene.draw({
    cols, rows,
    canvas: {} as HTMLCanvasElement,
    context: {} as CanvasRenderingContext2D,
    cell: (x, y, color) => { pixels.set(y * cols + x, color) },
    line() {}, resetFillCache() {},
    frequency: new Uint8Array(2048), waveform: new Uint8Array(4096).fill(128),
    tick: 1, flash: 0, now: 0,
  })
  return { pixels, cols, horizon: Math.floor(rows * 0.55) }
}

describe('fuller Outrun scene', () => {
  test('road fills more of the foreground and stays open at the horizon', () => {
    const fine = render()
    const roadCells = (scene: ReturnType<typeof render>, row: number, color: string) =>
      Array.from({ length: scene.cols }, (_, x) => scene.pixels.get(row * scene.cols + x))
        .filter(pixel => pixel === color).length
    const wide = roadCells(fine, 0, '#829ebd')
    expect(wide / fine.cols).toBeGreaterThan(0.78)
    expect(wide / fine.cols).toBeLessThan(0.88)
    expect(roadCells(fine, fine.horizon - 1, '#829ebd')).toBeGreaterThan(15)
  })

  test('the striped sun has single-row gaps and more paint than gaps', () => {
    const { pixels, cols, horizon } = render()
    const sun = new Set(['#ffb41f', '#ff761a', '#f83d34', '#ff348e'])
    let filled = 0
    let gaps = 0
    let lastWasGap = false
    for (let y = horizon + 1; y <= horizon + 21; y++) {
      const isGap = !sun.has(pixels.get(y * cols + cols / 2) ?? '')
      if (isGap) {
        gaps++
        expect(lastWasGap).toBe(false)
      } else filled++
      lastWasGap = isGap
    }
    expect(gaps).toBeGreaterThanOrEqual(6)
    expect(filled).toBeGreaterThan(gaps)
  })
})
