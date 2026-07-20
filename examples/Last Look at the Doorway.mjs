// Last Look at the Doorway
// Farewell Hour Dust-Folk Electronica · a final evening, golden light through emptied rooms · bittersweet, tender, resolved

// Genre: Farewell Hour Dust-Folk Electronica
// Era: a final evening, golden light through emptied rooms
// Mood: bittersweet, tender, resolved
// Sounds: rhodes chords, folkharp arpeggios, vibraphone melody, sine sub bass, bd/rim/shaker drums, vinyl crackle
// Sound choice: warm organic timbres for memory, soft pulse for the act of walking away

setcps(0.32)

// ---- shared textures ----
let crackle = s("vinyl").gain(0.03)

let drumsVerse = stack(
  s("bd ~ rim ~ ~ bd rim ~").gain(0.45).room(0.2),
  s("shaker*8").gain(0.16)
)

let drumsLift = stack(
  s("bd ~ rim ~ ~ bd rim ~").gain(0.5).room(0.2),
  s("shaker*8").gain(0.18),
  s("~ hh ~ hh ~ hh ~ hh").gain(0.13)
)

// ---- INTRO : just the room, the chord, the dust ----
let introF = stack(
  note("[f3,a3,c4,e4]").s("rhodes").attack(0.1).gain(0.38).room(0.6),
  note("f3 a3 c4 e4 a4 e4 c4 a3").s("folkharp").gain(0.28).room(0.7).pan(sine.range(-0.3, 0.3).slow(8)),
  crackle
)
let introBb = stack(
  note("[bb2,d3,f3,a3]").s("rhodes").attack(0.1).gain(0.38).room(0.6),
  note("bb2 d3 f3 a3 d4 a3 f3 d3").s("folkharp").gain(0.28).room(0.7).pan(sine.range(-0.3, 0.3).slow(8)),
  crackle
)

// ---- VERSE : the walk through the rooms (Fmaj7 - C - Dm7 - Bbmaj7) ----
let verseF = stack(
  note("[f3,a3,c4,e4]").s("rhodes").gain(0.36).room(0.5),
  note("f2 ~ ~ f2 ~ ~ c3 ~").s("sine").lpf(180).gain(0.5),
  note("f3 a3 c4 e4 a4 e4 c4 a3").s("folkharp").gain(0.26).room(0.6),
  drumsVerse,
  crackle
)
let verseC = stack(
  note("[c3,e3,g3,c4]").s("rhodes").gain(0.36).room(0.5),
  note("c2 ~ ~ c2 ~ ~ g2 ~").s("sine").lpf(180).gain(0.5),
  note("c3 e3 g3 c4 e4 c4 g3 e3").s("folkharp").gain(0.26).room(0.6),
  drumsVerse,
  crackle
)
let verseDm = stack(
  note("[d3,f3,a3,c4]").s("rhodes").gain(0.36).room(0.5),
  note("d2 ~ ~ d2 ~ ~ a2 ~").s("sine").lpf(180).gain(0.5),
  note("d3 f3 a3 c4 f4 c4 a3 f3").s("folkharp").gain(0.26).room(0.6),
  drumsVerse,
  crackle
)
let verseBb = stack(
  note("[bb2,d3,f3,a3]").s("rhodes").gain(0.36).room(0.5),
  note("bb1 ~ ~ bb1 ~ ~ f2 ~").s("sine").lpf(180).gain(0.5),
  note("bb2 d3 f3 a3 d4 a3 f3 d3").s("folkharp").gain(0.26).room(0.6),
  drumsVerse,
  crackle
)

