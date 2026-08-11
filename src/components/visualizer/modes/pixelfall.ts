import { magnitude } from '../audioMetrics'
import type { ModeRenderer } from '../types'

const AURORA = [
  '',
  '#b8c6dd',
  '#5b8bbf',
  '#1b9aaa',
  '#27a86b',
  '#e8a13c',
  '#f25c1f',
  '#ff2e92',
]

export const createPixelfallMode = (): ModeRenderer => {
  let fall = new Uint8Array(0)

  return {
    resize: ({ cols, rows }) => {
      fall = new Uint8Array(cols * rows)
    },
    draw: ({ cell, cols, rows, frequency, tick }) => {
      if (tick % 2 === 0) {
        fall.copyWithin(0, rows)
        const base = (cols - 1) * rows
        for (let row = 0; row < rows; row++) {
          const value = magnitude(frequency, row / rows, (row + 1) / rows)
          fall[base + row] =
            value < 0.15
              ? 0
              : Math.min(AURORA.length - 1, Math.ceil(value * (AURORA.length - 1)))
        }
      }

      for (let column = 0; column < cols; column++)
        for (let row = 0; row < rows; row++) {
          const level = fall[column * rows + row]
          if (level > 0) cell(column, row, AURORA[level])
        }
    },
  }
}
