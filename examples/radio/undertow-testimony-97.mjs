export const title = 'Undertow Testimony'
export const genre = 'nervy new-wave swamp-funk — 1978 CBGB-does-Al-Green, Eno-tight post-punk soul, ~94 BPM'
export const mood = 'A baptismal funk groove played with clenched teeth: the bass pumps one anxious cell while murky organ rises like river water over your shoes. The chorus opens its chest for a moment of gospel light, then the current pulls everything back under.'
export const cycles = 64
export const model = 'claude-fable-5'
export const prompt = 'talking heads take me to the river — 78 nervy swamp-funk, tight anxious groove, organ swells'
export const author = 'morgan'
export const code = `setcps(0.3917)

// --- harmony: A dorian swamp. Verse vamp i7 with the IV7 gospel pull; chorus adds bVI-maj7 and a major-V bite.
const V_CH = ['a2,c3,e3,g3', 'a2,c3,e3,g3', 'd3,f#3,a3,c4', 'a2,c3,e3,g3']
const C_CH = ['a2,c3,e3,g3', 'd3,f#3,a3,c4', 'f2,a2,c3,e3', 'e2,g#2,b2,d3']
const V_ORG = ['a3,c4,e4,g4', 'a3,c4,e4,g4', 'd4,f#4,a4,c5', 'a3,c4,e4,g4']
const C_ORG = ['a3,c4,e4,g4', 'd4,f#4,a4,c5', 'f3,a3,c4,e4', 'e3,g#3,b3,d4']
const BR_ORG = ['a3,c4,e4,g4', 'a3,c4,e4,g4', 'f3,a3,c4,e4', 'e3,g#3,b3,d4']

// --- one bass cell, developed: verse restrained, chorus adds pickups, bridge drops to half-time.
const BASS_V = [
  'a1 a1 ~ a1 ~ a1 [~ g1] a1',
  'a1 a1 ~ a1 ~ a1 [~ g1] a1',
  'd2 d2 ~ d2 ~ d2 [~ c2] d2',
  'a1 a1 ~ a1 ~ a1 [~ g1] a1',
]
const BASS_C = [
  'a1 a1 ~ a1 ~ a1 g1 [g1 a1]',
  'd2 d2 ~ d2 ~ d2 c2 [c2 d2]',
  'f1 f1 ~ f1 ~ f1 e1 [e1 f1]',
  'e1 e1 ~ e1 ~ e1 ~ [g#1 a1]',
]
const BASS_BR = [
  'a1 ~ ~ ~ g1 ~ ~ ~',
  'a1 ~ ~ ~ e1 ~ ~ ~',
  'f1 ~ ~ ~ e1 ~ ~ ~',
  'e1 ~ ~ ~ [~ g#1] ~ a1 ~',
]

// --- lead: dry, nervous, repeated-note stammer then a leap. Fragments in verse 2 and bridge, full voice at the peak.
const LEAD_V = [
  '~ ~ ~ ~ e4 e4 ~ [d4 c4]',
  '~ [c4 d4] e4 ~ ~ ~ ~ ~',
  '~ ~ ~ ~ f#4 f#4 e4 d4',
  'e4 ~ c4 ~ a3 ~ ~ ~',
]
const LEAD_BR = [
  '~ ~ e4 ~ ~ e4 ~ ~',
  '~ ~ ~ g4 ~ e4 ~ ~',
  '~ ~ a4 ~ g4 ~ e4 ~',
  '~ b3 ~ g#3 ~ ~ a3 ~',
]
const LEAD_P = [
  'e4 e4 ~ e4 g4 ~ e4 ~',
  '~ [e4 f#4] ~ f#4 a4 ~ g4 ~',
  'a4 ~ c5 a4 ~ g4 ~ e4',
  'e4 ~ [d4 b3] ~ g#3 ~ a3 ~',
]

// --- per-cycle swell tables (no LFOs inside slowcat entries — they freeze)
const IN_OG = [0.1, 0.14, 0.18, 0.22]
const IN_LPF = [420, 520, 620, 720]
const C_OG = [0.13, 0.15, 0.17, 0.19, 0.21, 0.23, 0.25, 0.27]
const C_LPF = [700, 800, 900, 1000, 1100, 1250, 1400, 1600]
const BR_OG = [0.26, 0.28, 0.3, 0.32, 0.3, 0.32, 0.34, 0.36]
const OUT_OG = [0.26, 0.24, 0.21, 0.18, 0.15, 0.12, 0.09, 0.06]

// --- instruments
const bassCell = (phrase, level) =>
  note(m(phrase)).s("square").lpf(280).clip(0.9).release(0.08).gain(level)

const stabV = (chord) =>
  note(m(chord)).struct("~ [~ x] ~ x ~ [x x] ~ ~")
    .s("square").hpf(500).lpf(1500).decay(0.12).sustain(0).clip(0.35).gain(0.32)

const stabC = (chord) =>
  note(m(chord)).struct("~ x ~ x [~ x] x ~ [x x]")
    .s("square").hpf(400).lpf(2300).decay(0.16).sustain(0).clip(0.4).gain(0.36).room(0.12)

const organSwell = (chord, level, cut) =>
  note(m(chord)).s("organ_full").attack(0.7).release(1).lpf(cut).gain(level).room(0.2)

const voiceLead = (phrase, level) =>
  note(m(phrase)).s("sawtooth").lpf(2100).resonance(6)
    .decay(0.14).sustain(0.25).release(0.15).vib(5.5).vmod(0.04).gain(level)

// --- drums: CR-78 (1978), tight and boxy, snare well under kick
const drumsVerse = stack(
  s("bd ~ ~ bd ~ ~ ~ [~ bd]").bank("RolandCompurhythm78").gain(0.85).clip(1.5).release(0.3),
  s("~ ~ sd ~ ~ ~ sd ~").bank("RolandCompurhythm78").gain(0.42).clip(1.4).release(0.25),
  s("hh*8").bank("RolandCompurhythm78").gain("0.3 0.15 0.22 0.15 0.3 0.15 0.22 0.15")
)
const drumsChorus = stack(
  s("bd ~ ~ bd ~ ~ ~ [~ bd]").bank("RolandCompurhythm78").gain(0.85).clip(1.5).release(0.3),
  s("~ ~ sd ~ ~ ~ sd ~").bank("RolandCompurhythm78").gain(0.45).clip(1.4).release(0.25),
  s("hh*8").bank("RolandCompurhythm78").gain("0.32 0.17 0.24 0.17 0.32 0.17 0.24 0.17"),
  s("~ ~ ~ ~ ~ ~ ~ oh").bank("RolandCompurhythm78").gain(0.22).release(0.3)
)
const drumsBridge = stack(
  s("bd ~ ~ ~ ~ ~ ~ ~").bank("RolandCompurhythm78").gain(0.6).clip(1.6).release(0.3),
  s("~ hh ~ ~ ~ hh ~ ~").bank("RolandCompurhythm78").gain(0.14)
)
const drumsThin = stack(
  s("bd ~ ~ bd ~ ~ ~ ~").bank("RolandCompurhythm78").gain(0.6).clip(1.5).release(0.3),
  s("hh*8").bank("RolandCompurhythm78").gain("0.18 0.09 0.13 0.09 0.18 0.09 0.13 0.09")
)

// --- sections
const introSeg = (k) => stack(
  organSwell(V_ORG[k % 4], IN_OG[k % 4], IN_LPF[k % 4]),
  k >= 2 ? bassCell(BASS_V[k % 4], 0.4) : silence,
  k >= 3 ? s("~ hh ~ ~ ~ hh ~ ~").bank("RolandCompurhythm78").gain(0.12) : silence
)

const verseSeg = (k, withLead) => stack(
  bassCell(BASS_V[k % 4], 0.5),
  stabV(V_CH[k % 4]),
  drumsVerse,
  withLead ? voiceLead(LEAD_V[k % 4], 0.3) : silence
)

const chorusSeg = (k) => stack(
  bassCell(BASS_C[k % 4], 0.52),
  stabC(C_CH[k % 4]),
  organSwell(C_ORG[k % 4], C_OG[Math.min(k, 7)], C_LPF[Math.min(k, 7)]),
  drumsChorus
)

const bridgeSeg = (k) => stack(
  bassCell(BASS_BR[k % 4], 0.44),
  organSwell(BR_ORG[k % 4], BR_OG[k % 8], 1200),
  drumsBridge,
  voiceLead(LEAD_BR[k % 4], 0.28)
)

const peakSeg = (k) => stack(
  bassCell(BASS_C[k % 4], 0.54),
  stabC(C_CH[k % 4]),
  organSwell(C_ORG[k % 4], C_OG[Math.min(k, 7)] + 0.05, 1700),
  voiceLead(LEAD_P[k % 4], 0.34),
  drumsChorus
)

const outroSeg = (k) => stack(
  organSwell(V_ORG[k % 4], OUT_OG[k % 8], 900 - k * 60),
  k < 6 ? bassCell(BASS_V[k % 4], 0.42 - k * 0.04) : silence,
  k < 4 ? drumsThin : silence
)

const PLAN = [
  [introSeg, 4],
  [(k) => verseSeg(k, false), 8],
  [chorusSeg, 8],
  [(k) => verseSeg(k, true), 8],
  [chorusSeg, 8],
  [bridgeSeg, 8],
  [peakSeg, 12],
  [outroSeg, 8],
]
slowcat(...PLAN.flatMap(([seg, len]) => Array.from({ length: len }, (_, k) => seg(k))))`
