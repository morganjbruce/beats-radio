export const title = 'Harbourside, Last Bus Gone'
export const genre = 'Bristol trip-hop, Portishead school circa 1994, ~76 BPM'
export const mood = 'Rain on the docks at 2am, a cigarette burning down to the filter. A theremin-like voice grieves over dusty SP-12 drums and a bass that prowls but never pounces. The tension leans on a Neapolitan chord and a b9 dominant that refuses to resolve.'
export const cycles = 72
export const model = 'claude-fable-5'
export const prompt = 'bristol trip-hop, portishead school — dusty cinematic heartbreak'
export const author = 'morgan'

export const code = `setcps(0.317)

// --- harmony: D minor noir. Verse i(add9)-i7-bVI-V7b9; hook adds the Neapolitan bII ---
const VERSE_CH = ['d3,f3,a3,e4', 'd3,f3,a3,c4', 'bb2,d3,f3,a3', 'a2,c#3,g3,bb3']
const VERSE_RT = ['d2', 'd2', 'bb1', 'a1']
const HOOK_CH = ['d3,f3,a3,c4,e4', 'bb2,d3,f3,a3', 'eb3,g3,bb3,d4', 'a2,c#3,g3,bb3']
const HOOK_RT = ['d2', 'bb1', 'eb2', 'a1']
const PAD_CH = ['d2,a2,f3', 'bb1,f2,d3', 'eb2,bb2,g3', 'a1,g2,c#3']
const BRIDGE_CH = ['a2,d3,f3', 'a2,c#3,g3']

// --- the lament motif: falling a-f-e, answered per chord; fragmented in the bridge ---
const HOOK_LD = [
  'a4 ~ ~ ~ f4 ~ e4 ~',
  '~ ~ f4 ~ ~ d4 ~ c4',
  'g4 ~ ~ bb4 ~ ~ f4 ~',
  'e4 ~ ~ ~ ~ c#4 ~ ~',
]
const BRIDGE_LD = [
  'a4 ~ ~ ~ ~ ~ ~ ~',
  '~ ~ ~ ~ f4 ~ e4 ~',
]

// --- palette helpers ---
const crackle = s("noise*8").hpf(1400).lpf(6500).decay(0.03).sustain(0)
  .gain(perlin.range(0.02, 0.05)).pan(sine.range(-0.2, 0.2).slow(7))

const bassLine = (root, level) => note(m(root)).struct("x ~ ~ ~ ~ x ~ ~")
  .s("sine").lpf(150).clip(3).release(0.15).shape(0.1).gain(level)

const keys = (chord, cutoff, level) => note(m(chord)).struct("x ~ ~ ~ ~ ~ x ~")
  .s("rhodes").clip(5).release(0.4).lpf(cutoff).room(0.45).gain(level)

const lament = (phrase, level) => note(m(phrase)).s("triangle")
  .lpf(1700).vib(5).vmod(0.09).attack(0.04).release(0.5)
  .room(0.6).delay(0.35).gain(level)

const padPeak = (chord) => note(m(chord)).struct("x ~ ~ ~ ~ ~ ~ ~")
  .s("sawtooth").clip(7).lpf(450).attack(0.4).release(0.8).room(0.5).gain(0.16)

// --- drums: EmuSP12, off a dusty 45. single kick voice, snare well under it ---
const drumsVerse = () => stack(
  s("bd ~ ~ ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~").bank("EmuSP12").clip(1.5).release(0.3).shape(0.15).gain(0.85),
  s("~ ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~").bank("EmuSP12").clip(1.6).release(0.35).room(0.2).gain(0.5),
  s("~ ~ hh ~ ~ ~ hh ~ ~ ~ hh ~ ~ ~ hh ~").bank("EmuSP12").gain(0.15).pan(0.15),
)
const drumsHook = () => stack(
  s("bd ~ ~ ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~").bank("EmuSP12").clip(1.5).release(0.3).shape(0.15).gain(0.85),
  s("~ ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~").bank("EmuSP12").clip(1.6).release(0.35).room(0.25).gain(0.52),
  s("~ ~ hh ~ ~ ~ hh ~ ~ ~ hh ~ ~ ~ [hh oh] ~").bank("EmuSP12").gain(0.17).pan(0.15),
  s("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ shaker ~ ~ ~").gain(0.1).pan(-0.2),
)

// --- sections ---
const introSeg = (i) => stack(
  crackle,
  keys(VERSE_CH[i % 4], 900, 0.3),
  ...(i >= 4 ? [bassLine(VERSE_RT[i % 4], 0.5)] : []),
)

const verseSeg = (i) => stack(
  crackle,
  keys(VERSE_CH[i % 4], 1400, 0.4),
  bassLine(VERSE_RT[i % 4], 0.62),
  drumsVerse(),
  ...(i % 4 === 3 ? [lament('~ ~ ~ ~ e4 ~ c#4 ~', 0.24)] : []),
)

const hookSeg = (i, lift) => stack(
  crackle,
  keys(HOOK_CH[i % 4], 1600, 0.42),
  bassLine(HOOK_RT[i % 4], 0.65),
  drumsHook(),
  lift
    ? lament(HOOK_LD[i % 4], 0.4).add(note(12))
    : lament(HOOK_LD[i % 4], 0.4),
)

const peakSeg = (i, lift) => stack(
  hookSeg(i, lift),
  padPeak(PAD_CH[i % 4]),
)

const bridgeSeg = (i) => stack(
  crackle,
  note(m('a1')).struct("x ~ ~ ~ ~ ~ x ~").s("sine").lpf(130).clip(3).release(0.2).gain(0.6),
  keys(BRIDGE_CH[i % 2], 800, 0.3),
  lament(BRIDGE_LD[i % 2], 0.34),
  s("bd ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~").bank("EmuSP12").clip(1.4).release(0.3).gain(0.55),
)

const outroSeg = (i) => stack(
  crackle,
  keys(VERSE_CH[i % 4], 750, 0.28),
  ...(i < 4 ? [bassLine(VERSE_RT[i % 4], 0.45)] : []),
  ...(i === 4 ? [lament('a4 ~ ~ ~ f4 ~ e4 ~', 0.22)] : []),
)

slowcat(
  ...Array.from({ length: 8 }, (_, k) => introSeg(k)),
  ...Array.from({ length: 12 }, (_, k) => verseSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => hookSeg(k, false)),
  ...Array.from({ length: 8 }, (_, k) => verseSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => hookSeg(k, false)),
  ...Array.from({ length: 8 }, (_, k) => bridgeSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => peakSeg(k, false)),
  ...Array.from({ length: 4 }, (_, k) => peakSeg(k, true)),
  ...Array.from({ length: 8 }, (_, k) => outroSeg(k)),
)`
