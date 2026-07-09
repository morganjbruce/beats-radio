export const title = 'Machine Liturgy'
export const genre = 'Nine Inch Nails "Closer" / The Downward Spiral-era industrial (~107 BPM)'
export const mood = 'menacing, sexual, desolate, hypnotic — controlled intensity that broods then bites'
export const cycles = 80
// exported from the radio DB (2026-06-30); restore with: bun scripts/post-song.mjs <this file>
export const code = `// Genre: NIN "Closer" / Downward Spiral industrial — ~107 BPM, hard swung machine groove, brooding & menacing
// Sounds: bd (thudding mechanical kick), sd + cp (snappy backbeat snare/clap on 2 & 4), hh/oh (swung gritty
//         16th hats), sawtooth lpf+distort+crush (DEEP FILTHY synth-bass pulse, locked to the kick),
//         square detuned + distort + lpf/resonance (COLD dissonant synth STABS), triangle hpf+room+delay
//         (the haunting MELODIC HOOK — few notes, lots of space), noise filtered (tape-hiss / mechanical
//         breath texture), metal (occasional industrial clang accent). Grit from distort/shape/crush.
// Harmony: A natural-minor / PHRYGIAN center. Slow harmonic rhythm — long pedal on Am, then the chromatic
//         lean. RISK: the bII (Bb) over an A pedal — the Phrygian half-step menace — plus a bVI (F) cold
//         lift. Vamp: Am (held) | Am | Bb/A (Phrygian bII, dissonant grind) | F-back-to-Am. The bass NEVER
//         leaves the A pedal in the verse (it grinds against the Bb stab) — that immovable root is the dread.
// Motif: a sparse HAUNTING hook, falling with air — e5 ... c5 ... bb4 (the Phrygian flat-2, the wrong note
//         that leans) ... a4. Lots of space. Develops: hook1 states it bare; hook2 fragments + displaces it
//         off the beat, reaching the bb4 lean harder; final hook REACHES UP once to the climax (g5, appears
//         only once) then collapses back down to a4 — the one moment of release in a desolate room.
// Structure: slowcat industrial arrangement (Approach 1) — the track RIDES a tight loop and adds/removes
//         voices for the dynamic arc: hiss intro (machine breathing, lone kick) -> groove drops (filthy bass
//         locks to kick) -> verse (full brooding groove, hook teases in the dark) -> CHORUS hook (stabs bite,
//         hook sings) -> verse -> chorus2 (hook developed) -> BREAKDOWN (strip to hiss + ghost kick + echo of
//         the hook — desolate, the quiet that makes the heavy hit) -> rebuild -> FINAL chorus (climax reach,
//         everything filthy and full) -> desolate outro (hiss + dying pulse). Groove stays LOCKED; the menace
//         is restraint, not chaos.
setcps(0.446)   // ~107 BPM mid-tempo industrial machine groove

// ===== TEXTURE — tape-hiss / mechanical breath (filtered noise, low) ============================
// A slow filter-swept hiss = the room tone / tape, breathing under everything. Never loud.
const hissBed = s("noise").lpf(sine.range(700, 2600).slow(8)).hpf(500).gain(0.05).room(0.3)
// Rhythmic mechanical "breath" — gated noise ticks, the machine exhaling, panned for unease.
const breath  = s("noise*8").lpf(1400).hpf(700).gain("0.07 0.03 0.05 0.02 0.08 0.03 0.05 0.02")
  .release(0.04).pan(sine.range(-0.25, 0.25).slow(6)).swingBy(1/3, 8)

// ===== DRUMS — hard, swung, mechanical ==========================================================
// Kick: heavy THUD on 1, the syncopated machine push before 3 — the iconic dragging knock.
const kick = s("bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ ~").bank("RolandTR909").lpf(2400).shape(0.35)
  .gain("1 0 0 0 0 0 0.78 0 0 0 0.7 0 0 0 0 0").release(0.2).distort(0.15)
// Snappy SNARE on the backbeat (2 & 4) — the crisp crack, layered with a clap for the slap.
const snare = s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").bank("RolandTR909").gain(0.62).shape(0.2)
  .lpf(7000).hpf(220).room(0.18).release(0.16).distort(0.1)
const clap  = s("~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~").gain(0.46).hpf(1000).room(0.22).release(0.14).shape(0.1)
// Ghost snares — quiet flickers between hits, the machine's nervous twitch; sometimes dropped.
const ghosts = s("~ ~ sd ~ ~ ~ ~ ~ sd ~ ~ ~ ~ ~ sd ~").gain("0 0 0.14 0 0 0 0 0 0.11 0 0 0 0 0 0.12 0")
  .hpf(1800).release(0.04).shape(0.1).sometimesBy(0.3, x => x.gain(0))
// Swung 16th hats — driving, gritty, with the slight machine lean and ghosted dynamics.
const hats = s("hh*16").bank("RolandTR909").hpf(8500).lpf(13000).shape(0.12)
  .gain("0.22 0.07 0.14 0.06 0.2 0.07 0.13 0.06 0.22 0.07 0.14 0.06 0.2 0.07 0.13 0.06")
  .release(0.03).swingBy(1/3, 8).sometimesBy(0.14, x => x.gain(0))
// Open-hat sizzle on the last "and" — a breath of release at the bar end, dropped on some cycles.
const ophat = s("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ oh").bank("RolandTR909").hpf(7500).gain(0.18)
  .release(0.12).someCyclesBy(0.4, x => x.gain(0))
// Industrial metal clang — a cold accent, sparse, on the off-beat of bar 4-feel; mostly absent.
const clang = s("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ metal ~").gain(0.2).hpf(1200).lpf(5000)
  .room(0.4).release(0.5).crush(8).someCyclesBy(0.55, x => x.gain(0))

const drumsCore = stack(kick, snare, clap, hats)
const drumsFull = stack(kick, snare, clap, hats, ghosts, ophat, clang)

// ===== BASS — DEEP FILTHY synth-bass pulse, locked to the kick, grinding on the A pedal =========
// The root NEVER leaves A in the verse — an immovable pedal under the moving stabs = the dread.
// Two slightly-detuned saws, lpf low, distort + crush = the filthy industrial grind.
const bassRoot = note("a1")
const bassMk = (voice) => voice.struct("x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~ ~").s("sawtooth")
  .lpf(240).resonance(6).shape(0.3).distort(0.35).crush(7).attack(0.01).release(0.22).gain(0.52)
// detune layer — same pulse, a hair sharp + wider filter, panned for width and filth
const bassDetune = (voice) => voice.struct("x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~ ~").add(note(0.12)).s("sawtooth")
  .lpf(360).shape(0.25).distort(0.25).attack(0.012).release(0.2).gain(0.24).pan(0.15)
// chorus bass — adds a low pickup at the bar end leaning to the Bb (Phrygian) and back, more drive.
const bassChorus = note("[a1 ~ ~ ~ ~ ~ a1 ~ ~ ~ a1 ~ ~ ~ bb1 ~]").s("sawtooth")
  .lpf(280).resonance(7).shape(0.32).distort(0.4).crush(7).attack(0.01).release(0.2).gain(0.54)

// ===== COLD SYNTH STABS — detuned square, distorted, dissonant against the pedal ================
// 4-bar vamp via top-level angle brackets: Am (held) | Am | Bb (the bII grind over A) | F (bVI lift)->Am.
// Square + slight detune + distort + lpf/resonance = the cold, filthy, mechanical stab.
const stabChords = note("<[a3,c4,e4] [a3,c4,e4] [bb3,d4,f4] [f3,a3,c4]>")
const stabMk = (chord) => chord.s("square").lpf(1300).resonance(9).shape(0.3).distort(0.3)
  .attack(0.008).release(0.26).gain(0.3).room(0.2).pan(-0.1)
// verse stabs — sparse, sitting back, two cold hits per bar (the loop broods)
const stabVerse = stabMk(stabChords).struct("x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~").lpf(950).gain(0.24)
// chorus stabs — BITE: brighter, harder, syncopated machine rhythm, more present
const stabChorus = stabMk(stabChords).struct("x ~ ~ x ~ ~ x ~ x ~ ~ x ~ ~ x ~").lpf(1600).gain(0.32).distort(0.4)

// ===== THE HAUNTING HOOK — high triangle, hpf'd + delay + room, lots of space ===================
// Falling minor gesture leaning on the Phrygian bb4: e5 ... c5 ... bb4 ... a4. Cold, distant, sparse.
const leadVoice = (phrase) => note(m(phrase)).s("triangle")
  .lpf(3200).resonance(4).hpf(400).attack(0.02).release(0.5).gain(0.3)
  .room(0.42).delay(0.22).delaytime(0.375).delayfeedback(0.34).pan(0.08).vib(4).vmod(0.06)
// teaser in the verse — just the head, way back, echoing in the dark (the hook "circling")
const leadTease = leadVoice('~ ~ ~ ~ ~ ~ e5 ~ ~ ~ ~ ~ c5 ~ ~ ~').gain(0.2).lpf(2600).delayfeedback(0.44)
// motifA (chorus 1) — STATES it bare: the fall with air, the bb4 lean, a question with no answer.
const motifA = leadVoice('e5 ~ ~ ~ c5 ~ ~ ~ bb4 ~ ~ ~ a4 ~ ~ ~')
// motifB (chorus 2) — DEVELOPED: fragmented + displaced off the beat, leaning HARDER on the bb4.
const motifB = leadVoice('~ ~ e5 ~ ~ c5 ~ ~ ~ bb4 ~ bb4 ~ ~ a4 ~').gain(0.32)
// motifC (final chorus) — REACHES UP once to the climax g5 (appears only here) then collapses to a4.
const motifC = leadVoice('e5 ~ ~ ~ g5 ~ ~ ~ e5 ~ c5 ~ bb4 ~ a4 ~').release(0.6).gain(0.33).lpf(3600).vmod(0.08)

// ===== SECTIONS =================================================================================
// intro — machine breathing: hiss + lone dragging kick, no bass, no melody. Desolate room.
const intro  = stack(hissBed, kick.gain(0.7), breath.gain(0.05))
// introB — the groove drops in: filthy bass locks to the kick, hats start their swung drive.
const introB = stack(hissBed, breath, kick, hats.gain(0.7), bassMk(bassRoot), bassDetune(bassRoot))

// verse — full brooding groove; cold stabs sit back, the hook just teases in the dark. It LOOPS.
const verse  = stack(hissBed, breath, drumsFull, bassMk(bassRoot), bassDetune(bassRoot), stabVerse, leadTease)

// chorus — the STABS BITE, the hook SINGS the motif, bass drives with the Phrygian pickup. It hits.
const chorus  = stack(hissBed, breath, drumsFull, bassChorus, bassDetune(bassRoot), stabChorus, motifA)
// chorus2 — same heat, motif DEVELOPED (displaced, leaning harder on the bb4)
const chorus2 = stack(hissBed, breath, drumsFull, bassChorus, bassDetune(bassRoot), stabChorus, motifB)
// final chorus — motif REACHES the climax (g5), everything filthy and full, the one release
const chorusEnd = stack(hissBed, breath, drumsFull, bassChorus, bassDetune(bassRoot), stabChorus.gain(0.34), motifC)

// breakdown — DESOLATE: strip to hiss + ghost kick + a lone echoing hook fragment. The quiet that
// makes the heavy hit. Bass thinned to a single drained pulse, stabs gone, everything drenched.
const breakdown = stack(
  hissBed.gain(0.07),
  breath.gain(0.06),
  kick.gain("0.6 0 0 0 0 0 0 0 0 0 0.45 0 0 0 0 0"),
  bassMk(bassRoot).gain(0.32).lpf(180),
  leadTease.gain(0.22).delay(0.3).delayfeedback(0.5).lpf(2200)
)

// outro — the machine winds down: hiss + a dying pulse + a last echo of the hook, fading to the room.
const outro = stack(hissBed, breath.gain(0.04),
  kick.gain(0.55), bassMk(bassRoot).gain(0.34).lpf(200), leadTease.gain(0.18).delayfeedback(0.5))

// ===== ARRANGEMENT — 80 cycles ==================================================================
slowcat(
  intro, intro, introB, introB, introB, introB,                              // 6  machine breathes, groove drops in
  verse, verse, verse, verse, verse, verse, verse, verse, verse, verse,      // 10 brooding verse (hook teases)
  chorus, chorus, chorus, chorus, chorus, chorus, chorus, chorus,            // 8  chorus — stabs bite, hook states
  verse, verse, verse, verse, verse, verse, verse, verse, verse, verse,      // 10 verse (the loop broods on)
  chorus2, chorus2, chorus2, chorus2, chorus2, chorus2, chorus2, chorus2,    // 8  chorus — hook developed
  breakdown, breakdown, breakdown, breakdown, breakdown, breakdown,          // 6  desolate breakdown (the quiet)
  introB, introB, verse, verse, verse, verse, verse, verse, verse, verse,    // 10 rebuild
  chorus, chorus, chorus, chorus, chorus, chorus,                            // 6  chorus returns
  chorusEnd, chorusEnd, chorusEnd, chorusEnd, chorusEnd, chorusEnd, chorusEnd, chorusEnd, chorusEnd, chorusEnd, // 10 final climax
  outro, outro, outro, outro, outro, outro                                   // 6  machine winds down (80 total)
)
`
