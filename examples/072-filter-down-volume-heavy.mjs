// Filter Down, Volume Heavy
// Heavy French Touch House · late 1990s Paris club basement · relentless, euphoric, head-nod heavy

// Genre: Heavy French Touch House
// Era: late 1990s Paris club basement
// Mood: relentless, euphoric, head-nod heavy
// Sounds: TR909 kick/clap/hats, sawtooth filtered chord stabs, sawtooth bass, square lead, open hat, vinyl crackle
// Sound choice: 909 stomp + pumping filtered saw chords = the heavy French touch sound

setcps(0.52)

let drums = stack(
  s("bd*4").bank("RolandTR909").gain(0.85),
  s("~ cp ~ cp").bank("RolandTR909").gain(0.55).room(0.12),
  s("[~ hh]*4").bank("RolandTR909").gain(0.4),
  s("~ ~ ~ [~ oh]").bank("RolandTR909").gain(0.25)
)

let hats = stack(
  s("[~ hh]*4").bank("RolandTR909").gain(0.35),
  s("~ cp ~ cp").bank("RolandTR909").gain(0.35).room(0.2)
)

let crackle = s("vinyl").gain(0.15)

// ---- bass per chord (locks with kick) ----
let bassA = note("a1 ~ a1 a2 ~ a1 [a1 a2] ~").s("sawtooth").lpf(320).shape(0.4).gain(0.5)
let bassF = note("f1 ~ f1 f2 ~ f1 [f1 f2] ~").s("sawtooth").lpf(320).shape(0.4).gain(0.5)
let bassD = note("d1 ~ d1 d2 ~ d1 [d1 d2] ~").s("sawtooth").lpf(320).shape(0.4).gain(0.5)
let bassE = note("e1 ~ e1 e2 ~ e1 [e1 e2] ~").s("sawtooth").lpf(320).shape(0.4).gain(0.5)

// ---- filtered chord stabs (the french touch pump) ----
let stabAm = note("[a2,c3,e3,g3]").struct("~ x ~ x ~ x x ~").s("sawtooth").clip(0.6).shape(0.25).lpf(sine.range(500, 2400).slow(16)).gain(sine.range(0.24, 0.4).fast(4)).room(0.15)
let stabF = note("[f2,a2,c3,e3]").struct("~ x ~ x ~ x x ~").s("sawtooth").clip(0.6).shape(0.25).lpf(sine.range(500, 2400).slow(16)).gain(sine.range(0.24, 0.4).fast(4)).room(0.15)
let stabDm = note("[d2,f2,a2,c3]").struct("~ x ~ x ~ x x ~").s("sawtooth").clip(0.6).shape(0.25).lpf(sine.range(500, 2400).slow(16)).gain(sine.range(0.24, 0.4).fast(4)).room(0.15)
let stabEm = note("[e2,g2,b2,d3]").struct("~ x ~ x ~ x x ~").s("sawtooth").clip(0.6).shape(0.25).lpf(sine.range(500, 2400).slow(16)).gain(sine.range(0.24, 0.4).fast(4)).room(0.15)

// ---- peak lead melody ----
let leadA = note("e5 ~ c5 a4 ~ c5 d5 ~").s("square").lpf(1900).gain(0.28).delay(0.25).room(0.3)
let leadF = note("c5 ~ a4 f4 ~ a4 c5 ~").s("square").lpf(1900).gain(0.28).delay(0.25).room(0.3)
let leadD = note("d5 ~ a4 f4 ~ a4 c5 ~").s("square").lpf(1900).gain(0.28).delay(0.25).room(0.3)
let leadE = note("b4 ~ g4 e4 ~ g4 b4 d5").s("square").lpf(1900).gain(0.28).delay(0.25).room(0.3)

// ---- sections ----
let introAm = stack(hats, crackle, note("[a2,c3,e3,g3]").struct("~ x ~ x ~ x x ~").s("sawtooth").clip(0.6).lpf(sine.range(250, 900).slow(4)).gain(0.3).room(0.25), bassA.gain(0.35))

let mainAm = stack(drums, bassA, stabAm)
let mainF = stack(drums, bassF, stabF)
let mainDm = stack(drums, bassD, stabDm)
let mainEm = stack(drums, bassE, stabEm)

let peakAm = stack(drums, bassA, stabAm, leadA)
let peakF = stack(drums, bassF, stabF, leadF)
let peakDm = stack(drums, bassD, stabDm, leadD)
let peakEm = stack(drums, bassE, stabEm, leadE)

let breakAm = stack(hats, crackle, bassA.gain(0.4), note("[a2,c3,e3,g3]").struct("~ x ~ x ~ x x ~").s("sawtooth").clip(0.7).lpf(sine.range(300, 1400).slow(4)).gain(0.32).room(0.3))
let breakF = stack(hats, crackle, bassF.gain(0.4), note("[f2,a2,c3,e3]").struct("~ x ~ x ~ x x ~").s("sawtooth").clip(0.7).lpf(sine.range(400, 1800).slow(4)).gain(0.32).room(0.3))
let breakDm = stack(hats, crackle, bassD.gain(0.4), note("[d2,f2,a2,c3]").struct("~ x ~ x ~ x x ~").s("sawtooth").clip(0.7).lpf(sine.range(500, 2200).slow(4)).gain(0.32).room(0.3))
let breakEm = stack(hats, crackle, bassE.gain(0.4), note("[e2,g2,b2,d3]").struct("~ x x x x x x x").s("sawtooth").clip(0.7).lpf(sine.range(600, 2600).slow(4)).gain(0.36).room(0.3))

let outroAm = stack(hats, crackle, note("[a2,c3,e3,g3]").struct("~ x ~ x ~ x x ~").s("sawtooth").clip(0.6).lpf(sine.range(800, 300).slow(4)).gain(0.28).room(0.35), bassA.gain(0.3))

slowcat(
  introAm, introAm, introAm, introAm,
  mainAm, mainF, mainDm, mainEm,
  mainAm, mainF, mainDm, mainEm,
  mainAm, mainF, mainDm, mainEm,
  mainAm, mainF, mainDm, mainEm,
  peakAm, peakF, peakDm, peakEm,
  peakAm, peakF, peakDm, peakEm,
  peakAm, peakF, peakDm, peakEm,
  peakAm, peakF, peakDm, peakEm,
  breakAm, breakF, breakDm, breakEm,
  peakAm, peakF, peakDm, peakEm,
  peakAm, peakF, peakDm, peakEm,
  peakAm, peakF, peakDm, peakEm,
  peakAm, peakF, peakDm, peakEm,
  outroAm, outroAm, outroAm, outroAm
)
