export const title = 'Not the End of the World'
export const genre = 'Modern shoegaze / jangle-pop — Blue Rev-era Toronto 2022, C86-via-MBV sugar rush, ~116 BPM'
export const mood = 'Heartbreak you can pogo to: a bright, wistful hook riding on top of the fuzz instead of under it. Chiming jangle and a driving bass push the choruses in fast; one dream-blur bridge, then the whole song lifts a step and grins through the tears.'
export const cycles = 64
export const model = 'claude-fable-5'
export const prompt = 'alvvays modern shoegaze — blue rev jangle-pop, sugar-rush melody over the wash, pogo heartbreak'
export const author = 'morgan'

export const code = `setcps(0.4833)

// ---------- harmony (all literal, per-cycle) ----------
// Verse: D major with maj7/add9 chime colors
const V_CH  = ['d3,f#3,a3,c#4', 'g2,b2,d3,a3', 'b2,d3,f#3,a3', 'a2,c#3,e3,b3']
const V_RT  = ['d2', 'g2', 'b1', 'a1']
const V_ARP = ['f#4 c#5 a4 d5 f#4 c#5 a4 e5',
               'b4 d5 g4 a4 b4 d5 a4 g4',
               'f#4 b4 d5 a4 f#4 b4 d5 c#5',
               'e4 a4 c#5 b4 e4 a4 c#5 e5']
const V_MEL = ['f#4 ~ a4 ~ f#4 ~ e4 ~',
               '~ b4 a4 ~ g4 ~ f#4 ~',
               'd4 ~ f#4 a4 ~ f#4 ~ e4',
               'e4 ~ ~ c#4 d4 ~ ~ ~']

// Chorus: jumps to the relative minor's territory, snaps back — Bm G D A
const C_CH  = ['b2,d3,f#3,a3', 'g2,b2,d3,f#3', 'd3,f#3,a3', 'a2,c#3,e3']
const C_RT  = ['b1', 'g2', 'd2', 'a2']
const C_ARP = ['b4 f#4 d5 b4 f#5 d5 b4 f#4',
               'g4 d5 b4 g4 d5 b4 g5 d5',
               'a4 d5 f#4 a4 d5 f#5 a4 d5',
               'a4 e5 c#5 a4 e5 c#5 b4 a4']
const C_MEL = ['d5 ~ f#5 d5 c#5 b4 ~ a4',
               'b4 ~ d5 b4 a4 g4 ~ f#4',
               'a4 ~ d5 e5 f#5 ~ e5 d5',
               'e5 c#5 b4 a4 ~ b4 ~ ~']

// Bridge: dream-blur vamp, B7 launch on the last bar
const B_CH  = ['g2,b2,d3,f#3', 'f#2,a2,c#3,e3', 'g2,b2,d3,f#3', 'a2,c#3,e3,g3']
const B_RT  = ['g2', 'f#2', 'g2', 'a2']
const B_MEL = ['d5 ~ ~ b4 ~ d5 ~ ~',
               '~ c#5 ~ a4 ~ ~ f#4 ~',
               'd5 ~ ~ b4 ~ e5 ~ d5',
               'c#5 ~ ~ ~ b4 ~ a4 ~']

// Final chorus, lifted a whole step: C#m A E B
const L_CH  = ['c#3,e3,g#3,b3', 'a2,c#3,e3,g#3', 'e3,g#3,b3', 'b2,d#3,f#3']
const L_RT  = ['c#2', 'a1', 'e2', 'b1']
const L_ARP = ['c#5 g#4 e5 c#5 g#5 e5 c#5 g#4',
               'a4 e5 c#5 a4 e5 c#5 a5 e5',
               'b4 e5 g#4 b4 e5 g#5 b4 e5',
               'b4 f#5 d#5 b4 f#5 d#5 c#5 b4']
const L_MEL = ['e5 ~ g#5 e5 d#5 c#5 ~ b4',
               'c#5 ~ e5 c#5 b4 a4 ~ g#4',
               'b4 ~ e5 f#5 g#5 ~ f#5 e5',
               'f#5 d#5 c#5 b4 ~ c#5 ~ ~']

// ---------- voices ----------
const jangle = (arp, g) => note(m(arp)).s("square")
  .lpf(3200).hpf(320).release(0.18).delay(0.2).room(0.35).gain(g)

const wash = (chord, g) => note(m(chord)).s("sawtooth")
  .lpf(850).attack(0.2).release(0.6).vib(3).vmod(0.05).room(0.55).gain(g)

const washDeep = (chord, g) => note(m(chord)).s("sawtooth")
  .lpf(650).attack(0.35).release(0.9).vib(2.5).vmod(0.09).room(0.8).gain(g)

const bassDrive = (root) => note(m(root)).struct("x*8").s("sawtooth")
  .lpf(300).shape(0.15).release(0.1).gain(0.55)

const lead = (mel, g) => note(m(mel)).s("triangle")
  .lpf(2600).vib(4.5).vmod(0.05).delay(0.15).room(0.3).gain(g)

const blurLead = (mel) => stack(
  note(m(mel)).s("triangle").lpf(1100).vib(4).vmod(0.12).room(0.85).delay(0.3).gain(0.3),
  note(m(mel)).add(note(0.2)).s("triangle").lpf(900).vib(3.5).vmod(0.12).room(0.9).gain(0.16)
)

const drumsVerse = stack(
  s("bd ~ ~ ~ bd ~ ~ ~").bank("YamahaRY30").clip(1.5).release(0.3).gain(0.62),
  s("~ ~ sd ~ ~ ~ sd ~").bank("YamahaRY30").clip(1.5).release(0.3).gain(0.48),
  s("hh*8").bank("YamahaRY30").clip(1.2).gain(0.22)
)

const drumsChorus = stack(
  s("bd ~ ~ ~ bd ~ ~ bd").bank("YamahaRY30").clip(1.5).release(0.3).gain(0.62),
  s("~ ~ sd ~ ~ ~ sd ~").bank("YamahaRY30").clip(1.5).release(0.3).gain(0.48),
  s("hh hh hh oh hh hh hh oh").bank("YamahaRY30").clip(1.2).gain(0.24)
)

const crashHit = s("cr").clip(2).release(0.35).gain(0.32)
const tamb = s("~ tambourine ~ tambourine").gain(0.28)

// ---------- sections ----------
const introSeg = (k) => stack(
  jangle(V_ARP[k % 2], 0.18),
  wash(V_CH[k % 2], 0.12 + k * 0.03),
  k >= 2 ? bassDrive(V_RT[k % 2]) : silence
)

const verseSeg = (k) => stack(
  wash(V_CH[k % 4], 0.2),
  jangle(V_ARP[k % 4], 0.15),
  bassDrive(V_RT[k % 4]),
  lead(V_MEL[k % 4], 0.42),
  drumsVerse
)

const chorusSeg = (k) => stack(
  wash(C_CH[k % 4], 0.24),
  jangle(C_ARP[k % 4], 0.17),
  bassDrive(C_RT[k % 4]),
  lead(C_MEL[k % 4], 0.52),
  drumsChorus,
  k === 0 ? crashHit : silence
)

const bridgeSeg = (k) => stack(
  washDeep(k === 7 ? 'b2,d#3,f#3,a3' : B_CH[k % 4], 0.3),
  bassDrive(k === 7 ? 'b1' : B_RT[k % 4]),
  k >= 2 ? blurLead(B_MEL[k % 4]) : silence,
  k >= 4 ? drumsVerse : silence
)

const liftSeg = (k) => stack(
  wash(L_CH[k % 4], 0.26),
  jangle(L_ARP[k % 4], 0.18),
  bassDrive(L_RT[k % 4]),
  lead(L_MEL[k % 4], 0.55),
  drumsChorus,
  tamb,
  (k === 0 || k === 8) ? crashHit : silence
)

const outroSeg = (k) => stack(
  washDeep('e3,g#3,b3,d#4', Math.max(0.28 - k * 0.06, 0.08)),
  jangle('e5 ~ b4 ~ g#4 ~ e4 ~', Math.max(0.16 - k * 0.04, 0.04)),
  k === 0 ? lead('e5 ~ ~ ~ b4 ~ g#4 ~', 0.4) : silence,
  k < 2 ? note("e2").s("sine").lpf(120).release(0.8).gain(0.4) : silence
)

const PLAN = [
  [introSeg, 4],
  [verseSeg, 8], [chorusSeg, 8],
  [verseSeg, 8], [chorusSeg, 8],
  [bridgeSeg, 8],
  [liftSeg, 16],
  [outroSeg, 4],
]

slowcat(...PLAN.flatMap(([seg, len]) => Array.from({ length: len }, (_, k) => seg(k))))`
