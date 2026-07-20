// Gold Light, Slow Hours
// Velvet Minimal Indie R&B · 2016-2019 art-R&B (A Seat at the Table / When I Get Home era) · intimate, floating, self-assured calm

// Genre: Velvet Minimal Indie R&B
// Era: 2016-2019 art-R&B
// Mood: intimate, floating, self-assured calm
// Sounds: sine sub-bass, piano chords, sawtooth pad, vibraphone lead, 808 bd/rim/hh/shaker, vinyl crackle, harp
// Sound choice: organic keys + soft synths for that warm, spacious neo-soul pocket

setcps(0.31)

// ---------- INTRO: pad, sub, crackle ----------
let introF = stack(
  note("[f2,a3,c4,e4]").s("sawtooth").lpf(600).attack(0.4).release(0.8).room(0.6).gain(0.25),
  note("f1").struct("x ~ ~ ~ ~ ~ ~ ~").s("sine").lpf(150).gain(0.5),
  s("vinyl*2").gain(0.12),
  s("[~ hh]*4").bank("RolandTR808").gain(0.12)
)

// ---------- VERSE: Fmaj7 - Am7 - Dm9 - Bbmaj9 ----------
let verseF = stack(
  s("bd ~ rim ~ [~ bd] ~ rim ~").bank("RolandTR808").gain(0.6),
  s("[~ hh]*4").bank("RolandTR808").gain(0.2),
  note("f1 ~ ~ [~ f1] ~ f1 ~ e1").s("sine").lpf(180).gain(0.6),
  note("[f3,a3,c4,e4]").struct("~ x ~ ~ x ~ ~ ~").s("piano").release(0.6).room(0.4).gain(0.35),
  s("vinyl*2").gain(0.1)
)
let verseAm = stack(
  s("bd ~ rim ~ [~ bd] ~ rim ~").bank("RolandTR808").gain(0.6),
  s("[~ hh]*4").bank("RolandTR808").gain(0.2),
  note("a1 ~ ~ [~ a1] ~ a1 ~ g1").s("sine").lpf(180).gain(0.6),
  note("[a2,g3,c4,e4]").struct("~ x ~ ~ x ~ ~ ~").s("piano").release(0.6).room(0.4).gain(0.35),
  s("vinyl*2").gain(0.1)
)
let verseDm = stack(
  s("bd ~ rim ~ [~ bd] ~ rim ~").bank("RolandTR808").gain(0.6),
  s("[~ hh]*4").bank("RolandTR808").gain(0.2),
  note("d2 ~ ~ [~ d2] ~ d2 ~ c2").s("sine").lpf(180).gain(0.6),
  note("[d3,f3,a3,c4,e4]").struct("~ x ~ ~ x ~ ~ ~").s("piano").release(0.6).room(0.4).gain(0.32),
  s("vinyl*2").gain(0.1)
)
let verseBb = stack(
  s("bd ~ rim ~ [~ bd] ~ rim ~").bank("RolandTR808").gain(0.6),
  s("[~ hh]*4").bank("RolandTR808").gain(0.2),
  note("bb1 ~ ~ [~ bb1] ~ bb1 ~ c2").s("sine").lpf(180).gain(0.6),
  note("[bb2,d3,f3,a3,c4]").struct("~ x ~ ~ x ~ ~ ~").s("piano").release(0.6).room(0.4).gain(0.32),
  s("vinyl*2").gain(0.1)
)

