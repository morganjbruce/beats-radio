export const title = 'Fortnight of Sundays'
export const genre = 'Dub-damaged post-punk — Metal Box-era London, 1979; Wobble-school lead bass, Levene-school treble shards, ~100 BPM'
export const mood = 'A grey march through a rented decade: the bass walks like it owes nothing to anyone, guitar splinters scrape the ceiling, and a voice somewhere behind the wall keeps almost saying something. It does not build and it does not stop. The dread is that it was already going when you arrived.'
export const cycles = 96
export const model = 'claude-fable-5'
export const prompt = 'PiL albatross — metal box dub-damaged post-punk, wobble bass forward, levene shards, grey trudge'
export const author = 'morgan'

export const code = `setcps(100/240)

// ---- the riff world: one E-minor dub bassline, b2 and tritone as passing dirt ----
const RIFF = [
  'e1 ~ [e1 e1] g1 ~ a1 ~ g1',
  'e1 ~ [e1 e1] g1 ~ e1 ~ f1',
  'e1 ~ [e1 e1] g1 ~ a1 bb1 a1',
  'e1 ~ [e1 e1] d1 ~ e1 ~ ~',
]

// ---- shard cells: thin, dissonant, intermittent — minor 2nds and tritones up top ----
const SH_B = [
  '~ ~ ~ [f5 e5] ~ ~ ~ ~',
  '~@8',
  '~ ~ ~ ~ ~ [bb4 e5] ~ ~',
  '~ [e5 f5] ~ ~ ~ ~ ~ ~',
]
const SH_C = [
  '~@8',
  '~ ~ ~ ~ ~ [f5 e5] ~ ~',
  '~@8',
  '~ ~ [b4 f5] ~ ~ ~ ~ ~',
]
const SH_E = [
  '~ ~ [f5 e5] ~ ~ ~ ~ ~',
  '~@8',
  '~ ~ ~ ~ [e5 bb4] ~ ~ ~',
  '~ [f5 e5 f5] ~ ~ ~ ~ ~',
]
const SH_F = [
  '~ [f5 e5] ~ [e5 f5] ~ ~ [bb4 e5] ~',
  '~ ~ [e5 f5 e5] ~ ~ [b4 f5] ~ ~',
  '[f5 e5] ~ ~ [bb4 e5] ~ [f5 e5] ~ ~',
  '~ [b4 f5] ~ ~ [e5 f5 e5] ~ [f5 e5] ~',
]

// ---- the wail: one narrow motif, middle distance, mostly absent ----
const WA_C = [
  'b3@5 c4@3',
  '~@8',
  '~@2 a3@4 g3@2',
  '~@8',
]
const WA_E = [
  '~@8',
  'b3@4 c4@4',
  '~@8',
  'c4@3 b3@3 a3@2',
]
const WA_F = [
  '~@8',
  '~@8',
  '~@8',
  'b3@5 c4@3',
]

// ---- voices ----
const wobble = (riff, wet) => note(m(riff)).s("triangle")
  .lpf(330).attack(0.01).release(0.2).clip(1.05).shape(0.18)
  .room(wet).gain(0.92)

const shard = (cell) => note(m(cell)).s("sawtooth")
  .hpf(2500).clip(0.4).release(0.05).delay(0.25).pan(0.2).gain(0.3)

const wail = (line, g) => note(m(line)).s("sawtooth")
  .lpf(1100).hpf(280).vib(4.5).vmod(0.09)
  .attack(0.25).release(0.5).room(0.45).gain(g)

const drumsDry = (hatStr, hatGain) => stack(
  s("bd ~ ~ ~ bd ~ ~ ~").bank("EmuDrumulator").gain(0.8).clip(1.5).release(0.3),
  s("~ ~ sd ~ ~ ~ sd ~").bank("EmuDrumulator").gain(0.55).clip(1.4).release(0.3).room(0.12),
  s(m(hatStr)).bank("RolandCompurhythm78").hpf(6000).gain(hatGain).clip(0.6).release(0.25).pan(-0.15),
)

const drumsDub = () => stack(
  s("bd ~ ~ ~ bd ~ ~ ~").bank("EmuDrumulator").gain(0.8).clip(1.5).release(0.3),
  s("~ ~ sd ~ ~ ~ sd ~").bank("EmuDrumulator").gain(0.5).clip(1.6).release(0.35).room(0.55).delay(0.45),
  s("hh*8").bank("RolandCompurhythm78").hpf(6000).gain(0.16).clip(0.6).release(0.25).delay(0.4).pan(-0.15),
)

const drumsWalkOff = () => stack(
  s("bd ~ ~ ~ bd ~ ~ ~").bank("EmuDrumulator").gain(0.78).clip(1.5).release(0.3),
  s("hh*8").bank("RolandCompurhythm78").hpf(6000).gain(0.14).clip(0.6).release(0.25).pan(-0.15),
)

const hiss = (g) => s("noise").lpf(800).gain(g)

// ---- sections ----
// A: the march starts mid-stride, already going
const segA = (k) => stack(
  wobble(RIFF[k % 4], 0),
  drumsDry('hh*8', 0.2),
  hiss(0.045),
)
// B: shards arrive, scraping the top
const segB = (k) => stack(
  wobble(RIFF[k % 4], 0),
  drumsDry('hh*8', 0.2),
  shard(SH_B[k % 4]),
)
// C: the wail drifts in behind the wall
const segC = (k) => stack(
  wobble(RIFF[k % 4], 0),
  drumsDry('hh*8', 0.18),
  shard(SH_C[k % 4]),
  wail(WA_C[k % 4], 0.26),
)
// D: dub moment — shards and wail fall into echo, bass and drums alone
const segD = (k) => stack(
  wobble(RIFF[k % 4], 0.12),
  drumsDub(),
)
// E: everything returns, wearier
const segE = (k) => stack(
  wobble(RIFF[k % 4], 0),
  drumsDry('hh*4', 0.16),
  shard(SH_E[k % 4]),
  wail(WA_E[k % 4], 0.22),
)
// F: the shards get insistent — the only peak is density of scraping
const segF = (k) => stack(
  wobble(RIFF[k % 4], 0),
  drumsDry('hh*8', 0.2),
  shard(SH_F[k % 4]),
  wail(WA_F[k % 4], 0.22),
)
// G: it walks off still going, ends hanging on the b2
const segG = (k) => stack(
  wobble(RIFF[k === 11 ? 1 : k % 4], 0),
  k < 8 ? drumsDry('hh*8', 0.16) : drumsWalkOff(),
  hiss(0.04),
)

slowcat(
  ...Array.from({ length: 12 }, (_, k) => segA(k)),
  ...Array.from({ length: 16 }, (_, k) => segB(k)),
  ...Array.from({ length: 12 }, (_, k) => segC(k)),
  ...Array.from({ length: 12 }, (_, k) => segD(k)),
  ...Array.from({ length: 16 }, (_, k) => segE(k)),
  ...Array.from({ length: 16 }, (_, k) => segF(k)),
  ...Array.from({ length: 12 }, (_, k) => segG(k)),
)`
