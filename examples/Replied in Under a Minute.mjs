// Replied in Under a Minute
// Heart-Flutter Bubble Bounce · perpetual springtime present · giddy, weightless, grinning at your phone

// Genre: Heart-Flutter Bubble Bounce
// Era: perpetual springtime present
// Mood: giddy, weightless, grinning at your phone
// Sounds: rhodes chords, vibraphone melody, marimba arps, sine sub bass, 808 drums (bd/cp/hh/oh), shaker
// Sound choice: warm glowing keys + playful mallets over a light bouncy groove = pure crush giddiness

setcps(0.47)

// ---------- shared drum layers ----------
let drumsVerse = stack(
  s("bd ~ ~ bd ~ ~ bd ~").bank("RolandTR808").gain(0.65),
  s("~ cp ~ cp").bank("RolandTR808").gain(0.45),
  s("hh*8").bank("RolandTR808").gain("0.3 0.15 0.22 0.15 0.3 0.15 0.22 0.15"),
  s("shaker*4").gain(0.18)
)

let drumsChorus = stack(
  s("bd*4").bank("RolandTR808").gain(0.7),
  s("~ cp ~ cp").bank("RolandTR808").gain(0.5),
  s("hh hh oh hh hh hh oh hh").bank("RolandTR808").gain(0.22),
  s("shaker*8").gain(0.13)
)

// ---------- intro / outro ----------
let intro = stack(
  note("c4 e4 g4 c5 g4 e4 g4 e4").s("marimba").gain(0.4).room(0.4).pan(sine.range(-0.3, 0.3).slow(4)),
  note("[e3,g3,b3,d4]").s("rhodes").attack(0.1).gain(0.3).room(0.4),
  s("shaker*4").gain(0.16)
)

let outro = stack(
  note("c4 e4 g4 c5 g4 e4 g4 e4").s("marimba").gain(0.32).room(0.7).pan(sine.range(-0.4, 0.4).slow(4)),
  note("[e3,g3,b3,d4]").s("rhodes").attack(0.2).gain(0.26).room(0.7),
  note("c2").s("sine").lpf(120).gain(0.4)
)

// ---------- verse (C - G - Am - F) ----------
let verseC = stack(
  drumsVerse,
  note("c2 ~ ~ c2 ~ ~ g2 ~").s("sine").lpf(150).gain(0.6),
  note("[e3,g3,b3,d4]").struct("~ x ~ ~ x ~ ~ x").s("rhodes").clip(0.8).gain(0.38).room(0.3),
  note("g4 ~ c5 ~ e5 d5 c5 ~").s("vibraphone").gain(0.42).room(0.5)
)
let verseG = stack(
  drumsVerse,
  note("g1 ~ ~ g1 ~ ~ d2 ~").s("sine").lpf(150).gain(0.6),
  note("[d3,g3,b3]").struct("~ x ~ ~ x ~ ~ x").s("rhodes").clip(0.8).gain(0.38).room(0.3),
  note("d5 ~ b4 ~ g4 a4 b4 ~").s("vibraphone").gain(0.42).room(0.5)
)
let verseAm = stack(
  drumsVerse,
  note("a1 ~ ~ a1 ~ ~ e2 ~").s("sine").lpf(150).gain(0.6),
  note("[e3,a3,c4]").struct("~ x ~ ~ x ~ ~ x").s("rhodes").clip(0.8).gain(0.38).room(0.3),
  note("c5 ~ e5 ~ a4 b4 c5 ~").s("vibraphone").gain(0.42).room(0.5)
)
let verseF = stack(
  drumsVerse,
  note("f1 ~ ~ f1 ~ ~ c2 ~").s("sine").lpf(150).gain(0.6),
  note("[f3,a3,c4,e4]").struct("~ x ~ ~ x ~ ~ x").s("rhodes").clip(0.8).gain(0.38).room(0.3),
  note("a4 ~ c5 d5 c5 ~ g4 ~").s("vibraphone").gain(0.42).room(0.5)
)

