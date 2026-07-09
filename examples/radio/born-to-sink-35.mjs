export const title = 'Born to Sink'
export const genre = 'sad-girl trap'
export const mood = 'cinematic, doomed, bass-heavy'
export const cycles = 56
// exported from the radio DB (2026-07-02); restore with: bun scripts/post-song.mjs <this file>
export const code = `// Sad-girl trap — Hollywood-noir melancholy on an 808 chassis, ~72bpm half-time
// B minor; hook borrows a Dorian E-major IV for the lift
setcps(0.30)

const CH_V = ['b2,d3,f#3,c#4', 'g2,b2,d3,f#3', 'e2,g2,b2,f#3', 'f#2,a#2,c#3,e3']
const CH_H = ['b2,d3,f#3,a3',  'g2,b2,d3,f#3', 'e2,g#2,b2,e3', 'f#2,a#2,c#3,e3']
const CH_B = ['g2,b2,d3,f#3', 'f#2,a#2,c#3,e3']
const RT   = ['b1', 'g1', 'e1', 'f#1']
const RT_B = ['g1', 'f#1']

const pad = (chord, g) => note(m(chord)).s("sawtooth").lpf(520).attack(0.35).release(0.6).room(0.65).gain(g)
const sub = (root, g) => note(m(root)).s("sine").lpf(88).attack(0.01).release(1.4).shape(0.35).gain(g)
const growl = (root) => note(m(root)).s("sawtooth").lpf(150).release(0.9).gain(0.3)
const voice = (phrase, g) => note(m(phrase)).s("triangle").lpf(1300).vib(5).vmod(0.08).attack(0.05).release(0.4).room(0.75).delay(0.3).gain(g)

const LEAD_V = ['~ ~ f#4 [e4 d4] ~ c#4 ~ ~', '~', '~ ~ d4 [c#4 b3] ~ b3 ~ ~', '~']
const LEAD_H = ['~ d5 ~ [c#5 b4] ~ a4 ~ ~', '~ ~ b4 [a4 f#4] ~ f#4 ~ ~', '~ g#4 ~ [b4 c#5] ~ e4 ~ ~', '~ ~ [c#5 d5] c#5 ~ a#4 ~ ~']
const LEAD_B = ['~ ~ ~ f#3 ~ [e3 d3] ~ ~', '~']
const PNO_H  = ['~ ~ ~ ~ ~ f#5 ~ ~', '~ ~ d5 ~ ~ ~ ~ ~', '~ ~ ~ ~ ~ g#4 ~ b4', '~ ~ ~ ~ ~ ~ c#5 ~']

const hatsV = s("hh hh hh hh hh hh [hh hh] hh").bank("RolandTR808").gain(0.32)
const hatsH = s("hh hh [hh hh hh] hh hh [hh hh] [hh hh hh hh] hh").bank("RolandTR808").gain(0.38)
const kickV = s("bd ~ ~ ~ ~ ~ [~ bd] ~").bank("RolandTR808").shape(0.3).gain(0.9)
const kickH = s("bd ~ ~ bd ~ ~ [~ bd] ~").bank("RolandTR808").shape(0.3).gain(0.95)
const clap  = s("~ ~ ~ ~ cp ~ ~ ~").bank("RolandTR808").room(0.4).gain(0.6)
const air   = s("noise").lpf(sine.range(150, 550).slow(8)).gain(0.05)

// intro — pad and a lone sub heartbeat
const introSeg = (i) => stack(
  pad(CH_V[i % 4], 0.24),
  sub(RT[i % 4], 0.6).struct("x ~ ~ ~ ~ ~ ~ ~"),
  air
)
// verse — sub anchors, drums sparse
const verseSeg = (i) => stack(
  pad(CH_V[i % 4], 0.26),
  sub(RT[i % 4], 0.95).struct("x ~ ~ ~ ~ ~ [~ x] ~"),
  voice(LEAD_V[i % 4], 0.34),
  kickV, clap, hatsV
)
// hook — full bass swell + glassy piano
const hookSeg = (i, ...extras) => stack(
  pad(CH_H[i % 4], 0.3),
  sub(RT[i % 4], 1).struct("x ~ ~ x ~ ~ [~ x] ~"),
  growl(RT[i % 4]).struct("x ~ ~ x ~ ~ [~ x] ~"),
  voice(LEAD_H[i % 4], 0.38),
  note(m(PNO_H[i % 4])).s("piano").room(0.8).delay(0.35).gain(0.34),
  kickH, clap, hatsH,
  ...extras
)
// bridge — stripped, no drums
const bridgeSeg = (i) => stack(
  pad(CH_B[i % 2], 0.28),
  sub(RT_B[i % 2], 0.55).struct("x ~ ~ ~ ~ ~ ~ ~"),
  voice(LEAD_B[i % 2], 0.3),
  air
)
// outro — fade on the tonic
const outroSeg = (i) => stack(
  pad('b2,d3,f#3,c#4', 0.24 - i * 0.045),
  sub('b1', 0.5 - i * 0.1).struct("x ~ ~ ~ ~ ~ ~ ~"),
  air
)

const crash = s("cr ~ ~ ~ ~ ~ ~ ~").gain(0.28).room(0.5)

slowcat(
  ...Array.from({ length: 4 }, (_, k) => introSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => verseSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => hookSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => verseSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => bridgeSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => hookSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => (k % 4 === 0 ? hookSeg(k, crash) : hookSeg(k))),
  ...Array.from({ length: 4 }, (_, k) => outroSeg(k))
)
`
