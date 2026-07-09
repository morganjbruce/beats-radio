// Queens of the Stone Age style
// Desert rock, heavy fuzz
// Paste into https://strudel.cc

setcps(108/60/4)

// VERSE - driving, hypnotic
let verse = stack(
  // Drums - tight and heavy
  s("bd ~ ~ bd ~ ~ bd ~")
    .gain(1.1).shape(0.4).lpf(120),
  s("~ ~ ~ ~ sd ~ ~ ~")
    .gain(1).room(0.2).shape(0.3),
  s("hh*8")
    .gain("0.5 0.25 0.4 0.25 0.5 0.25 0.4 0.3"),

  // Fuzzy guitar riff - the main hook
  note("e2 e2 e2 e2 g2 g2 a2 g2")
    .s("sawtooth")
    .lpf(1800)
    .resonance(8)
    .gain(0.6)
    .shape(0.6)
    .distort(0.3)
    .room(0.2),

  // Octave up layer
  note("e3 e3 e3 e3 g3 g3 a3 g3")
    .s("square")
    .lpf(2500)
    .gain(0.35)
    .shape(0.5)
    .distort(0.25)
    .room(0.2),

  // Bass - locked with kick
  note("e1 ~ ~ e1 ~ ~ e1 ~")
    .s("sawtooth")
    .lpf(200)
    .gain(0.7)
    .shape(0.5)
    .decay(0.15)
    .sustain(0.6)
)

// CHORUS - opens up, bigger
let chorus = stack(
  s("bd ~ bd ~ sd ~ bd ~")
    .gain(1.15).shape(0.45).lpf(120),
  s("~ ~ ~ ~ sd ~ ~ sd")
    .gain(1).room(0.25).shape(0.35),
  s("hh*8")
    .gain("0.55 0.3 0.45 0.3 0.55 0.3 0.45 0.35"),
  s("~ ~ ~ ~ ~ ~ ~ oh")
    .gain(0.4).room(0.3),

  // Power chord riff
  note("[e2,b2] ~ [e2,b2] ~ [g2,d3] ~ [a2,e3] [g2,d3]")
    .s("sawtooth")
    .lpf(2200)
    .resonance(6)
    .gain(0.65)
    .shape(0.6)
    .distort(0.35)
    .room(0.25),

  // High guitar layer
  note("[e3,b3] ~ [e3,b3] ~ [g3,d4] ~ [a3,e4] [g3,d4]")
    .s("square")
    .lpf(3000)
    .gain(0.3)
    .shape(0.5)
    .distort(0.2)
    .room(0.25),

  // Driving bass
  note("e1 ~ e1 ~ g1 ~ a1 g1")
    .s("sawtooth")
    .lpf(250)
    .gain(0.75)
    .shape(0.55)
    .decay(0.12)
    .sustain(0.7)
)

// BRIDGE - half time, menacing
let bridge = stack(
  s("bd ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~ ~ ~")
    .gain(1.1).shape(0.5).lpf(100),
  s("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~")
    .gain(1).room(0.35).shape(0.4),
  s("hh ~ hh ~ hh ~ hh ~")
    .gain(0.4),

  // Dark, slow riff
  note("[e2,b2] ~ ~ ~ [eb2,bb2] ~ ~ ~ [d2,a2] ~ ~ ~ [e2,b2] ~ ~ ~")
    .s("sawtooth")
    .lpf(1600)
    .resonance(10)
    .gain(0.6)
    .shape(0.65)
    .distort(0.4)
    .room(0.3),

  note("e1 ~ ~ ~ eb1 ~ ~ ~ d1 ~ ~ ~ e1 ~ ~ ~")
    .s("sawtooth")
    .lpf(180)
    .gain(0.7)
    .shape(0.55)
    .decay(0.2)
    .sustain(0.7)
)

// FILL - into chorus
let fill = stack(
  s("~ ~ ~ ~ sd ~ sd sd")
    .gain(1.1).room(0.2).shape(0.35),
  s("~ ~ ~ ~ ~ ~ ~ bd")
    .gain(1.2).shape(0.45).lpf(120),
  note("~ ~ ~ ~ ~ ~ [e3,b3] [e3,b3]")
    .s("sawtooth").lpf(2500).gain(0.6).shape(0.6).distort(0.35)
)

// FULL SONG
slowcat(
  verse, verse, verse, verse,
  fill,
  chorus, chorus, chorus, chorus,
  verse, verse, verse, verse,
  fill,
  chorus, chorus, chorus, chorus,
  bridge, bridge, bridge, bridge,
  fill,
  chorus, chorus, chorus, chorus
)
