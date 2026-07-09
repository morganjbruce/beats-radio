// Genre: Refrigerator Box Kingdom Synth
// Era: 1994 suburban Saturday afternoon
// Mood: Heroic, imaginative, slightly cramped
// The epic soundtrack playing in your head while defending your cardboard castle

setcps(110/60/4)

let intro = stack(
  s("piano").note("c4 e4 g4 c5 e5 c5 g4 e4").gain(0.4).room(0.8).lpf(800),
  s("shaker*4").gain(0.2)
)

let verse = stack(
  s("bd [~ bd] ~ bd, ~ sd ~ sd").gain(0.7).lpf(2000).room(0.3),
  s("hh*8").gain(0.3).lpf(3000),
  s("sine").note("c3 c3 g2 g2 a2 a2 f2 f2").gain(0.5).lpf(200),
  s("piano").note("c4 e4 g4 e4 c5 g4 e4 c4").gain(0.4).room(0.6).lpf(1500),
  s("casio").note("~ c5 ~ e5 ~ g5 e5 ~").gain(0.25).room(0.7).lpf(2500)
)

let chorus = stack(
  s("bd bd ~ bd, ~ [sd sd] ~ sd").gain(0.8).shape(0.3),
  s("hh*16").gain(0.35).lpf(4000),
  s("oh ~ ~ oh ~ ~ oh ~").gain(0.3).room(0.5),
  s("sine").note("c3 c3 f2 f2 g2 g2 c3 c3").gain(0.6).lpf(200),
  s("piano").note("c4 e4 g4 c5 f4 a4 c5 f5 g4 b4 d5 g5 c5 e5 g5 c6").gain(0.55).room(0.5),
  s("sawtooth").note("c5 e5 g5 c6 e6 c6 g5 e5").gain(0.3).lpf(1800).room(0.6),
  s("casio").note("c6 ~ e6 ~ g6 ~ c6 ~").gain(0.2).room(0.8).lpf(3000)
)

let bridge = stack(
  s("bd ~ ~ ~, ~ sd ~ ~").gain(0.5).room(0.7),
  s("shaker*4").gain(0.3),
  s("sine").note("a2 a2 e2 e2 f2 f2 g2 g2").gain(0.45).lpf(200),
  s("piano").note("a4 c5 e5 a5 c6 a5 e5 c5").gain(0.4).room(0.7).lpf(1200),
  s("rhodes").note("a3 ~ e4 ~ c4 ~ a3 ~").gain(0.3).room(0.6)
)

let fill = stack(
  s("bd sd bd [sd sd sd]").gain(0.8).room(0.3),
  s("oh ~ crash ~").gain(0.4).room(0.6),
  s("piano").note("c4 e4 g4 c5 e5 g5 c6 ~").gain(0.5).room(0.5)
)

let outro = stack(
  s("piano").note("c6 g5 e5 c5 g4 e4 c4 ~").gain(0.35).room(0.9).lpf(600),
  s("shaker*2").gain(0.15),
  s("sine").note("c3 ~ ~ ~").gain(0.3).lpf(300).room(0.8)
)

slowcat(
  intro, intro,
  verse, verse, verse, verse,
  fill,
  chorus, chorus, chorus, chorus,
  verse, verse, verse, verse,
  fill,
  chorus, chorus, chorus, chorus,
  bridge, bridge, bridge, bridge,
  fill,
  chorus, chorus, chorus, chorus,
  outro, outro
)
