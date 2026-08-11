import type { ModeRenderer } from '../types'
import { createJapanMode } from './japan'
import { createMirrorMode } from './mirror'
import { createNeonCityMode } from './neonCity'
import { createOutrunMode } from './outrun'
import { createPixelfallMode } from './pixelfall'
import { createRainMode } from './rain'
import { createScopeMode } from './scope'
import { createSpectrumMode } from './spectrum'
import { createTunnelMode } from './tunnel'

export const MODES = [
  'spectrum',
  'mirror',
  'scope',
  'pixelfall',
  'rain',
  'tunnel',
  'outrun',
  'japan',
  'neoncity',
] as const

export type Mode = (typeof MODES)[number]

export const MODE_LABELS: Record<Mode, string> = {
  spectrum: 'spectrum',
  mirror: 'mirror',
  scope: 'oscilloscope',
  pixelfall: 'pixel fall',
  rain: 'rain',
  tunnel: 'tunnel',
  outrun: 'outrun drive',
  japan: 'mountain lake',
  neoncity: 'neon city',
}

export const createModeRegistry = (): Record<Mode, ModeRenderer> => ({
  spectrum: createSpectrumMode(),
  mirror: createMirrorMode(),
  scope: createScopeMode(),
  pixelfall: createPixelfallMode(),
  rain: createRainMode(),
  tunnel: createTunnelMode(),
  outrun: createOutrunMode(),
  japan: createJapanMode(),
  neoncity: createNeonCityMode(),
})
