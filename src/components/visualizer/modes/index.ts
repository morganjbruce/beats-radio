import type { ModeRenderer } from '../types'
import { createJapanMode } from './japan'
import { createNeonCityMode } from './neonCity'
import { createOutrunMode, OUTRUN_GRID } from './outrun'
import { withFinePixels } from './finePixels'
import { createThreeBrushesMode } from './threeBrushes'

export const MODES = ['japan', 'outrun', 'neoncity', 'brushes'] as const
export type Mode = (typeof MODES)[number]
export const DEFAULT_MODE: Mode = 'japan'

export const MODE_LABELS: Record<Mode, string> = {
  japan: 'mountain lake',
  outrun: 'outrun drive',
  neoncity: 'neon city',
  brushes: 'three brushes',
}

/** Keep saved selections and preview links from the fine-grid comparison working. */
export const resolveMode = (value: string | null): Mode | undefined => {
  if (value === 'japanfine') return 'japan'
  if (value === 'outrunfine') return 'outrun'
  if (value === 'neoncityfine') return 'neoncity'
  return MODES.find(mode => mode === value)
}

export const createModeRegistry = (): Record<Mode, ModeRenderer> => ({
  japan: withFinePixels(createJapanMode()),
  outrun: withFinePixels(createOutrunMode(), OUTRUN_GRID, 0.45),
  neoncity: withFinePixels(createNeonCityMode(), '#050914'),
  brushes: createThreeBrushesMode(),
})
