export const title = 'Streetlights Through Blinds'
export const genre = 'Boom-bap hip hop — Illmatic-era Queensbridge, DJ Premier school, dusty SP-12 drums, ~90 BPM'
export const mood = 'Nocturnal project-window menace: rain streaking the E train glass, one dark piano figure looping like a thought you cannot put down. The drums crack and the bass walks; tension lives in what drops out and comes back.'
export const cycles = 66
export const model = 'claude-fable-5'
export const prompt = 'nas ny state of mind — illmatic queensbridge boom-bap, premier school, dark piano loop'
export const author = 'morgan'

export const code = `setcps(0.375)

// ---- harmonic material: Dm with a b9 (eb) shadow, two-bar i - bVI loop ----
const PNO = [
  '[a2,d3,f3] ~ ~ [d3,f3] ~ [eb3,g3] [d3,f3] ~',
  '[bb2,d3,f3] ~ ~ [d3,f3] ~ [c3,f3] [bb2,d3] ~',
]
const PNO_LO = [
  '[a1,d2,f2] ~ ~ ~ ~ [eb2,g2] [d2,f2] ~',
  '[bb1,d2,f2] ~ ~ ~ ~ [c2,f2] [bb1,d2] ~',
]
const BASSLN = [
  'd2 ~ ~ d2 ~ c2 ~ a1',
  'bb1 ~ ~ bb1 ~ f2 ~ c2',
]
const STAB = ['d2,a2,d3', 'bb1,f2,bb2']
const OUT_LPF = [1100, 950, 800, 650, 500, 380]
const OUT_GAIN = [0.5, 0.45, 0.4, 0.34, 0.27, 0.2]

// ---- voices ----
const pianoLoop = (k) =>
  note(m(PNO[k % 2])).s("piano").lpf(1250).gain(0.52).room(0.28).clip(1.1)

const pianoGhost = (k) =>
  note(m(PNO_LO[k % 2])).s("piano").lpf(850).gain(0.46)
    .delay(0.4).delaytime(0.375).delayfeedback(0.35).room(0.4).clip(1.2)

const bassWalk = (k) =>
  note(m(BASSLN[k % 2])).s("triangle").lpf(190).gain(0.58).release(0.15).clip(0.9)

const hornStab = (k) =>
  note(m(STAB[k % 2])).struct("~ ~ ~ [~ x]").s("sawtooth")
    .lpf(950).resonance(6).attack(0.005).release(0.18).clip(0.5).gain(0.38)

const scratchFlick =
  s("~ ~ ~ [noise noise ~ noise]").hpf(1400).lpf(5200)
    .attack(0.001).release(0.04).clip(0.2).gain(0.3)

const rain = s("noise").lpf(750).attack(0.5).release(0.5).gain(0.05)

// ---- drums: EmuSP12, cracking and sparse; snare sits under the kick ----
const drumsVerse = stack(
  s("bd ~ ~ ~ ~ ~ ~ bd ~ ~ bd ~ ~ ~ ~ ~").bank("EmuSP12").gain(0.9).clip(1.6).release(0.3),
  s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").bank("EmuSP12").gain(0.55).clip(1.5).release(0.3),
  s("hh*8").bank("EmuSP12").gain(0.24).swingBy(1/6, 8),
)
const drumsHook = stack(
  s("bd ~ ~ ~ ~ ~ ~ bd ~ ~ bd ~ ~ bd ~ ~").bank("EmuSP12").gain(0.9).clip(1.6).release(0.3),
  s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").bank("EmuSP12").gain(0.58).clip(1.5).release(0.3),
  s("hh hh hh hh hh hh hh oh").bank("EmuSP12").gain(0.26).clip(0.9).swingBy(1/6, 8),
)
const drumsBridge =
  s("bd ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~ ~ ~ ~").bank("EmuSP12").gain(0.85).clip(1.8).release(0.35)

// ---- sections ----
const introSeg = (k) => stack(pianoLoop(k), rain)

const verseSeg = (k) => stack(pianoLoop(k), bassWalk(k), drumsVerse)

const hookSeg = (k) => stack(
  pianoLoop(k),
  bassWalk(k),
  drumsHook,
  hornStab(k),
  ...(k % 4 === 3 ? [scratchFlick] : []),
)

const bridgeSeg = (k) => stack(pianoGhost(k), bassWalk(k), drumsBridge)

const outroSeg = (k) => stack(
  note(m(PNO[k % 2])).s("piano").lpf(OUT_LPF[k % 6]).gain(OUT_GAIN[k % 6]).room(0.35).clip(1.2),
  rain,
)

const PLAN = [
  [introSeg, 4],
  [verseSeg, 12],
  [hookSeg, 8],
  [verseSeg, 12],
  [hookSeg, 8],
  [bridgeSeg, 8],
  [hookSeg, 8],
  [outroSeg, 6],
]

slowcat(...PLAN.flatMap(([seg, len]) => Array.from({ length: len }, (_, k) => seg(k))))`
