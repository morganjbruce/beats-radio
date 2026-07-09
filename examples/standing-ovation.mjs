// Genre: Standing ovation at golden hour
// Era: Contemporary cinematic indie
// Mood: Warm pride, bittersweet joy, supportive tenderness
// Sounds: piano, sawtooth pad, triangle bass, bd/sd/shaker, sine bells
// Sound choice: Organic warmth with gentle swells, like watching someone you love shine

setcps(0.375)

// G major: G - D - Em - C (uplifting, familiar, heartfelt)

// INTRO - piano and pad only, setting the scene
let introG = stack(
  note("g3 ~ a3 b3 ~ ~ d4 ~").s("piano").gain(0.42).room(0.55).velocity(0.55),
  note("[g2,b2,d3]").s("sawtooth").lpf(700).gain(0.22).room(0.6).attack(0.35)
)
let introD = stack(
  note("~ d4 ~ a3 b3 ~ ~ ~").s("piano").gain(0.42).room(0.55).velocity(0.55),
  note("[d2,fs2,a2]").s("sawtooth").lpf(700).gain(0.22).room(0.6).attack(0.35)
)
let introEm = stack(
  note("e3 ~ g3 ~ b3 ~ a3 ~").s("piano").gain(0.42).room(0.55).velocity(0.55),
  note("[e2,g2,b2]").s("sawtooth").lpf(700).gain(0.22).room(0.6).attack(0.35)
)
let introC = stack(
  note("c4 ~ b3 ~ a3 ~ g3 ~").s("piano").gain(0.42).room(0.55).velocity(0.55),
  note("[c2,e2,g2]").s("sawtooth").lpf(700).gain(0.22).room(0.6).attack(0.35)
)

// VERSE - watching quietly, supportive
let verseG = stack(
  note("g3 ~ a3 b3 ~ d4 b3 ~").s("piano").gain(0.45).room(0.5),
  note("[g2,b2,d3]").s("sawtooth").lpf(900).gain(0.26).room(0.5).attack(0.25),
  note("g2 ~ ~ ~ g2 ~ ~ ~").s("triangle").lpf(180).gain(0.38),
  s("bd ~ ~ ~ bd ~ ~ ~").gain(0.48),
  s("~ ~ sd:1 ~ ~ ~ sd:1 ~").gain(0.35).room(0.3),
  s("shaker*8").gain(0.12)
)
let verseD = stack(
  note("~ d4 ~ a3 b3 a3 ~ ~").s("piano").gain(0.45).room(0.5),
  note("[d2,fs2,a2]").s("sawtooth").lpf(900).gain(0.26).room(0.5).attack(0.25),
  note("d2 ~ ~ ~ d2 ~ ~ ~").s("triangle").lpf(180).gain(0.38),
  s("bd ~ ~ ~ bd ~ ~ ~").gain(0.48),
  s("~ ~ sd:1 ~ ~ ~ sd:1 ~").gain(0.35).room(0.3),
  s("shaker*8").gain(0.12)
)
let verseEm = stack(
  note("e3 ~ g3 ~ b3 a3 g3 ~").s("piano").gain(0.45).room(0.5),
  note("[e2,g2,b2]").s("sawtooth").lpf(900).gain(0.26).room(0.5).attack(0.25),
  note("e2 ~ ~ ~ e2 ~ ~ ~").s("triangle").lpf(180).gain(0.38),
  s("bd ~ ~ ~ bd ~ ~ ~").gain(0.48),
  s("~ ~ sd:1 ~ ~ ~ sd:1 ~").gain(0.35).room(0.3),
  s("shaker*8").gain(0.12)
)
let verseC = stack(
  note("c4 ~ b3 a3 g3 ~ ~ ~").s("piano").gain(0.45).room(0.5),
  note("[c2,e2,g2]").s("sawtooth").lpf(900).gain(0.26).room(0.5).attack(0.25),
  note("c2 ~ ~ ~ c2 ~ ~ ~").s("triangle").lpf(180).gain(0.38),
  s("bd ~ ~ ~ bd ~ ~ ~").gain(0.48),
  s("~ ~ sd:1 ~ ~ ~ sd:1 ~").gain(0.35).room(0.3),
  s("shaker*8").gain(0.12)
)

