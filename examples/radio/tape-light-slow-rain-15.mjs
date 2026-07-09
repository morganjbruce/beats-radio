export const title = 'Tape Light, Slow Rain'
export const genre = 'Early-90s ambient techno (Aphex Twin, Selected Ambient Works era) — warm analog pads, soft sub, gentle dub-techno pulse, tape-warm haze'
export const mood = 'calm, melancholy and dreamlike — tender and nostalgic, spacious; lush detuned F#-minor pads with a wistful Lydian lift drifting on a slow perlin filter, a soft falling-sigh motif that answers itself octave-down in a far-off Rhodes, a deep felt-not-heard sub, and a gentle hypnotic pulse that breathes in and out under tape haze; evolves like slow clouds, never jars, never gets busy'
export const cycles = 84
// exported from the radio DB (2026-06-30); restore with: bun scripts/post-song.mjs <this file>
export const code = `// Genre: Early-90s ambient techno (SAW85-92 / SAW Volume II) — warm, soft, nostalgic, dreamlike
// Sounds: sine (deep soft SUB, felt-not-heard, lpf low + slow attack), triangle (the warm detuned PAD bed AND
//         the soft falling-sigh MOTIF lead), sawtooth (a second very-low-passed analog PAD layer for warmth &
//         width, chorused via superimpose+detune), rhodes (sparse melancholic color + the octave-down ANSWER),
//         noise (very low-gain lightly-filtered TAPE HAZE — vinyl is banned), soft 808 KIT bd/hh (a gentle
//         hypnotic dub-techno pulse that breathes in and out, never aggressive).
// Structure: HYPNOTIC / EVOLVING — ONE continuous living stack(), NOT slowcat sections. SAW-era ambient techno
//         is about slow continuous evolution and never hitting a hard boundary, so the arc is carried entirely
//         by .every()/.someCycles()/.sometimes() plus perlin/sine filter drift, gently adding & removing voices
//         over ~84 cycles: beatless drifting intro (haze + sub + pads) -> warm middle (motif, rhodes, soft
//         pulse) -> thinning dissolve back to drift. Chords cycle CONTINUOUSLY via top-level angle brackets.
// Harmony: F# MINOR with a Lydian tilt, slow harmonic rhythm (one chord per cycle, 4-cycle vamp):
//         F#m9 -> Dmaj9(#11) -> Amaj9 -> C#m11. THE GENTLE RISK = Dmaj9#11 is the bVI borrowed major with a
//         wistful raised-11th (the bittersweet Lydian color that lifts then settles back to the minor) — a soft
//         chromatic-mediant glow against the F#m center, NOT a I-V-vi-IV. Extended/quartal voicings keep the
//         bed spacious and non-functional. Everything soft (gain ~0.2-0.4), slow attacks, generous reverb.
// Motif: a gentle FALLING SIGH that answers itself — c#6 -> b5 (step down) -> f#5 (leap down to the tonic),
//         off the downbeat with lots of space. Develops SUBTLY (never jarring): every 8 cycles it lifts a 4th,
//         sometimes it re-rhythms slightly, the rhodes echoes it an octave down (call-and-response), and in the
//         dissolve it fragments to a single far-off note. Steps + one leap, mostly expressive rest.
setcps(0.46)

// ===== THE TAPE HAZE (noise): very low lightly-filtered air, the warm lo-fi tape texture — perlin drift =====
const haze = s("noise").lpf(perlin.slow(14).range(400, 1500)).hpf(500).gain(0.04).room(0.9)

// ===== THE DEEP SUB (sine, lpf low, soft slow attack): roots of the vamp, felt-not-heard =====================
// cycles its root each cycle to follow the chords (F# -> D -> A -> C#), soft pulse on the 1 and a gentle "and"
const sub = note("<f#1 d1 a1 c#2>")
  .struct("x ~ ~ ~ ~ ~ x ~")
  .s("sine").lpf(105).attack(0.07).release(0.55).gain(0.42)

// ===== THE WARM PAD BED (triangle, very soft, big reverb, chorused): the lush extended-chord cushion =========
// F#m9 -> Dmaj9#11 (the borrowed-major Lydian lift) -> Amaj9 -> C#m11. Long attack/release = no edges.
// superimpose a slightly-detuned copy for a soft analog chorus; filter breathes open & closed on a sine LFO.
const pad = note("<[f#2,a2,c#3,e3,g#3] [d2,f#3,a3,c#4,g#4] [a2,c#3,e3,g#3,b3] [c#3,e3,g#3,b3,f#4]>")
  .s("triangle")
  .superimpose(x => x.detune(0.12).gain(0.1))
  .lpf(sine.slow(18).range(480, 1050)).attack(1.0).release(2.0)
  .gain(0.2).room(0.78).pan(sine.slow(22).range(-0.16, 0.16))

// a second analog-warm sawtooth pad layer, VERY low-passed so it's all body and no edge — drifts in for width
const padSaw = note("<[f#2,c#3,e3] [d2,a2,c#4] [a2,e3,g#3] [c#3,g#3,b3]>")
  .s("sawtooth")
  .superimpose(x => x.detune(0.1).pan(0.14))
  .lpf(sine.slow(26).range(280, 620)).attack(1.4).release(2.4)
  .gain(0.13).room(0.82).pan(-0.12)

// ===== THE RHODES (warm, sparse): soft melancholic color stabs + the octave-down ANSWER to the motif ========
// gentle off-beat shimmer, low-passed warm, swimming in reverb — nostalgic color without clutter
const keys = note("<[c#4,g#4] [a4,d5] [e4,b4] [g#4,c#5]>")
  .struct("~ ~ x ~ ~ ~ ~ x")
  .s("rhodes").lpf(1500).attack(0.04).release(0.8).gain(0.16).room(0.72).pan(0.15)

// the motif answered an octave down in the rhodes (call-and-response across voices) — soft, distant
const answer = note("~ ~ ~ ~ ~ c#4 ~ b3 ~ ~ f#3 ~ ~ ~ ~ ~")
  .s("rhodes").lpf(1300).attack(0.05).release(0.9).gain(0.13).room(0.82)
  .delay(0.3).delaytime(0.5).delayfeedback(0.26).pan(-0.16)

// ===== THE MOTIF (triangle lead, soft + airy): the falling-sigh c#6->b5->f#5, off the downbeat ==============
// lots of rest = expressive space (ambient). lands f#5 = the tonic. soft slow vibrato for a human breath.
const motif = note("~ ~ c#6 ~ b5 ~ ~ ~ ~ ~ f#5 ~ ~ ~ ~ ~")
  .s("triangle").lpf(2000).vib(4).vmod(0.05).attack(0.07).release(1.0)
  .gain(0.19).room(0.86).delay(0.32).delaytime(0.5).delayfeedback(0.28).pan(0.1)

// a fragmented, far-off single note of the motif for the beatless intro & the dissolve outro
const motifFrag = note("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ f#5 ~ ~ ~ ~ ~")
  .s("triangle").lpf(1700).vib(3.5).vmod(0.06).attack(0.12).release(1.6)
  .gain(0.16).room(0.93).delay(0.4).delaytime(0.75).delayfeedback(0.3)

// ===== THE GENTLE PULSE (soft kit): low-passed warm kick + barely-there hat shimmer — dub-techno-ish =========
// kick: a soft heartbeat on the 1 and a quiet "and" — low-passed so it's a warm thud, never a punch
const kick = s("bd ~ ~ ~ ~ ~ bd ~").bank("RolandTR808").lpf(115).attack(0.005).release(0.2).gain(0.46)
// hats: quiet, soft 8th shimmer with a gentle tipping accent — subtle forward motion, easy to ignore
const hats = s("hh*8").bank("RolandTR808").gain("0.09 0.04 0.07 0.04 0.09 0.04 0.07 0.05").hpf(520).pan(0.08).room(0.22)

// ===== THE LIVING PATTERN — one continuously-evolving stack, arc carried by .every()/.someCycles() ==========
// Voices gently add & remove over ~84 cycles: beatless drifting intro (haze+sub+pads) -> warm middle (motif,
// rhodes, soft pulse) -> thinning dissolve. No section boundaries — everything fades through filters,
// probability and cycle-gating, like slow clouds passing.
stack(
  // the tape haze is always present, breathing on perlin
  haze,
  // the deep sub: always there, the warm floor — drops out for a single breathing bar every 16 cycles
  sub.every(16, x => x.gain(0)),
  // the main pad bed: always present, the harmonic cushion
  pad,
  // the analog sawtooth pad: only joins for the warm middle, absent at the open & close
  padSaw.someCyclesBy(0.6, x => x.gain(0)),
  // the rhodes color: drifts in & out, and every 12 cycles lifts an octave for a soft brightening
  keys.every(12, x => x.add(12)).someCyclesBy(0.45, x => x.gain(0)),
  // the rhodes octave-down answer: a sometimes call-and-response, only in the fuller passages
  answer.someCyclesBy(0.5, x => x.gain(0)),
  // the motif: the heart of the middle. every 8 cycles it lifts a 4th (gentle development); sometimes it
  // re-rhythms; it rests out at the very open and the very end so the piece breathes in and out
  motif.every(8, x => x.add(5)).sometimesBy(0.22, x => x.fast(1.5)).someCyclesBy(0.3, x => x.gain(0)),
  // the far-off motif fragment: a quiet ghost that mostly only surfaces when the full motif is resting
  motifFrag.someCyclesBy(0.6, x => x.gain(0)),
  // the soft kick pulse: enters after the beatless intro, steady warm heartbeat through the body
  kick.someCyclesBy(0.2, x => x.gain(0)),
  // the hat shimmer: subtle forward motion, occasionally thinned for variation, drops out at the edges
  hats.sometimesBy(0.2, x => x.gain(0.04)).someCyclesBy(0.25, x => x.gain(0))
)
`
