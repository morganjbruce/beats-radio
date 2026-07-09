// Hip-Hop Beat in Strudel
// Paste this into https://strudel.cc to play

// Set the tempo - classic boom bap around 90 BPM
setcps(90/60/4)

// Drum pattern with layered elements
stack(
  // Kick drum - heavy on the 1, with some syncopation
  s("bd*2 ~ bd ~ bd*2 ~ bd ~")
    .gain(1.2)
    .lpf(200),

  // Snare on 2 and 4 with ghost notes
  s("~ sd ~ sd")
    .gain(1)
    .room(0.2),

  // Hi-hats - 16th note groove with velocity variation
  s("hh*16")
    .gain("0.6 0.3 0.5 0.3 0.6 0.3 0.5 0.4")
    .pan(sine.range(0.3, 0.7).slow(4)),

  // Open hat for flavor
  s("~ ~ ~ oh ~ ~ ~ ~")
    .gain(0.5)
    .decay(0.1),

  // 808 bass - deep and subby
  note("<c2 c2 eb2 f2>")
    .s("sawtooth")
    .lpf(100)
    .decay(0.3)
    .sustain(0.4)
    .gain(0.9),

  // Vinyl crackle for that lo-fi feel
  s("~ vinyl:3 ~ ~")
    .gain(0.15)
    .slow(2)
)

// Alternative boom-bap pattern (uncomment to try):
// stack(
//   s("[bd ~ ~ bd] [~ ~ bd ~] [bd ~ ~ bd] [~ ~ ~ ~]"),
//   s("~ cp ~ cp").room(0.3),
//   s("hh(5,8)").gain(0.6),
//   note("c2 ~ eb2 ~").s("sawtooth").lpf(80).gain(0.8)
// )
