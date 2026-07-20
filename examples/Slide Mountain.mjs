// The Slide Was a Mountain
// Shrunken Playground Lullabytronica · a late-90s summer remembered from now · tender, bittersweet, quietly nostalgic

// Genre: Shrunken Playground Lullabytronica
// Era: a late-90s summer remembered from now
// Mood: tender, bittersweet, quietly nostalgic
// Sounds: vibraphone music-box melody, rhodes chords, triangle/sine bass, soft TR808 drums, folkharp arps, vinyl crackle
// Sound choice: organic bell and rhodes tones over a faint lo-fi heartbeat to evoke a memory bigger than the place itself

setcps(0.3)

// ---------- INTRO: standing at the gate ----------
let introF = stack(
  s("vinyl*4").gain(0.03),
  note("[f3,a3,c4,e4]").s("rhodes").attack(0.4).release(0.6).room(0.6).gain(0.35),
  note("f5 ~ a5 ~ c6 ~ a5 g5").s("vibraphone").gain(0.14).room(0.7).pan(0.2)
)
let introDm = stack(
  s("vinyl*4").gain(0.03),
  note("[d3,f3,a3,c4]").s("rhodes").attack(0.4).release(0.6).room(0.6).gain(0.35),
  note("f5 ~ e5 ~ d5 ~ a4 ~").s("vibraphone").gain(0.14).room(0.7).pan(-0.2)
)

// ---------- VERSE: walking the old paths (Fmaj7 - Dm7 - Bbmaj7 - C7) ----------
let verseF = stack(
  s("vinyl*4").gain(0.03),
  s("bd ~ rim ~ ~ bd rim ~").bank("RolandTR808").gain(0.5),
  s("hh*8").bank("RolandTR808").gain(0.13),
  note("f2 ~ ~ f2 ~ ~ c2 ~").s("triangle").lpf(250).gain(0.55),
  note("[f3,a3,c4,e4]").s("rhodes").attack(0.3).room(0.5).gain(0.32),
  note("a4 ~ c5 a4 ~ g4 f4 ~").s("vibraphone").gain(0.16).room(0.6)
)
let verseDm = stack(
  s("vinyl*4").gain(0.03),
  s("bd ~ rim ~ ~ bd rim ~").bank("RolandTR808").gain(0.5),
  s("hh*8").bank("RolandTR808").gain(0.13),
  note("d2 ~ ~ d2 ~ ~ a1 ~").s("triangle").lpf(250).gain(0.55),
  note("[d3,f3,a3,c4]").s("rhodes").attack(0.3).room(0.5).gain(0.32),
  note("f4 ~ a4 f4 ~ e4 d4 ~").s("vibraphone").gain(0.16).room(0.6)
)
let verseBb = stack(
  s("vinyl*4").gain(0.03),
  s("bd ~ rim ~ ~ bd rim ~").bank("RolandTR808").gain(0.5),
  s("hh*8").bank("RolandTR808").gain(0.13),
  note("bb1 ~ ~ bb1 ~ ~ f2 ~").s("triangle").lpf(250).gain(0.55),
  note("[bb2,d3,f3,a3]").s("rhodes").attack(0.3).room(0.5).gain(0.32),
  note("d5 ~ c5 bb4 ~ a4 g4 ~").s("vibraphone").gain(0.16).room(0.6)
)
let verseC = stack(
  s("vinyl*4").gain(0.03),
  s("bd ~ rim ~ ~ bd rim ~").bank("RolandTR808").gain(0.5),
  s("hh*8").bank("RolandTR808").gain(0.13),
  note("c2 ~ ~ c2 ~ ~ g1 ~").s("triangle").lpf(250).gain(0.55),
  note("[c3,e3,g3,bb3]").s("rhodes").attack(0.3).room(0.5).gain(0.32),
  note("g4 a4 ~ g4 e4 ~ c4 ~").s("vibraphone").gain(0.16).room(0.6)
)

