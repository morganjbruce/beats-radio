import { describe, expect, test } from 'bun:test'
import { createModeRegistry, DEFAULT_MODE, MODES, resolveMode } from '../src/components/visualizer/modes'

describe('pixel scene selection', () => {
  test('registers the seven selected scenes and defaults to Forest', () => {
    expect(MODES).toEqual(['forest', 'futurecity', 'desert', 'neoncity', 'japan', 'creatures', 'kpop'])
    expect(Object.keys(createModeRegistry())).toEqual([...MODES])
    expect(DEFAULT_MODE).toBe('forest')
  })

  test('preserves city and Japan selections, and falls back for removed scenes', () => {
    for (const mode of MODES) expect(resolveMode(mode)).toBe(mode)
    expect(resolveMode('japanfine')).toBe('japan')
    expect(resolveMode('neoncityfine')).toBe('neoncity')
    for (const mode of [null, '', 'outrun', 'outrunfine', 'robotdisco', 'spectrum', 'mirror', 'scope', 'pixelfall', 'rain', 'tunnel', 'brushes', 'paintvortex'])
      expect(resolveMode(mode) ?? DEFAULT_MODE).toBe('forest')
  })
})
