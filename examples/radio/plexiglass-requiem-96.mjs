export const title = 'Plexiglass Requiem'
export const genre = 'Glitch-rave / witch-house-adjacent electro — Toronto 2008-2010, Crystal Castles (I)/(II) lineage, ~130 BPM'
export const mood = 'A dying Atari screaming over a rave kick, then sudden weightless crystal — a ghost singing through detuned triangles where the vocal should be. Brutal and angelic take turns holding the same melody until it dissolves into reverb.'
export const cycles = 84
export const model = 'claude-fable-5'
export const prompt = 'crystal castles — glitch-rave (I)/(II) era, corroded chip leads vs crystalline calm'
export const author = 'morgan'

export const code = `setcps(0.542)

const CH_ROOT = ['c2', 'ab1', 'c2', 'bb1']
const PAD_HI = ['c4,g4,eb5', 'ab3,eb4,c5', 'c4,g4,bb4', 'bb3,f4,d5']
const MOTIF = [
  'c5 ~ eb5 g5 ~ c6 ~ [bb5 g5]',
  'c6 ~ ab5 eb5 ~ c5 ~ [eb5 g5]',
  'c5 ~ eb5 g5 ~ c6 ~ [d6 c6]',
  'bb5 ~ f5 d5 ~ bb4 ~ [c5 d5]',
]
const ANGEL = [
  'c5 ~ ~ ~ eb5 ~ g5 ~',
  'ab5 ~ ~ ~ eb5 ~ c5 ~',
  'g5 ~ ~ ~ c6 ~ bb5 ~',
  'd5 ~ c5 ~ ~ ~ ~ ~',
]
const GLK = [
  'bd*4',
  'bd bd bd [bd bd]',
  '[bd bd] ~ [bd bd] ~',
  'bd*8',
  'bd ~ [bd bd bd] bd',
  '[bd bd bd bd] ~ bd ~',
  'bd*2 [bd bd bd bd]',
  'bd*16',
]
const GLL = [
  'c5 ~ ~ ~',
  '[c5 c5] ~ eb5 ~',
  'c5 ~ eb5 g5 ~ ~ ~ ~',
  '[c6 bb5 g5] ~ ~ ~',
  'c5 ~ eb5 g5 ~ c6 ~ ~',
  '[c6 c6 c6 c6] ~ ~ bb5',
  'g5 eb5 c5 ~',
  '[c5 eb5 g5 c6]*2 ~ ~',
]
const OUTG = [0.28, 0.28, 0.26, 0.24, 0.22, 0.2, 0.17, 0.14, 0.11, 0.09, 0.06, 0.04]

const raveKit = (heavy) => stack(
  s("bd*4").bank("RolandTR909").gain(0.92).clip(1.5).release(0.3).shape(heavy ? 0.35 : 0.2),
  s(m(heavy ? '[hh hh]*4' : '[~ hh]*4')).bank("RolandTR909").gain(0.3).clip(1.4).release(0.25).hpf(6000),
  s("~ cp ~ cp").bank("RolandTR909").gain(0.42).clip(1.5).room(0.3),
  ...(heavy ? [s("~ ~ oh ~").bank("RolandTR909").gain(0.2).clip(1.7).release(0.3)] : []),
)

const raveBass = (i) => note(m(CH_ROOT[i % 4]))
  .struct("~ x ~ x ~ x ~ x").s("square")
  .lpf(300).shape(0.3).gain(0.5).release(0.15)

const crushLead = (i, hard) => note(m(MOTIF[i % 4])).s("square")
  .crush(hard ? 4 : 5).shape(hard ? 0.5 : 0.3)
  .lpf(hard ? 3200 : 2600).hpf(300)
  .gain(0.3).release(0.2).room(0.2).pan(0.12)

const ghost = (i, g) => stack(
  note(m(ANGEL[i % 4])).s("triangle").gain(g),
  note(m(ANGEL[i % 4])).add(note(0.14)).s("triangle").gain(g * 0.8).pan(-0.35),
  note(m(ANGEL[i % 4])).add(note(12.09)).s("sine").gain(g * 0.4).pan(0.35),
).attack(0.04).release(0.7).lpf(2400).room(0.95).delay(0.45)

const padV = (i, g) => note(m(PAD_HI[i % 4])).s("sawtooth")
  .lpf(560).attack(0.3).release(0.9).room(0.8).gain(g)

const subV = (i, g) => note(m(CH_ROOT[i % 4])).s("sine")
  .lpf(95).attack(0.1).release(0.8).gain(g)

const introSeg = (k) => stack(
  note(m(MOTIF[k % 4])).s("triangle").lpf(2000).delay(0.4).room(0.7).gain(0.3),
  padV(k, 0.15),
  ...(k >= 4 ? [subV(k, 0.3)] : []),
)

const raveA = (k) => stack(
  raveKit(false),
  raveBass(k),
  crushLead(k, false),
)

const angelicSeg = (k) => stack(
  ghost(k, 0.32),
  padV(k, 0.26),
  subV(k, 0.3),
)

const raveB = (k) => stack(
  raveKit(true),
  raveBass(k),
  crushLead(k, true),
  ...(k >= 8 ? [note(m(MOTIF[k % 4])).add(note(12)).s("square").crush(4).lpf(4200).hpf(800).gain(0.12).pan(-0.25)] : []),
)

const glitchSeg = (k) => stack(
  s(m(GLK[k % 8])).bank("RolandTR909").gain(0.9).clip(1.3).release(0.25).shape(0.35),
  note(m(GLL[k % 8])).s("square").crush(3).lpf(3000).hpf(300).gain(0.28).room(0.3),
  ...(k >= 4 ? [raveBass(k)] : []),
)

const finalRave = (k) => stack(
  raveKit(true),
  raveBass(k),
  crushLead(k, true),
  note(m(MOTIF[k % 4])).add(note(12)).s("square").crush(4).lpf(4200).hpf(800).gain(0.13).pan(-0.25),
)

const outroSeg = (k) => stack(
  ...(k < 8 ? [ghost(k, Math.max(0.1, 0.3 - k * 0.025))] : []),
  padV(k, OUTG[k % 12]),
  ...(k < 6 ? [subV(k, 0.26)] : []),
)

slowcat(
  ...Array.from({ length: 8 }, (_, k) => introSeg(k)),
  ...Array.from({ length: 16 }, (_, k) => raveA(k)),
  ...Array.from({ length: 12 }, (_, k) => angelicSeg(k)),
  ...Array.from({ length: 16 }, (_, k) => raveB(k)),
  ...Array.from({ length: 8 }, (_, k) => glitchSeg(k)),
  ...Array.from({ length: 12 }, (_, k) => finalRave(k)),
  ...Array.from({ length: 12 }, (_, k) => outroSeg(k)),
)`
