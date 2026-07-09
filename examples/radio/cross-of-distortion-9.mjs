export const title = 'Cross of Distortion'
export const genre = 'Justice "Waters of Nazareth" / † era French electro-house'
export const mood = 'filthy, maximal, distorted, menacing, euphoric-aggressive, industrial-disco'
export const cycles = 72
// exported from the radio DB (2026-06-30); restore with: bun scripts/post-song.mjs <this file>
export const code = `// Genre: Justice "Waters of Nazareth" / † (Cross) era French electro-house — ~128 BPM, FILTHY & MAXIMAL.
// Sounds: bd (RolandTR909, pounding overdriven four-on-the-floor electro kick, shaped+clipped), cp/sd
//         (cracking claps + snare backbeat & build rolls), hh/oh (driving distorted hats), sawtooth
//         (THE MENACING ORGAN-ISH STAB RIFF — saturated, bitcrushed, coarse, lpf+resonance), square
//         (churning DETUNED CLIPPED bass, distort+shape), noise (filtered risers/sweeps), + a synthetic
//         vowel-ish "OH" stab (filtered sawtooth, bandpass-ish hpf/lpf + fast env — NO vocal sample).
// Harmony: F# minor / Phrygian menace, static one-riff vamp (correct for electro-house). The stab riff
//         lurches roots F# -> G -> A -> F#. RISK: the bII (G major over an F# tonic) is the Neapolitan/
//         Phrygian MENACE — a half-step shove that never resolves comfortably; the drop climax stabs the
//         TRITONE (C, the b5) over F#, the most dissonant blade in the kit. Bass churns the same roots.
// Motif: the distorted ORGAN STAB — repeated machine-gun stabs that lurch UP to the bII then knife the
//         tritone: f#4-f#4-g4-f#4-c5-f#4. Develops: drop1 STATES it (chunky, mid register); drop2
//         TRANSPOSES the climax up an octave + drives the b5 harder + the synthetic "OH" stab ANSWERS it
//         (call & response). Breakdowns fragment it down to a lone menacing echo.
// Structure: slowcat electro-house build/drop arrangement (Approach 1) — intro (kick + riser, riff filtered
//         behind a wall) -> build1 (riff opens through the filter, snare roll, tension) -> DROP1 (full
//         distorted stabs + churning bass, the slam) -> breakdown (strip to kick + lone menacing riff echo)
//         -> build2 (re-tension, bigger riser) -> DROP2 (BIGGER: octave climax + tritone + OH stab) ->
//         outro (kick + decaying riff, the wreckage). Loud parts feel loud BY CONTRAST with the breakdowns.
setcps(0.5)   // ~128 BPM pounding electro-house

// ===== DRUMS — pounding, overdriven, four-on-the-floor =========================================
// THE electro kick: four-on-the-floor, hard 909, clipped & saturated so it punches through the filth.
const kick = s("bd*4").bank("RolandTR909").lpf(3200).shape(0.55).distort(0.35)
  .attack(0.001).release(0.16).gain(1.0)
// Softer intro kick (less distortion, sits behind the riser)
const kickSoft = s("bd*4").bank("RolandTR909").lpf(2200).shape(0.3).attack(0.001).release(0.15).gain(0.82)
// Cracking clap/snare on the backbeat (2 & 4) — the disco snap, crushed for grit.
const clap = s("~ cp ~ cp").bank("RolandTR909").shape(0.3).crush(8).hpf(700).room(0.18).gain(0.62).release(0.16)
const snare = s("~ sd ~ sd").bank("RolandTR909").shape(0.25).hpf(500).gain(0.4).release(0.14)
// Driving distorted hats — straight 16ths, gritty, with an offbeat open-hat churn.
const hats = s("hh*16").bank("RolandTR909").hpf(8000).shape(0.2).crush(10)
  .gain("0.26 0.1 0.18 0.1 0.24 0.1 0.18 0.1 0.26 0.1 0.18 0.1 0.24 0.1 0.18 0.12").release(0.04)
const ophat = s("~ oh ~ oh ~ oh ~ oh").bank("RolandTR909").hpf(7000).shape(0.18).gain(0.2).release(0.1)
// Build snare roll — accelerating, the classic tension crescendo into a drop.
const snareRoll = s("sd*16").bank("RolandTR909").shape(0.3).hpf(600)
  .gain("0.18 0.2 0.22 0.24 0.26 0.28 0.3 0.34 0.38 0.42 0.46 0.52 0.58 0.66 0.74 0.85").release(0.06)

const drumsCore = stack(kick, clap, hats)
const drumsFull = stack(kick, clap, snare, hats, ophat)

// ===== NOISE RISER — filtered white-noise sweep, the build tension ==============================
// Slow upward filter sweep over a cycle — the breath before the slam.
const riser = s("noise").struct("x").lpf(sine.range(300, 9000).slow(1)).hpf(200).gain(0.3).attack(0.4).release(0.1)
const riserBig = s("noise").struct("x").lpf(saw.range(400, 13000)).hpf(200).gain(0.42).attack(0.5).release(0.05)
// White-noise impact "whoosh" reversed-feel sweep down into the drop (short, on the 1)
const sweepDown = s("noise").struct("x ~ ~ ~").lpf(saw.range(11000, 500)).gain(0.22).release(0.3)

// ===== THE BASS — churning DETUNED CLIPPED square, locked to the kick ===========================
// Roots F# G A F# (the Phrygian lurch), driven 16ths under the kick — the churn.
// Heavy distort + shape + low lpf = the saturated industrial-disco growl.
const bassRoot = note("<f#1 g1 a1 f#1>")
const bassMk = (voice) => voice.struct("x x x x x x x x x x x x x x x x").s("square")
  .lpf(420).resonance(6).shape(0.5).distort(0.4).attack(0.002).release(0.06).gain(0.5)
// Detune layer — a hair sharp + octave bite for the fat clipped width, panned slightly.
const bassDetune = (voice) => voice.add(note(12.06)).struct("x x x x x x x x x x x x x x x x").s("sawtooth")
  .lpf(700).resonance(8).shape(0.45).distort(0.3).attack(0.002).release(0.05).gain(0.24).pan(0.14)
// Sub layer for the breakdown/intro — clean low sine so the low end never disappears under distortion.
const bassSub = (voice) => voice.struct("x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~").s("sine").lpf(120).gain(0.5)

// ===== THE STAB RIFF — the menacing distorted organ-ish motif ===================================
// Machine-gun stabs lurching up to the bII (g) then knifing the tritone (c): f#4 f#4 g4 f#4 c5 f#4.
// Saturated sawtooth, bitcrushed + coarse + lpf/resonance = the crunchy filth. THIS is the song.
const stabVoice = (phrase) => note(m(phrase)).s("sawtooth")
  .lpf(2600).resonance(12).shape(0.6).distort(0.45).crush(7).coarse(2)
  .attack(0.001).decay(0.12).sustain(0).release(0.08).gain(0.46).room(0.12)
// Filtered/muffled version for intro & build (riff trapped behind a wall, opening over the build)
const stabFiltered = (phrase, cut) => note(m(phrase)).s("sawtooth")
  .lpf(cut).resonance(9).shape(0.4).distort(0.25).crush(8)
  .attack(0.001).decay(0.12).sustain(0).release(0.08).gain(0.34)
// motifA (DROP1) — STATES the riff, chunky mid register, the lurch + tritone knife.
const stabRiffPhrase = 'f#4 f#4 g4 f#4 c5 f#4 g4 f#4 a4 f#4 g4 f#4 c5 ~ g4 f#4'
const stabA = stabVoice(stabRiffPhrase).pan(-0.06)
// stab harmony layer — a stacked fifth below for the thick organ-stab body (power-chord menace).
const stabBodyPhrase = 'b3 b3 d4 b3 f#4 b3 d4 b3 e4 b3 d4 b3 f#4 ~ d4 b3'
const stabBody = stabVoice(stabBodyPhrase).lpf(1900).gain(0.3).pan(0.08)
// motifB (DROP2) — DEVELOPED: climax leaps UP an octave, drives the tritone (c5/c6) harder.
const stabBigPhrase = 'f#4 f#5 g5 f#5 c6 f#5 g5 f#4 a5 f#5 g5 f#4 c6 c6 g5 f#5'
const stabB = stabVoice(stabBigPhrase).lpf(3200).gain(0.44).pan(-0.05)
// breakdown fragment — a lone, drenched, half-speed echo of the head of the riff (menace looming).
const stabEcho = note("f#4 ~ ~ ~ g4 ~ ~ ~ ~ ~ c5 ~ ~ ~ ~ ~").s("sawtooth")
  .lpf(1500).resonance(8).shape(0.35).distort(0.2).crush(8).attack(0.002).decay(0.18).sustain(0).release(0.2)
  .gain(0.32).room(0.4).delay(0.3).delaytime(0.375).delayfeedback(0.46)

// ===== SYNTHETIC "OH" STAB — vowel-ish filtered sawtooth (NO vocal sample) ======================
// Approximated "OH" vowel: a sawtooth stab squeezed between a bandpass-ish hpf+lpf pair near vowel
// formants, fast envelope, a touch of detune for body. Answers the riff in DROP2 (call & response).
const ohStab = note("~ ~ ~ ~ ~ ~ ~ ~ a4 ~ ~ ~ ~ ~ c5 ~").s("sawtooth")
  .hpf(380).lpf(1100).resonance(14).shape(0.4).distort(0.2).vib(5).vmod(0.06)
  .attack(0.01).decay(0.18).sustain(0.1).release(0.12).gain(0.38).room(0.25).pan(0.1)

// ===== SECTIONS =================================================================================
// intro — pounding kick + filtered noise riser, the riff trapped DEEP behind the wall (lpf low), sub bass.
const intro = stack(kickSoft, riser.gain(0.22), stabFiltered(stabRiffPhrase, 600).gain(0.2), bassSub(bassRoot), hats.gain(0.12))
const introB = stack(kick, riser, stabFiltered(stabRiffPhrase, 1000).gain(0.26), bassSub(bassRoot), hats.gain(0.18), clap.gain(0.4))

// build1 — riff OPENS through the filter, snare roll + rising riser builds tension toward the slam.
const build1 = stack(kick, snareRoll, riserBig, stabFiltered(stabRiffPhrase, 1700).gain(0.32), bassSub(bassRoot), hats.gain(0.2))

// DROP1 — THE SLAM: full distorted stabs + body, churning clipped bass, full drums, sweep-in.
const drop1 = stack(drumsFull, bassMk(bassRoot), bassDetune(bassRoot), bassSub(bassRoot), stabA, stabBody, sweepDown.gain(0.16))
const drop1b = stack(drumsFull, bassMk(bassRoot), bassDetune(bassRoot), stabA, stabBody, ophat.gain(0.24))

// breakdown — strip to kick + lone menacing riff echo + sub; the room empties so the next drop hits harder.
const breakdown = stack(kickSoft.gain(0.7), bassSub(bassRoot), stabEcho, clap.gain(0.32).room(0.4).delay(0.3).delayfeedback(0.4))
const breakdownB = stack(kick.gain(0.85), bassSub(bassRoot), bassMk(bassRoot).gain(0.3), stabEcho.gain(0.36), clap.gain(0.42))

// build2 — re-tension, bigger riser, riff climbing, leads into the BIGGER drop.
const build2 = stack(kick, snareRoll, riserBig.gain(0.46), stabFiltered(stabBigPhrase, 2000).gain(0.34), bassSub(bassRoot), hats.gain(0.22))

// DROP2 — BIGGER: octave-up riff climax, harder tritone, the synthetic "OH" stab ANSWERS, everything maxed.
const drop2 = stack(drumsFull, bassMk(bassRoot), bassDetune(bassRoot), bassSub(bassRoot), stabB, stabBody, ohStab, sweepDown.gain(0.18))
const drop2b = stack(drumsFull, bassMk(bassRoot), bassDetune(bassRoot), stabB, stabBody, ohStab.gain(0.42), ophat.gain(0.26))

// outro — the wreckage: kick fading, a last decaying riff echo, sub thinning out.
const outro = stack(kickSoft.gain(0.6), bassSub(bassRoot).gain(0.4), stabEcho.gain(0.3), hats.gain(0.1))

// ===== ARRANGEMENT — 72 cycles ==================================================================
slowcat(
  intro, intro, introB, introB, introB, introB,                              // 6  kick + riser, riff behind the wall
  build1, build1, build1, build1, build1, build1,                            // 6  build (riff opens, snare roll)
  drop1, drop1b, drop1, drop1b, drop1, drop1b, drop1, drop1b,                // 8  DROP 1 (the slam)
  drop1, drop1b, drop1, drop1b,                                              // 4  drop1 sustained
  breakdown, breakdown, breakdownB, breakdownB, breakdown, breakdownB,       // 6  breakdown (lone menacing echo)
  build2, build2, build2, build2, build2, build2, build2, build2,           // 8  build (bigger riser, re-tension)
  drop2, drop2b, drop2, drop2b, drop2, drop2b, drop2, drop2b,                // 8  BIGGER DROP (octave climax + OH stab)
  drop2, drop2b, drop2, drop2b, drop2, drop2b, drop2, drop2b,                // 8  bigger drop sustained
  breakdownB, breakdownB, breakdown, breakdown,                              // 4  short breakdown release
  drop1, drop1b, drop1, drop1b, drop1, drop1b, drop1, drop1b,                // 8  drop returns (riff restated)
  outro, outro, outro, outro, outro, outro                                   // 6  wreckage (72 total)
)
`
