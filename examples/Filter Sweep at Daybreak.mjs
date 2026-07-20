// Filter Sweep at Daybreak
// French Touch / Filtered Disco House · late-1990s Paris (Roulé/Crydamoure-era) · euphoric, nostalgic, head-nodding, sunrise-after-the-club

// Genre: French Touch / Filtered Disco House
// Era: late-1990s Paris
// Mood: euphoric, nostalgic, head-nodding
// Sounds: 909 kick/clap/hats, sawtooth octave bass, filtered sawtooth chord stabs, sawtooth lead
// Sound choice: 909 groove + filter-swept sawtooth chords for classic pumping filtered-disco

setcps(0.5)

let drums = stack(
  s("bd*4").bank("RolandTR909").gain(0.9),
  s("~ cp ~ cp").bank("RolandTR909").gain(0.45).room(0.18),
  s("hh*8").bank("RolandTR909").gain(0.28).pan(sine.range(-0.25,0.25).fast(2)),
  s("[~ oh]*2").bank("RolandTR909").gain(0.22)
)

let bassDm = note("d2 d3 d2 d3 d2 d3 d2 d3").s("sawtooth").lpf(sine.range(260,620).slow(16)).gain(0.5).shape(0.2)
let bassG  = note("g2 g3 g2 g3 g2 g3 g2 g3").s("sawtooth").lpf(sine.range(260,620).slow(16)).gain(0.5).shape(0.2)
let bassC  = note("c2 c3 c2 c3 c2 c3 c2 c3").s("sawtooth").lpf(sine.range(260,620).slow(16)).gain(0.5).shape(0.2)
let bassA  = note("a1 a2 a1 a2 a1 a2 a1 a2").s("sawtooth").lpf(sine.range(260,620).slow(16)).gain(0.5).shape(0.2)

let stabDm = note("d3,f3,a3,c4,e4").s("sawtooth").struct("~ x x ~ x ~ x x").lpf(sine.range(500,2600).slow(32)).resonance(7).gain(0.34).room(0.25)
let stabG  = note("g3,b3,d4,f4,a4").s("sawtooth").struct("~ x x ~ x ~ x x").lpf(sine.range(500,2600).slow(32)).resonance(7).gain(0.34).room(0.25)
let stabC  = note("c3,e3,g3,b3,d4").s("sawtooth").struct("~ x x ~ x ~ x x").lpf(sine.range(500,2600).slow(32)).resonance(7).gain(0.34).room(0.25)
let stabA  = note("a2,cs4,e4,g4,bb4").s("sawtooth").struct("~ x x ~ x ~ x x").lpf(sine.range(500,2600).slow(32)).resonance(7).gain(0.34).room(0.25)

let leadDm = note("a4 ~ c5 d5 ~ c5 a4 g4").s("sawtooth").lpf(2200).resonance(4).gain(0.3).delay(0.3).delaytime(0.1875).room(0.3)
let leadG  = note("b4 ~ d5 e5 ~ d5 b4 a4").s("sawtooth").lpf(2200).resonance(4).gain(0.3).delay(0.3).delaytime(0.1875).room(0.3)
let leadC  = note("g4 ~ b4 c5 ~ b4 g4 e4").s("sawtooth").lpf(2200).resonance(4).gain(0.3).delay(0.3).delaytime(0.1875).room(0.3)
let leadA  = note("a4 ~ c5 e5 ~ d5 cs5 ~").s("sawtooth").lpf(2200).resonance(4).gain(0.3).delay(0.3).delaytime(0.1875).room(0.3)

let introDm = stack(drums, bassDm)
let introG  = stack(drums, bassG)
let introC  = stack(drums, bassC)
let introA  = stack(drums, bassA)

let verseDm = stack(drums, bassDm, stabDm)
let verseG  = stack(drums, bassG, stabG)
let verseC  = stack(drums, bassC, stabC)
let verseA  = stack(drums, bassA, stabA)

let chorusDm = stack(drums, bassDm, stabDm, leadDm)
let chorusG  = stack(drums, bassG, stabG, leadG)
let chorusC  = stack(drums, bassC, stabC, leadC)
let chorusA  = stack(drums, bassA, stabA, leadA)

slowcat(
  introDm, introG, introC, introA,
  verseDm, verseG, verseC, verseA,
  verseDm, verseG, verseC, verseA,
  chorusDm, chorusG, chorusC, chorusA,
  chorusDm, chorusG, chorusC, chorusA,
  verseDm, verseG, verseC, verseA,
  chorusDm, chorusG, chorusC, chorusA,
  chorusDm, chorusG, chorusC, chorusA,
  chorusDm, chorusG, chorusC, chorusA,
  introDm, introG, introC, introA
)
