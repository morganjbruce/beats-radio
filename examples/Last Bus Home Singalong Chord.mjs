// Last Bus Home Singalong
// Late-Night Coda Gospel-Rock · timeless (late-60s anthem reimagined) · hopeful, communal, slow-building uplift

// Genre: Late-Night Coda Gospel-Rock
// Era: timeless (late-60s anthem reimagined)
// Mood: hopeful, communal, slow-building uplift
// Sounds: piano (chords + lead), organ_full swell, triangle/sawtooth bass, RolandTR909 drums, tambourine, vinyl texture
// Sound choice: warm piano and gospel organ around a Mixolydian bVII move capture Hey Jude's communal singalong lift.

setcps(0.31)

// --- INTRO: piano alone, breathing ---
const introA = stack(
  note("[f3,a3,c4]").s("piano").gain(0.5).room(0.5).attack(0.01).release(1.8),
  note("f2").s("triangle").lpf(400).gain(0.4).attack(0.02).release(1.2),
  note("a4 ~ ~ ~ c5 ~ a4 ~").s("piano").gain(0.32).room(0.5),
  s("vinyl").gain(0.03)
)

// --- VERSE: F C Dm Bb, gentle groove ---
const verseDrums = s("bd ~ ~ ~ sd ~ ~ ~, hh ~ hh ~ hh ~ hh ~").bank("RolandTR909").gain(0.45)
const verseF = stack(
  note("[f3,a3,c4]").s("piano").gain(0.46).room(0.4),
  note("f2").s("triangle").lpf(420).gain(0.42),
  note("a4 ~ c5 ~ a4 g4 ~ f4").s("piano").gain(0.34).room(0.45),
  verseDrums
)
const verseC = stack(
  note("[c3,e3,g3]").s("piano").gain(0.46).room(0.4),
  note("c2").s("triangle").lpf(420).gain(0.42),
  note("g4 ~ e4 ~ g4 ~ ~ ~").s("piano").gain(0.34).room(0.45),
  verseDrums
)
const verseDm = stack(
  note("[d3,f3,a3]").s("piano").gain(0.46).room(0.4),
  note("d2").s("triangle").lpf(420).gain(0.42),
  note("f4 ~ a4 g4 ~ f4 ~ d4").s("piano").gain(0.34).room(0.45),
  verseDrums
)
const verseBb = stack(
  note("[bb2,d3,f3]").s("piano").gain(0.46).room(0.4),
  note("bb1").s("triangle").lpf(420).gain(0.42),
  note("d4 ~ f4 ~ d4 c4 ~ bb3").s("piano").gain(0.34).room(0.45),
  verseDrums
)

// --- BUILD: Bb -> C7 dominant tension into the coda ---
const buildDrums = s("bd ~ bd ~ sd ~ ~ ~, hh*8, ~ ~ ~ tambourine").bank("RolandTR909").gain(0.5)
const buildBb = stack(
  note("[bb2,d3,f3]").s("piano").gain(0.48).room(0.4),
  note("bb1").s("sawtooth").lpf(500).gain(0.4),
  note("[bb3,d4,f4]").s("organ_full").gain(0.2).room(0.5).attack(0.3),
  buildDrums
)
const buildC7 = stack(
  note("[c3,e3,g3,bb3]").s("piano").gain(0.48).room(0.4),
  note("c2").s("sawtooth").lpf(500).gain(0.4),
  note("[c4,e4,g4,bb4]").s("organ_full").gain(0.22).room(0.5).attack(0.3),
  note("g4 ~ bb4 ~ c5 ~ ~ ~").s("piano").gain(0.34),
  buildDrums
)

// --- CODA: F  Eb(bVII borrowed)  Bb  F  anthemic singalong ---
const codaDrums = s("bd ~ bd ~ sd ~ bd sd, hh*8, ~ tambourine ~ tambourine").bank("RolandTR909").gain(0.52)
const codaF = stack(
  note("[f3,a3,c4]").s("piano").gain(0.5).room(0.4),
  note("f2").s("sawtooth").lpf(550).gain(0.42),
  note("[f3,a3,c4,f4]").s("organ_full").gain(0.24).room(0.5).attack(0.2),
  note("f4 ~ a4 ~ c5 ~ a4 g4").s("piano").gain(0.4).room(0.4),
  codaDrums
)
const codaEb = stack(
  note("[eb3,g3,bb3]").s("piano").gain(0.5).room(0.4),
  note("eb2").s("sawtooth").lpf(550).gain(0.42),
  note("[eb3,g3,bb3,eb4]").s("organ_full").gain(0.24).room(0.5).attack(0.2),
  note("g4 ~ bb4 ~ g4 ~ eb4 ~").s("piano").gain(0.4).room(0.4),
  codaDrums
)
const codaBb = stack(
  note("[bb2,d3,f3]").s("piano").gain(0.5).room(0.4),
  note("bb1").s("sawtooth").lpf(550).gain(0.42),
  note("[bb3,d4,f4]").s("organ_full").gain(0.24).room(0.5).attack(0.2),
  note("d4 ~ f4 ~ bb4 ~ f4 d4").s("piano").gain(0.4).room(0.4),
  codaDrums
)
const codaF2 = stack(
  note("[f3,a3,c4]").s("piano").gain(0.5).room(0.4),
  note("f2").s("sawtooth").lpf(550).gain(0.42),
  note("[f3,a3,c4,f4]").s("organ_full").gain(0.24).room(0.5).attack(0.2),
  note("c5 ~ a4 ~ f4 ~ ~ ~").s("piano").gain(0.4).room(0.4),
  codaDrums
)

// --- OUTRO: thinning back to piano ---
const outroA = stack(
  note("[f3,a3,c4]").s("piano").gain(0.45).room(0.6).release(2),
  note("f2").s("triangle").lpf(380).gain(0.38),
  note("a4 ~ ~ ~ f4 ~ ~ ~").s("piano").gain(0.3).room(0.6),
  s("vinyl").gain(0.03)
)

slowcat(
  introA, introA, introA, introA,
  verseF, verseC, verseDm, verseBb,
  verseF, verseC, verseDm, verseBb,
  verseF, verseC, verseDm, verseBb,
  buildBb, buildC7, buildBb, buildC7,
  codaF, codaEb, codaBb, codaF2,
  codaF, codaEb, codaBb, codaF2,
  codaF, codaEb, codaBb, codaF2,
  codaF, codaEb, codaBb, codaF2,
  codaF, codaEb, codaBb, codaF2,
  codaF, codaEb, codaBb, codaF2,
  outroA, outroA
)
