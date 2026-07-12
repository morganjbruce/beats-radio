// Midnight at Studio 54
// Classic Disco Revival · Late 1970s golden era, modern production clarity · Euphoric, celebratory, irresistibly groovy

// Genre: Classic Disco Revival
// Era: Late 1970s golden era, modern production clarity
// Mood: Euphoric, celebratory, irresistibly groovy
// Sounds: bd (kick), hh/oh (hi-hats), cp (clap), sawtooth bass, piano, sawtooth pad
// Sound choice: Four-on-the-floor kick and driving hi-hats create essential disco pulse, funky filtered sawtooth bass adds classic bounce, piano stabs and warm pads bring lush harmonic bed

setcps(0.52)

let drums = stack(
  s("bd bd bd bd").gain(0.7),
  s("~ hh ~ hh ~ hh ~ hh").gain(0.5),
  s("~ [~ oh] ~ [~ oh]").gain(0.4),
  s("~ cp ~ cp").gain(0.55)
)

let drumsLight = stack(
  s("bd bd bd bd").gain(0.6),
  s("~ hh ~ hh ~ hh ~ hh").gain(0.4)
)

let introAm = stack(
  drumsLight,
  note("a2 ~ a2 a3 ~ a2 a2 ~").s("sawtooth").lpf(400).gain(0.4)
)

let introDm = stack(
  drumsLight,
  note("d2 ~ d2 d3 ~ d2 d2 ~").s("sawtooth").lpf(400).gain(0.4)
)

let introG = stack(
  drumsLight,
  note("g2 ~ g2 g3 ~ g2 g2 ~").s("sawtooth").lpf(500).gain(0.4)
)

let introC = stack(
  drumsLight,
  note("c2 ~ c2 c3 ~ c2 c2 ~").s("sawtooth").lpf(500).gain(0.45)
)

let verseAm = stack(
  drums,
  note("a2 ~ a2 a3 ~ a2 a2 ~").s("sawtooth").lpf(600).gain(0.5),
  note("[a3,c4,e4] ~ ~ [a3,c4,e4] ~ [a3,c4,e4] ~ ~").s("piano").gain(0.4),
  note("[a3,c4,e4]").s("sawtooth").lpf(800).attack(0.1).release(0.5).gain(0.2).room(0.3)
)

let verseDm = stack(
  drums,
  note("d2 ~ d2 d3 ~ d2 d2 ~").s("sawtooth").lpf(600).gain(0.5),
  note("[d3,f3,a3] ~ ~ [d3,f3,a3] ~ [d3,f3,a3] ~ ~").s("piano").gain(0.4),
  note("[d3,f3,a3]").s("sawtooth").lpf(800).attack(0.1).release(0.5).gain(0.2).room(0.3)
)

let verseG = stack(
  drums,
  note("g2 ~ g2 g3 ~ g2 g2 ~").s("sawtooth").lpf(600).gain(0.5),
  note("[g3,b3,d4] ~ ~ [g3,b3,d4] ~ [g3,b3,d4] ~ ~").s("piano").gain(0.4),
  note("[g3,b3,d4]").s("sawtooth").lpf(800).attack(0.1).release(0.5).gain(0.2).room(0.3)
)

let verseC = stack(
  drums,
  note("c2 ~ c2 c3 ~ c2 c2 ~").s("sawtooth").lpf(600).gain(0.5),
  note("[c3,e3,g3] ~ ~ [c3,e3,g3] ~ [c3,e3,g3] ~ ~").s("piano").gain(0.4),
  note("[c3,e3,g3]").s("sawtooth").lpf(800).attack(0.1).release(0.5).gain(0.2).room(0.3)
)

let chorusAm = stack(
  drums,
  note("a2 ~ a2 a3 ~ a2 a2 ~").s("sawtooth").lpf(700).gain(0.5),
  note("[a3,c4,e4] ~ ~ [a3,c4,e4] ~ [a3,c4,e4] ~ ~").s("piano").gain(0.45),
  note("[a3,c4,e4]").s("sawtooth").lpf(1000).attack(0.05).release(0.4).gain(0.25).room(0.35),
  note("a4 ~ c5 a4 ~ ~ e4 ~").s("sawtooth").lpf(2000).gain(0.35).room(0.3)
)

