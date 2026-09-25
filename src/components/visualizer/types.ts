export interface GridSize {
  cols: number
  rows: number
}

export interface MusicTiming {
  seconds: number
  cyclesPerSecond: number
  /** Scheduler position; preferable to seconds × current tempo after tempo changes. */
  cycles?: number
}

export type CellPainter = (column: number, row: number, color: string) => void
export type LinePainter = (
  startColumn: number,
  startRow: number,
  endColumn: number,
  endRow: number,
  color: string,
) => void

export interface ModeFrame extends GridSize {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  cell: CellPainter
  line: LinePainter
  frequency: Uint8Array<ArrayBuffer>
  waveform: Uint8Array<ArrayBuffer>
  tick: number
  flash: number
  now: number
  musicTiming?: MusicTiming
  resetFillCache: (color?: string) => void
}

export interface ModeRenderer {
  needsWaveform?: boolean
  resize: (grid: GridSize) => void
  draw: (frame: ModeFrame) => void
}
