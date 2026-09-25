import { bassEnergy, magnitude, overallEnergy } from '../audioMetrics'
import type { ModeRenderer } from '../types'

export interface SceneAudio {
  bass: number
  treble: number
  energy: number
  beat: boolean
  /** Quarter-note position from the running song clock, when available. */
  beatPhase?: number
  beatCount?: number
}

export interface PixelArtScene {
  resize: (width: number, height: number) => void
  draw: (
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    audio: SceneAudio,
    dt: number,
  ) => void
}

const PIXEL_SIZE = 4

/** Share live audio, pause-safe time, and crisp scaling across the painted scenes. */
export const createPixelArtMode = (createScene: () => PixelArtScene): ModeRenderer => {
  let scene: PixelArtScene | undefined
  let surface: HTMLCanvasElement | undefined
  let surfaceContext: CanvasRenderingContext2D | null = null
  let needsResize = true
  let lastFrame = 0
  let lastFlash = 0
  const audio: SceneAudio = { bass: 0, treble: 0, energy: 0, beat: false }

  return {
    // The engine resizes all modes together. Prepare expensive artwork only when selected.
    resize: () => {
      needsResize = true
      lastFrame = 0
      lastFlash = 0
    },
    draw: ({ canvas, context, frequency, flash, now, musicTiming, resetFillCache }) => {
      const width = Math.ceil(canvas.width / PIXEL_SIZE)
      const height = Math.ceil(canvas.height / PIXEL_SIZE)
      if (width < 1 || height < 1) return
      if (!surface) {
        surface = document.createElement('canvas')
        surfaceContext = surface.getContext('2d')
      }
      if (!surfaceContext) return
      scene ??= createScene()
      if (needsResize || surface.width !== width || surface.height !== height) {
        surface.width = width
        surface.height = height
        scene.resize(width, height)
        needsResize = false
      }

      const dt = lastFrame ? Math.min(0.05, Math.max(0, (now - lastFrame) / 1000)) : 1 / 60
      lastFrame = now
      audio.bass = frequency.length >= 42 ? bassEnergy(frequency) : 0
      audio.treble = frequency.length >= 42 ? magnitude(frequency, 0.52, 0.92) : 0
      audio.energy = frequency.length >= 42 ? overallEnergy(frequency) : 0
      const beats = musicTiming?.cycles !== undefined
        ? Math.max(0, musicTiming.cycles * 4)
        : musicTiming && musicTiming.cyclesPerSecond > 0
          ? Math.max(0, musicTiming.seconds * musicTiming.cyclesPerSecond * 4)
          : undefined
      audio.beatCount = beats === undefined ? undefined : Math.floor(beats)
      audio.beatPhase = beats === undefined ? undefined : beats - Math.floor(beats)
      // The detector's flash lasts several frames; each onset is one particle/ripple event.
      audio.beat = flash > lastFlash
      lastFlash = flash
      scene.draw(surfaceContext, width, height, audio, dt)
      context.save()
      context.imageSmoothingEnabled = false
      context.drawImage(surface, 0, 0, width * PIXEL_SIZE, height * PIXEL_SIZE)
      context.restore()
      resetFillCache()
    },
  }
}
