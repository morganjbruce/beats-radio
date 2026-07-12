export const title = 'Addis Midnight Taxi'
export const genre = 'Ethio-jazz'
export const mood = 'smoky, slinky, melancholy head-nod'
export const cycles = 64
// exported from the radio DB (2026-07-02); restore with: bun scripts/post-song.mjs <this file>
export const code = `// Ethio-jazz, early-70s Addis nightclub — slinky funk under a melancholy vibraphone
setcps(0.41)

const A_CH = ['c3,eb3,g3,bb3', 'f3,ab3,c4,eb4', 'ab3,c4,eb4,g4', 'g3,b3,f4,ab4']
const A_BASS = ['c2 ~ ~ c2 ~ g2 bb2 ~', 'f2 ~ ~ f2 ~ c3 eb3 ~', 'ab1 ~ ~ ab1 ~ eb2 g2 ~', 'g1 ~ ~ g1 ~ d2 f2 ~']
const B_CH = ['eb3,g3,bb3,d4', 'ab2,gb3,c4,f4', 'd3,f3,ab3,c4', 'g2,b2,f3,ab3']
const B_BASS = ['eb2 ~ ~ eb2 ~ bb2 g2 ~', 'ab1 ~ ~ ab1 ~ eb2 gb2 ~', 'd2 ~ ~ d2 ~ ab2 f2 ~', 'g1 ~ ~ g1 ~ f2 b1 ~']

const HOOK = ['c5 ~ eb5 f5 ~ [g5 f5] eb5 ~', '~ c5 db5 c5 ~ bb4 g4 ~']
const HOOK2 = ['c5 ~ eb5 f5 ~ [g5 f5] eb5 ~', 'g5 ~ f5 eb5 ~ [db5 c5] ~ ~']
const B_LEAD = ['eb5 ~ g5 ab5 ~ [bb5 ab5] g5 ~', 'f5 ~ eb5 c5 ~ bb4 c5 ~']
const SOLO = ['~ g4 bb4 c5 ~ eb5 c5 ~', 'f5 eb5 c5 ~ bb4 c5 ~ ~', '~ [c5 db5] c5 bb4 g4 ~ f4 g4', 'eb4 ~ g4 ~ c5 ~ ~ ~']
const OUT = ['c5 ~ ~ ~ ~ ~ eb5 ~', '~ ~ db5 c5 ~ ~ ~ ~']

const drums = stack(
  s("bd ~ ~ bd ~ bd ~ ~").gain(0.7),
  s("~ ~ sd ~ ~ ~ sd ~").gain(0.5),
  s("hh*8").gain("0.35 0.15 0.25 0.15 0.35 0.15 0.25 0.2")
)
const perc = s("~ conga:1 ~ conga:0 conga:1 ~ conga:0 ~").gain(0.38)

const vibe = (phrase) => note(m(phrase)).s("vibraphone").gain(0.22).room(0.55).delay(0.25)
const rhodesA = (i) => note(m(A_CH[i % 4])).struct("~ ~ x ~ ~ x ~ ~").s("rhodes").gain(0.5).room(0.35)
const bassA = (i) => note(m(A_BASS[i % 4])).s("sawtooth").lpf(320).gain(0.55)
const rhodesB = (i) => note(m(B_CH[i % 4])).struct("~ ~ x ~ ~ x ~ ~").s("rhodes").gain(0.5).room(0.35)
const bassB = (i) => note(m(B_BASS[i % 4])).s("sawtooth").lpf(320).gain(0.55)

// intro — bass vamp, percussion, no chords yet
const introSeg = (i) => stack(
  bassA(i), perc,
  s("hh ~ hh ~ hh ~ hh ~").gain(0.25),
  s("~ ~ rim ~ ~ ~ rim ~").gain(0.35)
)
// A — head vamp
const aSeg = (i, lead) => stack(
  rhodesA(i), bassA(i), drums, perc,
  ...(lead ? [vibe(lead[i % lead.length])] : [])
)
// B — bridge lift toward Eb
const bSeg = (i, peak) => stack(
  rhodesB(i), bassB(i), drums, perc,
  vibe(B_LEAD[i % 2]),
  ...(peak ? [
    note(m(B_CH[i % 4])).struct("x ~ ~ ~ ~ ~ ~ ~").s("organ_full").attack(0.25).release(0.5).gain(0.16).room(0.4),
    s("shaker*8").gain(0.2)
  ] : [])
)
// breakdown — dark, stripped
const breakSeg = (i) => stack(
  note(m(A_CH[i % 4])).struct("x ~ ~ ~ ~ ~ ~ ~").s("rhodes").lpf(700).gain(0.45).room(0.5),
  bassA(i),
  s("~ ~ rim ~ ~ ~ rim ~").gain(0.4),
  s("hh ~ hh ~ hh ~ hh ~").gain(0.2)
)
// outro — fragments fade
const outroSeg = (i) => stack(
  note(m(A_CH[i % 4])).struct("~ ~ x ~ ~ ~ ~ ~").s("rhodes").gain(0.4).room(0.5),
  note(m(A_BASS[i % 4])).s("sawtooth").lpf(280).gain(0.5),
  vibe(OUT[i % 2]),
  s("hh ~ hh ~ hh ~ hh ~").gain(0.18)
)

const PLAN = [
  [(i) => introSeg(i), 4],
  [(i) => aSeg(i, HOOK), 8],
  [(i) => aSeg(i, HOOK2), 8],
  [(i) => bSeg(i, false), 8],
  [(i) => aSeg(i, SOLO), 8],
  [(i) => breakSeg(i), 4],
  [(i) => bSeg(i, true), 8],
  [(i) => aSeg(i, HOOK), 8],
  [(i) => outroSeg(i), 8],
]
slowcat(...PLAN.flatMap(([seg, len]) => Array.from({ length: len }, (_, k) => seg(k))))
`
