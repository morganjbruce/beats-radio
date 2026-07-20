// Cherry Cola Cathedral
// Sad-Girl Gospel Trap · Hazy 2020s Hollywood Nocturne · Melancholic, glamorous, heavy-hearted but slinky

// Genre: Sad-Girl Gospel Trap
// Era: Hazy 2020s Hollywood Nocturne
// Mood: Melancholic, glamorous, heavy and slinky
// Sounds: 808 kick, 808 clap, trap hats, sine 808 sub-bass, organ_full pad, vibraphone lead
// Sound choice: Loud TR808 drums + deep sine sub for the trap weight, organ and vibraphone for Lana-style cinematic melancholy

setcps(0.58)

// --- shared loud drum bed ---
let drums = stack(
  s("bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ bd ~").bank("RolandTR808").gain(1.15).shape(0.35),
  s("~ ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~").bank("RolandTR808").gain(0.95).room(0.2),
  s("hh*16").bank("RolandTR808").gain("0.45 0.2 0.3 0.2").pan(0.1)
)

// busier hats for energy sections
let drumsRoll = stack(
  s("bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ bd ~ ~").bank("RolandTR808").gain(1.15).shape(0.35),
  s("~ ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~").bank("RolandTR808").gain(0.95).room(0.2),
  s("hh*16 [hh*4]").bank("RolandTR808").gain("0.45 0.2 0.3 0.2").pan(0.1)
)

// --- intro: sub + light drums ---
let introAm = stack(
  s("bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ ~").bank("RolandTR808").gain(1.1).shape(0.3),
  s("hh*8").bank("RolandTR808").gain(0.3),
  note("a1").struct("x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~ ~").s("sine").lpf(120).gain(0.95).shape(0.3).attack(0.01).release(0.5),
  note("[a3,c4,e4]").s("organ_full").lpf(700).gain(0.22).room(0.5).attack(0.3)
)

// --- main progression: Am - F - C - G ---
let mainAm = stack(
  drums,
  note("a1").struct("x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~").s("sine").lpf(130).gain(1.0).shape(0.35).attack(0.01).release(0.45),
  note("[a3,c4,e4]").s("organ_full").lpf(850).gain(0.26).room(0.45).attack(0.2),
  note("e4 ~ ~ c4 ~ ~ a3 ~").s("vibraphone").gain(0.18).room(0.6).delay(0.3)
)
let mainF = stack(
  drums,
  note("f1").struct("x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~").s("sine").lpf(130).gain(1.0).shape(0.35).attack(0.01).release(0.45),
  note("[f3,a3,c4]").s("organ_full").lpf(850).gain(0.26).room(0.45).attack(0.2),
  note("f4 ~ ~ c4 ~ ~ a3 ~").s("vibraphone").gain(0.18).room(0.6).delay(0.3)
)
let mainC = stack(
  drums,
  note("c2").struct("x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~").s("sine").lpf(130).gain(1.0).shape(0.35).attack(0.01).release(0.45),
  note("[c3,e3,g3]").s("organ_full").lpf(850).gain(0.26).room(0.45).attack(0.2),
  note("g4 ~ ~ e4 ~ ~ c4 ~").s("vibraphone").gain(0.18).room(0.6).delay(0.3)
)
let mainG = stack(
  drumsRoll,
  note("g1").struct("x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~").s("sine").lpf(130).gain(1.0).shape(0.35).attack(0.01).release(0.45),
  note("[g3,b3,d4]").s("organ_full").lpf(850).gain(0.26).room(0.45).attack(0.2),
  note("d4 ~ ~ b3 ~ ~ g3 ~").s("vibraphone").gain(0.18).room(0.6).delay(0.3)
)

// --- bridge: stripped, breathy ---
let bridgeAm = stack(
  s("bd ~ ~ ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~").bank("RolandTR808").gain(1.05).shape(0.3),
  s("hh*8").bank("RolandTR808").gain(0.28),
  note("a1").struct("x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~").s("sine").lpf(120).gain(0.95).shape(0.3).release(0.6),
  note("[a3,c4,e4,g4]").s("organ_full").lpf(700).gain(0.24).room(0.6).attack(0.4),
  note("e4 ~ ~ ~ c5 ~ b4 ~").s("vibraphone").gain(0.16).room(0.7).delay(0.35)
)
let bridgeF = stack(
  s("bd ~ ~ ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~").bank("RolandTR808").gain(1.05).shape(0.3),
  s("hh*8").bank("RolandTR808").gain(0.28),
  note("f1").struct("x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~").s("sine").lpf(120).gain(0.95).shape(0.3).release(0.6),
  note("[f3,a3,c4,e4]").s("organ_full").lpf(700).gain(0.24).room(0.6).attack(0.4),
  note("c5 ~ ~ ~ a4 ~ f4 ~").s("vibraphone").gain(0.16).room(0.7).delay(0.35)
)

slowcat(
  introAm, introAm, introAm, introAm,
  mainAm, mainAm, mainF, mainF, mainC, mainC, mainG, mainG,
  mainAm, mainAm, mainF, mainF, mainC, mainC, mainG, mainG,
  bridgeAm, bridgeAm, bridgeF, bridgeF,
  bridgeAm, bridgeAm, bridgeF, bridgeF,
  mainAm, mainAm, mainF, mainF, mainC, mainC, mainG, mainG,
  mainAm, mainAm, mainF, mainF, mainC, mainC, mainG, mainG,
  introAm, introAm
)
