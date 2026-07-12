// In My Room, the Tide
// Pet Sounds Chamber Pop / Sandbox Studio Melancholy · 1966 Los Angeles living room, piano in a sandbox · bittersweet, introspective, tender

// Genre: Pet Sounds Chamber Pop / Sandbox Studio Melancholy
// Era: 1966 Los Angeles living room
// Mood: bittersweet, introspective, tender
// Sounds: piano chords, triangle bass, sine theremin lead, harmonica swells, vibraphone, soft rim/shaker drums + vinyl
// Sound choice: organic chamber-pop palette with one electronic ghost (theremin sine) for the Wilson touch

setcps(0.45)

// ---- drums ----
let drumsSoft = stack(
  s("bd ~ rim ~ ~ bd rim ~").gain(0.42),
  s("shaker*8").gain(0.12),
  s("~ hh ~ hh").gain(0.16)
)
let drumsFull = stack(
  s("bd ~ rim ~ bd ~ rim ~").gain(0.48),
  s("shaker*8").gain(0.15),
  s("~ hh ~ hh").gain(0.2),
  s("~ ~ ~ tambourine").gain(0.22)
)

// ---- intro: piano alone with crackle ----
let intro = stack(
  note("[c3,e3,g3,b3]").s("piano").gain(0.35).room(0.6),
  note("c2").s("triangle").lpf(260).gain(0.42),
  s("vinyl").gain(0.14)
)

// ---- verse: C - Am - F - Fm (borrowed iv, pure Wilson) ----
let verseC = stack(
  note("c2 ~ g2 a2").s("triangle").lpf(280).gain(0.5),
  note("[c3,e3,g3,b3] ~ [e3,g3,c4] ~").s("piano").gain(0.38).room(0.5),
  note("~ g4 ~ e4").s("vibraphone").gain(0.26).room(0.6),
  drumsSoft
)
let verseAm = stack(
  note("a1 ~ e2 g2").s("triangle").lpf(280).gain(0.5),
  note("[a2,c3,e3,g3] ~ [c3,e3,a3] ~").s("piano").gain(0.38).room(0.5),
  note("~ e4 ~ c4").s("vibraphone").gain(0.26).room(0.6),
  drumsSoft
)
let verseF = stack(
  note("f2 ~ c3 d3").s("triangle").lpf(280).gain(0.5),
  note("[f2,a2,c3,e3] ~ [a2,c3,f3] ~").s("piano").gain(0.38).room(0.5),
  note("~ a4 ~ f4").s("vibraphone").gain(0.26).room(0.6),
  drumsSoft
)
let verseFm = stack(
  note("f2 ~ c3 ~").s("triangle").lpf(280).gain(0.5),
  note("[f2,ab2,c3,eb3] ~ [ab2,c3,f3] ~").s("piano").gain(0.38).room(0.55),
  note("~ ab4 ~ g4").s("vibraphone").gain(0.26).room(0.65),
  drumsSoft
)

