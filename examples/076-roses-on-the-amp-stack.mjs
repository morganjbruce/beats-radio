// Roses on the Amp Stack
// Velvet & Gunpowder Power Ballad / Sunset Strip Slow Burn · 1988 Los Angeles, neon rain on Sunset Boulevard · tender ferocity — heartbreak with a Marshall stack behind it

// Genre: Velvet & Gunpowder Power Ballad
// Era: 1988 Sunset Strip
// Mood: tender ferocity — heartbreak with a Marshall stack behind it
// Sounds: piano arpeggios & hooks, distorted sawtooth power chords, square bass, bd/sd/hh/cr drums, vibrato sawtooth lead, triangle low pad
// Sound choice: piano is the rose, distorted sawtooth is the gun

setcps(0.32)

// ---------- INTRO: the rose alone (Em C G D) ----------
let introEm = stack(
  note("e3 b3 g4 b3 e4 b3 g4 b3").s("piano").gain(0.5).room(0.6),
  note("[e2,b2]").s("triangle").lpf(400).attack(0.3).release(0.8).gain(0.3).room(0.5)
)
let introC = stack(
  note("c3 g3 e4 g3 c4 g3 e4 g3").s("piano").gain(0.5).room(0.6),
  note("[c2,g2]").s("triangle").lpf(400).attack(0.3).release(0.8).gain(0.3).room(0.5)
)
let introG = stack(
  note("g2 d3 b3 d3 g3 d3 b3 d3").s("piano").gain(0.5).room(0.6),
  note("[g1,d2]").s("triangle").lpf(400).attack(0.3).release(0.8).gain(0.3).room(0.5)
)
let introD = stack(
  note("d3 a3 f#4 a3 d4 a3 f#4 a3").s("piano").gain(0.5).room(0.6),
  note("[d2,a2]").s("triangle").lpf(400).attack(0.3).release(0.8).gain(0.3).room(0.5)
)

// ---------- VERSE: rose with a heartbeat ----------
let verseDrums = stack(
  s("bd ~ ~ ~ sd ~ ~ ~ ~ ~ bd ~ sd ~ ~ ~").gain(0.55),
  s("hh*8").gain(0.2)
)
let verseEm = stack(
  note("e3 b3 g4 b3 e4 b3 g4 b3").s("piano").gain(0.45).room(0.5),
  note("e2").struct("x ~ ~ x ~ ~ x ~").s("triangle").lpf(300).gain(0.55),
  note("[e3,g3,b3]").s("sawtooth").lpf(600).attack(0.3).release(0.6).gain(0.2).room(0.5),
  verseDrums
)
let verseC = stack(
  note("c3 g3 e4 g3 c4 g3 e4 g3").s("piano").gain(0.45).room(0.5),
  note("c2").struct("x ~ ~ x ~ ~ x ~").s("triangle").lpf(300).gain(0.55),
  note("[e3,g3,c4]").s("sawtooth").lpf(600).attack(0.3).release(0.6).gain(0.2).room(0.5),
  verseDrums
)
let verseG = stack(
  note("g2 d3 b3 d3 g3 d3 b3 d3").s("piano").gain(0.45).room(0.5),
  note("g1").struct("x ~ ~ x ~ ~ x ~").s("triangle").lpf(300).gain(0.55),
  note("[d3,g3,b3]").s("sawtooth").lpf(600).attack(0.3).release(0.6).gain(0.2).room(0.5),
  verseDrums
)
let verseD = stack(
  note("d3 a3 f#4 a3 d4 a3 f#4 a3").s("piano").gain(0.45).room(0.5),
  note("d2").struct("x ~ ~ x ~ ~ x ~").s("triangle").lpf(300).gain(0.55),
  note("[d3,f#3,a3]").s("sawtooth").lpf(600).attack(0.3).release(0.6).gain(0.2).room(0.5),
  verseDrums
)

