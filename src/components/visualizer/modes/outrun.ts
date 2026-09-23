import { bassEnergy, magnitude, overallEnergy } from '../audioMetrics'
import { ramp } from '../constants'
import type { ModeRenderer } from '../types'
import { fineDisc } from './finePixels'

const OUTRUN_INK = '#123350'
const OUTRUN_HORIZON = '#6431c9'
export const OUTRUN_GRID = '#705344'
const OUTRUN_SUNSET = ['#ffb41f', '#ff761a', '#f83d34', '#ff348e']
const OUTRUN_SKY = ['#fbe4c5', '#f9e9dc', '#c3e4f2']
const OUTRUN_SAND = '#e9c08a'
const OUTRUN_SAND_LINE = '#d5a876'
const OUTRUN_ROAD = '#829ebd'
const OUTRUN_FROND = '#087669'

interface Palm {
  z: number
  side: number
}

export const createOutrunMode = (): ModeRenderer => {
  const scale = 2
  const sky = OUTRUN_SKY
  const sandColor = OUTRUN_SAND
  const sandLine = OUTRUN_SAND_LINE
  const roadColor = OUTRUN_ROAD
  let roadZ = 0
  let palms: Palm[] = []
  let roadLeft = new Int16Array(0)
  let roadRight = new Int16Array(0)
  let roadDistance = new Float32Array(0)
  let roadFlags = new Uint8Array(0)
  let roadHalf = 0
  let horizonHalf = 0

  return {
    resize: ({ cols, rows }) => {
      roadZ = 0
      // Populate the avenue immediately instead of waiting for trees to reach the foreground.
      palms = Array.from({ length: 6 }, (_, index) => ({
        z: 0.12 + Math.floor(index / 2) * 0.34 + (index % 2) * 0.03,
        side: index % 2 === 0 ? -1 : 1,
      }))
      roadLeft = new Int16Array(rows)
      roadRight = new Int16Array(rows)
      roadDistance = new Float32Array(rows)
      roadFlags = new Uint8Array(rows)

      const horizon = Math.floor(rows * 0.55)
      const centerX = (cols - 1) / 2
      roadHalf = cols * 0.42
      horizonHalf = Math.max(3, cols * 0.035)
      for (let row = 0; row < horizon; row++) {
        const nearness = (horizon - row) / horizon
        const half = Math.max(1, horizonHalf + (roadHalf - horizonHalf) * Math.pow(nearness, 1.2))
        roadLeft[row] = Math.round(centerX - half)
        roadRight[row] = Math.round(centerX + half)
        roadDistance[row] = (1 / Math.max(0.04, nearness)) * 2
        roadFlags[row] = (nearness > 0.55 ? 1 : 0) | (nearness > 0.7 ? 2 : 0)
      }
    },
    draw: ({ cell, line, cols, rows, frequency, flash }) => {
      const energy = overallEnergy(frequency)
      const bass = bassEnergy(frequency)
      const horizon = Math.floor(rows * 0.55)
      const centerX = (cols - 1) / 2
      roadZ += 0.08 + energy * 0.55

      for (let row = horizon + 1; row < rows; row++) {
        const factor = (row - horizon) / (rows - horizon)
        const tint = sky[factor < 0.35 ? 0 : factor < 0.7 ? 1 : 2]
        for (let column = 0; column < cols; column++) cell(column, row, tint)
      }

      const sunRadius = rows * 0.34 * (1 + bass * 0.12) + (flash > 0 ? scale : 0)
      fineDisc(cell, centerX, horizon, sunRadius, row => {
        const dy = row - horizon
        const factor = dy / sunRadius
        if (factor < 0.45 && dy % 3 === 0) return
        return ramp(OUTRUN_SUNSET, Math.min(0.999, factor))
      }, horizon)
      for (let column = 0; column < cols; column++) {
        const value = magnitude(frequency, column / cols, (column + 1) / cols)
        const height = Math.round(Math.pow(value, 1.4) * rows * 0.14)
        for (let row = horizon + 1; row <= Math.min(rows - 1, horizon + height); row++)
          cell(column, row, '#687b99')
      }
      for (let column = 0; column < cols; column++)
        cell(column, horizon, OUTRUN_HORIZON)

      const centerColumn = Math.round(centerX)
      const dash = flash > 0 ? '#ffe88b' : '#ffc34c'
      for (let row = 0; row < horizon; row++) {
        const left = roadLeft[row]
        const right = roadRight[row]
        const flags = roadFlags[row]
        const phase = Math.floor(roadDistance[row] - roadZ)
        const sand = phase % 4 === 0 ? sandLine : sandColor
        for (let column = 0; column < Math.min(left, cols); column++) cell(column, row, sand)
        for (let column = Math.max(right + 1, 0); column < cols; column++)
          cell(column, row, sand)
        for (
          let column = Math.max(0, left + 1);
          column <= Math.min(cols - 1, right - 1);
          column++
        )
          cell(column, row, roadColor)
        if (left >= 0) cell(left, row, OUTRUN_INK)
        if (right < cols) cell(right, row, OUTRUN_INK)
        cell(left + 1, row, OUTRUN_INK)
        cell(right - 1, row, OUTRUN_INK)
        if (flags & 1) {
          cell(left + 2, row, OUTRUN_INK)
          cell(right - 2, row, OUTRUN_INK)
        }
        if (phase % 2 === 0) {
          cell(centerColumn, row, dash)
          cell(centerColumn - 1, row, dash)
          if (flags & 2) cell(centerColumn + 1, row, dash)
        }
      }

      if (palms.length < 7 && !palms.some(palm => palm.z < 0.14)) {
        palms.push({ z: 0.05, side: Math.random() < 0.5 ? -1 : 1 })
      }
      for (const palm of palms)
        palm.z += (0.0025 + energy * 0.011) * (0.25 + palm.z * 1.6)
      palms = palms.filter(palm => palm.z < 1.25)
      palms.sort((a, b) => a.z - b.z)

      for (const palm of palms) {
        const nearness = Math.min(1, palm.z)
        const baseRow = Math.round(horizon * (1 - nearness))
        const half = horizonHalf + (roadHalf - horizonHalf) * Math.pow(nearness, 1.2)
        const verge = 2 + nearness * 4
        const column = Math.round(centerX + palm.side * (half + verge))
        if (column < -3 * scale || column > cols + 2 * scale) continue
        const height = Math.max(2, Math.round(nearness * rows * 0.4))
        const crownX = column + Math.round(palm.side * height * 0.08)
        const crownY = baseRow + height
        const trunkWidth = Math.max(2, Math.round(1 + nearness * 3))
        for (let offset = 0; offset < trunkWidth; offset++)
          line(column + offset, baseRow, crownX + offset, crownY, OUTRUN_INK)
        const spread = Math.max(4, Math.round(4 + nearness * 14))
        for (const side of [-1, 1]) {
          for (const lift of [-0.4, 0.35, 0.8]) {
            const reach = Math.round(spread * (lift > 0.5 ? 0.6 : 1))
            for (let step = 0; step <= reach; step++) {
              const frondY = crownY + Math.round(step * lift + Math.sin(step / reach * Math.PI) * 2)
              const thickness = Math.max(1, Math.round((1 - step / (reach + 1)) * (1 + nearness * 3)))
              for (let offset = -thickness; offset <= thickness; offset++)
                cell(crownX + side * step, frondY + offset, OUTRUN_FROND)
            }
          }
        }
      }
    },
  }
}
