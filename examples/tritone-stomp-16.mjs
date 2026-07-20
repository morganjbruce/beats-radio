export const title = 'Tritone Stomp'
export const genre = 'The White Stripes — raw garage blues-rock (Seven Nation Army / De Stijl / Elephant, ~125 BPM stomp)'
export const mood = 'raw, primal, urgent — a brooding minor-pentatonic riff that coils in the verses and EXPLODES into fuzzed-out choruses'
export const cycles = 78
// exported from the radio DB (2026-06-30); restore with: bun scripts/post-song.mjs <this file>
export const code = `// Genre: White Stripes raw garage blues-rock — ~125 BPM stomp, fuzzed guitar riff is EVERYTHING, Meg-White-simple drums
// Sounds: sawtooth + distort/shape/crush + lpf/resonance (THE fuzzed garage GUITAR RIFF, doubled an octave down for
//         the low end — NO separate clean bass, the guitar carries it White-Stripes-style); square + distort + lpf
//         (the SCREAMING lead lick, call-and-response with the riff, with bluesy grace-note bends); bd (pounding
//         stomping kick); sd (cracking snare backbeat on 2 & 4, HEAVY room); hh (minimal closed hat, Meg simplicity);
//         cr (crash slamming the chorus downbeats); noise (faint lo-fi room grit, low). Grit from distort+shape+crush.
// Harmony: E minor-PENTATONIC blues. One hypnotic low riff is the whole song. RISK = the blue b5 (bb2, the TRITONE
//         bite) as a grace note in the riff, PLUS the bluesy IV lift — the chorus transposes the riff up a 4th to A
//         (and leans on a bVII D pickup). b3 (g), b5 (bb), b7 (d) = the blues color. The root grinds on E; the b5 is
//         the wrong note that makes it primal.
// Motif: the RIFF — low E pentatonic stomp: e2 . e2 g2 . e2 . bb2-a2 (the bb2 = the blue tritone grace bend down to a2).
//         Develops: (1) verse states it BARE and brooding (riff alone + thud kick, pulled WAY back); (2) chorus
//         EXPLODES it — full fuzz, octave-down double (e1) for bass weight, the screaming lead answers up high;
//         (3) chorus2 transposes the riff up a 4th (the IV, to A) for the lift; (4) solo/breakdown fragments the riff
//         to a single stomping pedal while the lead SCREAMS a bent pentatonic lick; (5) final chorus = everything full.
// Structure: slowcat garage-rock arrangement (Approach 1) — verse/chorus song form, the point is the DYNAMIC SWING.
//         riff intro (riff alone, hypnotic) -> VERSE (sparser, brooding, pull WAY back — riff + thud kick, snare ghosts)
//         -> CHORUS (explosive distorted full kit + octave double + screaming lead) -> verse -> chorus -> SOLO/BREAKDOWN
//         (strip to stomping pedal + a screaming bent lead lick, call-and-response) -> CHORUS (IV lift) -> outro (riff
//         decays alone). The contrast verse(quiet/brooding) vs chorus(explosion) is the whole emotional arc.
setcps(0.521)   // ~125 BPM garage stomp

// ===== LO-FI ROOM GRIT — faint filtered noise, the gritty tape/room under everything (never loud) ==============
const roomGrit = s("noise").lpf(sine.range(1200, 3000).slow(8)).hpf(800).gain(0.035).room(0.3)

// ===== DRUMS — pounding, primal, MINIMAL (Meg White: kick + heavy snare backbeat, barely a kit) ===============
// Kick: heavy stomp — 1 and the syncopated push, thudding and simple. Slight swing for the human stomp.
const kick     = s("bd ~ ~ bd ~ ~ bd ~").bank("RolandTR909").lpf(2200).shape(0.3).gain(1).release(0.18).distort(0.12)
const kickVerse = s("bd ~ ~ ~ ~ ~ bd ~").bank("RolandTR909").lpf(1600).shape(0.22).gain(0.78).release(0.2)
// Snare: CRACKING backbeat on 2 & 4, drenched in HEAVY room (the cavernous garage snare). The whole groove.
const snare    = s("~ ~ sd ~ ~ ~ sd ~").bank("RolandTR909").gain(0.82).shape(0.28).lpf(7500).hpf(200)
  .room(0.55).roomsize(3).release(0.22).distort(0.14)
// Verse snare — same backbeat but pulled back, brooding, less room glare.
const snareVerse = s("~ ~ sd ~ ~ ~ sd ~").bank("RolandTR909").gain(0.5).shape(0.18).lpf(6000).hpf(220)
  .room(0.4).roomsize(2.5).release(0.18)
// Minimal closed hat — barely there, Meg simplicity, just a little forward push in the chorus.
const hat      = s("hh ~ hh ~ hh ~ hh ~").bank("RolandTR909").hpf(8000).gain("0.16 0 0.1 0 0.16 0 0.1 0").release(0.03)
// Crash — SLAMS the chorus downbeat, the explosive accent.
const crash    = s("cr ~ ~ ~ ~ ~ ~ ~").gain(0.4).hpf(900).room(0.5).release(0.9).shape(0.12)

const drumsVerse = stack(kickVerse, snareVerse)
const drumsFull  = stack(kick, snare, hat)
const drumsChor  = stack(kick, snare, hat, crash)

// ===== THE GUITAR RIFF — fuzzed-out garage guitar (sawtooth + distort + shape + crush + lpf/resonance) =========
// The b5 grace note (bb2) bending down to a2 is the BLUE TRITONE bite — the wrong note that makes it primal.
// Palm-muted chug feel via short attack + tight release. This is the centerpiece — everything serves it.
const riffLowE  = note("e2 ~ e2 g2 ~ e2 bb2 a2")
const riffLowA  = note("a2 ~ a2 c3 ~ a2 eb3 d3")   // the IV lift — same shape transposed up a 4th (to A)
const riffPedal = note("e2 ~ ~ ~ e2 ~ ~ ~")        // fragmented to a stomping pedal for the breakdown

// the fuzz voice — heavy distort + shape + light crush, aggressive resonant lpf, palm-mute envelope
const fuzz = (phrase) => phrase.s("sawtooth").lpf(1500).resonance(8).shape(0.55).distort(0.55).crush(7)
  .attack(0.005).decay(0.12).sustain(0.4).release(0.1).gain(0.5)
// quieter brooding fuzz for the verse — pull WAY back (lower gain, darker lpf, less grind) so chorus EXPLODES
const fuzzVerse = (phrase) => phrase.s("sawtooth").lpf(750).resonance(6).shape(0.32).distort(0.3)
  .attack(0.008).decay(0.14).sustain(0.35).release(0.1).gain(0.3)
// the OCTAVE-DOWN DOUBLE — guitar carries the low end (no separate bass), thick fuzzed sub-register weight
const fuzzSub = (phrase) => phrase.sub(note(12)).s("sawtooth").lpf(420).resonance(4).shape(0.4).distort(0.45)
  .attack(0.006).decay(0.18).sustain(0.5).release(0.12).gain(0.46)
// a hair-detuned second guitar layer (the doubled-track garage thickness), panned for width
const fuzzWide = (phrase) => phrase.add(note(0.14)).s("sawtooth").lpf(1700).shape(0.45).distort(0.4)
  .attack(0.006).decay(0.12).sustain(0.4).release(0.1).gain(0.24).pan(0.2)

// ===== THE SCREAMING LEAD — square + distort, high bluesy pentatonic lick with grace-note bends ===============
// Call-and-response: it ANSWERS the riff. Grace notes (the quick [x x] pairs) = bluesy bends/hammer-ons.
const lead = (phrase) => note(m(phrase)).s("square").lpf(2800).resonance(7).shape(0.4).distort(0.35)
  .attack(0.01).release(0.16).gain(0.32).room(0.3).delay(0.18).delaytime(0.166).delayfeedback(0.28).pan(-0.15)
// leadA (chorus) — a screaming answer: high E pent with a b5 bend, lands on the root
const leadA = lead('~ ~ ~ ~ e4 g4 [bb4 b4] e5').vib(5).vmod(0.06)
// leadB (chorus2 / IV) — answers over the A lift, reaching higher
const leadB = lead('~ ~ ~ ~ a4 c5 [eb5 e5] a5').vib(5).vmod(0.07).gain(0.34)
// leadSolo (breakdown) — SCREAMS a full bent pentatonic lick, call-and-response with the stomping pedal
const leadSolo = lead('e5 ~ g4 [bb4 b4] e5 ~ d5 b4 ~ g4 [bb4 a4] ~ e4 g4 ~')
  .gain(0.36).distort(0.45).delayfeedback(0.34).vib(5.5).vmod(0.08)

// ===== SECTIONS ================================================================================================
// intro — the RIFF alone, hypnotic and raw, just riff + sub + a lone thud kick. Establish the centerpiece.
const intro  = stack(roomGrit, fuzz(riffLowE).gain(0.42), fuzzSub(riffLowE).gain(0.4), kickVerse.gain(0.6))

// VERSE — pull WAY back: brooding, sparse. Riff darkened + quiet, thud kick, ghost snare. Coiled menace.
const verse  = stack(roomGrit, fuzzVerse(riffLowE), fuzzSub(riffLowE).gain(0.32).lpf(340), drumsVerse)

// CHORUS — EXPLOSION: full fuzz + octave double + wide doubled guitar + full pounding kit + crash + screaming lead.
const chorus  = stack(roomGrit, fuzz(riffLowE), fuzzSub(riffLowE), fuzzWide(riffLowE), drumsChor, leadA)
// CHORUS 2 — the IV LIFT: riff transposed up a 4th to A (the bluesy lift), lead answers higher.
const chorus2 = stack(roomGrit, fuzz(riffLowA), fuzzSub(riffLowA), fuzzWide(riffLowA), drumsChor, leadB)

// SOLO / BREAKDOWN — strip to a stomping pedal riff + thud kick while the lead SCREAMS a bent lick. Call & response.
const breakdown = stack(roomGrit,
  fuzz(riffPedal).gain(0.4).lpf(1100), fuzzSub(riffPedal).gain(0.4),
  kick.gain(0.7), snare.gain(0.55), leadSolo)
// rebuild bar — the full riff slams back in under the tail of the solo, drums full, no lead (breath before chorus)
const rebuild = stack(roomGrit, fuzz(riffLowE), fuzzSub(riffLowE), fuzzWide(riffLowE), drumsChor)

// final chorus — everything full and feral, the lead screaming, the room blown out
const chorusEnd = stack(roomGrit, fuzz(riffLowE).gain(0.54), fuzzSub(riffLowE), fuzzWide(riffLowE),
  drumsChor, leadA.gain(0.36))

// outro — the riff decays alone, the room ringing out. Raw and unresolved, ends on the stomp.
const outro  = stack(roomGrit, fuzz(riffLowE).gain(0.4).release(0.3), fuzzSub(riffLowE).gain(0.36), kickVerse.gain(0.55))

// ===== ARRANGEMENT — 78 cycles ================================================================================
slowcat(
  intro, intro, intro, intro,                                                  // 4  riff alone, hypnotic & raw
  verse, verse, verse, verse, verse, verse, verse, verse,                      // 8  brooding verse (pulled WAY back)
  chorus, chorus, chorus, chorus, chorus, chorus, chorus, chorus,              // 8  EXPLOSION — full fuzz + scream
  verse, verse, verse, verse, verse, verse, verse, verse,                      // 8  back to brooding (the dynamic swing)
  chorus, chorus, chorus, chorus, chorus, chorus, chorus, chorus, chorus, chorus, chorus, chorus, // 12 chorus hits again, harder
  breakdown, breakdown, breakdown, breakdown, breakdown, breakdown, breakdown, breakdown, rebuild, rebuild, // 10 SOLO/breakdown -> rebuild
  chorus2, chorus2, chorus2, chorus2, chorus2, chorus2, chorus2, chorus2,      // 8  chorus — the IV lift (riff up a 4th)
  verse, verse, verse, verse, verse, verse,                                    // 6  one last brooding pull-back
  chorusEnd, chorusEnd, chorusEnd, chorusEnd, chorusEnd, chorusEnd, chorusEnd, chorusEnd, chorusEnd, chorusEnd, // 10 final feral chorus
  outro, outro, outro, outro                                                   // 4  riff decays alone (78 total)
)
`