// ---------- CHORUS: the gun comes out ----------
let chorusDrums = stack(
  s("bd ~ bd ~ sd ~ ~ bd ~ bd ~ ~ sd ~ ~ ~").gain(0.7),
  s("hh*8").gain(0.28),
  s("cr ~ ~ ~ ~ ~ ~ ~").gain(0.25).room(0.4)
)
let chorusEm = stack(
  note("[e2,b2,e3]").struct("x ~ x ~ ~ x ~ x").clip(0.85).s("sawtooth").lpf(900).shape(0.45).gain(0.38),
  note("e2").struct("x*8").s("square").lpf(250).gain(0.4),
  note("e5 ~ b4 g4 b4 ~ e5 ~").s("piano").gain(0.42).room(0.45),
  chorusDrums
)
let chorusC = stack(
  note("[c2,g2,c3]").struct("x ~ x ~ ~ x ~ x").clip(0.85).s("sawtooth").lpf(900).shape(0.45).gain(0.38),
  note("c2").struct("x*8").s("square").lpf(250).gain(0.4),
  note("g4 c5 e5 ~ d5 c5 ~ b4").s("piano").gain(0.42).room(0.45),
  chorusDrums
)
let chorusG = stack(
  note("[g1,d2,g2]").struct("x ~ x ~ ~ x ~ x").clip(0.85).s("sawtooth").lpf(900).shape(0.45).gain(0.38),
  note("g1").struct("x*8").s("square").lpf(250).gain(0.4),
  note("d5 ~ b4 g4 b4 d5 ~ b4").s("piano").gain(0.42).room(0.45),
  chorusDrums
)
let chorusD = stack(
  note("[d2,a2,d3]").struct("x ~ x ~ ~ x ~ x").clip(0.85).s("sawtooth").lpf(900).shape(0.45).gain(0.38),
  note("d2").struct("x*8").s("square").lpf(250).gain(0.4),
  note("a4 ~ f#4 a4 d5 ~ a4 f#4").s("piano").gain(0.42).room(0.45),
  chorusDrums
)

// ---------- SOLO: gun and rose together, lead sings ----------
let soloEm = stack(
  note("e4 g4 a4 b4 d5 b4 ~ b4").s("sawtooth").lpf(2200).vib(5).vmod(0.08).gain(0.4).room(0.4).delay(0.25),
  note("[e2,b2,e3]").struct("x ~ x ~ ~ x ~ x").clip(0.85).s("sawtooth").lpf(800).shape(0.4).gain(0.28),
  note("e2").struct("x*8").s("square").lpf(250).gain(0.38),
  chorusDrums
)
let soloC = stack(
  note("c5 b4 g4 ~ e4 g4 b4 c5").s("sawtooth").lpf(2200).vib(5).vmod(0.08).gain(0.4).room(0.4).delay(0.25),
  note("[c2,g2,c3]").struct("x ~ x ~ ~ x ~ x").clip(0.85).s("sawtooth").lpf(800).shape(0.4).gain(0.28),
  note("c2").struct("x*8").s("square").lpf(250).gain(0.38),
  chorusDrums
)
let soloG = stack(
  note("d5 b4 g4 a4 b4 ~ g4 a4").s("sawtooth").lpf(2200).vib(5).vmod(0.08).gain(0.4).room(0.4).delay(0.25),
  note("[g1,d2,g2]").struct("x ~ x ~ ~ x ~ x").clip(0.85).s("sawtooth").lpf(800).shape(0.4).gain(0.28),
  note("g1").struct("x*8").s("square").lpf(250).gain(0.38),
  chorusDrums
)
let soloD = stack(
  note("f#4 a4 d5 ~ a4 b4 a4 f#4").s("sawtooth").lpf(2200).vib(5).vmod(0.08).gain(0.4).room(0.4).delay(0.25),
  note("[d2,a2,d3]").struct("x ~ x ~ ~ x ~ x").clip(0.85).s("sawtooth").lpf(800).shape(0.4).gain(0.28),
  note("d2").struct("x*8").s("square").lpf(250).gain(0.38),
  chorusDrums
)

// ---------- OUTRO: only the rose remains ----------
let outroEm = stack(
  note("e3 b3 g4 b3 e4 b3 g4 b3").s("piano").gain(0.4).room(0.7),
  note("[e2,b2,e3,g3]").s("triangle").lpf(350).attack(0.5).release(1).gain(0.25).room(0.6)
)

// ---------- ARRANGEMENT (~56 cycles, ~3 minutes) ----------
slowcat(
  introEm, introC, introG, introD,
  verseEm, verseC, verseG, verseD,
  verseEm, verseC, verseG, verseD,
  chorusEm, chorusC, chorusG, chorusD,
  chorusEm, chorusC, chorusG, chorusD,
  verseEm, verseC, verseG, verseD,
  verseEm, verseC, verseG, verseD,
  soloEm, soloC, soloG, soloD,
  soloEm, soloC, soloG, soloD,
  chorusEm, chorusC, chorusG, chorusD,
  chorusEm, chorusC, chorusG, chorusD,
  introEm, introC, introG, outroEm
)
