export const title = 'The World Ends in Her Driveway'
export const genre = 'teenage-symphony heartbreak ballad — orchestral pop lineage (Wilson widescreen ache via a bedroom at 2am), piano-led, ~72 BPM'
export const mood = 'First heartbreak at seventeen: numb at first, then her memory comes back golden, then the wave hits all at once. Huge and fragile in turns — a piano theme that starts beautiful, breaks apart, and is finally played slow and accepted. One minor-iv chord placed like a knife: it is really over.'
export const cycles = 70
export const model = 'claude-fable-5'
export const prompt = 'teenage symphony to a broken heart — total despair, beautiful, emotions only that big when young'
export const author = 'morgan'

export const code = `setcps(0.3)

// ---------- palette helpers ----------
const keys = (chord, g, hits) =>
  note(m(chord)).struct(m(hits)).s("piano").room(0.5).gain(g)
const pad = (chord, g, cutoff) =>
  note(m(chord)).s("sawtooth").lpf(cutoff).attack(0.45).release(0.7).room(0.6).gain(g)
const low = (root, g) =>
  note(m(root)).s("sine").lpf(140).attack(0.03).release(0.5).gain(g)
const sing = (phrase, g) =>
  note(m(phrase)).s("piano").room(0.75).gain(g)
const halo = (tone, g) =>
  note(m(tone)).s("triangle").lpf(1500).attack(0.6).release(0.9).room(0.8).gain(g)

// drums: one kick voice, soft, ringing
const heart = s("bd ~ ~ bd ~ ~ ~ ~").bank("LinnDrum").lpf(600).gain(0.36).clip(1.6).release(0.3)
const wave = stack(
  s("bd ~ ~ ~ ~ ~ bd ~").bank("LinnDrum").gain(0.5).clip(1.5).release(0.3),
  s("~ ~ ~ ~ sd ~ ~ ~").bank("LinnDrum").gain(0.24).clip(1.4).release(0.3),
  s("~ hh ~ hh ~ hh ~ hh").bank("LinnDrum").gain(0.12)
)
const crash = s("cr ~ ~ ~ ~ ~ ~ ~").gain(0.28).clip(2).release(0.35)

// ---------- harmony ----------
// memory (D major, golden): Dmaj7 - Bm7 - Gmaj7 - A
const V_CH = ['d3,a3,c#4,f#4', 'b2,f#3,a3,d4', 'g2,d3,f#3,b3', 'a2,e3,a3,c#4']
const V_RT = ['d2', 'b1', 'g1', 'a1']
// despair (B minor): Bm - Em9 - Gmaj7 - F#7 (the hurt dominant)
const C_CH = ['b2,f#3,b3,d4', 'e3,g3,b3,f#4', 'g2,d3,f#3,b3', 'f#2,c#3,a#3,e4']
const C_RT = ['b1', 'e2', 'g1', 'f#1']

// ---------- the girl's theme ----------
// golden (verse 1)
const V_PH = [
  '~ ~ f#4 ~ a4 ~ b4 ~',
  'a4 ~ f#4 ~ ~ e4 ~ ~',
  '~ ~ b4 ~ d5 ~ ~ c#5',
  'c#5 ~ b4 ~ a4 ~ f#4 ~',
]
// hesitant (verse 2 — bargaining)
const V2_PH = [
  '~ ~ ~ f#4 ~ a4 ~ ~',
  'b4 ~ a4 ~ f#4 ~ e4 ~',
  '~ ~ b4 ~ ~ d5 ~ ~',
  'c#5 ~ ~ a4 ~ ~ f#4 ~',
]
// fragmented (choruses — the theme in pieces)
const C_PH = [
  '~ ~ ~ ~ f#4 ~ ~ ~',
  '~ ~ ~ g4 ~ f#4 ~ ~',
  'd5 ~ ~ ~ b4 ~ ~ ~',
  '~ ~ a#4 ~ ~ ~ ~ ~',
]
const C_HALO = ['f#4', 'g4', 'f#4', 'e4']

// ---------- intro: numb shock ----------
const I_CH = ['d3,a3', 'd3,a3', 'b2,f#3', 'b2,f#3']
const I_PH = [
  '~ ~ ~ ~ f#4 ~ ~ ~',
  '~ ~ ~ ~ ~ ~ e4 ~',
  '~ ~ f#4 ~ ~ e4 ~ ~',
  '~ ~ ~ ~ ~ ~ ~ ~',
]
const introSeg = (i) => stack(
  low('d2', 0.38),
  keys(I_CH[i % 4], 0.38, 'x ~ ~ ~ ~ ~ ~ ~'),
  sing(I_PH[i % 4], 0.42)
)

// ---------- verses: the memory of her ----------
const verseSeg = (i, phrase) => stack(
  keys(V_CH[i % 4], 0.5, 'x ~ ~ ~ x ~ ~ ~'),
  low(V_RT[i % 4], 0.44),
  heart,
  ...(phrase ? [sing(phrase, 0.5)] : [])
)
const verse2Seg = (i) => stack(
  keys(V_CH[i % 4], 0.45, 'x ~ ~ ~ x ~ ~ ~'),
  pad(V_CH[i % 4], 0.13, 650),
  low(V_RT[i % 4], 0.4),
  heart,
  sing(V2_PH[i % 4], 0.48)
)

// ---------- choruses: the despair ----------
const chorusSeg = (i, frag, withHalo) => stack(
  keys(C_CH[i % 4], 0.55, 'x ~ x ~ x ~ x ~'),
  pad(C_CH[i % 4], 0.22, 900),
  low(C_RT[i % 4], 0.5),
  wave,
  ...(frag ? [sing(frag, 0.5)] : []),
  ...(withHalo ? [halo(C_HALO[i % 4], 0.14)] : [])
)

// ---------- breakdown: almost nothing left ----------
const BR_PH = [
  'f#4 ~ ~ ~ ~ ~ ~ ~',
  '~ ~ e4 ~ ~ ~ ~ ~',
  'd4 ~ ~ ~ ~ ~ ~ ~',
  '~ ~ ~ ~ ~ ~ ~ ~',
  'f#4 ~ e4 ~ d4 ~ ~ ~',
  '~ ~ ~ ~ c#4 ~ ~ ~',
]
const brSeg = (i) => stack(
  low('b1', 0.34),
  pad('b2,f#3', 0.11, 500),
  sing(BR_PH[i], 0.46)
)

// ---------- the biggest wave (12 cycles, ends on the knife) ----------
const W_CH = [
  'b2,f#3,b3,d4', 'e3,g3,b3,f#4', 'g2,d3,f#3,b3', 'f#2,c#3,a#3,e4',
  'b2,f#3,b3,d4', 'e3,g3,b3,f#4', 'g2,d3,f#3,b3', 'f#2,c#3,a#3,e4',
  'b2,f#3,b3,d4', 'g2,d3,g3,b3',
  'g2,d3,g3,bb3',      // the knife: G major turns G minor — it is really over
  'd3,a3,d4,f#4',      // one quiet D in the silence after
]
const W_RT = ['b1', 'e2', 'g1', 'f#1', 'b1', 'e2', 'g1', 'f#1', 'b1', 'g1', 'g1', 'd2']
const W_PH = [
  '~ ~ f#5 ~ a5 ~ b5 ~',
  'a5 ~ f#5 ~ ~ e5 ~ ~',
  '~ ~ b4 ~ d5 ~ ~ c#5',
  'c#5 ~ b4 ~ a#4 ~ f#4 ~',
  '~ ~ f#5 ~ a5 ~ b5 ~',
  'b5 ~ a5 ~ f#5 ~ e5 ~',
  '~ ~ b5 ~ d6 ~ ~ ~',
  'c#6 ~ b5 ~ a#5 ~ f#5 ~',
  'f#5 ~ ~ ~ e5 ~ d5 ~',
  '~ ~ d5 ~ ~ b4 ~ ~',
  'bb4 ~ ~ ~ ~ ~ ~ ~',
  '~ ~ ~ ~ ~ ~ ~ ~',
]
const W_HALO = ['f#5', 'g5', 'b5', 'a#5', 'f#5', 'd5']
const bigSeg = (i) => {
  if (i === 11) return stack(
    keys(W_CH[i], 0.3, 'x ~ ~ ~ ~ ~ ~ ~'),
    low('d2', 0.28)
  )
  if (i === 10) return stack(
    keys(W_CH[i], 0.5, 'x ~ ~ ~ ~ ~ ~ ~'),
    pad(W_CH[i], 0.2, 700),
    sing(W_PH[i], 0.52)
  )
  const parts = [
    keys(W_CH[i], 0.58, 'x ~ x ~ x ~ x ~'),
    pad(W_CH[i], 0.28, 1100),
    low(W_RT[i], 0.52),
    wave,
    sing(W_PH[i], 0.55),
  ]
  if (i >= 4 && i <= 9) parts.push(halo(W_HALO[i - 4], 0.15))
  if (i === 0 || i === 4 || i === 8) parts.push(crash)
  return stack(...parts)
}

// ---------- outro: exhausted acceptance ----------
const O_CH = ['d3,a3,d4,f#4', 'g2,d3,f#3,b3', 'g2,d3,e3,bb3', 'd3,a3,d4,f#4']
const O_RT = ['d2', 'g1', 'g1', 'd2']
const O_PH = [
  '~ ~ ~ ~ f#4 ~ ~ ~',
  'a4 ~ ~ ~ b4 ~ ~ ~',
  'g4 ~ ~ ~ e4 ~ ~ ~',
  'f#4 ~ ~ ~ d4 ~ ~ ~',
  '~ ~ ~ ~ f#4 ~ a4 ~',
  'b4 ~ ~ ~ a4 ~ ~ ~',
  'bb4 ~ ~ ~ g4 ~ e4 ~',
  'd4 ~ ~ ~ ~ ~ ~ ~',
]
const outSeg = (i) => stack(
  keys(O_CH[i % 4], i < 4 ? 0.46 : 0.4, 'x ~ ~ ~ x ~ ~ ~'),
  ...(i < 7 ? [low(O_RT[i % 4], 0.36)] : []),
  ...(i < 4 ? [heart] : []),
  sing(O_PH[i], 0.5)
)

// ---------- arrangement: 70 cycles ----------
slowcat(
  ...Array.from({ length: 8 }, (_, k) => introSeg(k)),
  ...Array.from({ length: 12 }, (_, k) => verseSeg(k, k < 4 ? null : V_PH[k % 4])),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k, k < 4 ? null : C_PH[k % 4], false)),
  ...Array.from({ length: 8 }, (_, k) => verse2Seg(k)),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k, C_PH[k % 4], true)),
  ...Array.from({ length: 6 }, (_, k) => brSeg(k)),
  ...Array.from({ length: 12 }, (_, k) => bigSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => outSeg(k))
)`
