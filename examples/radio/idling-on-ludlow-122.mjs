export const title = 'Idling on Ludlow'
export const genre = 'post-punk revival — Interpol-school NYC nocturne, Turn On The Bright Lights lineage, 2002, ~114 BPM'
export const mood = 'A palm-muted synth motor idles under streetlights in a black overcoat. Stately minor-key propulsion, a high bell-clear line ringing over it, restrained ache that never raises its voice.'
export const cycles = 66
export const model = 'claude-fable-5'
export const prompt = 'the cars chug engine relocated to interpol-school post-punk — black overcoat propulsion'
export const author = 'morgan'

export const code = `setcps(0.475)

// ---- harmony: B minor, stepwise root descents -------------------------
// verse: Bm - A - G - F# (harmonic-minor V)
const VC = ['b2,d3,f#3,b3', 'a2,c#3,e3,a3', 'g2,b2,d3,g3', 'f#2,a#2,c#3,f#3']
// chorus: G - D/F# - Em - F#
const CC = ['g2,b2,d3,g3', 'f#2,a2,d3,f#3', 'e2,g2,b2,e3', 'f#2,a#2,c#3,f#3']
// final-chorus pad, one octave up
const PC = ['g3,b3,d4', 'f#3,a3,d4', 'e3,g3,b3', 'f#3,a#3,c#4']

// ---- bass: a second lead, locked to chord tones -----------------------
const VB = [
  'b1 ~ b1 d2 ~ f#2 a2 ~',
  'a1 ~ a1 c#2 ~ e2 g2 ~',
  'g1 ~ g1 b1 ~ d2 e2 ~',
  'f#1 ~ f#1 a#1 ~ c#2 ~ b1',
]
const CB = [
  'g1 g1 ~ b1 d2 ~ g2 ~',
  'f#1 f#1 ~ a1 d2 ~ f#2 ~',
  'e1 e1 ~ g1 b1 ~ e2 ~',
  'f#1 f#1 ~ a#1 c#2 ~ f#2 ~',
]
// bridge: Bm <-> C (bII shadow), bass sings alone
const BB = ['b1 ~ d2 ~ f#2 ~ a2 f#2', 'c2 ~ e2 ~ g2 ~ b2 g2']

// ---- lead: one angular cell, transposed ------------------------------
const CL = [
  'g5 ~ ~ d5 ~ e5 ~ ~',
  'f#5 ~ ~ d5 ~ e5 ~ ~',
  'g5 ~ ~ e5 ~ f#5 ~ ~',
  'f#5 ~ ~ c#5 ~ e5 ~ ~',
]
// verse 2: the cell augmented to one lonely ringing note per bar
const VL = ['~ ~ ~ ~ f#5 ~ ~ ~', '~ ~ ~ ~ e5 ~ ~ ~', '~ ~ ~ ~ d5 ~ ~ ~', '~ ~ ~ ~ c#5 ~ ~ ~']
// bridge: cell over the Bm/C shadow (f# over C rings lydian)
const BL = ['f#5 ~ ~ d5 ~ e5 ~ ~', 'g5 ~ ~ e5 ~ d5 ~ ~']

// ---- voices -----------------------------------------------------------
const chug = (chord, tone) => note(m(chord)).struct("x*8").s("sawtooth")
  .attack(0.001).decay(0.07).sustain(0.03).release(0.035)
  .lpf(tone).hpf(130).shape(0.24)
  .gain("0.34 0.25 0.31 0.25 0.33 0.25 0.31 0.26")

const bassV = (phrase) => note(m(phrase)).s("sawtooth")
  .attack(0.005).decay(0.12).sustain(0.55).release(0.12)
  .lpf(380).shape(0.3).gain(0.55)

const leadV = (phrase) => note(m(phrase)).s("triangle")
  .attack(0.01).decay(0.15).sustain(0.5).release(0.45)
  .lpf(3200).hpf(300).delay(0.28).room(0.45).gain(0.33)

const padV = (chord) => note(m(chord)).s("triangle")
  .attack(0.25).release(0.5).lpf(1200).room(0.5).gain(0.16)

// ---- drums: dry, martial, EmuDrumulator -------------------------------
const drumsVerse = stack(
  s("bd ~ ~ ~ bd ~ ~ ~").bank("EmuDrumulator").gain(0.62).clip(1.5).release(0.3),
  s("~ ~ sd ~ ~ ~ sd ~").bank("EmuDrumulator").gain(0.46).clip(1.4).release(0.3),
  s("hh*8").bank("EmuDrumulator").gain("0.28 0.2 0.24 0.2 0.28 0.2 0.24 0.2"),
)
const drumsChorus = stack(
  s("bd ~ ~ ~ bd ~ ~ bd").bank("EmuDrumulator").gain(0.64).clip(1.5).release(0.3),
  s("~ ~ sd ~ ~ ~ sd ~").bank("EmuDrumulator").gain(0.5).clip(1.4).release(0.3),
  s("hh*8").bank("EmuDrumulator").gain("0.32 0.22 0.27 0.22 0.32 0.22 0.27 0.22"),
  s("~ ~ ~ ~ ~ ~ oh ~").bank("EmuDrumulator").gain(0.22).clip(1.6).release(0.3),
)
const drumsBridge = stack(
  s("bd ~ ~ ~ ~ ~ ~ ~").bank("EmuDrumulator").gain(0.45).clip(1.5).release(0.3),
  s("hh*8").bank("EmuDrumulator").gain("0.2 0.15 0.18 0.15 0.2 0.15 0.18 0.15"),
)

// ---- sections ----------------------------------------------------------
const introSeg = (k) => k < 2
  ? chug('b2,d3,f#3,b3', 800)
  : stack(
      chug('b2,d3,f#3,b3', 800),
      note("b1").s("sine").attack(0.1).release(0.8).lpf(120).gain(0.4),
    )

const verseSeg = (i, tone, withEcho) => stack(
  chug(VC[i % 4], tone),
  bassV(VB[i % 4]),
  ...(withEcho ? [leadV(VL[i % 4])] : []),
  drumsVerse,
)

const chorusSeg = (i, tone, big) => stack(
  chug(CC[i % 4], tone),
  bassV(CB[i % 4]),
  leadV(CL[i % 4]),
  drumsChorus,
  ...(big ? [padV(PC[i % 4])] : []),
  ...(big && i === 0 ? [s("cr ~ ~ ~ ~ ~ ~ ~").gain(0.35).clip(2).release(0.35)] : []),
)

const bridgeSeg = (i) => stack(
  bassV(BB[i % 2]),
  leadV(BL[i % 2]),
  drumsBridge,
)

const OUT_T = [1000, 850, 700, 580, 480, 400]
const OUT_V = [0.9, 0.8, 0.7, 0.58, 0.46, 0.34]
const outroSeg = (k) => stack(
  chug('b2,d3,f#3,b3', OUT_T[k % 6]).velocity(OUT_V[k % 6]),
  note("b1").s("sine").attack(0.15).release(0.9).lpf(110).gain(0.34).velocity(OUT_V[k % 6]),
)

slowcat(
  ...Array.from({ length: 4 }, (_, k) => introSeg(k)),
  ...Array.from({ length: 12 }, (_, k) => verseSeg(k, 950, false)),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k, 1400, false)),
  ...Array.from({ length: 8 }, (_, k) => verseSeg(k, 1050, true)),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k, 1500, false)),
  ...Array.from({ length: 8 }, (_, k) => bridgeSeg(k)),
  ...Array.from({ length: 12 }, (_, k) => chorusSeg(k, 1600, true)),
  ...Array.from({ length: 6 }, (_, k) => outroSeg(k)),
)`
