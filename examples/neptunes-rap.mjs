// Neptunes minimal rap beat
// With verse, fill, chorus, bridge
// Paste into https://strudel.cc

setcps(94/60/4)

// VERSE - sparse, minimal
let verse = stack(
  s("bd bd ~ ~ bd ~ ~ ~ bd bd ~ ~ bd ~ ~ ~")
    .gain(1.1).shape(0.35).lpf(150),
  s("~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~")
    .gain(0.95).room(0.15),
  s("rim rim rim rim rim rim rim rim")
    .gain("0.6 0.35 0.5 0.35 0.6 0.35 0.5 0.4").speed(1.4).shape(0.15),
  s("~ ~ ~ ~ hh ~ ~ ~ ~ ~ ~ ~ hh ~ ~ ~")
    .gain(0.4),
  note("~ ~ g4 ~ ~ ~ ~ ~ ~ ~ g4 ~ ~ ~ eb4 ~")
    .s("square").lpf(2500).resonance(12).gain(0.45).decay(0.04).sustain(0.02).shape(0.4),
  note("~ ~ g3 ~ ~ ~ ~ ~ ~ ~ g3 ~ ~ ~ eb3 ~")
    .s("square").lpf(1200).gain(0.35).decay(0.05).sustain(0.02).shape(0.3),
  note("g1 ~ ~ ~ ~ ~ ~ ~ g1 ~ ~ ~ ~ ~ ~ ~")
    .s("sine").lpf(80).gain(0.7).decay(0.15).sustain(0.4),
  s("shaker*8").gain("0.15 0.06 0.12 0.06 0.15 0.06 0.12 0.08")
)

// FILL - drop out, then hit
let fill = stack(
  s("~ ~ ~ ~ ~ ~ ~ bd")
    .gain(1.2).shape(0.4).lpf(150),
  s("~ ~ ~ ~ ~ ~ cp cp")
    .gain(0.95).room(0.2),
  s("rim ~ ~ ~ ~ ~ ~ ~")
    .gain(0.5).speed(1.4).shape(0.15),
  note("~ ~ ~ ~ ~ ~ ~ g4")
    .s("square").lpf(2500).resonance(12).gain(0.55).decay(0.04).sustain(0.02).shape(0.4)
)

// CHORUS - fuller, more aggressive stabs
let chorus = stack(
  s("bd bd ~ ~ bd ~ bd ~ bd bd ~ ~ bd ~ ~ bd")
    .gain(1.15).shape(0.4).lpf(150),
  s("~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~")
    .gain(1).room(0.15),
  s("rim rim rim rim rim rim rim rim")
    .gain("0.65 0.4 0.55 0.4 0.65 0.4 0.55 0.45").speed(1.4).shape(0.15),
  s("hh*8").gain("0.35 0.15 0.25 0.15 0.35 0.15 0.25 0.2"),
  note("g4 ~ g4 ~ ~ ~ eb4 ~ g4 ~ g4 ~ ~ ~ f4 ~")
    .s("square").lpf(2800).resonance(14).gain(0.5).decay(0.04).sustain(0.02).shape(0.45),
  note("g3 ~ g3 ~ ~ ~ eb3 ~ g3 ~ g3 ~ ~ ~ f3 ~")
    .s("square").lpf(1400).gain(0.4).decay(0.05).sustain(0.02).shape(0.35),
  note("g1 ~ ~ ~ g1 ~ ~ ~ g1 ~ ~ ~ g1 ~ eb1 ~")
    .s("sine").lpf(80).gain(0.75).decay(0.15).sustain(0.4),
  s("shaker*8").gain("0.18 0.08 0.14 0.08 0.18 0.08 0.14 0.1"),
  s("~ ~ ~ ~ ~ ~ ~ lt").gain(0.4).lpf(200).shape(0.2)
)

// BRIDGE - stripped, tension
let bridge = stack(
  s("bd ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~ ~ ~")
    .gain(1).shape(0.3).lpf(120),
  s("~ ~ ~ ~ ~ ~ cp ~")
    .gain(0.8).room(0.3),
  s("rim ~ rim ~ rim ~ rim ~")
    .gain(0.45).speed(1.4).shape(0.1),
  note("~ ~ ~ ~ eb4 ~ ~ ~ ~ ~ ~ ~ d4 ~ ~ ~")
    .s("square").lpf(2000).resonance(10).gain(0.4).decay(0.06).sustain(0.03).shape(0.35),
  note("eb1 ~ ~ ~ ~ ~ ~ ~ d1 ~ ~ ~ ~ ~ ~ ~")
    .s("sine").lpf(70).gain(0.6).decay(0.2).sustain(0.5),
  s("noise").lpf(sine.range(100, 400).slow(4)).gain(0.06)
)

// FULL SONG STRUCTURE
slowcat(
  // Verse 1
  verse, verse, verse, verse,
  // Fill into chorus
  fill,
  // Chorus
  chorus, chorus, chorus, chorus,
  // Verse 2
  verse, verse, verse, verse,
  // Fill into chorus
  fill,
  // Chorus
  chorus, chorus, chorus, chorus,
  // Bridge
  bridge, bridge, bridge, bridge,
  // Final verse
  verse, verse, verse, verse
)
