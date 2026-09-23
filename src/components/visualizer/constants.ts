export const PANEL = '#f4f6fc'
export const UNLIT = '#e2e7f2'

export const STOP_TAIL_MS = 2500
export const MODE_KEY = 'vis-mode'

export const ramp = (palette: string[], factor: number) =>
  palette[Math.min(palette.length - 1, Math.floor(factor * palette.length))]
