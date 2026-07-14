export const title = 'Chrome Sunset'
export const genre = 'Nu-disco / French touch — Random Access Memories-era live disco-funk, ~90 BPM'
export const mood = 'Golden hour on a rooftop, drinks sweating in the heat, a band that never rushes. The chuck guitar keeps chucking, the bass walks like it owns the block, and when the pads bloom it feels like the sun refusing to set.'
export const cycles = 62
export const model = 'claude-fable-5'
export const prompt = 'daft punk get lucky — RAM nu-disco, nile rodgers chuck, round melodic bass, rooftop euphoria'
export const author = 'morgan'

export const code = `setcps(90/240)

// ---- harmony: Em9 -> Gmaj7 -> Cmaj7 -> A7(9)  (Dorian IV lift, borrowed bVI warmth)
const CHUCK_CH = ['e4,g4,b4,d5', 'd4,f#4,b4', 'e4,g4,c5', 'e4,g4,c#5']
const PAD_CH   = ['e3,g3,d4,f#4', 'd3,g3,b3,f#4', 'c3,g3,b3,e4', 'c#3,g3,b3,e4']

// ---- round melodic bass: roots + octave pops + approach notes; turnaround lick on the A7 bar
const BASSLN = [
  'e1 ~ ~ e2 ~ ~ e1 ~ d2 ~ e2 ~ e1 ~ f#1 g1',
  'g1 ~ ~ g2 ~ ~ g1 ~ f#1 ~ g1 ~ b1 ~ c2 ~',
  'c2 ~ ~ c3 ~ ~ c2 ~ b1 ~ c2 ~ g1 ~ a1 ~',
  'a1 ~ a2 ~ g1 ~ a1 ~ c#2 ~ b1 ~ a1 g1 f#1 e1',
]

// ---- the one lead hook: statement / answer / climax (e5 once) / resolve
const HOOK = [
  '~ ~ b4 ~ ~ d5 ~ b4 ~ ~ a4 ~ g4 ~ ~ ~',
  '~ ~ ~ ~ ~ f#4 ~ g4 ~ b4 ~ ~ ~ ~ ~ ~',
  '~ ~ e5 ~ ~ d5 ~ b4 ~ ~ c5 ~ b4 ~ ~ ~',
  '~ a4 ~ ~ ~ g4 ~ e4 ~ ~ f#4 ~ ~ ~ ~ ~',
]

// ---- chuck rhythm figures (fill variant every 4th bar)
const CHK = [
  'x ~ ~ x ~ x x ~ ~ x ~ x ~ x ~ ~',
  'x ~ ~ x ~ x x ~ ~ x ~ x x ~ x x',
]

const SWG = 0.09

const chuck = (i, cut, amp) => note(m(CHUCK_CH[i % 4]))
  .struct(m(CHK[i % 4 === 3 ? 1 : 0]))
  .s("sawtooth").hpf(420).lpf(cut)
  .attack(0.002).decay(0.13).sustain(0)
  .velocity("[1 0.68 0.85 0.7]*4")
  .swingBy(SWG, 8).pan(0.15).room(0.2).gain(amp)

const bassV = (i) => note(m(BASSLN[i % 4]))
  .s("sawtooth").lpf(270).shape(0.2)
  .attack(0.004).release(0.18).clip(1.8)
  .swingBy(SWG, 8).gain(0.74)

const padV = (i, amp) => note(m(PAD_CH[i % 4]))
  .s("sawtooth").lpf(640)
  .attack(0.3).release(0.9).room(0.45)
  .pan(sine.range(-0.22, 0.22).slow(8)).gain(amp)

const hookV = (i, amp) => note(m(HOOK[i % 4]))
  .s("triangle").lpf(1750)
  .attack(0.03).release(0.5)
  .vib(5).vmod(0.05)
  .delay(0.35).room(0.5).pan(-0.12).gain(amp)

// ---- drums: 909 kick under 707 swung hats, LinnDrum clap; oh rides the off-beats
const kick  = s("bd*4").bank("RolandTR909").shape(0.1).gain(0.62)
const clap  = s("~ cp ~ cp").bank("LinnDrum").room(0.18).gain(0.28)
const hatsC = s("[hh hh ~ hh]*4").bank("RolandTR707").swingBy(SWG, 8).gain(0.2)
const hatsO = s("[~ ~ oh ~]*4").bank("RolandTR707").swingBy(SWG, 8).clip(1.5).release(0.3).gain(0.32)
const tamb  = s("[~ tambourine]*4").swingBy(SWG, 8).hpf(600).gain(0.13)

const drumsFull = stack(kick, clap, hatsC, hatsO)

// ---- sections
const introSeg = (k) => stack(
  chuck(k, 1750, 0.34), hatsC, hatsO,
  ...(k >= 2 ? [kick] : []),
)

const verseSeg = (k) => stack(chuck(k, 1750, 0.34), bassV(k), drumsFull)

const chorusSeg = (k) => stack(
  chuck(k, 1900, 0.34), bassV(k), padV(k, 0.24), hookV(k, 0.32), drumsFull,
)

const bridgeSeg = (k) => stack(
  chuck(k, 950, 0.3), bassV(k),
  note(m('e2,b2,f#3')).s("triangle").lpf(500).attack(0.6).release(1.2).room(0.6).gain(0.2),
  ...(k >= 6 ? [kick, hatsC, hatsO] : []),
)

const finalSeg = (k) => stack(
  chuck(k, 1950, 0.34), bassV(k), padV(k, 0.26),
  k >= 8 ? hookV(k, 0.26).add(note(12)) : hookV(k, 0.32),
  drumsFull, tamb,
)

const OUT_AMP = [0.3, 0.27, 0.23, 0.19, 0.14, 0.09]
const OUT_LPF = [1500, 1350, 1180, 1000, 850, 700]
const outroSeg = (k) => stack(
  chuck(k, OUT_LPF[k % 6], OUT_AMP[k % 6]),
  ...(k < 4 ? [hatsC.gain(0.2 - 0.04 * k), hatsO.gain(0.32 - 0.07 * k)] : []),
)

const PLAN = [
  [introSeg, 4],
  [verseSeg, 8], [chorusSeg, 8],
  [verseSeg, 8], [chorusSeg, 8],
  [bridgeSeg, 8],
  [finalSeg, 12],
  [outroSeg, 6],
]
slowcat(...PLAN.flatMap(([seg, len]) => Array.from({ length: len }, (_, k) => seg(k))))`
