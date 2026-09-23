import { createPixelPainter, type PixelPainter } from '../pixelPainter'
import { PANEL } from '../constants'
import type { CellPainter, GridSize, ModeRenderer } from '../types'

export const FINE_PIXEL_SIZE = 4

/** Render a fixed 4 px grid without resizing the canvas or resetting other modes. */
export const withFinePixels = (scene: ModeRenderer, gridColor = PANEL, gridOpacity = 1): ModeRenderer => {
  let grid: GridSize = { cols: 0, rows: 0 }
  let painter: PixelPainter | undefined
  let gridOverlay: HTMLCanvasElement | undefined
  return {
    resize: () => {
      painter = undefined
      gridOverlay = undefined
    },
    draw: frame => {
      const sub = FINE_PIXEL_SIZE
      if (!painter) {
        grid = {
          cols: Math.ceil(frame.canvas.width / sub),
          rows: Math.ceil(frame.canvas.height / sub),
        }
        scene.resize(grid)
        painter = createPixelPainter(frame.context, grid, sub, false, 0, true)
      }
      if (!gridOverlay) {
        gridOverlay = document.createElement('canvas')
        gridOverlay.width = frame.canvas.width
        gridOverlay.height = frame.canvas.height
        const context = gridOverlay.getContext('2d')!
        context.fillStyle = gridColor
        for (let column = 0; column < grid.cols; column++)
          context.fillRect(column * sub, 0, 1, gridOverlay.height)
        for (let row = 0; row < grid.rows; row++)
          context.fillRect(0, row * sub, gridOverlay.width, 1)
      }
      painter.resetFillCache()
      scene.draw({ ...frame, ...grid, ...painter })
      painter.flush()
      // Draw the grid last so scenery, rain and overlapping details cannot cover it.
      frame.context.save()
      frame.context.globalAlpha = gridOpacity
      frame.context.drawImage(gridOverlay, 0, 0)
      frame.context.restore()
      frame.resetFillCache()
    },
  }
}

/** A circle assembled exclusively from whole square cells. */
export const fineDisc = (
  cell: CellPainter,
  x: number,
  y: number,
  radius: number,
  colorAtRow: (row: number) => string | undefined,
  minimumRow = Math.ceil(y - radius),
) => {
  // Centre-sampling an integer radius includes isolated cardinal tips. Insetting
  // by half a cell gives the whole-square silhouette a flat, rounded cap instead.
  const contourRadius = Math.max(0.5, radius - 0.5)
  for (let row = Math.max(minimumRow, Math.ceil(y - contourRadius)); row <= Math.floor(y + contourRadius); row++) {
    const color = colorAtRow(row)
    if (!color) continue
    const half = Math.sqrt(Math.max(0, contourRadius * contourRadius - (row - y) ** 2))
    const left = Math.ceil(x - half)
    const right = Math.floor(x + half)
    for (let column = left; column <= right; column++) cell(column, row, color)
  }
}
