export const title = 'Cheer Up, the Sky Is Falling'
export const genre = 'Music-hall glam pop — Hunky Dory-era Bowie stride-piano singalong, 1971 vaudeville-pop lineage, ~108 BPM'
export const mood = 'A grinning piano announces the apocalypse from a pub stool: bouncing stride left hand, cheeky syncopated chords, and a chorus that leaps a chromatic mediant into pure singalong sunshine. The doom peeks through in one borrowed minor chord and never stops smiling.'
export const cycles = 70
export const model = 'claude-fable-5'
export const prompt = 'hunky dory bowie, jaunty — oh you pretty things vein, music-hall stride piano, cheerful doom'
export const author = 'morgan'

export const code = `setcps(0.45)

// ---------- VERSE: F major music-hall, Bbm doom-wink, D7 swerve ----------
const V_CH = [
  'c3,f3,a3',   // F
  'c3,f3,a3',   // F
  'd3,f3,bb3',  // Bb
  'db3,f3,bb3', // Bbm — borrowed iv, the grin slips
  'c3,f3,a3',   // F/C
  'd3,f#3,c4',  // D7 — V/ii, theatrical swerve
  'd3,f3,bb3',  // Gm7 (rootless, bass carries g)
  'e3,g3,bb3',  // C7
]
const V_BS = [
  '[f1,f2] ~ [c2,c3] ~',
  '[f1,f2] ~ [c2,c3] ~',
  '[bb1,bb2] ~ [f2,f3] ~',
  '[bb1,bb2] ~ [f2,f3] ~',
  '[c2,c3] ~ [a1,a2] ~',
  '[d2,d3] ~ [a1,a2] ~',
  '[g1,g2] ~ [d2,d3] ~',
  '[c2,c3] ~ [e2,e3] ~',
]
const V_ML = [
  'c4 ~ a4 f4',
  '~ g4 a4 ~',
  'd4 ~ bb4 f4',
  '~ f4 db4 ~',
  'c4 ~ a4 c5',
  '~ a4 f#4 ~',
  'g4 ~ bb4 g4',
  '~ e4 g4 bb4',
]

// ---------- CHORUS: chromatic mediant leap to A major, everyone sings ----------
const C_CH = [
  'c#3,e3,a3',  // A
  'c#3,f#3,a3', // F#m
  'd3,f#3,a3',  // D
  'e3,g#3,d4',  // E7
  'e3,a3,c#4',  // A (brighter voicing, climax bar)
  'c#3,f3,b3',  // C#7 — V/vi, shouldn't work in a pub, does
  'c#3,f#3,a3', // F#m
  'e3,g#3,d4',  // E7 (falls deceptively back to F for verses)
]
const C_BS = [
  '[a1,a2] ~ [e2,e3] ~',
  '[f#1,f#2] ~ [c#2,c#3] ~',
  '[d2,d3] ~ [a1,a2] ~',
  '[e2,e3] ~ [b1,b2] ~',
  '[a1,a2] ~ [e2,e3] ~',
  '[c#2,c#3] ~ [g#1,g#2] ~',
  '[f#1,f#2] ~ [c#2,c#3] ~',
  '[e2,e3] ~ [b1,b2] ~',
]
const C_ML = [
  'e4 ~ c#5 a4',
  '~ b4 c#5 ~',
  'f#4 ~ d5 a4',
  '~ g#4 b4 e4',
  'e4 ~ c#5 e5',
  '~ b4 f4 ~',
  'f#4 ~ a4 c#5',
  '~ b4 g#4 e4',
]
const C_RS = [
  '~',
  '~ ~ c#5 e5',
  '~',
  '~ ~ b4 g#4',
  '~',
  '~ ~ f5 e5',
  '~',
  '~ ~ g#4 b4',
]

// ---------- BRIDGE: secondary-dominant chain, the doom leans in ----------
const B_CH = [
  'c#3,e3,g3',  // A7
  'c#3,e3,g3',
  'c3,f#3,a3',  // D7
  'c3,f#3,a3',
  'b2,d3,f3',   // G7
  'b2,d3,f3',
  'bb2,e3,g3',  // C7
  'b2,d3,g#3',  // E7 — chromatic slip up, door back into A
]
const B_BS = [
  '[a1,a2] ~ [e2,e3] ~',
  '[a1,a2] ~ [e2,e3] ~',
  '[d2,d3] ~ [a1,a2] ~',
  '[d2,d3] ~ [a1,a2] ~',
  '[g1,g2] ~ [d2,d3] ~',
  '[g1,g2] ~ [d2,d3] ~',
  '[c2,c3] ~ [g1,g2] ~',
  '[e2,e3] ~ [b1,b2] ~',
]
const B_ML = [
  'g4 ~ ~ e4',
  '~ c#4 ~ ~',
  'f#4 ~ ~ d4',
  '~ c4 ~ ~',
  'f4 ~ ~ d4',
  '~ b3 ~ ~',
  'e4 ~ g4 bb4',
  'b4 ~ g#4 e4',
]

// ---------- TAG + OUTRO ----------
const T_CH = ['c#3,e3,a3', 'd3,f#3,a3', 'e3,g#3,d4', 'e3,a3,c#4']
const T_BS = [
  '[a1,a2] ~ [e2,e3] ~',
  '[d2,d3] ~ [d2,d3] ~',
  '[e2,e3] ~ [b1,b2] ~',
  '[a1,a2] ~ [e2,e3] ~',
]
const T_ML = ['e5 ~ c#5 a4', '~ f#4 a4 d5', 'b4 ~ g#4 ~', 'a4 ~ ~ ~']
const T_RS = ['~ ~ e5 c#5', '~ ~ f#5 d5', '~ ~ b4 ~', '~ c#5 e5 a4']

const O_CH = ['c3,f3,a3', 'c3,f3,a3', 'd3,f3,bb3', 'db3,f3,bb3', 'c3,f3,a3', 'c3,f3,a3']
const O_BS = [
  '[f1,f2] ~ [c2,c3] ~',
  '[f1,f2] ~ [c2,c3] ~',
  '[bb1,bb2] ~ [f2,f3] ~',
  '[bb1,bb2] ~ [f2,f3] ~',
  '[f1,f2] ~ [c2,c3] ~',
  '[f1,f2] ~ ~ ~',
]
const O_ML = ['c4 ~ a4 f4', '~ g4 a4 ~', 'd4 ~ bb4 f4', '~ f4 db4 ~', 'c4 ~ a4 c5', 'f4 ~ ~ ~']

// ---------- voices ----------
const stride = (bar) => note(m(bar)).s("piano").gain(0.5).clip(0.85)
const comp = (chord) => note(m(chord)).struct("~ x ~ x").s("piano").gain(0.4).clip(0.55)
const compPush = (chord) => note(m(chord)).struct("~ x ~ [x x]").s("piano").gain(0.4).clip(0.5)
const compHeld = (chord) => note(m(chord)).struct("x ~ ~ ~").s("piano").gain(0.44).clip(1.8)
const whistle = (phrase, g) => note(m(phrase)).s("triangle").lpf(2200).gain(g).clip(0.9).vib(5).vmod(0.05).room(0.25)
const wood = (phrase) => note(m(phrase)).s("marimba").gain(0.32).room(0.3)

const kick = s("bd ~ bd ~").bank("KorgKR55").gain(0.5).clip(1.5).release(0.3)
const back = s("~ sd ~ sd").bank("KorgKR55").gain(0.28).clip(1.4).release(0.3)
const claps = s("~ cp ~ cp").bank("LinnDrum").gain(0.22).clip(1.5).release(0.3)
const hats = s("[hh hh]*4").bank("KorgKR55").gain(0.12)
const tamb = s("~ tambourine ~ tambourine").gain(0.13)

// ---------- sections ----------
const introSeg = (k) => stack(
  stride(V_BS[k % 8]),
  comp(V_CH[k % 8]),
  whistle(k === 3 ? '~ ~ ~ [a3 c4]' : '~', 0.3),
)
const verse1Seg = (k) => stack(
  stride(V_BS[k % 8]), comp(V_CH[k % 8]), whistle(V_ML[k % 8], 0.36),
)
const verse2Seg = (k) => stack(
  stride(V_BS[k % 8]), comp(V_CH[k % 8]), whistle(V_ML[k % 8], 0.36),
  kick, back,
)
const chorus1Seg = (k) => stack(
  stride(C_BS[k % 8]), compPush(C_CH[k % 8]), whistle(C_ML[k % 8], 0.4),
  kick, back, claps, hats,
)
const chorus2Seg = (k) => stack(
  stride(C_BS[k % 8]), compPush(C_CH[k % 8]), whistle(C_ML[k % 8], 0.4),
  wood(C_RS[k % 8]),
  kick, back, claps, hats,
)
const chorus3Seg = (k) => stack(
  stride(C_BS[k % 8]), compPush(C_CH[k % 8]), whistle(C_ML[k % 8], 0.42),
  wood(C_RS[k % 8]),
  kick, back, claps, hats, tamb,
)
const bridgeSeg = (k) => stack(
  stride(B_BS[k % 8]), comp(B_CH[k % 8]), whistle(B_ML[k % 8], 0.32),
  kick, hats,
)
const tagSeg = (k) => stack(
  stride(T_BS[k % 4]), compHeld(T_CH[k % 4]), whistle(T_ML[k % 4], 0.42),
  wood(T_RS[k % 4]),
  kick, back, claps,
)
const outroSeg = (k) => stack(
  stride(O_BS[k % 6]),
  k === 5 ? compHeld(O_CH[5]) : comp(O_CH[k % 6]),
  whistle(O_ML[k % 6], 0.32),
)

slowcat(
  ...Array.from({ length: 4 }, (_, k) => introSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => verse1Seg(k)),
  ...Array.from({ length: 8 }, (_, k) => verse2Seg(k)),
  ...Array.from({ length: 8 }, (_, k) => chorus1Seg(k)),
  ...Array.from({ length: 8 }, (_, k) => verse2Seg(k)),
  ...Array.from({ length: 8 }, (_, k) => chorus2Seg(k)),
  ...Array.from({ length: 8 }, (_, k) => bridgeSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => chorus3Seg(k)),
  ...Array.from({ length: 4 }, (_, k) => tagSeg(k)),
  ...Array.from({ length: 6 }, (_, k) => outroSeg(k)),
)`
