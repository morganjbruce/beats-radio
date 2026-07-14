export const title = 'Asleep in the Amplifier'
export const genre = 'shoegaze / wall-of-sound dream-noise, Loveless-era 1991, ~96 BPM'
export const mood = 'A wall of detuned glide-guitars that never decides between major and its shadow, deafening and tender at once. A voice sings from somewhere behind the noise, half-legible on purpose, and for eight bars the wall parts and you finally hear it. Then it closes over you again and dissolves into hiss.'
export const cycles = 76
export const model = 'claude-fable-5'
export const prompt = 'shoegaze my bloody valentine, wall of sound — glide guitars, buried melody, muffled drums'
export const author = 'morgan'

export const code = `setcps(0.4)

// --- harmony: E blurred with its bVII (D) and bIII (G) — home is never certain ---
const V_CH = ['e3,g#3,b3', 'd3,f#3,a3', 'e3,g#3,b3', 'g3,b3,d4']
const V_LO = ['e2,e3', 'd2,d3', 'e2,e3', 'g2,g3']
const V_RT = ['e1', 'd1', 'e1', 'g1']

const C_CH = ['e3,g#3,b3,e4', 'd3,f#3,a3,d4', 'g3,b3,d4,g4', 'd3,f#3,a3,d4']
const C_LO = ['e2,b2,e3', 'd2,a2,d3', 'g2,d3,g3', 'd2,a2,d3']
const C_RT = ['e1', 'd1', 'g1', 'd1']

// --- one motif, narrow range, developed by octave and by surfacing once ---
const MEL = ['~ b3 ~ [a3 g#3]', '~ ~ a3 [f#3 ~]', 'b3 ~ ~ [c#4 b3]', '~ d4 ~ ~ b3']
const MEL_HI = ['~ b4 ~ [a4 g#4]', '~ ~ a4 [f#4 ~]', 'b4 ~ ~ [c#5 b4]', '~ d5 ~ ~ b4']
const MEL_C = ['~ b3 ~ g#3', '~ a3 ~ f#3', '~ b3 [d4 ~] b3', 'a3 ~ ~ [f#3 a3]']

// --- the wall: one voice concept, octave-doubled, two vib rates drifting apart ---
const glide = (mid, lo, gA, gB, cut) => stack(
  note(m(mid)).s("sawtooth").attack(0.5).release(1.6).clip(1)
    .lpf(cut).shape(0.4).vib(0.45).vmod(0.35).room(0.85).pan(-0.25).gain(gA),
  note(m(mid)).s("sawtooth").attack(0.6).release(1.6).clip(1)
    .lpf(cut * 0.75).shape(0.45).vib(0.62).vmod(0.45).room(0.9).pan(0.25).gain(gA),
  note(m(lo)).s("sawtooth").attack(0.4).release(1.4).clip(1)
    .lpf(680).shape(0.5).vib(0.35).vmod(0.25).room(0.7).gain(gB)
)

const low = (root, g) => note(m(root)).s("sine")
  .lpf(110).attack(0.05).release(0.4).clip(1).gain(g)

const voice = (phrase, g, cut) => note(m(phrase)).s("triangle")
  .lpf(cut).attack(0.08).release(0.6).vib(5).vmod(0.08)
  .room(0.9).delay(0.35).gain(g)

const wash = (g) => s("noise").lpf(sine.range(280, 850).slow(8))
  .attack(0.8).release(1).room(0.6).gain(g)

// --- drums: far behind the wall, muffled, ringing ---
const drumsV = stack(
  s("bd ~ ~ ~ bd ~ ~ ~").bank("RolandR8").lpf(2200).clip(1.6).release(0.3).gain(0.5),
  s("~ ~ sd ~ ~ ~ sd ~").bank("RolandR8").lpf(1900).clip(1.5).release(0.3).room(0.5).gain(0.27)
)
const drumsC = stack(
  s("bd ~ ~ ~ bd ~ ~ bd").bank("RolandR8").lpf(2400).clip(1.6).release(0.3).gain(0.52),
  s("~ ~ sd ~ ~ ~ sd ~").bank("RolandR8").lpf(2000).clip(1.5).release(0.3).room(0.5).gain(0.28),
  s("hh ~ hh ~ hh ~ hh ~").bank("RolandR8").lpf(2600).gain(0.1)
)

// --- sections ---
const introSeg = (k) => stack(
  note(m(V_CH[k % 4])).s("triangle").attack(0.8).release(1.8).clip(1)
    .lpf(900).vib(0.4).vmod(0.25).room(0.95).gain(0.2 + k * 0.012),
  low(V_RT[k % 4], 0.35),
  wash(0.07)
)

const verseSeg = (k, mel) => stack(
  glide(V_CH[k % 4], V_LO[k % 4], 0.22, 0.24, 1400),
  low(V_RT[k % 4], 0.5),
  voice(mel[k % 4], 0.17, 1200),
  drumsV
)

const chorusSeg = (k, big) => stack(
  glide(C_CH[k % 4], C_LO[k % 4], big ? 0.3 : 0.27, big ? 0.32 : 0.29, big ? 1700 : 1550),
  low(C_RT[k % 4], 0.55),
  voice(MEL_C[k % 4], big ? 0.16 : 0.14, 1100),
  drumsC,
  wash(big ? 0.1 : 0.07)
)

const partedSeg = (k) => stack(
  note(m(V_CH[k % 4])).s("triangle").attack(0.7).release(1.8).clip(1)
    .lpf(1000).vib(0.4).vmod(0.2).room(0.95).gain(0.26),
  low(V_RT[k % 4], 0.42),
  voice(MEL[k % 4], 0.38, 2400),
  wash(0.05)
)

const O_LPF = [1300, 1050, 850, 680, 540, 430, 340, 270]
const O_G = [0.26, 0.23, 0.2, 0.17, 0.14, 0.11, 0.08, 0.05]
const outroSeg = (k) => stack(
  note(m(V_CH[k % 4])).s("sawtooth").attack(0.6).release(1.8).clip(1)
    .lpf(O_LPF[k % 8]).shape(0.4).vib(0.5).vmod(0.4).room(0.95).gain(O_G[k % 8]),
  ...(k < 4 ? [low(V_RT[k % 4], 0.34 - k * 0.06)] : []),
  wash(0.05 + k * 0.009)
)

slowcat(
  ...Array.from({ length: 8 },  (_, k) => introSeg(k)),
  ...Array.from({ length: 12 }, (_, k) => verseSeg(k, MEL)),
  ...Array.from({ length: 12 }, (_, k) => chorusSeg(k, false)),
  ...Array.from({ length: 12 }, (_, k) => verseSeg(k, MEL_HI)),
  ...Array.from({ length: 8 },  (_, k) => partedSeg(k)),
  ...Array.from({ length: 16 }, (_, k) => chorusSeg(k, true)),
  ...Array.from({ length: 8 },  (_, k) => outroSeg(k)),
)`
