import { useEffect, useMemo, useState } from 'react'
import { Knob } from './Knob'
import { getLabEngine, type LabEngine } from './engine'
import {
  DRUM_SOUNDS,
  MELODIC_SOUNDS,
  PERCUSSION_SOUNDS,
  ATMOSPHERIC_SOUNDS,
  PITCHED,
} from '../sounds-manifest'

// Sound lab (/lab): audition any sound in the radio's inventory — curated samples and the
// drum-machine banks — through dials for the Strudel transforms the beats skill documents.
// The dials generate real Strudel code (shown below, copy-paste ready for a song); PLAY
// loops it through the same engine the player uses, TRIG fires a single voice.

// -- transform dials -------------------------------------------------------------------
// method = the Pattern method chained into generated code; sdKey = superdough's control
// name for direct one-shot triggers (defaults to method).
interface ParamDef {
  id: string
  method: string
  sdKey?: string
  min: number
  max: number
  def: number
  log?: boolean
  int?: boolean
  fmt?: (v: number) => string
}
// value as it appears in generated code / trigger params: whole numbers for integer and
// frequency dials, 3 decimals elsewhere
const paramValue = (p: ParamDef, v: number) => (p.int || p.fmt === hz ? Math.round(v) : Math.round(v * 1000) / 1000)
const hz = (v: number) => `${Math.round(v)} hz`
const num = (v: number) => (Math.abs(v) >= 100 ? String(Math.round(v)) : String(Math.round(v * 100) / 100))
const P = (p: Omit<ParamDef, 'fmt'> & { fmt?: ParamDef['fmt'] }): ParamDef => ({ fmt: p.int ? (v) => String(Math.round(v)) : num, ...p })

const PARAM_GROUPS: { label: string; params: ParamDef[] }[] = [
  {
    label: 'filter',
    params: [
      P({ id: 'lpf', method: 'lpf', sdKey: 'cutoff', min: 60, max: 8000, def: 800, log: true, fmt: hz }),
      P({ id: 'resonance', method: 'resonance', min: 0, max: 30, def: 10 }),
      P({ id: 'hpf', method: 'hpf', sdKey: 'hcutoff', min: 20, max: 4000, def: 300, log: true, fmt: hz }),
    ],
  },
  {
    label: 'drive',
    params: [
      P({ id: 'shape', method: 'shape', min: 0, max: 1, def: 0.3 }),
      P({ id: 'distort', method: 'distort', min: 0, max: 3, def: 0.5 }),
      P({ id: 'crush', method: 'crush', min: 1, max: 16, def: 8, int: true }),
      P({ id: 'coarse', method: 'coarse', min: 1, max: 32, def: 4, int: true }),
    ],
  },
  {
    label: 'space',
    params: [
      P({ id: 'room', method: 'room', min: 0, max: 1, def: 0.4 }),
      P({ id: 'delay', method: 'delay', min: 0, max: 1, def: 0.3 }),
      P({ id: 'pan', method: 'pan', min: -1, max: 1, def: 0 }),
    ],
  },
  {
    label: 'envelope',
    params: [
      P({ id: 'attack', method: 'attack', min: 0, max: 2, def: 0.1 }),
      P({ id: 'decay', method: 'decay', min: 0, max: 2, def: 0.2 }),
      P({ id: 'sustain', method: 'sustain', min: 0, max: 1, def: 0.6 }),
      P({ id: 'release', method: 'release', min: 0, max: 4, def: 0.5 }),
    ],
  },
  {
    label: 'motion',
    params: [
      P({ id: 'speed', method: 'speed', min: 0.25, max: 4, def: 1 }),
      P({ id: 'vib', method: 'vib', min: 0, max: 12, def: 5 }),
      P({ id: 'vmod', method: 'vmod', sdKey: 'vibmod', min: 0, max: 0.5, def: 0.1 }),
    ],
  },
  {
    label: 'level',
    params: [P({ id: 'gain', method: 'gain', min: 0, max: 1.2, def: 0.8 })],
  },
]
const ALL_PARAMS = PARAM_GROUPS.flatMap((g) => g.params)