// ---- LIFT : the goodbye spoken out loud (vibraphone melody enters) ----
let liftF = stack(
  note("[f3,a3,c4,e4]").s("rhodes").gain(0.38).room(0.5),
  note("f2 ~ ~ f2 ~ ~ c3 ~").s("sine").lpf(180).gain(0.52),
  note("f3 a3 c4 e4 a4 e4 c4 a3").s("folkharp").gain(0.24).room(0.6),
  note("a4 ~ g4 f4 ~ ~ c5 ~").s("vibraphone").gain(0.34).room(0.65).delay(0.3),
  drumsLift,
  crackle
)
let liftC = stack(
  note("[c3,e3,g3,c4]").s("rhodes").gain(0.38).room(0.5),
  note("c2 ~ ~ c2 ~ ~ g2 ~").s("sine").lpf(180).gain(0.52),
  note("c3 e3 g3 c4 e4 c4 g3 e3").s("folkharp").gain(0.24).room(0.6),
  note("g4 ~ e4 ~ ~ d4 e4 ~").s("vibraphone").gain(0.34).room(0.65).delay(0.3),
  drumsLift,
  crackle
)
let liftDm = stack(
  note("[d3,f3,a3,c4]").s("rhodes").gain(0.38).room(0.5),
  note("d2 ~ ~ d2 ~ ~ a2 ~").s("sine").lpf(180).gain(0.52),
  note("d3 f3 a3 c4 f4 c4 a3 f3").s("folkharp").gain(0.24).room(0.6),
  note("f4 ~ e4 d4 ~ ~ a4 ~").s("vibraphone").gain(0.34).room(0.65).delay(0.3),
  drumsLift,
  crackle
)
let liftBb = stack(
  note("[bb2,d3,f3,a3]").s("rhodes").gain(0.38).room(0.5),
  note("bb1 ~ ~ bb1 ~ ~ f2 ~").s("sine").lpf(180).gain(0.52),
  note("bb2 d3 f3 a3 d4 a3 f3 d3").s("folkharp").gain(0.24).room(0.6),
  note("d4 ~ c4 ~ ~ ~ f4 ~").s("vibraphone").gain(0.34).room(0.65).delay(0.3),
  drumsLift,
  crackle
)

// ---- BRIDGE : pausing at the threshold, drums fall away ----
let bridgeDm = stack(
  note("[d3,f3,a3,c4]").s("triangle").attack(0.4).release(0.8).lpf(900).gain(0.3).room(0.8),
  note("d3 ~ f3 ~ a3 ~ c4 ~").s("folkharp").gain(0.26).room(0.7).pan(sine.range(-0.4, 0.4).slow(6)),
  note("d2").s("sine").lpf(150).gain(0.42),
  crackle
)
let bridgeBb = stack(
  note("[bb2,d3,f3,a3]").s("triangle").attack(0.4).release(0.8).lpf(900).gain(0.3).room(0.8),
  note("bb2 ~ d3 ~ f3 ~ a3 ~").s("folkharp").gain(0.26).room(0.7).pan(sine.range(-0.4, 0.4).slow(6)),
  note("bb1").s("sine").lpf(150).gain(0.42),
  crackle
)

// ---- OUTRO : the door closes, the chord stays ----
let outroF = stack(
  note("[f3,a3,c4,e4]").s("rhodes").attack(0.15).gain(0.3).room(0.8),
  note("f3 ~ a3 ~ c4 ~ e4 ~").s("folkharp").gain(0.2).room(0.8),
  crackle
)
let outroBb = stack(
  note("[bb2,d3,f3,a3]").s("rhodes").attack(0.15).gain(0.3).room(0.8),
  note("bb2 ~ d3 ~ f3 ~ a3 ~").s("folkharp").gain(0.2).room(0.8),
  crackle
)

// ---- ARRANGEMENT : arrival, walk-through, goodbye, threshold, last goodbye, door ----
slowcat(
  introF, introF, introBb, introF,
  verseF, verseC, verseDm, verseBb,
  verseF, verseC, verseDm, verseBb,
  liftF, liftC, liftDm, liftBb,
  liftF, liftC, liftDm, liftBb,
  verseF, verseC, verseDm, verseBb,
  liftF, liftC, liftDm, liftBb,
  liftF, liftC, liftDm, liftBb,
  bridgeDm, bridgeDm, bridgeBb, bridgeBb,
  liftF, liftC, liftDm, liftBb,
  liftF, liftC, liftDm, liftBb,
  outroF, outroBb, outroF, outroF
)
