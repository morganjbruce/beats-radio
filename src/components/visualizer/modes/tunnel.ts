import { bassEnergy, magnitude } from '../audioMetrics'
import { ramp } from '../constants'
import type { ModeRenderer } from '../types'

const MIAMI = ['#0f6f7a', '#1b9aaa', '#3fd0d4', '#f25fd0', '#ff2e92']
const TUNNEL_BANDS = 10
const RING_WIDTH = 3

export const createTunnelMode = (): ModeRenderer => {
  let radius = new Float32Array(0)
  const bands = new Float32Array(TUNNEL_BANDS)
  let zoom = 0

  return {
    resize: ({ cols, rows }) => {
      radius = new Float32Array(cols * rows)
      const centerX = (cols - 1) / 2
      const centerY = (rows - 1) / 2
      for (let column = 0; column < cols; column++)
        for (let row = 0; row < rows; row++)
          radius[column * rows + row] = Math.hypot(column - centerX, row - centerY)
    },
    draw: ({ cell, cols, rows, frequency }) => {
      zoom += 0.12 + bassEnergy(frequency) * 0.9
      bands.fill(0)
      for (let band = 0; band < TUNNEL_BANDS; band++)
        bands[band] = magnitude(frequency, band / TUNNEL_BANDS, (band + 1) / TUNNEL_BANDS)

      for (let column = 0; column < cols; column++)
        for (let row = 0; row < rows; row++) {
          const ring = Math.floor((radius[column * rows + row] - zoom) / RING_WIDTH)
          const band = ((ring % TUNNEL_BANDS) + TUNNEL_BANDS) % TUNNEL_BANDS
          if (bands[band] > 0.24)
            cell(column, row, ramp(MIAMI, (band + 0.5) / TUNNEL_BANDS))
        }
    },
  }
}
