export const title = 'SYSTEM BLEED'
export const genre = 'Industrial hip-hop — Sacramento Money Store / No Love Deep Web lineage, ~139 BPM'
export const mood = 'A riff that stabs instead of plays, drums that lurch like a broken sampler held on grid by force. It goes quiet just long enough for you to hear your own pulse, then comes back worse. Ends mid-sentence.'
export const cycles = 71
export const model = 'claude-fable-5'
export const prompt = 'death grips — money store era industrial hip-hop, distorted lurching drums, paranoid stabs'
export const author = 'morgan'

export const code = `setcps(0.58)

// ---- ONE riff, E phrygian (b2 = f, tritone = bb), developed not replaced ----
const RF_MAIN = 'e4 ~ [f4 e4] ~ ~ e4 bb3 ~'
const RF_CUT  = 'e4 ~ f4 ~ ~ ~ ~ ~'
const RF_LOW  = 'e3 ~ [f3 e3] ~ ~ e3 bb2 ~'
const RF_DRV  = 'e3 e3 [f3 e3] ~ bb2 ~ e3 ~'

const stab = (phrase, drive, cut, vol) => note(m(phrase))
  .s("square").hpf(180).lpf(cut).resonance(9)
  .attack(0.001).decay(0.14).sustain(0.12).release(0.08)
  .shape(drive).gain(vol)

const subv = (phrase, vol) => note(m(phrase)).s("sine")
  .lpf(95).attack(0.005).release(0.25).gain(vol)

const kik = (pat, drive) => s(m(pat)).bank("RolandTR808")
  .shape(drive).clip(1.6).release(0.3).gain(0.85)

const snr = (pat, drive) => s(m(pat)).bank("SimmonsSDS5")
  .shape(drive).clip(1.4).release(0.25).gain(0.5)

const hat = (pat, vol) => s(m(pat)).bank("EmuDrumulator")
  .hpf(600).shape(0.3).gain(vol)

// ---- lurching kick/snare literals (all on grid) ----
const K_A = [
  'bd ~ ~ bd ~ ~ bd ~',
  'bd ~ bd ~ ~ [bd bd] ~ ~',
  'bd ~ ~ bd ~ ~ bd bd',
  '[bd bd] ~ bd ~ ~ bd ~ ~',
]
const S_A = [
  '~ ~ sd ~ ~ ~ sd ~',
  '~ ~ sd ~ ~ ~ sd ~',
  '~ ~ sd ~ ~ sd ~ ~',
  '~ ~ sd ~ ~ ~ [sd sd] ~',
]
const K_L = [
  'bd bd ~ ~ bd ~ ~ ~',
  '~ ~ bd bd ~ ~ bd ~',
  'bd ~ ~ ~ [bd bd] ~ ~ bd',
  'bd ~ bd ~ bd ~ bd ~',
]
const S_L = [
  '~ ~ ~ sd ~ ~ ~ ~',
  '~ sd ~ ~ ~ ~ sd ~',
  '~ ~ sd ~ ~ ~ ~ sd',
  '~ ~ sd ~ ~ ~ sd ~',
]
const SB_L = [
  'e1 e1 ~ ~ e1 ~ ~ ~',
  '~ ~ e1 e1 ~ ~ e1 ~',
  'e1 ~ ~ ~ f1 ~ ~ e1',
  'e1 ~ e1 ~ e1 ~ e1 ~',
]
const K_B = [
  'bd ~ bd bd ~ ~ bd ~',
  'bd bd ~ bd ~ bd ~ ~',
  'bd ~ bd ~ ~ [bd bd] ~ bd',
  '[bd bd] ~ bd ~ bd ~ ~ bd',
]
const S_B = [
  '~ ~ sd ~ ~ ~ sd ~',
  '~ ~ sd ~ ~ sd ~ sd',
  '~ ~ [sd sd] ~ ~ ~ sd ~',
  '~ ~ sd ~ ~ ~ sd sd',
]
const K_P = [
  'bd bd ~ bd bd ~ bd ~',
  'bd ~ [bd bd] bd ~ bd ~ bd',
  'bd bd ~ bd ~ [bd bd] bd ~',
  '[bd bd] bd ~ bd bd ~ bd bd',
]
const S_P = [
  '~ ~ sd ~ ~ ~ sd ~',
  '~ ~ sd ~ ~ sd ~ [sd sd]',
  '~ ~ [sd sd] ~ ~ ~ sd sd',
  '~ sd sd ~ ~ ~ sd ~',
]

// ---- sections ----
const CO_DRV = [0.3, 0.3, 0.4, 0.4, 0.5, 0.5, 0.6, 0.6]
const CO_PH  = [RF_MAIN, RF_MAIN, RF_MAIN, RF_CUT, RF_MAIN, RF_MAIN, RF_CUT, RF_MAIN]
const coldSeg = (i) => stab(CO_PH[i % 8], CO_DRV[i % 8], 1600, 0.45)

const gapSeg = () => s("~")

const a1Seg = (i) => stack(
  stab(RF_MAIN, 0.5, 1800, 0.42),
  subv('e1 ~ ~ e1 ~ ~ ~ ~', 0.72),
  kik(K_A[i % 4], 0.4),
  snr(S_A[i % 4], 0.4),
  hat('hh hh ~ hh hh ~ hh ~', 0.28),
)

const lurchSeg = (i) => stack(
  stab(RF_CUT, 0.55, 1500, 0.42),
  subv(SB_L[Math.floor(i / 2) % 4], 0.7),
  kik(K_L[Math.floor(i / 2) % 4], 0.5),
  snr(S_L[Math.floor(i / 2) % 4], 0.45),
)

const CALM_HIT = [
  '~ ~ ~ ~ ~ ~ ~ ~',
  '~ ~ ~ ~ ~ ~ sd ~',
  '~ ~ ~ ~ ~ ~ ~ ~',
  '~ ~ ~ ~ ~ ~ ~ ~',
  '~ ~ sd ~ ~ ~ ~ ~',
]
const calmSeg = (i) => stack(
  note("e1").s("sine").lpf(80).attack(0.3).release(1.5).clip(0.9).gain(0.55),
  s(m(CALM_HIT[i % 5])).bank("SimmonsSDS5").room(0.7).lpf(1200).gain(0.32),
  hat('~ ~ ~ hh ~ ~ ~ ~', 0.14),
  s("noise").lpf(280).gain(0.055),
  ...(i >= 6 ? [stab(RF_CUT, 0.3, 700, 0.2)] : []),
)

const a2Seg = (i) => stack(
  stab(RF_LOW, 0.65, 1400, 0.44),
  subv('e1 ~ ~ e1 ~ f1 ~ ~', 0.74),
  kik(K_B[i % 4], 0.6),
  snr(S_B[i % 4], 0.5),
  hat('hh*8', 0.24),
)

const NZ_G = [0.06, 0.08, 0.09, 0.11, 0.12, 0.14, 0.15, 0.17, 0.18, 0.2]
const peakSeg = (i) => stack(
  stab(RF_DRV, 0.8, 2200, 0.45),
  subv('e1 e1 ~ e1 ~ f1 ~ e1', 0.74),
  kik(K_P[i % 4], 0.7),
  snr(S_P[i % 4], 0.55),
  s("~ ~ oh ~ ~ ~ oh ~").bank("RolandTR808").shape(0.4).hpf(500).gain(0.26),
  s("noise*4").hpf(900).lpf(5000).gain(NZ_G[i % 10]),
)

const endSeg = () => s("bd ~ ~ ~ ~ ~ ~ ~").bank("RolandTR808").shape(0.3).clip(1).gain(0.85)

const PLAN = [
  [coldSeg, 8],
  [a1Seg, 6], [gapSeg, 1], [a1Seg, 7],
  [lurchSeg, 12],
  [calmSeg, 10],
  [a2Seg, 7], [gapSeg, 1], [a2Seg, 8],
  [peakSeg, 10],
  [endSeg, 1],
]
slowcat(...PLAN.flatMap(([seg, len]) => Array.from({ length: len }, (_, k) => seg(k))))`
