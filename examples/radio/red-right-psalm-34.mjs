export const title = 'Red Right Psalm'
export const genre = 'Gothic murder-ballad — Nick Cave & the Bad Seeds lineage, funeral-parlour hymn'
export const mood = 'looming, patient menace — church-dark grief that builds to one grim climax and recedes'
export const cycles = 62
// exported from the radio DB (2026-07-02); restore with: bun scripts/post-song.mjs <this file>
export const code = `// Gothic ballad — D minor, ~77bpm; chromatic lament-bass chorus, Neapolitan plagal bridge
setcps(0.32)

// verse: Dm - Bbmaj7 - Gm - A  (i - bVI - iv - V, hymn weight)
const V_CH = ['d2,a2,d3,f3', 'bb1,f2,a2,d3', 'g1,d2,g2,bb2', 'a1,e2,a2,c#3']
const V_RT = ['d1', 'bb1', 'g1', 'a1']
const V_LD = [
  '~ ~ d3 ~ f3 [e3 d3] ~ ~',
  '~ ~ f3 ~ d3 ~ ~ ~',
  '~ ~ g3 ~ bb3 [a3 g3] ~ ~',
  '~ e3 ~ ~ c#3 ~ d3 ~',
]

// chorus: lament descent  Dm - Dmmaj7/C# - Dm7/C - G7/B - Bb - Gm - A7 - Dm
const C_CH = ['d2,a2,f3', 'c#2,a2,f3', 'c2,a2,f3', 'b1,g2,d3,f3', 'bb1,f2,d3', 'g1,g2,bb2,d3', 'a1,g2,c#3,e3', 'd2,a2,d3,f3']
const C_RT = ['d2', 'c#2', 'c2', 'b1', 'bb1', 'g1', 'a1', 'd1']
const C_LD = ['a3', 'a3 ~ g3 ~', 'g3', 'f3 ~ ~ d3', 'f3', 'd3', 'e3 ~ c#3 ~', 'd3']
const X_LD = ['d4 ~ a3 ~', 'c#4 ~ ~ a3', 'c4 ~ a3 g3', 'd4 ~ b3 ~', 'f4 ~ d4 ~', 'd4 ~ bb3 ~', 'e4 ~ c#4 a3', 'd4 ~ ~ ~']

// bridge: Gm - Dm - Eb - Dm  (plagal grace, Neapolitan shadow)
const B_CH = ['g1,d2,bb2,d3', 'd2,a2,f3,a3', 'eb2,g2,bb2,eb3', 'd2,a2,f3,a3']
const B_RT = ['g1', 'd1', 'eb1', 'd1']
const B_BL = ['bb3', 'a3', 'g3', 'f3']

const baritone = (phrase, cut, level) =>
  note(m(phrase)).s("triangle").lpf(cut).vib(4.5).vmod(0.07)
    .attack(0.03).release(0.5).gain(level).room(0.55).pan(0.08)

const kick = s("bd ~ ~ ~ bd ~ ~ ~").bank("RolandTR808").gain(0.7)
const rims = s("~ ~ rim ~ ~ ~ rim ~").gain(0.32).room(0.4).pan(-0.15)
const snap = s("~ ~ sd:2 ~ ~ ~ sd:2 ~").gain(0.4).room(0.45).pan(-0.1)
const toll = note("d4").struct("x ~ ~ ~ ~ ~ ~ ~").s("tubularbells").gain(0.24).room(0.9)

const verseSeg = (i, withLead, withRims, withDrums) => stack(
  note(m(V_CH[i % 4])).struct("x ~ ~ ~ ~ ~ x ~").s("piano").gain(0.4).room(0.5).release(0.6),
  note(m(V_RT[i % 4])).struct("x ~ ~ ~ x ~ ~ ~").s("sine").lpf(120).attack(0.02).release(0.4).gain(0.6),
  ...(withDrums ? [kick] : []),
  ...(withRims ? [rims] : []),
  ...(withLead ? [baritone(V_LD[i % 4], 800, 0.42)] : []),
)

const chorusSeg = (i) => stack(
  note(m(C_CH[i % 8])).struct("x ~ ~ ~ x ~ ~ ~").s("piano").gain(0.42).room(0.5).release(0.6),
  note(m(C_CH[i % 8])).s("organ_full").lpf(1000).attack(0.35).release(0.6).gain(0.2).room(0.6),
  note(m(C_RT[i % 8])).struct("x ~ ~ ~ x ~ ~ ~").s("sine").lpf(120).attack(0.02).release(0.4).gain(0.6),
  baritone(C_LD[i % 8], 850, 0.44),
  kick, rims,
)

const bridgeSeg = (i) => stack(
  note(m(B_CH[i % 4])).s("organ_full").lpf(900).attack(0.5).release(0.9).gain(0.24).room(0.7),
  note(m(B_RT[i % 4])).struct("x ~ ~ ~ ~ ~ ~ ~").s("sine").lpf(110).attack(0.04).release(0.8).gain(0.55),
  note(m(B_BL[i % 4])).struct("~ ~ ~ ~ x ~ ~ ~").s("tubularbells").gain(0.2).room(0.9).pan(0.2),
  ...(i >= 4 ? [note(m(V_LD[i % 4])).s("piano").gain(0.3).room(0.6)] : []),
)

const climaxSeg = (i) => stack(
  note(m(C_CH[i % 8])).struct("x ~ ~ ~ x ~ x ~").s("piano").gain(0.46).room(0.5).release(0.6),
  note(m(C_CH[i % 8])).s("organ_full").lpf(1400).attack(0.25).release(0.6).gain(0.26).room(0.6),
  note(m(C_RT[i % 8])).struct("x ~ ~ ~ x ~ ~ ~").s("sine").lpf(130).attack(0.02).release(0.4).gain(0.62),
  baritone(X_LD[i % 8], 1200, 0.48),
  note(m(C_RT[i % 8])).struct("x ~ ~ ~ ~ ~ ~ ~").s("timpani").gain(0.5).room(0.6),
  kick, snap,
)

const introSeg = (i) => stack(
  toll,
  ...(i >= 2 ? [note("d2 ~ ~ a2 ~ f2 ~ e2").s("piano").gain(0.32).room(0.6)] : []),
  ...(i >= 4 ? [note("d1").s("sine").lpf(100).attack(0.3).release(1).gain(0.5)] : []),
)

const outroSeg = (i) => stack(
  note("[d2,a2,d3,f3] ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.38 - i * 0.04).room(0.7).release(0.8),
  note("d1 ~ ~ ~ ~ ~ ~ ~").s("sine").lpf(100).attack(0.05).release(0.9).gain(0.5 - i * 0.05),
  ...(i % 2 === 0 ? [toll.gain(0.22 - i * 0.02)] : []),
)

slowcat(
  ...Array.from({ length: 6 }, (_, k) => introSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => verseSeg(k, k >= 4, false, true)),
  ...Array.from({ length: 8 }, (_, k) => verseSeg(k, true, true, true)),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => verseSeg(k, true, false, false)),
  ...Array.from({ length: 8 }, (_, k) => bridgeSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => climaxSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => outroSeg(k)),
)
`
