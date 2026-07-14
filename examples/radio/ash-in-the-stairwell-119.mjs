export const title = 'Ash in the Stairwell'
export const genre = 'Boom bap / hardcore East Coast hip-hop — Tical-era Shaolin murk, RZA lineage, ~88 BPM'
export const mood = 'A smoked-out basement where the piano loop leans like the room is tilting. The drums crack once and let the air ring; the bass never walks, it waits. Blunted, dangerous, and grinning about it.'
export const cycles = 68
export const model = 'claude-fable-5'
export const prompt = 'rza method man 94 tical — smoked-out shaolin murk, seasick loop, cracking sparse drums'
export const author = 'morgan'
export const code = `setcps(0.3667)

// ---- E minor murk: dyads rub the b2 (f) and the tritone (bb) ----
const LOOP_HI = [
  '[e4,g4] ~ ~ [d4,f4] ~ [e4,g4] ~ ~',
  '[e4,g4] ~ ~ [f4,b4] ~ ~ [e4,bb4] ~',
]
// verse 2: the same figure restated a perfect 4th down, spelled out
const LOOP_LO = [
  '[b3,d4] ~ ~ [a3,c4] ~ [b3,d4] ~ ~',
  '[b3,d4] ~ ~ [c4,f#4] ~ ~ [b3,f4] ~',
]
const LOOP_OUT = [
  '[e4,g4] ~ ~ ~ ~ ~ [e4,bb4] ~',
  '[e4,g4] ~ ~ ~ ~ ~ ~ ~',
  '~ ~ ~ [f4,b4] ~ ~ [e4,g4] ~',
  '[e4,g4] ~ ~ ~ ~ ~ ~ ~',
]

// ---- bass lurks, locked to the kick ----
const BASS_V1 = [
  'e1 ~ ~ ~ ~ ~ [~ e1] ~',
  'e1 ~ ~ ~ ~ g1 ~ [~ f1]',
]
const BASS_V2 = [
  'b1 ~ ~ ~ ~ ~ [~ b1] ~',
  'b1 ~ ~ ~ ~ d2 ~ [~ c2]',
]
const BASS_HK = [
  'e1 ~ ~ ~ [~ e1] ~ bb1 ~',
  'e1 ~ ~ ~ [~ e1] ~ ~ [g1 f1]',
]

// ---- drums: one kick voice, cracking snare, hats never a carpet ----
const KICKS = [
  'bd ~ ~ ~ ~ ~ ~ bd ~ ~ bd ~ ~ ~ ~ ~',
  'bd ~ ~ ~ ~ ~ ~ ~ ~ ~ bd ~ ~ bd ~ ~',
]
const BACKBEAT = '~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~'
const HATS = [
  '~ ~ hh ~ ~ ~ [~ hh] ~ ~ ~ hh ~ ~ ~ ~ ~',
  '~',
  '~ ~ hh ~ ~ ~ ~ ~ ~ ~ [~ hh] ~ ~ ~ hh ~',
  '~ ~ ~ ~ ~ ~ [~ hh] ~ ~ ~ hh ~ ~ ~ ~ ~',
]
const HATS_PEAK = [
  '~ ~ hh ~ ~ ~ [~ hh] ~ ~ ~ hh ~ ~ oh ~ ~',
  '~ ~ hh ~ ~ ~ ~ ~ ~ ~ [~ hh] ~ ~ ~ hh ~',
  '~ ~ hh ~ ~ ~ [~ hh] ~ ~ ~ hh ~ ~ ~ ~ ~',
  '~ ~ ~ ~ ~ ~ [~ hh] ~ ~ oh ~ ~ ~ hh ~ ~',
]

// ---- hook answer: a darker texture talks back to the loop ----
const ANSW = [
  '~ ~ ~ ~ [e3,bb3] ~ ~ ~',
  '~ ~ ~ ~ ~ [f3,b3] ~ [e3,g3]',
]

// ---- voices ----
const ghost = (phrase, depth, cutoff, level) => note(m(phrase)).s("piano")
  .lpf(cutoff).vib(0.4).vmod(depth).clip(1.7).room(0.45).gain(level)
const lurk = (phrase, level) => note(m(phrase)).s("triangle")
  .lpf(160).shape(0.2).release(0.12).gain(level)
const shadow = (phrase) => note(m(phrase)).s("tubularbells")
  .lpf(900).vib(0.35).vmod(0.05).room(0.6).gain(0.28)
const smoke = (level) => s("noise").lpf(sine.range(220, 420).slow(8)).gain(level)
const kit = (k, hatArr, hatLevel) => stack(
  s(m(KICKS[k % 2])).bank("EmuSP12").shape(0.25).gain(0.92),
  s(m(BACKBEAT)).bank("EmuSP12").clip(1.4).release(0.28).gain(0.55),
  s(m(hatArr[k % 4])).bank("EmuSP12").gain(hatLevel)
)

// ---- sections ----
const introSeg = (k) => stack(
  ghost(LOOP_HI[k % 2], 0.03, 1300, 0.4),
  smoke(0.05)
)
const verse1Seg = (k) => stack(
  ghost(LOOP_HI[k % 2], 0.05, 1600, 0.42),
  lurk(BASS_V1[k % 2], 0.72),
  kit(k, HATS, 0.16)
)
const hookSeg = (k) => stack(
  ghost(LOOP_HI[k % 2], 0.06, 1700, 0.44),
  shadow(ANSW[k % 2]),
  lurk(BASS_HK[k % 2], 0.75),
  kit(k, HATS, 0.18)
)
const verse2Seg = (k) => stack(
  ghost(LOOP_LO[k % 2], 0.08, 1150, 0.42),
  lurk(BASS_V2[k % 2], 0.72),
  kit(k, HATS, 0.12)
)
const bridgeSeg = (k) => stack(
  ghost(LOOP_HI[k % 2], 0.13, 950, 0.44),
  lurk(BASS_V1[k % 2], 0.3),
  smoke(0.06)
)
const peakSeg = (k) => stack(
  ghost(LOOP_HI[k % 2], 0.07, 1800, 0.46),
  shadow(ANSW[k % 2]),
  lurk(BASS_HK[k % 2], 0.78),
  kit(k, HATS_PEAK, 0.2)
)
const outroSeg = (k) => stack(
  ghost(LOOP_OUT[k % 4], 0.1, 1100, 0.38),
  lurk(BASS_V1[k % 2], 0.4),
  smoke(0.05)
)

slowcat(
  ...Array.from({ length: 4 },  (_, k) => introSeg(k)),
  ...Array.from({ length: 12 }, (_, k) => verse1Seg(k)),
  ...Array.from({ length: 8 },  (_, k) => hookSeg(k)),
  ...Array.from({ length: 12 }, (_, k) => verse2Seg(k)),
  ...Array.from({ length: 8 },  (_, k) => hookSeg(k)),
  ...Array.from({ length: 8 },  (_, k) => bridgeSeg(k)),
  ...Array.from({ length: 10 }, (_, k) => peakSeg(k)),
  ...Array.from({ length: 6 },  (_, k) => outroSeg(k)),
)`
