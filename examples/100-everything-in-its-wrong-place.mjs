// Everything In Its Wrong Place
// Art Rock / Electronic Melancholia · Late 90s-2000s Alternative · Technological alienation, beautiful unease, introspective tension

// Genre: Art Rock / Electronic Melancholia
// Era: Late 90s-2000s Alternative
// Mood: Technological alienation, beautiful unease
// Sounds: steinway piano, triangle bass, sawtooth pad, 808 drums, filtered noise
// Sound choice: Piano warmth vs synthetic coldness - the Radiohead tension

setcps(0.42)

let noiseTexture = s("noise").lpf(sine.range(200, 900).slow(16)).gain(0.05).room(0.9)

let pianoChords = note("<[a3,c4,e4] [c3,e3,g3,b3] [f3,a3,c4,e4] [e3,g#3,b3]>/4")
  .s("steinway").gain(0.4).room(0.6).velocity(0.6)

let pianoSparse = note("<[a3,c4,e4] ~ [f3,a3,c4,e4] ~>/4")
  .s("steinway").gain(0.35).room(0.7).velocity(0.5)

let bassLine = note("<a2 c3 f2 e2>/4").s("triangle").lpf(180).gain(0.5)

let bassMinimal = note("<a2 ~ f2 ~>/4").s("triangle").lpf(150).gain(0.45)

let drumsMinimal = stack(
  s("bd:1 ~ ~ ~ sd:1 ~ bd:1 ~ ~ ~ sd:1 ~ ~ bd:1 ~ ~").bank("RolandTR808").gain(0.5),
  s("~ hh*4 ~ hh*4 ~ hh*4 ~ hh*4").bank("RolandTR808").lpf(4500).gain(0.2)
)

let drumsFull = stack(
  s("bd:1 ~ ~ bd:1 sd:1 ~ bd:1 ~ ~ bd:1 sd:1 ~ ~ bd:1 ~ sd:1").bank("RolandTR808").gain(0.6),
  s("hh*8").bank("RolandTR808").lpf(5500).gain(0.28).sometimes(x => x.gain(0.12))
)

let padCold = note("<[a2,e3,a3] [c3,g3,b3] [f2,c3,a3] [e2,b2,g#3]>/4")
  .s("sawtooth").lpf(sine.range(400, 1400).slow(8)).gain(0.18).room(0.75).attack(0.35).release(0.6)

let melodyVerse = note("a4 ~ ~ a4 c5 ~ a4 ~ g4 ~ e4 ~ ~ ~ g4 a4")
  .s("steinway").gain(0.35).room(0.55).velocity(0.5)

let melodyChorus = note("e5 ~ c5 e5 ~ d5 ~ ~ c5 a4 ~ ~ g4 a4 ~ ~")
  .s("steinway").gain(0.4).room(0.6).velocity(0.6)

let melodyBridge = note("a4 ~ ~ ~ b4 ~ c5 ~ ~ ~ a4 ~ ~ ~ ~ ~")
  .s("steinway").gain(0.3).room(0.7).velocity(0.45)

let intro = stack(pianoSparse, noiseTexture)

let introFull = stack(pianoChords, noiseTexture)

let verse1 = stack(pianoChords, bassMinimal, drumsMinimal, noiseTexture)

let verse1melody = stack(pianoChords, bassLine, drumsMinimal, melodyVerse, noiseTexture)

let build = stack(pianoChords, bassLine, drumsMinimal, padCold, noiseTexture)

let chorus = stack(pianoChords, bassLine, drumsFull, padCold, melodyChorus, noiseTexture)

let bridge = stack(pianoSparse, bassMinimal.gain(0.35), melodyBridge, noiseTexture)

let outroFade = stack(pianoSparse.gain(0.25), noiseTexture, bassMinimal.gain(0.25))

slowcat(
  intro, intro, intro, intro,
  introFull, introFull, introFull, introFull,
  verse1, verse1, verse1, verse1,
  verse1melody, verse1melody, verse1melody, verse1melody,
  build, build, build, build,
  build, build, build, build,
  chorus, chorus, chorus, chorus,
  chorus, chorus, chorus, chorus,
  verse1, verse1, verse1, verse1,
  verse1melody, verse1melody, verse1melody, verse1melody,
  chorus, chorus, chorus, chorus,
  chorus, chorus, chorus, chorus,
  bridge, bridge, bridge, bridge,
  bridge, bridge, bridge, bridge,
  chorus, chorus, chorus, chorus,
  chorus, chorus, chorus, chorus,
  outroFade, outroFade, outroFade, outroFade,
  outroFade, outroFade, outroFade, outroFade
)
