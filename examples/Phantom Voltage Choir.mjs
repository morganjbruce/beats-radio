// Phantom Voltage Choir
// Cathedral-Crusher French Electro · 2007 Parisian club basement · Triumphant menace — leather-jacket swagger with gothic grandeur

// Genre: Cathedral-Crusher French Electro
// Era: 2007 Parisian club basement
// Mood: Triumphant menace, gothic disco swagger
// Sounds: sawtooth bass (crushed), sawtooth chord stabs, TR909 drums, square-wave phantom choir (chopped vocal stand-in), triangle break pads, organ_full climax stabs
// Sound choice: distorted saws + gated square 'voice' chops recreate the Justice Phantom II palette

setcps(0.5)

// ---------- shared drum kits ----------
let drumsFull = stack(
  s("bd*4").bank("RolandTR909").shape(0.3).gain(0.8),
  s("~ cp ~ cp").bank("RolandTR909").gain(0.5).room(0.15),
  s("[~ hh]*4").bank("RolandTR909").hpf(6000).gain(0.3),
  s("~ ~ ~ [~ oh]").bank("RolandTR909").hpf(5000).gain(0.22)
)

let drumsIntro = stack(
  s("bd*4").bank("RolandTR909").gain(0.7),
  s("[~ hh]*4").bank("RolandTR909").hpf(6000).gain(0.22)
)

// ---------- INTRO : filtered, building ----------
let introDm = stack(
  drumsIntro,
  note("d2 d2 d2 [d2 d2]").s("sawtooth").lpf(sine.range(150, 700).slow(8)).shape(0.5).gain(0.45),
  note("[d3,f3,a3]").struct("x ~ x ~ x ~ x ~").clip(0.5).s("sawtooth").lpf(900).shape(0.3).gain(0.2).room(0.2)
)
let introBb = stack(
  drumsIntro,
  note("bb1 bb1 bb1 [bb1 bb1]").s("sawtooth").lpf(sine.range(150, 700).slow(8)).shape(0.5).gain(0.45),
  note("[bb2,d3,f3]").struct("x ~ x ~ x ~ x ~").clip(0.5).s("sawtooth").lpf(900).shape(0.3).gain(0.2).room(0.2)
)
let introA = stack(
  drumsIntro,
  note("a1 a1 a1 [a1 a1]").s("sawtooth").lpf(sine.range(150, 700).slow(8)).shape(0.5).gain(0.45),
  note("[a2,cs3,e3]").struct("x ~ x ~ x ~ x ~").clip(0.5).s("sawtooth").lpf(900).shape(0.3).gain(0.2).room(0.2)
)

// ---------- MAIN : full crushed Justice groove ----------
let mainDm = stack(
  drumsFull,
  note("d2 [d2 d2] d2 [~ d3]").s("sawtooth").lpf(550).shape(0.6).gain(0.48),
  note("[d3,f3,a3]").struct("x ~ x x ~ x ~ [x x]").clip(0.55).s("sawtooth").lpf(2000).shape(0.45).gain(0.25),
  note("d4 d4 ~ f4 [e4 d4] ~ a4 ~").s("square").lpf(1400).hpf(350).vib(5).vmod(0.07).clip(0.7).gain(0.2).room(0.25)
)
let mainBb = stack(
  drumsFull,
  note("bb1 [bb1 bb1] bb1 [~ bb2]").s("sawtooth").lpf(550).shape(0.6).gain(0.48),
  note("[bb2,d3,f3]").struct("x ~ x x ~ x ~ [x x]").clip(0.55).s("sawtooth").lpf(2000).shape(0.45).gain(0.25),
  note("f4 ~ d4 f4 ~ [g4 f4] d4 ~").s("square").lpf(1400).hpf(350).vib(5).vmod(0.07).clip(0.7).gain(0.2).room(0.25)
)
let mainGm = stack(
  drumsFull,
  note("g2 [g2 g2] g2 [~ g2]").s("sawtooth").lpf(550).shape(0.6).gain(0.48),
  note("[g2,bb2,d3]").struct("x ~ x x ~ x ~ [x x]").clip(0.55).s("sawtooth").lpf(2000).shape(0.45).gain(0.25),
  note("g4 ~ bb4 g4 ~ d4 [f4 d4] ~").s("square").lpf(1400).hpf(350).vib(5).vmod(0.07).clip(0.7).gain(0.2).room(0.25)
)
let mainA = stack(
  drumsFull,
  note("a1 [a1 a1] a1 [~ a2]").s("sawtooth").lpf(550).shape(0.6).gain(0.48),
  note("[a2,cs3,e3]").struct("x ~ x x ~ x ~ [x x]").clip(0.55).s("sawtooth").lpf(2000).shape(0.45).gain(0.25),
  note("a4 ~ e4 [cs4 e4] a4 ~ g4 e4").s("square").lpf(1400).hpf(350).vib(5).vmod(0.07).clip(0.7).gain(0.2).room(0.25)
)

