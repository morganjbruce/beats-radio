export const PANEL = '#f4f6fc'
export const UNLIT = '#e2e7f2'
export const CAP = '#5b6b8c'
export const SCAN_TAIL = '#c9d3e4'

export const STOP_TAIL_MS = 2500
export const MODE_KEY = 'vis-mode'

export const ramp = (palette: string[], factor: number) =>
  palette[Math.min(palette.length - 1, Math.floor(factor * palette.length))]
