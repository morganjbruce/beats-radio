// Sprinklers on the Hot Sidewalk
// Sun-Bleached Balearic Daydream · imagined late-afternoon 1987 / timeless · warm, breezy, head-nodding contentment

// Genre: Sun-Bleached Balearic Daydream
// Era: imagined late-afternoon 1987 / timeless
// Mood: warm, breezy, head-nodding contentment
// Sounds: Rhodes chords, marimba hook, sine sub bass, 808 kick+clap, shaker/hats, vibraphone accents
// Sound choice: Rhodes + marimba for golden organic warmth, soft 808 groove for an unhurried sway
setcps(92/60/4)

let groove = stack(
  s("bd ~ ~ ~ bd ~ ~ ~").gain(0.75).bank("RolandTR808"),
  s("~ ~ ~ ~ cp ~ ~ ~").gain(0.4),
  s("hh*8").gain(0.22).pan(sine.range(-0.3,0.3)),
  s("shaker ~ shaker ~ shaker ~ shaker shaker").gain(0.28)
)

let grooveB = stack(
  s("bd ~ ~ bd ~ ~ bd ~").gain(0.7).bank("RolandTR808"),
  s("~ ~ ~ ~ cp ~ ~ ~").gain(0.4),
  s("hh*8").gain(0.22).pan(sine.range(-0.3,0.3)),
  s("~ ~ ~ ~ ~ ~ ~ oh").gain(0.25)
)

const main = (chord, root, arp) => stack(
  groove,
  note(root).struct("x ~ ~ x ~ x ~ ~").s("sine").lpf(170).gain(0.55),
  note(chord).s("rhodes").lpf(2200).gain(0.4).room(0.4).attack(0.04),
  note(arp).s("marimba").gain(0.42).room(0.3)
)

const vary = (chord, root, arp) => stack(
  grooveB,
  note(root).struct("x ~ x ~ ~ x ~ ~").s("sine").lpf(190).gain(0.55),
  note(chord).s("rhodes").lpf(2600).gain(0.38).room(0.45).attack(0.06),
  note(arp).s("vibraphone").gain(0.2).room(0.5)
)

let intro = stack(
  note("d3,f#3,a3,c#4,e4").s("rhodes").lpf(1500).gain(0.34).room(0.5).attack(0.12),
  s("shaker*4").gain(0.22),
  note("f#4 ~ a4 ~ e5 ~ c#5 ~").s("marimba").gain(0.3).room(0.4)
)

let mainD = main("d3,f#3,a3,c#4,e4","d2","f#4 ~ a4 ~ e5 ~ c#5 ~")
let mainE = main("e3,g#3,b3,d#4","e2","g#4 ~ b4 ~ f#5 ~ d#5 ~")
let mainBm = main("b2,d3,f#3,a3,c#4","b1","f#4 ~ a4 ~ c#5 ~ b4 ~")
let mainG = main("g2,b2,d3,f#3,a3","g1","g4 ~ b4 ~ d5 ~ a4 ~")

let varD = vary("d3,f#3,a3,c#4,e4","d2","~ f#4 a4 ~ e5 ~ c#5 b4")
let varE = vary("e3,g#3,b3,d#4","e2","~ g#4 b4 ~ f#5 ~ d#5 b4")
let varBm = vary("b2,d3,f#3,a3,c#4","b1","~ f#4 a4 ~ c#5 ~ b4 a4")
let varG = vary("g2,b2,d3,f#3,a3","g1","~ g4 b4 ~ d5 ~ a4 f#4")

let outro = stack(
  note("d3,f#3,a3,c#4,e4").s("rhodes").lpf(1400).gain(0.32).room(0.6).attack(0.2),
  s("shaker*4").gain(0.18),
  note("f#4 ~ a4 ~ e5 ~ ~ d5").s("vibraphone").gain(0.18).room(0.6)
)

slowcat(
  intro, intro, intro, intro,
  mainD, mainE, mainBm, mainG,
  mainD, mainE, mainBm, mainG,
  mainD, mainE, mainBm, mainG,
  varD, varE, varBm, varG,
  varD, varE, varBm, varG,
  mainD, mainE, mainBm, mainG,
  mainD, mainE, mainBm, mainG,
  varD, varE, varBm, varG,
  mainD, mainE, mainBm, mainG,
  outro, outro, outro, outro
)
