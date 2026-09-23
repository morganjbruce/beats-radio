import type { ModeFrame, ModeRenderer } from '../types'
import { createBrushDynamics } from './brushDynamics'
import { createBrushMotion } from './brushMotion'
import { createBrushPigment } from './brushPigment'
import { addPoint, createPaper, noise, paintBrush, type Brush } from './paintTexture'

interface Dab { x: number; y: number; angle: number; strength: number; time: number; seed: number }
const MAX_EDGE = 1100
const SAMPLE_INTERVAL = 1 / 30

export const createThreeBrushesMode = (): ModeRenderer => {
  let surface: HTMLCanvasElement | undefined
  let paper: HTMLCanvasElement | undefined
  let dynamics = createBrushDynamics()
  let bassMotion = createBrushMotion(false)
  let melodyMotion = createBrushMotion(true)
  let pigment = createBrushPigment()
  let percussionPhase = Math.random() * Math.PI * 2
  let previousTime: number | undefined
  let time = 0
  let motion = 0
  let accumulator = 0
  let dabSeed = 0
  const bassLayers: Brush[] = []
  const melody: Brush = { points: [], color: '#174f8d', bristles: 6, life: 10, naturalTip: true }
  const dabs: Dab[] = []

  const reset = () => {
    surface = undefined
    paper = undefined
    dynamics = createBrushDynamics()
    bassMotion = createBrushMotion(false)
    melodyMotion = createBrushMotion(true)
    pigment = createBrushPigment()
    percussionPhase = Math.random() * Math.PI * 2
    previousTime = undefined
    time = motion = accumulator = dabSeed = 0
    bassLayers.length = melody.points.length = dabs.length = 0
  }

  return {
    resize: reset,
    draw(frame: ModeFrame) {
      const scale = Math.min(1, MAX_EDGE / Math.max(frame.canvas.width, frame.canvas.height))
      const width = Math.max(1, Math.round(frame.canvas.width * scale))
      const height = Math.max(1, Math.round(frame.canvas.height * scale))
      if (!surface || surface.width !== width || surface.height !== height) {
        reset()
        surface = document.createElement('canvas')
        surface.width = width
        surface.height = height
        paper = createPaper(width, height)
      }
      const ctx = surface.getContext('2d')
      if (!ctx || !paper) return
      const gap = previousTime === undefined ? 0 : (frame.now - previousTime) / 1000
      const dt = previousTime === undefined || gap > 0.25 ? 1 / 60 : Math.max(0, Math.min(0.05, gap))
      previousTime = frame.now
      time += dt
      const levels = dynamics.update(frame.frequency, dt)
      motion += dt * (0.75 + levels.bass * 0.6 + levels.melody * 0.3)
      const unit = Math.min(width, height)
      const bassPosition = bassMotion.update(dt, levels.bass > 0.045, levels.bass)
      const melodyPosition = melodyMotion.update(dt, levels.melody > 0.035, levels.melody)
      accumulator += dt
      if (accumulator >= SAMPLE_INTERVAL) {
        accumulator %= SAMPLE_INTERVAL
        if (bassPosition) {
          const color = pigment.forStroke(bassPosition.stroke)
          let bass = bassLayers.at(-1)
          if (!bass || bass.color !== color.color) {
            // Keep each pigment batch separate so earlier paint retains its colour.
            bass = { ...color, points: [], bristles: 25, life: 12, naturalTip: true }
            bassLayers.push(bass)
          }
          const pressure = Math.sqrt(levels.bass)
          addPoint(bass, bassPosition, width, height, unit * (0.025 + pressure * 0.12), time)
        }
        if (melodyPosition) {
          addPoint(melody, melodyPosition, width, height, unit * (0.005 + levels.melody * 0.014), time)
        }
      }
      if (levels.hit) {
        dabs.push({ x: width * (0.5 + 0.41 * Math.sin(motion * 0.49 + percussionPhase)),
          y: height * (0.5 + 0.31 * Math.sin(motion * 0.91 + percussionPhase + 1.4)),
          angle: -0.3 + 0.6 * Math.sin(motion * 0.7), strength: levels.percussion,
          time, seed: dabSeed++ })
      }
      while (dabs.length && time - dabs[0].time > 9) dabs.shift()

      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      ctx.drawImage(paper, 0, 0)
      ctx.globalCompositeOperation = 'multiply'
      for (const bass of bassLayers) paintBrush(ctx, bass, time, unit)
      while (bassLayers.length && !bassLayers[0].points.length) bassLayers.shift()
      paintBrush(ctx, melody, time, unit)
      ctx.strokeStyle = '#c28a22'
      for (const dab of dabs) {
        const fade = Math.pow(1 - (time - dab.time) / 9, 1.4)
        const size = unit * (0.025 + dab.strength * 0.065)
        ctx.save()
        ctx.translate(dab.x, dab.y)
        ctx.rotate(dab.angle)
        for (let bristle = 0; bristle < 11; bristle++) {
          const roughness = noise(dab.seed * 31 + bristle)
          ctx.globalAlpha = fade * (0.48 + roughness * 0.4)
          ctx.lineWidth = Math.max(0.7, unit * 0.002)
          const x = (bristle - 5) * size * 0.045
          ctx.beginPath()
          ctx.moveTo(x, -size * (0.35 + roughness * 0.2))
          ctx.lineTo(x + size * 0.09, size * (0.25 + noise(bristle * 7 + dab.seed) * 0.35))
          ctx.stroke()
        }
        ctx.restore()
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      frame.context.save()
      frame.context.imageSmoothingEnabled = true
      frame.context.drawImage(surface, 0, 0, frame.canvas.width, frame.canvas.height)
      frame.context.restore()
      frame.resetFillCache()
    },
  }
}