// -- sound browser ---------------------------------------------------------------------
const SYNTH_WAVEFORMS = ['sine', 'sawtooth', 'square', 'triangle']
// Candidate sounds under audition for promotion into the curated set. All already load
// (Dirt-Samples, VCSL, or the GM soundfonts) but are NOT advertised in sounds.md yet —
// the lab is where they earn their spot (or a ban; that's how sax and vinyl got cut).
const CANDIDATE_SOUNDS = [
  'amencutup', 'jungbass', 'gretsch', 'jazz', 'tabla', 'tabla2',
  'kalimba', 'kalimba2', 'moog', 'juno', 'jvbass',
  'rave', 'hoover', 'stab', 'gm_acoustic_bass',
]
// candidates that want a note() pattern rather than a drum-style s() pattern
const CANDIDATE_PITCHED = new Set(['kalimba', 'kalimba2', 'gm_acoustic_bass'])
const CATEGORIES = [
  { id: 'drums', label: 'drums', sounds: DRUM_SOUNDS },
  { id: 'machines', label: 'drum machines', sounds: [] as string[] },
  { id: 'synths', label: 'synths', sounds: SYNTH_WAVEFORMS },
  { id: 'melodic', label: 'melodic', sounds: MELODIC_SOUNDS },
  { id: 'percussion', label: 'percussion', sounds: PERCUSSION_SOUNDS },
  { id: 'atmospheric', label: 'atmospheric', sounds: ATMOSPHERIC_SOUNDS },
  { id: 'candidates', label: 'candidates', sounds: CANDIDATE_SOUNDS },
] as const
type CategoryId = (typeof CATEGORIES)[number]['id']

// canonical drum-voice ordering for the machine voice chips
const VOICE_ORDER = ['bd', 'sd', 'sn', 'cp', 'hh', 'oh', 'lt', 'mt', 'ht', 'rim', 'cb', 'sh', 'rd', 'cr', 'perc', 'fx', 'misc', 'tb']
const PITCHED_SET = new Set(PITCHED)

const CHIP =
  'h-7 px-2.5 flex items-center border text-[10px] uppercase tracking-[0.15em] transition cursor-pointer'
const chipCls = (active: boolean) =>
  `${CHIP} ${active ? 'border-[#de1a1a] text-[#de1a1a] bg-white' : 'border-[#acbed8] text-[#8595b5] bg-white/60 hover:border-[#2d3748] hover:text-[#2d3748]'}`
const PANEL = 'border border-[#2d3748] bg-white shadow-[3px_3px_0_#2d3748] p-3'
const GROUP_LABEL = 'text-[9px] uppercase tracking-[0.25em] text-[#8595b5] leading-none'

const isNoteMode = (category: CategoryId, sound: string) =>
  category === 'synths' || PITCHED_SET.has(sound) || CANDIDATE_PITCHED.has(sound)

const defaultPattern = (sound: string, variant: number) =>
  `${sound}${variant > 0 ? `:${variant}` : ''}*4`

