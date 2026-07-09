// Clipse - Grindin' style beat
// Neptunes minimal percussion vibes
// Paste into https://strudel.cc

setcps(96/60/4)

stack(
  // That iconic kick pattern
  s("bd bd ~ ~ bd ~ ~ ~ bd bd ~ ~ bd ~ ~ ~")
    .gain(1.1)
    .shape(0.3),

  // Snare on 2 and 4
  s("~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~")
    .gain(1)
    .room(0.1),

  // Tongue click / rim sound - the signature
  s("~ rim ~ rim ~ rim ~ rim")
    .gain(0.7)
    .speed(1.3)
    .shape(0.2),

  // Sparse hi-hat
  s("~ ~ hh ~ ~ ~ hh ~")
    .gain(0.5),

  // Shaker for texture
  s("shaker*8")
    .gain("0.25 0.1 0.2 0.1 0.25 0.1 0.2 0.15"),

  // Low tom hits for weight
  s("~ ~ ~ ~ ~ ~ lt ~")
    .gain(0.6)
    .shape(0.2)
    .slow(2),

  // Minimal bass stab - just for weight
  note("f1 ~ ~ ~ ~ ~ ~ ~ f1 ~ ~ ~ ~ ~ ~ ~")
    .s("square")
    .lpf(80)
    .gain(0.6)
    .decay(0.1)
    .sustain(0.3),

  // Dark staccato synth stabs - Neptunes style
  note("~ ~ f4 ~ ~ ~ ~ ~ ~ ~ eb4 ~ ~ ~ c4 ~")
    .s("square")
    .lpf(1200)
    .resonance(10)
    .gain(0.35)
    .decay(0.08)
    .sustain(0.05)
    .shape(0.3)
    .pan(0.4),

  // Octave double for thickness
  note("~ ~ f3 ~ ~ ~ ~ ~ ~ ~ eb3 ~ ~ ~ c3 ~")
    .s("square")
    .lpf(800)
    .gain(0.25)
    .decay(0.08)
    .sustain(0.05)
    .pan(0.6),

  // Occasional high accent
  note("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ f5")
    .s("triangle")
    .lpf(3000)
    .gain(0.2)
    .decay(0.05)
    .sustain(0.02)
    .slow(2)
)
