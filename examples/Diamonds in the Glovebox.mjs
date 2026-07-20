// Diamonds in the Glovebox
// Sad-Girl Cinematic Trap-Noir · 2020s Hollywood-noir revival · melancholy, glamorous, narcotic, slow-burning

// Genre: Sad-Girl Cinematic Trap-Noir
// Era: 2020s Hollywood-noir revival
// Mood: melancholy, glamorous, narcotic, slow-burning
// Sounds: Rhodes chords, vibraphone twinkle, sine 808 sub, RolandTR808 drums (bd/cp/hh/oh), vinyl crackle
// Sound choice: dreamy Rhodes + vibes for the Lana ache, 808 trap drums + sub for the modern low-end

setcps(0.55)

const vinyl = s("vinyl").gain(0.035)

const drumsLight = stack(
  s("bd ~ ~ ~ ~ ~ bd ~").bank("RolandTR808").gain(0.8),
  s("~ ~ ~ ~ cp ~ ~ ~").bank("RolandTR808").gain(0.42).room(0.3),
  s("hh*8").bank("RolandTR808").gain(0.2).pan(0.12)
)

const drumsFull = stack(
  s("bd ~ ~ bd ~ ~ bd ~").bank("RolandTR808").gain(0.85),
  s("~ ~ ~ ~ cp ~ ~ ~").bank("RolandTR808").gain(0.5).room(0.3),
  s("hh*16").bank("RolandTR808").gain("0.24 0.1 0.18 0.1 0.28 0.1 0.16 0.1 0.24 0.1 0.18 0.32 0.16 0.1 0.38 0.18").pan(0.12),
  s("~ ~ ~ ~ ~ ~ oh ~").bank("RolandTR808").gain(0.18)
)

const rhodes = (chord) => note(chord).s("rhodes").lpf(1600).attack(0.04).release(0.6).room(0.55).gain(0.5)
const sub = (root) => note(root).struct("x ~ ~ ~ x ~ ~ ~").s("sine").lpf(120).shape(0.15).gain(0.7)
const vibe = (phrase) => note(phrase).s("vibraphone").gain(0.2).room(0.6).delay(0.2)

// intro - chords drifting, no drums
const introAm = stack(rhodes("[a3,c4,e4,g4]"), vinyl)
const introF  = stack(rhodes("[f3,a3,c4,e4]"), vinyl)

// verse - light trap groove
const verseAm = stack(drumsLight, sub("a1"), rhodes("[a3,c4,e4]"), vinyl)
const verseF  = stack(drumsLight, sub("f1"), rhodes("[f3,a3,c4]"), vinyl)
const verseC  = stack(drumsLight, sub("c2"), rhodes("[c3,e3,g3]"), vinyl)
const verseG  = stack(drumsLight, sub("g1"), rhodes("[g3,b3,d4]"), vinyl)

// chorus - full drums + vibraphone melody
const chorusAm = stack(drumsFull, sub("a1"), rhodes("[a3,c4,e4,g4]"), vibe("e5 ~ c5 ~ a4 ~ ~ ~"), vinyl)
const chorusF  = stack(drumsFull, sub("f1"), rhodes("[f3,a3,c4,e4]"), vibe("f5 ~ ~ c5 ~ a4 ~ ~"), vinyl)
const chorusC  = stack(drumsFull, sub("c2"), rhodes("[c3,e3,g3,b3]"), vibe("g5 ~ e5 ~ ~ c5 ~ ~"), vinyl)
const chorusG  = stack(drumsFull, sub("g1"), rhodes("[g3,b3,d4,f4]"), vibe("d5 ~ b4 ~ g4 ~ ~ ~"), vinyl)

// bridge - stripped, smoky
const bridgeAm = stack(rhodes("[a3,c4,e4]"), vibe("a4 ~ ~ e4 ~ ~ ~ ~"), vinyl)
const bridgeF  = stack(rhodes("[f3,a3,c4]"), vibe("c5 ~ ~ a4 ~ ~ ~ ~"), vinyl)

// outro - fade to chords
const outroAm = stack(rhodes("[a3,c4,e4,g4]"), vinyl)
const outroF  = stack(rhodes("[f3,a3,c4,e4]"), vinyl)

slowcat(
  introAm, introF, introAm, introF,
  verseAm, verseF, verseC, verseG,
  verseAm, verseF, verseC, verseG,
  chorusAm, chorusF, chorusC, chorusG,
  chorusAm, chorusF, chorusC, chorusG,
  verseAm, verseF, verseC, verseG,
  chorusAm, chorusF, chorusC, chorusG,
  chorusAm, chorusF, chorusC, chorusG,
  bridgeAm, bridgeF, bridgeAm, bridgeF,
  chorusAm, chorusF, chorusC, chorusG,
  chorusAm, chorusF, chorusC, chorusG,
  outroAm, outroF, outroAm, outroF
)
