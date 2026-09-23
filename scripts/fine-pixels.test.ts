import { describe, expect, test } from 'bun:test'
import { fineDisc } from '../src/components/visualizer/modes/finePixels'
import { createModeRegistry, DEFAULT_MODE, MODES, resolveMode } from '../src/components/visualizer/modes'

describe('fine square pixels', () => {
  test('circles stay symmetric and aligned to whole grid cells', () => {
    const cells = new Set<string>()
    fineDisc((x, y) => {
      expect(Number.isInteger(x) && Number.isInteger(y)).toBe(true)
      expect((x - 10) ** 2 + (y - 10) ** 2).toBeLessThanOrEqual(36)
      cells.add(`${x},${y}`)
    }, 10, 10, 6, () => '#fff')
    expect(cells.size).toBeGreaterThan(90)
    for (const point of cells) {
      const [x, y] = point.split(',').map(Number)
      expect(cells.has(`${20 - x},${y}`)).toBe(true)
      expect(cells.has(`${x},${20 - y}`)).toBe(true)
    }
  })

  test('sun and moon silhouettes have no single-pixel cardinal tips', () => {
    for (const radius of [2, 3, 6, 12, 18, 36]) {
      const cells: [number, number][] = []
      fineDisc((x, y) => { cells.push([x, y]) }, 50, 50, radius, () => '#fff')
      const xs = cells.map(([x]) => x)
      const ys = cells.map(([, y]) => y)
      for (const edge of [Math.min(...xs), Math.max(...xs)])
        expect(cells.filter(([x]) => x === edge).length).toBeGreaterThanOrEqual(3)
      for (const edge of [Math.min(...ys), Math.max(...ys)])
        expect(cells.filter(([, y]) => y === edge).length).toBeGreaterThanOrEqual(3)
    }
  })

  test('sun stripes leave complete empty rows', () => {
    const rows = new Set<number>()
    fineDisc((_x, y) => rows.add(y), 10, 10, 6,
      row => row % 2 ? '#fff' : undefined, 10)
    expect([...rows]).toEqual([11, 13, 15])
  })

  test('the three improved scenes and future strokes are available, with Japan as default', () => {
    expect(MODES).toEqual(['japan', 'outrun', 'neoncity', 'brushes'])
    expect(Object.keys(createModeRegistry())).toEqual([...MODES])
    expect(DEFAULT_MODE).toBe('japan')
  })

  test('previous scene selections resolve, while removed modes fall back to Japan', () => {
    for (const mode of ['japan', 'outrun', 'neoncity'] as const) {
      expect(resolveMode(mode)).toBe(mode)
      expect(resolveMode(`${mode}fine`)).toBe(mode)
    }
    for (const mode of [null, '', 'spectrum', 'mirror', 'scope', 'pixelfall', 'rain', 'tunnel', 'paintvortex'])
      expect(resolveMode(mode) ?? DEFAULT_MODE).toBe('japan')
  })
})
