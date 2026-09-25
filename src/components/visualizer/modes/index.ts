import type { ModeRenderer } from '../types'
import { createForestMode } from './forest'
import { createFutureCityScene } from './futureCityScene'
import { createDesertScene } from './desertScene'
import { createCreatureScene } from './creatureScene'
import { createKpopDanceScene } from './kpopDanceScene'
import { createPixelArtMode } from './pixelArtScene'
import { createJapanMode } from './japan'
import { createNeonCityMode } from './neonCity'

export const MODES = ['forest', 'futurecity', 'desert', 'neoncity', 'japan', 'creatures', 'kpop'] as const
export type Mode = (typeof MODES)[number]
export const DEFAULT_MODE: Mode = 'forest'

export const MODE_LABELS: Record<Mode, string> = {
  forest: 'Forest',
  futurecity: 'Future City',
  desert: 'Strange Desert',
  neoncity: 'Parallax City',
  japan: 'Japan',
  creatures: 'Dancing Creatures',
  kpop: 'KPop Demon Hunters',
}

/** Keep saved selections and preview links from the fine-grid comparison working. */
export const resolveMode = (value: string | null): Mode | undefined => {
  if (value === 'japanfine') return 'japan'
  if (value === 'neoncityfine') return 'neoncity'
  return MODES.find(mode => mode === value)
}

export const createModeRegistry = (): Record<Mode, ModeRenderer> => ({
  forest: createForestMode(),
  futurecity: createPixelArtMode(createFutureCityScene),
  desert: createPixelArtMode(createDesertScene),
  neoncity: createNeonCityMode(),
  japan: createJapanMode(),
  creatures: createPixelArtMode(createCreatureScene),
  kpop: createPixelArtMode(createKpopDanceScene),
})
