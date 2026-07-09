export const title = 'Soft Compiler'
export const genre = 'Peaceful ambient-techno / downtempo for coding — warm, hypnotic, ~60bpm pulse'
export const mood = 'calm and grounded, made to disappear into — a warm gentle pulse, deep soft sub, lush D-Dorian extended pads drifting on a perlin filter, a sparse falling-sigh motif that answers itself across voices; spacious, unobtrusive, hypnotic, evolving like slow clouds with no jarring transitions — flow-state music to think over'
export const cycles = 80
// exported from the radio DB (2026-06-30); restore with: bun scripts/post-song.mjs <this file>
export const code = `// Genre: Peaceful ambient-techno / downtempo (coding flow-state) — warm, hypnotic, unobtrusive
// Sounds: sine (deep soft SUB, felt-not-heard, lpf low + slow attack), triangle (the warm PAD bed AND the
//         soft falling-sigh MOTIF lead), rhodes (sparse warm electric-piano color stabs + the octave-down
//         answer, lo-fi-adjacent), the soft drum KIT bd/hh/shaker (a GENTLE low-passed pulse + barely-there
//         shimmer — never aggressive), noise (very low-gain filtered AIR, the subtle evolving lo-fi texture
//         since vinyl is banned).
// Structure: HYPNOTIC / EVOLVING — ONE continuous living stack(), NOT slowcat sections. A focus track must
//         never hit a hard section boundary, so the arc is carried by .every()/.someCycles()/.sometimes() and
//         perlin/sine filter drift gently adding & removing voices over ~80 cycles (sparse open intro ->
//         fuller warm middle -> thinning dissolve). Chords cycle CONTINUOUSLY via top-level angle brackets.
// Harmony: D DORIAN, slow harmonic rhythm (one chord per cycle, 4-cycle vamp): Dm9 -> G13 -> Cmaj9 -> Am11.
//         THE GENTLE RISK = the bright G13 is the Dorian MAJOR-IV (the natural-6th warmth, the modal signature)
//         and Cmaj9 is a soft bVII lift — NOT a I-V-vi-IV; partly quartal/extended for a spacious, non-
//         functional ambient bed. Everything stays soft (gain ~0.2-0.4), slow attacks, generous reverb.
// Motif: a gentle FALLING SIGH that answers itself — a5 -> g5 (step down) -> e5 (leap down, lands on the
//         color tone), off the downbeat with space around it. Develops SUBTLY (never jarring): every 8 cycles
//         it lifts a 4th, sometimes it re-rhythms, the rhodes echoes it an octave down (call-and-response),
//         and in the dissolve it fragments to a single far-off note. Steps + one leap, lots of expressive rest.
setcps(0.5)

// ===== THE AIR (noise): very low filtered air, the subtle evolving lo-fi texture — perlin drift ===========
const air = s("noise").lpf(perlin.slow(12).range(500, 1800)).hpf(600).gain(0.045).room(0.85)

// ===== THE DEEP SUB (sine, lpf low, soft slow attack): roots of the Dorian vamp, felt-not-heard ===========
// cycles its root each cycle to follow the chords (D -> G -> C -> A), soft pulse on the 1 and a gentle "and"
const sub = note("<d1 g1 c2 a1>")
  .struct("x ~ ~ ~ ~ ~ x ~")
  .s("sine").lpf(110).attack(0.06).release(0.5).gain(0.45)

// ===== THE WARM PAD BED (triangle, very soft, big reverb): the lush extended-chord cushion =================
// Dm9 -> G13 (Dorian major-IV) -> Cmaj9 (bVII lift) -> Am11 (soft quartal v). Long attack/release = no edges.
// pad filter slowly opens & closes on a sine LFO for organic, breathing movement.
const pad = note("<[d3,f3,a3,c4,e4] [g2,b3,d4,e4] [c3,e3,g3,b3,d4] [a2,d3,e4,g4]>")
  .s("triangle").lpf(sine.slow(16).range(520, 1100)).attack(0.9).release(1.8)
  .gain(0.22).room(0.75).pan(sine.slow(20).range(-0.18, 0.18))

// a second, higher detuned pad layer for width — drifts in only on some cycles (subtraction = taste)
const padHigh = note("<[a4,c5,e5] [d5,e5,g5] [g4,b4,d5] [e4,g4,a4]>")
  .s("triangle").lpf(sine.slow(24).range(900, 1600)).attack(1.2).release(2.0)
  .detune(0.08).gain(0.12).room(0.85).pan(-0.12)

// ===== THE RHODES (warm, sparse): soft color stabs + the octave-down ANSWER to the motif =================
// gentle off-beat chord shimmer, low-passed warm, swimming in reverb — adds lo-fi warmth without clutter
const keys = note("<[d4,a4] [g4,b4] [c4,g4] [a3,e4]>")
  .struct("~ ~ x ~ ~ ~ ~ x")
  .s("rhodes").lpf(1500).attack(0.04).release(0.7).gain(0.18).room(0.7).pan(0.14)

// the motif answered an octave down in the rhodes (call-and-response across voices) — soft, distant
const answer = note("~ ~ ~ ~ ~ a3 ~ g3 ~ ~ e3 ~ ~ ~ ~ ~")
  .s("rhodes").lpf(1300).attack(0.05).release(0.8).gain(0.14).room(0.8)
  .delay(0.3).delaytime(0.5).delayfeedback(0.25).pan(-0.16)

// ===== THE MOTIF (triangle lead, soft + airy): the falling-sigh a5->g5->e5, off the downbeat =============
// lots of rest = expressive space (ambient). lands e5 = the color tone. soft vibrato for a human breath.
const motif = note("~ ~ a5 ~ g5 ~ ~ ~ ~ ~ e5 ~ ~ ~ ~ ~")
  .s("triangle").lpf(2000).vib(4).vmod(0.05).attack(0.06).release(0.9)
  .gain(0.2).room(0.85).delay(0.32).delaytime(0.5).delayfeedback(0.28).pan(0.1)

// a fragmented, far-off single note of the motif for the open intro & dissolve outro
const motifFrag = note("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ e5 ~ ~ ~ ~ ~")
  .s("triangle").lpf(1700).vib(3.5).vmod(0.06).attack(0.1).release(1.4)
  .gain(0.17).room(0.92).delay(0.4).delaytime(0.75).delayfeedback(0.3)

// ===== THE GENTLE PULSE (soft kit): low-passed warm kick + barely-there hat shimmer + drifting shaker =====
// kick: a soft heartbeat on the 1 and a quiet "and" — low-passed so it's a warm thud, never a punch
const kick = s("bd ~ ~ ~ ~ ~ bd ~").bank("RolandTR808").lpf(120).attack(0.005).release(0.18).gain(0.5)
// hats: quiet, soft 8th shimmer with a gentle tipping accent — subtle forward motion, easy to ignore
const hats = s("hh*8").bank("RolandTR808").gain("0.1 0.05 0.08 0.05 0.1 0.05 0.08 0.06").hpf(500).pan(0.08).room(0.2)
// shaker: a soft 16th dust that drifts in only sometimes — keeps the pulse alive without demanding attention
const shake = s("shaker*8").gain("0.07 0.04 0.06 0.04 0.07 0.04 0.06 0.05").pan(-0.1).room(0.25)

// ===== THE LIVING PATTERN — one continuously-evolving stack, arc carried by .every()/.someCycles() ========
// Voices gently add & remove over ~80 cycles: open intro (air+sub+pad) -> warm middle (motif, keys, pulse) ->
// thinning dissolve. No section boundaries — everything fades through filters, probability and cycle-gating.
stack(
  // the air texture is always present, breathing on perlin
  air,
  // the deep sub: always there, the warm floor — drops out for a single breathing bar every 16 cycles
  sub.every(16, x => x.gain(0)),
  // the main pad bed: always present, the harmonic cushion
  pad,
  // the higher width pad: only joins for the warm middle (cycles ~16-64), absent at the open & close
  padHigh.someCyclesBy(0.66, x => x.gain(0)),
  // the rhodes color: drifts in & out, and every 12 cycles lifts an octave for a soft brightening
  keys.every(12, x => x.add(12)).someCyclesBy(0.4, x => x.gain(0)),
  // the rhodes octave-down answer: a sometimes call-and-response, only in the fuller passages
  answer.someCyclesBy(0.5, x => x.gain(0)),
  // the motif: the heart of the middle. every 8 cycles it lifts a 4th (gentle development); sometimes it
  // re-rhythms; it rests out at the very open and the very end so the piece breathes in and out
  motif.every(8, x => x.add(5)).sometimesBy(0.25, x => x.fast(1.5)).someCyclesBy(0.3, x => x.gain(0)),
  // the far-off motif fragment: a quiet ghost that mostly only surfaces when the full motif is resting
  motifFrag.someCyclesBy(0.6, x => x.gain(0)),
  // the soft kick pulse: enters after the open intro, steady warm heartbeat through the body
  kick.someCyclesBy(0.15, x => x.gain(0)),
  // the hat shimmer: subtle forward motion, occasionally thinned to half-time for variation
  hats.sometimesBy(0.2, x => x.gain(0.05)).someCyclesBy(0.2, x => x.gain(0)),
  // the shaker dust: drifts in & out so the groove is never static, never insistent
  shake.someCyclesBy(0.55, x => x.gain(0))
)
`
