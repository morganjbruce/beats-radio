// Sad piano song - sparse and haunting
// Paste into https://strudel.cc

setcps(66/60/4)

// Consistent electronic beat elements
let verseBeat = stack(
  s("bd ~ ~ ~ bd ~ ~ ~").gain(0.3).lpf(100).shape(0.2),
  s("~ ~ ~ ~ ~ ~ cp ~").gain(0.18).room(0.4).crush(10),
  s("hh*8").gain("0.12 0.06 0.1 0.06 0.12 0.06 0.1 0.08").crush(12).room(0.3)
)

let chorusBeat = stack(
  s("bd ~ ~ ~ bd ~ ~ bd").gain(0.35).lpf(100).shape(0.2),
  s("~ ~ ~ ~ cp ~ ~ ~").gain(0.22).room(0.4).crush(9),
  s("hh*8").gain("0.14 0.07 0.12 0.07 0.14 0.07 0.12 0.09").crush(11).room(0.3),
  s("~ ~ ~ ~ ~ ~ ~ rim").gain(0.1).room(0.5).crush(8)
)

let bridgeBeat = stack(
  s("bd ~ ~ ~ ~ ~ ~ ~").gain(0.25).lpf(80).shape(0.15),
  s("~ ~ ~ ~ ~ ~ cp ~").gain(0.12).room(0.5).crush(8),
  s("hh*8").gain("0.08 0.04 0.06 0.04 0.08 0.04 0.06 0.05").crush(10).room(0.4)
)

let outroBeat = stack(
  s("hh*8").gain("0.05 0.02 0.04 0.02 0.05 0.02 0.04 0.03").crush(8).room(0.5)
)

// VERSE - Am -> E7 -> Fmaj7 -> Bdim
let v1 = stack(
  note("[a2,e3,a3] ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.55).room(0.6),
  note("~ ~ ~ ~ e4 ~ ~ ~").s("piano").gain(0.3).room(0.7),
  verseBeat
)
let v2 = stack(
  note("~ ~ [e2,g#3,d4] ~ ~ ~ ~ ~").s("piano").gain(0.5).room(0.6),
  note("~ ~ ~ ~ ~ ~ b3 ~").s("piano").gain(0.25).room(0.7),
  verseBeat
)
let v3 = stack(
  note("[f2,e3,a3] ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.55).room(0.6),
  note("~ ~ ~ ~ ~ ~ ~ c4").s("piano").gain(0.3).room(0.7),
  verseBeat
)
let v4 = stack(
  note("~ ~ ~ ~ [b2,d3,f3] ~ ~ ~").s("piano").gain(0.45).room(0.65),
  verseBeat
)

// CHORUS - Dm -> Bb -> Esus4 -> Am
let c1 = stack(
  note("[d2,a2,d3,f3] ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.6).room(0.55),
  note("~ ~ ~ ~ a4 ~ ~ ~").s("piano").gain(0.35).room(0.6),
  note("d1 ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.4).room(0.4),
  chorusBeat
)
let c2 = stack(
  note("~ ~ [bb1,f2,bb2,d3] ~ ~ ~ ~ ~").s("piano").gain(0.6).room(0.55),
  note("~ ~ ~ ~ ~ ~ f4 ~").s("piano").gain(0.35).room(0.6),
  chorusBeat
)
let c3 = stack(
  note("[e2,a2,b2,e3] ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.6).room(0.6),
  note("~ ~ ~ ~ ~ b4 ~ ~").s("piano").gain(0.35).room(0.65),
  note("e1 ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.4).room(0.4),
  chorusBeat
)
let c4 = stack(
  note("~ ~ ~ [a2,e3,a3] ~ ~ ~ ~").s("piano").gain(0.55).room(0.6),
  note("~ ~ ~ ~ ~ ~ ~ e4").s("piano").gain(0.3).room(0.7),
  chorusBeat
)

// BRIDGE - F#dim -> Dm/A -> E -> Silence
let b1 = stack(
  note("[f#2,a2,c3] ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.5).room(0.7),
  note("~ ~ ~ ~ ~ ~ c4 ~").s("piano").gain(0.25).room(0.75),
  bridgeBeat
)
let b2 = stack(
  note("~ ~ ~ ~ [a1,d2,f2] ~ ~ ~").s("piano").gain(0.5).room(0.7),
  bridgeBeat
)
let b3 = stack(
  note("[e2,g#2,b2] ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.55).room(0.7),
  note("~ ~ ~ g#4 ~ ~ ~ ~").s("piano").gain(0.3).room(0.75),
  bridgeBeat
)
let b4 = stack(
  s("noise").lpf(200).gain(0.03).room(0.8),
  s("hh*4").gain("0.04 0.02 0.03 0.02").crush(6).room(0.6)
)

// OUTRO - fading
let o1 = stack(
  note("[a2,e3] ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.35).room(0.8),
  outroBeat
)
let o2 = stack(
  note("~ ~ ~ ~ ~ ~ e4 ~").s("piano").gain(0.2).room(0.85),
  outroBeat
)
let o3 = stack(
  note("~ ~ [a2,e3] ~ ~ ~ ~ ~").s("piano").gain(0.25).room(0.85),
  s("hh*4").gain("0.03 0.015 0.02 0.015").crush(6).room(0.6)
)
let o4 = stack(
  note("~ ~ ~ ~ ~ ~ ~ a3").s("piano").gain(0.15).room(0.9)
)

// FULL SONG
slowcat(
  v1, v2, v3, v4,
  c1, c2, c3, c4,
  v1, v2, v3, v4,
  c1, c2, c3, c4,
  b1, b2, b3, b4,
  v1, v2, v3, v4,
  o1, o2, o3, o4
)