let chorusDm = stack(
  drums,
  note("d2 ~ d2 d3 ~ d2 d2 ~").s("sawtooth").lpf(700).gain(0.5),
  note("[d3,f3,a3] ~ ~ [d3,f3,a3] ~ [d3,f3,a3] ~ ~").s("piano").gain(0.45),
  note("[d3,f3,a3]").s("sawtooth").lpf(1000).attack(0.05).release(0.4).gain(0.25).room(0.35),
  note("d4 ~ f4 a4 ~ ~ d5 ~").s("sawtooth").lpf(2000).gain(0.35).room(0.3)
)

let chorusG = stack(
  drums,
  note("g2 ~ g2 g3 ~ g2 g2 ~").s("sawtooth").lpf(700).gain(0.5),
  note("[g3,b3,d4] ~ ~ [g3,b3,d4] ~ [g3,b3,d4] ~ ~").s("piano").gain(0.45),
  note("[g3,b3,d4]").s("sawtooth").lpf(1000).attack(0.05).release(0.4).gain(0.25).room(0.35),
  note("b4 ~ d5 b4 ~ ~ g4 ~").s("sawtooth").lpf(2000).gain(0.35).room(0.3)
)

let chorusC = stack(
  drums,
  note("c2 ~ c2 c3 ~ c2 c2 ~").s("sawtooth").lpf(700).gain(0.5),
  note("[c3,e3,g3] ~ ~ [c3,e3,g3] ~ [c3,e3,g3] ~ ~").s("piano").gain(0.45),
  note("[c3,e3,g3]").s("sawtooth").lpf(1000).attack(0.05).release(0.4).gain(0.25).room(0.35),
  note("c5 ~ e5 c5 ~ ~ g4 ~").s("sawtooth").lpf(2000).gain(0.35).room(0.3)
)

let bridgeAm = stack(
  s("bd ~ ~ ~ bd ~ ~ ~").gain(0.5),
  s("~ ~ ~ hh ~ ~ ~ hh").gain(0.35),
  note("[a3,c4,e4]").s("sawtooth").lpf(600).attack(0.2).release(0.8).gain(0.25).room(0.5)
)

let bridgeDm = stack(
  s("bd ~ ~ ~ bd ~ ~ ~").gain(0.5),
  s("~ ~ ~ hh ~ ~ ~ hh").gain(0.35),
  note("[d3,f3,a3]").s("sawtooth").lpf(600).attack(0.2).release(0.8).gain(0.25).room(0.5)
)

let bridgeG = stack(
  s("bd ~ bd ~ bd ~ bd ~").gain(0.55),
  s("~ hh ~ hh ~ hh ~ hh").gain(0.4),
  note("[g3,b3,d4]").s("sawtooth").lpf(700).attack(0.15).release(0.6).gain(0.28).room(0.45)
)

let bridgeC = stack(
  s("bd ~ bd ~ bd ~ bd ~").gain(0.6),
  s("~ hh ~ hh ~ hh ~ hh").gain(0.45),
  s("~ ~ ~ ~ ~ ~ ~ cp").gain(0.5),
  note("[c3,e3,g3]").s("sawtooth").lpf(800).attack(0.1).release(0.5).gain(0.3).room(0.4)
)

let outroAm = stack(
  drums,
  note("a2 ~ a2 a3 ~ a2 a2 ~").s("sawtooth").lpf(500).gain(0.4),
  note("[a3,c4,e4] ~ ~ [a3,c4,e4] ~ [a3,c4,e4] ~ ~").s("piano").gain(0.35)
)

let outroDm = stack(
  drums,
  note("d2 ~ d2 d3 ~ d2 d2 ~").s("sawtooth").lpf(500).gain(0.4),
  note("[d3,f3,a3] ~ ~ [d3,f3,a3] ~ [d3,f3,a3] ~ ~").s("piano").gain(0.35)
)

slowcat(
  introAm, introAm, introDm, introDm, introG, introG, introC, introC,
  verseAm, verseAm, verseDm, verseDm, verseG, verseG, verseC, verseC,
  chorusAm, chorusAm, chorusDm, chorusDm, chorusG, chorusG, chorusC, chorusC,
  verseAm, verseAm, verseDm, verseDm, verseG, verseG, verseC, verseC,
  chorusAm, chorusAm, chorusDm, chorusDm, chorusG, chorusG, chorusC, chorusC,
  bridgeAm, bridgeAm, bridgeDm, bridgeDm, bridgeG, bridgeG, bridgeC, bridgeC,
  chorusAm, chorusAm, chorusDm, chorusDm, chorusG, chorusG, chorusC, chorusC,
  chorusAm, chorusAm, chorusDm, chorusDm, chorusG, chorusG, chorusC, chorusC,
  outroAm, outroAm, outroDm, outroDm, outroAm, outroAm, outroDm, outroDm
)
