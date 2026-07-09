// Genre: Refrigerator Box Kingdom Synth
// Era: 1994 suburban Saturday afternoon
// Mood: Heroic, imaginative, slightly cramped
// The epic soundtrack playing in your head while defending your cardboard castle

setcps(110/60/4)

let intro = stack(
  note("c4 e4 g4 c5").s("piano").gain(0.4).room(0.8).lpf(800),
  s("shaker*4").gain(0.2)
)

// Create separate verse sections for each chord
let verseC = stack(
  s("bd [~ bd] ~ bd, ~ sd ~ sd").gain(0.7).lpf(2000).room(0.3),
  s("hh*8").gain(0.3).lpf(3000),
  note("c3").s("sine").gain(0.5).lpf(200),
  note("c4 e4 g4 e4 c5 g4 e4 c4").s("piano").gain(0.4).room(0.6).lpf(1500),
  note("c5 ~ e5 ~ g5 ~ e5 ~").s("casio").gain(0.25).room(0.7).lpf(2500)
)

let verseG = stack(
  s("bd [~ bd] ~ bd, ~ sd ~ sd").gain(0.7).lpf(2000).room(0.3),
  s("hh*8").gain(0.3).lpf(3000),
  note("g2").s("sine").gain(0.5).lpf(200),
  note("g3 b3 d4 b3 g4 d4 b3 g3").s("piano").gain(0.4).room(0.6).lpf(1500),
  note("g4 ~ b4 ~ d5 ~ b4 ~").s("casio").gain(0.25).room(0.7).lpf(2500)
)

let verseAm = stack(
  s("bd [~ bd] ~ bd, ~ sd ~ sd").gain(0.7).lpf(2000).room(0.3),
  s("hh*8").gain(0.3).lpf(3000),
  note("a2").s("sine").gain(0.5).lpf(200),
  note("a3 c4 e4 c4 a4 e4 c4 a3").s("piano").gain(0.4).room(0.6).lpf(1500),
  note("a4 ~ c5 ~ e5 ~ c5 ~").s("casio").gain(0.25).room(0.7).lpf(2500)
)

let verseF = stack(
  s("bd [~ bd] ~ bd, ~ sd ~ sd").gain(0.7).lpf(2000).room(0.3),
  s("hh*8").gain(0.3).lpf(3000),
  note("f2").s("sine").gain(0.5).lpf(200),
  note("f3 a3 c4 a3 f4 c4 a3 f3").s("piano").gain(0.4).room(0.6).lpf(1500),
  note("f4 ~ a4 ~ c5 ~ a4 ~").s("casio").gain(0.25).room(0.7).lpf(2500)
)

// Create separate chorus sections for each chord
let chorusC = stack(
  s("bd bd ~ bd, ~ [sd sd] ~ sd").gain(0.8).shape(0.3),
  s("hh*16").gain(0.35).lpf(4000),
  s("oh ~ ~ oh ~ ~ oh ~").gain(0.3).room(0.5),
  note("c3").s("sine").gain(0.6).lpf(200),
  note("c4 e4 g4 c5 e5 c5 g4 e4").s("piano").gain(0.55).room(0.5),
  note("c5 e5 g5 c6 e6 c6 g5 e5").s("sawtooth").gain(0.3).lpf(1800).room(0.6),
  note("c6 ~ e6 ~ g6 ~ c6 ~").s("casio").gain(0.2).room(0.8).lpf(3000)
)

let chorusF = stack(
  s("bd bd ~ bd, ~ [sd sd] ~ sd").gain(0.8).shape(0.3),
  s("hh*16").gain(0.35).lpf(4000),
  s("oh ~ ~ oh ~ ~ oh ~").gain(0.3).room(0.5),
  note("f2").s("sine").gain(0.6).lpf(200),
  note("f3 a3 c4 f4 a4 f4 c4 a3").s("piano").gain(0.55).room(0.5),
  note("f4 a4 c5 f5 a5 f5 c5 a4").s("sawtooth").gain(0.3).lpf(1800).room(0.6),
  note("f5 ~ a5 ~ c6 ~ f5 ~").s("casio").gain(0.2).room(0.8).lpf(3000)
)