// CHORUS - heart swelling, they're shining
let chorusG = stack(
  note("d4 ~ e4 g4 ~ ~ b4 a4").s("piano").gain(0.5).room(0.55),
  note("[g2,b2,d3,g3]").s("sawtooth").lpf(1300).gain(0.3).room(0.5).attack(0.15),
  note("g2 ~ g2 ~ g2 ~ ~ ~").s("triangle").lpf(220).gain(0.42),
  note("~ ~ ~ ~ d5 ~ ~ ~").s("sine").gain(0.18).room(0.7),
  s("bd ~ bd ~ bd ~ ~ ~").gain(0.52),
  s("~ ~ sd:1 ~ ~ ~ sd:1 ~").gain(0.42).room(0.3),
  s("shaker*8").gain(0.15)
)
let chorusD = stack(
  note("~ d5 ~ b4 a4 ~ g4 ~").s("piano").gain(0.5).room(0.55),
  note("[d2,fs2,a2,d3]").s("sawtooth").lpf(1300).gain(0.3).room(0.5).attack(0.15),
  note("d2 ~ d2 ~ d2 ~ ~ ~").s("triangle").lpf(220).gain(0.42),
  note("~ ~ ~ ~ a4 ~ ~ ~").s("sine").gain(0.18).room(0.7),
  s("bd ~ bd ~ bd ~ ~ ~").gain(0.52),
  s("~ ~ sd:1 ~ ~ ~ sd:1 ~").gain(0.42).room(0.3),
  s("shaker*8").gain(0.15)
)
let chorusEm = stack(
  note("e4 ~ g4 ~ b4 ~ a4 g4").s("piano").gain(0.5).room(0.55),
  note("[e2,g2,b2,e3]").s("sawtooth").lpf(1300).gain(0.3).room(0.5).attack(0.15),
  note("e2 ~ e2 ~ e2 ~ ~ ~").s("triangle").lpf(220).gain(0.42),
  note("~ ~ ~ ~ b4 ~ ~ ~").s("sine").gain(0.18).room(0.7),
  s("bd ~ bd ~ bd ~ ~ ~").gain(0.52),
  s("~ ~ sd:1 ~ ~ ~ sd:1 ~").gain(0.42).room(0.3),
  s("shaker*8").gain(0.15)
)
let chorusC = stack(
  note("c5 ~ b4 g4 e4 ~ d4 ~").s("piano").gain(0.5).room(0.55),
  note("[c2,e2,g2,c3]").s("sawtooth").lpf(1300).gain(0.3).room(0.5).attack(0.15),
  note("c2 ~ c2 ~ c2 ~ ~ ~").s("triangle").lpf(220).gain(0.42),
  note("~ ~ ~ ~ g4 ~ ~ ~").s("sine").gain(0.18).room(0.7),
  s("bd ~ bd ~ bd ~ ~ ~").gain(0.52),
  s("~ ~ sd:1 ~ ~ ~ sd:1 ~").gain(0.42).room(0.3),
  s("shaker*8").gain(0.15)
)

// BRIDGE - stripped down, emotional peak, just watching in awe
let bridgeG = stack(
  note("b3 ~ d4 ~ g4 ~ ~ ~").s("piano").gain(0.48).room(0.7).velocity(0.65),
  note("[g2,b2,d3,g3]").s("sawtooth").lpf(550).gain(0.32).room(0.7).attack(0.45)
)
let bridgeC = stack(
  note("e4 ~ g4 ~ c5 ~ ~ ~").s("piano").gain(0.48).room(0.7).velocity(0.65),
  note("[c2,e2,g2,c3]").s("sawtooth").lpf(550).gain(0.32).room(0.7).attack(0.45)
)

// OUTRO - letting go with love
let outroG = stack(
  note("g3 ~ b3 ~ d4 ~ ~ ~").s("piano").gain(0.38).room(0.75).velocity(0.45),
  note("[g2,b2,d3]").s("sawtooth").lpf(450).gain(0.18).room(0.7).attack(0.5)
)
let outroD = stack(
  note("d4 ~ a3 ~ ~ ~ ~ ~").s("piano").gain(0.32).room(0.8).velocity(0.35),
  note("[d2,fs2,a2]").s("sawtooth").lpf(350).gain(0.14).room(0.7).attack(0.55)
)
let outroFinal = stack(
  note("g3 ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.28).room(0.9).velocity(0.3),
  note("[g2,b2,d3,g3]").s("sawtooth").lpf(280).gain(0.1).room(0.8).attack(0.6).release(1.5)
)

slowcat(
  introG, introD, introEm, introC, introG, introD, introEm, introC,
  verseG, verseD, verseEm, verseC, verseG, verseD, verseEm, verseC,
  chorusG, chorusD, chorusEm, chorusC, chorusG, chorusD, chorusEm, chorusC,
  verseG, verseD, verseEm, verseC, verseG, verseD, verseEm, verseC,
  chorusG, chorusD, chorusEm, chorusC, chorusG, chorusD, chorusEm, chorusC,
  bridgeG, bridgeG, bridgeC, bridgeC, bridgeG, bridgeG, bridgeC, bridgeC,
  chorusG, chorusD, chorusEm, chorusC, chorusG, chorusD, chorusEm, chorusC,
  outroG, outroG, outroD, outroD, outroG, outroG, outroD, outroFinal
)