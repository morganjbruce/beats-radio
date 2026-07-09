// Genre: Bedroom Pop Daydream
// Era: 2020s lo-fi bedroom producer
// Mood: Wistful, warm, nostalgic
// A gentle progression with piano chords and soft beats

setcps(90/60/4)

// CORRECT APPROACH: Each chord section gets its own variable

let introC = stack(
  s("shaker*4").gain(0.2),
  note("c3").s("sine").gain(0.4).lpf(200),
  note("c4 e4 g4 c5").s("piano").gain(0.5).room(0.7)
)

let verseC = stack(
  s("bd ~ ~ bd, ~ sd ~ sd").gain(0.6),
  s("hh*8").gain(0.3),
  note("c3").s("sine").gain(0.5).lpf(200),
  note("c4 e4 g4 c5 g4 e4 c4 e4").s("piano").gain(0.4).room(0.6)
)

let verseG = stack(
  s("bd ~ ~ bd, ~ sd ~ sd").gain(0.6),
  s("hh*8").gain(0.3),
  note("g2").s("sine").gain(0.5).lpf(200),
  note("g3 b3 d4 g4 d4 b3 g3 b3").s("piano").gain(0.4).room(0.6)
)

let verseAm = stack(
  s("bd ~ ~ bd, ~ sd ~ sd").gain(0.6),
  s("hh*8").gain(0.3),
  note("a2").s("sine").gain(0.5).lpf(200),
  note("a3 c4 e4 a4 e4 c4 a3 c4").s("piano").gain(0.4).room(0.6)
)

let verseF = stack(
  s("bd ~ ~ bd, ~ sd ~ sd").gain(0.6),
  s("hh*8").gain(0.3),
  note("f2").s("sine").gain(0.5).lpf(200),
  note("f3 a3 c4 f4 c4 a3 f3 a3").s("piano").gain(0.4).room(0.6)
)

let chorusC = stack(
  s("bd bd ~ bd, ~ [sd sd] ~ sd").gain(0.7),
  s("hh*16").gain(0.35),
  s("oh ~ ~ oh ~ ~ oh ~").gain(0.3),
  note("c3").s("sine").gain(0.6).lpf(200),
  note("c4 e4 g4 c5 e5 c5 g4 e4").s("piano").gain(0.5).room(0.5),
  note("c5 ~ e5 ~ g5 ~ c6 ~").s("rhodes").gain(0.3).room(0.7)
)

let chorusF = stack(
  s("bd bd ~ bd, ~ [sd sd] ~ sd").gain(0.7),
  s("hh*16").gain(0.35),
  s("oh ~ ~ oh ~ ~ oh ~").gain(0.3),
  note("f2").s("sine").gain(0.6).lpf(200),
  note("f3 a3 c4 f4 a4 f4 c4 a3").s("piano").gain(0.5).room(0.5),
  note("f4 ~ a4 ~ c5 ~ f5 ~").s("rhodes").gain(0.3).room(0.7)
)

let chorusG = stack(
  s("bd bd ~ bd, ~ [sd sd] ~ sd").gain(0.7),
  s("hh*16").gain(0.35),
  s("oh ~ ~ oh ~ ~ oh ~").gain(0.3),
  note("g2").s("sine").gain(0.6).lpf(200),
  note("g3 b3 d4 g4 b4 g4 d4 b3").s("piano").gain(0.5).room(0.5),
  note("g4 ~ b4 ~ d5 ~ g5 ~").s("rhodes").gain(0.3).room(0.7)
)

let chorusAm = stack(
  s("bd bd ~ bd, ~ [sd sd] ~ sd").gain(0.7),
  s("hh*16").gain(0.35),
  s("oh ~ ~ oh ~ ~ oh ~").gain(0.3),
  note("a2").s("sine").gain(0.6).lpf(200),
  note("a3 c4 e4 a4 c5 a4 e4 c4").s("piano").gain(0.5).room(0.5),
  note("a4 ~ c5 ~ e5 ~ a5 ~").s("rhodes").gain(0.3).room(0.7)
)

let outro = stack(
  s("shaker*2").gain(0.15),
  note("c3").s("sine").gain(0.3).lpf(300).room(0.8),
  note("c5 g4 e4 c4 ~ ~ ~ ~").s("piano").gain(0.4).room(0.9)
)

// Now arrange them - each variable name indicates what chord it plays
slowcat(
  introC, introC,
  verseC, verseG, verseAm, verseF,
  verseC, verseG, verseAm, verseF,
  chorusC, chorusF, chorusG, chorusAm,
  chorusC, chorusF, chorusG, chorusAm,
  verseC, verseG, verseAm, verseF,
  chorusC, chorusF, chorusG, chorusAm,
  outro, outro
)
