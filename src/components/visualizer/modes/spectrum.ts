import { magnitude } from '../audioMetrics'
import { CAP, ramp } from '../constants'
import type { ModeRenderer } from '../types'

const HEAT = ['#d98e1f', '#f0a02e', '#f25c1f', '#de1a1a', '#b3123f', '#ff2e92']
const PEAK_HOLD_MS = 420
const PEAK_FALL = 0.16

export const createSpectrumMode = (): ModeRenderer => {
  let peaks = new Float32Array(0)
  let peakHold = new Float32Array(0)

  return {
    resize: ({ cols }) => {
      peaks = new Float32Array(cols)
      peakHold = new Float32Array(cols)
    },
    draw: ({ cell, cols, rows, frequency, flash, now }) => {
      for (let column = 0; column < cols; column++) {
        const value = magnitude(frequency, column / cols, (column + 1) / cols)
        const height = Math.round(value * rows)
        for (let row = 0; row < height; row++) cell(column, row, ramp(HEAT, row / rows))

        if (height >= peaks[column]) {
          peaks[column] = height
          peakHold[column] = now + PEAK_HOLD_MS
        } else if (now > peakHold[column]) {
          peaks[column] = Math.max(0, peaks[column] - PEAK_FALL)
        }

        const cap = Math.ceil(peaks[column]) - 1
        if (cap >= height && cap >= 0) cell(column, cap, flash > 0 ? '#14161f' : CAP)
      }
    },
  }
}
