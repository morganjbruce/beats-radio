export const title = 'Blade Idol (Demon Hunt Anthem)'
export const genre = 'K-pop maximalist — 4th-gen girl-group anthem (BLACKPINK/aespa/ITZY lineage, ~127 BPM) splicing glossy synth-stab choruses onto 808 trap-menace verses, with a dark-fantasy cinematic edge: Phrygian bII shadows, a chromatic-mediant E-major flare mid-hook, and a half-time demon-march bridge.'
export const mood = 'Sleek, ferocious, and fun — idol polish with a monster-hunting blade underneath. Verses stalk low and hooded over a sliding sub and rolling hats; the pre-chorus leans forward on a rising line that refuses to resolve; then the chorus kicks the door in — four-on-the-floor, bright stabs, a hook that flashes briefly into impossible E-major light like a sword catching moonlight. A tolling half-time bridge and one hushed held breath set up the final, biggest chorus: chest-open euphoria with bells and crash cymbals, before the smoke clears to a lone bell over the sub.'
export const cycles = 74
// exported from the radio DB (2026-07-03); restore with: bun scripts/post-song.mjs <this file>
export const code = `// Blade Idol — K-pop demon-hunter anthem, C minor, ~127 BPM
setcps(0.53)

const VCH = ['c3,eb3,g3', 'c3,eb3,g3', 'db3,f3,ab3', 'c3,eb3,g3']
const VRT = ['c1', 'c1', 'db1', 'c1']
const VMT = ['c4 ~ ~ eb4 ~ c4 ~ ~', '~ ~ g3 ~ bb3 c4 ~ ~', 'db4 ~ f4 ~ ab3 ~ ~ ~', '~ db4 c4 ~ ~ g3 ~ ~']

const PCH = ['f2,ab2,c3,eb3', 'ab2,c3,eb3,g3', 'g2,c3,d3,f3', 'g2,b2,d3,f3,ab3']
const PRT = ['f1', 'ab1', 'g1', 'g1']
const PMT = ['c4 ~ eb4 f4 ~ ~ ab3 ~', 'eb4 ~ g4 ab4 ~ ~ ~ ~', 'f4 ~ g4 c5 ~ ~ d5 ~', 'd5 ~ ab4 b4 d5 ~ f5 ~']

const CCH = ['c3,eb3,g3,bb3', 'ab2,c3,eb3,g3', 'e3,ab3,b3,e4', 'g2,b2,d3,f3']
const CRT = ['c2', 'ab1', 'e2', 'g1']
const HOOK = ['c5 ~ eb5 ~ g5 ~ f5 eb5', 'eb5 ~ c5 ~ ab4 c5 ~ ~', 'b4 ~ ab4 b4 ~ e5 ~ ~', 'd5 ~ b4 ~ g4 ~ f5 d5']

const BCH = ['f2,ab2,c3,eb3', 'db3,f3,ab3,c4', 'c3,eb3,g3', 'g2,b2,d3']
const BRT = ['f1', 'db1', 'c1', 'g1']
const BMT = ['c5 ~ ~ ab4 ~ ~ f4 ~', 'db5 ~ ~ ab4 ~ f4 ~ ~', 'eb5 ~ ~ c5 ~ ~ g4 ~', 'd5 ~ ~ b4 ~ g4 ~ ~']

// drums
const trapDrums = stack(
  s("bd ~ ~ bd ~ ~ bd ~").bank("RolandTR808").gain(0.9),
  s("~ ~ cp ~").bank("RolandTR808").gain(0.7),
  s("[hh*2] [hh*2] [hh*4] [hh*6]").bank("RolandTR808").gain(0.4)
)
const popDrums = stack(
  s("bd*4").bank("RolandTR909").gain(0.95),
  s("~ cp ~ cp").bank("RolandTR909").gain(0.65),
  s("[~ oh]*4").bank("RolandTR909").gain(0.35),
  s("hh*8").bank("RolandTR909").gain(0.25)
)
const halfDrums = stack(
  s("bd ~ sd:2 ~").bank("RolandTR808").gain(0.9),
  s("[hh*3] [hh*2] [hh*3] [hh*6]").bank("RolandTR808").gain(0.3)
)

// intro — bell toll over the sub
const introSeg = (i) => stack(
  note(m(VRT[0])).s("sine").lpf(90).gain(0.7).struct("x ~ ~ x ~ ~ ~ ~"),
  note("c5 ~ ~ ~ g4 ~ ~ ~").s("tubularbells").room(0.8).gain(0.3),
  s("noise").lpf(600).attack(0.4).release(0.6).gain(0.05),
  i >= 2 ? s("[hh*2] [hh*2] [hh*4] [hh*2]").bank("RolandTR808").gain(0.3) : silence
)

// verse — trap stalk, Phrygian bII
const verseSeg = (i) => stack(
  note(m(VRT[i % 4])).s("sine").lpf(95).gain(0.85).struct("x ~ ~ x ~ x ~ ~"),
  note(m(VCH[i % 4])).s("sawtooth").lpf(700).attack(0.02).decay(0.15).sustain(0).struct("~ x ~ ~ x ~ ~ x").gain(0.28),
  note(m(VMT[i % 4])).s("triangle").lpf(1400).gain(0.4).room(0.3),
  trapDrums
)

// pre-chorus — rising, unresolved
const preSeg = (i) => stack(
  note(m(PRT[i % 4])).s("sine").lpf(100).gain(0.8).struct("x ~ x ~ x ~ x ~"),
  note(m(PCH[i % 4])).s("sawtooth").lpf(900).attack(0.05).struct("x ~ ~ x ~ ~ x ~").gain(0.3),
  note(m(PMT[i % 4])).s("sawtooth").lpf(2200).gain(0.34).room(0.3),
  s("bd*4").bank("RolandTR808").gain(0.85),
  s("hh*8").bank("RolandTR808").gain(0.28),
  i === 3 ? s("noise*8").hpf(400).lpf(3000).gain("0.03 0.05 0.08 0.12 0.16 0.2 0.25 0.3") : silence
)

// chorus — glossy four-on-the-floor; lift 1 doubles the hook, lift 2 adds crash
const chorusSeg = (i, lift) => stack(
  note(m(CRT[i % 4])).s("sawtooth").lpf(280).shape(0.3).gain(0.48).struct("x x ~ x x ~ x x"),
  note(m(CCH[i % 4])).s("sawtooth").lpf(2400).attack(0.01).decay(0.18).sustain(0).struct("x ~ x x ~ x ~ x").gain(0.3),
  note(m(HOOK[i % 4])).s("sawtooth").lpf(3000).gain(0.42).room(0.35),
  lift >= 1 ? note(m(HOOK[i % 4])).s("triangle").add(note(12)).gain(0.28).room(0.4) : silence,
  lift >= 2 && i % 8 === 0 ? s("cr").gain(0.5).room(0.4) : silence,
  popDrums
)

// bridge — half-time demon march
const bridgeSeg = (i) => stack(
  note(m(BRT[i % 4])).s("sine").lpf(85).gain(0.85).struct("x ~ ~ ~ ~ ~ x ~"),
  note(m(BCH[i % 4])).s("triangle").lpf(600).attack(0.15).release(0.4).gain(0.3).room(0.5),
  note(m(BMT[i % 4])).s("tubularbells").gain(0.28).room(0.7),
  halfDrums
)

// hush — held breath before the last drop
const hushSeg = (i) => stack(
  note("c1").s("sine").lpf(70).gain(0.7).struct("x ~ ~ ~"),
  note(m(HOOK[i % 4])).s("harp").gain(0.4).room(0.8),
  i === 1 ? s("noise*8").hpf(500).lpf(4000).gain("0.04 0.07 0.1 0.14 0.18 0.24 0.3 0.38") : silence
)

// outro — smoke clears
const outroSeg = (i) => stack(
  note("c1").s("sine").lpf(80).gain(0.6).struct("x ~ ~ ~ ~ ~ ~ ~"),
  note("c5 ~ ~ ~ eb5 ~ g4 ~").s("tubularbells").room(0.9).gain(0.3 - i * 0.05),
  s("~ ~ cp ~").bank("RolandTR808").gain(0.25)
)

const PLAN = [
  [introSeg, 4],
  [verseSeg, 8],
  [preSeg, 4],
  [(k) => chorusSeg(k, 0), 8],
  [verseSeg, 8],
  [preSeg, 4],
  [(k) => chorusSeg(k, 1), 8],
  [bridgeSeg, 8],
  [hushSeg, 2],
  [(k) => chorusSeg(k, 2), 16],
  [outroSeg, 4],
]
slowcat(...PLAN.flatMap(([seg, len]) => Array.from({ length: len }, (_, k) => seg(k))))
`
