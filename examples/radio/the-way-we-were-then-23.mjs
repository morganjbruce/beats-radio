export const title = 'The Way We Were Then'
export const genre = 'LCD Soundsystem / DFA dance-punk — motorik four-on-the-floor turned melancholic'
export const mood = 'wistful, aching, hypnotic; danceable with a lump in the throat — the "All My Friends" / "Someone Great" ache'
export const cycles = 84
// exported from the radio DB (2026-07-01); restore with: bun scripts/post-song.mjs <this file>
export const code = `// Genre: LCD Soundsystem / DFA — dance-punk motorik pulse turned WISTFUL & aching (~115 BPM).
// The "Someone Great" / "All My Friends" / "New York I Love You But You're Bringing Me Down" end of the
// catalogue: a relentless four-on-the-floor + insistent 8th pulse stays hypnotic while the harmony ACHES
// over it. Classic LCD build — start sparse, add ONE layer at a time, reach an emotional peak, strip back.
// Danceable but with a lump in the throat.
// Sounds: bd/hh/oh/cp/rim (RolandTR909 motorik kit; rim = the woodblock/cowbell tick; live-feeling hats,
//         handclaps), sawtooth (the bright PLUCKY arpeggiated analog sequence that repeats & accumulates,
//         plus the warm bassline locked to the kick), triangle (the aching synth-string pad), piano (the
//         plaintive repeated motif — the falling "sigh"), marimba (a few bell accents, only at the peak).
// Harmony — major-with-minor-SHADING in A, cracked & bittersweet, never quite landing home.
//   Progression (8 chords, one per slowcat entry): Aadd9 - F#m7 - Dmaj7 - E7sus4 - Bm7 - C#m7 - Dmaj7#11 - Gadd9
//   RISKS: (1) Dmaj7#11 — a LYDIAN #11 (g# over D) for the aching-bright shimmer; (2) the loop turns HOME
//   not to A but to a borrowed bVII Gadd9 (MIXOLYDIAN) — the "bringing me down" chord that refuses to
//   resolve, so every 8-bar loop sighs and starts over unresolved. That's the throat-lump.
// BASS locked to the harmony: derived from the SAME progression. Each bar the bass plays only that chord's
//   ROOT and its 5th (both chord tones) — no wandering. BASS_LO holds one literal root+fifth phrase per
//   chord (indexed the same i%8 as the chords), so the low end and the harmony always agree.
// Motif: a descending piano SIGH  e5 - c#5 - b4 - a4  (falling to the tonic, then hanging). Develops across
//   the arc — head only in the intro, whole in the body, answered in the lift, up an octave at the PEAK,
//   bare in the strip-back, fragmented to two fading notes in the outro. Depth = this motif + the harmony,
//   NOT layer count: most of the song runs on 4-5 voices; only the single peak stacks the full set.
// Structure: slowcat PER-CYCLE SEGMENTS (Approach 1/2) — each entry pulls ONE literal chord from the array
//   so the harmony ALWAYS advances; layers are added/removed per section to sculpt the build-and-strip arc.
setcps(0.479)   // ~115 BPM — the classic DFA dance-punk tempo

// ===== HARMONY — one literal chord per slowcat entry (spelled out; NO arithmetic on chords) =========
const CH = [
  'a3,c#4,e4,b4',       // 0  Aadd9      — home, but restless (the 9th)
  'f#3,a3,c#4,e4',      // 1  F#m7       — the sink to the relative minor
  'd3,f#3,a3,c#4',      // 2  Dmaj7      — bright IV, wistful
  'e3,a3,b3,d4',        // 3  E7sus4     — dominant that hangs, won't resolve cleanly
  'b2,d3,f#3,a3',       // 4  Bm7        — ii7, deepens the ache
  'c#3,e3,g#3,b3',      // 5  C#m7       — iii7, the wistful inner lift
  'd3,f#3,a3,c#4,g#4',  // 6  Dmaj7#11   — LYDIAN RISK: the g# over D, aching-bright shimmer
  'g3,b3,d4,a4',        // 7  Gadd9      — borrowed bVII (Mixolydian): turns "home" but DOWN, unresolved
]
// BASS — same progression, ONLY the chord ROOT and its 5th (both chord tones). No non-chord notes.
//   0 Aadd9: a,e   1 F#m7: f#,c#   2 Dmaj7: d,a   3 E7sus4: e,b
//   4 Bm7: b,f#    5 C#m7: c#,g#   6 Dmaj7#11: d,a   7 Gadd9: g,d
const BASS_LO = [
  'a1 ~ a1 e2 ~ a1 e2 ~',      // 0  Aadd9   — root + 5th
  'f#1 ~ f#1 c#2 ~ f#1 c#2 ~', // 1  F#m7    — root + 5th
  'd1 ~ d1 a1 ~ d1 a1 ~',      // 2  Dmaj7   — root + 5th
  'e1 ~ e1 b1 ~ e1 b1 ~',      // 3  E7sus4  — root + 5th
  'b1 ~ b1 f#2 ~ b1 f#2 ~',    // 4  Bm7     — root + 5th
  'c#2 ~ c#2 g#1 ~ c#2 g#1 ~', // 5  C#m7    — root + 5th (5th sits below the root here)
  'd1 ~ d1 a1 ~ d1 a1 ~',      // 6  Dmaj7#11— root + 5th
  'g1 ~ g1 d2 ~ g1 d2 ~',      // 7  Gadd9   — root + 5th
]
// SUB — pure root on the downbeats only, so the low fundamental always matches the chord.
const SUB_RT = ['a1', 'f#1', 'd1', 'e1', 'b1', 'c#2', 'd1', 'g1']

// ===== DRUMS — motorik four-on-the-floor, live-feeling, human ======================================
const kick     = s("bd*4").bank("RolandTR909").lpf(2600).attack(0.001).release(0.14).gain(0.9)
const kickSoft = s("bd*4").bank("RolandTR909").lpf(1700).attack(0.001).release(0.13).gain(0.6)
// Woodblock/cowbell tick — the insistent LCD percussion; rim, humanized gains, panned.
const block    = s("rim*8").bank("RolandTR909").hpf(1400)
  .gain("0.28 0.12 0.24 0.12 0.3 0.12 0.24 0.14").pan(0.18).release(0.05)
const blockLo  = s("~ rim ~ rim ~ rim ~ rim").bank("RolandTR909").hpf(900).gain(0.16).pan(-0.14).release(0.06)
// Live-feeling hats — 8ths that breathe (uneven gains), never machine-flat.
const hats     = s("hh*8").bank("RolandTR909").hpf(7600)
  .gain("0.2 0.09 0.15 0.09 0.19 0.09 0.15 0.11").release(0.04)
const hatsLift = s("hh*16").bank("RolandTR909").hpf(8000)
  .gain("0.16 0.06 0.11 0.06 0.14 0.06 0.11 0.06 0.16 0.06 0.11 0.06 0.14 0.06 0.11 0.08").release(0.035)
const ophat    = s("~ ~ oh ~ ~ ~ oh ~").bank("RolandTR909").hpf(6800).gain(0.14).release(0.11)
// Handclaps on 2 & 4 — the human backbeat.
const clap     = s("~ cp ~ cp").bank("RolandTR909").hpf(650).room(0.18).gain(0.4).release(0.14)
const crash    = s("cr ~ ~ ~").bank("RolandTR909").hpf(800).gain(0.22).release(0.6).room(0.3)

// ===== BASS — warm analog bass locked to the kick; root + 5th of the current chord only =============
const bassPulse = (phrase) => note(m(phrase)).s("sawtooth")
  .lpf(360).resonance(4).shape(0.18).attack(0.002).decay(0.14).sustain(0.5).release(0.08).gain(0.5)
const bassSub   = (root) => note(m(root)).struct("x ~ ~ ~ x ~ ~ ~").s("sine").lpf(110).gain(0.5)

// ===== PAD — the aching synth-strings (triangle warmth + a whisper of saw), slow bloom ==============
const padTri = (chord) => note(m(chord)).s("triangle").lpf(1100).attack(0.4).release(0.9).room(0.55).gain(0.24)
const padSaw = (chord) => note(m(chord)).s("sawtooth").lpf(sine.range(700, 1600).slow(8)).resonance(3)
  .attack(0.5).release(1.0).room(0.6).gain(0.12)
const pad    = (chord) => stack(padTri(chord), padSaw(chord))
const padSoft= (chord) => padTri(chord).gain(0.16).lpf(760)

// ===== ARP — the bright plucky analog SEQUENCE that repeats & accumulates (the LCD engine) =========
// A rising 16th ostinato outlining A add9 — the hypnotic sequence. It stays constant (motorik) while the
// harmony moves underneath; only its register/brightness change across the arc.
const arpLo  = note("a3 c#4 e4 a4 c#5 e4 a4 c#4 e4 a4 c#5 a4 e4 c#4 b3 e4").s("sawtooth")
  .lpf(1500).resonance(6).attack(0.002).decay(0.11).sustain(0.04).release(0.06).gain(0.2)
  .delay(0.28).delaytime(0.1875).delayfeedback(0.32).pan(0.12)
const arpHi  = note("a4 c#5 e5 a5 c#6 e5 a5 c#5 e5 a5 c#6 a5 e5 c#5 b4 e5").s("sawtooth")
  .lpf(sine.range(1600, 3400).slow(4)).resonance(7).attack(0.002).decay(0.1).sustain(0.04).release(0.06)
  .gain(0.18).delay(0.3).delaytime(0.1875).delayfeedback(0.34).pan(-0.12)
// Bright bell accents — only at the peak; sparse, shimmering.
const bells  = note("~ e5 ~ a5 ~ c#6 ~ e5 ~ a5 ~ e5 ~ c#6 ~ a5").s("marimba").gain(0.16).room(0.5).pan(0.2)

// ===== THE PIANO MOTIF — the falling "sigh", developed across the arc =============================
const motifHead = note("e5 ~ c#5 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.36).room(0.4).pan(-0.08)
const motifFull = note("e5 ~ c#5 ~ b4 ~ a4 ~ ~ ~ a4 ~ ~ ~ ~ ~").s("piano").gain(0.4).room(0.42).pan(-0.08)
const motifCall = note("e5 ~ c#5 ~ b4 ~ a4 ~ ~ f#5 ~ e5 ~ c#5 ~ b4").s("piano").gain(0.4).room(0.45).pan(-0.06)
const motifPeak = note("e6 ~ c#6 ~ b5 ~ a5 ~ ~ f#6 ~ e6 ~ c#6 ~ a5").s("piano").gain(0.42).room(0.5).pan(-0.05)
const motifBare = note("e5 ~ ~ c#5 ~ ~ b4 ~ ~ ~ a4 ~ ~ ~ ~ ~").s("piano").gain(0.34).room(0.6).pan(0)
const motifFade = note("e5 ~ ~ ~ ~ ~ c#5 ~ ~ ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.3).room(0.65).pan(0)

// ===== SECTION SEGMENT BUILDERS — each pulls ONE chord CH[i%8], bass BASS_LO[i%8], root SUB_RT[i%8] =
// Voice budget: intro 4 · buildA 4 · buildB 5 · body 5 · lift 6 · PEAK 8 (the one full stack) · strip 4 · outro 4.
// INTRO — bare pulse: soft kick, woodblock tick, sub bass, one soft pad bloom, motif head. Distant. (4)
const introSeg = (i) => stack(
  kickSoft, blockLo, bassSub(SUB_RT[i % 8]), padSoft(CH[i % 8]), motifHead
)
// BUILD A — the arp ostinato starts turning + hats come in; drop the motif so it stays uncluttered. (4)
const buildASeg = (i) => stack(
  kick.gain(0.78), block.gain(0.7), hats.gain(0.6), bassSub(SUB_RT[i % 8]),
  padSoft(CH[i % 8]).gain(0.2), arpLo.gain(0.14)
)
// BUILD B — the warm root+5th bass opens up; sub still under it; motif head returns. Groove locks. (5)
const buildBSeg = (i) => stack(
  kick, block, hats, bassSub(SUB_RT[i % 8]).gain(0.34), bassPulse(BASS_LO[i % 8]).gain(0.4),
  padSoft(CH[i % 8]), arpLo.gain(0.18), motifHead.gain(0.3)
)
// BODY — full four-on-the-floor + claps, pad blooms wide, motif whole, arp turning. The hypnotic verse. (5)
const bodySeg = (i) => stack(
  kick, block, hats, clap, bassPulse(BASS_LO[i % 8]),
  pad(CH[i % 8]), arpLo, motifFull
)
// LIFT — open hats + 16th hats, arp climbs an octave, motif answers itself. Bass stays locked. (6)
const liftSeg = (i) => stack(
  kick, block, hatsLift, clap, ophat, bassPulse(BASS_LO[i % 8]),
  pad(CH[i % 8]), arpHi.gain(0.15), motifCall
)
// PEAK — the emotional crest: the ONE full stack — crash on 1, bells shimmering, motif up an octave. (8)
const peakSeg = (i) => stack(
  kick, block, hatsLift, clap, ophat, crash.gain(0.16),
  bassPulse(BASS_LO[i % 8]),
  pad(CH[i % 8]).gain(0.26), arpHi, bells, motifPeak
)
// STRIP — the ache EXPOSED: soft kick + tick, sub bass, pad + bare motif only. Silence allowed. (4)
const stripSeg = (i) => stack(
  kickSoft.gain(0.5), blockLo.gain(0.5), bassSub(SUB_RT[i % 8]).gain(0.4),
  padTri(CH[i % 8]).gain(0.24), motifBare
)
// OUTRO — resolve down and out: kick fading, arp thinning, fragmented motif dissolving, last pad hangs. (4)
const outroSeg = (i) => stack(
  kickSoft.gain(0.42), blockLo.gain(0.35), bassSub(SUB_RT[i % 8]).gain(0.4),
  padSoft(CH[i % 8]).gain(0.22), arpLo.gain(0.11), motifFade
)

// ===== ARRANGEMENT — 84-cycle LCD build-and-strip arc ==============================================
// Each Array.from spreads ONE segment per cycle; k feeds CH[k%8]/BASS_LO[k%8]/SUB_RT[k%8] so the 8-chord
// loop keeps turning and REPEATS across every section (the vamp never freezes). Add, peak, then strip.
slowcat(
  ...Array.from({ length: 6 },  (_, k) => introSeg(k)),          //  6  bare pulse (distant)
  ...Array.from({ length: 10 }, (_, k) => buildASeg(k + 6)),     // 10  arp + hats enter (engine turns)
  ...Array.from({ length: 10 }, (_, k) => buildBSeg(k + 16)),    // 10  warm bass opens, groove locks
  ...Array.from({ length: 12 }, (_, k) => bodySeg(k + 26)),      // 12  full verse — pad blooms, motif whole
  ...Array.from({ length: 10 }, (_, k) => liftSeg(k + 38)),      // 10  lift — arp climbs, motif answers
  ...Array.from({ length: 12 }, (_, k) => peakSeg(k + 48)),      // 12  PEAK — the emotional crest (motif up an 8ve)
  ...Array.from({ length: 8 },  (_, k) => stripSeg(k + 60)),     //  8  strip back — the ache exposed, near-silence
  ...Array.from({ length: 8 },  (_, k) => peakSeg(k + 68)),      //  8  return to the peak — one last flight
  ...Array.from({ length: 8 },  (_, k) => outroSeg(k + 76)),     //  8  outro — fragmented, dissolving, unresolved
)                                                                // 84 total
`
