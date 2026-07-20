export const title = 'Romance Bloody Machine'
export const genre = 'Dance-Punk'
export const mood = 'sweaty, menacing, relentless'
export const cycles = 62
// exported from the radio DB (2026-07-02); restore with: bun scripts/post-song.mjs <this file>
export const code = `// Dance-punk two-piece — fuzz bass + drums only, DFA1979-style assault
// One cycle = 2 bars at ~150 BPM
setcps(0.3125)

const fuzz = (riff) => note(m(riff)).s("sawtooth").lpf(950).shape(0.65).distort(0.35).gain(0.4)
const grit = (riff) => note(m(riff)).s("square").lpf(1400).shape(0.5).gain(0.22)
const sub  = (roots) => note(m(roots)).s("sine").lpf(120).gain(0.55)

const RIFF_V = [
  'e2 e2 g2 e2 ~ e2 bb2 a2 e2 e2 g2 e2 a2 g2 e2 ~',
  'e2 e2 g2 e2 ~ e2 bb2 a2 c3 b2 g2 e2 d2 d2 e2 ~',
]
const RIFF_C = [
  'e2 e3 e2 g2 e2 e3 bb2 a2 g2 g3 g2 b2 g2 g3 a2 b2',
  'a2 a3 a2 c3 a2 a3 e3 d3 c3 c4 c3 b2 a2 g2 a2 b2',
]
const SUB_C = ['e1*4 g1*4', 'a1*4 c2*4']
const RIFF_B = [
  'e2 ~ e2 e2 ~ g2 ~ bb2 [a2 g2] ~ e2 ~ d2 ~ e2 ~',
  'e2 ~ e2 e2 ~ g2 ~ a2 ~ bb2 ~ b2 ~ c3 b2 g2',
]

// drums
const drumsVerse = stack(
  s("bd*8").gain(0.9),
  s("[~ sd ~ sd]*2").gain(0.8),
  s("hh*16").gain(0.28),
)
const drumsChorus = stack(
  s("bd*8").gain(0.95),
  s("[~ sd ~ sd]*2").gain(0.85),
  s("hh*16").gain(0.3),
  s("[~ oh]*8").gain(0.25),
  s("cr ~ ~ ~ ~ ~ ~ ~").gain(0.35),
)
const drumsFill = stack(
  s("bd*8").gain(0.9),
  s("[~ sd ~ sd] [~ sd [sd sd sd] [sd lt mt]]").gain(0.85),
  s("hh*16").gain(0.28),
)
const drumsHalf = stack(
  s("bd ~ ~ ~ bd ~ ~ ~").gain(0.95),
  s("~ ~ sd ~ ~ ~ sd ~").gain(0.9),
  s("hh*8").gain(0.2),
)

// sections
const introSeg = (k) => k < 2
  ? fuzz(RIFF_V[k % 2]).lpf(550)
  : stack(fuzz(RIFF_V[k % 2]), sub('e1*8'), s("bd*8").gain(0.8), s("hh*16").gain(0.22))

const verseSeg = (k) => stack(
  fuzz(RIFF_V[k % 2]),
  sub('e1*8'),
  k === 7 ? drumsFill : drumsVerse,
)

const verse2Seg = (k) => stack(verseSeg(k), grit(RIFF_V[k % 2]))

const chorusSeg = (k) => stack(
  fuzz(RIFF_C[k % 2]),
  sub(SUB_C[k % 2]),
  k === 7 ? drumsFill : drumsChorus,
)

const breakSeg = (k) => stack(
  fuzz(RIFF_B[k % 2]).lpf(sine.range(350, 1100).slow(8)).shape(0.72),
  sub('e1 ~ ~ ~ e1 ~ ~ ~'),
  drumsHalf,
)

const buildSeg = (k) => stack(
  fuzz(RIFF_B[0]),
  sub('e1*8'),
  s("bd*8").gain(0.9),
  k === 3 ? s("sd*16").gain(0.7) : k === 2 ? s("sd*8").gain(0.6) : s("[~ sd ~ sd]*2").gain(0.8),
  s("noise*2").lpf(500 + k * 900).hpf(200).gain(0.05 + k * 0.05),
)

const finalSeg = (k) => (k === 4 || k === 5)
  ? stack(
      note(m(RIFF_C[k % 2])).add(note(12)).s("sawtooth").lpf(1600).shape(0.6).gain(0.3),
      s("bd*8").gain(0.9),
      s("[~ sd ~ sd]*2").gain(0.85),
    )
  : stack(
      fuzz(RIFF_C[k % 2]),
      grit(RIFF_C[k % 2]),
      sub(SUB_C[k % 2]),
      k === 11 ? drumsFill : drumsChorus,
    )

const outroSeg = (k) => k === 0
  ? stack(
      note("e2 ~ ~ e2 ~ ~ e2 ~ g2 ~ bb2 ~ b2 ~ ~ ~").s("sawtooth").lpf(950).shape(0.65).distort(0.35).gain(0.45),
      s("[bd,cr] ~ ~ [bd,sd] ~ ~ [bd,sd] ~ bd ~ [bd,sd] ~ [bd,cr] ~ ~ ~").gain(0.9),
    )
  : stack(
      note("e2 ~ ~ ~ ~ ~ ~ ~").s("sawtooth").lpf(800).shape(0.7).gain(0.5),
      sub('e1 ~ ~ ~ ~ ~ ~ ~'),
      s("[bd,cr] ~ ~ ~ ~ ~ ~ ~").gain(1),
    )

const PLAN = [
  [introSeg, 4],
  [verseSeg, 8], [chorusSeg, 8],
  [verse2Seg, 8], [chorusSeg, 8],
  [breakSeg, 8], [buildSeg, 4],
  [finalSeg, 12],
  [outroSeg, 2],
]
slowcat(...PLAN.flatMap(([seg, len]) => Array.from({ length: len }, (_, k) => seg(k))))
`
