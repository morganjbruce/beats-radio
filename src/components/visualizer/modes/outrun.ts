import { bassEnergy, magnitude, overallEnergy } from '../audioMetrics'
import { CAP, ramp } from '../constants'
import type { ModeRenderer } from '../types'

const SUNSET = ['#e8a13c', '#f25c1f', '#de1a1a', '#ff2e92']
const OUTRUN_INK = '#123350'
const OUTRUN_FROND = '#0f6f7a'
const OUTRUN_HORIZON = '#6431c9'
const OUTRUN_SKY = ['#f7d9c2', '#f6e2d4', '#f2e9ec']
const OUTRUN_SAND = '#eee4cf'
const OUTRUN_SAND_LINE = '#ddcfae'
const OUTRUN_ROAD = '#d5dcec'
const FAN_BIG: [number, number][] = [
  [0, 1],
  [-1, 1],
  [1, 1],
  [-2, 0],
  [2, 0],
  [-3, -1],
  [3, -1],
  [-1, 2],
  [1, 2],
]
const FAN_SMALL: [number, number][] = [
  [0, 1],
  [-1, 0],
  [1, 0],
  [-2, -1],
  [2, -1],
]

interface Palm {
  z: number
  side: number
}

export const createOutrunMode = (): ModeRenderer => {
  let roadZ = 0
  let palms: Palm[] = []
  let roadLeft = new Int16Array(0)
  let roadRight = new Int16Array(0)
  let roadDistance = new Float32Array(0)
  let roadFlags = new Uint8Array(0)
  let roadHalf = 0

  return {
    resize: ({ cols, rows }) => {
      roadZ = 0
      palms = []
      roadLeft = new Int16Array(rows)
      roadRight = new Int16Array(rows)
      roadDistance = new Float32Array(rows)
      roadFlags = new Uint8Array(rows)

      const horizon = Math.floor(rows * 0.55)
      const centerX = (cols - 1) / 2
      roadHalf = cols * Math.min(0.44, Math.max(0.3, 0.3 * (rows / cols)))
      for (let row = 0; row < horizon; row++) {
        const nearness = (horizon - row) / horizon
        const half = Math.max(1, roadHalf * Math.pow(nearness, 1.2))
        roadLeft[row] = Math.round(centerX - half)
        roadRight[row] = Math.round(centerX + half)
        roadDistance[row] = (1 / Math.max(0.04, nearness)) * 2
        roadFlags[row] = (nearness > 0.55 ? 1 : 0) | (nearness > 0.7 ? 2 : 0)
      }
    },
    draw: ({ cell, cols, rows, frequency, flash }) => {
      const energy = overallEnergy(frequency)
      const bass = bassEnergy(frequency)
      const horizon = Math.floor(rows * 0.55)
      const centerX = (cols - 1) / 2
      roadZ += 0.08 + energy * 0.55

      for (let row = horizon + 1; row < rows; row++) {
        const factor = (row - horizon) / (rows - horizon)
        const tint = OUTRUN_SKY[factor < 0.35 ? 0 : factor < 0.7 ? 1 : 2]
        for (let column = 0; column < cols; column++) cell(column, row, tint)
      }

      const sunRadius = rows * 0.34 * (1 + bass * 0.12) + (flash > 0 ? 1 : 0)
      for (let row = horizon; row < rows; row++) {
        const dy = row - horizon
        if (dy >= sunRadius) break
        const factor = dy / sunRadius
        if (factor < 0.45 && dy % 2 === 0) continue
        const half = Math.sqrt(sunRadius * sunRadius - dy * dy)
        for (
          let column = Math.max(0, Math.ceil(centerX - half));
          column <= Math.min(cols - 1, Math.floor(centerX + half));
          column++
        )
          cell(column, row, ramp(SUNSET, Math.min(0.999, factor)))
      }

      for (let column = 0; column < cols; column++) {
        const value = magnitude(frequency, column / cols, (column + 1) / cols)
        const height = Math.round(Math.pow(value, 1.4) * rows * 0.14)
        for (let row = horizon + 1; row <= Math.min(rows - 1, horizon + height); row++)
          cell(column, row, CAP)
      }
      for (let column = 0; column < cols; column++)
        cell(column, horizon, OUTRUN_HORIZON)

      const centerColumn = Math.round(centerX)
      const dash = flash > 0 ? '#14161f' : '#d98e1f'
      for (let row = 0; row < horizon; row++) {
        const left = roadLeft[row]
        const right = roadRight[row]
        const flags = roadFlags[row]
        const phase = Math.floor(roadDistance[row] - roadZ)
        const sand = phase % 4 === 0 ? OUTRUN_SAND_LINE : OUTRUN_SAND
        for (let column = 0; column < Math.min(left, cols); column++) cell(column, row, sand)
        for (let column = Math.max(right + 1, 0); column < cols; column++)
          cell(column, row, sand)
        for (
          let column = Math.max(0, left + 1);
          column <= Math.min(cols - 1, right - 1);
          column++
        )
          cell(column, row, OUTRUN_ROAD)
        if (left >= 0) cell(left, row, OUTRUN_INK)
        if (right < cols) cell(right, row, OUTRUN_INK)
        if (flags & 1) {
          if (left - 1 >= 0) cell(left - 1, row, OUTRUN_INK)
          if (right + 1 < cols) cell(right + 1, row, OUTRUN_INK)
        }
        if (phase % 2 === 0) {
          cell(centerColumn, row, dash)
          if (flags & 2) cell(centerColumn - 1, row, dash)
        }
      }

      if (palms.length < 7 && !palms.some(palm => palm.z < 0.14))
        palms.push({ z: 0.05, side: Math.random() < 0.5 ? -1 : 1 })
      for (const palm of palms)
        palm.z += (0.0025 + energy * 0.011) * (0.25 + palm.z * 1.6)
      palms = palms.filter(palm => palm.z < 1.25)

      for (const palm of palms) {
        const nearness = Math.min(1, palm.z)
        const baseRow = Math.round(horizon * (1 - nearness))
        const half = roadHalf * Math.pow(nearness, 1.2)
        const column = Math.round(centerX + palm.side * (half + 3 + nearness * 7))
        if (column < -3 || column > cols + 2) continue
        const height = Math.max(2, Math.round(nearness * rows * 0.4))
        for (let row = baseRow; row <= Math.min(rows - 1, baseRow + height); row++)
          if (column >= 0 && column < cols) cell(column, row, OUTRUN_INK)
        const topRow = baseRow + height
        const fan = height >= 5 ? FAN_BIG : FAN_SMALL
        for (const [columnOffset, rowOffset] of fan) {
          const fanColumn = column + columnOffset
          const fanRow = topRow + rowOffset
          if (fanColumn >= 0 && fanColumn < cols && fanRow >= 0 && fanRow < rows)
            cell(fanColumn, fanRow, OUTRUN_FROND)
        }
      }
    },
  }
}
