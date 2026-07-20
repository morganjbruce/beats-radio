// Warm Sand Between Chords
// Sunbleached Harmony Surf Pop · 1966 California (Pet Sounds era) · warm, nostalgic, gently swaying

// Genre: Sunbleached Harmony Surf Pop
// Era: 1966 California
// Mood: warm, nostalgic, gently swaying
// Sounds: triangle bass, piano chords, vibraphone melody, folkharp arps, organ_full pad, TR808 drums + shaker/tambourine + vinyl warmth
// Sound choice: vibraphone + harp echo Pet Sounds orchestration; triangle bass = round melodic Carol Kaye lines

setcps(0.46)

let intro = stack(
  note("c2 ~ g2 ~ e2 ~ g2 a2").s("triangle").lpf(350).gain(0.5),
  note("[c3,e3,g3]").s("piano").gain(0.3).room(0.5),
  note("e4 ~ g4 ~ c5 ~ g4 e4").s("vibraphone").gain(0.3).room(0.6).delay(0.2),
  s("shaker*8").gain(0.18),
  s("vinyl*2").gain(0.1)
)

// ---- VERSE: I - vi - IV - V (C - Am - F - G) ----
let verseC = stack(
  note("c2 ~ g2 ~ e2 ~ g2 a2").s("triangle").lpf(400).gain(0.55),
  note("[c3,e3,g3] ~ ~ [c3,e3,g3] ~ [c3,e3,g3] ~ ~").s("piano").gain(0.32).room(0.35),
  note("e4 ~ g4 e4 d4 c4 ~ d4").s("vibraphone").gain(0.38).room(0.5),
  s("bd ~ sd ~ ~ bd sd ~").bank("RolandTR808").gain(0.6),
  s("shaker*8").gain(0.2)
)

let verseAm = stack(
  note("a1 ~ e2 ~ a2 ~ g2 e2").s("triangle").lpf(400).gain(0.55),
  note("[a2,c3,e3] ~ ~ [a2,c3,e3] ~ [a2,c3,e3] ~ ~").s("piano").gain(0.32).room(0.35),
  note("c4 ~ e4 c4 b3 a3 ~ ~").s("vibraphone").gain(0.38).room(0.5),
  s("bd ~ sd ~ ~ bd sd ~").bank("RolandTR808").gain(0.6),
  s("shaker*8").gain(0.2)
)

let verseF = stack(
  note("f2 ~ c2 ~ f2 ~ a2 c3").s("triangle").lpf(400).gain(0.55),
  note("[f3,a3,c4] ~ ~ [f3,a3,c4] ~ [f3,a3,c4] ~ ~").s("piano").gain(0.32).room(0.35),
  note("a4 ~ a4 g4 f4 ~ e4 f4").s("vibraphone").gain(0.38).room(0.5),
  s("bd ~ sd ~ ~ bd sd ~").bank("RolandTR808").gain(0.6),
  s("shaker*8").gain(0.2)
)

let verseG = stack(
  note("g1 ~ d2 ~ g2 ~ b2 d3").s("triangle").lpf(400).gain(0.55),
  note("[g2,b2,d3] ~ ~ [g2,b2,d3] ~ [g2,b2,d3] ~ ~").s("piano").gain(0.32).room(0.35),
  note("d4 e4 f4 ~ g4 ~ b3 d4").s("vibraphone").gain(0.38).room(0.5),
  s("bd ~ sd ~ ~ bd sd ~").bank("RolandTR808").gain(0.6),
  s("shaker*8").gain(0.2)
)

// ---- CHORUS: IV - V - I - vi (F - G - C - Am), fuller with harp + tambourine ----
let chorusF = stack(
  note("f2 ~ f2 c2 f2 ~ a2 c3").s("triangle").lpf(420).gain(0.55),
  note("[f3,a3,c4]").struct("x ~ x x ~ x ~ x").s("piano").gain(0.34).room(0.35),
  note("c5 ~ c5 a4 ~ g4 a4 ~").s("vibraphone").gain(0.4).room(0.5),
  note("f3 a3 c4 f4 c4 a3 f3 a3").s("folkharp").gain(0.22).room(0.5),
  s("bd ~ sd ~ bd bd sd ~").bank("RolandTR808").gain(0.65),
  s("~ tambourine ~ tambourine").gain(0.3)
)

let chorusG = stack(
  note("g2 ~ g2 d2 g2 ~ b2 d3").s("triangle").lpf(420).gain(0.55),
  note("[g3,b3,d4]").struct("x ~ x x ~ x ~ x").s("piano").gain(0.34).room(0.35),
  note("b4 ~ d5 b4 ~ g4 ~ a4").s("vibraphone").gain(0.4).room(0.5),
  note("g3 b3 d4 g4 d4 b3 g3 b3").s("folkharp").gain(0.22).room(0.5),
  s("bd ~ sd ~ bd bd sd ~").bank("RolandTR808").gain(0.65),
  s("~ tambourine ~ tambourine").gain(0.3)
)

