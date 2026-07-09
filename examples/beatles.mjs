// Beatles-style pop song
// Jangly, melodic, with unexpected turns
// Paste into https://strudel.cc

setcps(120/60/4)

// VERSE BARS - jangly, melodic
let v1 = stack(
  s("bd ~ ~ ~ bd ~ ~ ~").gain(0.9).shape(0.2),
  s("~ ~ ~ ~ sd ~ ~ ~").gain(0.85).room(0.25),
  s("hh*8").gain("0.4 0.2 0.35 0.2 0.4 0.2 0.35 0.25"),
  note("[g3,b3,d4] ~ ~ ~ ~ ~ ~ ~").s("triangle").lpf(3500).gain(0.4).decay(0.3).sustain(0.4).room(0.3),
  note("[g2,b2,d3] ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.5).room(0.35),
  note("g2 ~ b2 ~ g2 ~ a2 b2").s("sawtooth").lpf(300).gain(0.55).decay(0.15).sustain(0.6).shape(0.2),
  note("d4 ~ ~ b3 ~ ~ d4 ~").s("triangle").lpf(4000).gain(0.3).room(0.4)
)
let v2 = stack(
  s("bd ~ ~ ~ bd ~ ~ ~").gain(0.9).shape(0.2),
  s("~ ~ ~ ~ sd ~ ~ ~").gain(0.85).room(0.25),
  s("hh*8").gain("0.4 0.2 0.35 0.2 0.4 0.2 0.35 0.25"),
  note("[c3,e3,g3] ~ ~ ~ ~ ~ ~ ~").s("triangle").lpf(3500).gain(0.4).decay(0.3).sustain(0.4).room(0.3),
  note("[c2,e2,g2] ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.5).room(0.35),
  note("c2 ~ e2 ~ c2 ~ d2 e2").s("sawtooth").lpf(300).gain(0.55).decay(0.15).sustain(0.6).shape(0.2),
  note("e4 ~ ~ c4 ~ ~ e4 ~").s("triangle").lpf(4000).gain(0.3).room(0.4)
)
let v3 = stack(
  s("bd ~ ~ ~ bd ~ ~ ~").gain(0.9).shape(0.2),
  s("~ ~ ~ ~ sd ~ ~ ~").gain(0.85).room(0.25),
  s("hh*8").gain("0.4 0.2 0.35 0.2 0.4 0.2 0.35 0.25"),
  note("[d3,f#3,a3] ~ ~ ~ ~ ~ ~ ~").s("triangle").lpf(3500).gain(0.4).decay(0.3).sustain(0.4).room(0.3),
  note("[d2,f#2,a2] ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.5).room(0.35),
  note("d2 ~ f#2 ~ d2 ~ e2 f#2").s("sawtooth").lpf(300).gain(0.55).decay(0.15).sustain(0.6).shape(0.2),
  note("f#4 ~ ~ d4 ~ ~ f#4 ~").s("triangle").lpf(4000).gain(0.3).room(0.4)
)
let v4 = stack(
  s("bd ~ ~ ~ bd ~ ~ ~").gain(0.9).shape(0.2),
  s("~ ~ ~ ~ sd ~ ~ ~").gain(0.85).room(0.25),
  s("hh*8").gain("0.4 0.2 0.35 0.2 0.4 0.2 0.35 0.25"),
  note("[g3,b3,d4] ~ ~ ~ ~ ~ ~ ~").s("triangle").lpf(3500).gain(0.4).decay(0.3).sustain(0.4).room(0.3),
  note("[g2,b2,d3] ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.5).room(0.35),
  note("g2 ~ b2 ~ g2 ~ a2 b2").s("sawtooth").lpf(300).gain(0.55).decay(0.15).sustain(0.6).shape(0.2),
  note("b3 ~ ~ g3 ~ ~ a3 ~").s("triangle").lpf(4000).gain(0.3).room(0.4)
)

// CHORUS BARS - lifts, more energy
let chorusDrums = stack(
  s("bd ~ bd ~ sd ~ bd ~").gain(0.95).shape(0.2),
  s("~ ~ ~ ~ sd ~ ~ ~").gain(0.9).room(0.3),
  s("hh*8").gain("0.45 0.25 0.4 0.25 0.45 0.25 0.4 0.3"),
  s("~ ~ ~ ~ ~ ~ ~ oh").gain(0.35).room(0.35)
)
let c1 = stack(
  chorusDrums,
  note("[c3,e3,g3,b3] ~ ~ ~ ~ ~ ~ ~").s("triangle").lpf(4000).gain(0.45).decay(0.25).sustain(0.5).room(0.35),
  note("[c2,e2,g2] ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.55).room(0.35),
  note("[c3,e3,g3]").s("sawtooth").lpf(1500).attack(0.2).sustain(0.6).gain(0.2).room(0.5),
  note("c2 ~ e2 g2 c2 ~ e2 ~").s("sawtooth").lpf(350).gain(0.6).decay(0.12).sustain(0.65).shape(0.2),
  note("g4 ~ ~ e4 ~ ~ g4 ~").s("triangle").lpf(4500).gain(0.3).room(0.4)
)
let c2 = stack(
  chorusDrums,
  note("[f3,a3,c4] ~ ~ ~ ~ ~ ~ ~").s("triangle").lpf(4000).gain(0.45).decay(0.25).sustain(0.5).room(0.35),
  note("[f2,a2,c3] ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.55).room(0.35),
  note("[f3,a3,c4]").s("sawtooth").lpf(1500).attack(0.2).sustain(0.6).gain(0.2).room(0.5),
  note("f2 ~ a2 c3 f2 ~ a2 ~").s("sawtooth").lpf(350).gain(0.6).decay(0.12).sustain(0.65).shape(0.2),
  note("a4 ~ ~ f4 ~ ~ a4 ~").s("triangle").lpf(4500).gain(0.3).room(0.4)
)
let c3 = stack(
  chorusDrums,
  note("[g3,b3,d4] ~ ~ ~ ~ ~ ~ ~").s("triangle").lpf(4000).gain(0.45).decay(0.25).sustain(0.5).room(0.35),
  note("[g2,b2,d3] ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.55).room(0.35),
  note("[g3,b3,d4]").s("sawtooth").lpf(1500).attack(0.2).sustain(0.6).gain(0.2).room(0.5),
  note("g2 ~ b2 d3 g2 ~ b2 ~").s("sawtooth").lpf(350).gain(0.6).decay(0.12).sustain(0.65).shape(0.2),
  note("b4 ~ ~ g4 ~ ~ b4 ~").s("triangle").lpf(4500).gain(0.3).room(0.4)
)
let c4 = stack(
  chorusDrums,
  note("[e3,g3,b3] ~ ~ ~ ~ ~ ~ ~").s("triangle").lpf(4000).gain(0.45).decay(0.25).sustain(0.5).room(0.35),
  note("[e2,g2,b2] ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.55).room(0.35),
  note("[e3,g3,b3]").s("sawtooth").lpf(1500).attack(0.2).sustain(0.6).gain(0.2).room(0.5),
  note("e2 ~ g2 b2 e2 ~ g2 ~").s("sawtooth").lpf(350).gain(0.6).decay(0.12).sustain(0.65).shape(0.2),
  note("e4 ~ ~ b3 ~ ~ e4 ~").s("triangle").lpf(4500).gain(0.3).room(0.4)
)

// BRIDGE BARS - unexpected key change feel
let bridgeDrums = stack(
  s("bd ~ ~ ~ bd ~ ~ ~").gain(0.85).shape(0.15),
  s("~ ~ ~ ~ sd ~ ~ ~").gain(0.8).room(0.35),
  s("hh ~ hh ~ hh ~ hh ~").gain(0.3)
)
let b1 = stack(
  bridgeDrums,
  note("[a3,c4,e4] ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.55).room(0.4),
  note("[a2,c3,e3]").s("sawtooth").lpf(1200).attack(0.3).sustain(0.5).gain(0.25).room(0.55),
  note("a1 ~ ~ c2 ~ ~ a1 ~").s("sawtooth").lpf(280).gain(0.55).decay(0.2).sustain(0.7).shape(0.15),
  note("e4 ~ ~ c4 ~ ~ a3 ~").s("triangle").lpf(4000).gain(0.35).room(0.5)
)
let b2 = stack(
  bridgeDrums,
  note("[f3,a3,c4] ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.55).room(0.4),
  note("[f2,a2,c3]").s("sawtooth").lpf(1200).attack(0.3).sustain(0.5).gain(0.25).room(0.55),
  note("f1 ~ ~ a1 ~ ~ f1 ~").s("sawtooth").lpf(280).gain(0.55).decay(0.2).sustain(0.7).shape(0.15),
  note("c4 ~ ~ a3 ~ ~ f4 ~").s("triangle").lpf(4000).gain(0.35).room(0.5)
)
let b3 = stack(
  bridgeDrums,
  note("[d3,f3,a3] ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.55).room(0.4),
  note("[d2,f2,a2]").s("sawtooth").lpf(1200).attack(0.3).sustain(0.5).gain(0.25).room(0.55),
  note("d1 ~ ~ f1 ~ ~ d1 ~").s("sawtooth").lpf(280).gain(0.55).decay(0.2).sustain(0.7).shape(0.15),
  note("f4 ~ ~ d4 ~ ~ a3 ~").s("triangle").lpf(4000).gain(0.35).room(0.5)
)
let b4 = stack(
  bridgeDrums,
  note("[e3,g#3,b3] ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.55).room(0.4),
  note("[e2,g#2,b2]").s("sawtooth").lpf(1200).attack(0.3).sustain(0.5).gain(0.25).room(0.55),
  note("e1 ~ ~ g#1 ~ ~ e1 ~").s("sawtooth").lpf(280).gain(0.55).decay(0.2).sustain(0.7).shape(0.15),
  note("e4 ~ ~ d4 ~ ~ b3 ~").s("triangle").lpf(4000).gain(0.35).room(0.5)
)

// FILL
let fill = stack(
  s("~ ~ ~ ~ sd ~ sd sd")
    .gain(0.9).room(0.25),
  s("~ ~ ~ ~ ~ ~ ~ bd")
    .gain(1).shape(0.25),
  note("~ ~ ~ ~ ~ ~ [g3,b3,d4] ~")
    .s("piano").gain(0.6).room(0.4)
)

// FULL SONG
slowcat(
  v1, v2, v3, v4,
  c1, c2, c3, c4,
  v1, v2, v3, v4,
  c1, c2, c3, c4,
  b1, b2, b3, b4,
  fill,
  c1, c2, c3, c4
)
