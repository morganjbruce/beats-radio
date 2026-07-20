// Sparks Off the Grinder
// Corroded Industrial Dub · near-future workshop floor, 2030s · abrasive yet hypnotic, menacing head-nod groove with smoke and echo

// Genre: Corroded Industrial Dub
// Era: near-future workshop floor, 2030s
// Mood: abrasive, hypnotic, menacing dub groove
// Sounds: square sub bass, distorted square skank, crushed square lead, TR909 kick/snare, panned hi-hats
// Sound choice: harsh square waves for buzz + filtered shaped square for fat dub sub

setcps(0.36)

const drums = stack(
  s("bd ~ ~ ~ ~ ~ ~ ~ bd ~ ~ bd ~ ~ ~ ~").bank("RolandTR909").gain(0.85).shape(0.2),
  s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").bank("RolandTR909").gain(0.5).room(0.6).delay(0.3).delaytime(0.375).delayfeedback(0.35),
  s("hh ~ hh ~ hh ~ hh ~ hh ~ hh ~ hh ~ hh ~").gain(0.18).pan(sine.range(-0.4,0.4).slow(4))
)

const dubBass = (root) => note(root).struct("x ~ ~ x ~ ~ x ~").s("square").lpf(200).shape(0.5).gain(0.72).room(0.2)

const skank = (chord) => note(chord).struct("~ x ~ x ~ x ~ x").s("square").distort(0.35).lpf(1600).delay(0.5).delaytime(0.5).delayfeedback(0.55).room(0.4).gain(0.24)

const lead = (phrase) => note(phrase).s("square").distort(0.5).crush(7).lpf(2600).resonance(8).delay(0.45).delaytime(0.375).delayfeedback(0.5).room(0.3).gain(0.27)

const intro = stack(drums, dubBass("a1"))

const grooveAm = stack(drums, dubBass("a1"), skank("a3,c4,e4"))
const grooveG  = stack(drums, dubBass("g1"), skank("g3,b3,d4"))
const grooveF  = stack(drums, dubBass("f1"), skank("f3,a3,c4"))
const grooveE  = stack(drums, dubBass("e1"), skank("e3,gs3,b3"))

const peakAm = stack(drums, dubBass("a1"), skank("a3,c4,e4"), lead("a3 ~ c4 ~ e4 ~ c4 ~"))
const peakG  = stack(drums, dubBass("g1"), skank("g3,b3,d4"), lead("g3 ~ b3 ~ d4 ~ b3 ~"))
const peakF  = stack(drums, dubBass("f1"), skank("f3,a3,c4"), lead("f3 ~ a3 ~ c4 ~ a3 ~"))
const peakE  = stack(drums, dubBass("e1"), skank("e3,gs3,b3"), lead("e3 ~ gs3 ~ b3 ~ gs3 ~"))

const breakdown = stack(
  dubBass("a1"),
  skank("a3,c4,e4").delayfeedback(0.7).room(0.6).gain(0.26)
)

slowcat(
  intro, intro, intro, intro,
  grooveAm, grooveG, grooveAm, grooveF,
  grooveAm, grooveG, grooveAm, grooveF,
  peakAm, peakG, peakAm, peakF,
  peakAm, peakG, peakAm, peakE,
  breakdown, breakdown,
  grooveAm, grooveG, grooveAm, grooveF,
  peakAm, peakG, peakAm, peakF,
  peakAm, peakG, peakAm, peakE,
  grooveAm, grooveG, grooveAm, grooveF,
  intro, intro
)
