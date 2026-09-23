import { useCallback, useRef } from 'react'

import { MODE_KEY } from './visualizer/constants'
import { useAnalyser } from './visualizer/engine/useAnalyser'
import { useLedGrid } from './visualizer/engine/useLedGrid'
import { useVisualizerLoop } from './visualizer/engine/useVisualizerLoop'
import { MODE_LABELS, MODES, type Mode } from './visualizer/modes'
import type { MusicTiming } from './visualizer/types'

interface VisualizerProps {
  audioContext: AudioContext | null
  sourceNode: AudioNode | null
  isPlaying: boolean
  getMusicTiming?: () => MusicTiming | null
  /** Override the default height/sizing classes (e.g. for a full-width hero). */
  sizeClass?: string
  /** Blend into the page: no border/shadow, transparent panel (only lit LEDs draw). */
  seamless?: boolean
  /** When paused, freeze the last frame instead of fading to blank. */
  paused?: boolean
  /** Internal render resolution per cell, in px (default 4). */
  sub?: number
  mode: Mode
  onModeChange: (mode: Mode) => void
}

const SUB = 4
export const VISUALIZER_MODES = MODES
export const VISUALIZER_MODE_LABELS = MODE_LABELS
export const VISUALIZER_MODE_STORAGE_KEY = MODE_KEY
export type VisualizerMode = Mode

export function Visualizer({
  audioContext,
  sourceNode,
  isPlaying,
  getMusicTiming,
  sizeClass,
  seamless,
  paused,
  sub: subProp,
  mode,
  onModeChange,
}: VisualizerProps) {
  const sub = subProp ?? SUB
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const grid = useLedGrid(wrapperRef, sub)
  const { analyserRef, frequencyRef, waveformRef } = useAnalyser(audioContext, sourceNode)

  useVisualizerLoop({
    canvasRef,
    analyserRef,
    frequencyRef,
    waveformRef,
    grid,
    sub,
    seamless,
    paused,
    isPlaying,
    getMusicTiming,
    mode,
  })

  const cycleMode = useCallback((direction: -1 | 1 = 1) => {
    onModeChange(MODES[(MODES.indexOf(mode) + direction + MODES.length) % MODES.length])
  }, [mode, onModeChange])

  return (
    <section
      role="button"
      tabIndex={0}
      aria-label={`Music visualizer (${MODE_LABELS[mode]} mode) — left for previous, right for next visualization`}
      aria-keyshortcuts="ArrowLeft ArrowRight"
      title={`${MODE_LABELS[mode]} — click left for previous, right for next visualization`}
      onClick={event => {
        const { left, width } = event.currentTarget.getBoundingClientRect()
        // Assistive activation has no pointer location and advances like Enter.
        cycleMode(event.detail > 0 && event.clientX < left + width / 2 ? -1 : 1)
      }}
      onKeyDown={event => {
        if (['ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(event.key)) {
          event.preventDefault()
          cycleMode(event.key === 'ArrowLeft' ? -1 : 1)
        }
      }}
      className={`${sizeClass ?? 'flex-shrink-0 h-20 md:h-28'} ${seamless ? '' : 'border-b border-faint'} select-none cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-faint`}
    >
      <div
        ref={wrapperRef}
        className={`relative w-full h-full overflow-hidden flex ${
          seamless
            ? 'items-end justify-start bg-transparent'
            : 'items-center justify-center bg-panel shadow-[inset_0_1px_4px_rgba(45,55,72,0.15)]'
        }`}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: grid.cols * sub,
            height: grid.rows * sub,
            imageRendering: mode === 'brushes' ? 'auto' : 'pixelated',
          }}
        />
      </div>
    </section>
  )
}
