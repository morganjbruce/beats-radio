import type { MusicTiming } from '../types'

// Strudel tracks use four quarter-note beats per cycle.
const PIXELS_PER_CYCLE = 4 * 12

export const createCityScroll = () => {
  let previousSeconds: number | undefined
  let distance = 0
  return {
    reset: () => {
      previousSeconds = undefined
      distance = 0
    },
    advance: (now: number, timing?: MusicTiming) => {
      const seconds = timing?.seconds ?? now / 1000
      const cps = timing?.cyclesPerSecond ?? 0.5
      const elapsed = previousSeconds === undefined ? 0 : seconds - previousSeconds
      previousSeconds = Number.isFinite(seconds) ? seconds : undefined
      // Re-entering a scene or returning from a background tab must not teleport it.
      // A suspended audio clock yields zero elapsed time, so pause/resume stays still.
      if (elapsed > 0 && elapsed <= 0.25 && Number.isFinite(cps) && cps >= 0)
        distance += elapsed * cps * PIXELS_PER_CYCLE
      return distance
    },
  }
}
