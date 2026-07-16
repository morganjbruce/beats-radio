// Sound-lab audio engine: the same Strudel prebake as the player (driven by the shared
// src/sounds-manifest.ts inventory, so the two can't drift) but wired to a headless
// @strudel/core repl instead of the CodeMirror editor — the lab generates code from its
// dials and evaluates it here. Also exposes superdough directly for one-shot triggers
// and introspection helpers (drum-machine banks/voices, per-sound variant counts).
import {
  SAMPLE_MANIFESTS,
  CUSTOM_SAMPLE_MAPS,
  SOUNDFONT_ALIASES,
  USE_SOUNDFONTS,
} from '../sounds-manifest'

export interface LabEngine {
  /** Drum machines: bank name -> voice -> sample-variant count (from tidal-drum-machines). */
  banks: Record<string, Record<string, number>>
  /** Sample-variant count for a bare sound name; null for synths/pitched (note-keyed) maps. */
  variantCount(name: string): number | null
  /** Evaluate strudel code and (re)start the loop. Safe to call while already playing. */
  play(code: string): Promise<void>
  stop(): void
  /** Fire one superdough voice directly (one-shot audition / silent warm-up). */
  trigger(value: Record<string, unknown>, durationSec?: number): void
}

// superdough's call signature (value, triggerTime, duration)
type SuperdoughFn = (value: Record<string, unknown>, t: number, dur: number) => Promise<unknown>

let enginePromise: Promise<LabEngine> | null = null

/** Idempotent: React StrictMode double-mounts must not double-init the audio graph. */
export function getLabEngine(): Promise<LabEngine> {
  enginePromise ??= init()
  return enginePromise
}

async function init(): Promise<LabEngine> {
  const [core, webaudioModule, { transpiler }, { registerSoundfonts }] = await Promise.all([
    import('@strudel/core'),
    import('@strudel/webaudio'),
    import('@strudel/transpiler'),
    import('@strudel/soundfonts'),
  ])
  const { evalScope, repl } = core
  const { getAudioContext, webaudioOutput, registerSynthSounds, samples, registerSound, soundMap, superdough } =
    webaudioModule
  const { initAudio } = webaudioModule as unknown as { initAudio: () => Promise<void> }
  const superdoughFn = superdough as unknown as SuperdoughFn

  const loadModules = evalScope(
    import('@strudel/core'),
    import('@strudel/webaudio'),
    import('@strudel/mini'),
    import('@strudel/tonal'),
  )

  // The (map, baseUrl) overload of samples() exists at runtime but isn't in the inferred types.
  const samplesMap = samples as unknown as (map: Record<string, string[]>, base: string) => Promise<void>

  // The drum-machine manifest doubles as the bank/voice index for the UI. Fetched alongside
  // the samples() load of the same URL, so the second request hits the HTTP cache.
  const machinesUrl = SAMPLE_MANIFESTS.find((m) => m.url.includes('tidal-drum-machines'))?.url
  const banksJson: Promise<Record<string, unknown>> = machinesUrl
    ? fetch(machinesUrl).then((r) => r.json()).catch(() => ({}))
    : Promise.resolve({})

  await Promise.all([
    loadModules,
    registerSynthSounds(),
    ...(USE_SOUNDFONTS
      ? [Promise.resolve().then(() => registerSoundfonts()).catch((e) => console.warn('soundfonts registration failed:', e))]
      : []),
    ...SAMPLE_MANIFESTS.map((m) => samples(m.url)),
    ...CUSTOM_SAMPLE_MAPS.map((m) => samplesMap(m.map, m.baseUrl)),
  ])

  // Soundfont-backed aliases (rhodes -> gm_epiano1), same guarded delegation as the player.
  for (const { alias, soundfont } of SOUNDFONT_ALIASES) {
    try {
      const src = soundMap.get()?.[soundfont]
      if (src?.onTrigger) registerSound(alias, src.onTrigger, src.data)
    } catch (err) {
      console.warn(`${alias} alias skipped:`, err)
    }
  }

  // bank -> voice -> variant count. Manifest keys are Machine_voice; machine names have no
  // underscore, so the first one splits them.
  const banks: Record<string, Record<string, number>> = {}
  for (const [key, val] of Object.entries(await banksJson)) {
    if (key.startsWith('_')) continue
    const us = key.indexOf('_')
    if (us <= 0) continue
    const bank = key.slice(0, us)
    const voice = key.slice(us + 1)
    ;(banks[bank] ??= {})[voice] = Array.isArray(val) ? val.length : Object.keys(val as object).length
  }

  const r = repl({
    defaultOutput: webaudioOutput,
    getTime: () => getAudioContext().currentTime,
    transpiler,
  })

  // play/trigger run from click handlers, so resuming the (possibly suspended) context here
  // satisfies the browser's user-gesture requirement.
  const ensureAudio = async () => {
    try {
      await initAudio()
    } catch {
      /* non-fatal: getAudioContext() below still works */
    }
    const ctx = getAudioContext()
    if (ctx.state !== 'running') await ctx.resume().catch(() => {})
    return ctx
  }

  return {
    banks,
    variantCount(name: string): number | null {
      // superdough lowercases keys on registration
      const entry = soundMap.get()?.[name.toLowerCase()]
      const s = (entry as { data?: { samples?: unknown } } | undefined)?.data?.samples
      return Array.isArray(s) ? s.length : null
    },
    async play(code: string) {
      await ensureAudio()
      await r.evaluate(code)
    },
    stop() {
      r.stop()
    },
    trigger(value: Record<string, unknown>, durationSec = 1) {
      void ensureAudio().then((ctx) => {
        void superdoughFn(value, ctx.currentTime + 0.05, durationSec).catch(() => {})
      })
    },
  }
}
