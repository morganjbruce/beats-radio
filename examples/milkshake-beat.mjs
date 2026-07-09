// Kelis - Milkshake style beat
// With verse, chorus, and breakdown
// Paste into https://strudel.cc

setcps(110/60/4)

// VERSE - basic groove
let verse = stack(
  s("bd ~ ~ ~ bd ~ ~ bd").gain(1.1).shape(0.25),
  s("~ ~ ~ cp ~ ~ cp ~").gain(0.9).room(0.15),
  s("~ sn:3 ~ ~ ~ sn:3 ~ sn:3").gain(0.35).speed(1.4),
  s("hh ~ hh ~ hh ~ hh ~").gain(0.4),
  note("g2 ~ g2 g3 ~ g2 bb2 ~ g2 ~ g2 g3 ~ a2 bb2 c3")
    .s("square").lpf(350).resonance(8).gain(0.75).decay(0.12).sustain(0.5).shape(0.35),
  note("~ ~ [g4,bb4] ~ ~ ~ ~ ~ ~ ~ [f4,a4] ~ ~ ~ ~ ~")
    .s("square").lpf(2500).gain(0.3).decay(0.06).sustain(0.03).room(0.2),
  s("shaker*8").gain("0.2 0.08 0.15 0.1 0.2 0.08 0.18 0.1")
)

// CHORUS - fuller, more energy
let chorus = stack(
  s("bd ~ ~ ~ bd ~ ~ bd").gain(1.1).shape(0.25),
  s("~ ~ ~ cp ~ ~ cp ~").gain(1).room(0.2),
  s("~ sn:3 ~ ~ ~ sn:3 ~ sn:3").gain(0.5).speed(1.4),
  s("hh*16").gain("0.4 0.2 0.3 0.2"),
  note("g2 ~ g2 g3 ~ g2 bb2 ~ g2 ~ g2 g3 ~ a2 bb2 c3")
    .s("square").lpf(350).resonance(8).gain(0.8).decay(0.12).sustain(0.5).shape(0.35),
  note("~ ~ [g4,bb4] ~ ~ ~ ~ ~ ~ ~ [f4,a4] ~ ~ ~ ~ ~")
    .s("square").lpf(2500).gain(0.4).decay(0.06).sustain(0.03).room(0.3),
  note("g5 ~ d5 ~ bb4 ~ d5 ~").s("triangle").lpf(4000).gain(0.2).decay(0.04).sustain(0.01)
    .pan(sine.range(0.3, 0.7).fast(2)),
  note("[g3,bb3,d4]").s("sawtooth").lpf(800).attack(0.1).decay(0.3).sustain(0.4).gain(0.2).room(0.4),
  s("shaker*8").gain("0.25 0.1 0.2 0.12 0.25 0.1 0.2 0.12")
)

// BREAKDOWN - stripped back, tension
let breakdown = stack(
  note("g2 ~ ~ ~ ~ ~ ~ ~").s("square").lpf(250).gain(0.6).decay(0.2).sustain(0.6).shape(0.35),
  s("shaker*8").gain("0.1 0.04 0.08 0.05 0.1 0.04 0.08 0.05"),
  s("noise").lpf(sine.range(200, 1500).slow(4)).gain(0.08)
)

// Structure: verse -> chorus -> verse -> breakdown (4 bars each)
slowcat(verse, verse, verse, verse,
        chorus, chorus, chorus, chorus,
        verse, verse, verse, verse,
        breakdown, breakdown, breakdown, breakdown)
