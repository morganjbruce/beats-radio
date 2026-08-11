import { magnitude } from '../audioMetrics'
import { ramp } from '../constants'
import type { ModeRenderer } from '../types'

const SYNTH = ['#2f1b69', '#6431c9', '#b148e8', '#ff4fd8', '#ff8a5c', '#e8a13c']

export const createMirrorMode = (): ModeRenderer => ({
  resize: () => undefined,
  draw: ({ cell, cols, rows, frequency, flash }) => {
    const half = rows / 2
    for (let column = 0; column < cols; column++) {
      const value = magnitude(frequency, column / cols, (column + 1) / cols)
      const height = Math.round(value * half) + (flash > 0 && value > 0.4 ? 1 : 0)
      for (let index = 0; index < height; index++) {
        const color = ramp(SYNTH, index / half)
        const up = Math.floor(half) + index
        const down = Math.ceil(half) - 1 - index
        if (up < rows) cell(column, up, color)
        if (down >= 0) cell(column, down, color)
      }
    }
  },
})
