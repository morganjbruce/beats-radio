// Doodling Your Name
// Margin-Doodle Sunshine Twee-Pop · timeless schoolyard afternoon · giddy, weightless, secretly smiling

// Genre: Margin-Doodle Sunshine Twee-Pop
// Era: timeless schoolyard afternoon
// Mood: giddy, weightless, secretly smiling
// Sounds: rhodes chords, marimba melody, vibraphone sparkle, sine sub bass, bd/rim/hh/shaker groove
// Sound choice: warm organic mallets + rhodes for flushed-cheeks playfulness over a tiptoeing groove

setcps(0.45)

// ---------- shared grooves ----------
let drumsV = stack(
  s("bd ~ rim ~ bd ~ rim ~").gain(0.55),
  s("hh*8").gain(0.2)
)

let drumsC = stack(
  s("bd ~ rim ~ bd ~ rim [~ bd]").gain(0.6),
  s("hh*8").gain(0.24),
  s("~ shaker ~ shaker").gain(0.28),
  s("~ ~ ~ ~ ~ ~ ~ oh").gain(0.16)
)

// ---------- intro: a glance across the room ----------
let introC = stack(
  note("[c3,e3,g3,b3]").struct("x ~ ~ ~ ~ ~ x ~").s("rhodes").gain(0.36).room(0.5),
  note("~ ~ e4 g4 ~ ~ ~ ~").s("marimba").gain(0.3).room(0.5),
  s("~ hh ~ hh").gain(0.12)
)

let introAm = stack(
  note("[a2,c3,e3,g3]").struct("x ~ ~ ~ ~ ~ x ~").s("rhodes").gain(0.36).room(0.5),
  note("~ ~ c4 e4 ~ ~ ~ ~").s("marimba").gain(0.3).room(0.5),
  s("~ hh ~ hh").gain(0.12)
)

// ---------- verse: butterflies start ----------
let verseC = stack(
  note("c2 ~ c2 [~ g2]").s("sine").lpf(170).gain(0.6),
  note("[c3,e3,g3,b3]").struct("x ~ ~ x ~ ~ x ~").s("rhodes").gain(0.38).room(0.3),
  note("e4 ~ g4 a4 ~ g4 e4 ~").s("marimba").gain(0.42).room(0.4),
  drumsV
)

let verseAm = stack(
  note("a1 ~ a1 [~ e2]").s("sine").lpf(170).gain(0.6),
  note("[a2,c3,e3,g3]").struct("x ~ ~ x ~ ~ x ~").s("rhodes").gain(0.38).room(0.3),
  note("e4 ~ c4 ~ d4 c4 a3 ~").s("marimba").gain(0.42).room(0.4),
  drumsV
)

let verseF = stack(
  note("f1 ~ f1 [~ c2]").s("sine").lpf(170).gain(0.6),
  note("[f2,a2,c3,e3]").struct("x ~ ~ x ~ ~ x ~").s("rhodes").gain(0.38).room(0.3),
  note("f4 ~ a4 ~ g4 f4 e4 ~").s("marimba").gain(0.42).room(0.4),
  drumsV
)

let verseG = stack(
  note("g1 ~ g1 [~ d2]").s("sine").lpf(170).gain(0.6),
  note("[g2,b2,d3,f3]").struct("x ~ ~ x ~ ~ x ~").s("rhodes").gain(0.38).room(0.3),
  note("d4 ~ g4 ~ b4 a4 g4 ~").s("marimba").gain(0.42).room(0.4),
  drumsV
)

// ---------- chorus: full-body grin ----------
let chorusC = stack(
  note("c2 ~ c2 c2 ~ g2 c2 ~").s("sine").lpf(190).gain(0.62),
  note("[c3,e3,g3,b3,d4]").struct("x ~ x ~ ~ x ~ x").s("rhodes").gain(0.4).room(0.3),
  note("g4 e4 ~ g4 a4 ~ b4 c5").s("vibraphone").gain(0.4).room(0.5),
  drumsC
)

let chorusAm = stack(
  note("a1 ~ a1 a1 ~ e2 a1 ~").s("sine").lpf(190).gain(0.62),
  note("[a2,c3,e3,g3,b3]").struct("x ~ x ~ ~ x ~ x").s("rhodes").gain(0.4).room(0.3),
  note("e4 ~ a4 g4 ~ e4 d4 c4").s("vibraphone").gain(0.4).room(0.5),
  drumsC
)

let chorusF = stack(
  note("f1 ~ f1 f1 ~ c2 f1 ~").s("sine").lpf(190).gain(0.62),
  note("[f2,a2,c3,e3,g3]").struct("x ~ x ~ ~ x ~ x").s("rhodes").gain(0.4).room(0.3),
  note("a4 ~ c5 ~ a4 g4 f4 ~").s("vibraphone").gain(0.4).room(0.5),
  drumsC
)

let chorusG = stack(
  note("g1 ~ g1 g1 ~ d2 g1 ~").s("sine").lpf(190).gain(0.62),
  note("[g2,b2,d3,f3,a3]").struct("x ~ x ~ ~ x ~ x").s("rhodes").gain(0.4).room(0.3),
  note("g4 a4 b4 ~ d5 ~ b4 g4").s("vibraphone").gain(0.4).room(0.5),
  drumsC
)

// ---------- bridge: holding your breath when they look over ----------
let bridgeF = stack(
  note("f1").s("sine").lpf(140).gain(0.5),
  note("[f2,a2,c3,e3,g3]").s("rhodes").attack(0.1).gain(0.34).room(0.6),
  note("f4 a4 c5 e5 c5 a4 f4 a4").s("vibraphone").gain(0.28).room(0.6).pan(sine.range(-0.4, 0.4).slow(4)),
  s("hh*4").gain(0.13)
)

let bridgeG = stack(
  note("g1").s("sine").lpf(140).gain(0.5),
  note("[g2,b2,d3,f3,a3]").s("rhodes").attack(0.1).gain(0.34).room(0.6),
  note("g4 b4 d5 f5 d5 b4 g4 b4").s("vibraphone").gain(0.28).room(0.6).pan(sine.range(0.4, -0.4).slow(4)),
  s("hh*4").gain(0.13)
)

// ---------- outro: closing the notebook, still smiling ----------
let outroC = stack(
  note("[c2,c3,e3,g3,b3,d4]").s("rhodes").attack(0.15).gain(0.34).room(0.7),
  note("~ ~ g4 ~ ~ e4 ~ ~").s("vibraphone").gain(0.24).room(0.7)
)

// ---------- arrangement ----------
slowcat(
  introC, introAm, introC, introAm,
  verseC, verseAm, verseF, verseG, verseC, verseAm, verseF, verseG,
  chorusC, chorusAm, chorusF, chorusG, chorusC, chorusAm, chorusF, chorusG,
  verseC, verseAm, verseF, verseG, verseC, verseAm, verseF, verseG,
  chorusC, chorusAm, chorusF, chorusG, chorusC, chorusAm, chorusF, chorusG,
  bridgeF, bridgeG, bridgeF, bridgeG,
  chorusC, chorusAm, chorusF, chorusG, chorusC, chorusAm, chorusF, chorusG,
  chorusC, chorusAm, chorusF, chorusG,
  outroC, outroC, outroC, outroC
)
