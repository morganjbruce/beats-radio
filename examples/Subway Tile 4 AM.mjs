// Subway Tile, 4 A.M.
// Strip-Lit Post-Punk Revival · Early-2000s NYC Bright-Lights Revival · anxious, driving, detached urgency under fluorescent light

// Genre: Strip-Lit Post-Punk Revival
// Era: Early-2000s NYC Bright-Lights Revival
// Mood: anxious, driving, detached urgency
// Sounds: 909 motorik kit, sawtooth drive-bass, square guitar stabs, echo lead, saw pad
// Sound choice: saw bass + square delay-guitar evokes Interpol's interlocked attack over a relentless 909 pulse

setcps(0.58)

const drums = stack(
  s("bd*4").bank("RolandTR909").gain(0.85),
  s("~ sd ~ sd").bank("RolandTR909").gain(0.5),
  s("hh*8").bank("RolandTR909").gain(0.27).pan(sine.range(0.4,0.6))
)

const driveBass = (pat) => note(pat).s("sawtooth").lpf(sine.range(550,850).slow(8)).gain(0.5).shape(0.3).decay(0.1).sustain(0.55)

const gtr = (chord) => note(chord).struct("x x ~ x x x ~ x").s("square").lpf(1400).gain(0.24).delay(0.2).delaytime(0.16).delayfeedback(0.25).room(0.2)

const lead = note("e5 ~ a4 c5 ~ d5 ~ c5").s("sawtooth").lpf(2300).gain(0.27).delay(0.3).delaytime(0.1875).delayfeedback(0.3).room(0.3)

const pad = (chord) => note(chord).s("sawtooth").attack(0.4).release(0.5).lpf(800).gain(0.16).room(0.45)

const introA = stack(drums, driveBass("a1 a1 a1 a1 a1 a1 e2 a1"))

const vAm = stack(drums, driveBass("a1 a1 a1 a1 a1 e2 a1 c2"), gtr("a3,c4,e4"))
const vEm = stack(drums, driveBass("e1 e1 e1 e1 e1 b1 e1 g1"), gtr("e3,g3,b3"))
const vF  = stack(drums, driveBass("f1 f1 f1 f1 f1 c2 f1 a1"), gtr("f3,a3,c4"))
const vG  = stack(drums, driveBass("g1 g1 g1 g1 g1 d2 g1 b1"), gtr("g3,b3,d4"))

const cC  = stack(drums, driveBass("c2 c2 c2 c2 c2 g2 c2 e2"), gtr("c4,e4,g4"), pad("c4,e4,g4"), lead)
const cG  = stack(drums, driveBass("g1 g1 g1 g1 g1 d2 g1 b1"), gtr("g3,b3,d4"), pad("g3,b3,d4"), lead)
const cBb = stack(drums, driveBass("bb1 bb1 bb1 bb1 bb1 f2 bb1 d2"), gtr("bb3,d4,f4"), pad("bb3,d4,f4"), lead)
const cAm = stack(drums, driveBass("a1 a1 a1 a1 a1 e2 a1 c2"), gtr("a3,c4,e4"), pad("a3,c4,e4"), lead)

const bridge = stack(
  s("bd ~ ~ ~ bd ~ ~ ~").bank("RolandTR909").gain(0.7),
  s("~ ~ sd ~ ~ ~ sd ~").bank("RolandTR909").gain(0.4),
  driveBass("a1 a1 a1 a1 a1 e2 a1 c2"),
  pad("a3,c4,e4"),
  lead
)

const outroA = stack(drums.gain(0.6), driveBass("a1 a1 a1 a1 a1 a1 e2 a1"))

slowcat(
  introA, introA, introA, introA,
  vAm, vEm, vF, vG, vAm, vEm, vF, vG,
  cC, cG, cBb, cAm, cC, cG, cBb, cAm,
  vAm, vEm, vF, vG, vAm, vEm, vF, vG,
  cC, cG, cBb, cAm, cC, cG, cBb, cAm,
  bridge, bridge, bridge, bridge,
  cC, cG, cBb, cAm, cC, cG, cBb, cAm,
  cC, cG, cBb, cAm, cC, cG, cBb, cAm,
  outroA, outroA, outroA, outroA
)