let chorusC = stack(
  note("c2 ~ c2 g2 c2 ~ e2 g2").s("triangle").lpf(420).gain(0.55),
  note("[c3,e3,g3]").struct("x ~ x x ~ x ~ x").s("piano").gain(0.34).room(0.35),
  note("g4 ~ e4 g4 c5 ~ g4 e4").s("vibraphone").gain(0.4).room(0.5),
  note("c3 e3 g3 c4 g3 e3 c3 e3").s("folkharp").gain(0.22).room(0.5),
  s("bd ~ sd ~ bd bd sd ~").bank("RolandTR808").gain(0.65),
  s("~ tambourine ~ tambourine").gain(0.3)
)

let chorusAm = stack(
  note("a1 ~ a2 e2 a2 ~ c3 e2").s("triangle").lpf(420).gain(0.55),
  note("[a2,c3,e3]").struct("x ~ x x ~ x ~ x").s("piano").gain(0.34).room(0.35),
  note("e4 ~ a4 e4 ~ c4 d4 e4").s("vibraphone").gain(0.4).room(0.5),
  note("a2 c3 e3 a3 e3 c3 a2 c3").s("folkharp").gain(0.22).room(0.5),
  s("bd ~ sd ~ bd bd sd ~").bank("RolandTR808").gain(0.65),
  s("~ tambourine ~ tambourine").gain(0.3)
)

// ---- BRIDGE: dreamier, organ pad + sparse drums (Am7 - Fmaj7 - Dm7 - G7) ----
let bridgeAm = stack(
  note("a1 ~ ~ a2 ~ ~ e2 ~").s("triangle").lpf(300).gain(0.5),
  note("[a2,c3,e3,g3]").s("organ_full").attack(0.3).release(0.5).gain(0.18).room(0.6),
  note("a3 c4 e4 a4 e4 c4 a3 e3").s("folkharp").gain(0.25).room(0.6),
  note("c5 ~ ~ b4 ~ a4 ~ ~").s("vibraphone").gain(0.32).room(0.7).delay(0.25),
  s("~ rim ~ rim").gain(0.35),
  s("shaker*4").gain(0.15)
)

let bridgeF = stack(
  note("f2 ~ ~ f2 ~ ~ c2 ~").s("triangle").lpf(300).gain(0.5),
  note("[f2,a2,c3,e3]").s("organ_full").attack(0.3).release(0.5).gain(0.18).room(0.6),
  note("f3 a3 c4 f4 c4 a3 f3 c3").s("folkharp").gain(0.25).room(0.6),
  note("a4 ~ ~ g4 ~ f4 ~ ~").s("vibraphone").gain(0.32).room(0.7).delay(0.25),
  s("~ rim ~ rim").gain(0.35),
  s("shaker*4").gain(0.15)
)

let bridgeDm = stack(
  note("d2 ~ ~ d2 ~ ~ a1 ~").s("triangle").lpf(300).gain(0.5),
  note("[d3,f3,a3,c4]").s("organ_full").attack(0.3).release(0.5).gain(0.18).room(0.6),
  note("d3 f3 a3 d4 a3 f3 d3 f3").s("folkharp").gain(0.25).room(0.6),
  note("f4 ~ ~ e4 ~ d4 ~ ~").s("vibraphone").gain(0.32).room(0.7).delay(0.25),
  s("~ rim ~ rim").gain(0.35),
  s("shaker*4").gain(0.15)
)

let bridgeG = stack(
  note("g1 ~ g2 ~ b2 ~ d2 ~").s("triangle").lpf(320).gain(0.52),
  note("[g2,b2,d3,f3]").s("organ_full").attack(0.3).release(0.5).gain(0.18).room(0.6),
  note("g3 b3 d4 g4 d4 b3 g3 d3").s("folkharp").gain(0.25).room(0.6),
  note("d4 ~ e4 f4 ~ g4 a4 b4").s("vibraphone").gain(0.34).room(0.6),
  s("bd ~ sd ~ bd ~ sd sd").bank("RolandTR808").gain(0.55),
  s("shaker*8").gain(0.18)
)

let outro = stack(
  note("c2 ~ g2 ~ e2 ~ g2 ~").s("triangle").lpf(300).gain(0.45),
  note("[c3,e3,g3,b3]").s("piano").gain(0.28).room(0.6),
  note("e4 ~ d4 ~ c4 ~ ~ ~").s("vibraphone").gain(0.3).room(0.8).delay(0.3),
  s("shaker*8").gain(0.12),
  s("vinyl*2").gain(0.1)
)

slowcat(
  intro, intro, intro, intro,
  verseC, verseAm, verseF, verseG,
  verseC, verseAm, verseF, verseG,
  chorusF, chorusG, chorusC, chorusAm,
  chorusF, chorusG, chorusC, chorusAm,
  verseC, verseAm, verseF, verseG,
  verseC, verseAm, verseF, verseG,
  chorusF, chorusG, chorusC, chorusAm,
  chorusF, chorusG, chorusC, chorusAm,
  bridgeAm, bridgeF, bridgeAm, bridgeF,
  bridgeDm, bridgeG, bridgeDm, bridgeG,
  chorusF, chorusG, chorusC, chorusAm,
  chorusF, chorusG, chorusC, chorusAm,
  chorusF, chorusG, chorusC, chorusC,
  outro, outro, outro, outro
)
