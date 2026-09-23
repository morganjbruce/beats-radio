export interface BrushLevels {
  bass: number
  melody: number
  percussion: number
  hit: boolean
}

// Relative FFT bands: lows, mids and highs, not instrument/stem separation.
const band = (frequency: Uint8Array, from: number, to: number) => {
  const first = Math.max(1, Math.floor(frequency.length * from))
  const end = Math.min(frequency.length, Math.max(first + 1, Math.ceil(frequency.length * to)))
  let squares = 0
  let peak = 0
  for (let i = first; i < end; i++) {
    const value = frequency[i] / 255
    squares += value * value
    peak = Math.max(peak, value)
  }
  return end > first ? Math.sqrt(squares / (end - first)) * 0.75 + peak * 0.25 : 0
}

export function createBrushDynamics() {
  let bass = 0
  let melody = 0
  let percussion = 0
  let highAverage = 0
  let cooldown = 0
  let armed = true
  return {
    update(frequency: Uint8Array, dt: number): BrushLevels {
      const step = Math.max(0, Math.min(dt, 0.05))
      const low = band(frequency, 0.001, 0.009)
      const mid = band(frequency, 0.009, 0.09)
      const high = band(frequency, 0.09, 0.7)
      bass += (low - bass) * (1 - Math.exp(-step * 12))
      melody += (mid - melody) * (1 - Math.exp(-step * 9))
      percussion += (high - percussion) * (1 - Math.exp(-step * 28))
      highAverage += (high - highAverage) * (1 - Math.exp(-step * 3))
      cooldown = Math.max(0, cooldown - step)
      const rise = percussion - highAverage
      if (rise < 0.018) armed = true
      const hit = armed && !cooldown && percussion > 0.07 && rise > 0.035
      if (hit) {
        armed = false
        cooldown = 0.11
      }
      return { bass, melody, percussion, hit }
    },
  }
}