// ---------- BREAK : strip down, phantom choir floats ----------
let breakDm = stack(
  s("bd ~ ~ ~").bank("RolandTR909").gain(0.6),
  note("[d3,f3,a3,c4]").s("triangle").attack(0.3).release(0.6).lpf(sine.range(400, 1500).slow(8)).room(0.5).gain(0.3),
  note("d4 ~ f4 d4 ~ a4 ~ f4").s("square").lpf(1100).hpf(400).vib(5).vmod(0.1).gain(0.17).delay(0.3).room(0.4)
)
let breakBb = stack(
  s("bd ~ ~ ~").bank("RolandTR909").gain(0.6),
  note("[bb2,d3,f3,a3]").s("triangle").attack(0.3).release(0.6).lpf(sine.range(400, 1500).slow(8)).room(0.5).gain(0.3),
  note("f4 ~ d4 f4 ~ g4 ~ d4").s("square").lpf(1100).hpf(400).vib(5).vmod(0.1).gain(0.17).delay(0.3).room(0.4)
)
let breakGm = stack(
  s("bd ~ ~ ~").bank("RolandTR909").gain(0.6),
  note("[g2,bb2,d3,f3]").s("triangle").attack(0.3).release(0.6).lpf(sine.range(400, 1500).slow(8)).room(0.5).gain(0.3),
  note("g4 ~ bb4 g4 ~ d4 ~ f4").s("square").lpf(1100).hpf(400).vib(5).vmod(0.1).gain(0.17).delay(0.3).room(0.4)
)
let breakA = stack(
  s("bd ~ ~ bd").bank("RolandTR909").gain(0.65),
  note("[a2,cs3,e3,g3]").s("triangle").attack(0.3).release(0.6).lpf(sine.range(400, 2200).slow(4)).room(0.5).gain(0.32),
  note("a4 ~ e4 a4 ~ g4 e4 cs4").s("square").lpf(1100).hpf(400).vib(5).vmod(0.1).gain(0.18).delay(0.3).room(0.4),
  s("noise").lpf(sine.range(300, 4000).slow(2)).gain(0.06)
)

// ---------- BIG : climax with cathedral organ stabs ----------
let bigDm = stack(
  mainDm,
  note("[d4,f4,a4]").struct("x ~ ~ x ~ ~ x ~").clip(0.4).s("organ_full").hpf(300).gain(0.16).room(0.3)
)
let bigBb = stack(
  mainBb,
  note("[bb3,d4,f4]").struct("x ~ ~ x ~ ~ x ~").clip(0.4).s("organ_full").hpf(300).gain(0.16).room(0.3)
)
let bigGm = stack(
  mainGm,
  note("[g3,bb3,d4]").struct("x ~ ~ x ~ ~ x ~").clip(0.4).s("organ_full").hpf(300).gain(0.16).room(0.3)
)
let bigA = stack(
  mainA,
  note("[a3,cs4,e4]").struct("x ~ ~ x ~ ~ x ~").clip(0.4).s("organ_full").hpf(300).gain(0.16).room(0.3)
)

// ---------- OUTRO : filter closes the door ----------
let outroDm = stack(
  s("bd*4").bank("RolandTR909").gain(0.6),
  note("d2 d2 d2 [d2 d2]").s("sawtooth").lpf(sine.range(700, 150).slow(8)).shape(0.5).gain(0.42),
  note("[d3,f3,a3]").struct("x ~ x ~ x ~ x ~").clip(0.5).s("sawtooth").lpf(600).shape(0.25).gain(0.16).room(0.35)
)
let outroA = stack(
  s("bd*4").bank("RolandTR909").gain(0.55),
  note("a1 a1 a1 [a1 a1]").s("sawtooth").lpf(sine.range(600, 120).slow(8)).shape(0.5).gain(0.4),
  note("[a2,cs3,e3]").struct("x ~ x ~ x ~ x ~").clip(0.5).s("sawtooth").lpf(500).shape(0.25).gain(0.15).room(0.4)
)

// ---------- ARRANGEMENT : Dm - Bb - Gm - A (i - VI - iv - V) ----------
slowcat(
  introDm, introDm, introBb, introBb, introDm, introDm, introA, introA,
  mainDm, mainBb, mainGm, mainA,
  mainDm, mainBb, mainGm, mainA,
  mainDm, mainBb, mainGm, mainA,
  mainDm, mainBb, mainGm, mainA,
  breakDm, breakDm, breakBb, breakBb, breakGm, breakGm, breakA, breakA,
  bigDm, bigBb, bigGm, bigA,
  bigDm, bigBb, bigGm, bigA,
  bigDm, bigBb, bigGm, bigA,
  bigDm, bigBb, bigGm, bigA,
  mainDm, mainBb, mainGm, mainA,
  mainDm, mainBb, mainGm, mainA,
  outroDm, outroDm, outroA, outroA, outroDm, outroDm, outroDm, outroDm
)
