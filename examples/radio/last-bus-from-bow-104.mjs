export const title = 'Last Bus From Bow'
export const genre = 'UK garage / grime crossover — Original Pirate Material-era 2-step meets 8-bar sinogrime, London 2002, ~112 BPM'
export const mood = 'Top deck of the night bus, forehead on the cold glass, phone with no credit. The shuffle still moves your shoulders but the square bass is a lump in your throat. Lager, fags, and a broken heart heading east past Bow.'
export const cycles = 74
export const model = 'claude-fable-5'
export const prompt = 'the streets, grime — original pirate material era, 2-step shuffle, cold square bass, kitchen-sink keys'
export const author = 'morgan'

export const code = `setcps(112/60/4)

// E minor, stark: i - VI - iv - bVII  (Em  C  Am  D)
const STAB = ['e3,g3,b3', 'e3,g3,c4', 'e3,a3,c4', 'f#3,a3,d4']
const PAD = ['e2,b2,g3,f#4', 'c3,g3,d4,e4', 'a2,e3,b3,c4', 'd3,a3,e4,f#4']

// the hook: cold square riff, roots + a flick, ends pulling to the next root
const BASS_HOOK = [
  'e1 ~ ~ ~ ~ ~ ~ e1 ~ ~ e1 ~ ~ g1 ~ d1',
  'c2 ~ ~ ~ ~ ~ ~ c2 ~ ~ c2 ~ ~ g1 ~ e1',
  'a1 ~ ~ ~ ~ ~ ~ a1 ~ ~ a1 ~ ~ c2 ~ e1',
  'd2 ~ ~ ~ ~ ~ ~ d2 ~ ~ d2 ~ ~ a1 ~ f#1',
]
const BASS_HOOK_OCT = [
  '[e1,e2] ~ ~ ~ ~ ~ ~ [e1,e2] ~ ~ [e1,e2] ~ ~ [g1,g2] ~ [d1,d2]',
  '[c2,c3] ~ ~ ~ ~ ~ ~ [c2,c3] ~ ~ [c2,c3] ~ ~ [g1,g2] ~ [e1,e2]',
  '[a1,a2] ~ ~ ~ ~ ~ ~ [a1,a2] ~ ~ [a1,a2] ~ ~ [c2,c3] ~ [e1,e2]',
  '[d2,d3] ~ ~ ~ ~ ~ ~ [d2,d3] ~ ~ [d2,d3] ~ ~ [a1,a2] ~ [f#1,f#2]',
]
const BASS_THIN = [
  'e1 ~ ~ ~ ~ ~ ~ ~ ~ ~ e1 ~ ~ ~ ~ d1',
  'c2 ~ ~ ~ ~ ~ ~ ~ ~ ~ c2 ~ ~ ~ ~ ~',
  'a1 ~ ~ ~ ~ ~ ~ ~ ~ ~ a1 ~ ~ ~ ~ ~',
  'd2 ~ ~ ~ ~ ~ ~ ~ ~ ~ d2 ~ ~ ~ ~ f#1',
]

// ONE keys motif: high note, fall, then a 9th sighing onto the chord tone
const MOTIF = [
  '~ ~ ~ ~ ~ ~ b3 ~ g3 ~ ~ [f#3 e3] ~ ~ ~ ~',
  '~ ~ ~ ~ ~ ~ c4 ~ g3 ~ ~ [d3 e3] ~ ~ ~ ~',
  '~ ~ ~ ~ ~ ~ c4 ~ a3 ~ ~ [b3 a3] ~ ~ ~ ~',
  '~ ~ ~ ~ ~ ~ a3 ~ f#3 ~ ~ [e3 f#3] ~ ~ ~ ~',
]

// 2-step drums: syncopated kick (never four-on-floor), snare on 2 & 4
const KICK_HOOK = [
  'bd ~ ~ ~ ~ ~ ~ bd ~ ~ bd ~ ~ ~ ~ bd',
  'bd ~ ~ ~ ~ ~ ~ bd ~ bd ~ ~ ~ ~ bd ~',
]
const KICK_VERSE = [
  'bd ~ ~ ~ ~ ~ ~ bd ~ ~ bd ~ ~ ~ ~ ~',
  'bd ~ ~ ~ ~ ~ ~ ~ ~ ~ bd ~ ~ bd ~ ~',
]
const SNARE = [
  '~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~',
  '~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ [~ sd]',
]
const HATS_HOOK = [
  'hh ~ hh hh ~ hh hh ~ hh ~ hh hh ~ hh ~ oh',
  'hh ~ hh hh ~ hh hh ~ hh ~ hh hh ~ oh hh ~',
]
const HATS_VERSE = [
  'hh ~ ~ hh hh ~ hh ~ hh ~ ~ hh hh ~ hh ~',
  'hh ~ ~ hh hh ~ hh ~ hh ~ ~ hh hh ~ ~ oh',
]
const HATS_BRIDGE = ['~ ~ hh ~ hh ~ ~ hh ~ ~ hh ~ hh ~ ~ hh']

const kickV = (phrase) => s(m(phrase)).bank("YamahaRY30")
  .shape(0.2).clip(1.6).release(0.3).gain(0.9)
const snareV = (phrase) => s(m(phrase)).bank("YamahaRY30")
  .clip(1.5).release(0.3).gain(0.48)
const clapV = () => s("~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~").bank("LinnDrum")
  .clip(1.4).room(0.15).gain(0.28)
const hatsV = (phrase, hatGain) => s(m(phrase)).bank("YamahaRY30")
  .swingBy(0.12, 8).clip(0.9).gain(hatGain).pan(0.15)

const bassV = (phrase) => note(m(phrase)).s("square")
  .lpf(320).shape(0.15).clip(0.85).release(0.08).gain(0.55)
const stabV = (chord, rhythm, stabGain) => note(m(chord)).struct(m(rhythm)).s("piano")
  .lpf(2600).clip(1.2).swingBy(0.12, 8).room(0.25).gain(stabGain)
const motifV = (phrase, motifGain) => note(m(phrase)).s("piano")
  .lpf(2400).clip(1.4).room(0.35).gain(motifGain)
const padV = (chord) => note(m(chord)).s("sawtooth")
  .lpf(680).attack(0.25).release(0.6).clip(1.9).room(0.5).gain(0.24)
const hiss = (hissGain) => s("noise").lpf(520).gain(hissGain)

const STAB_HOOK = '~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~'
const STAB_SOFT = 'x ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~'

// -- sections (each fn builds ONE cycle; chords advance via per-entry literals) --

const introSeg = (k) => stack(
  motifV(MOTIF[k % 4], 0.42),
  stabV(STAB[k % 4], STAB_SOFT, 0.3),
  hiss(0.05),
  ...(k >= 2 ? [hatsV(HATS_VERSE[k % 2], 0.22)] : []),
)

const hookSeg = (k) => stack(
  kickV(KICK_HOOK[k % 2]),
  snareV(SNARE[k % 4 === 3 ? 1 : 0]),
  clapV(),
  hatsV(HATS_HOOK[k % 2], 0.3),
  bassV(BASS_HOOK[k % 4]),
  stabV(STAB[k % 4], STAB_HOOK, 0.38),
)

const verseSeg = (k) => stack(
  kickV(KICK_VERSE[k % 2]),
  snareV(SNARE[0]),
  hatsV(HATS_VERSE[k % 2], 0.26),
  bassV(BASS_THIN[k % 4]),
  motifV(MOTIF[k % 4], 0.46),
  stabV(STAB[k % 4], STAB_SOFT, 0.26),
)

const bridgeSeg = (k) => stack(
  snareV(SNARE[0]),
  hatsV(HATS_BRIDGE[0], 0.22),
  padV(PAD[k % 4]),
  motifV(MOTIF[k % 4], 0.4),
  hiss(0.04),
)

const hookBigSeg = (k) => stack(
  kickV(KICK_HOOK[k % 2]),
  snareV(SNARE[k % 4 === 3 ? 1 : 0]),
  clapV(),
  hatsV(HATS_HOOK[k % 2], 0.32),
  bassV(BASS_HOOK_OCT[k % 4]),
  stabV(STAB[k % 4], STAB_HOOK, 0.4),
  ...(k >= 8 ? [motifV(MOTIF[k % 4], 0.42)] : []),
)

const outroSeg = (k) => stack(
  motifV(MOTIF[k % 4], Math.max(0.18, 0.44 - k * 0.045)),
  stabV(STAB[k % 4], STAB_SOFT, Math.max(0.12, 0.3 - k * 0.03)),
  hiss(0.035),
)

const PLAN = [
  [introSeg, 4],
  [hookSeg, 8],
  [verseSeg, 12],
  [hookSeg, 8],
  [verseSeg, 12],
  [bridgeSeg, 8],
  [hookBigSeg, 16],
  [outroSeg, 6],
] // 74 cycles

slowcat(...PLAN.flatMap(([seg, len]) => Array.from({ length: len }, (_, k) => seg(k))))`