// ---------- CHORUS: it all felt so much bigger ----------
let chorF = stack(
  s("vinyl*4").gain(0.03),
  s("bd ~ rim ~ bd ~ rim ~").bank("RolandTR808").gain(0.55),
  s("~ shaker ~ shaker").gain(0.2),
  note("f2 ~ c2 f2 ~ f2 c2 ~").s("triangle").lpf(280).gain(0.55),
  note("[f3,a3,c4,e4]").s("sawtooth").lpf(550).attack(0.4).release(0.6).room(0.5).gain(0.2),
  note("[a3,c4,f4]").struct("x ~ ~ x ~ ~ x ~").s("rhodes").gain(0.28).room(0.5),
  note("c5 ~ a4 c5 d5 ~ c5 ~").s("vibraphone").gain(0.18).room(0.6)
)
let chorDm = stack(
  s("vinyl*4").gain(0.03),
  s("bd ~ rim ~ bd ~ rim ~").bank("RolandTR808").gain(0.55),
  s("~ shaker ~ shaker").gain(0.2),
  note("d2 ~ a1 d2 ~ d2 a1 ~").s("triangle").lpf(280).gain(0.55),
  note("[d3,f3,a3,c4]").s("sawtooth").lpf(550).attack(0.4).release(0.6).room(0.5).gain(0.2),
  note("[a3,d4,f4]").struct("x ~ ~ x ~ ~ x ~").s("rhodes").gain(0.28).room(0.5),
  note("a4 ~ f4 a4 c5 ~ a4 ~").s("vibraphone").gain(0.18).room(0.6)
)
let chorBb = stack(
  s("vinyl*4").gain(0.03),
  s("bd ~ rim ~ bd ~ rim ~").bank("RolandTR808").gain(0.55),
  s("~ shaker ~ shaker").gain(0.2),
  note("bb1 ~ f2 bb1 ~ bb1 f2 ~").s("triangle").lpf(280).gain(0.55),
  note("[bb2,d3,f3,a3]").s("sawtooth").lpf(550).attack(0.4).release(0.6).room(0.5).gain(0.2),
  note("[bb3,d4,f4]").struct("x ~ ~ x ~ ~ x ~").s("rhodes").gain(0.28).room(0.5),
  note("d5 c5 ~ bb4 a4 ~ g4 a4").s("vibraphone").gain(0.18).room(0.6)
)
let chorC = stack(
  s("vinyl*4").gain(0.03),
  s("bd ~ rim ~ bd ~ rim ~").bank("RolandTR808").gain(0.55),
  s("~ shaker ~ shaker").gain(0.2),
  note("c2 ~ g1 c2 ~ c2 g1 ~").s("triangle").lpf(280).gain(0.55),
  note("[c3,e3,g3,bb3]").s("sawtooth").lpf(550).attack(0.4).release(0.6).room(0.5).gain(0.2),
  note("[g3,c4,e4]").struct("x ~ ~ x ~ ~ x ~").s("rhodes").gain(0.28).room(0.5),
  note("g4 ~ e4 g4 a4 g4 f4 e4").s("vibraphone").gain(0.18).room(0.6)
)

// ---------- BRIDGE: sitting on the too-small swing (Am7 - Bbmaj7) ----------
let bridgeAm = stack(
  s("vinyl*4").gain(0.04),
  note("a1 ~ ~ ~ ~ ~ ~ ~").s("sine").lpf(150).gain(0.5),
  note("[a2,c3,e3,g3]").s("rhodes").attack(0.5).room(0.7).gain(0.3),
  note("a3 c4 e4 g4 e4 c4 a3 e4").s("folkharp").gain(0.4).room(0.6).pan(0.25)
)
let bridgeBb = stack(
  s("vinyl*4").gain(0.04),
  note("bb1 ~ ~ ~ ~ ~ ~ ~").s("sine").lpf(150).gain(0.5),
  note("[bb2,d3,f3,a3]").s("rhodes").attack(0.5).room(0.7).gain(0.3),
  note("bb3 d4 f4 a4 f4 d4 bb3 f4").s("folkharp").gain(0.4).room(0.6).pan(-0.25)
)

// ---------- OUTRO: closing the gate behind you ----------
let outroF = stack(
  s("vinyl*4").gain(0.04),
  note("[f3,a3,c4,e4]").s("rhodes").attack(0.6).release(0.8).room(0.8).gain(0.3),
  note("f5 ~ ~ a5 ~ ~ c6 ~").s("vibraphone").gain(0.12).room(0.8)
)
let outroEnd = stack(
  s("vinyl*4").gain(0.04),
  note("[f2,c3,f3,a3,c4]").s("rhodes").attack(0.8).release(1).room(0.9).gain(0.28)
)

// ---------- ARRANGEMENT (~52 cycles, ~3 minutes) ----------
slowcat(
  introF, introDm, introF, introDm,
  verseF, verseDm, verseBb, verseC,
  verseF, verseDm, verseBb, verseC,
  chorF, chorDm, chorBb, chorC,
  chorF, chorDm, chorBb, chorC,
  verseF, verseDm, verseBb, verseC,
  verseF, verseDm, verseBb, verseC,
  chorF, chorDm, chorBb, chorC,
  chorF, chorDm, chorBb, chorC,
  bridgeAm, bridgeBb, bridgeAm, bridgeBb,
  chorF, chorDm, chorBb, chorC,
  chorF, chorDm, chorBb, chorC,
  outroF, outroF, outroF, outroEnd
)
