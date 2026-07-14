export const title = 'Circle Work'
export const genre = 'Chicago footwork — DJ Rashad / Teklife school, juke lineage, ~160 BPM'
export const mood = 'A dance battle at 2am under one flickering gym light. The same chopped syllable circles until it hypnotizes, triplet kicks snapping against straight sixteenths — frantic feet, calm face.'
export const cycles = 96
export const model = 'claude-fable-5'
export const prompt = 'chicago footwork, dj rashad teklife school — 160bpm triplet tension, chopped hook'
export const author = 'morgan'

export const code = `setcps(0.667)

// ---- hook chops (F minor pentatonic: f ab bb c eb) ----
const HOOK_INTRO = [
  'f4 ~ ~ f4 ~ eb4 ~ ~',
  'f4 ~ ~ f4 ~ ab4 eb4 ~',
]
const HOOK_MAIN = [
  'f4 f4 ~ eb4 f4 ~ c4 ~',
  'f4 f4 ~ eb4 f4 ~ ab4 bb4',
  'f4 ~ f4 eb4 ~ f4 c4 ~',
  'f4 f4 ~ eb4 f4 ~ c4 eb4',
]
const HOOK_BREATH = [
  '~ ~ f4 ~ ~ ~ eb4 ~',
  '~ ~ f4 ~ ~ ~ c4 ~',
]
const HOOK_RECHOP = [
  '[f4 f4 f4] ~ eb4 ~ [c4 c4 c4] ~ f4 ~',
  '[f4 f4 f4] ~ eb4 f4 ~ ab4 [eb4 eb4 eb4] ~',
  '[f4 f4 f4] ~ eb4 ~ [c4 c4 c4] ~ bb4 ab4',
  'f4 [f4 f4 f4] ~ eb4 [c4 c4 c4] ~ f4 ~',
]
const HOOK_PEAK = [
  'f4 [f4 f4 f4] eb4 f4 [c4 c4 c4] f4 eb4 bb4',
  'f4 [f4 f4 f4] eb4 f4 ab4 [eb4 eb4 eb4] c4 ~',
]

// ---- sub hits (punctuate, never walk) ----
const SUB_MAIN = [
  'f1 ~ ~ ~ ~ ~ f1 ~',
  'f1 ~ ~ ~ ab1 ~ ~ ~',
  'f1 ~ ~ ~ ~ ~ f1 ~',
  'f1 ~ ~ ~ ~ eb1 ~ ~',
]
const SUB_BREATH = [
  'f1 ~ ~ ~ ~ ~ ~ ~',
  'f1 ~ ~ ~ ~ ~ eb1 ~',
]
const SUB_PEAK = [
  'f1 ~ f1 ~ ~ ~ f1 ~',
  'f1 ~ ~ ~ ab1 ~ eb1 ~',
]

// ---- drums: quarter-note grid, triplets in brackets vs straight 16th hats ----
const KICK_IN = [
  'bd [~ bd] ~ bd',
  'bd [~ bd] ~ [bd bd bd]',
]
const KICK_MAIN = [
  'bd [~ bd] ~ [bd bd bd]',
  'bd [~ bd] [~ bd] bd',
  'bd [~ bd] ~ [bd bd bd]',
  'bd ~ [bd bd bd] bd',
]
const KICK_PEAK = [
  'bd [~ bd] [bd bd bd] [bd bd bd]',
  'bd [bd bd bd] [~ bd] [bd bd bd]',
]
const HATS_MAIN = [
  '~ ~ [hh hh hh hh] ~',
  '~ ~ ~ [hh hh hh hh]',
  '~ ~ [hh hh hh hh] ~',
  '~ [hh hh] ~ [hh hh hh hh]',
]
const HATS_PEAK = [
  '[hh hh hh hh] ~ [hh hh hh hh] ~',
  '~ [hh hh hh hh] ~ [hh hh hh hh]',
]
const TOMS_PEAK = [
  '~ ~ ~ [lt lt lt]',
  '~ ~ ~ ~',
]

// ---- voices ----
const hookVoice = (phrase, cutoff, vol) => note(m(phrase)).s("sawtooth")
  .hpf(420).lpf(cutoff).resonance(12)
  .attack(0.004).decay(0.12).sustain(0.2).release(0.12)
  .vib(5).vmod(0.08).gain(vol)
const subVoice = (phrase) => note(m(phrase)).s("sine")
  .lpf(95).attack(0.004).release(0.15).gain(0.72)
const kickVoice = (phrase, vol) => s(m(phrase)).bank("RolandTR808")
  .clip(1.5).release(0.3).gain(vol)
const clapVoice = (phrase, vol) => s(m(phrase)).bank("RolandTR808")
  .clip(1.4).release(0.25).gain(vol)
const hatVoice = (phrase, vol) => s(m(phrase)).bank("RolandTR808")
  .clip(1.4).release(0.25).gain(vol)
const tomVoice = (phrase) => s(m(phrase)).bank("RolandTR808")
  .clip(1.6).release(0.3).gain(0.4)
const padVoice = (chord) => note(m(chord)).s("sawtooth")
  .lpf(500).attack(0.3).release(0.6).room(0.35).gain(0.24)

// ---- sections ----
const introSeg = (k) => stack(
  hookVoice(HOOK_INTRO[k % 2], 1200, 0.4),
)
const drumsInSeg = (k) => stack(
  hookVoice(HOOK_MAIN[k % 4], 1300, 0.4),
  kickVoice(KICK_IN[k % 2], 0.85),
  clapVoice('~ cp ~ cp', 0.4),
)
const mainSeg = (k) => stack(
  hookVoice(HOOK_MAIN[k % 4], 1400, 0.42),
  subVoice(SUB_MAIN[k % 4]),
  kickVoice(KICK_MAIN[k % 4], 0.85),
  clapVoice('~ cp ~ cp', 0.42),
  hatVoice(HATS_MAIN[k % 4], 0.3),
)
const breathSeg = (k) => stack(
  hookVoice(HOOK_BREATH[k % 2], 1000, 0.35),
  subVoice(SUB_BREATH[k % 2]),
  padVoice('f2,ab2,c3'),
  kickVoice('bd ~ ~ ~', 0.7),
)
const rechopSeg = (k) => stack(
  hookVoice(HOOK_RECHOP[k % 4], 1450, 0.42),
  subVoice(SUB_MAIN[k % 4]),
  kickVoice(KICK_MAIN[(k + 1) % 4], 0.85),
  clapVoice('~ cp ~ [cp cp]', 0.42),
)
const peakSeg = (k) => stack(
  hookVoice(HOOK_PEAK[k % 2], 1600, 0.44),
  subVoice(SUB_PEAK[k % 2]),
  kickVoice(KICK_PEAK[k % 2], 0.85),
  clapVoice('~ cp ~ cp', 0.44),
  hatVoice(HATS_PEAK[k % 2], 0.32),
  tomVoice(TOMS_PEAK[k % 2]),
)
const stripSeg = (k) => stack(
  hookVoice(HOOK_MAIN[(k + 2) % 4], 1250, 0.4),
  kickVoice(KICK_MAIN[k % 4], 0.82),
  hatVoice(HATS_MAIN[(k + 1) % 4], 0.26),
)
const outSeg = (k) => stack(
  hookVoice(HOOK_INTRO[k % 2], 1000 - k * 60, 0.36 - k * 0.02),
  kickVoice(k < 4 ? 'bd ~ ~ bd' : 'bd ~ ~ ~', 0.6),
)

// intro 8 | drums-in 12 | main 16 | breath 10 | rechop 16 | peak 14 | strip 12 | out 8 = 96
const PLAN = [
  [introSeg, 8],
  [drumsInSeg, 12],
  [mainSeg, 16],
  [breathSeg, 10],
  [rechopSeg, 16],
  [peakSeg, 14],
  [stripSeg, 12],
  [outSeg, 8],
]
slowcat(...PLAN.flatMap(([seg, len]) => Array.from({ length: len }, (_, k) => seg(k))))`
