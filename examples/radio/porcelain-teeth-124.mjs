export const title = 'Porcelain Teeth'
export const genre = 'Art-rock / art-pop — St. Vincent lineage, self-titled/Masseduction-era fuzz-funk, ~105 BPM'
export const mood = 'Immaculately produced and slightly wrong on purpose — a smile held one second too long. Porcelain calm snaps into precise fuzz assault and back, and the prettiest chord in the bridge is the one that should not be there.'
export const cycles = 72
export const model = 'claude-fable-5'
export const prompt = 'st vincent — pristine menace art-rock, fuzz-lead guitar voice, porcelain calm vs assault'
export const author = 'morgan'

export const code = `setcps(0.4375)

// --- harmony: A minor with surgical wrongness ---
const CH = ['a2,c3,e3,b3', 'f2,a2,c3,e3', 'c3,e3,g3,b3', 'e2,g#2,b2,d3']
const RT = ['a1', 'f1', 'c2', 'e2']
// bridge: too beautiful, one chord from the wrong world (Abmaj7 chromatic mediant)
const BCH = ['c3,e3,g3,b3', 'f2,a2,c3,e3,b3', 'ab2,c3,eb3,g3', 'e2,g#2,b2,d3']
const BRT = ['c2', 'f1', 'ab1', 'e2']
const CCH = ['a2,c3,e3,b3', 'f2,a2,c3,e3']

// --- ONE motif, two temperaments ---
// pretty voice: vocal-like, all consonant, a single climax
const PRETTY = [
  'e5 ~ ~ [c5 e5] ~ b4 ~ a4',
  'e5 ~ ~ [c5 f5] ~ e5 ~ c5',
  'g5 ~ ~ [e5 g5] ~ d5 ~ b4',
  '~ e5 ~ [d5 b4] ~ g#4 ~ e4',
]
// fuzz voice: same line, octave down, angular — exactly ONE bent note per phrase
const FUZZ = [
  'e4 ~ e4 [c4 e4] eb4 b3 ~ a3',
  'e4 ~ e4 [c4 f4] b4 e4 ~ c4',
  'g4 ~ g4 [e4 g4] ~ d4 db4 b3',
  '~ e4 f4 [d4 b3] ~ g#3 ~ e3',
]
// bridge melody: prettiest music, wrongest harmony underneath
const BPRETTY = [
  'g5 ~ e5 ~ ~ d5 ~ b4',
  'a5 ~ e5 ~ b4 ~ c5 ~',
  'g5 ~ eb5 ~ ~ c5 ~ ab4',
  'g#5 ~ e5 ~ d5 ~ b4 ~',
]
// porcelain close: the motif dissolving, one last bent note left hanging
const CMEL = [
  'e5 ~ ~ [c5 e5] ~ b4 ~ a4',
  '~',
  'e5 ~ ~ [c5 f5] ~ e5 ~ c5',
  '~',
  '~ e5 ~ c5 ~ b4 ~ a4',
  '~',
  'a4 ~ ~ ~ ~ ~ ~ ~',
  'e5 ~ ~ ~ eb5 ~ ~ ~',
]

// --- voices ---
const padV = (chord) => note(m(chord)).s("sawtooth")
  .lpf(650).attack(0.25).release(0.6).room(0.45).gain(0.26)
const prettyV = (phrase, g) => note(m(phrase)).s("triangle")
  .lpf(1900).vib(5).vmod(0.06).room(0.5).release(0.3).gain(g)
const fuzzV = (phrase) => note(m(phrase)).s("sawtooth")
  .hpf(350).lpf(1500).resonance(11).shape(0.45).room(0.15).gain(0.42)
const bassV = (root, patt, g) => note(m(root)).struct(m(patt)).s("square")
  .lpf(300).shape(0.15).release(0.15).gain(g)
const stabV = (chord) => note(m(chord)).struct("~ x ~ ~ ~ ~ x ~").s("sawtooth")
  .hpf(250).lpf(1300).clip(0.5).release(0.08).gain(0.3)

// --- drums: stiff, funky, uncomfortably clean ---
const drumsVerse = stack(
  s("bd ~ ~ bd ~ ~ bd ~").bank("LinnDrum").gain(0.7).clip(1.5).release(0.3),
  s("~ ~ sd ~ ~ ~ sd ~").bank("LinnDrum").gain(0.5).clip(1.4).release(0.28),
  s("hh*8").bank("LinnDrum").gain("0.3 0.18 0.26 0.18 0.3 0.18 0.26 0.2")
)
const drumsChorus = stack(
  s("bd ~ ~ bd ~ ~ bd ~").bank("LinnDrum").gain(0.72).clip(1.5).release(0.3),
  s("~ ~ sd ~ ~ ~ sd ~").bank("LinnDrum").gain(0.52).clip(1.4).release(0.28),
  s("hh*8").bank("LinnDrum").gain("0.32 0.2 0.28 0.2 0.32 0.2 0.28 0.22"),
  s("~ ~ ~ ~ ~ ~ ~ oh").bank("LinnDrum").gain(0.28).clip(1.6).release(0.32)
)
const hatsBridge = s("hh*4").bank("LinnDrum").gain(0.18).clip(1.4).release(0.3)

// --- sections ---
const introSeg = (i) => stack(
  padV(CH[i % 4]),
  ...(i >= 2 ? [prettyV(PRETTY[i % 4], 0.34)] : [])
)
const verseSeg = (i, withPretty) => stack(
  bassV(RT[i % 4], 'x ~ ~ x ~ ~ x ~', 0.55),
  stabV(CH[i % 4]),
  drumsVerse,
  ...(withPretty ? [prettyV(PRETTY[i % 4], 0.26)] : [])
)
const biteSeg = (i) => stack(
  bassV(RT[i % 4], 'x ~ ~ x ~ ~ x ~', 0.55),
  stabV(CH[i % 4]),
  drumsVerse,
  fuzzV(FUZZ[i % 4])
)
const calmSeg = (i) => stack(
  padV(CH[i % 4]),
  prettyV(PRETTY[i % 4], 0.32),
  bassV(RT[i % 4], 'x ~ ~ ~ ~ ~ ~ ~', 0.4)
)
const chorusSeg = (i, peak) => stack(
  bassV(RT[i % 4], 'x ~ ~ x ~ ~ x ~', 0.58),
  fuzzV(FUZZ[i % 4]),
  stabV(CH[i % 4]),
  drumsChorus,
  ...(peak ? [prettyV(PRETTY[i % 4], 0.22)] : [])
)
const bridgeSeg = (i) => stack(
  padV(BCH[i % 4]),
  prettyV(BPRETTY[i % 4], 0.34),
  bassV(BRT[i % 4], 'x ~ ~ ~ x ~ ~ ~', 0.45),
  hatsBridge
)
const closeSeg = (i) => stack(
  padV(CCH[i % 2]),
  prettyV(CMEL[i % 8], 0.3)
)

slowcat(
  ...Array.from({ length: 8 }, (_, k) => introSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => verseSeg(k, k >= 4)),
  ...Array.from({ length: 4 }, (_, k) => biteSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => calmSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k, false)),
  ...Array.from({ length: 8 }, (_, k) => verseSeg(k, true)),
  ...Array.from({ length: 8 }, (_, k) => bridgeSeg(k)),
  ...Array.from({ length: 12 }, (_, k) => chorusSeg(k, k >= 8)),
  ...Array.from({ length: 8 }, (_, k) => closeSeg(k))
)`
