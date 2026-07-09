export const title = 'Robot Funk Machine'
export const genre = 'Daft Punk / French house — but FUNKIER (Discovery / RAM funk: slap bass, clav-wah stabs, deep pocket)'
export const mood = 'sweaty, syncopated, joyous, robot-with-a-pelvis, deep-pocket dancefloor funk'
export const cycles = 80
// exported from the radio DB (2026-06-30); restore with: bun scripts/post-song.mjs <this file>
export const code = `// Genre: Daft Punk, but FUNKIER — French-house foundation pushed HARD into RAM-era funk. ~118 BPM,
//   swung. Same lineage as "Robot Heart Discotheque" (four-on-the-floor 909 + resonant filter sweeps),
//   but the groove is the point now: slap-ish syncopated bass with ghost notes & octave pops, chopped
//   clav/wah chord stabs, a muted funk-guitar stab, call-and-response between bass and chords, a tighter
//   SWUNG pocket. Funkier than the predecessor by design — less hypnotic-minor, more pelvis.
// Sounds (6, allowed set ONLY): bd+cp (909 four-on-the-floor kick + backbeat clap), hh/oh (swung 16th
//   shuffle hats + offbeat open-hat churn), sawtooth (the slap-funk BASS — octave pops, ghost notes,
//   chromatic walk), square (the CLAV/WAH chord stabs — chopped, auto-wah lpf), sawtooth (a MUTED
//   FUNK-GUITAR stab — tight hpf+lpf chank), noise (filtered riser sweep into the drops).
// Harmony: E Dorian funk vamp (bright + funky, not the predecessor's plain A minor): Em9 -> A9 -> Cmaj7#11 -> B7b9.
//   RISKS (two): the Cmaj7#11 is a LYDIAN borrowed chord (a# = chromatic #11 rub, the RAM "lift"), and the
//   B7b9 is an ALTERED secondary dominant (V7b9/Em: d#, a, c the b9) that yanks hard back to Em every loop.
//   A9 is the Dorian major-IV color (c#) — the bright funk pull. Bass roots walk e-a-c-b with a chromatic
//   d#->e leading-tone pickup on the turnaround.
// Motif: a funky CALL-AND-RESPONSE — the clav states a stabby 2-note "chank" CALL, the bass ANSWERS with a
//   slap fill; over the song the bass answer DEVELOPS (octave pops -> ghost-note 16ths -> a chromatic walk-up
//   in the big drop) and the clav CALL transposes to follow each chord. A guitar stab doubles the call up an
//   octave in the drops. Tension tones land: the #11 over C, the b9 over B7.
// Structure: French-house evolving-filter build (Approach 1, sectioned) — but unlike the predecessor where a
//   single riff just breathes through a filter, here each section ADDS a funk LAYER: intro (kick+bass pocket)
//   -> build (clav-wah enters, filter opening) -> DROP1 (full slap bass + clav call-and-response + guitar
//   chank, filter wide open — the funk lands) -> breakdown (strip to wah clav + ghost bass, drenched) ->
//   build2 (re-tension) -> DROP2 (BIGGER: bass walks chromatic, guitar+clav max, the peak) -> outro (filter
//   closes, the machine winds down). The pocket SWINGS the whole way (.swingBy).
setcps(0.4917)   // ~118 BPM — a hair slower than the predecessor for a deeper, fatter pocket

// ===== DRUMS — four-on-the-floor kick, snapping backbeat, SWUNG shuffle hats ====================
const kick = s("bd*4").bank("RolandTR909").lpf(4400).shape(0.24).attack(0.001).release(0.13).gain(0.96)
const kickSoft = s("bd*4").bank("RolandTR909").lpf(2700).shape(0.12).attack(0.001).release(0.12).gain(0.74)
// Backbeat clap on 2 & 4 — the funk snap, a touch of air.
const clap = s("~ cp ~ cp").bank("RolandTR909").hpf(620).shape(0.13).room(0.15).gain(0.6).release(0.11)
// Swung 16th closed hats — swing via .swingBy(1/3) + loud/soft gain accents so they SHUFFLE, not march.
const hats = s("hh*16").bank("RolandTR909").hpf(8800).swingBy(1/3, 4).gain("0.26 0.07 0.17 0.1 0.23 0.07 0.15 0.12 0.26 0.07 0.17 0.1 0.21 0.07 0.15 0.14").release(0.03)
const hatsLite = s("hh*8").bank("RolandTR909").hpf(8800).swingBy(1/3, 2).gain("0.18 0.08 0.14 0.09 0.18 0.08 0.13 0.1").release(0.03)
// Offbeat open-hat churn — the house "tss" upbeats, also swung for the shuffle.
const ophat = s("~ oh ~ oh ~ oh ~ oh").bank("RolandTR909").hpf(7200).swingBy(1/3, 2).gain(0.2).release(0.1)
// Shaker on the offbeats — extra 16th shuffle sparkle in the drops.
const shake = s("~ shaker ~ shaker ~ shaker ~ shaker").hpf(6200).swingBy(1/3, 2).gain(0.15).release(0.07)

// ===== NOISE RISER — filtered white-noise sweep up into each drop ===============================
const riser = s("noise").struct("x").lpf(sine.range(400, 8000).slow(1)).hpf(260).gain(0.22).attack(0.45).release(0.1)
const riserBig = s("noise").struct("x").lpf(saw.range(500, 12000)).hpf(260).gain(0.32).attack(0.5).release(0.06)

// ===== THE SLAP-FUNK BASS — syncopated, ghost notes, octave pops; ANSWERS the clav ==============
// Roots walk e-a-c-b (Em9 A9 Cmaj7#11 B7b9), one chord per cycle. The funk is in the SYNCOPATION + ghosts.
const bassRoot = note("<e1 a1 c2 b1>")
// Pocket bass (intro/breakdown): root + octave pop, sparse, deep — the foundation of the groove.
const bassPocket = (voice) => voice.struct("x ~ ~ x ~ ~ x ~ x ~ ~ ~ x ~ ~ ~").s("sawtooth")
  .lpf(440).resonance(6).shape(0.34).attack(0.002).release(0.08).gain(0.5)
// Slap bass (drops): dense syncopated 16ths with GHOST NOTES (the quiet 16ths) + octave POPS up an octave.
// Pitch motion within the cycle = the slap fill that ANSWERS the clav call (root, octave pop, root, ghost run).
const bassSlap = (voice) => voice.add(note("<[0 ~ ~ 12 ~ 0 7 ~ 12 ~ 0 ~ 0 ~ ~ 7] [0 ~ ~ 12 ~ 0 7 ~ 12 ~ 0 ~ 0 ~ 7 ~] [0 ~ ~ 12 ~ 0 7 ~ 12 ~ 0 ~ 0 ~ ~ 7] [0 ~ ~ 12 ~ 0 7 ~ 12 ~ 0 ~ 0 ~ 7 ~]>"))
  .s("sawtooth").lpf(900).resonance(9).shape(0.36).attack(0.002).release(0.06)
  .gain("0.5 0 0 0.32 0 0.18 0.4 0 0.34 0 0.16 0 0.46 0 0.14 0.3")
// Big-drop slap: same but with a CHROMATIC WALK-UP fill on the turnaround (the development) + sub reinforcement.
const bassSlapBig = (voice) => voice.add(note("<[0 ~ ~ 12 ~ 0 7 ~ 12 ~ 0 ~ 0 ~ ~ 7] [0 ~ ~ 12 ~ 0 7 ~ 12 ~ 0 ~ 0 ~ 7 12] [0 ~ ~ 12 ~ 0 7 ~ 12 ~ 0 ~ 0 ~ ~ 7] [0 ~ ~ 12 ~ 0 7 ~ 0 1 2 3 0 ~ 3 4]>"))
  .s("sawtooth").lpf(1100).resonance(10).shape(0.38).attack(0.002).release(0.06)
  .gain("0.52 0 0 0.34 0 0.2 0.42 0 0.36 0 0.18 0.12 0.48 0 0.16 0.34")
// Clean sub so the low end survives when the slap is filtered/absent (intro/breakdown).
const bassSub = (voice) => voice.struct("x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~").s("sine").lpf(105).gain(0.5)

// ===== THE CLAV / WAH CHORD STABS — chopped, percussive, auto-wah (the funky CALL) ==============
// Extended Dorian/Lydian/altered voicings cycling Em9 A9 Cmaj7#11 B7b9 — one per cycle.
//   Em9 = e,g,b,d,f#  ·  A9 = a,c#,e,g,b  ·  Cmaj7#11 = c,e,a#,b,d (the #11 a# rub)  ·  B7b9 = b,d#,a,c (b9 c)
const clavChords = note("<[e3,g3,b3,d4,f#4] [a3,c#4,e4,g4,b4] [c3,e3,a#3,b3,d4] [b2,d#3,a3,c4]>")
// The CALL: a stabby syncopated clav figure (2-hit "chank" + answers). Auto-wah = fast sine lpf + hi resonance.
const clavStruct = "x ~ x ~ ~ x ~ x ~ ~ x ~ x ~ ~ ~"
const clavWah = (chord) => chord.struct(clavStruct).s("square")
  .lpf(sine.range(500, 3400).fast(2)).resonance(15).shape(0.3)
  .attack(0.003).decay(0.1).sustain(0.05).release(0.07).gain(0.3).room(0.12)
// Build version: filter held lower, opening — muffled clav trapped behind the wah, tension.
const clavMuffled = (chord, cut) => chord.struct(clavStruct).s("square")
  .lpf(cut).resonance(11).shape(0.26).attack(0.003).decay(0.1).sustain(0.05).release(0.07).gain(0.24).room(0.1)
// Drop version: denser chop, wah wide open + resonant, the funk peak.
const clavDrop = (chord) => chord.struct("x ~ x x ~ x ~ x x ~ x ~ x ~ x ~").s("square")
  .lpf(sine.range(900, 4800).fast(2)).resonance(16).shape(0.32)
  .attack(0.003).decay(0.09).sustain(0.06).release(0.07).gain(0.32).room(0.14)
// Breakdown version: drenched, slow wah, fewer stabs, big reverb+delay — the room empties.
const clavDrenched = (chord) => chord.struct("x ~ ~ ~ x ~ x ~ ~ ~ x ~ ~ ~ ~ ~").s("square")
  .lpf(sine.range(350, 1900).slow(2)).resonance(13).shape(0.24)
  .attack(0.01).decay(0.22).sustain(0.12).release(0.3).gain(0.3).room(0.46).delay(0.3).delaytime(0.333).delayfeedback(0.42)

// ===== THE MUTED FUNK-GUITAR STAB — tight hpf+lpf "chank" doubling the call up an octave =========
// Synthesized muted-guitar: short percussive saw, narrow hpf+lpf band, very short envelope = the chick/chank.
// Voiced an octave up from the clav so it sits as the bright funk "scratch" on top. Slightly off the clav grid
// for call-and-response interplay.
const gtrChords = note("<[e4,g4,b4] [a4,c#5,e5] [e4,a#4,b4] [d#4,a4,b4]>")
const gtrStruct = "~ x ~ x ~ ~ x ~ ~ x ~ x ~ x ~ x"
const gtrChank = (chord) => chord.struct(gtrStruct).s("sawtooth")
  .hpf(900).lpf(2600).resonance(10).shape(0.28)
  .attack(0.002).decay(0.06).sustain(0.0).release(0.05).gain(0.24).pan(0.18).room(0.1)
// Drop guitar: a touch brighter + busier, the funk scratch maxed.
const gtrChankDrop = (chord) => chord.struct("~ x x x ~ x x ~ ~ x x x ~ x ~ x").s("sawtooth")
  .hpf(950).lpf(3000).resonance(11).shape(0.3)
  .attack(0.002).decay(0.06).sustain(0.0).release(0.05).gain(0.26).pan(0.18).room(0.12)

// ===== SECTIONS — each ADDS a funk layer; the pocket SWINGS throughout ==========================
// intro — kick + sub + pocket bass; the groove's bones, a whisper of hats. Establish the swung pocket.
const intro = stack(kickSoft, bassSub(bassRoot), bassPocket(bassRoot).gain(0.4), hatsLite.gain(0.1))
const introB = stack(kick.gain(0.86), bassSub(bassRoot), bassPocket(bassRoot), hatsLite.gain(0.14), clap.gain(0.4), clavMuffled(clavChords, 560).gain(0.18))

// build — clav-wah enters and OPENS, riser, hats + offbeat open-hat in, the funk gathering.
const build = stack(kick, bassSub(bassRoot), bassPocket(bassRoot), clavMuffled(clavChords, 1100).gain(0.26), riser, hats.gain(0.16), ophat.gain(0.14))
const buildB = stack(kick, bassSub(bassRoot), bassSlap(bassRoot).gain(0.42), clavMuffled(clavChords, 2000).gain(0.3), gtrChank(gtrChords).gain(0.16), riserBig, hats.gain(0.2), ophat.gain(0.18), clap.gain(0.5))

// DROP1 — FULL FUNK: slap bass + clav call-and-response + guitar chank, filter wide open. The funk lands.
const drop1 = stack(kick, clap, hats, ophat, bassSlap(bassRoot), bassSub(bassRoot), clavDrop(clavChords), gtrChank(gtrChords))
const drop1b = stack(kick, clap, hats, ophat, shake, bassSlap(bassRoot), clavDrop(clavChords), gtrChankDrop(gtrChords), riser.gain(0.1))

// breakdown — strip to drenched wah clav + ghost-note pocket bass + sub, filter half-lit; the room empties.
const breakdown = stack(kickSoft.gain(0.64), bassSub(bassRoot), bassPocket(bassRoot).gain(0.36), clavDrenched(clavChords), clap.gain(0.3).room(0.4))
const breakdownB = stack(kick.gain(0.8), bassSub(bassRoot), bassPocket(bassRoot), clavDrenched(clavChords).gain(0.32), gtrChank(gtrChords).gain(0.16), clap.gain(0.42))

// build2 — re-tension, bigger riser, clav climbing back open, into the BIGGER drop.
const build2 = stack(kick, bassSub(bassRoot), bassSlap(bassRoot).gain(0.44), clavMuffled(clavChords, 2300).gain(0.32), gtrChank(gtrChords).gain(0.2), riserBig.gain(0.36), hats.gain(0.22), ophat.gain(0.18), clap.gain(0.5))

// DROP2 — BIGGER: bass WALKS chromatic on the turnaround, guitar+clav maxed, shaker in. The peak.
const drop2 = stack(kick, clap, hats, ophat, shake, bassSlapBig(bassRoot), bassSub(bassRoot), clavDrop(clavChords), gtrChankDrop(gtrChords))
const drop2b = stack(kick, clap, hats, ophat, shake, bassSlapBig(bassRoot), clavDrop(clavChords).gain(0.34), gtrChankDrop(gtrChords), riserBig.gain(0.12))

// outro — filter closes, slap fades to pocket, the machine winds down.
const outro = stack(kickSoft.gain(0.58), bassSub(bassRoot).gain(0.42), bassPocket(bassRoot).gain(0.3), clavMuffled(clavChords, 640).gain(0.22), hatsLite.gain(0.1))
const outroB = stack(kickSoft.gain(0.4), bassSub(bassRoot).gain(0.32), clavMuffled(clavChords, 360).gain(0.18))

// ===== ARRANGEMENT — 80 cycles ==================================================================
slowcat(
  intro, intro, introB, introB, introB, introB,                              // 6  pocket established (kick + slap pocket bass)
  build, build, build, buildB, buildB, buildB,                               // 6  clav-wah opening, slap + guitar in, riser (tension)
  drop1, drop1b, drop1, drop1b, drop1, drop1b, drop1, drop1b,                // 8  DROP 1 (full slap + clav call-and-response + chank)
  drop1, drop1b, drop1, drop1b,                                              // 4  drop1 rides, the pocket locks
  breakdown, breakdown, breakdownB, breakdownB, breakdown, breakdownB,       // 6  breakdown (drenched wah clav, ghost bass)
  build2, build2, build2, build2, build2, build2, build2, build2,           // 8  build (bigger riser, re-tension)
  drop2, drop2b, drop2, drop2b, drop2, drop2b, drop2, drop2b,                // 8  BIGGER DROP (chromatic bass walk, guitar+clav max)
  drop2, drop2b, drop2, drop2b, drop2, drop2b, drop2, drop2b,                // 8  bigger drop rides, the peak
  drop2, drop2b, drop2, drop2b,                                              // 4  peak rides on (max dancefloor)
  breakdownB, breakdownB, breakdown, breakdown,                             // 4  short breakdown release
  drop1, drop1b, drop1, drop1b, drop1, drop1b, drop1, drop1b,                // 8  drop returns (the comedown groove)
  drop1, drop1b, drop1, drop1b,                                             // 4  groove rides out
  outro, outro, outroB, outroB                                              // 4  filter closes, the machine winds down (80 total)
)
`