let chorusG = stack(
  s("bd bd ~ bd, ~ [sd sd] ~ sd").gain(0.8).shape(0.3),
  s("hh*16").gain(0.35).lpf(4000),
  s("oh ~ ~ oh ~ ~ oh ~").gain(0.3).room(0.5),
  note("g2").s("sine").gain(0.6).lpf(200),
  note("g3 b3 d4 g4 b4 g4 d4 b3").s("piano").gain(0.55).room(0.5),
  note("g4 b4 d5 g5 b5 g5 d5 b4").s("sawtooth").gain(0.3).lpf(1800).room(0.6),
  note("g5 ~ b5 ~ d6 ~ g5 ~").s("casio").gain(0.2).room(0.8).lpf(3000)
)

let chorusC2 = stack(
  s("bd bd ~ bd, ~ [sd sd] ~ sd").gain(0.8).shape(0.3),
  s("hh*16").gain(0.35).lpf(4000),
  s("oh ~ ~ oh ~ ~ oh ~").gain(0.3).room(0.5),
  note("c3").s("sine").gain(0.6).lpf(200),
  note("c4 e4 g4 c5 e5 c5 g4 e4").s("piano").gain(0.55).room(0.5),
  note("c5 e5 g5 c6 e6 c6 g5 e5").s("sawtooth").gain(0.3).lpf(1800).room(0.6),
  note("c6 ~ e6 ~ g6 ~ c6 ~").s("casio").gain(0.2).room(0.8).lpf(3000)
)

// Create separate bridge sections
let bridgeAm = stack(
  s("bd ~ ~ ~, ~ sd ~ ~").gain(0.5).room(0.7),
  s("shaker*4").gain(0.3),
  note("a2").s("sine").gain(0.45).lpf(200),
  note("a3 c4 e4 a4 c5 a4 e4 c4").s("piano").gain(0.4).room(0.7).lpf(1200)
)

let bridgeEm = stack(
  s("bd ~ ~ ~, ~ sd ~ ~").gain(0.5).room(0.7),
  s("shaker*4").gain(0.3),
  note("e2").s("sine").gain(0.45).lpf(200),
  note("e3 g3 b3 e4 g4 e4 b3 g3").s("piano").gain(0.4).room(0.7).lpf(1200)
)

let bridgeF = stack(
  s("bd ~ ~ ~, ~ sd ~ ~").gain(0.5).room(0.7),
  s("shaker*4").gain(0.3),
  note("f2").s("sine").gain(0.45).lpf(200),
  note("f3 a3 c4 f4 a4 f4 c4 a3").s("piano").gain(0.4).room(0.7).lpf(1200)
)

let bridgeG = stack(
  s("bd ~ ~ ~, ~ sd ~ ~").gain(0.5).room(0.7),
  s("shaker*4").gain(0.3),
  note("g2").s("sine").gain(0.45).lpf(200),
  note("g3 b3 d4 g4 b4 g4 d4 b3").s("piano").gain(0.4).room(0.7).lpf(1200)
)

let fill = stack(
  s("bd sd bd [sd sd sd sd]").gain(0.8).room(0.3),
  s("oh oh crash ~").gain(0.4).room(0.6),
  note("c4 e4 g4 c5").s("piano").gain(0.5).room(0.5)
)

let outro = stack(
  note("c5 g4 e4 c4 ~ ~ ~ ~").s("piano").gain(0.35).room(0.9).lpf(600),
  s("shaker*2").gain(0.15),
  note("c3").s("sine").gain(0.3).lpf(300).room(0.8)
)

slowcat(
  intro, intro,
  verseC, verseG, verseAm, verseF,
  fill,
  chorusC, chorusF, chorusG, chorusC2,
  verseC, verseG, verseAm, verseF,
  fill,
  chorusC, chorusF, chorusG, chorusC2,
  bridgeAm, bridgeEm, bridgeF, bridgeG,
  fill,
  chorusC, chorusF, chorusG, chorusC2,
  outro, outro
)
