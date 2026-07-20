// Hips Against the Cold Wall
// Disco-Punk Telegram (groove-forward post-punk revival) · early-2000s post-punk revival, refracted through dance-punk · nervy but swaggering — taut, danceable, leaning forward with a hip-swinging undertow rather than a straight driving charge

// Genre: Disco-Punk Telegram (groove-forward post-punk revival)
// Era: early-2000s post-punk revival, dance-punk refracted
// Mood: nervy swagger, taut but hip-swinging and danceable
// Sounds: sawtooth guitar-stabs, filtered sawtooth bass, sawtooth lead, RolandTR909 kit, shaker
// Sound choice: clipped saw stabs as palm-muted guitar over a syncopated 909 disco-punk groove

setcps(0.52)

const kick = s("bd ~ ~ bd ~ bd ~ ~").bank("RolandTR909").gain(0.85)
  .mask("<1 1 1 1 1 1 1 1 0 0 1 1 1 1 1 1>")

const clap = s("~ ~ cp ~ ~ ~ cp ~").bank("RolandTR909").gain(0.5).room(0.2)

const hats = s("hh*8").bank("RolandTR909")
  .gain("0.3 0.16 0.26 0.16 0.32 0.16 0.26 0.2").pan(0.12)

const ohats = s("~ ~ ~ oh ~ ~ ~ oh").bank("RolandTR909").gain(0.26)

const shaker = s("shaker*4").gain(0.22).pan(-0.15)

const bass = note("<d2 bb1 c2 a1>")
  .struct("x ~ x x ~ x ~ x")
  .s("sawtooth").lpf(440).shape(0.3).decay(0.2).sustain(0.25).gain(0.5)

const chords = note("<[d3,f3,a3,e4] [bb2,d3,f3,a3] [c3,e3,g3,d4] [a2,c#3,e3,g3]>")
  .struct("~ x ~ x x ~ x ~")
  .s("sawtooth").lpf(sine.range(1200,2500).slow(8)).resonance(6)
  .decay(0.18).sustain(0).hpf(180).gain(0.3).room(0.18)
  .mask("<0 0 1 1 1 1 1 1 1 1 1 1 0 1 1 1>")

const lead = note("<[d5 ~ a4 ~ f5 e5 ~ d5] [c5 ~ a4 ~ e5 d5 ~ c5] [e5 ~ c5 ~ g5 f5 ~ e5] [a4 ~ e4 ~ c#5 ~ e5 ~]>")
  .s("sawtooth").lpf(2600).resonance(4).gain(0.32)
  .delay(0.3).delaytime(0.1875).delayfeedback(0.3).room(0.25).pan(0.05)
  .mask("<0 0 0 0 1 1 1 1 1 1 0 1 1 1 1 1>")

stack(
  kick,
  clap,
  hats,
  ohats,
  shaker,
  bass,
  chords,
  lead
)