// ---------- chorus (C - G - Am - F, fuller & higher) ----------
let chorusC = stack(
  drumsChorus,
  note("c2 c2 ~ c2 ~ c2 g2 ~").s("sine").lpf(160).gain(0.62),
  note("[e3,g3,b3,d4]").struct("x ~ x ~ ~ x ~ x").s("rhodes").clip(0.7).gain(0.4).room(0.3),
  note("c4 e4 g4 c5 e5 c5 g4 e4").s("marimba").gain(0.3).pan(0.3),
  note("e5 g5 ~ c5 e5 ~ d5 ~").s("vibraphone").gain(0.45).room(0.5)
)
let chorusG = stack(
  drumsChorus,
  note("g1 g1 ~ g1 ~ g1 d2 ~").s("sine").lpf(160).gain(0.62),
  note("[d3,g3,b3]").struct("x ~ x ~ ~ x ~ x").s("rhodes").clip(0.7).gain(0.4).room(0.3),
  note("b3 d4 g4 b4 d5 b4 g4 d4").s("marimba").gain(0.3).pan(-0.3),
  note("d5 g5 ~ b4 d5 ~ b4 ~").s("vibraphone").gain(0.45).room(0.5)
)
let chorusAm = stack(
  drumsChorus,
  note("a1 a1 ~ a1 ~ a1 e2 ~").s("sine").lpf(160).gain(0.62),
  note("[e3,a3,c4]").struct("x ~ x ~ ~ x ~ x").s("rhodes").clip(0.7).gain(0.4).room(0.3),
  note("a3 c4 e4 a4 c5 a4 e4 c4").s("marimba").gain(0.3).pan(0.3),
  note("c5 e5 ~ a4 c5 ~ e5 ~").s("vibraphone").gain(0.45).room(0.5)
)
let chorusF = stack(
  drumsChorus,
  note("f1 f1 ~ f1 ~ f1 c2 ~").s("sine").lpf(160).gain(0.62),
  note("[f3,a3,c4,e4]").struct("x ~ x ~ ~ x ~ x").s("rhodes").clip(0.7).gain(0.4).room(0.3),
  note("a3 c4 f4 a4 c5 a4 f4 c4").s("marimba").gain(0.3).pan(-0.3),
  note("c5 f5 ~ a4 c5 ~ d5 e5").s("vibraphone").gain(0.45).room(0.5)
)

// ---------- bridge (Am - F - Am - G, breath held) ----------
let bridgeAm = stack(
  note("[a2,e3,a3,c4]").s("rhodes").attack(0.15).gain(0.34).room(0.55),
  note("a1").s("sine").lpf(120).gain(0.5),
  s("shaker*4").gain(0.14),
  s("~ rim ~ rim").bank("RolandTR808").gain(0.3),
  note("e5 ~ ~ c5 ~ b4 ~ ~").s("vibraphone").gain(0.36).room(0.7).delay(0.3)
)
let bridgeF = stack(
  note("[f2,c3,f3,a3]").s("rhodes").attack(0.15).gain(0.34).room(0.55),
  note("f1").s("sine").lpf(120).gain(0.5),
  s("shaker*4").gain(0.14),
  s("~ rim ~ rim").bank("RolandTR808").gain(0.3),
  note("a4 ~ c5 ~ ~ a4 g4 ~").s("vibraphone").gain(0.36).room(0.7).delay(0.3)
)
let bridgeG = stack(
  note("[g2,d3,g3,b3]").s("rhodes").attack(0.15).gain(0.34).room(0.55),
  note("g1").s("sine").lpf(120).gain(0.5),
  s("shaker*4").gain(0.14),
  s("~ rim ~ rim").bank("RolandTR808").gain(0.3),
  note("b4 ~ d5 ~ g4 a4 b4 ~").s("vibraphone").gain(0.36).room(0.7).delay(0.3)
)

// ---------- arrangement ----------
slowcat(
  intro, intro, intro, intro,
  verseC, verseG, verseAm, verseF,
  verseC, verseG, verseAm, verseF,
  chorusC, chorusG, chorusAm, chorusF,
  chorusC, chorusG, chorusAm, chorusF,
  verseC, verseG, verseAm, verseF,
  verseC, verseG, verseAm, verseF,
  chorusC, chorusG, chorusAm, chorusF,
  chorusC, chorusG, chorusAm, chorusF,
  bridgeAm, bridgeF, bridgeAm, bridgeG,
  bridgeAm, bridgeF, bridgeAm, bridgeG,
  chorusC, chorusG, chorusAm, chorusF,
  chorusC, chorusG, chorusAm, chorusF,
  chorusC, chorusG, chorusAm, chorusF,
  outro, outro, outro, outro
)
