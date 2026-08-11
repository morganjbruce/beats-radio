import { ramp } from '../constants'
import type { ModeRenderer } from '../types'

const MIAMI = ['#0f6f7a', '#1b9aaa', '#3fd0d4', '#f25fd0', '#ff2e92']

export const createScopeMode = (): ModeRenderer => ({
  needsWaveform: true,
  resize: () => undefined,
  draw: ({ cell, cols, rows, waveform }) => {
    const half = Math.floor(waveform.length / 2)
    let previousY = -1
    for (let column = 0; column < cols; column++) {
      const index = Math.floor((column / cols) * (half - 1))
      const y = Math.round((rows - 1) * (waveform[index] / 255))
      const from = previousY < 0 ? y : Math.min(previousY, y)
      const to = previousY < 0 ? y : Math.max(previousY, y)
      for (let row = from; row <= to; row++) {
        const distance = Math.abs(row - (rows - 1) / 2) / (rows / 2)
        cell(column, row, ramp(MIAMI, Math.min(0.999, distance)))
      }
      previousY = y
    }
  },
})
