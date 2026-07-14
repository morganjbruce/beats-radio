export const title = 'Soft Machinery'
export const genre = 'electro-pop — mid-2000s London DIY synth-pop (Hot Chip lineage), motorik four-on-the-floor, ~120 BPM'
export const mood = 'Interlocking staccato synth gears mesh over a motorik bounce, precise but affectionate. A borrowed minor-iv keeps tugging the major-key sparkle toward melancholy, and the bridge melts to a near-beatless rhodes heart before the machinery clicks back in, all gears at once.'
export const cycles = 72
export const model = 'claude-fable-5'
export const prompt = 'hot chip — mid-2000s london electro-pop, interlocking synth cells, tender over motorik'
export const author = 'morgan'

export const code = `setcps(0.5)

// --- harmony: D major with borrowed Gm6 (iv) and a bVI melt in the bridge ---
const V_CH = ['b2,d3,f#3,a3', 'g2,b2,d3,f#3', 'd3,f#3,a3,c#4', 'c#3,e3,a3']
const V_BS = ['b1 b1 b2 b1 b1 b2 b1 b2', 'g1 g1 g2 g1 g1 g2 g1 g2', 'd2 d2 d3 d2 d2 d3 d2 d3', 'c#2 c#2 c#3 c#2 c#2 c#3 c#2 a2']
const V_A = [
  'b3 ~ ~ d4 ~ ~ f#4 ~ a3 ~ ~ d4 ~ ~ f#4 ~',
  'b3 ~ ~ d4 ~ ~ g4 ~ g3 ~ ~ b3 ~ ~ f#4 ~',
  'a3 ~ ~ c#4 ~ ~ f#4 ~ d4 ~ ~ a3 ~ ~ e4 ~',
  'a3 ~ ~ c#4 ~ ~ e4 ~ a3 ~ ~ b3 ~ ~ c#4 ~',
]
const V_B = [
  '~ ~ f#4 ~ ~ b4 ~ d5 ~ ~ f#4 ~ ~ a4 ~ b4',
  '~ ~ g4 ~ ~ b4 ~ d5 ~ ~ g4 ~ ~ f#4 ~ b4',
  '~ ~ f#4 ~ ~ a4 ~ c#5 ~ ~ e4 ~ ~ a4 ~ d5',
  '~ ~ e4 ~ ~ a4 ~ c#5 ~ ~ e4 ~ ~ b4 ~ a4',
]

const P_CH = ['g2,b2,d3,f#3', 'g2,bb2,d3,e3', 'f#2,a2,d3', 'e2,g#2,b2,d3']
const P_BS = ['g1 g1 g2 g1 g1 g2 g1 g2', 'g1 g1 g2 g1 g1 g2 g1 g2', 'f#1 f#1 f#2 f#1 f#1 f#2 f#1 f#2', 'e1 e1 e2 e1 e1 e2 e1 e2']
const P_CL = [
  'd4 b3 d4 b3 d4 b3 g4 f#4',
  'd4 bb3 d4 bb3 d4 bb3 g4 e4',
  'd4 a3 d4 a3 d4 a3 f#4 a4',
  'd4 b3 d4 b3 g#3 b3 d4 e4',
]

const C_CH = ['d3,f#3,a3,c#4', 'c#3,e3,a3', 'b2,d3,f#3,a3', 'g2,bb2,d3,e3']
const C_BS = ['d2 d2 d3 d2 d2 d3 d2 d3', 'c#2 c#2 c#3 c#2 c#2 c#3 c#2 c#3', 'b1 b1 b2 b1 b1 b2 b1 b2', 'g1 g1 g2 g1 g1 g2 bb1 bb1']
const C_A = [
  'a3 ~ ~ c#4 ~ ~ f#4 ~ d4 ~ ~ a3 ~ ~ e4 ~',
  'a3 ~ ~ c#4 ~ ~ e4 ~ a3 ~ ~ b3 ~ ~ c#4 ~',
  'b3 ~ ~ d4 ~ ~ f#4 ~ a3 ~ ~ d4 ~ ~ f#4 ~',
  'bb3 ~ ~ d4 ~ ~ e4 ~ g3 ~ ~ bb3 ~ ~ d4 ~',
]
const C_B = [
  '~ ~ f#4 ~ ~ a4 ~ c#5 ~ ~ e4 ~ ~ a4 ~ d5',
  '~ ~ e4 ~ ~ a4 ~ c#5 ~ ~ e4 ~ ~ b4 ~ a4',
  '~ ~ f#4 ~ ~ b4 ~ d5 ~ ~ f#4 ~ ~ a4 ~ b4',
  '~ ~ g4 ~ ~ bb4 ~ d5 ~ ~ e4 ~ ~ bb4 ~ g4',
]
const C_C = [
  '~ ~ ~ ~ a5 ~ ~ ~ ~ f#5 ~ ~ e5 ~ ~ ~',
  '~ ~ ~ ~ e5 ~ ~ ~ ~ c#5 ~ ~ a4 ~ ~ ~',
  '~ ~ ~ ~ f#5 ~ ~ ~ ~ d5 ~ ~ b4 ~ ~ ~',
  '~ ~ ~ ~ g5 ~ ~ ~ ~ e5 ~ ~ d5 ~ ~ ~',
]
const C_LD = [
  '~ ~ f#4 g4 a4 ~ f#4 ~',
  'e4 ~ ~ c#4 ~ b3 c#4 ~',
  'd4 ~ f#4 ~ a4 ~ b4 ~',
  'a4 ~ g4 ~ e4 ~ d4 ~',
]

const B_CH = ['b2,d3,f#3,a3', 'bb2,d3,f3,a3', 'g2,b2,d3,f#3', 'g2,bb2,d3,e3']
const B_RT = ['b1', 'bb1', 'g1', 'g1']
const B_LD = [
  'f#4 ~ ~ ~ d4 ~ ~ ~',
  'f4 ~ ~ ~ d4 ~ ~ ~',
  'b3 ~ d4 ~ g4 ~ ~ ~',
  'e4 ~ d4 ~ bb3 ~ ~ ~',
]

// --- voices ---
const gear = (ph, g, cutoff, panpos) =>
  note(m(ph)).s("square").lpf(cutoff).clip(0.5).release(0.05).gain(g).pan(panpos)
const bassV = (ph) =>
  note(m(ph)).s("sawtooth").lpf(300).clip(0.85).gain(0.52)
const padV = (chord, g) =>
  note(m(chord)).s("sawtooth").lpf(700).attack(0.06).release(0.4).gain(g).room(0.3)
const leadV = (ph) =>
  note(m(ph)).s("triangle").lpf(1800).vib(5).vmod(0.06).clip(0.9).room(0.4).gain(0.45)

// --- drums (RolandTR707: clean machine funk + handclaps) ---
const kickV = (g) => s("bd*4").bank("RolandTR707").gain(g).release(0.3)
const hatsOff = (g) => s("[~ hh]*4").bank("RolandTR707").gain(g).clip(1.5)
const clapsV = (g) => s("~ cp ~ cp").bank("RolandTR707").gain(g).clip(1.6)
const ohOff = (g) => s("[~ oh]*4").bank("RolandTR707").gain(g).clip(1.4)

// --- sections ---
const introSeg = (k) => {
  const parts = [
    kickV(0.7),
    gear(V_A[k % 4], 0.3, 700 + k * 170, -0.25),
  ]
  if (k >= 2) parts.push(hatsOff(0.24))
  if (k >= 4) parts.push(bassV(V_BS[k % 4]))
  if (k >= 6) parts.push(padV(V_CH[k % 4], 0.18))
  return stack(...parts)
}

const verseSeg = (k, ghost) => {
  const parts = [
    kickV(0.76),
    hatsOff(0.27),
    bassV(V_BS[k % 4]),
    padV(V_CH[k % 4], 0.24),
    gear(V_A[k % 4], 0.32, 1600, -0.3),
  ]
  if (ghost) parts.push(gear(V_B[k % 4], 0.14, 1900, 0.35))
  if (k % 4 === 3) parts.push(clapsV(0.22))
  return stack(...parts)
}

const preSeg = (k) => {
  const parts = [
    kickV(0.78),
    s("hh*8").bank("RolandTR707").gain("0.3 0.16 0.24 0.16 0.3 0.16 0.24 0.16").clip(1.4),
    bassV(P_BS[k % 4]),
    padV(P_CH[k % 4], 0.24),
    gear(P_CL[k % 4], 0.3, 1400 + k * 250, -0.15),
    gear(V_B[k % 4], 0.16, 2000, 0.35),
  ]
  if (k >= 2) parts.push(s("~ ~ ~ cp").bank("RolandTR707").gain(0.3).clip(1.6))
  return stack(...parts)
}

const chorusSeg = (k, peak) => {
  const parts = [
    kickV(0.8),
    clapsV(0.4),
    ohOff(0.22),
    bassV(C_BS[k % 4]),
    padV(C_CH[k % 4], 0.26),
    gear(C_A[k % 4], 0.3, 1800, -0.35),
    gear(C_B[k % 4], 0.22, 2200, 0.4),
    leadV(C_LD[k % 4]),
  ]
  if (peak) {
    parts.push(gear(C_C[k % 4], 0.2, 2800, 0))
    parts.push(note(m(C_LD[k % 4])).add(note(12)).s("triangle").lpf(2400).room(0.5).gain(0.16))
  }
  return stack(...parts)
}

const bridgeSeg = (k) => {
  const parts = [
    note(m(B_CH[k % 4])).s("rhodes").room(0.55).gain(0.42),
    note(m(B_RT[k % 4])).s("sawtooth").lpf(190).attack(0.1).release(0.6).gain(0.4),
    note(m(B_LD[k % 4])).s("triangle").lpf(1400).vib(5).vmod(0.08).room(0.6).gain(0.42),
  ]
  if (k >= 4) {
    parts.push(kickV(0.3 + (k - 4) * 0.09))
    parts.push(s("noise").lpf(300 + (k - 4) * 350).gain(0.05 + (k - 4) * 0.012))
  }
  if (k >= 6) parts.push(hatsOff(0.14))
  return stack(...parts)
}

const outroSeg = (k) => {
  const parts = [
    kickV(k >= 6 ? 0.58 : 0.74),
    gear(C_A[k % 4], 0.3 - k * 0.02, 2000 - k * 180, -0.25),
  ]
  if (k < 6) parts.push(bassV(C_BS[k % 4]))
  if (k < 4) {
    parts.push(padV(C_CH[k % 4], 0.22))
    parts.push(clapsV(0.3))
  }
  if (k < 2) {
    parts.push(gear(C_B[k % 4], 0.2, 2200, 0.4))
    parts.push(ohOff(0.2))
  }
  return stack(...parts)
}

slowcat(
  ...Array.from({ length: 8 }, (_, k) => introSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => verseSeg(k, false)),
  ...Array.from({ length: 4 }, (_, k) => preSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k, false)),
  ...Array.from({ length: 8 }, (_, k) => verseSeg(k, true)),
  ...Array.from({ length: 4 }, (_, k) => preSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k, false)),
  ...Array.from({ length: 8 }, (_, k) => bridgeSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k, true)),
  ...Array.from({ length: 8 }, (_, k) => outroSeg(k)),
)`
