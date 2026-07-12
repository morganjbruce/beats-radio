export const title = 'Robot Heart Discotheque'
export const genre = 'Daft Punk / French filter-house (Da Funk / Discovery era)'
export const mood = 'euphoric, hypnotic, danceable, robotic-but-warm, joyful filter-disco'
export const cycles = 78
// exported from the radio DB (2026-06-30); restore with: bun scripts/post-song.mjs <this file>
export const code = `// Genre: Daft Punk French filter-house — ~123 BPM. Joyful, hypnotic, DANCEABLE; robotic but warm.
// Sounds: bd (RolandTR909 punchy four-on-the-floor house kick), cp (crisp disco clap on 2&4) + hh/oh
//         (shuffling 16th closed hats with swing + offbeat open-hat churn), sawtooth (THE chopped
//         disco-chord RIFF — the filter-swept core of the whole song, lpf+resonance breathing),
//         square+sawtooth (fat funky bassline locked to the kick), sawtooth LEAD (filtered detuned
//         saw = the talkbox/vocoder-ish flavor — NO vocal sample exists), noise (filtered riser sweeps).
// Harmony: A minor disco vamp, extended 7th/9th voicings for the warm chop: Am9 -> Dm9 -> Fmaj9 -> E7#9.
//         RISK: the E7#9 — an ALTERED dominant (the "Hendrix" #9, g# leading-tone + g natural rub) that
//         pulls hard back home to Am every loop. That altered V is the euphoric release valve; the Fmaj9
//         -> E7#9 is a half-step bass slide (f -> e) into the resolution. Bass outlines the roots a-d-f-e.
// Motif: the chopped CHORD RIFF (syncopated stabs, the disco loop) + a LEAD motif answering it: a rising
//         3-note gesture e5-g5-a5 that DEVELOPS — it transposes to follow each chord (over Dm: f5-a5-d6;
//         over F: a5-c6-e6; over E7#9: g#5-b5-e6, landing the #9 g6 in the big drop), and LEAPS up an
//         octave at the peak. The filter SWEEP (sine.range(200,4000).slow(8)) is the song's real arc:
//         closed/muffled in intro+build (tension), wide-open + resonant in the drops (release), drenched
//         and half-lit in the breakdown.
// Structure: slowcat French-house build (Approach 1) but every section is the SAME riff at a different
//         FILTER state + density — that IS French house: the song is one looping riff breathing through a
//         filter. intro (kick + closed riff behind the filter) -> build (riff opening, riser, hats in) ->
//         DROP1 (filter wide open, full groove, lead states the motif, the euphoria) -> breakdown (strip to
//         drenched chords + sub, filter half-lit, room empties) -> build2 (re-tension, bigger riser) ->
//         DROP2 (BIGGER: lead leaps an octave, the #9 sings, claps + open hats max) -> outro (filter closing
//         back down, kick fading — the robot powering off). Drops feel huge BY CONTRAST with the breakdown.
setcps(0.5125)   // ~123 BPM four-on-the-floor French house

// ===== DRUMS — punchy four-on-the-floor, crisp disco snap, shuffling hats =======================
// THE house kick: four-on-the-floor 909, tight and punchy with a touch of warmth (lpf), not distorted.
const kick = s("bd*4").bank("RolandTR909").lpf(4200).shape(0.22).attack(0.001).release(0.14).gain(0.96)
const kickSoft = s("bd*4").bank("RolandTR909").lpf(2600).shape(0.12).attack(0.001).release(0.13).gain(0.78)
// Crisp disco clap on the backbeat (2 & 4) — the snap that makes it dance, light reverb for air.
const clap = s("~ cp ~ cp").bank("RolandTR909").hpf(650).shape(0.12).room(0.16).gain(0.6).release(0.12)
// Shuffling 16th closed hats — swing via the gain accents (loud-soft) so they shuffle, not march.
const hats = s("hh*16").bank("RolandTR909").hpf(8500).gain("0.24 0.08 0.16 0.1 0.22 0.08 0.15 0.11 0.24 0.08 0.16 0.1 0.2 0.08 0.15 0.13").release(0.035)
const hatsLite = s("hh*8").bank("RolandTR909").hpf(8500).gain("0.18 0.08 0.14 0.09 0.18 0.08 0.13 0.1").release(0.035)
// Offbeat open-hat churn — the classic house "tss" on the upbeats, the engine of the groove.
const ophat = s("~ oh ~ oh ~ oh ~ oh").bank("RolandTR909").hpf(7000).gain(0.2).release(0.11)
// Light percussion sparkle — a shaker on offbeats for extra shuffle in the drops.
const shake = s("~ shaker ~ shaker").hpf(6000).gain(0.16).release(0.08)

// ===== NOISE RISER — filtered white-noise sweep up into each drop ===============================
const riser = s("noise").struct("x").lpf(sine.range(400, 8000).slow(1)).hpf(250).gain(0.24).attack(0.45).release(0.1)
const riserBig = s("noise").struct("x").lpf(saw.range(500, 12000)).hpf(250).gain(0.34).attack(0.5).release(0.06)

// ===== THE BASS — fat funky bassline, locked to the kick ========================================
// Roots a-d-f-e (Am9 Dm9 Fmaj9 E7#9), one root per cycle. Funky syncopated 16th pattern — the bounce.
const bassRoot = note("<a1 d2 f1 e2>")
const bassFunk = (voice) => voice.struct("x ~ x x ~ x ~ x x ~ x ~ x ~ x x").s("square")
  .lpf(560).resonance(7).shape(0.32).attack(0.002).release(0.07).gain(0.5)
// Saw detune layer a hair sharp for the fat width + bite, panned slightly.
const bassDetune = (voice) => voice.add(note(0.07)).struct("x ~ x x ~ x ~ x x ~ x ~ x ~ x x").s("sawtooth")
  .lpf(720).resonance(6).shape(0.28).attack(0.002).release(0.06).gain(0.22).pan(0.12)
// Clean sub so the low end survives in intro/breakdown when the funk bass is filtered/absent.
const bassSub = (voice) => voice.struct("x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~").s("sine").lpf(110).gain(0.5)

// ===== THE CHORD RIFF — the chopped disco loop, the filter-swept CORE ===========================
// Extended 9th voicings, chopped into syncopated stabs. ONE chord per cycle, cycling Am9 Dm9 Fmaj9 E7#9.
// The E7#9 = e,g#,d,g (the altered dominant rub: g# leading-tone AND the g natural #9) — the risk + release.
const riffChords = note("<[a3,c4,e4,g4,b4] [d3,f3,a3,c4,e4] [f3,a3,c4,e4,g4] [e3,g#3,b3,d4,g4]>")
// Chop rhythm: syncopated disco stabs (the looping riff figure). Held-note rhythm via .struct, literal.
const riffStruct = "x ~ x x ~ x ~ ~ x ~ x ~ ~ x x ~"
// THE filter sweep — slow sine opening/closing the low-pass over the riff = the signature French-house motion.
const riffMain = (chord) => chord.struct(riffStruct).s("sawtooth")
  .lpf(sine.range(240, 3800).slow(8)).resonance(11).shape(0.3)
  .attack(0.004).decay(0.16).sustain(0.12).release(0.1).gain(0.34).room(0.14)
// Intro/build versions — filter held LOW (muffled, trapped) then opening, the rising tension.
const riffMuffled = (chord, cut) => chord.struct(riffStruct).s("sawtooth")
  .lpf(cut).resonance(9).shape(0.26).attack(0.004).decay(0.16).sustain(0.1).release(0.1).gain(0.26).room(0.12)
// Drop version — filter wide open + resonant, fuller chop, the euphoric peak. Sweep still breathes on top.
const riffOpen = (chord) => chord.struct("x ~ x x x x ~ x x ~ x x x x x ~").s("sawtooth")
  .lpf(sine.range(900, 5200).slow(8)).resonance(13).shape(0.34)
  .attack(0.003).decay(0.14).sustain(0.14).release(0.1).gain(0.36).room(0.16)
// Breakdown version — drenched, half-lit, fewer stabs, big reverb + delay (the room empties).
const riffDrenched = (chord) => chord.struct("x ~ ~ ~ x ~ ~ ~ x ~ ~ x ~ ~ ~ ~").s("sawtooth")
  .lpf(sine.range(300, 1600).slow(8)).resonance(10).shape(0.24)
  .attack(0.02).decay(0.3).sustain(0.2).release(0.4).gain(0.32).room(0.5).delay(0.3).delaytime(0.375).delayfeedback(0.4)

// ===== THE LEAD — filtered detuned saw = the talkbox/vocoder-ish robot voice (NO vocal sample) ===
// The rising 3-note motif, transposed per chord to follow the harmony, voweled by a tight bandpass-ish
// hpf+lpf pair + light vibrato for the "talking robot" flavor. One phrase per cycle (Am Dm F E7#9).
const leadVoice = (phrase) => note(m(phrase)).s("sawtooth")
  .hpf(420).lpf(2400).resonance(12).shape(0.22).vib(5).vmod(0.05)
  .attack(0.01).decay(0.18).sustain(0.18).release(0.14).gain(0.32).room(0.22).pan(-0.06)
// motifA (DROP1) — states the rising answer, following each chord: e->g->a / f->a->d / a->c->e / g#->b->e.
const leadPhraseA = '<[e5 ~ g5 a5 ~ ~ ~ ~] [f5 ~ a5 d6 ~ ~ ~ ~] [a5 ~ c6 e6 ~ ~ ~ ~] [g#5 ~ b5 e6 ~ g6 ~ ~]>'
const leadA = leadVoice(leadPhraseA)
// motifB (DROP2) — DEVELOPED: octave leap at the peak, the #9 (g6) sings out over the E7#9, longer answer.
const leadPhraseB = '<[e5 ~ g5 a5 ~ e6 ~ a5] [f5 ~ a5 d6 ~ f6 ~ d6] [a5 ~ c6 e6 ~ a6 ~ e6] [g#5 ~ b5 e6 g6 ~ e6 g6]>'
const leadB = leadVoice(leadPhraseB).lpf(3200).gain(0.34).pan(0.04)
// breakdown lead echo — a lone, drenched fragment of the head of the motif (the robot half-asleep).
const leadEcho = note("<[e5 ~ ~ ~ g5 ~ ~ ~] [d6 ~ ~ ~ ~ ~ ~ ~] [a5 ~ ~ ~ c6 ~ ~ ~] [e6 ~ ~ ~ ~ ~ ~ ~]>").s("sawtooth")
  .hpf(420).lpf(1500).resonance(11).shape(0.2).vib(5).vmod(0.05)
  .attack(0.02).decay(0.3).sustain(0.1).release(0.4).gain(0.3).room(0.5).delay(0.32).delaytime(0.375).delayfeedback(0.46)

// ===== SECTIONS — every section is the SAME riff at a different FILTER state + density ===========
// intro — kick + sub + the riff trapped behind a LOW filter (closed down), a whisper of hats.
const intro = stack(kickSoft, bassSub(bassRoot), riffMuffled(riffChords, 360).gain(0.2), hatsLite.gain(0.1))
const introB = stack(kick.gain(0.86), bassSub(bassRoot), riffMuffled(riffChords, 620).gain(0.24), hatsLite.gain(0.14), clap.gain(0.4))

// build — the filter OPENS over the riff, riser rises, hats + offbeat open-hat enter, tension mounting.
const build = stack(kick, bassSub(bassRoot), bassFunk(bassRoot).gain(0.3), riffMuffled(riffChords, 1100).gain(0.28), riser, hats.gain(0.16), ophat.gain(0.14))
const buildB = stack(kick, bassSub(bassRoot), bassFunk(bassRoot).gain(0.4), riffMuffled(riffChords, 1900).gain(0.3), riserBig, hats.gain(0.2), ophat.gain(0.18), clap.gain(0.5))

// DROP1 — FILTER WIDE OPEN: full funky groove, the lead states the motif, the euphoria lands.
const drop1 = stack(kick, clap, hats, ophat, bassFunk(bassRoot), bassDetune(bassRoot), bassSub(bassRoot), riffOpen(riffChords), leadA)
const drop1b = stack(kick, clap, hats, ophat, shake, bassFunk(bassRoot), bassDetune(bassRoot), riffOpen(riffChords), leadA, riser.gain(0.12))

// breakdown — strip to drenched chords + sub + a lone lead echo, filter half-lit; the room empties.
const breakdown = stack(kickSoft.gain(0.66), bassSub(bassRoot), riffDrenched(riffChords), leadEcho, clap.gain(0.3).room(0.4))
const breakdownB = stack(kick.gain(0.82), bassSub(bassRoot), bassFunk(bassRoot).gain(0.3), riffDrenched(riffChords).gain(0.34), leadEcho.gain(0.34), clap.gain(0.42))

// build2 — re-tension, bigger riser, riff climbing back open, leads into the BIGGER drop.
const build2 = stack(kick, bassSub(bassRoot), bassFunk(bassRoot).gain(0.42), riffMuffled(riffChords, 2200).gain(0.32), riserBig.gain(0.38), hats.gain(0.22), ophat.gain(0.18), clap.gain(0.5))

// DROP2 — BIGGER: lead leaps an octave, the #9 sings, claps + open hats + shaker max, the peak.
const drop2 = stack(kick, clap, hats, ophat, shake, bassFunk(bassRoot), bassDetune(bassRoot), bassSub(bassRoot), riffOpen(riffChords), leadB)
const drop2b = stack(kick, clap, hats, ophat, shake, bassFunk(bassRoot), bassDetune(bassRoot), riffOpen(riffChords).gain(0.4), leadB, riserBig.gain(0.14))

// outro — the filter CLOSES back down, kick fading, the robot powering off.
const outro = stack(kickSoft.gain(0.6), bassSub(bassRoot).gain(0.42), riffMuffled(riffChords, 700).gain(0.24), hatsLite.gain(0.1))
const outroB = stack(kickSoft.gain(0.42), bassSub(bassRoot).gain(0.32), riffMuffled(riffChords, 380).gain(0.2))

// ===== ARRANGEMENT — 78 cycles ==================================================================
slowcat(
  intro, intro, introB, introB, introB, introB,                              // 6  kick + sub, riff closed behind the filter
  build, build, build, buildB, buildB, buildB,                               // 6  filter opening, riser, hats in (tension)
  drop1, drop1b, drop1, drop1b, drop1, drop1b, drop1, drop1b,                // 8  DROP 1 (filter wide open, lead states motif)
  drop1, drop1b, drop1, drop1b,                                              // 4  drop1 sustained, the groove rides
  breakdown, breakdown, breakdownB, breakdownB, breakdown, breakdownB,       // 6  breakdown (drenched chords, lone lead echo)
  build2, build2, build2, build2, build2, build2, build2, build2,           // 8  build (bigger riser, re-tension)
  drop2, drop2b, drop2, drop2b, drop2, drop2b, drop2, drop2b,                // 8  BIGGER DROP (octave lead, #9 sings)
  drop2, drop2b, drop2, drop2b, drop2, drop2b, drop2, drop2b,                // 8  bigger drop sustained, the peak rides
  drop2, drop2b, drop2, drop2b,                                              // 4  peak rides on (max dancefloor)
  breakdownB, breakdownB, breakdown, breakdown,                             // 4  short breakdown release
  drop1, drop1b, drop1, drop1b, drop1, drop1b, drop1, drop1b,                // 8  drop returns (motif restated, the comedown groove)
  drop1, drop1b, drop1, drop1b,                                             // 4  groove rides out
  outro, outro, outroB, outroB                                              // 4  filter closing down, the robot powers off (78 total)
)
`
