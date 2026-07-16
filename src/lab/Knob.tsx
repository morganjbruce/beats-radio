import { useCallback, useEffect, useRef } from 'react'

// Rotary dial: 270° sweep, drag vertically to change, double-click to reset + disable.
// Dragging a disabled knob enables it — "reach for the knob" is the gesture that patches
// the transform into the chain. Log-scaled knobs (filter cutoffs) work in normalized
// position space so the drag feels linear.

export interface KnobProps {
  label: string
  value: number
  min: number
  max: number
  /** Log-scale the sweep (frequencies). min must be > 0. */
  log?: boolean
  on: boolean
  /** Rendered value, e.g. "800 hz" / "0.35". */
  format: (v: number) => string
  onChange: (value: number) => void
  onToggle: (on: boolean) => void
}

const SWEEP = 270 // degrees
const START = -135

const toNorm = (v: number, min: number, max: number, log?: boolean) =>
  log ? Math.log(v / min) / Math.log(max / min) : (v - min) / (max - min)
const fromNorm = (n: number, min: number, max: number, log?: boolean) =>
  log ? min * Math.pow(max / min, n) : min + n * (max - min)

export function Knob({ label, value, min, max, log, on, format, onChange, onToggle }: KnobProps) {
  const dragState = useRef<{ startY: number; startNorm: number } | null>(null)
  // live refs so the document-level move handler sees current props without re-binding
  const propsRef = useRef({ min, max, log, on, onChange, onToggle })
  useEffect(() => {
    propsRef.current = { min, max, log, on, onChange, onToggle }
  })

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    const p = propsRef.current
    if (!p.on) p.onToggle(true)
    dragState.current = {
      startY: e.clientY,
      startNorm: Math.max(0, Math.min(1, toNorm(value, p.min, p.max, p.log))),
    }
    const move = (ev: PointerEvent) => {
      const d = dragState.current
      if (!d) return
      const norm = Math.max(0, Math.min(1, d.startNorm + (d.startY - ev.clientY) / 150))
      propsRef.current.onChange(fromNorm(norm, propsRef.current.min, propsRef.current.max, propsRef.current.log))
    }
    const up = () => {
      dragState.current = null
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', up)
    }
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerup', up)
  }, [value])

  const norm = Math.max(0, Math.min(1, toNorm(value, min, max, log)))
  const angle = START + norm * SWEEP
  const ink = on ? '#2d3748' : '#c3cde0'
  const accent = on ? '#de1a1a' : '#c3cde0'

  // value arc path (SVG arc from START to current angle on r=20)
  const polar = (deg: number, r: number) => {
    const rad = ((deg - 90) * Math.PI) / 180
    return [24 + r * Math.cos(rad), 24 + r * Math.sin(rad)]
  }
  const [ax, ay] = polar(START, 20)
  const [bx, by] = polar(angle, 20)
  const largeArc = angle - START > 180 ? 1 : 0

  return (
    <div className="flex flex-col items-center gap-0.5 w-[72px] select-none">
      <button
        onClick={() => onToggle(!on)}
        title={on ? `disable ${label}` : `enable ${label}`}
        className={`text-[9px] uppercase tracking-[0.15em] leading-none px-1 py-0.5 border transition ${
          on ? 'border-[#2d3748] bg-[#2d3748] text-white' : 'border-[#c3cde0] text-[#8595b5] hover:border-[#2d3748] hover:text-[#2d3748]'
        }`}
      >
        {label}
      </button>
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        className="cursor-ns-resize touch-none"
        onPointerDown={onPointerDown}
        onDoubleClick={() => onToggle(false)}
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      >
        {/* track */}
        <path d={`M ${ax} ${ay} A 20 20 0 1 1 ${polar(START + SWEEP, 20)[0]} ${polar(START + SWEEP, 20)[1]}`} fill="none" stroke="#e2e7f2" strokeWidth="3" />
        {/* value arc */}
        {norm > 0.001 && (
          <path d={`M ${ax} ${ay} A 20 20 0 ${largeArc} 1 ${bx} ${by}`} fill="none" stroke={accent} strokeWidth="3" />
        )}
        {/* body */}
        <circle cx="24" cy="24" r="14" fill="white" stroke={ink} strokeWidth="1.5" />
        {/* pointer */}
        <line x1="24" y1="24" x2={polar(angle, 12)[0]} y2={polar(angle, 12)[1]} stroke={ink} strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className={`text-[9px] tabular-nums leading-none ${on ? 'text-[#2d3748]' : 'text-[#acbed8]'}`}>
        {format(value)}
      </span>
    </div>
  )
}