function SoundLab() {
  const [engine, setEngine] = useState<LabEngine | null>(null)
  const [engineError, setEngineError] = useState<string | null>(null)
  const [category, setCategory] = useState<CategoryId>('drums')
  const [sound, setSound] = useState('bd')
  const [bank, setBank] = useState('RolandTR808')
  const [variant, setVariant] = useState(0)
  const [pattern, setPattern] = useState(defaultPattern('bd', 0))
  const [notes, setNotes] = useState('c3 e3 g3 c4')
  const [bpm, setBpm] = useState(90)
  const [params, setParams] = useState<Record<string, { on: boolean; v: number }>>(() =>
    Object.fromEntries(ALL_PARAMS.map((p) => [p.id, { on: p.id === 'gain', v: p.def }])),
  )
  const [playing, setPlaying] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    getLabEngine().then(
      (e) => { if (!cancelled) setEngine(e) },
      (err) => { if (!cancelled) setEngineError(String(err?.message ?? err)) },
    )
    return () => { cancelled = true }
  }, [])

  const machines = category === 'machines'
  const noteMode = isNoteMode(category, sound)
  const banks = useMemo(() => Object.keys(engine?.banks ?? {}).sort(), [engine])
  const voices = useMemo(() => {
    const v = Object.keys(engine?.banks[bank] ?? {})
    return v.sort((a, b) => {
      const ia = VOICE_ORDER.indexOf(a), ib = VOICE_ORDER.indexOf(b)
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b)
    })
  }, [engine, bank])
  const variantCount = machines
    ? engine?.banks[bank]?.[sound] ?? 1
    : noteMode ? 1 : engine?.variantCount(sound) ?? 1

  const selectSound = (name: string, cat: CategoryId = category) => {
    setSound(name)
    setVariant(0)
    setPattern(defaultPattern(name, 0))
    // zero-gain one-shot pre-fetches the sample buffer so the first audible hit lands
    engine?.trigger({ s: name, n: 0, ...(cat === 'machines' ? { bank } : {}), gain: 0 }, 0.01)
  }
  const selectCategory = (id: CategoryId) => {
    setCategory(id)
    const first = id === 'machines' ? (Object.keys(engine?.banks[bank] ?? {}).includes('bd') ? 'bd' : Object.keys(engine?.banks[bank] ?? {})[0] ?? 'bd') : CATEGORIES.find((c) => c.id === id)!.sounds[0]
    selectSound(first, id)
  }
  const selectVariant = (n: number) => {
    setVariant(n)
    setPattern(defaultPattern(sound, n))
    engine?.trigger({ s: sound, n, ...(machines ? { bank } : {}), gain: 0 }, 0.01)
  }

  // -- code generation -----------------------------------------------------------------
  const code = useMemo(() => {
    const chain = ALL_PARAMS.filter((p) => params[p.id].on)
      .map((p) => `.${p.method}(${paramValue(p, params[p.id].v)})`)
      .join('')
    const source = noteMode
      ? `note("${notes.trim() || 'c3'}").s("${sound}")`
      : `s("${pattern.trim() || sound}")${machines ? `.bank("${bank}")` : ''}`
    return `setcps(${bpm}/60/4)\n\n${source}${chain}`
  }, [params, noteMode, notes, sound, pattern, machines, bank, bpm])

  // Live loop: any change while playing re-evaluates the generated code (debounced so a
  // knob drag doesn't spam the scheduler). The PLAY toggle only flips `playing` — this
  // effect is the single place evaluate() is called.
  useEffect(() => {
    if (!playing || !engine) return
    const t = setTimeout(() => {
      engine.play(code).catch((err) => console.error('[lab] evaluate failed:', err))
    }, 200)
    return () => clearTimeout(t)
  }, [playing, engine, code])

  const stop = () => {
    engine?.stop()
    setPlaying(false)
  }

  const trig = () => {
    if (!engine) return
    const value: Record<string, unknown> = { s: sound, n: variant }
    if (machines) value.bank = bank
    if (noteMode) value.note = /[a-gA-G][#b]?\d/.exec(notes)?.[0] ?? 'c3'
    for (const p of ALL_PARAMS) {
      if (params[p.id].on) value[p.sdKey ?? p.method] = paramValue(p, params[p.id].v)
    }
    engine.trigger(value, 1.5)
  }

  const copy = () => {
    navigator.clipboard?.writeText(code).then(
      () => { setCopied(true); setTimeout(() => setCopied(false), 1200) },
      () => {},
    )
  }

  return (
    <div className="h-screen overflow-y-auto font-mono text-[#2d3748]" style={{ backgroundColor: '#f4f6fc' }}>
      <header className="sticky top-0 flex items-center justify-between gap-3 px-4 h-12 bg-white/85 backdrop-blur-sm border-b border-[#acbed8] z-30">
        <div className="flex items-center gap-3">
          <span className={`font-bold tracking-[0.25em] text-sm uppercase leading-none transition-colors duration-300 ${playing ? 'text-[#de1a1a]' : ''}`}>
            beats
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#8595b5]">sound lab</span>
        </div>
        <a href="/" className={chipCls(false)}>&larr; radio</a>
      </header>

      <main className="max-w-4xl mx-auto p-4 flex flex-col gap-4 pb-10">
        {engineError && (
          <div className={`${PANEL} text-[11px] text-[#de1a1a]`}>engine failed to load: {engineError}</div>
        )}
        {!engine && !engineError && (
          <div className={`${PANEL} text-[11px] text-[#8595b5] animate-pulse`}>warming up the engine — fetching sample manifests…</div>
        )}

        {/* transport */}
        <section className={`${PANEL} flex items-center gap-4 flex-wrap`}>
          <button
            onClick={() => (playing ? stop() : setPlaying(true))}
            disabled={!engine}
            className="w-24 h-10 border border-[#2d3748] bg-white shadow-[3px_3px_0_#2d3748] text-[11px] font-bold uppercase tracking-[0.2em] transition enabled:hover:border-[#de1a1a] enabled:hover:text-[#de1a1a] enabled:active:translate-x-[2px] enabled:active:translate-y-[2px] enabled:active:shadow-[1px_1px_0_#2d3748] disabled:opacity-40"
          >
            {playing ? 'stop' : 'play'}
          </button>
          <button
            onClick={trig}
            disabled={!engine}
            className="w-24 h-10 border border-[#2d3748] bg-white shadow-[3px_3px_0_#2d3748] text-[11px] uppercase tracking-[0.2em] transition enabled:hover:border-[#de1a1a] enabled:hover:text-[#de1a1a] enabled:active:translate-x-[2px] enabled:active:translate-y-[2px] enabled:active:shadow-[1px_1px_0_#2d3748] disabled:opacity-40"
          >
            trig
          </button>
          <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#8595b5]">
            bpm
            <input
              type="number"
              min={40}
              max={200}
              value={bpm}
              onChange={(e) => setBpm(Math.max(40, Math.min(200, Number(e.target.value) || 90)))}
              className="w-16 h-8 border border-[#acbed8] bg-white px-2 text-[12px] text-[#2d3748] tabular-nums focus:border-[#de1a1a] outline-none"
            />
          </label>
        </section>

        {/* sound browser */}
        <section className={`${PANEL} flex flex-col gap-3`}>
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button key={c.id} onClick={() => selectCategory(c.id)} className={chipCls(category === c.id)}>
                {c.label}
              </button>
            ))}
          </div>

          {machines && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className={GROUP_LABEL}>bank</span>
              <select
                value={bank}
                onChange={(e) => {
                  const b = e.target.value
                  setBank(b)
                  const vs = Object.keys(engine?.banks[b] ?? {})
                  const keep = vs.includes(sound) ? sound : vs.includes('bd') ? 'bd' : vs[0] ?? 'bd'
                  setSound(keep)
                  setVariant(0)
                  setPattern(defaultPattern(keep, 0))
                  engine?.trigger({ s: keep, n: 0, bank: b, gain: 0 }, 0.01)
                }}
                className="h-8 border border-[#acbed8] bg-white px-2 text-[12px] focus:border-[#de1a1a] outline-none"
              >
                {banks.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              <span className="text-[10px] text-[#8595b5]">{banks.length} machines</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 flex-wrap">
            {(machines ? voices : CATEGORIES.find((c) => c.id === category)!.sounds).map((s) => (
              <button key={s} onClick={() => selectSound(s)} className={chipCls(sound === s)}>
                {s}
              </button>
            ))}
          </div>

          {variantCount > 1 && (
            <div className="flex items-center gap-2">
              <span className={GROUP_LABEL}>variant</span>
              <button onClick={() => selectVariant(Math.max(0, variant - 1))} className={chipCls(false)}>&minus;</button>
              <span className="text-[11px] tabular-nums">{sound}:{variant} <span className="text-[#8595b5]">/ {variantCount - 1}</span></span>
              <button onClick={() => selectVariant(Math.min(variantCount - 1, variant + 1))} className={chipCls(false)}>+</button>
            </div>
          )}

          {noteMode ? (
            <label className="flex items-center gap-2">
              <span className={GROUP_LABEL}>notes</span>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                spellCheck={false}
                className="flex-1 h-8 border border-[#acbed8] bg-white px-2 text-[12px] focus:border-[#de1a1a] outline-none"
              />
              {(['c3', 'c3 eb3 g3 bb3', '[c3,e3,g3]', 'c2 c3 c4'] as const).map((p) => (
                <button key={p} onClick={() => setNotes(p)} className={chipCls(notes === p)} title={`use pattern ${p}`}>
                  {p === 'c3' ? 'note' : p === 'c3 eb3 g3 bb3' ? 'arp' : p === '[c3,e3,g3]' ? 'chord' : 'octaves'}
                </button>
              ))}
            </label>
          ) : (
            <label className="flex items-center gap-2">
              <span className={GROUP_LABEL}>pattern</span>
              <input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                spellCheck={false}
                className="flex-1 h-8 border border-[#acbed8] bg-white px-2 text-[12px] focus:border-[#de1a1a] outline-none"
              />
              {([1, 4, 8, 16] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setPattern(`${sound}${variant > 0 ? `:${variant}` : ''}${r > 1 ? `*${r}` : ''}`)}
                  className={chipCls(false)}
                >
                  ×{r}
                </button>
              ))}
            </label>
          )}
        </section>

        {/* transform dials */}
        <section className={`${PANEL} flex gap-4 flex-wrap`}>
          {PARAM_GROUPS.map((g) => (
            <fieldset key={g.label} className="flex flex-col gap-1.5">
              <legend className={GROUP_LABEL}>{g.label}</legend>
              <div className="flex gap-1 pt-1.5">
                {g.params.map((p) => (
                  <Knob
                    key={p.id}
                    label={p.id}
                    value={params[p.id].v}
                    min={p.min}
                    max={p.max}
                    log={p.log}
                    on={params[p.id].on}
                    format={p.fmt ?? num}
                    onChange={(v) => setParams((s) => ({ ...s, [p.id]: { ...s[p.id], v } }))}
                    onToggle={(on) => setParams((s) => ({ ...s, [p.id]: { ...s[p.id], on } }))}
                  />
                ))}
              </div>
            </fieldset>
          ))}
        </section>

        {/* generated code */}
        <section className={`${PANEL} flex flex-col gap-2`}>
          <div className="flex items-center justify-between">
            <span className={GROUP_LABEL}>strudel</span>
            <button onClick={copy} className={chipCls(copied)}>{copied ? 'copied' : 'copy'}</button>
          </div>
          <pre className="text-[12px] leading-relaxed whitespace-pre-wrap break-all bg-[#f8f9fc] border border-[#e2e7f2] p-2">{code}</pre>
        </section>
      </main>
    </div>
  )
}

export default SoundLab
