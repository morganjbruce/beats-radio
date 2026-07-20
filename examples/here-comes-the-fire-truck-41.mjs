export const title = 'Here Comes the Fire Truck!'
export const genre = 'Preschool singalong — Wiggles / Sesame Street / Raffi lineage; oom-pah skipping groove at ~108 BPM in sunny C major, with a nee-naw siren hook, a fire-bell tubularbell, and a marimba melody a 3-year-old could hum on first listen.'
export const mood = 'Pure sunny-morning joy: little boots stomping, everyone waving as the big red truck rolls by. The bell dings, the siren goes nee-naw like a game of peekaboo, and the verses chat in friendly call-and-response before the chorus opens its arms wide. A gentle bridge climbs the ladder rung by rung — one soft borrowed Fm chord like a happy sigh at the top — then the whole toy box joins for one last chorus and a small waving-goodbye.'
export const cycles = 64
// exported from the radio DB (2026-07-03); restore with: bun scripts/post-song.mjs <this file>
export const code = `// Here Comes the Fire Truck! — preschool singalong, C major, ~108 BPM
setcps(0.45)

const V_CH = ['c3,e3,g3', 'f3,a3,c4', 'c3,e3,g3', 'g3,b3,d4']
const V_BASS = ['c2 g2 c2 g2', 'f2 c3 f2 c3', 'c2 g2 c2 g2', 'g2 d3 g2 d3']
const V_MEL = [
  'e4 e4 g4 ~', 'a4 g4 f4 ~', 'e4 g4 e4 d4', 'd4 e4 d4 ~',
  'e4 e4 g4 g4', 'a4 ~ g4 f4', 'g4 e4 d4 e4', 'd4 b3 c4 ~',
]

const C_CH = ['c3,e3,g3', 'a2,c3,e3', 'f3,a3,c4', 'g3,b3,d4']
const C_BASS = ['c2 g2 c2 g2', 'a1 e2 a1 e2', 'f2 c3 f2 c3', 'g2 d3 g2 b1']
const C_MEL = [
  'g4 g4 e4 g4', 'a4 a4 e4 ~', 'a4 g4 f4 g4', 'g4 f4 d4 ~',
  'g4 g4 e4 g4', 'a4 c5 a4 e4', 'a4 g4 f4 d4', 'd4 ~ g4 ~',
]

const B_CH = ['c3,e3,g3', 'f3,a3,c4', 'f3,ab3,c4', 'c3,e3,g3']
const B_BASS = ['c2 ~ g2 ~', 'f2 ~ c3 ~', 'f2 ~ ab2 ~', 'c2 ~ g2 ~']
const B_MEL = [
  'c4 d4 e4 g4', 'a4 ~ c5 ~', 'c5 ab4 g4 ~', 'g4 e4 c4 ~',
  'c4 d4 e4 g4', 'a4 c5 a4 c5', 'ab4 g4 f4 ~', 'e4 g4 d4 ~',
]

const O_MEL = ['g4 e4 c4 ~', 'e4 g4 c5 ~', 'e4 ~ c4 ~', 'c4 ~ ~ ~']

const bounce = (chord) => note(m(chord)).struct("~ x ~ x").s("piano").gain(0.42)
const held = (chord) => note(m(chord)).s("piano").gain(0.34).room(0.4)
const walk = (line) => note(m(line)).s("triangle").lpf(380).gain(0.55)
const sing = (phrase) => note(m(phrase)).s("marimba").gain(0.5).room(0.25)
const lead = (phrase) => note(m(phrase)).s("piano").gain(0.5).room(0.2)
const climb = (phrase) => note(m(phrase)).s("folkharp").gain(0.55).room(0.45)

const bell = note("c5 ~ ~ ~").s("tubularbells").gain(0.26).room(0.5)
const siren = note("c5 g4 c5 g4").s("triangle").lpf(1600)
  .vib(5).vmod(0.06).gain(0.2).pan(sine.range(-0.35, 0.35).slow(4))

const verseDrums = stack(
  s("bd ~ bd ~").bank("RolandTR808").gain(0.5),
  s("~ rim ~ rim").bank("RolandTR808").gain(0.35),
  s("shaker*8").gain(0.12),
)
const chorusDrums = stack(
  s("bd ~ bd ~").bank("RolandTR808").gain(0.55),
  s("~ cp ~ cp").bank("RolandTR808").gain(0.42),
  s("shaker*8").gain(0.15),
)
const tamb = s("~ tambourine ~ tambourine").gain(0.28)
const bridgeDrums = stack(s("bd ~ ~ ~").bank("RolandTR808").gain(0.4), s("shaker*8").gain(0.09))

// intro — bell + siren tease
const introSeg = (k) => {
  const layers = [bell, s("shaker*8").gain(0.1)]
  if (k >= 1) layers.push(note("c5 g4 ~ ~").s("triangle").lpf(1600).vib(5).vmod(0.06).gain(0.18))
  if (k >= 2) layers.push(walk('c2 g2 c2 g2'), bounce('c3,e3,g3'))
  if (k === 3) layers.push(sing('~ ~ g4 d4'))
  return stack(...layers)
}

// verse — call-and-response marimba
const verseSeg = (i, two) => stack(
  bounce(V_CH[i % 4]),
  walk(V_BASS[i % 4]),
  two ? sing(V_MEL[i % 8]).delay(0.2) : sing(V_MEL[i % 8]),
  verseDrums,
)

// chorus — siren hook out front
const chorusSeg = (i, toys) => {
  const layers = [
    bounce(C_CH[i % 4]),
    walk(C_BASS[i % 4]),
    lead(C_MEL[i % 8]),
    siren,
    chorusDrums,
  ]
  if (toys >= 1) layers.push(tamb)
  if (toys >= 2) layers.push(sing(C_MEL[i % 8]), bell)
  return stack(...layers)
}

// bridge — up the ladder, one soft Fm
const bridgeSeg = (i) => stack(
  held(B_CH[i % 4]),
  walk(B_BASS[i % 4]),
  climb(B_MEL[i % 8]),
  bridgeDrums,
)

// outro — waving goodbye
const outroSeg = (k) => stack(
  bell,
  held('c3,e3,g3'),
  note(m(O_MEL[k % 4])).s("marimba").gain(0.45).room(0.4),
  note("c5 g4 ~ ~").s("triangle").lpf(1400).vib(5).vmod(0.05).gain(0.16 - k * 0.03),
  s("shaker*8").gain(0.08),
)

const PLAN = [
  [(k) => introSeg(k), 4],
  [(k) => verseSeg(k, false), 8],
  [(k) => chorusSeg(k, 0), 8],
  [(k) => verseSeg(k, true), 8],
  [(k) => chorusSeg(k, 0), 8],
  [(k) => bridgeSeg(k), 8],
  [(k) => chorusSeg(k, 1), 8],
  [(k) => chorusSeg(k, 2), 8],
  [(k) => outroSeg(k), 4],
]

slowcat(...PLAN.flatMap(([seg, len]) => Array.from({ length: len }, (_, k) => seg(k))))
`
