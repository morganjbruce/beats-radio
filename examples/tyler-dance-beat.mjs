// Later Tyler, The Creator style beat
// Funky, bouncy, IGOR/CMIYGL vibes - DIRTY VERSION
// Paste into https://strudel.cc

setcps(108/60/4)

stack(
  // Punchy kick with saturation and grit
  s("bd ~ ~ bd ~ bd ~ ~")
    .gain(1.2)
    .shape(0.6)
    .distort(0.15)
    .lpf(180),

  // Snare with crunch
  s("~ [~ cp] ~ cp")
    .gain(0.95)
    .room(0.25)
    .crush(10)
    .shape(0.3),

  // Funky syncopated rimshot
  s("~ rim ~ ~ rim ~ ~ rim")
    .gain(0.5)
    .coarse(8),

  // Shuffled hi-hats - bit crushed for texture
  s("hh*8")
    .gain("0.7 0.35 0.6 0.4 0.7 0.35 0.65 0.4")
    .swing(0.2)
    .pan("0.3 0.7")
    .crush(12)
    .shape(0.2),

  // Neo-soul chord stabs
  note("<[c4,e4,g4,b4] [a3,c4,e4,g4] [f3,a3,c4,e4] [g3,b3,d4,f4]>")
    .s("sawtooth")
    .cutoff(1800)
    .resonance(8)
    .attack(0.01)
    .decay(0.2)
    .sustain(0.3)
    .release(0.3)
    .gain(0.4)
    .room(0.3)
    .delay(0.2)
    .delaytime(0.375),

  // DIRTY synth bass - simpler pocket
  note("c2 ~ ~ ~ a1 ~ ~ ~ f1 ~ ~ ~ g1 ~ ~ ~")
    .s("square")
    .lpf(500)
    .resonance(15)
    .gain(0.8)
    .decay(0.2)
    .sustain(0.8)
    .shape(0.5)
    .distort(0.25),

  // Extra sub layer with grit
  note("c1 ~ ~ ~ a0 ~ ~ ~ f0 ~ ~ ~ g0 ~ ~ ~")
    .s("sawtooth")
    .lpf(120)
    .gain(0.5)
    .shape(0.4),

  // Funky stab
  note("~ [e4,g4] ~ ~ ~ [c4,e4] ~ ~")
    .s("triangle")
    .cutoff(2200)
    .gain(0.3)
    .decay(0.08)
    .sustain(0.1)
    .pan(0.6),

  // Shaker with crunch
  s("shaker*16")
    .gain("0.2 0.1 0.15 0.1")
    .pan(0.7)
    .crush(8),

  // Noise hit on downbeats for extra punch
  s("noise:1 ~ ~ ~")
    .gain(0.12)
    .decay(0.03)
    .lpf(400)
)
