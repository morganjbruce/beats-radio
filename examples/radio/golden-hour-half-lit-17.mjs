export const title = 'Golden Hour, Half-Lit'
export const genre = 'Neo-soul / jazz-rap (Tyler, the Creator — Flower Boy era, 2017) — lush extended-chord soul with mellow boom-bap'
export const mood = 'bittersweet and sun-drenched; warm, dreamy, introspective — a head-nod groove under pretty-but-melancholic jazz harmony, the lead floating like a daydream'
export const cycles = 86
// exported from the radio DB (2026-06-30); restore with: bun scripts/post-song.mjs <this file>
export const code = `// Genre: Neo-soul / jazz-rap — Tyler, the Creator / Flower Boy era (2017) / bittersweet, sun-drenched
// FIX: the chord beds used top-level <a b c d> angle brackets repeated inside slowcat, which
//      FREEZES on the first chord (slowcat queries each entry at cycle floor(t/N) = 0 for the
//      whole first pass, so <...> never advances). Corrected by spelling out ONE chord per
//      slowcat entry: each section is a per-cycle segment whose rhodes chord + bass root + pad
//      advance through the progression explicitly. Same harmony, now actually moving.
// Harmony: F major leaning Lydian-warm. VERSE: Fmaj9 - Dm9 - Bbmaj7#11 - C13sus (the #11 Lydian
//      shimmer). HOOK: Bbmaj9 - Am9 - Gm11 - C7b9 (the altered dominant sting before home).
//      BRIDGE: Fmaj7 -> Dbmaj7 (chromatic-mediant ache) -> Ebmaj9 (borrowed bVII) -> C7alt home.
// Motif: the "daydream sigh" — rising leap to a held 9th, then a gentle fall. Intro = falling tail
//      on vibraphone; verse = full statement on soft triangle; hook = up to f5 + a 3rd harmony;
//      verse2 = re-rhythmed fragments; bridge = inverted; final hook = f5 climax doubled.
// Rhythm: mellow boom-bap-meets-soul ~78 BPM (setcps 0.5, half-time). Pushed kick, crisp backbeat
//      clap, swung hats, soft ghost rims, warm lpf'd kit. Melodic sawtooth bass walks the roots.
setcps(0.5)

// ===== THE KIT — mellow boom-bap-meets-soul, warm-filtered (within-cycle patterns, repeat fine) =
const drumsIntro = stack(
  s("bd ~ ~ ~ ~ ~ bd ~").gain(0.42).lpf(700),
  s("shaker*8").gain("0.09 0.05 0.08 0.05 0.09 0.05 0.08 0.05").pan(0.1),
  s("~ ~ ~ rim ~ ~ ~ ~").gain(0.16).room(0.45)
)
const drumsVerse = stack(
  s("bd ~ ~ bd ~ ~ ~ ~").gain(0.46).lpf(900),
  s("~ ~ ~ ~ cp ~ ~ ~").gain(0.4).room(0.32),
  s("hh*8").gain("0.2 0.1 0.16 0.1 0.2 0.1 0.16 0.1").pan(0.12).lpf(7000),
  s("~ rim ~ ~ ~ ~ rim ~").gain(0.12).pan(-0.15),
  s("shaker*8").gain(0.07)
)
const drumsHook = stack(
  s("bd ~ bd ~ ~ ~ bd ~").gain(0.48).lpf(950),
  s("~ ~ ~ ~ cp ~ ~ ~").gain(0.42).room(0.34),
  s("~ ~ ~ ~ ~ ~ ~ sd").gain(0.22).room(0.3),
  s("hh*8").gain("0.2 0.11 0.17 0.11 0.2 0.11 0.17 0.11").pan(0.12).lpf(7500),
  s("~ ~ oh ~ ~ ~ ~ oh").gain(0.14).pan(0.2).lpf(6000),
  s("shaker*8").gain(0.08)
)
const drumsBridge = stack(
  s("bd ~ ~ ~ ~ ~ bd ~").gain(0.4).lpf(750),
  s("~ ~ rim ~ ~ ~ ~ rim").gain(0.14).pan(-0.18),
  s("shaker*8").gain("0.07 0.05 0.06 0.05 0.09 0.05 0.07 0.05"),
  s("~ ~ ~ ~ cp ~ ~ ~").gain(0.26).room(0.4)
)
const drumsFinal = stack(
  s("bd ~ bd ~ ~ bd bd ~").gain(0.5).lpf(1000),
  s("~ ~ ~ ~ cp ~ ~ ~").gain(0.44).room(0.34),
  s("~ ~ ~ sd ~ ~ sd ~").gain("0 0 0 0.2 0 0 0.26 0").room(0.3),
  s("hh*8").gain("0.2 0.12 0.17 0.12 0.2 0.12 0.17 0.12").pan(0.1).lpf(8000),
  s("~ ~ oh ~ ~ ~ ~ oh").gain(0.15).pan(0.18).lpf(6500),
  s("shaker*8").gain(0.09)
)

// ===== THE MOTIF — within-cycle phrases, reused each cycle (these are cycle-invariant, so safe) ==
const motifFrag = note("~ ~ ~ d5 ~ c5 ~ a4")
  .s("vibraphone").lpf(2200).attack(0.01).release(0.9).gain(0.2).room(0.7).delay(0.2).delaytime(0.375).delayfeedback(0.2).pan(0.2)
const motifFull = note("~ a4 c5 ~ d5 ~ c5 a4")
  .s("triangle").lpf(1900).vib(4.5).vmod(0.05)
  .attack(0.02).release(0.5).gain(0.3).room(0.5).delay(0.18).delaytime(0.375).delayfeedback(0.22).pan(0.18)
const motifLift = note("~ c5 f5 ~ e5 ~ c5 a4")
  .s("triangle").lpf(2200).vib(4.5).vmod(0.05)
  .attack(0.015).release(0.5).gain(0.3).room(0.48).delay(0.16).delaytime(0.375).delayfeedback(0.2).pan(0.18)
const motifLiftHarm = note("~ a4 c5 ~ c5 ~ a4 f4")
  .s("triangle").lpf(1700)
  .attack(0.02).release(0.5).gain(0.18).room(0.48).pan(-0.2)
const motifFrag2 = note("a4 ~ [c5 d5] ~ c5 ~ [a4 c5] ~")
  .s("triangle").lpf(2000).vib(4.5).vmod(0.06)
  .attack(0.012).release(0.4).gain(0.29).room(0.46).delay(0.18).delaytime(0.375).delayfeedback(0.22).pan(0.2)
const motifInvert = note("~ d5 ~ bb4 ~ ab4 ~ f4")
  .s("triangle").lpf(1700).vib(5).vmod(0.07)
  .attack(0.03).release(0.7).gain(0.3).room(0.62).delay(0.22).delaytime(0.375).delayfeedback(0.26).pan(0.1)
const motifClimax = note("a4 c5 f5 ~ e5 c5 a4 f4")
  .s("triangle").lpf(2400).vib(4.5).vmod(0.05)
  .attack(0.01).release(0.55).gain(0.32).room(0.55).delay(0.16).delaytime(0.375).delayfeedback(0.22).pan(0.16)

// vibraphone glints (gain<=0.22)
const vibHook = note("~ ~ f5 ~ ~ ~ d5 ~").s("vibraphone").lpf(2400).gain(0.2).room(0.7).release(0.8).pan(-0.22)
const vibBridge = note("~ ~ ~ ab4 ~ ~ ~ ~").s("vibraphone").lpf(2300).gain(0.18).room(0.72).release(0.9).pan(-0.24)
const vibClimax = note("~ ~ f5 ~ ~ ~ a5 ~").s("vibraphone").lpf(2500).gain(0.22).room(0.68).release(0.75).pan(-0.2)

// section extras
const verse2echo = note("~ ~ ~ ~ a3 ~ f3 ~").s("rhodes").lpf(1500).gain(0.2).release(0.5).room(0.45).pan(-0.2)
const hook2oh = s("~ ~ ~ ~ oh ~ ~ ~").gain(0.12).pan(0.18).lpf(6000)

// ===== PROGRESSIONS — one chord/root/pad per cycle, advanced explicitly (NOT via <...> in slowcat)
const VERSE_CH = ['f3,a3,c4,e4,g4', 'd3,f3,a3,c4,e4', 'bb2,d3,f3,a3,e4', 'c3,e3,g3,a3,d4']
const VERSE_RT = ['f2', 'd2', 'bb1', 'c2']
const HOOK_CH = ['bb2,d3,f3,a3,c4', 'a2,c3,e3,g3,b3', 'g2,bb2,d3,f3,c4', 'c3,e3,bb3,db4']
const HOOK_RT = ['bb1', 'a1', 'g1', 'c2']
const HOOK_PAD = ['bb2,f3', 'a2,e3', 'g2,d3', 'g2,bb2']
const BRIDGE_CH = ['f3,a3,c4,e4', 'db3,f3,ab3,c4', 'eb3,g3,bb3,d4,f4', 'c3,e3,bb3,eb4']
const BRIDGE_RT = ['f1', 'db2', 'eb2', 'c2']
const BRIDGE_PAD = ['f2,c3', 'db2,ab2', 'eb2,bb2', 'g2,c3']

// per-cycle segment builders — chord/root/pad come from the i-th step of the progression, so each
// successive slowcat entry plays the NEXT chord (the fix). Extra melodic layers passed in.
const verseSeg = (i, ...leads) => stack(
  note(m(VERSE_CH[i % 4])).s("rhodes").lpf(1700).attack(0.02).release(0.8).gain(0.32).room(0.5).pan(-0.1),
  note(m(VERSE_RT[i % 4])).struct("x ~ x ~ ~ x ~ x").s("sawtooth").lpf(240).shape(0.16).attack(0.01).release(0.3).gain(0.46),
  ...leads,
  drumsVerse
)
const hookSeg = (i, ...leads) => stack(
  note(m(HOOK_CH[i % 4])).s("rhodes").lpf(2000).attack(0.02).release(0.75).gain(0.34).room(0.48).pan(-0.1),
  note(m(HOOK_RT[i % 4])).struct("x ~ ~ x ~ x ~ x").s("sawtooth").lpf(260).shape(0.18).attack(0.01).release(0.32).gain(0.48),
  note(m(HOOK_PAD[i % 4])).s("sawtooth").lpf(680).attack(0.5).release(1.3).gain(0.16).room(0.55),
  ...leads,
  drumsHook
)
const bridgeSeg = (i, ...leads) => stack(
  note(m(BRIDGE_CH[i % 4])).s("rhodes").lpf(1600).attack(0.03).release(0.9).gain(0.33).room(0.58).pan(-0.08),
  note(m(BRIDGE_RT[i % 4])).struct("x ~ x ~ x ~ x x").s("sawtooth").lpf(230).shape(0.18).attack(0.01).release(0.32).gain(0.47),
  note(m(BRIDGE_PAD[i % 4])).s("sawtooth").lpf(720).attack(0.6).release(1.5).gain(0.18).room(0.62),
  ...leads,
  drumsBridge
)
const finalSeg = (i, ...leads) => stack(
  note(m(HOOK_CH[i % 4])).s("rhodes").lpf(2000).attack(0.02).release(0.75).gain(0.36).room(0.48).pan(-0.1),
  note(m(HOOK_RT[i % 4])).struct("x ~ ~ x ~ x ~ x").s("sawtooth").lpf(260).shape(0.18).attack(0.01).release(0.32).gain(0.5),
  note(m(HOOK_PAD[i % 4])).s("sawtooth").lpf(700).attack(0.5).release(1.3).gain(0.2).room(0.55),
  ...leads,
  drumsFinal
)

// ===== STATIC BOOKENDS — intro/outro use within-cycle phrases (no <...>), so repeating is fine ===
const rhodesIntro = note("[f3,a3,c4,e4,g4] ~ ~ ~ ~ ~ [d3,f3,a3,c4] ~")
  .s("rhodes").lpf(1400).attack(0.04).release(1.2).gain(0.3).room(0.65).pan(-0.08)
const bassIntro = note("f2 ~ ~ ~ d2 ~ ~ ~").s("triangle").lpf(210).attack(0.05).release(1.0).gain(0.4)
const intro = stack(rhodesIntro, bassIntro, motifFrag, drumsIntro)
const outro = stack(rhodesIntro, bassIntro, motifFrag.gain(0.18), drumsIntro.gain(0.7))

// ===== ARRANGEMENT — chords now advance through each section's progression, cycle by cycle =======
slowcat(
  ...Array.from({ length: 8 }, () => intro),                                  // 8 intro
  ...Array.from({ length: 12 }, (_, k) => verseSeg(k, motifFull)),            // 12 verse1
  ...Array.from({ length: 10 }, (_, k) => hookSeg(k, motifLift, motifLiftHarm, vibHook)), // 10 hook1
  ...Array.from({ length: 12 }, (_, k) => verseSeg(k, motifFrag2, verse2echo)), // 12 verse2
  ...Array.from({ length: 10 }, (_, k) => hookSeg(k, motifLift, motifLiftHarm, vibHook, hook2oh)), // 10 hook2
  ...Array.from({ length: 12 }, (_, k) => bridgeSeg(k, motifInvert, vibBridge)), // 12 bridge
  ...Array.from({ length: 12 }, (_, k) => finalSeg(k, motifClimax, motifLiftHarm, vibClimax)), // 12 final hook
  ...Array.from({ length: 10 }, () => outro)                                  // 10 outro
)
`
