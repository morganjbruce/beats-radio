export const title = 'Levenhall, 1986'
export const genre = 'Scottish IDM / tape-warble downtempo — Boards of Canada, MHTRTC–Geogaddi era, ~86 BPM'
export const mood = 'Sunlight through a projector lens and a date stamp from a summer that may not have happened. A pentatonic phrase surfaces like a half-remembered educational film, then something underneath detunes and the same melody comes back wearing the wrong colours.'
export const cycles = 62
export const model = 'claude-fable-5'
export const prompt = 'boards of canada — tape-warble analog IDM, half-remembered pentatonic transmission'
export const author = 'morgan'

export const code = `setcps(0.36)

// ---------- voices ----------
const pad = (chord, cutoff, depth, level) => note(m(chord)).s("sawtooth")
  .attack(0.7).sustain(0.8).release(1.4)
  .lpf(cutoff).vib(0.45).vmod(depth)
  .room(0.5).gain(level)

const subv = (root, level) => note(m(root)).s("sine")
  .lpf(110).attack(0.2).sustain(0.9).release(0.6).gain(level)

const mel = (phrase, cutoff, level) => note(m(phrase)).s("square")
  .lpf(cutoff).vib(0.55).vmod(0.045)
  .attack(0.02).decay(0.25).sustain(0.55).release(0.45)
  .room(0.55).delay(0.25).delaytime(0.375).delayfeedback(0.35)
  .gain(level)

const hiss = (level, cutoff) => s("noise")
  .lpf(cutoff).hpf(280).attack(0.6).sustain(0.8).release(1.2).gain(level)

// ---------- drums (dusty, lazy, EmuSP12) ----------
const kickA = s("bd ~ ~ ~ ~ ~ ~ bd ~ ~ bd ~ ~ ~ ~ ~").bank("EmuSP12")
  .clip(1.6).release(0.3).gain(0.6)
const snareA = s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").bank("EmuSP12")
  .clip(1.5).release(0.3).gain(0.33)
const hatsA = s("~ ~ hh ~ ~ ~ hh ~ ~ hh ~ ~ ~ ~ hh ~").bank("EmuSP12")
  .clip(1.2).release(0.25).gain(0.16)
const kickU = s("bd ~ ~ ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~").bank("EmuSP12")
  .clip(1.8).release(0.35).gain(0.48)

// ---------- harmony tables ----------
const A_CH  = ['d3,f#3,a3,e4', 'd3,f#3,a3,e4', 'c3,e3,g3,d4', 'c3,e3,g3,d4']
const A_SUB = ['d2', 'd2', 'c2', 'c2']

const U_CH  = ['g2,bb2,d3,f3', 'g2,bb2,d3,f3', 'bb2,d3,f3,a3', 'g2,bb2,d3,f3']
const U_SUB = ['g1', 'g1', 'bb1', 'g1']

const R_CH  = ['d3,f#3,a3,e4', 'c3,e3,g3,d4', 'g2,bb2,d3,f3', 'c3,e3,g3,d4']
const R_SUB = ['d2', 'c2', 'g1', 'c2']

// ---------- melody tables (one motif, developed) ----------
const MEL_A = [
  '~ ~ a4 ~ f#4 ~ e4 ~ ~ d4 ~ ~ ~ ~ ~ ~',
  '~ ~ ~ ~ e4 ~ f#4 ~ a4 ~ ~ ~ b4 ~ a4 ~',
  '~ ~ a4 ~ f#4 ~ e4 ~ ~ d4 ~ ~ e4 ~ d4 ~',
  '~ ~ b3 ~ d4 ~ e4 ~ ~ ~ d4 ~ ~ ~ ~ ~',
]
const MEL_A2 = [
  '~ ~ a4 ~ f#4 ~ e4 ~ ~ d4 ~ ~ ~ ~ a3 ~',
  '~ ~ ~ ~ e5 ~ f#5 ~ a5 ~ ~ ~ b4 ~ a4 ~',
  '~ ~ a4 ~ f#4 ~ e4 ~ ~ d5 ~ ~ e5 ~ d5 ~',
  '~ ~ b3 ~ d4 ~ e4 ~ ~ ~ d4 ~ f#4 ~ e4 ~',
]
const MEL_R = [
  '~ ~ a4 ~ f#4 ~ e4 ~ ~ d4 ~ ~ ~ ~ ~ ~',
  '~ ~ ~ ~ e4 ~ f#4 ~ a4 ~ ~ ~ b4 ~ a4 ~',
  '~ ~ a4 ~ f4 ~ d4 ~ ~ bb3 ~ ~ ~ ~ ~ ~',
  '~ ~ e4 ~ d4 ~ ~ ~ ~ ~ e4 ~ d4 ~ ~ ~',
]

// ---------- lpf drift tables (the tape breathing) ----------
const INTRO_LPF = [380, 440, 500, 560, 620, 680, 740, 800]
const A1_LPF = [760, 820, 740, 860, 800, 840, 720, 880]
const A2_LPF = [880, 940, 860, 980, 920, 960, 840, 1000]
const U_LPF  = [720, 680, 630, 580, 540, 500, 470, 450, 430, 420]
const R_LPF  = [820, 780, 700, 760, 840, 800, 720, 780, 860, 820, 740, 800]
const D_LPF  = [640, 560, 490, 430, 380, 330, 290, 250]
const D_GAIN = [0.3, 0.28, 0.27, 0.25, 0.23, 0.2, 0.17, 0.14]
const D_HISS = [0.06, 0.055, 0.05, 0.045, 0.04, 0.035, 0.028, 0.02]

const INTRO_CH = ['d3,f#3,a3,e4', 'd3,f#3,a3,e4', 'c3,e3,g3,d4', 'c3,e3,g3,d4',
  'd3,f#3,a3,e4', 'd3,f#3,a3,e4', 'c3,e3,g3,d4', 'c3,e3,g3,d4']

// ---------- sections ----------
// projector warms up: pad + hiss only, filter opening slowly
const introSeg = (i) => stack(
  pad(INTRO_CH[i % 8], INTRO_LPF[i % 8], 0.05, 0.3),
  hiss(0.055, 1200),
)

// the transmission begins: melody over lazy dusty drums
const a1Seg = (i) => stack(
  pad(A_CH[i % 4], A1_LPF[i % 8], 0.055, 0.3),
  subv(A_SUB[i % 4], 0.5),
  mel(MEL_A[i % 4], 950, 0.3),
  kickA,
  snareA,
  hiss(0.045, 1100),
)

// full transmission: melody drifts up an octave, hats surface
const a2Seg = (i) => stack(
  pad(A_CH[i % 4], A2_LPF[i % 8], 0.06, 0.3),
  subv(A_SUB[i % 4], 0.5),
  mel(MEL_A2[i % 4], 1150, 0.28),
  kickA,
  snareA,
  hatsA,
  hiss(0.045, 1100),
)

// the wrong thing surfaces: melody gone, pad detunes deeper, borrowed minor
const uSeg = (i) => stack(
  pad(U_CH[i % 4], U_LPF[i % 10], 0.095, 0.28),
  subv(U_SUB[i % 4], 0.45),
  hiss(0.06, 900),
  ...(i >= 6 ? [kickU] : []),
)

// transmission returns, changed: same motif recoloured over the darker chord
const rSeg = (i) => stack(
  pad(R_CH[i % 4], R_LPF[i % 12], 0.07, 0.3),
  subv(R_SUB[i % 4], 0.5),
  mel(MEL_R[i % 4], 1050, 0.3),
  kickA,
  snareA,
  ...(i >= 4 ? [hatsA] : []),
  hiss(0.05, 1000),
)

// projector dies: filter closes, one last fragment, hiss outlasts everything
const dSeg = (i) => stack(
  pad(INTRO_CH[i % 8], D_LPF[i % 8], 0.08, D_GAIN[i % 8]),
  hiss(D_HISS[i % 8], 900),
  ...(i < 4 ? [subv(A_SUB[i % 4], 0.35)] : []),
  ...(i < 2 ? [mel('~ ~ a4 ~ f#4 ~ e4 ~ ~ d4 ~ ~ ~ ~ ~ ~', 750, 0.22)] : []),
)

// ---------- arrangement: 8 + 12 + 12 + 10 + 12 + 8 = 62 cycles ----------
const PLAN = [
  [introSeg, 8],
  [a1Seg, 12],
  [a2Seg, 12],
  [uSeg, 10],
  [rSeg, 12],
  [dSeg, 8],
]
slowcat(...PLAN.flatMap(([seg, len]) => Array.from({ length: len }, (_, k) => seg(k))))`
