export const title = 'Meia-Luz'
export const genre = 'Bossa nova — 1962 Rio de Janeiro, Jobim/Gilberto apartment-session lineage (~120 BPM, A minor)'
export const mood = 'Dusk on a Copacabana veranda: a nylon-soft comp over the classic descending bass (Am, Am/G, F#o, Fmaj7), a flute-like motif that sighs downward and keeps almost resolving. The B section lifts into major, then a borrowed Cm9 clouds the light for one bar — pure saudade — before a Bbmaj7#11 opens the window again. A murmured rhodes solo, one last verse, and the song settles on a suspended Am(maj9), unresolved the way evenings are.'
export const cycles = 40
// exported from the radio DB (2026-07-02); restore with: bun scripts/post-song.mjs <this file>
export const code = `// Meia-Luz — bossa nova, A minor, one cycle = 2 bars
setcps(0.25)

const VCH = [
  '[c4,e4,g4,b4] [a3,c4,e4]',
  '[a3,c4,e4] [a3,c4,e4,g4]',
  '[a3,d4,f4] [g#3,d4,f4]',
  '[c4,e4,f#4] [g#3,d4,f4]',
]
const VBS = [
  '[a1 ~ ~ e2 a1 ~ ~ e2] [g1 ~ ~ d2 g1 ~ ~ d2]',
  '[f#1 ~ ~ c2 f#1 ~ ~ c2] [f1 ~ ~ c2 f1 ~ ~ c2]',
  '[b1 ~ ~ f2 b1 ~ ~ f2] [e2 ~ ~ b1 e2 ~ ~ b1]',
  '[a1 ~ ~ e2 a1 ~ ~ e2] [e2 ~ ~ b1 e1 ~ ~ ~]',
]
const BCH = [
  '[f3,a3,c4,e4] [f3,b3,e4]',
  '[e3,g3,b3,d4] [eb3,g3,bb3,d4]',
  '[eb3,a3,d4] [d3,f3,a3,e4]',
  '[a3,d4,f4] [g#3,d4,f4]',
]
const BBS = [
  '[d2 ~ ~ a1 d2 ~ ~ a1] [g1 ~ ~ d2 g1 ~ ~ d2]',
  '[c2 ~ ~ g1 c2 ~ ~ g1] [c2 ~ ~ g1 c2 ~ ~ eb2]',
  '[f1 ~ ~ c2 f1 ~ ~ c2] [bb1 ~ ~ f2 bb1 ~ ~ f2]',
  '[b1 ~ ~ f2 b1 ~ ~ f2] [e2 ~ ~ b1 e2 ~ ~ b1]',
]

const M1 = [
  '~ e5 [d5 c5] b4 ~ ~ a4 ~',
  '~ c5 [b4 a4] g4 ~ ~ e4 ~',
  '~ d5 [c5 b4] a4 ~ [g#4 b4] ~',
  'a4 ~ ~ ~ ~ [e4 f#4] g#4 ~',
]
const M1B = [
  '~ e5 [d5 c5] b4 ~ [c5 b4] a4 ~',
  '~ [c5 d5] c5 [b4 a4] g4 ~ e4 ~',
  '~ d5 ~ [f5 e5] ~ [d5 c5] b4 ~',
  '[b4 a4] ~ a4 ~ ~ ~ ~ ~',
]
const M1C = [
  '~ ~ ~ b4 ~ ~ a4 ~',
  '~ ~ ~ g4 ~ ~ e4 ~',
  '~ ~ d5 ~ ~ ~ b4 ~',
  '~ ~ ~ ~ [e4 f#4] g#4 ~ ~',
]
const MB = [
  '~ f5 [e5 d5] c5 ~ ~ e5 ~',
  '~ e5 [d5 c5] b4 ~ [bb4 g4] ~',
  '~ [c5 d5] a4 ~ f4 ~ e5 ~',
  'f5 ~ [e5 d5] ~ b4 ~ g#4 ~',
]
const MF = [
  '~ e5 [d5 c5] b4 ~ ~ a4 ~',
  '~ c5 [b4 a4] g4 ~ ~ e4 ~',
  '~ d5 [c5 b4] a4 ~ [g#4 b4] ~',
  'b4 ~ ~ e5 ~ ~ ~ ~',
]
const SOLO = [
  '~ ~ b4 ~ c5 ~ [e5 d5] ~',
  'c5 ~ [a4 g4] ~ ~ e4 [g4 a4] ~',
  '~ f4 ~ [a4 b4] ~ [d5 c5] b4 ~',
  '[c5 b4] a4 ~ f#4 ~ e4 ~ ~',
  '~ e5 ~ [g5 f5] e5 ~ [d5 c5] ~',
  'g5 ~ [f5 e5] ~ c5 ~ a4 ~',
  '~ [a4 b4] d5 ~ f5 ~ [e5 d5] ~',
  'e5 ~ ~ [c5 b4] a4 ~ ~ ~',
]
const CM = [
  '~ ~ ~ a3 ~ c4 [d4 e4] ~',
  '~ ~ ~ g3 ~ b3 [d4 eb4] ~',
  '~ ~ a3 ~ ~ c4 [d4 e4] ~',
  '~ ~ f4 ~ [d4 ~] b3 ~ ~',
]

const FCH3 = '[c4,e4,f#4] [c4,e4,g#4,b4]'
const FBS3 = '[a1 ~ ~ e2 a1 ~ ~ e2] [a1 ~ ~ ~ ~ ~ ~ ~]'

const comp = (chord, g) => note(m(chord))
  .struct("x ~ ~ x ~ ~ x ~ ~ x ~ ~ x ~ x ~")
  .s("rhodes").room(0.35).gain(g)
const bassL = (line) => note(m(line)).s("sine").lpf(180).gain(0.6)
const lead = (line) => note(m(line)).s("triangle").lpf(1600)
  .room(0.45).gain(0.42).vib(5).vmod(0.05)
const soloV = (line) => note(m(line)).s("rhodes").room(0.4).gain(0.45)
const clave = s("[rim ~ ~ rim ~ ~ rim ~] [~ ~ rim ~ ~ rim ~ ~]").gain(0.5)
const shk = s("shaker*16").gain("[0.28 0.12 0.2 0.12]*4")
const kick = s("[bd:3 ~ ~ ~ bd:3 ~ ~ ~]*2").gain(0.45)
const hats = s("[~ hh]*8").gain(0.13)
const ohAcc = s("[~ ~ ~ oh ~ ~ ~ ~]*2").gain(0.18)

// sections
const introSeg = (i) => i < 2
  ? stack(comp(VCH[i % 4], 0.3), bassL(VBS[i % 4]), clave, shk)
  : stack(comp(VCH[i % 4], 0.32), bassL(VBS[i % 4]), clave, shk, kick, hats)
const verseSeg = (i, mel) => stack(
  comp(VCH[i % 4], 0.32), bassL(VBS[i % 4]), lead(mel[i % 4]),
  clave, shk, kick, hats,
)
const chorusSeg = (i, peak) => {
  const base = stack(
    comp(BCH[i % 4], peak ? 0.36 : 0.33), bassL(BBS[i % 4]), lead(MB[i % 4]),
    clave, shk, kick, hats,
  )
  return peak ? stack(base, soloV(CM[i % 4]).gain(0.35), ohAcc) : base
}
const soloSeg = (i) => stack(
  comp(VCH[i % 4], 0.3), bassL(VBS[i % 4]), soloV(SOLO[i % 8]),
  clave, shk, kick, hats,
)
const finalSeg = (i) => stack(
  comp(i % 4 === 3 ? FCH3 : VCH[i % 4], 0.32),
  bassL(i % 4 === 3 ? FBS3 : VBS[i % 4]),
  lead(MF[i % 4]), clave, shk, kick,
)
const outroSeg = (i) => i < 2
  ? stack(
      comp(i === 0 ? '[c4,e4,g4,b4] [a3,c4,e4,g4]' : '[c4,e4,g4,b4] [c4,e4,f#4]', 0.3),
      bassL('[a1 ~ ~ e2 a1 ~ ~ e2] [a1 ~ ~ e2 a1 ~ ~ e2]'), clave, shk,
    )
  : stack(
      note("c4,e4,g#4,b4").s("rhodes").room(0.6).gain(0.28),
      note("a1").s("sine").lpf(160).gain(0.5),
      i === 2 ? shk.gain(0.1) : silence,
    )

slowcat(
  ...Array.from({ length: 4 }, (_, k) => introSeg(k)),
  ...Array.from({ length: 4 }, (_, k) => verseSeg(k, M1)),
  ...Array.from({ length: 4 }, (_, k) => verseSeg(k, M1B)),
  ...Array.from({ length: 4 }, (_, k) => chorusSeg(k, false)),
  ...Array.from({ length: 4 }, (_, k) => verseSeg(k, M1C)),
  ...Array.from({ length: 8 }, (_, k) => soloSeg(k)),
  ...Array.from({ length: 4 }, (_, k) => chorusSeg(k, true)),
  ...Array.from({ length: 4 }, (_, k) => finalSeg(k)),
  ...Array.from({ length: 4 }, (_, k) => outroSeg(k)),
)
`
