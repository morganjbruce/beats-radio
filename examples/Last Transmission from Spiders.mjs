// Last Transmission from the Spiders
// Stardust Glam Cabaret · early 1970s glam rock · theatrical farewell, bittersweet swagger, neon melancholy

// Genre: Stardust Glam Cabaret
// Era: early 1970s glam rock
// Mood: theatrical farewell, bittersweet swagger, neon melancholy
// Sounds: sawtooth bass, sawtooth pad, rhodes comp, saxophone lead, TR909 kit
// Sound choice: chrome saw synths + Rhodes + sax hook over a 909 glam stomp, chromatic-mediant A->F changes

setcps(0.5)

// ---- INTRO (soft, establish key of A) ----
let introA = stack(
  note("a2").struct("x ~ ~ x ~ ~ x ~").s("sawtooth").lpf(300).shape(0.2).gain(0.45),
  note("a3,c#4,e4").s("sawtooth").lpf(700).attack(0.2).release(0.6).room(0.4).gain(0.2),
  s("hh*8").bank("RolandTR909").gain(0.12).pan(sine.range(-0.3,0.3).fast(4))
)

// ---- VERSE sections (A - F - D - E, F is the borrowed chromatic-mediant lift) ----
let verseA = stack(
  note("a2").struct("x ~ ~ x ~ ~ x ~").s("sawtooth").lpf(420).shape(0.3).gain(0.5),
  note("a3,c#4,e4").s("sawtooth").lpf(950).attack(0.05).release(0.4).room(0.3).gain(0.22),
  note("a3,c#4,e4").struct("~ x ~ x").s("rhodes").gain(0.34).room(0.3),
  s("bd ~ sd ~").bank("RolandTR909").gain(0.7),
  s("hh*8").bank("RolandTR909").gain(0.14)
)
let verseF = stack(
  note("f2").struct("x ~ ~ x ~ ~ x ~").s("sawtooth").lpf(420).shape(0.3).gain(0.5),
  note("f3,a3,c4").s("sawtooth").lpf(950).attack(0.05).release(0.4).room(0.3).gain(0.22),
  note("f3,a3,c4").struct("~ x ~ x").s("rhodes").gain(0.34).room(0.3),
  s("bd ~ sd ~").bank("RolandTR909").gain(0.7),
  s("hh*8").bank("RolandTR909").gain(0.14)
)
let verseD = stack(
  note("d2").struct("x ~ ~ x ~ ~ x ~").s("sawtooth").lpf(420).shape(0.3).gain(0.5),
  note("d3,f#3,a3").s("sawtooth").lpf(950).attack(0.05).release(0.4).room(0.3).gain(0.22),
  note("d3,f#3,a3").struct("~ x ~ x").s("rhodes").gain(0.34).room(0.3),
  s("bd ~ sd ~").bank("RolandTR909").gain(0.7),
  s("hh*8").bank("RolandTR909").gain(0.14)
)
let verseE = stack(
  note("e2").struct("x ~ ~ x ~ ~ x ~").s("sawtooth").lpf(420).shape(0.3).gain(0.5),
  note("e3,g#3,b3").s("sawtooth").lpf(950).attack(0.05).release(0.4).room(0.3).gain(0.22),
  note("e3,g#3,b3").struct("~ x ~ x").s("rhodes").gain(0.34).room(0.3),
  s("bd ~ sd ~").bank("RolandTR909").gain(0.7),
  s("hh*8").bank("RolandTR909").gain(0.14)
)

// ---- CHORUS sections (fuller, sax hook: leap up then resolve to the maj7) ----
let chorusA = stack(
  note("a2").struct("x ~ x x ~ ~ x ~").s("sawtooth").lpf(500).shape(0.35).gain(0.52),
  note("a3,c#4,e4,g#4").s("sawtooth").lpf(1100).attack(0.04).release(0.45).room(0.3).gain(0.22),
  note("a3,c#4,e4").struct("x ~ x x").s("rhodes").gain(0.32).room(0.3),
  note("e4 a4 ~ g#4 e4 ~ ~ ~").s("sax").lpf(3200).room(0.4).gain(0.42),
  s("bd ~ sd ~").bank("RolandTR909").gain(0.72),
  s("hh*8, ~ ~ ~ oh").bank("RolandTR909").gain(0.16)
)
let chorusF = stack(
  note("f2").struct("x ~ x x ~ ~ x ~").s("sawtooth").lpf(500).shape(0.35).gain(0.52),
  note("f3,a3,c4,e4").s("sawtooth").lpf(1100).attack(0.04).release(0.45).room(0.3).gain(0.22),
  note("f3,a3,c4").struct("x ~ x x").s("rhodes").gain(0.32).room(0.3),
  note("f4 c5 ~ a4 f4 ~ ~ ~").s("sax").lpf(3200).room(0.4).gain(0.42),
  s("bd ~ sd ~").bank("RolandTR909").gain(0.72),
  s("hh*8, ~ ~ ~ oh").bank("RolandTR909").gain(0.16)
)
let chorusD = stack(
  note("d2").struct("x ~ x x ~ ~ x ~").s("sawtooth").lpf(500).shape(0.35).gain(0.52),
  note("d3,f#3,a3,c#4").s("sawtooth").lpf(1100).attack(0.04).release(0.45).room(0.3).gain(0.22),
  note("d3,f#3,a3").struct("x ~ x x").s("rhodes").gain(0.32).room(0.3),
  note("a4 d5 ~ c#5 a4 ~ ~ ~").s("sax").lpf(3200).room(0.4).gain(0.42),
  s("bd ~ sd ~").bank("RolandTR909").gain(0.72),
  s("hh*8, ~ ~ ~ oh").bank("RolandTR909").gain(0.16)
)
let chorusE = stack(
  note("e2").struct("x ~ x x ~ ~ x ~").s("sawtooth").lpf(500).shape(0.35).gain(0.52),
  note("e3,g#3,b3,d#4").s("sawtooth").lpf(1100).attack(0.04).release(0.45).room(0.3).gain(0.22),
  note("e3,g#3,b3").struct("x ~ x x").s("rhodes").gain(0.32).room(0.3),
  note("b4 e5 ~ d#5 b4 ~ ~ ~").s("sax").lpf(3200).room(0.4).gain(0.42),
  s("bd ~ sd ~ cp").bank("RolandTR909").gain(0.72),
  s("hh*8, ~ ~ ~ oh").bank("RolandTR909").gain(0.16)
)

// ---- OUTRO (fade back to the soft intro texture, sax sighs) ----
let outroA = stack(
  note("a2").struct("x ~ ~ x ~ ~ x ~").s("sawtooth").lpf(300).gain(0.42),
  note("a3,c#4,e4").s("sawtooth").lpf(650).attack(0.3).release(0.8).room(0.5).gain(0.2),
  note("e4 ~ ~ g#4 ~ ~ a4 ~").s("sax").lpf(2600).room(0.6).gain(0.3),
  s("hh*8").bank("RolandTR909").gain(0.1)
)

slowcat(
  introA, introA, introA, introA,
  verseA, verseF, verseD, verseE, verseA, verseF, verseD, verseE,
  chorusA, chorusF, chorusD, chorusE, chorusA, chorusF, chorusD, chorusE,
  verseA, verseF, verseD, verseE, verseA, verseF, verseD, verseE,
  chorusA, chorusF, chorusD, chorusE, chorusA, chorusF, chorusD, chorusE,
  chorusA, chorusF, chorusD, chorusE,
  outroA, outroA, outroA, outroA
)