// ---------- CHORUS: same harmony, fuller texture + vibraphone melody ----------
let chorusF = stack(
  s("bd ~ rim ~ [~ bd] ~ rim [~ bd]").bank("RolandTR808").gain(0.65),
  s("[~ hh]*4").bank("RolandTR808").gain(0.25),
  s("shaker*4").gain(0.14),
  note("f1 ~ [~ f1] ~ ~ f1 ~ [c2 e2]").s("sine").lpf(180).gain(0.6),
  note("[f3,a3,c4,e4]").struct("~ x ~ ~ x ~ ~ x").s("piano").release(0.6).room(0.4).gain(0.35),
  note("~ c5 a4 ~ g4 ~ a4 ~").s("vibraphone").room(0.6).gain(0.4)
)
let chorusAm = stack(
  s("bd ~ rim ~ [~ bd] ~ rim [~ bd]").bank("RolandTR808").gain(0.65),
  s("[~ hh]*4").bank("RolandTR808").gain(0.25),
  s("shaker*4").gain(0.14),
  note("a1 ~ [~ a1] ~ ~ a1 ~ [e2 g2]").s("sine").lpf(180).gain(0.6),
  note("[a2,g3,c4,e4]").struct("~ x ~ ~ x ~ ~ x").s("piano").release(0.6).room(0.4).gain(0.35),
  note("~ e5 c5 ~ b4 ~ g4 ~").s("vibraphone").room(0.6).gain(0.4)
)
let chorusDm = stack(
  s("bd ~ rim ~ [~ bd] ~ rim [~ bd]").bank("RolandTR808").gain(0.65),
  s("[~ hh]*4").bank("RolandTR808").gain(0.25),
  s("shaker*4").gain(0.14),
  note("d2 ~ [~ d2] ~ ~ d2 ~ [a1 c2]").s("sine").lpf(180).gain(0.6),
  note("[d3,f3,a3,c4,e4]").struct("~ x ~ ~ x ~ ~ x").s("piano").release(0.6).room(0.4).gain(0.32),
  note("~ f5 e5 ~ c5 ~ a4 ~").s("vibraphone").room(0.6).gain(0.4)
)
let chorusBb = stack(
  s("bd ~ rim ~ [~ bd] ~ rim [~ bd]").bank("RolandTR808").gain(0.65),
  s("[~ hh]*4").bank("RolandTR808").gain(0.25),
  s("shaker*4").gain(0.14),
  note("bb1 ~ [~ bb1] ~ ~ bb1 ~ [c2 e2]").s("sine").lpf(180).gain(0.6),
  note("[bb2,d3,f3,a3,c4]").struct("~ x ~ ~ x ~ ~ x").s("piano").release(0.6).room(0.4).gain(0.32),
  note("~ d5 c5 ~ a4 ~ f4 g4").s("vibraphone").room(0.6).gain(0.4)
)

// ---------- BRIDGE: stripped, floating, harp arpeggios ----------
let bridgeDm = stack(
  note("[d2,f3,a3,c4,e4]").s("sawtooth").lpf(sine.range(400, 900).slow(4)).attack(0.4).release(0.8).room(0.7).gain(0.25),
  note("d1").struct("x ~ ~ ~ ~ ~ x ~").s("sine").lpf(150).gain(0.55),
  note("d4 f4 a4 c5 e5 c5 a4 f4").s("harp").room(0.6).gain(0.3).pan(sine.range(-0.3, 0.3).slow(4)),
  s("vinyl*2").gain(0.12)
)
let bridgeBb = stack(
  note("[bb1,d3,f3,a3,c4]").s("sawtooth").lpf(sine.range(400, 900).slow(4)).attack(0.4).release(0.8).room(0.7).gain(0.25),
  note("bb1").struct("x ~ ~ ~ ~ ~ x ~").s("sine").lpf(150).gain(0.55),
  note("bb3 d4 f4 a4 c5 a4 f4 d4").s("harp").room(0.6).gain(0.3).pan(sine.range(-0.3, 0.3).slow(4)),
  s("vinyl*2").gain(0.12)
)

// ---------- OUTRO: melody fragment dissolving into pad ----------
let outroF = stack(
  note("[f2,a3,c4,e4]").s("sawtooth").lpf(550).attack(0.5).release(1).room(0.8).gain(0.24),
  note("f1").struct("x ~ ~ ~ ~ ~ ~ ~").s("sine").lpf(150).gain(0.5),
  note("~ ~ a4 ~ g4 ~ ~ ~").s("vibraphone").room(0.8).gain(0.32),
  s("vinyl*2").gain(0.12)
)

// ---------- ARRANGEMENT: 56 cycles (~3 minutes) ----------
slowcat(
  introF, introF, introF, introF,
  verseF, verseAm, verseDm, verseBb,
  verseF, verseAm, verseDm, verseBb,
  chorusF, chorusAm, chorusDm, chorusBb,
  chorusF, chorusAm, chorusDm, chorusBb,
  verseF, verseAm, verseDm, verseBb,
  verseF, verseAm, verseDm, verseBb,
  chorusF, chorusAm, chorusDm, chorusBb,
  chorusF, chorusAm, chorusDm, chorusBb,
  bridgeDm, bridgeBb, bridgeDm, bridgeBb,
  bridgeDm, bridgeBb, bridgeDm, bridgeBb,
  chorusF, chorusAm, chorusDm, chorusBb,
  chorusF, chorusAm, chorusDm, chorusBb,
  outroF, outroF, outroF, outroF
)