// ---- chorus: F - G - Em - Am - Dm - G - C - C with theremin + harmonica ----
let chorusF = stack(
  note("f2 f2 ~ c3").s("triangle").lpf(300).gain(0.52),
  note("[f3,a3,c4] ~ [f3,a3,c4] ~").s("piano").gain(0.4).room(0.5),
  note("c5 ~ a4 g4").s("sine").vib(5).vmod(0.1).gain(0.27).room(0.7),
  note("[f3,c4]").s("harmonica").attack(0.2).gain(0.2).room(0.5),
  drumsFull
)
let chorusG = stack(
  note("g2 g2 ~ d3").s("triangle").lpf(300).gain(0.52),
  note("[g3,b3,d4] ~ [g3,b3,d4] ~").s("piano").gain(0.4).room(0.5),
  note("b4 ~ g4 a4").s("sine").vib(5).vmod(0.1).gain(0.27).room(0.7),
  note("[g3,d4]").s("harmonica").attack(0.2).gain(0.2).room(0.5),
  drumsFull
)
let chorusEm = stack(
  note("e2 e2 ~ b2").s("triangle").lpf(300).gain(0.52),
  note("[e3,g3,b3] ~ [e3,g3,b3] ~").s("piano").gain(0.4).room(0.5),
  note("g4 ~ b4 g4").s("sine").vib(5).vmod(0.1).gain(0.27).room(0.7),
  note("[e3,b3]").s("harmonica").attack(0.2).gain(0.2).room(0.5),
  drumsFull
)
let chorusAm = stack(
  note("a1 a2 ~ e2").s("triangle").lpf(300).gain(0.52),
  note("[a3,c4,e4] ~ [a3,c4,e4] ~").s("piano").gain(0.4).room(0.5),
  note("a4 ~ c5 a4").s("sine").vib(5).vmod(0.1).gain(0.27).room(0.7),
  note("[a3,e4]").s("harmonica").attack(0.2).gain(0.2).room(0.5),
  drumsFull
)
let chorusDm = stack(
  note("d2 d2 ~ a2").s("triangle").lpf(300).gain(0.52),
  note("[d3,f3,a3] ~ [d3,f3,a3] ~").s("piano").gain(0.4).room(0.5),
  note("f4 ~ a4 d5").s("sine").vib(5).vmod(0.1).gain(0.27).room(0.7),
  note("[d3,a3]").s("harmonica").attack(0.2).gain(0.2).room(0.5),
  drumsFull
)
let chorusC = stack(
  note("c2 ~ g2 ~").s("triangle").lpf(300).gain(0.52),
  note("[c3,e3,g3] ~ [c3,e3,g3,b3] ~").s("piano").gain(0.4).room(0.5),
  note("e4 ~ g4 c5").s("sine").vib(5).vmod(0.1).gain(0.27).room(0.7),
  note("[c3,g3]").s("harmonica").attack(0.2).gain(0.2).room(0.5),
  drumsFull
)

// ---- bridge: alone again, Fm to C arpeggios, no drums but shaker breath ----
let bridgeFm = stack(
  note("f3 ab3 c4 eb4 c4 ab3 f3 ab3").s("piano").gain(0.34).room(0.7),
  note("f2").s("triangle").lpf(240).gain(0.45),
  s("shaker*4").gain(0.1),
  s("vinyl").gain(0.12)
)
let bridgeC = stack(
  note("c3 e3 g3 b3 g3 e3 c3 e3").s("piano").gain(0.34).room(0.7),
  note("c2").s("triangle").lpf(240).gain(0.45),
  s("shaker*4").gain(0.1),
  s("vinyl").gain(0.12)
)

// ---- outro: the room empties ----
let outro = stack(
  note("[c3,e3,g3,b3]").s("piano").gain(0.32).room(0.75),
  note("c2").s("triangle").lpf(220).gain(0.38),
  note("~ ~ e4 ~").s("vibraphone").gain(0.22).room(0.8),
  s("vinyl").gain(0.14)
)

// ---- arrangement (60 cycles) ----
slowcat(
  intro, intro, intro, intro,
  verseC, verseAm, verseF, verseFm,
  verseC, verseAm, verseF, verseFm,
  chorusF, chorusG, chorusEm, chorusAm, chorusDm, chorusG, chorusC, chorusC,
  verseC, verseAm, verseF, verseFm,
  verseC, verseAm, verseF, verseFm,
  chorusF, chorusG, chorusEm, chorusAm, chorusDm, chorusG, chorusC, chorusC,
  bridgeFm, bridgeC, bridgeFm, bridgeC,
  chorusF, chorusG, chorusEm, chorusAm, chorusDm, chorusG, chorusC, chorusC,
  chorusF, chorusG, chorusEm, chorusAm, chorusDm, chorusG, chorusC, chorusC,
  outro, outro, outro, outro
)
