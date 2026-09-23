import type { CellPainter, GridSize, LinePainter } from './types'

export interface PixelPainter {
  cell: CellPainter
  line: LinePainter
  flush: () => void
  resetFillCache: (color?: string) => void
}

export const createPixelPainter = (
  context: CanvasRenderingContext2D,
  grid: GridSize,
  sub: number,
  seamless: boolean,
  gap = 1,
  batch = false,
): PixelPainter => {
  const { cols, rows } = grid
  const ledInset = seamless ? gap : 0
  const ledSize = sub - gap
  let lastFill = ''
  let pending: { x: number; y: number; width: number; height: number; color: string } | undefined

  const fillColor = (color: string) => {
    if (color !== lastFill) {
      context.fillStyle = color
      lastFill = color
    }
  }
  const flush = () => {
    if (!pending) return
    fillColor(pending.color)
    context.fillRect(pending.x, pending.y, pending.width, pending.height)
    pending = undefined
  }

  const resetFillCache = (color = '') => {
    flush()
    lastFill = color
  }

  const cell: CellPainter = (column, row, color) => {
    const x = column * sub + ledInset
    const y = (rows - 1 - row) * sub + ledInset
    // Contiguous fine tiles can share a draw call, particularly sky rows and buildings.
    if (batch && gap === 0) {
      if (pending?.color === color) {
        if (pending.y === y && pending.height === ledSize && x === pending.x + pending.width) {
          pending.width += ledSize
          return
        }
        if (pending.x === x && pending.width === ledSize && y + ledSize === pending.y) {
          pending.y = y
          pending.height += ledSize
          return
        }
      }
      flush()
      pending = { x, y, width: ledSize, height: ledSize, color }
      return
    }
    flush()
    fillColor(color)
    context.fillRect(x, y, ledSize, ledSize)
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

  return { cell, line, flush, resetFillCache }
}
