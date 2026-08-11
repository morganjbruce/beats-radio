import { useEffect, useRef, useState, type RefObject } from 'react'

import { bassEnergy } from '../audioMetrics'
import { PANEL, STOP_TAIL_MS, UNLIT } from '../constants'
import { drawIdle } from '../idleRenderer'
import { createModeRegistry, type Mode } from '../modes'
import { createPixelPainter } from '../pixelPainter'
import type { GridSize, ModeRenderer } from '../types'

interface VisualizerLoopOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>
  analyserRef: RefObject<AnalyserNode | null>
  frequencyRef: RefObject<Uint8Array<ArrayBuffer>>
  waveformRef: RefObject<Uint8Array<ArrayBuffer>>
  grid: GridSize
  sub: number
  seamless?: boolean
  idleAnimation?: boolean
  paused?: boolean
  isPlaying: boolean
  mode: Mode
}

const createUnlitGrid = ({ cols, rows }: GridSize, sub: number) => {
  const canvas = document.createElement('canvas')
  canvas.width = cols * sub
  canvas.height = rows * sub
  const context = canvas.getContext('2d')
  if (!context) return canvas

  context.fillStyle = PANEL
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = UNLIT
  for (let column = 0; column < cols; column++)
    for (let row = 0; row < rows; row++)
      context.fillRect(column * sub, row * sub, sub - 1, sub - 1)
  return canvas
}

export const useVisualizerLoop = ({
  canvasRef,
  analyserRef,
  frequencyRef,
  waveformRef,
  grid,
  sub,
  seamless,
  idleAnimation,
  paused,
  isPlaying,
  mode,
}: VisualizerLoopOptions) => {
  const [modeRegistry] = useState<Record<Mode, ModeRenderer>>(createModeRegistry)

  const seamlessRef = useRef(seamless)
  const idleAnimationRef = useRef(idleAnimation)
  const pausedRef = useRef(paused)
  const playingRef = useRef(isPlaying)
  const modeRef = useRef(mode)
  const stoppedAtRef = useRef(0)

  useEffect(() => {
    seamlessRef.current = seamless
    idleAnimationRef.current = idleAnimation
    pausedRef.current = paused
  }, [seamless, idleAnimation, paused])

  useEffect(() => {
    if (playingRef.current && !isPlaying) stoppedAtRef.current = performance.now()
    playingRef.current = isPlaying
  }, [isPlaying])

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    const { cols, rows } = grid
    const canvas = canvasRef.current
    if (!cols || !rows || !canvas) return

    canvas.width = cols * sub
    canvas.height = rows * sub
    const context = canvas.getContext('2d')
    if (!context) return

    for (const renderer of Object.values(modeRegistry)) renderer.resize(grid)

    const unlitGrid = createUnlitGrid(grid, sub)
    const painter = createPixelPainter(context, grid, sub, seamlessRef.current === true)
    let tick = 0
    let bassAverage = 0
    let flash = 0
    let animationFrame = 0

    const frame = (now: number) => {
      animationFrame = requestAnimationFrame(frame)
      if (pausedRef.current) return

      tick++
      painter.resetFillCache()
      if (seamlessRef.current) context.clearRect(0, 0, canvas.width, canvas.height)
      else context.drawImage(unlitGrid, 0, 0)

      const analyser = analyserRef.current
      const active = playingRef.current || now - stoppedAtRef.current < STOP_TAIL_MS
      if (analyser && active) {
        const frequency = frequencyRef.current
        const waveform = waveformRef.current
        analyser.getByteFrequencyData(frequency)

        const bass = bassEnergy(frequency)
        bassAverage = bassAverage === 0 ? bass : bassAverage * 0.95 + bass * 0.05
        if (bass > 0.3 && bass > bassAverage * 1.35 && flash <= 0) flash = 5
        else if (flash > 0) flash--

        const renderer = modeRegistry[modeRef.current]
        if (renderer.needsWaveform) analyser.getByteTimeDomainData(waveform)
        renderer.draw({
          ...grid,
          canvas,
          context,
          cell: painter.cell,
          line: painter.line,
          frequency,
          waveform,
          tick,
          flash,
          now,
          resetFillCache: painter.resetFillCache,
        })
      } else if (idleAnimationRef.current !== false) {
        drawIdle(now, grid, painter.cell)
      }
    }

    animationFrame = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(animationFrame)
  }, [analyserRef, canvasRef, frequencyRef, grid, modeRegistry, sub, waveformRef])
}
