export const title = 'The Warmth of Leaving'
export const genre = 'baroque pop / chamber pop — Brian Wilson teenage-symphony lineage, 1966, ~78 BPM'
export const mood = 'A music box opens onto a summer that is already ending. The chords keep slipping out from under their own bass notes — bright on top, aching underneath — and when the chorus finally lifts, it lands somewhere it was never supposed to go.'
export const cycles = 60
export const model = 'claude-fable-5'
export const prompt = 'beach boys pet sounds — brian wilson baroque pop, counter-melody bass, teenage-symphony ache'
export const author = 'morgan'

export const code = `setcps(0.325)

// ---- INTRO: music box alone (Bb/C -> F/A -> Gm/Bb -> C/E) ----
const IN_VB = [
  'f4 bb4 d5 f5 ~ d5 bb4 f4',
  'f4 a4 c5 f5 ~ c5 a4 f4',
  'g4 bb4 d5 g5 ~ d5 bb4 g4',
  'e4 g4 c5 e5 ~ c5 g4 e4',
]

// ---- VERSE: Bb/C  F/A  Gm/Bb  C/E | Bb/C  F  Dm  C7 ----
const V_CH = [
  'bb3,d4,f4', 'a3,c4,f4', 'bb3,d4,g4', 'g3,c4,e4',
  'bb3,d4,f4', 'a3,c4,f4', 'a3,d4,f4', 'g3,bb3,e4',
]
const V_BS = [
  'c2 ~ c2 c3 ~ bb2 ~ a2',
  'a2 ~ f2 ~ a2 ~ c3 bb2',
  'bb2 ~ d3 ~ bb2 g2 f2 e2',
  'e2 ~ g2 ~ c3 ~ g2 c2',
  'c2 ~ c2 c3 ~ bb2 ~ a2',
  'f2 ~ a2 ~ c3 a2 f2 e2',
  'd2 ~ a2 ~ d3 ~ c3 ~',
  'c2 ~ g2 ~ e2 ~ d2 c2',
]
const V_LD = [
  'c4 ~ a4 ~ g4 ~ f4 ~',
  '~ ~ c5 ~ a4 ~ g4 a4',
  'd4 ~ bb4 ~ a4 g4 ~ ~',
  '~ e4 ~ g4 ~ e4 d4 c4',
  'c4 ~ a4 ~ g4 ~ f4 ~',
  '~ ~ c5 ~ a4 ~ g4 a4',
  'a4 ~ f4 ~ e4 d4 ~ ~',
  '~ e4 g4 ~ bb4 ~ c5 ~',
]

// ---- CHORUS: Bb/F  C/E  F/A  D(!)  Gm  Eb/G  Bb/C  C7 ----
const C_CH = [
  'f3,bb3,d4', 'g3,c4,e4', 'c4,f4,a4', 'a3,d4,f#4',
  'bb3,d4,g4', 'bb3,eb4,g4', 'bb3,d4,f4', 'g3,bb3,e4',
]
const C_BS = [
  'f2 ~ bb2 ~ f2 ~ d2 e2',
  'e2 ~ g2 ~ c3 g2 ~ a2',
  'a2 ~ c3 ~ f2 ~ e2 d2',
  'd2 ~ f#2 ~ a2 ~ d3 ~',
  'g2 ~ bb2 ~ d3 bb2 ~ g2',
  'g2 ~ eb2 ~ g2 ~ bb2 c3',
  'c2 ~ c3 ~ bb2 ~ f2 ~',
  'c2 ~ g2 ~ e2 g2 ~ c3',
]
const C_LD = [
  'f4 ~ d5 ~ c5 bb4 ~ a4',
  '~ e4 g4 ~ c5 ~ g4 ~',
  'a4 ~ c5 ~ a4 ~ g4 f4',
  'f#4 ~ a4 ~ d5 ~ a4 ~',
  'g4 ~ bb4 ~ a4 g4 ~ d4',
  'bb4 ~ g4 ~ eb4 ~ f4 g4',
  'f4 ~ bb4 a4 ~ f4 d4 ~',
  '~ c5 ~ bb4 ~ g4 e4 ~',
]

// ---- BRIDGE: drift to Db — Db/Ab  Bbm7  Gbmaj7  Ab/Eb | ... Gm  C7 ----
const B_CH = [
  'ab3,db4,f4', 'f3,ab3,db4', 'bb3,db4,f4', 'ab3,c4,eb4',
  'ab3,db4,f4', 'f3,ab3,db4', 'g3,bb3,d4', 'g3,bb3,e4',
]
const B_BS = [
  'ab2 ~ ~ db3 ~ ~ ab2 ~',
  'bb2 ~ ~ f2 ~ ~ db3 ~',
  'gb2 ~ ~ db3 ~ ~ bb2 ~',
  'eb2 ~ ~ ab2 ~ c3 ~ ~',
  'ab2 ~ ~ db3 ~ ~ ab2 ~',
  'bb2 ~ ~ f2 ~ ~ db3 ~',
  'g2 ~ ~ d3 ~ ~ bb2 ~',
  'c2 ~ ~ g2 ~ bb2 ~ c3',
]
const B_HP = [
  'ab3 db4 f4 ab4 ~ f4 db4 ~',
  'bb3 db4 f4 ab4 ~ f4 db4 ~',
  'gb3 bb3 db4 f4 ~ db4 bb3 ~',
  'ab3 c4 eb4 ab4 ~ eb4 c4 ~',
  'ab3 db4 f4 ab4 ~ f4 db4 ~',
  'bb3 db4 f4 ab4 ~ f4 db4 ~',
  'g3 bb3 d4 g4 ~ d4 bb3 ~',
  'g3 bb3 e4 g4 ~ e4 c4 ~',
]
const B_LD = [
  '~ ~ ~ f4 ~ eb4 db4 ~',
  '~ ~ ab4 ~ f4 ~ ~ ~',
  '~ ~ ~ f4 gb4 ~ ~ ~',
  '~ ~ eb4 ~ ~ ~ ~ ~',
  '~ ~ ~ f4 ~ eb4 db4 ~',
  '~ ~ ab4 ~ f4 ~ ~ ~',
  '~ ~ ~ d4 ~ ~ ~ ~',
  '~ ~ ~ e4 ~ ~ ~ ~',
]

// ---- CODA: the music box again, sadder — ends on Dm(add9) ----
const O_CH = [
  'a3,c4,f4', 'a3,d4,f4', 'bb3,d4,f4', 'bb3,d4,f4',
  'a3,c4,f4', 'f3,a3,c4', 'd4,f4,a4', 'f3,a3,e4',
]
const O_BS = [
  'f2 ~ ~ ~ ~ ~ ~ ~',
  'd2 ~ ~ ~ ~ ~ ~ ~',
  'bb1 ~ ~ ~ ~ ~ ~ ~',
  'c2 ~ ~ ~ ~ ~ ~ ~',
  'a2 ~ ~ ~ ~ ~ ~ ~',
  'd2 ~ ~ ~ ~ ~ ~ ~',
  'bb1 ~ ~ ~ ~ ~ ~ ~',
  '~ ~ ~ ~ ~ ~ ~ ~',
]
const O_VB = [
  'f4 ~ a4 ~ c5 ~ a4 ~',
  'd4 ~ f4 ~ a4 ~ f4 ~',
  'f4 ~ bb4 ~ d5 ~ bb4 ~',
  'f4 ~ bb4 ~ c5 ~ bb4 ~',
  'c4 ~ a4 ~ g4 ~ f4 ~',
  'a4 ~ f4 ~ e4 ~ d4 ~',
  'a4 ~ f4 ~ d4 ~ ~ ~',
  'e5 ~ ~ ~ ~ ~ ~ ~',
]

// ---- voices ----
const bassVoice = (line) =>
  note(m(line)).s("triangle").lpf(360).gain(0.5).release(0.12)
const leadVoice = (line, lvl) =>
  note(m(line)).s("triangle").lpf(1600).attack(0.02).release(0.25)
    .vib(5).vmod(0.05).gain(lvl).room(0.35).pan(0.1)
const pianoBed = (chord, lvl) =>
  note(m(chord)).struct("x ~ ~ ~ x ~ ~ ~").s("piano").clip(1.8).gain(lvl).room(0.3)
const organBed = (chord, lvl) =>
  note(m(chord)).s("organ_full").attack(0.2).release(0.5).lpf(900).gain(lvl).room(0.4)

const drumsVerse = stack(
  s("bd ~ ~ ~ ~ bd ~ ~").bank("RhythmAce").gain(0.42).clip(1.6).release(0.3),
  s("~ ~ ~ ~ sd ~ ~ ~").bank("RhythmAce").gain(0.2).clip(1.4).release(0.3).lpf(4200),
)
const drumsChorus = (full) => stack(
  s("bd ~ ~ ~ ~ bd ~ ~").bank("RhythmAce").gain(0.45).clip(1.6).release(0.3),
  s("~ ~ ~ ~ sd ~ ~ ~").bank("RhythmAce").gain(0.22).clip(1.4).release(0.3).lpf(4200),
  s("shaker*8").gain(0.09).hpf(3000),
  ...(full ? [s("~ ~ ~ ~ tambourine ~ ~ ~").gain(0.11).hpf(2000)] : []),
)

// ---- sections ----
const introSeg = (i) =>
  note(m(IN_VB[i % 4])).s("vibraphone").gain(0.17).room(0.6).release(0.3).pan(-0.1)

const verseSeg = (i) => stack(
  pianoBed(V_CH[i % 8], 0.34),
  bassVoice(V_BS[i % 8]),
  leadVoice(V_LD[i % 8], 0.34),
  drumsVerse,
)

const chorusSeg = (i, full) => stack(
  pianoBed(C_CH[i % 8], 0.34),
  organBed(C_CH[i % 8], full ? 0.17 : 0.14),
  bassVoice(C_BS[i % 8]),
  leadVoice(C_LD[i % 8], 0.37),
  ...(full ? [note(m(C_LD[i % 8])).add(note(12)).s("vibraphone").gain(0.12).room(0.5).pan(-0.15)] : []),
  drumsChorus(full),
)

const bridgeSeg = (i) => stack(
  organBed(B_CH[i % 8], 0.15),
  note(m(B_HP[i % 8])).s("folkharp").gain(0.26).room(0.5).pan(0.2),
  bassVoice(B_BS[i % 8]).gain(0.42),
  leadVoice(B_LD[i % 8], 0.28),
)

const codaSeg = (i) => stack(
  note(m(O_VB[i % 8])).s("vibraphone").gain(0.16).room(0.65).release(0.3).pan(-0.1),
  note(m(O_CH[i % 8])).struct("x ~ ~ ~ ~ ~ ~ ~").s("piano").clip(2).gain(0.2).room(0.4),
  bassVoice(O_BS[i % 8]).gain(0.34),
)

// ---- arrangement: 4+8+8+8+8+8+8+8 = 60 cycles ----
const PLAN = [
  [introSeg, 4],
  [(k) => verseSeg(k), 8],
  [(k) => chorusSeg(k, false), 8],
  [(k) => verseSeg(k), 8],
  [(k) => chorusSeg(k, false), 8],
  [bridgeSeg, 8],
  [(k) => chorusSeg(k, true), 8],
  [codaSeg, 8],
]
slowcat(...PLAN.flatMap(([seg, len]) => Array.from({ length: len }, (_, k) => seg(k))))`
