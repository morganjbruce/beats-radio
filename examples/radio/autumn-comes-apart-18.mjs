export const title = 'Autumn Comes Apart'
export const genre = 'Indie rock (The National lineage) — brooding chamber-rock with propulsive drumming'
export const mood = 'brooding, literate, melancholic-but-warm — anxious tension that builds and releases; intimate and autumnal, then cinematic and cathartic'
export const cycles = 84
// exported from the radio DB (2026-06-30); restore with: bun scripts/post-song.mjs <this file>
export const code = `// Genre: Indie rock — The National lineage / brooding, melancholic-but-warm / autumnal, cinematic
// FIX: chord beds used top-level <a b c d> repeated in slowcat, which freezes on the first chord
//      (slowcat queries each entry at cycle floor(t/N)=0 for the whole first pass). Corrected by
//      spelling out ONE chord per slowcat entry via per-cycle segments. Same harmony, now moving.
// Harmony: D minor / Aeolian. VERSE falls Dm9 - Bb(add9) - Fmaj7 - C(add9) (no dominant, withheld
//      resolution). CHORUS reorders the colours to LIFT: Bb - F - C - Dm. BRIDGE risk: Dm -> Bbm
//      (borrowed iv gut-punch) -> Gbmaj7 (chromatic mediant) -> A7 (the long-withheld dominant) home.
// Motif: the "anxious sigh" — leaps up to the tonic peak then sighs down. Intro = falling tail;
//      verse = full statement; chorus = up to f5 + a 3rd harmony, piano doubling; verse2 = faster
//      fragments; bridge = inverted (rises & stays); final = octave-up climax, saw+steinway doubled.
// Rhythm: Devendorf off-kilter propulsion — busy 16th hats/shaker, snare displaced off the backbeat,
//      ghost rims, tumbling toms; builds brushy intro -> full verse -> crash chorus -> tom bridge ->
//      fullest final -> exhausted outro. setcps 0.48.
setcps(0.48)

// ===== THE KIT — Devendorf off-kilter propulsion (within-cycle patterns, repeat fine) =============
const drumsIntro = stack(
  s("bd ~ ~ ~ ~ ~ bd ~").gain(0.4).lpf(900),
  s("shaker*8").gain("0.1 0.06 0.09 0.06 0.1 0.06 0.09 0.06").pan(0.1),
  s("~ ~ ~ rim ~ ~ ~ ~").gain(0.18).room(0.4)
)
const drumsVerse = stack(
  s("bd ~ ~ bd ~ ~ bd ~").gain(0.46),
  s("~ ~ ~ sd ~ ~ sd ~").gain("0 0 0 0.42 0 0 0.3 0").room(0.3),
  s("[rim ~]*4").gain("0.14 0 0.1 0 0.12 0 0.1 0").pan(-0.15),
  s("hh*8").gain("0.22 0.12 0.18 0.12 0.2 0.12 0.18 0.12").pan(0.12),
  s("~ ~ oh ~ ~ ~ ~ oh").gain(0.16).pan(0.2),
  s("shaker*8").gain(0.08)
)
const drumsChorus = stack(
  s("cr ~ ~ ~ ~ ~ ~ ~").gain(0.34).room(0.5),
  s("bd ~ bd ~ ~ bd bd ~").gain(0.48),
  s("~ ~ ~ sd ~ ~ sd ~").gain("0 0 0 0.46 0 0 0.4 0").room(0.32),
  s("rd*8").gain("0.16 0.1 0.14 0.1 0.16 0.1 0.14 0.1").pan(0.15),
  s("[mt ~ ~ lt]").gain("0.2 0 0 0.18").lpf(500),
  s("shaker*8").gain(0.09)
)
const drumsBridge = stack(
  s("lt ~ ~ ~ lt ~ lt ~").gain("0.34 0 0 0 0.32 0 0.3 0").lpf(420).room(0.4),
  s("~ ~ rim ~ ~ ~ ~ rim").gain(0.16).pan(-0.18),
  s("shaker*8").gain("0.08 0.05 0.07 0.05 0.1 0.06 0.08 0.06"),
  s("~ ~ ~ ~ ~ ~ ~ oh").gain(0.12).pan(0.2)
)
const drumsFinal = stack(
  s("cr ~ ~ ~ ~ ~ ~ ~").gain(0.36).room(0.5),
  s("bd ~ bd ~ bd ~ bd bd").gain(0.5),
  s("~ ~ ~ sd ~ sd sd ~").gain("0 0 0 0.48 0 0.32 0.44 0").room(0.34),
  s("hh*16").gain(0.12).pan(0.1),
  s("rd*8").gain("0.16 0.1 0.14 0.1 0.16 0.1 0.14 0.1").pan(0.16),
  s("[~ lt mt ~ ~ mt ht ~]").gain("0 0.24 0.26 0 0 0.24 0.26 0").lpf(600),
  s("shaker*8").gain(0.1)
)

// ===== THE MOTIF — the "anxious sigh" on the warm saw lead (within-cycle phrases, reused) =========
const motifFrag = note("~ ~ ~ c5 ~ a4 ~ f4")
  .s("sawtooth").lpf(1500).resonance(4).vib(4.5).vmod(0.05)
  .attack(0.02).release(0.5).gain(0.24).room(0.5).delay(0.2).delaytime(0.33).delayfeedback(0.2).pan(0.18)
const motifFull = note("~ a4 d5 ~ c5 ~ a4 f4")
  .s("sawtooth").lpf(1700).resonance(5).vib(5).vmod(0.06)
  .attack(0.015).release(0.4).gain(0.3).room(0.45).delay(0.18).delaytime(0.33).delayfeedback(0.22).pan(0.2)
const motifLift = note("~ c5 f5 ~ e5 ~ c5 a4")
  .s("sawtooth").lpf(2100).resonance(5).vib(5).vmod(0.05)
  .attack(0.012).release(0.42).gain(0.3).room(0.45).delay(0.16).delaytime(0.33).delayfeedback(0.2).pan(0.2)
const motifLiftHarm = note("~ a4 c5 ~ c5 ~ a4 f4")
  .s("sawtooth").lpf(1700).resonance(4)
  .attack(0.02).release(0.42).gain(0.2).room(0.45).pan(-0.22)
const motifFrag2 = note("a4 ~ [d5 c5] ~ a4 ~ [f4 a4] ~")
  .s("sawtooth").lpf(1800).resonance(5).vib(5).vmod(0.06)
  .attack(0.012).release(0.32).gain(0.29).room(0.42).delay(0.18).delaytime(0.33).delayfeedback(0.22).pan(0.22)
const motifInvert = note("~ f4 ~ a4 ~ c5 ~ d5")
  .s("sawtooth").lpf(1700).resonance(6).vib(5).vmod(0.07)
  .attack(0.03).release(0.6).gain(0.3).room(0.6).delay(0.22).delaytime(0.33).delayfeedback(0.28).pan(0.1)
const motifClimax = note("a4 c5 f5 ~ e5 c5 a4 f4")
  .s("sawtooth").lpf(2300).resonance(5).vib(5).vmod(0.05)
  .attack(0.01).release(0.45).gain(0.32).room(0.5).delay(0.16).delaytime(0.33).delayfeedback(0.22).pan(0.18)

// interlocking piano twin line (choruses & final only)
const pianoChorus = note("f4 ~ c5 ~ ~ a4 ~ c5")
  .s("piano").lpf(2400).attack(0.005).release(0.5).gain(0.24).room(0.4).pan(0.28)
const pianoClimax = note("f4 a4 c5 d5 ~ c5 a4 ~")
  .s("steinway").lpf(2600).attack(0.005).release(0.5).gain(0.27).room(0.45).pan(0.26)

// vibraphone glints (gain<=0.2)
const vibBridge = note("~ ~ ~ d5 ~ ~ ~ ~").s("vibraphone").lpf(2400).gain(0.18).room(0.7).release(0.8).pan(-0.25)
const vibClimax = note("~ ~ f5 ~ ~ ~ d5 ~").s("vibraphone").lpf(2600).gain(0.2).room(0.65).release(0.7).pan(-0.2)

// section extras
const verse2echo = note("~ ~ ~ ~ a3 ~ f3 ~").s("rhodes").lpf(1400).gain(0.22).release(0.4).room(0.4).pan(-0.2)
const verse2oh = s("~ ~ oh ~ ~ oh ~ ~").gain(0.1).pan(0.2)
const chorus2oh = s("~ ~ ~ ~ oh ~ ~ ~").gain(0.13).pan(0.18)

// ===== PROGRESSIONS — one chord/root/pad per cycle (NOT via <...> in slowcat) =====================
const VERSE_CH = ['d3,f3,a3,e4', 'bb2,d3,f3,c4', 'f2,a2,c3,e3', 'c3,e3,g3,d4']
const VERSE_RT = ['d2', 'bb1', 'f1', 'c2']
const CHORUS_CH = ['bb2,d3,f3,c4', 'f2,a2,c3,e3', 'c3,e3,g3,d4', 'd3,f3,a3,e4']
const CHORUS_RT = ['bb1', 'f1', 'c2', 'd2']
const CHORUS_PAD = ['bb2,f3', 'a2,f3', 'g2,e3', 'f2,a2']
const BRIDGE_CH = ['d3,f3,a3,e4', 'bb2,db3,f3,ab3', 'gb2,bb2,db3,f3', 'a2,cs3,e3,g3']
const BRIDGE_RT = ['d2', 'bb1', 'gb1', 'a1']
const BRIDGE_PAD = ['d3,a3', 'db3,ab3', 'db3,gb3', 'cs3,a3']

const verseSeg = (i, ...leads) => stack(
  note(m(VERSE_CH[i % 4])).s("rhodes").lpf(1600).attack(0.02).release(0.7).gain(0.32).room(0.45).pan(-0.12),
  note(m(VERSE_RT[i % 4])).struct("x ~ x ~ ~ x ~ x").s("sawtooth").lpf(220).shape(0.18).attack(0.01).release(0.28).gain(0.46),
  ...leads,
  drumsVerse
)
const chorusSeg = (i, ...leads) => stack(
  note(m(CHORUS_CH[i % 4])).s("rhodes").lpf(1900).attack(0.02).release(0.7).gain(0.34).room(0.45).pan(-0.12),
  note(m(CHORUS_RT[i % 4])).struct("x ~ ~ x ~ x ~ x").s("sawtooth").lpf(260).shape(0.2).attack(0.01).release(0.3).gain(0.48),
  note(m(CHORUS_PAD[i % 4])).s("triangle").lpf(800).attack(0.4).release(1.2).gain(0.18).room(0.6),
  ...leads,
  drumsChorus
)
const bridgeSeg = (i, ...leads) => stack(
  note(m(BRIDGE_CH[i % 4])).s("rhodes").lpf(1700).attack(0.03).release(0.8).gain(0.33).room(0.55).pan(-0.1),
  note(m(BRIDGE_RT[i % 4])).struct("x ~ x ~ x ~ x x").s("sawtooth").lpf(240).shape(0.2).attack(0.01).release(0.3).gain(0.48),
  note(m(BRIDGE_PAD[i % 4])).s("triangle").lpf(850).attack(0.6).release(1.5).gain(0.2).room(0.7),
  ...leads,
  drumsBridge
)
const finalSeg = (i, ...leads) => stack(
  note(m(CHORUS_CH[i % 4])).s("rhodes").lpf(1900).attack(0.02).release(0.7).gain(0.36).room(0.45).pan(-0.12),
  note(m(CHORUS_RT[i % 4])).struct("x ~ ~ x ~ x ~ x").s("sawtooth").lpf(260).shape(0.2).attack(0.01).release(0.3).gain(0.5),
  note(m(CHORUS_PAD[i % 4])).s("triangle").lpf(800).attack(0.4).release(1.2).gain(0.2).room(0.6),
  ...leads,
  drumsFinal
)

// ===== STATIC BOOKENDS — intro/outro use within-cycle phrases (no <...>) ==========================
const rhodesIntro = note("[d3,f3,a3,e4] ~ ~ ~ ~ ~ [f2,a2,c3,e3] ~")
  .s("rhodes").lpf(1300).attack(0.04).release(1.1).gain(0.3).room(0.6).pan(-0.1)
const bassIntro = note("d2 ~ ~ ~ f1 ~ ~ ~").s("triangle").lpf(200).attack(0.04).release(0.9).gain(0.4)
const intro = stack(rhodesIntro, bassIntro, motifFrag, drumsIntro)
const outro = stack(rhodesIntro, bassIntro, motifFrag.gain(0.2), drumsIntro.gain(0.7))

// ===== ARRANGEMENT — chords now advance through each section's progression, cycle by cycle ========
slowcat(
  ...Array.from({ length: 8 }, () => intro),                                  // 8 intro
  ...Array.from({ length: 12 }, (_, k) => verseSeg(k, motifFull)),            // 12 verse1
  ...Array.from({ length: 10 }, (_, k) => chorusSeg(k, motifLift, motifLiftHarm, pianoChorus)), // 10 chorus1
  ...Array.from({ length: 12 }, (_, k) => verseSeg(k, motifFrag2, verse2echo, verse2oh)), // 12 verse2
  ...Array.from({ length: 10 }, (_, k) => chorusSeg(k, motifLift, motifLiftHarm, pianoChorus, chorus2oh)), // 10 chorus2
  ...Array.from({ length: 12 }, (_, k) => bridgeSeg(k, motifInvert, vibBridge)), // 12 bridge
  ...Array.from({ length: 12 }, (_, k) => finalSeg(k, motifClimax, pianoClimax, vibClimax)), // 12 final chorus
  ...Array.from({ length: 8 }, () => outro)                                   // 8 outro
)
`
