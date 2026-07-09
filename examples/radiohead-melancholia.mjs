// Genre: Art Rock / Electronic Melancholia
// Era: Late 90s-2000s Alternative
// Mood: Technological alienation, beautiful unease
// Sounds: steinway piano, triangle bass, sawtooth pad, 808 drums, filtered noise
// Sound choice: Piano warmth vs synthetic coldness - the Radiohead tension

setcps(0.42)

// Base patterns - chord progression plays within each 4-cycle section
let noiseTexture = s("noise").lpf(sine.range(200, 900).slow(16)).gain(0.05).room(0.9)

// Drums
let drumsMinimal = stack(
  s("bd:1 ~ ~ ~ sd:1 ~ bd:1 ~ ~ ~ sd:1 ~ ~ bd:1 ~ ~").bank("RolandTR808").gain(0.5),
  s("~ hh*4 ~ hh*4 ~ hh*4 ~ hh*4").bank("RolandTR808").lpf(4500).gain(0.2)
)

let drumsFull = stack(
  s("bd:1 ~ ~ bd:1 sd:1 ~ bd:1 ~ ~ bd:1 sd:1 ~ ~ bd:1 ~ sd:1").bank("RolandTR808").gain(0.6),
  s("hh*8").bank("RolandTR808").lpf(5500).gain(0.28).sometimes(x => x.gain(0.12))
)

// Define each chord as separate section - this is the only reliable way
let introA = stack(
  note("[a3,c4,e4]").s("steinway").gain(0.35).room(0.7).velocity(0.5),
  noiseTexture
)
let introC = stack(
  note("[c3,e3,g3,b3]").s("steinway").gain(0.35).room(0.7).velocity(0.5),
  noiseTexture
)
let introF = stack(
  note("[f3,a3,c4,e4]").s("steinway").gain(0.35).room(0.7).velocity(0.5),
  noiseTexture
)
let introE = stack(
  note("[e3,g#3,b3]").s("steinway").gain(0.35).room(0.7).velocity(0.5),
  noiseTexture
)

let verseA = stack(
  note("[a3,c4,e4]").s("steinway").gain(0.4).room(0.6).velocity(0.6),
  note("a2").s("triangle").lpf(150).gain(0.45),
  drumsMinimal,
  noiseTexture
)
let verseC = stack(
  note("[c3,e3,g3,b3]").s("steinway").gain(0.4).room(0.6).velocity(0.6),
  note("c3").s("triangle").lpf(150).gain(0.45),
  drumsMinimal,
  noiseTexture
)
let verseF = stack(
  note("[f3,a3,c4,e4]").s("steinway").gain(0.4).room(0.6).velocity(0.6),
  note("f2").s("triangle").lpf(150).gain(0.45),
  drumsMinimal,
  noiseTexture
)
let verseE = stack(
  note("[e3,g#3,b3]").s("steinway").gain(0.4).room(0.6).velocity(0.6),
  note("e2").s("triangle").lpf(150).gain(0.45),
  drumsMinimal,
  noiseTexture
)

let verseMelA = stack(
  note("[a3,c4,e4]").s("steinway").gain(0.4).room(0.6).velocity(0.6),
  note("a2").s("triangle").lpf(180).gain(0.5),
  note("a4 ~ ~ a4 c5 ~ a4 ~").s("steinway").gain(0.35).room(0.55).velocity(0.5),
  drumsMinimal,
  noiseTexture
)
let verseMelC = stack(
  note("[c3,e3,g3,b3]").s("steinway").gain(0.4).room(0.6).velocity(0.6),
  note("c3").s("triangle").lpf(180).gain(0.5),
  note("g4 ~ e4 ~ ~ ~ g4 a4").s("steinway").gain(0.35).room(0.55).velocity(0.5),
  drumsMinimal,
  noiseTexture
)
let verseMelF = stack(
  note("[f3,a3,c4,e4]").s("steinway").gain(0.4).room(0.6).velocity(0.6),
  note("f2").s("triangle").lpf(180).gain(0.5),
  note("a4 ~ ~ a4 c5 ~ a4 ~").s("steinway").gain(0.35).room(0.55).velocity(0.5),
  drumsMinimal,
  noiseTexture
)
let verseMelE = stack(
  note("[e3,g#3,b3]").s("steinway").gain(0.4).room(0.6).velocity(0.6),
  note("e2").s("triangle").lpf(180).gain(0.5),
  note("g4 ~ e4 ~ ~ ~ g4 a4").s("steinway").gain(0.35).room(0.55).velocity(0.5),
  drumsMinimal,
  noiseTexture
)

let padColdA = note("[a2,e3,a3]").s("sawtooth").lpf(sine.range(400, 1400).slow(8)).gain(0.18).room(0.75).attack(0.35).release(0.6)
let padColdC = note("[c3,g3,b3]").s("sawtooth").lpf(sine.range(400, 1400).slow(8)).gain(0.18).room(0.75).attack(0.35).release(0.6)
let padColdF = note("[f2,c3,a3]").s("sawtooth").lpf(sine.range(400, 1400).slow(8)).gain(0.18).room(0.75).attack(0.35).release(0.6)
let padColdE = note("[e2,b2,g#3]").s("sawtooth").lpf(sine.range(400, 1400).slow(8)).gain(0.18).room(0.75).attack(0.35).release(0.6)

