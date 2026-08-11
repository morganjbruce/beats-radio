import type { CellPainter, GridSize, LinePainter } from './types'

export interface PixelPainter {
  cell: CellPainter
  line: LinePainter
  resetFillCache: (color?: string) => void
}

export const createPixelPainter = (
  context: CanvasRenderingContext2D,
  grid: GridSize,
  sub: number,
  seamless: boolean,
): PixelPainter => {
  const { cols, rows } = grid
  const ledInset = seamless ? 1 : 0
  const ledSize = sub - 1
  let lastFill = ''

  const resetFillCache = (color = '') => {
    lastFill = color
  }

  const cell: CellPainter = (column, row, color) => {
    if (color !== lastFill) {
      context.fillStyle = color
      lastFill = color
    }
    context.fillRect(
      column * sub + ledInset,
      (rows - 1 - row) * sub + ledInset,
      ledSize,
      ledSize,
    )
  }

  const line: LinePainter = (startColumn, startRow, endColumn, endRow, color) => {
    let x = Math.round(startColumn)
    let y = Math.round(startRow)
    const targetX = Math.round(endColumn)
    const targetY = Math.round(endRow)
    const dx = Math.abs(targetX - x)
    const sx = x < targetX ? 1 : -1
    const dy = -Math.abs(targetY - y)
    const sy = y < targetY ? 1 : -1
    let error = dx + dy

    for (;;) {
      if (x >= 0 && x < cols && y >= 0 && y < rows) cell(x, y, color)
      if (x === targetX && y === targetY) break
      const twiceError = error * 2
      if (twiceError >= dy) {
        error += dy
        x += sx
      }
      if (twiceError <= dx) {
        error += dx
        y += sy
      }
    }
  }

  return { cell, line, resetFillCache }
}
