import { CAP, SCAN_TAIL } from './constants'
import type { CellPainter, GridSize } from './types'

export const drawIdle = (now: number, grid: GridSize, cell: CellPainter) => {
  const { cols, rows } = grid
  const period = cols * 24
  const progress = (now % (2 * period)) / period
  const position =
    progress < 1 ? progress * (cols - 1) : (2 - progress) * (cols - 1)
  const head = Math.round(position)
  const direction = progress < 1 ? 1 : -1
  const middleRow = Math.floor(rows / 2)

  for (let index = 3; index >= 1; index--) {
    const column = head - direction * index
    if (column >= 0 && column < cols) cell(column, middleRow, SCAN_TAIL)
  }
  cell(Math.max(0, Math.min(cols - 1, head)), middleRow, CAP)
}
