export const title = 'High Noon at Sundown Mesa'
export const genre = 'Spaghetti western soundtrack — Morricone-era (1966-ish) desert noir: whistled theme, harmonica answer, galloping toms, tolling chimes (~132 BPM gallop)'
export const mood = 'A lone rider crests a mesa at dusk: vast, dusty, slow-burning menace. The whistle asks a question the harmonica answers; the gallop breaks loose across the flats, then everything stops for the standoff — bells tolling over an Andalusian cadence, breath held — before the full posse rides out in one euphoric charge and the dust settles into evening bells.'
export const cycles = 60
// exported from the radio DB (2026-07-03); restore with: bun scripts/post-song.mjs <this file>
export const code = `// Spaghetti western — D minor, whistle vs harmonica, gallop and standoff
setcps(0.55)

const THEME_CH = ['d3,f3,a3', 'bb2,d3,f3', 'g2,bb2,d3', 'a2,c#3,e3,g3']
const THEME_RT = ['d2', 'bb1', 'g1', 'a1']
const GALLOP_CH = ['d3,f3,a3', 'd3,f3,a3', 'bb2,d3,f3', 'c3,e3,g3']
const GALLOP_RT = ['d2', 'd2', 'bb1', 'c2']
const STAND_CH = ['d3,f3,a3', 'c3,e3,g3', 'bb2,d3,f3', 'a2,c#3,e3']
const STAND_RT = ['d2', 'c2', 'bb1', 'a1']

const pad = (chord, g) => note(m(chord)).s("piano").attack(0.05).lpf(1500).room(0.35).gain(g)
const bassHold = (root) => note(m(root)).struct("x ~ ~ ~").s("sawtooth").lpf(180).release(0.4).gain(0.5)
const bassRide = (root) => note(m(root)).struct("x ~ x ~ x ~ x x").s("sawtooth").lpf(240).gain(0.55)

const shakerSoft = s("shaker*8").gain(0.18).hpf(2000)
const gallopDrums = stack(
  s("[lt lt] lt [lt lt] lt").gain(0.6),
  s("bd ~ bd ~").bank("RolandTR808").gain(0.7),
  s("~ rim ~ rim").gain(0.5),
  s("shaker*8").gain(0.22).hpf(1800)
)
const gallopLite = stack(
  s("[lt lt] lt [lt lt] lt").gain(0.4),
  s("~ rim ~ rim").gain(0.4),
  s("shaker*8").gain(0.18).hpf(1800)
)

// whistle lead — vibrato triangle
const whistle = (phrase) => note(m(phrase)).s("triangle").lpf(1900)
  .vib(5).vmod(0.1).room(0.25).gain(0.42)
const harp = (phrase) => note(m(phrase)).s("harmonica").room(0.2).gain(0.55)

const WHISTLE_Q = ['d5 ~ [f5 e5] d5 ~ a4 ~ ~', '~ bb4 d5 ~ f5 ~ ~ ~',
  '~ g4 bb4 d5 ~ ~ c5 ~', 'c#5 ~ e5 ~ [d5 c#5] a4 ~ ~']
const HARM_A = ['~ ~ d4 f4 ~ e4 d4 ~', '~ f4 ~ d4 ~ bb3 ~ ~',
  '~ ~ g4 ~ bb4 a4 g4 ~', '~ e4 ~ c#4 ~ a3 ~ ~']
const WHISTLE_G = ['d5 ~ [f5 e5] d5 ~ a4 ~ ~', 'a4 ~ d5 ~ [f5 e5] d5 ~',
  '~ bb4 d5 ~ f5 ~ [d5 c5] bb4', 'c5 ~ e5 ~ g5 ~ [e5 d5] c5']
const HARM_G = ['~ d4 f4 ~ a4 ~ f4 ~', '~ f4 e4 d4 ~ a3 ~ ~',
  '~ f4 ~ d4 ~ bb3 d4 ~', '~ e4 g4 ~ [e4 d4] c4 ~ ~']

const bellToll = note("d4 ~ ~ ~").s("tubularbells").room(0.8).gain(0.4)
const timp = s("timpani ~ ~ [~ timpani]").gain(0.5).room(0.4)

// intro — dusk, bells over a drone
const introSeg = (i) => stack(bellToll, bassHold('d2'), shakerSoft)

// theme A — the whistle asks
const themeASeg = (i) => stack(
  whistle(WHISTLE_Q[i % 4]),
  pad(THEME_CH[i % 4], 0.28),
  bassHold(THEME_RT[i % 4]),
  shakerSoft
)

// theme B — harmonica answers, hooves gather
const themeBSeg = (i) => stack(
  harp(HARM_A[i % 4]),
  pad(THEME_CH[i % 4], 0.28),
  bassHold(THEME_RT[i % 4]),
  gallopLite
)

// gallop — riding the flats
const gallopSeg = (i) => stack(
  harp(HARM_G[i % 4]),
  pad(GALLOP_CH[i % 4], 0.26),
  bassRide(GALLOP_RT[i % 4]),
  gallopDrums
)

// standoff — Andalusian cadence, breath held
const standSeg = (i) => stack(
  whistle(i % 2 === 0 ? 'd5 ~ ~ ~ ~ ~ ~ ~' : '~ ~ ~ ~ [e5 d5] c#5 ~ ~'),
  pad(STAND_CH[(i >> 1) % 4], 0.34),
  bassHold(STAND_RT[(i >> 1) % 4]),
  bellToll,
  timp
)

// the charge — full posse, one brief peak
const peakSeg = (i) => stack(
  i % 2 === 0 ? whistle(WHISTLE_G[i % 4]) : harp(HARM_G[i % 4]),
  pad(GALLOP_CH[i % 4], 0.3),
  bassRide(GALLOP_RT[i % 4]),
  gallopDrums
)

// reprise — call and response over easing hooves
const repriseSeg = (i) => stack(
  i % 2 === 0 ? whistle(WHISTLE_Q[i % 4]) : harp(HARM_A[i % 4]),
  pad(THEME_CH[i % 4], 0.28),
  bassHold(THEME_RT[i % 4]),
  gallopLite
)

// outro — dust settles
const outroSeg = (i) => stack(
  bellToll,
  bassHold('d2'),
  i < 4 ? shakerSoft : silence
)

const PLAN = [
  [introSeg, 6], [themeASeg, 8], [themeBSeg, 8],
  [gallopSeg, 8], [standSeg, 8], [peakSeg, 8],
  [repriseSeg, 8], [outroSeg, 6],
]
slowcat(...PLAN.flatMap(([seg, count]) => Array.from({ length: count }, (_, k) => seg(k))))
`
