export const title = 'Cathedral Drive'
export const genre = 'Justice "Woman" / Hyperdrama era — cinematic progressive French electro-disco'
export const mood = 'euphoric grandeur, widescreen, crunchy-but-symphonic, builds and triumphant payoffs with hushed breakdowns'
export const cycles = 86
// exported from the radio DB (2026-06-30); restore with: bun scripts/post-song.mjs <this file>
export const code = `// Genre: Justice "Woman" / Hyperdrama era — CINEMATIC PROGRESSIVE French electro-disco (~120 BPM).
// Crunchy French-electro DNA (saturated/distorted/crushed synths, four-on-the-floor disco drive) WIDENED
// into a multi-movement suite: lush widescreen string pads, arpeggiated sequences, organ-ish stabs, big
// reverb breakdowns. Light & shade — quiet expansive bridge vs. huge triumphant drops.
// Sounds: bd/sd/cp/hh/oh (RolandTR909 four-on-the-floor electro kit + build rolls + crash), sawtooth (THE
//         saturated crunchy organ-ish STAB RIFF — distort/shape/crush/lpf+resonance), square+sawtooth
//         (distorted clipped disco bass), sawtooth+triangle (LUSH widescreen STRING PAD, the cinema), and
//         a sawtooth ARP sequence (the glittering arpeggiated motion). noise = risers/sweeps.
// Harmonic JOURNEY (the whole point): home key D MINOR -> chromatic-mediant lift to Bb MAJOR breakdown ->
//         whole-tone KEY CHANGE up to E MINOR for the triumphant 2nd drop -> resolve home with a Picardy glow.
//   Intro/Build vamp: Dm - Bbmaj7 - F - C  (i - bVI - bIII - bVII Aeolian) with a sus that resolves.
//   DROP 1:  Dm - Bbmaj7 - Gm7 - A7   (the A7 = SECONDARY DOMINANT V7/i, C# leading tone pulling home).
//   BRIDGE/BREAKDOWN: slips by CHROMATIC MEDIANT to Bb MAJOR, lush & hushed: Bbmaj9 - Gm9 - Ebmaj7#11 - F.
//   DROP 2:  whole suite MODULATES UP A TONE to E MINOR (the payoff lift): Em - Cmaj7 - Am7 - B7 (V7/i).
//   OUTRO: settles back to D minor, ending on a D-major (Picardy third) glow.
// Motif: a heroic rising stab gesture  d4 a4 d5 f5  (root - 5th - octave - b3 above). Develops across movements:
//   build states it filtered behind the wall; DROP1 slams it crunchy mid-register; the BRIDGE AUGMENTS it
//   (slow, reharmonized as a lush pad-arp over Bb); DROP2 TRANSPOSES it up a tone into E minor + an octave-leap climax.
// Structure: slowcat PROG SUITE (Approach 1) — intro -> build -> DROP1 -> expansive bridge/breakdown -> build2
//   -> BIGGER DROP2 (key lifted) -> outro. Drops pay off BY CONTRAST with the hushed cinematic breakdown.
setcps(0.5)   // ~120 BPM cinematic disco drive

// ===== DRUMS — four-on-the-floor electro disco, saturated but musical ===========================
const kick = s("bd*4").bank("RolandTR909").lpf(3000).shape(0.45).distort(0.22).attack(0.001).release(0.15).gain(0.98)
const kickSoft = s("bd*4").bank("RolandTR909").lpf(2000).shape(0.25).attack(0.001).release(0.14).gain(0.78)
const clap = s("~ cp ~ cp").bank("RolandTR909").shape(0.22).crush(10).hpf(700).room(0.2).gain(0.55).release(0.15)
const snare = s("~ sd ~ sd").bank("RolandTR909").shape(0.2).hpf(500).gain(0.36).release(0.13)
const hats = s("hh*16").bank("RolandTR909").hpf(8200).shape(0.15).crush(11)
  .gain("0.22 0.09 0.16 0.09 0.2 0.09 0.16 0.09 0.22 0.09 0.16 0.09 0.2 0.09 0.16 0.11").release(0.04)
const ophat = s("~ oh ~ oh ~ oh ~ oh").bank("RolandTR909").hpf(7200).shape(0.15).gain(0.18).release(0.1)
const snareRoll = s("sd*16").bank("RolandTR909").shape(0.25).hpf(600)
  .gain("0.14 0.16 0.18 0.2 0.22 0.24 0.27 0.3 0.34 0.38 0.43 0.49 0.56 0.64 0.73 0.84").release(0.06)
const crash = s("cr ~ ~ ~").bank("RolandTR909").hpf(900).gain(0.32).release(0.5).room(0.3)

const drumsCore = stack(kick, clap, hats)
const drumsFull = stack(kick, clap, snare, hats, ophat)

// ===== RISERS — filtered noise sweeps, the cinematic breath before a drop ========================
const riser = s("noise").struct("x").lpf(sine.range(300, 8000).slow(1)).hpf(200).gain(0.26).attack(0.4).release(0.1)
const riserBig = s("noise").struct("x").lpf(saw.range(400, 12000)).hpf(200).gain(0.4).attack(0.5).release(0.05)
const sweepDown = s("noise").struct("x ~ ~ ~").lpf(saw.range(11000, 500)).gain(0.2).release(0.3)

// ===== BASS — clipped disco bass, distorted but locked to the kick ==============================
// One root per movement; driven offbeat-ish disco pulse. Heavy shape/distort for the French-electro growl.
const bassMk = (phrase) => note(m(phrase)).struct("x ~ x x ~ x ~ x x ~ x x ~ x ~ x").s("square")
  .lpf(440).resonance(5).shape(0.42).distort(0.28).attack(0.002).release(0.07).gain(0.46)
const bassSub = (phrase) => note(m(phrase)).struct("x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~").s("sine").lpf(120).gain(0.5)
const bassDetune = (phrase) => note(m(phrase)).add(note(0.07)).struct("x ~ x x ~ x ~ x x ~ x x ~ x ~ x").s("sawtooth")
  .lpf(720).resonance(7).shape(0.38).distort(0.22).attack(0.002).release(0.06).gain(0.2).pan(0.14)

// Bass roots, one continuously-cycling chord-root line per movement (top-level angle brackets cycle fine).
const bassDmJourney = '<d1 bb0 f1 c1>'      // intro/build vamp roots
const bassDrop1     = '<d1 bb0 g1 a1>'      // drop1: i bVI iv(Gm) V7(A)
const bassBridge    = '<bb1 g1 eb1 f1>'     // bridge in Bb major
const bassDrop2     = '<e1 c1 a1 b1>'       // drop2 in E minor
const bassOutro     = '<d1 bb0 a1 d1>'

// ===== STRING PAD — LUSH widescreen cinematic strings (sawtooth + triangle, big attack & room) ===
// This is the symphonic width. Slow attack, big reverb, layered saw+triangle. Carries the harmonic journey.
const padSaw = (chords) => note(m(chords)).s("sawtooth").lpf(1500).resonance(3).attack(0.35).release(0.7).room(0.6).gain(0.2)
const padTri = (chords) => note(m(chords)).add(note(-12)).s("triangle").lpf(900).attack(0.5).release(0.9).room(0.7).gain(0.22)
const padPair = (chords) => stack(padSaw(chords), padTri(chords))

// Movement chord voicings (each a self-contained cycling layer via top-level angle brackets).
// Build vamp: Dm - Bbmaj7 - F(sus2->maj) - C  (Aeolian, with the F holding a 9th color)
const chordsBuild  = '<[d3,f3,a3,d4] [bb2,d3,f3,a3] [f3,a3,c4,g4] [c3,e3,g3,bb3]>'
// DROP1: Dm - Bbmaj7 - Gm7 - A7 (A7 = SECONDARY DOMINANT, C# the leading tone pulling home to Dm)
const chordsDrop1  = '<[d3,f3,a3,d4] [bb2,d3,f3,a3] [g2,bb2,d3,f3] [a2,c#3,e3,g3]>'
// BRIDGE: chromatic-mediant lift to Bb MAJOR — Bbmaj9 - Gm9 - Ebmaj7(#11 Lydian) - F
const chordsBridge = '<[bb2,d3,f3,a3,c4] [g2,bb2,d3,f3,a3] [eb3,g3,bb3,d4,a4] [f3,a3,c4,e4]>'
// DROP2: WHOLE-TONE KEY CHANGE UP to E MINOR — Em - Cmaj7 - Am7 - B7 (B7 = V7/i)
const chordsDrop2  = '<[e3,g3,b3,e4] [c3,e3,g3,b3] [a2,c3,e3,g3] [b2,d#3,f#3,a3]>'
// OUTRO: home Dm resolving to D MAJOR (Picardy third glow)
const chordsOutro  = '<[d3,f3,a3,d4] [bb2,d3,f3,a3] [a2,c#3,e3,g3] [d3,f#3,a3,d4]>'

// ===== THE STAB RIFF — saturated crunchy organ-ish motif (the French-electro grit) ==============
// Saturated sawtooth, distort + shape + crush + lpf/resonance. Plucky envelope = stabby organ.
const stabVoice = (phrase) => note(m(phrase)).s("sawtooth")
  .lpf(2400).resonance(10).shape(0.5).distort(0.34).crush(8)
  .attack(0.001).decay(0.13).sustain(0).release(0.08).gain(0.4).room(0.14)
const stabFiltered = (phrase, cut) => note(m(phrase)).s("sawtooth")
  .lpf(cut).resonance(8).shape(0.32).distort(0.2).crush(9)
  .attack(0.001).decay(0.13).sustain(0).release(0.08).gain(0.3)
// MOTIF (rising heroic gesture d-a-d'-f') stated rhythmically across the Dm bar, lurching with the harmony.
const stabPhraseDrop1 = 'd4 a4 d5 f5 ~ a4 d5 ~ f5 a4 d5 f5 ~ e5 c5 a4'
const stabDrop1 = stabVoice(stabPhraseDrop1).pan(-0.06)
// power-body a fifth/octave under for thickness
const stabBodyDrop1 = stabVoice('d3 a3 d4 f4 ~ a3 d4 ~ f4 a3 d4 f4 ~ e4 c4 a3').lpf(1700).gain(0.26).pan(0.08)
// MOTIF DEVELOPED for DROP2 — transposed UP A TONE into E minor + octave-leap climax (e5/g5 up top)
const stabPhraseDrop2 = 'e4 b4 e5 g5 ~ b4 e5 ~ g5 b4 e5 g5 ~ f#5 d5 b4'
const stabDrop2 = stabVoice(stabPhraseDrop2).lpf(2900).gain(0.42).pan(-0.05)
const stabBodyDrop2 = stabVoice('e3 b3 e4 g4 ~ b3 e4 ~ g4 b3 e4 g4 ~ f#4 d4 b3').lpf(1900).gain(0.27).pan(0.08)

// ===== ARP — glittering arpeggiated sequence (sawtooth, lpf sweep, delay) ========================
// 16th-note arpeggio motion implying each movement's harmony — the prog "sequence" shimmer.
const arpDrop1 = note("d4 f4 a4 d5 f5 a4 d5 f4 a3 d4 f4 a4 c5 e5 a4 e4").s("sawtooth")
  .lpf(sine.range(900, 3200).slow(4)).resonance(8).shape(0.25).distort(0.15)
  .attack(0.001).decay(0.1).sustain(0.05).release(0.06).gain(0.22).delay(0.25).delaytime(0.1875).delayfeedback(0.3).pan(0.1)
const arpDrop2 = note("e4 g4 b4 e5 g5 b4 e5 g4 b3 e4 g4 b4 d5 f#5 b4 f#4").s("sawtooth")
  .lpf(sine.range(1100, 3600).slow(4)).resonance(8).shape(0.25).distort(0.15)
  .attack(0.001).decay(0.1).sustain(0.05).release(0.06).gain(0.24).delay(0.25).delaytime(0.1875).delayfeedback(0.3).pan(-0.1)
// BRIDGE arp — the motif AUGMENTED & reharmonized over Bb, slow/lush, drenched (no crunch here — light side)
const arpBridge = note("bb3 d4 f4 bb4 ~ a4 f4 d4 ~ g4 bb4 d5 ~ f4 d4 bb3").s("sawtooth")
  .lpf(1300).resonance(4).attack(0.02).decay(0.3).sustain(0.2).release(0.5).gain(0.24)
  .room(0.7).delay(0.4).delaytime(0.375).delayfeedback(0.45)

// ===== SECTIONS (movements) =====================================================================
// INTRO — distant: soft kick, riser, lush pad emerging, stab trapped behind the wall, sub bass. Cinema opening.
const intro = stack(kickSoft, riser.gain(0.2), padPair(chordsBuild).gain(0.7), bassSub(bassDmJourney), hats.gain(0.1))
const introB = stack(kick.gain(0.82), riser, padPair(chordsBuild), bassSub(bassDmJourney), hats.gain(0.16), stabFiltered(stabPhraseDrop1, 700).gain(0.16))

// BUILD 1 — pad blooms, stab opens through the filter, snare roll + riser, tension toward the slam.
const build1 = stack(kick, snareRoll, riserBig.gain(0.34), padPair(chordsBuild), stabFiltered(stabPhraseDrop1, 1500).gain(0.26), bassSub(bassDmJourney), hats.gain(0.18))
const build1b = stack(kick, snareRoll, riserBig, crash, padPair(chordsBuild), stabFiltered(stabPhraseDrop1, 2200).gain(0.3), bassSub(bassDmJourney), bassMk(bassDmJourney).gain(0.3), hats.gain(0.2))

// DROP 1 — THE SLAM: crunchy stabs + body, clipped disco bass, lush pad still holding the width, arp shimmer, full drums.
const drop1 = stack(drumsFull, bassMk(bassDrop1), bassDetune(bassDrop1), bassSub(bassDrop1), padSaw(chordsDrop1).gain(0.16), stabDrop1, stabBodyDrop1, arpDrop1, sweepDown.gain(0.14))
const drop1b = stack(drumsFull, bassMk(bassDrop1), bassDetune(bassDrop1), padSaw(chordsDrop1).gain(0.16), stabDrop1, stabBodyDrop1, arpDrop1.gain(0.26), ophat.gain(0.22))

// BRIDGE / BREAKDOWN — the LIGHT side: chromatic-mediant slip to Bb MAJOR. Drums drop out, huge reverb,
// lush pad + augmented reharmonized motif-arp. Hushed, widescreen, expansive — sets up the bigger payoff.
const bridge = stack(padPair(chordsBridge).gain(0.9), arpBridge, bassSub(bassBridge).gain(0.4))
const bridgeB = stack(kickSoft.gain(0.55), padPair(chordsBridge), arpBridge, bassSub(bassBridge).gain(0.46), hats.gain(0.08))

// BUILD 2 — re-ignite, now climbing toward the KEY-LIFTED drop. Bigger riser, the developed motif filtered.
const build2 = stack(kick, snareRoll, riserBig.gain(0.4), padPair(chordsDrop2), stabFiltered(stabPhraseDrop2, 2000).gain(0.3), bassSub(bassDrop2), hats.gain(0.2))
const build2b = stack(kick, snareRoll, riserBig.gain(0.46), crash, padPair(chordsDrop2), stabFiltered(stabPhraseDrop2, 2600).gain(0.34), bassSub(bassDrop2), bassMk(bassDrop2).gain(0.3), hats.gain(0.22))

// DROP 2 — THE TRIUMPHANT PAYOFF: key up a tone to E minor, motif transposed + octave-leap climax,
// everything maxed, crash on the 1, arp glittering, pad widescreen. Bigger than drop1 by register & key.
const drop2 = stack(drumsFull, crash.gain(0.26), bassMk(bassDrop2), bassDetune(bassDrop2), bassSub(bassDrop2), padSaw(chordsDrop2).gain(0.17), stabDrop2, stabBodyDrop2, arpDrop2, sweepDown.gain(0.16))
const drop2b = stack(drumsFull, bassMk(bassDrop2), bassDetune(bassDrop2), padSaw(chordsDrop2).gain(0.17), stabDrop2, stabBodyDrop2, arpDrop2.gain(0.28), ophat.gain(0.24))

// OUTRO — settle home to D minor, resolving to D MAJOR (Picardy glow). Drums thin, pad + sub sustain, riff decays.
const outro = stack(kick.gain(0.7), bassSub(bassOutro), bassMk(bassOutro).gain(0.28), padPair(chordsOutro), stabFiltered(stabPhraseDrop1, 1400).gain(0.2), hats.gain(0.12))
const outroB = stack(kickSoft.gain(0.5), bassSub(bassOutro).gain(0.4), padPair(chordsOutro).gain(1.1), arpBridge.gain(0.16))

// ===== ARRANGEMENT — 86-cycle PROG SUITE ========================================================
slowcat(
  intro, intro, introB, introB, introB, introB,                              // 6   cinematic opening (Dm, distant)
  build1, build1, build1, build1, build1b, build1b,                          // 6   build 1 (pad blooms, stab opens)
  drop1, drop1b, drop1, drop1b, drop1, drop1b, drop1, drop1b,                // 8   DROP 1 (Dm - Bbmaj7 - Gm7 - A7 slam)
  drop1, drop1b, drop1, drop1b,                                              // 4   drop 1 sustained
  bridge, bridge, bridge, bridgeB, bridgeB, bridge, bridgeB, bridge,         // 8   BRIDGE/BREAKDOWN (Bb major, hushed widescreen)
  build2, build2, build2, build2, build2b, build2b, build2b, build2b,       // 8   build 2 (climbing into the key lift)
  drop2, drop2b, drop2, drop2b, drop2, drop2b, drop2, drop2b,                // 8   DROP 2 (E minor PAYOFF, motif transposed up)
  drop2, drop2b, drop2, drop2b, drop2, drop2b, drop2, drop2b,                // 8   drop 2 sustained (the triumph held)
  bridgeB, bridgeB, bridge, bridge,                                          // 4   short hushed release
  drop2, drop2b, drop2, drop2b, drop2, drop2b, drop2, drop2b,                // 8   drop 2 returns (final flight)
  drop1, drop1b, drop1, drop1b, drop1, drop1b, drop1, drop1b,                // 8   home-key restatement (Dm)
  outro, outro, outro, outroB, outroB, outroB, outroB, outroB,              // 8   outro: resolve to D major (Picardy glow)
  outroB, outroB                                                             // 2   final glow (86 total)
)
`
