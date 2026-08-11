import { bassEnergy, magnitude, overallEnergy } from '../audioMetrics'
import type { ModeRenderer } from '../types'

const JAPAN_SKY = ['#f4d8cf', '#efd8d9', '#d9d9e8', '#b9cee0']
const JAPAN_MOUNTAIN = '#536782'
const JAPAN_FAR = '#8999ad'
const JAPAN_SNOW = '#edf0f3'
const JAPAN_WATER = ['#cfdae4', '#b7cedd', '#91b7cd', '#6e9bb6']
const JAPAN_INK = '#26384b'
const JAPAN_RED = '#c83f3f'
const BLOSSOM = ['#f5becb', '#e88da6', '#d85d82']

interface Petal {
  x: number
  y: number
  vx: number
  vy: number
  phase: number
}

export const createJapanMode = (): ModeRenderer => {
  let sceneTime = 0
  let petals: Petal[] = []

  return {
    resize: () => {
      petals = []
    },
    draw: ({ cell, line, cols, rows, frequency, flash, tick }) => {
      const energy = overallEnergy(frequency)
      const bass = bassEnergy(frequency)
      const treble = magnitude(frequency, 0.52, 0.92)
      const centerX = (cols - 1) / 2
      const horizon = Math.floor(rows * 0.46)
      sceneTime += 0.18 + energy * 0.75

      for (let row = horizon; row < rows; row++) {
        const factor = (row - horizon) / Math.max(1, rows - horizon)
        const color =
          JAPAN_SKY[Math.min(JAPAN_SKY.length - 1, Math.floor(factor * JAPAN_SKY.length))]
        for (let column = 0; column < cols; column++) cell(column, row, color)
      }
      for (let row = 0; row < horizon; row++) {
        const factor = (horizon - row) / Math.max(1, horizon)
        const color =
          JAPAN_WATER[
            Math.min(JAPAN_WATER.length - 1, Math.floor(factor * JAPAN_WATER.length))
          ]
        for (let column = 0; column < cols; column++) cell(column, row, color)
      }

      const sunX = Math.round(cols * 0.72)
      const sunY = Math.round(rows * 0.72)
      const sunRadius = Math.max(2, Math.round(rows * 0.09 + bass))
      for (let row = sunY - sunRadius; row <= sunY + sunRadius; row++) {
        const half = Math.sqrt(Math.max(0, sunRadius * sunRadius - (row - sunY) ** 2))
        for (let column = Math.ceil(sunX - half); column <= Math.floor(sunX + half); column++)
          cell(column, row, '#d9695f')
      }
      for (let column = 0; column < cols; column++) {
        const hill =
          horizon + 1 + Math.round((Math.sin(column * 0.18) + 1) * rows * 0.035)
        for (let row = horizon; row <= hill; row++) cell(column, row, JAPAN_FAR)
      }

      const peakY = Math.round(rows * 0.82)
      const mountainHalf = Math.min(cols * 0.31, rows * 0.7)
      for (
        let column = Math.max(0, Math.ceil(centerX - mountainHalf));
        column <= Math.min(cols - 1, Math.floor(centerX + mountainHalf));
        column++
      ) {
        const edge = Math.abs(column - centerX) / mountainHalf
        const top = Math.round(horizon + (peakY - horizon) * (1 - edge))
        for (let row = horizon; row <= top; row++) {
          const snowLine =
            peakY - rows * 0.1 - Math.abs(column - centerX) * 0.15 + ((column * 5) % 3)
          cell(column, row, row >= snowLine ? JAPAN_SNOW : JAPAN_MOUNTAIN)
        }
        const reflectionDepth = top - horizon
        for (let depth = 1; depth <= reflectionDepth && horizon - depth >= 0; depth++) {
          const wave = Math.round(
            Math.sin(depth * 1.7 + sceneTime * 0.08) * (1 + energy * 3),
          )
          if (
            (column + depth + Math.floor(sceneTime * 0.04)) %
              (3 + Math.floor(depth / 7)) !==
            0
          )
            cell(
              column + wave,
              horizon - depth,
              depth < rows * 0.1 ? '#7898ac' : '#86a9bd',
            )
        }
      }
      for (let column = 0; column < cols; column++) cell(column, horizon, JAPAN_INK)

      for (let row = 1; row < horizon; row += 2) {
        const band = magnitude(
          frequency,
          row / Math.max(1, horizon),
          Math.min(1, (row + 2) / Math.max(1, horizon)),
        )
        const run = 2 + Math.round(band * 7)
        const shift = Math.floor(Math.sin(row + sceneTime * 0.12) * (1 + bass * 3))
        for (let column = ((row * 11 + shift) % 9) - 4; column < cols; column += 9)
          for (let offset = 0; offset < run && column + offset < cols; offset++)
            if (column + offset >= 0) cell(column + offset, row, JAPAN_WATER[3])
      }

      const gateX = Math.round(cols * 0.82)
      const gateHeight = Math.max(4, Math.round(rows * 0.13))
      line(gateX - 3, horizon, gateX - 3, horizon + gateHeight, JAPAN_RED)
      line(gateX + 3, horizon, gateX + 3, horizon + gateHeight, JAPAN_RED)
      line(gateX - 5, horizon + gateHeight, gateX + 5, horizon + gateHeight, JAPAN_RED)
      line(
        gateX - 4,
        horizon + gateHeight - 2,
        gateX + 4,
        horizon + gateHeight - 2,
        JAPAN_RED,
      )

      const bend = Math.sin(sceneTime * 0.025) * 2
      line(0, rows - 2, cols * 0.18, rows * 0.79 + bend, JAPAN_INK)
      line(cols * 0.1, rows * 0.87, cols * 0.28, rows * 0.9 + bend, JAPAN_INK)
      line(cols * 0.13, rows * 0.84, cols * 0.22, rows * 0.71 + bend, JAPAN_INK)

      if (tick % 5 === 0) {
        const count = 1 + (flash > 0 ? 3 : 0) + (treble > 0.3 ? 1 : 0)
        for (let index = 0; index < count && petals.length < 90; index++)
          petals.push({
            x: cols * (0.08 + Math.random() * 0.25),
            y: rows * (0.72 + Math.random() * 0.24),
            vx: 0.18 + treble * 0.8 + Math.random() * 0.25,
            vy: -0.03 - Math.random() * 0.08,
            phase: Math.random() * Math.PI * 2,
          })
      }
      for (const petal of petals) {
        petal.x += petal.vx
        petal.y += petal.vy + Math.sin(sceneTime * 0.06 + petal.phase) * 0.08
        const column = Math.round(petal.x)
        const row = Math.round(petal.y)
        if (column >= 0 && column < cols && row >= 0 && row < rows) {
          cell(column, row, BLOSSOM[Math.abs(Math.floor(petal.phase * 2)) % BLOSSOM.length])
          if (flash > 0 && column + 1 < cols) cell(column + 1, row, BLOSSOM[0])
        }
      }
      petals = petals.filter(petal => petal.x < cols + 2 && petal.y > horizon - 2)
    },
  }
}
