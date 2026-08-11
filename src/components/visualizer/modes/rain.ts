import { magnitude, overallEnergy } from '../audioMetrics'
import { ramp } from '../constants'
import type { ModeRenderer } from '../types'

const HUES = [210, 190, 170, 140, 100, 50, 28, 5, 335, 310, 275, 240]
const LIGHTNESS = [82, 72, 62, 52, 43, 32]
const RAIN_RAMPS = HUES.map(hue =>
  LIGHTNESS.map(lightness => `hsl(${hue} 68% ${lightness}%)`),
)
const COLOR_HOLD_TICKS = 90

interface Drop {
  c: number
  y: number
  spd: number
  len: number
  hue: number
}

interface Splash {
  c: number
  ttl: number
  hue: number
}

export const createRainMode = (): ModeRenderer => {
  let drops: Drop[] = []
  let splashes: Splash[] = []
  let puddle = new Float32Array(0)
  let puddleHue = new Uint8Array(0)
  let colorTick = 0

  return {
    resize: ({ cols }) => {
      drops = []
      splashes = []
      puddle = new Float32Array(cols)
      puddleHue = new Uint8Array(cols)
      colorTick = 0
    },
    draw: ({ cell, cols, rows, frequency, tick, flash }) => {
      colorTick++
      if (tick % 2 === 0) {
        const energy = overallEnergy(frequency)
        const hue = Math.floor(colorTick / COLOR_HOLD_TICKS) % RAIN_RAMPS.length
        const spawn = Math.min(
          cols >> 2,
          Math.round(energy * energy * cols * 0.15) +
            (flash > 0 ? Math.round(cols * 0.06) : 0) +
            (energy > 0.05 ? 1 : 0),
        )
        for (let index = 0; index < spawn && drops.length < 500; index++) {
          const column = Math.floor(Math.random() * cols)
          const value = magnitude(frequency, column / cols, (column + 1) / cols)
          drops.push({
            c: column,
            y: rows - 1 + Math.random() * 6,
            spd: 0.7 + value * 1.6 + Math.random() * 0.5,
            len: 4 + Math.round(value * 6),
            hue,
          })
        }

        for (const drop of drops) {
          const wasAbove = drop.y >= 0
          drop.y -= drop.spd
          if (wasAbove && drop.y < 0) {
            splashes.push({ c: drop.c, ttl: 5, hue: drop.hue })
            puddle[drop.c] = Math.min(1, puddle[drop.c] + 0.45)
            puddleHue[drop.c] = drop.hue
            if (drop.c > 0) {
              puddle[drop.c - 1] = Math.min(1, puddle[drop.c - 1] + 0.18)
              puddleHue[drop.c - 1] = drop.hue
            }
            if (drop.c < cols - 1) {
              puddle[drop.c + 1] = Math.min(1, puddle[drop.c + 1] + 0.18)
              puddleHue[drop.c + 1] = drop.hue
            }
          }
        }
        drops = drops.filter(drop => drop.y > -8)
        for (const splash of splashes) splash.ttl--
        splashes = splashes.filter(splash => splash.ttl > 0)
        for (let column = 0; column < cols; column++) puddle[column] *= 0.93
      }

      for (let column = 0; column < cols; column++) {
        const level = puddle[column]
        if (level > 0.06) {
          const rain = RAIN_RAMPS[puddleHue[column]]
          cell(column, 0, ramp(rain, Math.min(0.999, 0.35 + level * 0.6)))
          if (level > 0.55) cell(column, 1, ramp(rain, level * 0.5))
        }
      }
      for (const splash of splashes) {
        const rain = RAIN_RAMPS[splash.hue]
        const spread = splash.ttl > 3 ? 1 : 2
        if (splash.c - spread >= 0) cell(splash.c - spread, 1, ramp(rain, 0.55))
        if (splash.c + spread < cols) cell(splash.c + spread, 1, ramp(rain, 0.55))
        if (splash.ttl > 3) cell(splash.c, 2, ramp(rain, 0.7))
      }
      for (const drop of drops) {
        const rain = RAIN_RAMPS[drop.hue]
        const head = Math.round(drop.y)
        for (let index = drop.len; index >= 1; index--) {
          const row = head + index
          if (row >= 0 && row < rows)
            cell(drop.c, row, ramp(rain, Math.max(0, 1 - index / drop.len) * 0.75))
        }
        if (head >= 0 && head < rows)
          cell(drop.c, head, flash > 0 ? '#14161f' : rain[rain.length - 1])
      }
    },
  }
}
