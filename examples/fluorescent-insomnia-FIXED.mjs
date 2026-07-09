// Genre: Fluorescent Insomnia Funk
// Era: Eternal late-shift liminal space
// Mood: Hypnotic, lonely, strangely hopeful
// The hum of a hospital vending machine at 3:47 AM, when time stops and the flickering lights seem to pulse with a secret rhythm only the sleepless can hear.

setcps(0.4)

let introHum = stack(
  note("c1").s("sine").gain(0.3).lpf(200),
  s("noise").gain(0.02).lpf(800).room(0.8),
  s("hh*8").gain(0.05).pan(sine.range(0.3, 0.7))
)

let introFlicker = stack(
  note("c1").s("sine").gain(0.3).lpf(200),
  s("noise").gain(0.03).lpf(900).room(0.8),
  note("c5 ~ ~ e5 ~ ~ g5 ~").s("casio").gain(0.15).room(0.7).lpf(2000),
  s("rim*4").gain(0.08)
)

let verseC = stack(
  s("bd ~ ~ bd ~ bd ~ ~").gain(0.7),
  s("sd:3").struct("~ ~ ~ x").gain(0.4).room(0.5),
  s("hh*8").gain(0.12).pan(sine.range(0.2, 0.8)),
  note("c2").s("sine").gain(0.5).lpf(300),
  note("c4 ~ e4 ~ g4 ~ e4 ~").s("piano").gain(0.25).room(0.6).lpf(1500),
  s("noise").gain(0.015).lpf(600)
)

let verseEm = stack(
  s("bd ~ ~ bd ~ bd ~ ~").gain(0.7),
  s("sd:3").struct("~ ~ ~ x").gain(0.4).room(0.5),
  s("hh*8").gain(0.12).pan(sine.range(0.2, 0.8)),
  note("e2").s("sine").gain(0.5).lpf(300),
  note("e4 ~ g4 ~ b4 ~ g4 ~").s("piano").gain(0.25).room(0.6).lpf(1500),
  s("noise").gain(0.015).lpf(600)
)

let verseAm = stack(
  s("bd ~ ~ bd ~ bd ~ ~").gain(0.7),
  s("sd:3").struct("~ ~ ~ x").gain(0.4).room(0.5),
  s("hh*8").gain(0.12).pan(sine.range(0.2, 0.8)),
  note("a1").s("sine").gain(0.5).lpf(300),
  note("a3 ~ c4 ~ e4 ~ c4 ~").s("piano").gain(0.25).room(0.6).lpf(1500),
  s("noise").gain(0.015).lpf(600)
)

let verseG = stack(
  s("bd ~ ~ bd ~ bd ~ ~").gain(0.7),
  s("sd:3").struct("~ ~ ~ x").gain(0.4).room(0.5),
  s("hh*8").gain(0.12).pan(sine.range(0.2, 0.8)),
  note("g1").s("sine").gain(0.5).lpf(300),
  note("g3 ~ b3 ~ d4 ~ b3 ~").s("piano").gain(0.25).room(0.6).lpf(1500),
  s("noise").gain(0.015).lpf(600)
)

let chorusC = stack(
  s("bd ~ bd ~ bd ~ bd ~").gain(0.8),
  s("sd:3").struct("~ x ~ x").gain(0.5).room(0.4),
  s("hh*16").gain(0.15).pan(sine.range(0.1, 0.9)),
  s("oh").struct("~ ~ x ~").gain(0.2),
  note("c2").s("sine").gain(0.6).lpf(400).shape(0.3),
  note("c4 e4 g4 c5 g4 e4 c4 e4").s("piano").gain(0.35).room(0.5),
  note("c6 ~ ~ g5 ~ ~ e5 ~").s("casio").gain(0.2).room(0.7).lpf(3000)
)

let chorusG = stack(
  s("bd ~ bd ~ bd ~ bd ~").gain(0.8),
  s("sd:3").struct("~ x ~ x").gain(0.5).room(0.4),
  s("hh*16").gain(0.15).pan(sine.range(0.1, 0.9)),
  s("oh").struct("~ ~ x ~").gain(0.2),
  note("g1").s("sine").gain(0.6).lpf(400).shape(0.3),
  note("g3 b3 d4 g4 d4 b3 g3 b3").s("piano").gain(0.35).room(0.5),
  note("g5 ~ ~ d5 ~ ~ b4 ~").s("casio").gain(0.2).room(0.7).lpf(3000)
)

let chorusAm = stack(
  s("bd ~ bd ~ bd ~ bd ~").gain(0.8),
  s("sd:3").struct("~ x ~ x").gain(0.5).room(0.4),
  s("hh*16").gain(0.15).pan(sine.range(0.1, 0.9)),
  s("oh").struct("~ ~ x ~").gain(0.2),
  note("a1").s("sine").gain(0.6).lpf(400).shape(0.3),
  note("a3 c4 e4 a4 e4 c4 a3 c4").s("piano").gain(0.35).room(0.5),
  note("a5 ~ ~ e5 ~ ~ c5 ~").s("casio").gain(0.2).room(0.7).lpf(3000)
)

let chorusF = stack(
  s("bd ~ bd ~ bd ~ bd ~").gain(0.8),
  s("sd:3").struct("~ x ~ x").gain(0.5).room(0.4),
  s("hh*16").gain(0.15).pan(sine.range(0.1, 0.9)),
  s("oh").struct("~ ~ x ~").gain(0.2),
  note("f1").s("sine").gain(0.6).lpf(400).shape(0.3),
  note("f3 a3 c4 f4 c4 a3 f3 a3").s("piano").gain(0.35).room(0.5),
  note("f5 ~ ~ c5 ~ ~ a4 ~").s("casio").gain(0.2).room(0.7).lpf(3000)
)

let bridgeDm = stack(
  s("bd ~ ~ ~ bd ~ ~ ~").gain(0.5),
  s("rim*4").gain(0.1),
  note("d2").s("sine").gain(0.4).lpf(250),
  note("d4 ~ f4 ~ a4 ~ f4 ~").s("piano").gain(0.3).room(0.8).lpf(1200),
  s("noise").gain(0.025).lpf(500).room(0.9)
)

let bridgeEm = stack(
  s("bd ~ ~ ~ bd ~ ~ ~").gain(0.5),
  s("rim*4").gain(0.1),
  note("e2").s("sine").gain(0.4).lpf(250),
  note("e4 ~ g4 ~ b4 ~ g4 ~").s("piano").gain(0.3).room(0.8).lpf(1200),
  s("noise").gain(0.025).lpf(500).room(0.9)
)

let outro = stack(
  note("c1").s("sine").gain(0.25).lpf(150),
  note("c4 ~ ~ e4 ~ ~ g4 ~").s("piano").gain(0.15).room(0.9).lpf(1000),
  s("noise").gain(0.02).lpf(400).room(0.9)
)

slowcat(
  introHum, introHum, introFlicker, introFlicker,
  verseC, verseEm, verseAm, verseG,
  chorusC, chorusG, chorusAm, chorusF,
  verseC, verseEm, verseAm, verseG,
  chorusC, chorusG, chorusAm, chorusF,
  bridgeDm, bridgeDm, bridgeEm, bridgeEm,
  chorusC, chorusG, chorusAm, chorusF,
  outro, outro
)