let buildA = stack(
  note("[a3,c4,e4]").s("steinway").gain(0.4).room(0.6).velocity(0.6),
  note("a2").s("triangle").lpf(180).gain(0.5),
  padColdA,
  drumsMinimal,
  noiseTexture
)
let buildC = stack(
  note("[c3,e3,g3,b3]").s("steinway").gain(0.4).room(0.6).velocity(0.6),
  note("c3").s("triangle").lpf(180).gain(0.5),
  padColdC,
  drumsMinimal,
  noiseTexture
)
let buildF = stack(
  note("[f3,a3,c4,e4]").s("steinway").gain(0.4).room(0.6).velocity(0.6),
  note("f2").s("triangle").lpf(180).gain(0.5),
  padColdF,
  drumsMinimal,
  noiseTexture
)
let buildE = stack(
  note("[e3,g#3,b3]").s("steinway").gain(0.4).room(0.6).velocity(0.6),
  note("e2").s("triangle").lpf(180).gain(0.5),
  padColdE,
  drumsMinimal,
  noiseTexture
)

let chorusA = stack(
  note("[a3,c4,e4]").s("steinway").gain(0.4).room(0.6).velocity(0.6),
  note("a2").s("triangle").lpf(180).gain(0.5),
  padColdA,
  note("e5 ~ c5 e5").s("steinway").gain(0.4).room(0.6).velocity(0.6),
  drumsFull,
  noiseTexture
)
let chorusC = stack(
  note("[c3,e3,g3,b3]").s("steinway").gain(0.4).room(0.6).velocity(0.6),
  note("c3").s("triangle").lpf(180).gain(0.5),
  padColdC,
  note("~ d5 ~ ~ c5 a4 ~ ~").s("steinway").gain(0.4).room(0.6).velocity(0.6),
  drumsFull,
  noiseTexture
)
let chorusF = stack(
  note("[f3,a3,c4,e4]").s("steinway").gain(0.4).room(0.6).velocity(0.6),
  note("f2").s("triangle").lpf(180).gain(0.5),
  padColdF,
  note("e5 ~ c5 e5").s("steinway").gain(0.4).room(0.6).velocity(0.6),
  drumsFull,
  noiseTexture
)
let chorusE = stack(
  note("[e3,g#3,b3]").s("steinway").gain(0.4).room(0.6).velocity(0.6),
  note("e2").s("triangle").lpf(180).gain(0.5),
  padColdE,
  note("g4 a4 ~ ~").s("steinway").gain(0.4).room(0.6).velocity(0.6),
  drumsFull,
  noiseTexture
)

let bridgeA = stack(
  note("[a3,c4,e4]").s("steinway").gain(0.3).room(0.7).velocity(0.45),
  note("a4 ~ ~ ~ b4 ~ c5 ~").s("steinway").gain(0.3).room(0.7).velocity(0.45),
  note("a2").s("triangle").lpf(150).gain(0.35),
  noiseTexture
)
let bridgeF = stack(
  note("[f3,a3,c4,e4]").s("steinway").gain(0.3).room(0.7).velocity(0.45),
  note("~ ~ a4 ~ ~ ~ ~ ~").s("steinway").gain(0.3).room(0.7).velocity(0.45),
  note("f2").s("triangle").lpf(150).gain(0.35),
  noiseTexture
)

let outroA = stack(
  note("[a3,c4,e4]").s("steinway").gain(0.25).room(0.7).velocity(0.4),
  note("a2").s("triangle").lpf(150).gain(0.25),
  noiseTexture
)
let outroF = stack(
  note("[f3,a3,c4,e4]").s("steinway").gain(0.25).room(0.7).velocity(0.4),
  note("f2").s("triangle").lpf(150).gain(0.25),
  noiseTexture
)

slowcat(
  // Intro - sparse piano (8 cycles = 2 progressions)
  introA, introC, introF, introE,
  introA, introC, introF, introE,
  // Verse - add bass and drums (8 cycles)
  verseA, verseC, verseF, verseE,
  verseA, verseC, verseF, verseE,
  // Verse with melody (8 cycles)
  verseMelA, verseMelC, verseMelF, verseMelE,
  verseMelA, verseMelC, verseMelF, verseMelE,
  // Build - add pad (8 cycles)
  buildA, buildC, buildF, buildE,
  buildA, buildC, buildF, buildE,
  // Chorus - full energy (8 cycles)
  chorusA, chorusC, chorusF, chorusE,
  chorusA, chorusC, chorusF, chorusE,
  // Back to verse (8 cycles)
  verseA, verseC, verseF, verseE,
  verseMelA, verseMelC, verseMelF, verseMelE,
  // Chorus again (8 cycles)
  chorusA, chorusC, chorusF, chorusE,
  chorusA, chorusC, chorusF, chorusE,
  // Bridge - sparse (8 cycles)
  bridgeA, bridgeA, bridgeF, bridgeF,
  bridgeA, bridgeA, bridgeF, bridgeF,
  // Final chorus (8 cycles)
  chorusA, chorusC, chorusF, chorusE,
  chorusA, chorusC, chorusF, chorusE,
  // Outro - fade (8 cycles)
  outroA, outroA, outroF, outroF,
  outroA, outroA, outroF, outroF
)
