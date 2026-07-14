export const title = 'Millefiori'
export const genre = '4AD dreampop / ethereal wave — Cocteau Twins school, mid-80s, ~92 BPM'
export const mood = 'Light through stained glass in an empty chapel. A wordless soprano sings a melody that means everything and nothing, while gated drums bloom like breath on cold air. Heaven-adjacent melancholy, beauty just past the edge of comprehension.'
export const cycles = 72
export const model = 'claude-fable-5'
export const prompt = '4AD dreampop, cocteau twins school — shimmer, wordless soprano lead, blooming drums'
export const author = 'morgan'

export const code = `setcps(0.3833)

// ---- harmony: A major with a borrowed iv (Dm) in the verse,
// ---- and a bVI–bVII–I lift (F–G–A) in the chorus — the dreampop halo.
const VERSE_CH = ['a2,e3,g#3,b3,c#4', 'f#2,c#3,e3,g#3,a3', 'd3,f#3,a3,e4', 'd3,f3,a3,e4']
const VERSE_BASS = ['a1@3 e2@3 c#2@2', 'f#1@4 c#2@2 e2@2', 'd2@3 a2@3 f#2@2', 'd2@4 f2@2 a1@2']
const VERSE_ARP = [
  'e4 a4 b4 c#5 e5 c#5 b4 g#4',
  'c#4 e4 g#4 a4 c#5 a4 g#4 e4',
  'd4 e4 f#4 a4 d5 a4 f#4 e4',
  'd4 e4 f4 a4 d5 a4 f4 e4',
]
const VERSE_VOX = [
  'c#5@3 e5@2 ~ b4@2',
  '~ c#5@3 a4@2 g#4@2',
  'f#4@2 a4@2 b4@3 ~',
  '~@2 a4@2 f4@2 e4@2',
]

const CHOR_CH = ['f2,c3,e3,g3,a3', 'g2,b2,d3,a3', 'a2,c#3,e3,g#3,b3', 'd3,f3,a3,e4']
const CHOR_BASS = ['f1@4 c2@4', 'g1@3 d2@3 b1@2', 'a1@4 e2@4', 'd2@4 f2@2 e2@2']
const CHOR_ARP = [
  'f4 g4 a4 c5 e5 c5 a4 g4',
  'g4 a4 b4 d5 g5 d5 b4 a4',
  'e4 g#4 b4 c#5 e5 c#5 b4 g#4',
  'd4 e4 f4 a4 e5 a4 f4 e4',
]
const CHOR_VOX = [
  'e5@3 g5@2 ~ d5@2',
  '~ d5@3 b4@2 a4@2',
  'c#5@2 e5@2 f#5@3 ~',
  '~@2 e5@2 f5@2 e5 d5',
]

const BRIDGE_CH = ['d3,f#3,a3,c#4,e4', 'e3,a3,b3,c#4']
const BRIDGE_VOX = ['~ c#5@4 ~@2 b4', 'a4@3 ~ f#4@2 ~@2']
const BRIDGE_BASS = ['d2@4 a2@2 f#2@2', 'e2@3 c#2@3 a1@2']

// ---- voices
const vox = (phrase, g) => note(m(phrase)).s("sawtooth")
  .hpf(340).lpf(1450).resonance(12)
  .vib(5.5).vmod(0.08)
  .attack(0.12).release(0.25).clip(1)
  .room(0.9).delay(0.3).gain(g)

const glass = (phrase, g) => note(m(phrase)).fast(2).s("triangle")
  .lpf(2600).attack(0.01).release(0.15)
  .delay(0.45).room(0.7)
  .pan(sine.range(-0.4, 0.4).slow(3))
  .gain(g)

const glassHarp = (phrase, g) => note(m(phrase)).s("harp")
  .room(0.8).pan(sine.range(0.35, -0.35).slow(5)).gain(g)

const bed = (chord, g, cutoff) => note(m(chord)).s("sawtooth")
  .lpf(cutoff).attack(0.5).release(0.6).room(0.6).gain(g)

const bassArc = (phrase) => note(m(phrase)).s("triangle")
  .lpf(320).attack(0.02).release(0.3).gain(0.5)

// ---- drums: LinnDrum, blooming not hitting
const kick = s("bd ~ ~ ~ ~ ~ bd ~").bank("LinnDrum").clip(1.5).release(0.3).gain(0.75)
const snareBloom = s("~ ~ ~ ~ sd ~ ~ ~").bank("LinnDrum").room(0.85).clip(1.8).release(0.35).gain(0.45)
const hatShimmer = s("~ hh ~ hh ~ hh ~ hh").bank("LinnDrum").room(0.3).gain(0.16)
const ohBloom = s("~ ~ ~ oh ~ ~ ~ ~").bank("LinnDrum").room(0.5).clip(1.4).gain(0.18)

// ---- sections
const introSeg = (i) => {
  const layers = [
    glassHarp(VERSE_ARP[i % 4], 0.24),
    bed(VERSE_CH[i % 4], 0.2, 700),
  ]
  if (i >= 4) layers.push(glass(VERSE_ARP[i % 4], 0.18), bassArc(VERSE_BASS[i % 4]))
  return stack(...layers)
}

const verseSeg = (i, withVoice) => {
  const layers = [
    bed(VERSE_CH[i % 4], 0.27, 950),
    bassArc(VERSE_BASS[i % 4]),
    glass(VERSE_ARP[i % 4], 0.26),
    kick, snareBloom,
  ]
  if (withVoice) layers.push(vox(VERSE_VOX[i % 4], 0.3))
  return stack(...layers)
}

const chorusSeg = (i, peak) => {
  const layers = [
    bed(CHOR_CH[i % 4], 0.3, 1100),
    bassArc(CHOR_BASS[i % 4]),
    glass(CHOR_ARP[i % 4], 0.3),
    vox(CHOR_VOX[i % 4], 0.34),
    kick, snareBloom, hatShimmer,
  ]
  if (peak) layers.push(glassHarp(CHOR_ARP[i % 4], 0.2), ohBloom)
  return stack(...layers)
}

const bridgeSeg = (i) => {
  const layers = [
    bed(BRIDGE_CH[i % 2], 0.24, 800),
    vox(BRIDGE_VOX[i % 2], 0.34),
  ]
  if (i >= 4) layers.push(glassHarp(VERSE_ARP[2], 0.14))
  if (i >= 6) layers.push(bassArc(BRIDGE_BASS[i % 2]))
  return stack(...layers)
}

const outroSeg = (i) => {
  const layers = [
    glassHarp(VERSE_ARP[i % 4], Math.max(0.06, 0.22 - i * 0.02)),
    bed(VERSE_CH[i % 4], Math.max(0.05, 0.2 - i * 0.02), 900 - i * 60),
  ]
  if (i < 2) layers.push(vox('~@2 c#5@4 ~@2', 0.26))
  return stack(...layers)
}

slowcat(
  ...Array.from({ length: 8 }, (_, k) => introSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => verseSeg(k, k >= 4)),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k, false)),
  ...Array.from({ length: 8 }, (_, k) => verseSeg(k, true)),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k, false)),
  ...Array.from({ length: 8 }, (_, k) => bridgeSeg(k)),
  ...Array.from({ length: 16 }, (_, k) => chorusSeg(k, k >= 8)),
  ...Array.from({ length: 8 }, (_, k) => outroSeg(k)),
)`
