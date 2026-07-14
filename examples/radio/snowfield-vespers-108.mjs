export const title = 'Snowfield Vespers'
export const genre = 'wintery indie folk / baroque-folk hymn — Fleet Foxes self-titled/Helplessness Blues era Seattle lineage, ~76 BPM'
export const mood = 'Cold air in a forest clearing, warm voices gathering into one hymn. Fingerpicked strings under a choir that swells, thins to a single voice alone in the snow, then returns at dusk.'
export const cycles = 66
export const model = 'claude-fable-5'
export const prompt = 'fleet foxes — wintery indie folk, hymn harmony stacks, fingerpicked arps, snow-field reverb'
export const author = 'morgan'

export const code = `setcps(0.316)

// D mixolydian — the bVII (C) against D is the winter colour.
// Verse: D - C - G - D   Chorus: G - D - C - D   Bridge: Bm - G - C - D

const VERSE_PICK = [
  'd3 a3 d4 f#4 a4 f#4 d4 a3',
  'c3 g3 c4 e4 g4 e4 c4 g3',
  'g2 d3 g3 b3 d4 b3 g3 d3',
  'd3 a3 d4 f#4 e4 f#4 d4 a3',
]
const VERSE_ROOT = ['d2', 'c2', 'g1', 'd2']

const CHOR_PICK = [
  'g2 d3 g3 b3 d4 b3 g3 d3',
  'd3 a3 d4 f#4 a4 f#4 d4 a3',
  'c3 g3 c4 e4 g4 e4 c4 g3',
  'd3 a3 d4 f#4 a4 d5 a4 f#4',
]
const CHOR_ROOT = ['g1', 'd2', 'c2', 'd2']

// the hymn motif — stepwise, bell-like, one climax on c5 (the mixolydian b7)
const HYMN_A = ['a4 b4', 'c5 g4', 'b4 a4', 'f#4']
const HYMN_B = ['a4 d5', 'c5 b4', 'g4 a4', 'f#4']

// chorus = the same hymn carried by parallel thirds/fifths, spelled as literal stacks
const CHOR_STACK = [
  '[g4,b4,d5] [e4,g4,c5]',
  '[d4,f#4,a4]',
  '[e4,g4,c5] [d4,g4,b4]',
  '[f#4,a4,d5]',
]
// final chorus: a fourth low voice joins underneath
const CHOR_FULL = [
  '[d4,g4,b4,d5] [c4,e4,g4,c5]',
  '[a3,d4,f#4,a4]',
  '[c4,e4,g4,c5] [b3,d4,g4,b4]',
  '[a3,d4,f#4,a4,d5]',
]
const CHOR_PAD = ['g2,d3,g3', 'd3,a3,d4', 'c3,g3,c4', 'd3,a3,d4']

const BRIDGE_ROOT = ['b1', 'g1', 'c2', 'd2']
const BRIDGE_PICK = ['b2 ~ f#3 ~', 'g2 ~ d3 ~', 'c3 ~ g3 ~', 'd3 ~ a3 ~']
const BRIDGE_LINE = ['d5 b4', 'b4 a4', 'g4 a4', 'a4']

const OUTRO_PICK = [
  'd3 a3 f#4 a3',
  'c3 g3 e4 g3',
  'g2 d3 b3 d3',
  'd3 ~ a3 ~',
]

// --- voices -------------------------------------------------------------
const pick = (phrase, g, rm) =>
  note(m(phrase)).s("folkharp").gain(g).room(rm).pan(-0.15).clip(1.3)

const bassRoot = (root, g) =>
  note(m(root)).s("sine").lpf(150).attack(0.05).release(0.3).clip(1).gain(g)

// wordless choir — bandpassed saw with slow breath vibrato; long notes, never overlapping
const choir = (phrase, g, rm) =>
  note(m(phrase)).s("sawtooth").hpf(300).lpf(1300).resonance(6)
    .attack(0.15).release(0.4).clip(0.95)
    .vib(5).vmod(0.05).room(rm).gain(g)

const churchPad = (chord) =>
  note(m(chord)).s("organ_full").lpf(1100).attack(0.3).release(0.6)
    .clip(0.95).room(0.7).gain(0.12)

// --- drums: soft, late, low --------------------------------------------
const softKick = s("bd ~ ~ ~").gain(0.38).clip(1.5).release(0.3).lpf(200)
const tomPulse = s("lt ~ ~ ~ lt ~ lt ~").gain(0.2).clip(1.7).release(0.32).lpf(900).room(0.5)
const brushes = s("shaker*8").gain(0.09).hpf(2500).clip(0.6)

// --- sections -----------------------------------------------------------
const introSeg = (k) => stack(
  pick(VERSE_PICK[k % 4], 0.42, 0.75),
  ...(k >= 2 ? [bassRoot(VERSE_ROOT[k % 4], 0.4)] : []),
)

const verseSeg = (k, hymnArr, withBrush) => stack(
  pick(VERSE_PICK[k % 4], 0.42, 0.6),
  bassRoot(VERSE_ROOT[k % 4], 0.5),
  choir(hymnArr[k % 4], 0.3, 0.72),
  ...(withBrush ? [brushes] : []),
)

const chorusSeg = (k, stackArr, full) => stack(
  pick(CHOR_PICK[k % 4], 0.44, 0.6),
  bassRoot(CHOR_ROOT[k % 4], 0.55),
  choir(stackArr[k % 4], 0.27, 0.68),
  softKick,
  tomPulse,
  ...(full ? [brushes, churchPad(CHOR_PAD[k % 4])] : []),
)

const bridgeSeg = (k) => stack(
  choir(BRIDGE_LINE[k % 4], 0.33, 0.95),
  pick(BRIDGE_PICK[k % 4], 0.26, 0.85),
  bassRoot(BRIDGE_ROOT[k % 4], 0.32),
)

const outroSeg = (k) => stack(
  pick(OUTRO_PICK[k % 4], 0.36, 0.85),
  ...(k < 6 ? [bassRoot(VERSE_ROOT[k % 4], 0.34)] : []),
)

// --- arrangement: 6+8+8+8+8+8+12+8 = 66 cycles ---------------------------
slowcat(
  ...Array.from({ length: 6 }, (_, k) => introSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => verseSeg(k, HYMN_A, false)),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k, CHOR_STACK, false)),
  ...Array.from({ length: 8 }, (_, k) => verseSeg(k, HYMN_B, true)),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k, CHOR_STACK, false)),
  ...Array.from({ length: 8 }, (_, k) => bridgeSeg(k)),
  ...Array.from({ length: 12 }, (_, k) => chorusSeg(k, CHOR_FULL, true)),
  ...Array.from({ length: 8 }, (_, k) => outroSeg(k)),
)`
