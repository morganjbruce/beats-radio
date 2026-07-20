// The Empty Side of the Room
// Isolation House / Muffled Disco Through a Closed Door · late-night 2020s after-hours · bittersweet, alone-in-a-crowd, longing under euphoria

// Genre: Isolation House / Muffled Disco Through a Closed Door
// Era: late-night 2020s after-hours
// Mood: bittersweet, alone-in-a-crowd, longing under euphoria
// Sounds: muffled 909 kick+clap+open-hat, distant filtered saw stabs, intimate Rhodes, soft triangle lead, sine sub, vinyl crackle
// Sound choice: distant lowpassed party vs. close warm Rhodes = the loneliness gap
setcps(0.5)

const party = stack(
  s("bd*4").bank("RolandTR909").lpf(520).gain(0.5).shape(0.12),
  s("~ cp ~ cp").lpf(1100).gain(0.2).room(0.5),
  s("~ oh ~ oh").bank("RolandTR909").lpf(3200).gain(0.12)
)
const crackle = s("vinyl").gain(0.04)

// --- intro: distant party + faint chord pad (the harmony floating through the wall) ---
const introDm = stack(party, crackle, note("d3,f3,a3,c4").s("rhodes").gain(0.28).room(0.5).attack(0.1).lpf(1700))
const introG  = stack(party, crackle, note("g2,b2,d3,a3").s("rhodes").gain(0.28).room(0.5).attack(0.1).lpf(1700))
const introBb = stack(party, crackle, note("bb2,d3,f3,a3").s("rhodes").gain(0.28).room(0.5).attack(0.1).lpf(1700))
const introC  = stack(party, crackle, note("c3,e3,g3,d4").s("rhodes").gain(0.28).room(0.5).attack(0.1).lpf(1700))

// --- main: full groove, foreground Rhodes + lonely lead ---
const leadFx = (p) => p.s("triangle").lpf(1700).gain(0.28).room(0.5).delay(0.3).delaytime(0.375).delayfeedback(0.28)
const stabFx = (p) => p.s("sawtooth").lpf(560).resonance(4).gain(0.16).room(0.6).attack(0.01).release(0.25)
const rhFx   = (p) => p.s("rhodes").gain(0.38).room(0.4).attack(0.04)

const mainDm = stack(party, crackle,
  note("d2").struct("x ~ ~ x ~ x ~ ~").s("sine").lpf(130).gain(0.45),
  stabFx(note("d4,f4,a4,c5").struct("~ x ~ x ~ x ~ x")),
  rhFx(note("d3,f3,a3,c4,e4")),
  leadFx(note("d4 a4 ~ g4 ~ f4 ~ e4"))
)
const mainG = stack(party, crackle,
  note("g2").struct("x ~ ~ x ~ x ~ ~").s("sine").lpf(130).gain(0.45),
  stabFx(note("g3,b3,d4,a4").struct("~ x ~ x ~ x ~ x")),
  rhFx(note("g2,b2,d3,a3")),
  leadFx(note("d4 b4 ~ a4 ~ g4 ~ f#4"))
)
const mainBb = stack(party, crackle,
  note("bb1").struct("x ~ ~ x ~ x ~ ~").s("sine").lpf(130).gain(0.45),
  stabFx(note("bb3,d4,f4,a4").struct("~ x ~ x ~ x ~ x")),
  rhFx(note("bb2,d3,f3,a3,c4")),
  leadFx(note("f4 d5 ~ c5 ~ bb4 ~ a4"))
)
const mainC = stack(party, crackle,
  note("c2").struct("x ~ ~ x ~ x ~ ~").s("sine").lpf(130).gain(0.45),
  stabFx(note("c4,e4,g4,d5").struct("~ x ~ x ~ x ~ x")),
  rhFx(note("c3,e3,g3,d4")),
  leadFx(note("e4 c5 ~ b4 ~ g4 ~ e4"))
)

// --- breakdown: the party drops away, just you ---
const breakDm = stack(crackle,
  note("d2").struct("x ~ ~ ~").s("sine").lpf(115).gain(0.3),
  note("d3,f3,a3,c4,e4").s("rhodes").gain(0.4).room(0.7).attack(0.06),
  note("d4 a4 ~ g4 ~ f4 ~ e4").s("triangle").lpf(1500).gain(0.3).room(0.8).delay(0.4).delaytime(0.5).delayfeedback(0.35)
)
const breakBb = stack(crackle,
  note("bb1").struct("x ~ ~ ~").s("sine").lpf(115).gain(0.3),
  note("bb2,d3,f3,a3,c4").s("rhodes").gain(0.4).room(0.7).attack(0.06),
  note("f4 d5 ~ c5 ~ bb4 ~ a4").s("triangle").lpf(1500).gain(0.3).room(0.8).delay(0.4).delaytime(0.5).delayfeedback(0.35)
)

slowcat(
  introDm, introG, introBb, introC,
  introDm, introG, introBb, introC,
  mainDm, mainG, mainBb, mainC,
  mainDm, mainG, mainBb, mainC,
  mainDm, mainG, mainBb, mainC,
  breakDm, breakBb,
  mainDm, mainG, mainBb, mainC,
  mainDm, mainG, mainBb, mainC,
  mainDm, mainG, mainBb, mainC,
  breakDm, breakBb,
  mainDm, mainG, mainBb, mainC,
  mainDm, mainG, mainBb, mainC,
  mainDm, mainG, mainBb, mainC,
  introDm, introG, introBb, introC
)
