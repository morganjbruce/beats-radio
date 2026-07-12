export const title = 'The Long Way Home'
export const genre = 'LCD Soundsystem / DFA dance-punk — motorik four-on-the-floor turned melancholic'
export const mood = 'wistful, aching, hypnotic; danceable with a lump in the throat — the "All My Friends" / "Someone Great" ache'
export const cycles = 88
// exported from the radio DB (2026-07-01); restore with: bun scripts/post-song.mjs <this file>
export const code = `// Genre: LCD Soundsystem / DFA — dance-punk motorik pulse turned WISTFUL & aching (~114 BPM).
// The "Someone Great" / "All My Friends" / "New York I Love You But You're Bringing Me Down" end of the
// catalogue: a relentless four-on-the-floor + insistent 8th pulse stays hypnotic while the harmony ACHES
// over it. Classic LCD build — start sparse, add ONE layer at a time over many cycles, reach an emotional
// peak, then strip it all back. Danceable but with a lump in the throat.
// Sounds: bd/hh/oh/cp/rim (RolandTR909 motorik kit; rim = the woodblock/cowbell tick; live-feeling hats,
//         handclaps), sawtooth (the bright PLUCKY arpeggiated analog sequence that repeats & accumulates,
//         plus the warm bassline locked to the kick), triangle (the aching synth-string pad + a countermelody),
//         piano (the plaintive repeated motif — the falling "sigh"), marimba (bright bell accents high up).
// Harmony — major-with-minor-SHADING, cracked & bittersweet, never quite landing home. Key of A.
//   Progression (8 chords, one per slowcat entry): A(add9) - E/G# - F#m7 - D6/9 - Bm7 - Dmaj7#11 - E7sus4 - Gadd9
//   The deliberate RISKS: (1) Dmaj7#11 — a LYDIAN #11 (g#4 over D) for that aching-bright shimmer; and
//   (2) it turns HOME not to A but to a borrowed bVII Gadd9 (MIXOLYDIAN) — the "bringing me down" chord that
//   refuses to resolve, so every 8-bar loop sighs and starts over unresolved. That's the throat-lump.
// Motif: a descending piano SIGH  e5 - c#5 - b4 - a4  (falling to the tonic, then hanging). Develops across the
//   arc — intro states only its head (e5 c#5), the body plays it whole, the PEAK lifts it an octave & answers it
//   with the arp, the strip-back exposes it bare, the outro fragments it back to two fading notes.
// Structure: slowcat PER-CYCLE SEGMENTS (Approach 1/2) — each entry pulls ONE literal chord from the array so
//   the harmony ALWAYS advances; layers are added/removed per section to sculpt the LCD build-and-strip arc.
setcps(0.475)   // ~114 BPM — the classic DFA dance-punk tempo

// ===== HARMONY — one literal chord per slowcat entry (spelled out; NO arithmetic on chords) =========
// 8-chord loop. Pads/arps/bass index CH[i % 8]; the progression advances because each entry IS a new chord.
const CH = [
  'a3,c#4,e4,b4',      // 0  A(add9)   — home, but restless (the 9th)
  'g#3,b3,e4',         // 1  E/G#      — first-inversion V, leading tone in the bass, unstable
  'f#3,a3,c#4,e4',     // 2  F#m7      — the sinking, the melancholy relative
  'd3,f#3,a3,b3',      // 3  D6/9      — bright IV with an added 6th, wistful shimmer
  'b2,d3,f#3,a3',      // 4  Bm7       — ii7, deepens the ache
  'd3,f#3,a3,c#4,g#4', // 5  Dmaj7#11  — LYDIAN RISK: the g# over D, aching-bright
  'e3,a3,b3,d4',       // 6  E7sus4    — dominant that hangs, won't resolve cleanly
  'g3,b3,d4,a4',       // 7  Gadd9     — borrowed bVII (Mixolydian): turns "home" but DOWN, unresolved
]
// Bass roots, spelled at their own octaves (again: literals only, no numeral ops on the chords).
const RT = ['a1', 'g#1', 'f#1', 'd1', 'b1', 'd1', 'e1', 'g1']

// ===== DRUMS — motorik four-on-the-floor, live-feeling, human ======================================
const kick     = s("bd*4").bank("RolandTR909").lpf(2600).attack(0.001).release(0.14).gain(0.9)
const kickSoft = s("bd*4").bank("RolandTR909").lpf(1700).attack(0.001).release(0.13).gain(0.62)
// Woodblock/cowbell tick — the insistent LCD percussion; rim on the offbeats, humanized gain.
const block    = s("rim*8").bank("RolandTR909").hpf(1400)
  .gain("0.28 0.12 0.24 0.12 0.3 0.12 0.24 0.14").pan(0.18).release(0.05)
const blockLo  = s("~ rim ~ rim ~ rim ~ rim").bank("RolandTR909").hpf(900).gain(0.16).pan(-0.14).release(0.06)
// Live-feeling hats — 8ths that breathe (uneven gains), never machine-flat.
const hats     = s("hh*8").bank("RolandTR909").hpf(7600)
  .gain("0.2 0.09 0.15 0.09 0.19 0.09 0.15 0.11").release(0.04)
const hatsLift = s("hh*16").bank("RolandTR909").hpf(8000)
  .gain("0.16 0.06 0.11 0.06 0.14 0.06 0.11 0.06 0.16 0.06 0.11 0.06 0.14 0.06 0.11 0.08").release(0.035)
const ophat    = s("~ ~ oh ~ ~ ~ oh ~").bank("RolandTR909").hpf(6800).gain(0.14).release(0.11)
// Handclaps on 2 & 4 — the human backbeat, a touch of room.
const clap     = s("~ cp ~ cp").bank("RolandTR909").hpf(650).room(0.18).gain(0.4).release(0.14)
const crash    = s("cr ~ ~ ~").bank("RolandTR909").hpf(800).gain(0.24).release(0.6).room(0.3)

// ===== BASS — warm analog bass locked to the kick, one root per chord ==============================
// Pulsing 8ths that lock to the four-on-the-floor; soft saw shaped down for warmth (not aggression).
const bassPulse = (root) => note(m(root)).struct("x ~ x x ~ x x ~").s("sawtooth")
  .lpf(360).resonance(4).shape(0.18).attack(0.002).decay(0.14).sustain(0.5).release(0.08).gain(0.5)
const bassSub   = (root) => note(m(root)).struct("x ~ ~ ~ x ~ ~ ~").s("sine").lpf(110).gain(0.5)

// ===== PAD — the aching synth-strings (triangle + saw, big attack & room) ===========================
// The harmonic bed that ACHES. Slow attack so chords bloom in; layered triangle warmth + saw shimmer.
const padTri = (chord) => note(m(chord)).s("triangle").lpf(1100).attack(0.4).release(0.9).room(0.55).gain(0.24)
const padSaw = (chord) => note(m(chord)).s("sawtooth").lpf(sine.range(700, 1600).slow(8)).resonance(3)
  .attack(0.5).release(1.0).room(0.6).gain(0.13)
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
  .gain(0.19).delay(0.3).delaytime(0.1875).delayfeedback(0.34).pan(-0.12)
// Bright bell accents at the peak — marimba dusting the top, sparse & shimmering.
const bells  = note("~ e5 ~ a5 ~ c#6 ~ e5 ~ a5 ~ e5 ~ c#6 ~ a5").s("marimba").gain(0.18).room(0.5).pan(0.2)

// ===== THE PIANO MOTIF — the falling "sigh", developed across the arc =============================
// Head only (intro): e5 c#5 — the question, hanging.
const motifHead = note("e5 ~ c#5 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.36).room(0.4).pan(-0.08)
// Whole sigh (body): e5 c#5 b4 a4, falling to the tonic then held.
const motifFull = note("e5 ~ c#5 ~ b4 ~ a4 ~ ~ ~ a4 ~ ~ ~ ~ ~").s("piano").gain(0.4).room(0.42).pan(-0.08)
// Answered (lift): the sigh, then an echo a step up that reaches and falls back — call & response.
const motifCall = note("e5 ~ c#5 ~ b4 ~ a4 ~ ~ f#5 ~ e5 ~ c#5 ~ b4").s("piano").gain(0.4).room(0.45).pan(-0.06)
// PEAK — lifted an OCTAVE, the emotional crest, ringing high.
const motifPeak = note("e6 ~ c#6 ~ b5 ~ a5 ~ ~ f#6 ~ e6 ~ c#6 ~ a5").s("piano").gain(0.42).room(0.5).pan(-0.05)
// Bare (strip): just the sigh exposed over near-silence, softer & wetter.
const motifBare = note("e5 ~ ~ c#5 ~ ~ b4 ~ ~ ~ a4 ~ ~ ~ ~ ~").s("piano").gain(0.34).room(0.6).pan(0)
// Fragmented fade (outro): two notes, dissolving.
const motifFade = note("e5 ~ ~ ~ ~ ~ c#5 ~ ~ ~ ~ ~ ~ ~ ~ ~").s("piano").gain(0.3).room(0.65).pan(0)

// ===== SECTION SEGMENT BUILDERS — each pulls ONE chord CH[i%8] / root RT[i%8] ======================
// INTRO — bare pulse: soft kick, woodblock tick, sub bass, one soft pad bloom, motif head. Distant.
const introSeg = (i) => stack(
  kickSoft, blockLo, bassSub(RT[i % 8]), padSoft(CH[i % 8]), motifHead
)
// BUILD A — add the arp ostinato (the engine starts turning) + the hats come in.
const buildASeg = (i) => stack(
  kick.gain(0.78), block.gain(0.7), hats.gain(0.6), bassSub(RT[i % 8]),
  padSoft(CH[i % 8]).gain(0.2), arpLo.gain(0.14)
)
// BUILD B — the warm bass opens up, arp fuller, motif head still. Groove locks in.
const buildBSeg = (i) => stack(
  kick, block, hats, bassSub(RT[i % 8]), bassPulse(RT[i % 8]).gain(0.34),
  padSoft(CH[i % 8]), arpLo.gain(0.18), motifHead.gain(0.3)
)
// BODY — full four-on-the-floor + claps, pad blooms wide, motif whole, arp turning. The hypnotic verse.
const bodySeg = (i) => stack(
  kick, block, hats, clap, bassSub(RT[i % 8]), bassPulse(RT[i % 8]),
  pad(CH[i % 8]), arpLo, motifFull
)
// LIFT — open hats + 16th hats, arp climbs an octave, triangle counter-line joins, motif answers itself.
const liftSeg = (i) => stack(
  kick, block, hatsLift, clap, ophat, bassSub(RT[i % 8]), bassPulse(RT[i % 8]),
  pad(CH[i % 8]), arpLo.gain(0.15), arpHi.gain(0.16), motifCall
)
// PEAK — the emotional crest: everything, crash on the 1, bells shimmering, motif up an octave, widest pad.
const peakSeg = (i) => stack(
  kick, block, hatsLift, clap, ophat, crash.gain(0.16),
  bassSub(RT[i % 8]), bassPulse(RT[i % 8]),
  pad(CH[i % 8]).gain(0.28), arpHi, bells, motifPeak
)
// STRIP — the ache EXPOSED: drums pull back to a soft kick + tick, pad + arp + bare motif only. Silence allowed.
const stripSeg = (i) => stack(
  kickSoft.gain(0.5), blockLo.gain(0.5), bassSub(RT[i % 8]).gain(0.4),
  padTri(CH[i % 8]).gain(0.24), arpLo.gain(0.15), motifBare
)
// OUTRO — resolve down and out: kick fading, arp thinning, fragmented motif dissolving, last pad hangs.
const outroSeg = (i) => stack(
  kickSoft.gain(0.42), blockLo.gain(0.35), bassSub(RT[i % 8]).gain(0.4),
  padSoft(CH[i % 8]).gain(0.22), arpLo.gain(0.11), motifFade
)

// ===== ARRANGEMENT — 88-cycle LCD build-and-strip arc ==============================================
// Each Array.from spreads ONE segment per cycle; k feeds CH[k%8]/RT[k%8] so the 8-chord loop keeps turning
// and REPEATS across every section (the vamp never freezes). Layers accumulate, peak, then strip away.
slowcat(
  ...Array.from({ length: 6 },  (_, k) => introSeg(k)),          //  6  bare pulse (distant)
  ...Array.from({ length: 10 }, (_, k) => buildASeg(k + 6)),     // 10  arp + hats enter (engine turns)
  ...Array.from({ length: 10 }, (_, k) => buildBSeg(k + 16)),    // 10  warm bass opens, groove locks
  ...Array.from({ length: 12 }, (_, k) => bodySeg(k + 26)),      // 12  full verse — pad blooms, motif whole
  ...Array.from({ length: 10 }, (_, k) => liftSeg(k + 38)),      // 10  lift — arp climbs, counter-line, motif answers
  ...Array.from({ length: 14 }, (_, k) => peakSeg(k + 48)),      // 14  PEAK — the emotional crest (motif up an 8ve)
  ...Array.from({ length: 8 },  (_, k) => stripSeg(k + 62)),     //  8  strip back — the ache exposed, near-silence
  ...Array.from({ length: 10 }, (_, k) => peakSeg(k + 70)),      // 10  return to the peak — one last flight
  ...Array.from({ length: 8 },  (_, k) => outroSeg(k + 80)),     //  8  outro — fragmented, dissolving, unresolved
)                                                                // 88 total
`
