export const title = 'And I Jumped In The River'
export const genre = 'Radiohead — "Pyramid Song" homage: oceanic art-rock / jazz-ballad drift. Rubato swung piano, aching extended chords, a keening Ondes-Martenot-like lead, warm upright bass, and late-arriving brushed-jazz drums behind the beat.'
export const mood = 'sparse, patient, devastating — floating and underwater; melancholy-but-beautiful, resigned yet warm ("there was nothing to fear and nothing to doubt"). A hard-to-count 3+3+4+3+3 piano figure that drifts rather than marches, lush F#-minor harmony with borrowed-major glow, a high vocal sigh floating over it, drums that only enter partway and lean behind the pulse, one restrained swell, then it recedes.'
export const cycles = 76
// exported from the radio DB (2026-07-01); restore with: bun scripts/post-song.mjs <this file>
export const code = `// Genre: Radiohead "Pyramid Song" homage — oceanic art-rock / jazz-ballad drift, rubato & underwater.
// Sounds: piano (the aching swung HARMONIC CORE, close extended voicings in a 3+3+4+3+3 figure),
//         triangle (the high keening Ondes-Martenot-like LEAD — vibrato + long room, sparse & vocal),
//         sawtooth (a low, very-low-passed STRING/pad bed for oceanic body & the one swell),
//         sine (the warm upright-ish BASS, locked to the chord roots), soft 808 brushed KIT
//         (bd/rim/hh/rd — loose, behind-the-beat, ENTERS LATE, swung so it feels human not mechanical).
// Structure: SLOWCAT with per-cycle SEGMENT BUILDERS (Approach 2) — each slowcat entry pulls ONE literal
//         chord from the progression array (chords ALWAYS advance), and each segment includes only the
//         voices alive in that phase, so the arc is built by ADDING ONE voice at a time and then stripping:
//         voice+piano -> +strings -> +bass -> +drums -> brief SWELL peak -> strip back to piano+voice.
// Harmony: F# MINOR (Aeolian), slow harmonic rhythm, ONE chord per cycle over a 4-bar loop:
//         F#m(add9) -> Emaj9 -> Dmaj7(add9) -> C#m9. THE RISK = the E major (bVII) and D major (bVI) are
//         BORROWED-MAJOR glow descending against the F#-minor centre — a warm chromatic ache that feels
//         both resolved and unresolved, never the I-V-vi-IV cliche. Close lush voicings, add9/maj7/m9.
// Bass: derived from the SAME array/index as the chords — default note is the chord ROOT
//         (f#1 -> e1 -> d1 -> c#1), moving via the octave/5th only, so the low end and harmony agree.
// Motif: a high VOCAL SIGH that falls and answers itself — c#5 -> b4 -> a4 (steps down), then a soft
//         leap up to f#5 and settle. Off the downbeat, lots of rest. Develops by transposition (lifts a
//         4th at the swell), fragmentation (a single far-off note at the edges), never a scale run.
// Feel: RUBATO & FLOATING. The piano struct is 3+3+4+3+3 across 16 (displaced accents, not four-on-floor);
//         everything is swung (.swingBy(1/3, ...)) and the kit sits behind the beat via .late, so the
//         pulse is felt, never stated. Soft gains (~0.15-0.5), long reverb tails, nothing sharp.
setcps(0.42)

// ===== THE PROGRESSION (one chord per cycle, 4-bar loop) — chords + matching roots share the index =====
// F#m(add9) -> Emaj9 (bVII glow) -> Dmaj7add9 (bVI glow) -> C#m9. Close, lush, aching voicings.
const CH = [
  'f#2,a3,c#4,g#4',      // F#m add9  (root low, b3+5th spread above, aching 9th on top)
  'e2,g#3,b3,d#4,f#4',   // Emaj9     (borrowed bVII major — root low, warm lift up top)
  'd2,f#3,a3,c#4,e4',    // Dmaj7add9 (borrowed bVI major — oceanic descent, spread)
  'c#2,g#3,b3,d#4',      // C#m9      (root low; 5th/m7/9th spread, no low cluster)
]
// bass roots — SAME index, chord roots only (moving by octave), warm upright-ish sine
const RT = ['f#1', 'e1', 'd1', 'c#1']
// a second low piano voicing (the left-hand root/5th anchor under the right-hand chord), same harmony
const LH = ['f#2,c#3', 'e2,b2', 'd2,a2', 'c#2,g#2']
// low string/pad bed — the SAME chords voiced low for oceanic body (spelled out, never .add on a chord)
const STR = ['f#2,a2,c#3', 'e2,g#2,b2', 'd2,f#2,a2', 'c#2,e2,g#2']

// ===== THE PIANO (harmonic core) — the signature 3+3+4+3+3 swung figure, displaced off the grid ========
// struct across 16 sixteenths: x..x..x...x..x.. = 3+3+4+3+3. Swung + a hair late = rubato, underwater.
// NOTE: chords come from a VARIABLE (CH[i]) — must wrap in m() so the comma-chord is parsed as a
// mini-notation stack. note(m(rawCommaStringVariable)) fails silently ("not a note"); only string
// LITERALS get auto-wrapped by the transpiler. m() is the transpiler's mini fn, always in scope.
const piano = (chord) => note(m(chord))
  .struct("x ~ ~ x ~ ~ x ~ ~ ~ x ~ ~ x ~ ~")
  .s("piano").attack(0.02).release(1.1)
  .swingBy(1/3, 8).late(0.02).lpf(3800).gain(0.46).room(0.34).pan(-0.05)
// left-hand anchor — soft root/5th on the 1 and the syncopated "and", grounding the drifting right hand
const pianoLH = (chord) => note(m(chord))
  .struct("x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~")
  .s("piano").attack(0.02).release(1.1)
  .swingBy(1/3, 8).late(0.015).lpf(2600).gain(0.34).room(0.30).pan(0.06)

// ===== THE WARM UPRIGHT BASS (sine, lpf low) — locked to the chord ROOT, root on 1 + octave-up "and" ====
const bass = (root) => note(m(root))
  .struct("x ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ ~")
  .s("sine").attack(0.03).release(0.85).lpf(220).gain(0.5).swingBy(1/3, 8)

// ===== THE LOW STRING/PAD BED (sawtooth, very low-passed) — oceanic body, long attack, the swell =========
const strings = (chord) => note(m(chord))
  .s("sawtooth")
  .superimpose(x => x.detune(0.11).gain(0.09).pan(0.13))
  .lpf(sine.slow(20).range(420, 780)).attack(1.1).release(2.2)
  .gain(0.16).room(0.72).pan(-0.1)

// ===== THE KEENING LEAD (triangle, Ondes-Martenot-like) — the high vocal sigh, vibrato + long room =======
// c#5 -> b4 -> a4 (falling steps) then a soft leap to f#5 and settle. Off the downbeat, lots of space.
const sighMain = note("~ ~ ~ c#5 ~ ~ b4 ~ ~ ~ a4 ~ ~ f#5 ~ ~")
  .s("triangle").vib(5).vmod(0.08).lpf(2400).attack(0.08).release(1.1)
  .gain(0.18).room(0.7).delay(0.3).delaytime(0.5).delayfeedback(0.28).pan(0.08)
// the sigh lifted a 4th for the swell (transposed literal, not .add on a chord — single notes so safe,
// but written out for clarity of contour): f#5 -> e5 -> d5 -> b5
const sighLift = note("~ ~ ~ f#5 ~ ~ e5 ~ ~ ~ d5 ~ ~ b5 ~ ~")
  .s("triangle").vib(5).vmod(0.09).lpf(2700).attack(0.07).release(1.0)
  .gain(0.19).room(0.88).delay(0.3).delaytime(0.5).delayfeedback(0.3).pan(0.1)
// a fragmented single far-off note for the intro & the outro edges
const sighFrag = note("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ f#5 ~ ~ ~ ~ ~")
  .s("triangle").vib(4).vmod(0.06).lpf(2100).attack(0.14).release(1.7)
  .gain(0.17).room(0.92).delay(0.4).delaytime(0.75).delayfeedback(0.3)

// ===== THE LATE, LOOSE BRUSHED KIT (soft 808) — behind the beat, swung, human, never a straight 4-floor ==
// soft warm kick on 1 and the syncopated push; brushed snare (rim) on the lazy 3; a quiet ride shimmer;
// all swung (1/3) and pulled LATE so it leans behind the piano — jazzy and rubato, not mechanical.
const kick = s("bd ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~ ~ ~ ~").bank("RolandTR808")
  .lpf(120).attack(0.006).release(0.22).gain(0.4).swingBy(1/3, 8).late(0.03)
const brush = s("~ ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~ ~ ~ rim ~").bank("RolandTR808")
  .hpf(600).gain(0.22).room(0.4).swingBy(1/3, 8).late(0.04)
const ride = s("~ ~ rd ~ ~ ~ rd ~ ~ ~ rd ~ ~ ~ rd ~").bank("RolandTR808")
  .hpf(2600).gain(0.11).room(0.35).swingBy(1/3, 8).late(0.035).sometimesBy(0.2, x => x.gain(0))
const kit = stack(kick, brush, ride)

// ===== SEGMENT BUILDERS — one literal chord per cycle from CH[i%4]; each phase ADDS/strips one voice =====
// A: voice + piano alone (the track begins piano+voice)                     -> 2-3 voices
const segA = (i) => stack(piano(CH[i % 4]), pianoLH(LH[i % 4]), sighFrag)
// B: add the full falling sigh                                             -> +lead
const segB = (i) => stack(piano(CH[i % 4]), pianoLH(LH[i % 4]), sighMain)
// C: add the low strings/pad bed                                           -> +strings
const segC = (i) => stack(piano(CH[i % 4]), pianoLH(LH[i % 4]), strings(STR[i % 4]), sighMain)
// D: add the warm bass                                                     -> +bass
const segD = (i) => stack(piano(CH[i % 4]), pianoLH(LH[i % 4]), strings(STR[i % 4]), bass(RT[i % 4]), sighMain)
// E: add the late loose kit (drums arrive) — the groove settles in         -> +drums
const segE = (i) => stack(piano(CH[i % 4]), pianoLH(LH[i % 4]), strings(STR[i % 4]), bass(RT[i % 4]), sighMain, kit)
// F: the brief SWELL / peak — strings open, sigh lifts a 4th               -> fullest, restrained
const segF = (i) => stack(
  piano(CH[i % 4]).gain(0.46),
  pianoLH(LH[i % 4]),
  strings(STR[i % 4]).gain(0.24).lpf(920),
  bass(RT[i % 4]),
  sighLift,
  kit
)
// G: recede — drop the kit and bass, sigh softens back                     -> strip toward calm
const segG = (i) => stack(piano(CH[i % 4]), pianoLH(LH[i % 4]), strings(STR[i % 4]).gain(0.13), sighMain)
// H: the ending — piano + a single far-off sigh fragment, dissolving       -> back to the opening hush
const segH = (i) => stack(piano(CH[i % 4]).gain(0.36), pianoLH(LH[i % 4]).gain(0.28), sighFrag)

// ===== THE ARRANGEMENT — ADD ONE ELEMENT AT A TIME, one brief peak, then recede (76 cycles) =============
slowcat(
  ...Array.from({ length: 8 },  (_, k) => segA(k)),   // 8  intro: piano + far-off sigh alone
  ...Array.from({ length: 8 },  (_, k) => segB(k)),   // 8  the full keening sigh floats in
  ...Array.from({ length: 8 },  (_, k) => segC(k)),   // 8  low strings/pad bed enters (oceanic body)
  ...Array.from({ length: 8 },  (_, k) => segD(k)),   // 8  warm upright bass locks to the roots
  ...Array.from({ length: 8 },  (_, k) => segE(k)),   // 8  the loose brushed kit arrives, late & behind
  ...Array.from({ length: 8 },  (_, k) => segF(k)),   // 8  the one restrained SWELL — sigh lifts a 4th
  ...Array.from({ length: 8 },  (_, k) => segE(k)),   // 8  settle back to the full-band groove
  ...Array.from({ length: 8 },  (_, k) => segG(k)),   // 8  recede: kit + bass drop away
  ...Array.from({ length: 8 },  (_, k) => segC(k)),   // 8  just piano, strings, sigh — a last breath
  ...Array.from({ length: 4 },  (_, k) => segH(k)),   // 4  dissolve to piano + a single far-off sigh
)
`
