export const title = 'Heaven Is a Sandbox'
export const genre = 'Beach Boys "SMiLE" — Brian Wilson pocket-symphony / baroque-pop suite (~104 BPM)'
export const mood = 'sunny-but-melancholy Americana; lush stacked vocal-harmony pads, sleigh-bell & glockenspiel sparkle, modular suite-like shifts, childlike wonder with a wistful undertow'
export const cycles = 68
// exported from the radio DB (2026-06-30); restore with: bun scripts/post-song.mjs <this file>
export const code = `// Genre: Beach Boys "SMiLE" — Brian Wilson's "teenage symphony to God" (~104 BPM, setcps 0.433).
// A modular pocket-symphony stitched from short "feels": lush stacked vocal-harmony PADS (saw+triangle+organ),
// GLOCKENSPIEL / SLEIGH-BELL / vibraphone SPARKLE, warm rounded sine/triangle bass, soft baroque-pop drums with
// shaker + tambourine + a symphonic timpani thump. Sunny major-key warmth shadowed by a melancholy pull.
// Sounds: vibraphone+tubularbells+marimba (the glockenspiel/sleigh-bell sparkle), harp/folkharp (dreamy arps),
//         sawtooth+triangle (the stacked harmony pad — the "vocal" wall), organ_full (chapel Americana warmth),
//         sine/triangle bass, bd/sd/rim + shaker/tambourine + timpani.
// Harmonic JOURNEY (the whole point — chromatic mediants & borrowed chords, the SMiLE signature):
//   HOME key G MAJOR. Verse leans on the CHROMATIC MEDIANT Eb (bVI) and the borrowed iv minor (Cm) for the ache.
//   CHORUS opens bright and lifts through B major (III, another chromatic mediant) before falling home.
//   BRIDGE modulates by chromatic mediant DOWN to Eb MAJOR — hushed, "child is father of the man" wonder.
//   FINALE modulates UP to A MAJOR for the radiant payoff, then a coda settles home to G with a plagal Amen glow.
//   Verse:   G - Em7 - Cm6 - G/B - Eb(maj7) - C - D - G   (the borrowed Cm6 & the Eb chromatic mediant = the wistful turns)
//   Chorus:  G - B(/D#) - Em - C - A7 - D - G ... C - D - G  (B major III lift; A7 = V/V secondary dominant)
//   Bridge:  Eb - Cm - Ab - Bb - Gm - Ab - Bb   (Eb-major room, far from home, dreamlike)
//   Finale:  A - F#m - D - E - A - D - E - A     (key up a tone, bright + triumphant)
//   Coda:    G - C - G  (plagal IV-I "Amen" cadence, sun setting)
// Motif: an open rising BELL figure  d5 g5 b5 d6  (5th - root - 3rd - octave; a leap then a glint). It develops:
//   intro states it bare on glockenspiel; verse harmonizes it a third below; chorus answers it inverted & rising;
//   bridge AUGMENTS it slow & reharmonized in Eb; finale TRANSPOSES it up a tone (e-a-c#-e) at the climax;
//   coda fragments it to a single fading g.
// Structure: slowcat SUITE (Approach 1). Per-cycle segment builders pull ONE LITERAL chord per entry from a
//   progression array (chords ALWAYS advance — never a frozen <...> repeated across slowcat). Movements contrast
//   by density, register, key & texture: intro -> verse -> chorus -> verse2 -> bridge (Eb) -> finale (A) -> coda (G).
setcps(0.433)

// ===== DRUMS — soft baroque-pop kit: gentle kick, brushy snare/rim, shaker, sleigh-bell hats, timpani thump ====
const kickSoft  = s("bd ~ ~ bd ~ ~ bd ~").bank("RolandTR808").lpf(1600).attack(0.004).release(0.18).gain(0.62)
const kickFour  = s("bd ~ ~ ~ bd ~ ~ ~").bank("RolandTR808").lpf(1800).attack(0.004).release(0.2).gain(0.7)
const rimTick   = s("~ rim ~ ~ ~ rim ~ ~").bank("RolandTR808").hpf(900).gain(0.3).release(0.08)
const snareSoft = s("~ ~ ~ ~ sd ~ ~ ~").bank("RolandTR808").hpf(500).attack(0.002).release(0.13).gain(0.3).room(0.25)
const shake     = s("shaker*8").gain("0.16 0.1 0.13 0.1 0.16 0.1 0.13 0.11").release(0.05).pan(0.12)
const sleigh    = s("hh*8").bank("RolandTR808").hpf(7000).gain("0.14 0.09 0.12 0.09 0.16 0.09 0.12 0.1").release(0.04).pan(-0.1) // sleigh-bell shimmer
const tamb      = s("~ ~ tambourine ~ ~ ~ tambourine ~").hpf(4000).gain(0.18).release(0.1)
const timp      = s("timpani ~ ~ ~ ~ ~ ~ ~").lpf(500).gain(0.42).release(0.4)
const crashSoft = s("cr ~ ~ ~ ~ ~ ~ ~").bank("RolandTR808").hpf(800).gain(0.2).release(0.6).room(0.4)

const drumsVerse  = stack(kickSoft, rimTick, shake.gain(0.5), sleigh.gain(0.6))
const drumsChorus = stack(kickFour, snareSoft, shake, sleigh, tamb)
const drumsFinale = stack(kickFour, snareSoft, shake, sleigh, tamb, timp.gain(0.3))

// ===== PADS — the stacked VOCAL-HARMONY wall (saw + triangle + organ, soft attack, big room) ===================
// Three detuned-ish layers stacked = the "wall of voices". Pass a literal chord straight in (never interpolated).
const padSaw = (chord) => note(m(chord)).s("sawtooth").lpf(1300).resonance(2).attack(0.28).release(0.8).room(0.55).gain(0.15)
const padTri = (chord) => note(m(chord)).s("triangle").lpf(800).attack(0.4).release(1.0).room(0.6).gain(0.18)
const padOrg = (chord) => note(m(chord)).s("organ_full").lpf(1700).attack(0.18).release(0.6).room(0.45).gain(0.1)
const choir  = (chord) => stack(padSaw(chord), padTri(chord), padOrg(chord))

// ===== BELL / SPARKLE — glockenspiel(vibraphone) + tubular bells + marimba, the SMiLE glint ====================
const glock   = (phrase) => note(m(phrase)).s("vibraphone").gain(0.2).room(0.5).delay(0.2).delaytime(0.1875).delayfeedback(0.25)
const bells   = (phrase) => note(m(phrase)).s("tubularbells").gain(0.16).room(0.6).attack(0.001).release(0.5)
const mallet  = (phrase) => note(m(phrase)).s("marimba").gain(0.34).room(0.3).pan(0.1)
const harpArp = (phrase) => note(m(phrase)).s("harp").gain(0.26).room(0.5).delay(0.18).delaytime(0.125).delayfeedback(0.2)
const folk    = (phrase) => note(m(phrase)).s("folkharp").gain(0.28).room(0.45)

// ===== BASS — warm rounded foundation (sine sub + soft triangle), one literal root per cycle ===================
const bassSub = (root) => note(m(root)).struct("x ~ ~ x ~ ~ x ~").s("sine").lpf(140).attack(0.01).release(0.2).gain(0.5)
const bassTri = (root) => note(m(root)).struct("x ~ x ~ x ~ x ~").s("triangle").lpf(420).attack(0.006).release(0.16).gain(0.24)
const bassWalk = (phrase) => note(m(phrase)).s("triangle").lpf(500).attack(0.006).release(0.16).gain(0.26) // moving bass line

// =====================================================================================================
// PROGRESSIONS — arrays; each slowcat entry pulls step i so the chords ADVANCE (never a frozen <...>).
// =====================================================================================================
// VERSE (G major, the wistful turns: borrowed Cm6 (iv) and Eb maj7 (bVI chromatic mediant))
const VERSE_CH = ['g3,b3,d4', 'e3,g3,b3,d4', 'c3,eb3,g3,a3', 'd3,g3,b3',
                  'eb3,g3,bb3,d4', 'c3,e3,g3', 'd3,f#3,a3,c4', 'g3,b3,d4,a4']
const VERSE_RT = ['g1', 'e1', 'c1', 'b1', 'eb1', 'c1', 'd1', 'g1']
// CHORUS (G major; B-major III chromatic-mediant lift + A7 = V/V secondary dominant pulling to D)
const CHORUS_CH = ['g3,b3,d4,a4', 'b2,d#3,f#3', 'e3,g3,b3', 'c3,e3,g3',
                   'a2,c#3,e3,g3', 'd3,f#3,a3', 'c3,e3,g3', 'd3,f#3,a3,c4']
const CHORUS_RT = ['g1', 'b1', 'e1', 'c1', 'a1', 'd1', 'c1', 'd1']
// BRIDGE (modulate by chromatic mediant DOWN to Eb major — dreamlike, far from home)
const BRIDGE_CH = ['eb3,g3,bb3', 'c3,eb3,g3', 'ab2,c3,eb3', 'bb2,d3,f3',
                   'g2,bb2,d3', 'ab2,c3,eb3,g3', 'bb2,d3,f3,ab3', 'eb3,g3,bb3,d4']
const BRIDGE_RT = ['eb1', 'c1', 'ab0', 'bb0', 'g1', 'ab0', 'bb0', 'eb1']
// FINALE (key UP a tone to A major — radiant payoff; E = V resolving to A)
const FINALE_CH = ['a3,c#4,e4', 'f#3,a3,c#4', 'd3,f#3,a3', 'e3,g#3,b3',
                   'a3,c#4,e4', 'd3,f#3,a3', 'e3,g#3,b3,d4', 'a3,c#4,e4,a4']
const FINALE_RT = ['a1', 'f#1', 'd1', 'e1', 'a1', 'd1', 'e1', 'a1']
// CODA (home to G major; plagal IV-I "Amen" glow)
const CODA_CH = ['g3,b3,d4', 'c3,e3,g3', 'g3,b3,d4', 'c3,e3,g3,d4', 'g3,b3,d4,g4', 'g3,b3,d4,g4']
const CODA_RT = ['g1', 'c1', 'g1', 'c1', 'g1', 'g1']

// MOTIF phrases (the open rising bell figure d5-g5-b5-d6 and its developments) ===========
const motifIntro  = '~ d5 ~ g5 ~ b5 ~ d6 ~ ~ b5 ~ g5 ~ ~ ~'            // stated bare
const motifVerse  = 'd5 ~ g5 b5 ~ d6 ~ b5 ~ g5 ~ ~ a5 ~ g5 ~'          // verse statement
const motifVerseH = 'b4 ~ e5 g5 ~ b5 ~ g5 ~ e5 ~ ~ f#5 ~ e5 ~'         // harmonized a third below
const motifChorus = 'g5 ~ d6 ~ b5 ~ g5 ~ a5 ~ b5 d6 ~ b5 ~ a5'         // inverted/rising answer
const motifBridge = '~ eb5 ~ ~ g5 ~ ~ bb5 ~ ~ ~ ab5 ~ ~ g5 ~'          // AUGMENTED, slow, in Eb
const motifFinale = 'e5 ~ a5 c#6 ~ e6 ~ c#6 ~ a5 ~ ~ b5 ~ a5 ~'        // TRANSPOSED up a tone, A major
const motifCoda   = '~ ~ d5 ~ g5 ~ ~ ~ ~ ~ g5 ~ ~ ~ ~ ~'               // fragmented, fading

// Arp phrases for harp (dreamy SMiLE cascades)
const harpVerse   = 'g4 b4 d5 g5 b4 d5 g5 b5 c5 eb5 g5 c6 d5 g5 b5 d6'
const harpChorus  = 'g4 d5 b5 g5 d#5 f#5 b5 f#5 e5 g5 b5 e6 a5 c#6 e6 a6'
const harpBridge  = 'eb4 g4 bb4 eb5 c5 eb5 g5 c6 ab4 c5 eb5 ab5 bb4 d5 f5 bb5'
const harpFinale  = 'a4 c#5 e5 a5 f#5 a5 c#6 a5 d5 f#5 a5 d6 e5 g#5 b5 e6'

// =====================================================================================================
// SECTION BUILDERS — each takes cycle index i, pulls the literal chord/root/motif for that step.
// =====================================================================================================
const introSeg = (i, ...extra) => stack(
  choir(VERSE_CH[i % 8]).gain(0.7),
  bassSub(VERSE_RT[i % 8]).gain(0.4),
  ...extra
)
const verseSeg = (i, ...extra) => stack(
  choir(VERSE_CH[i % 8]),
  bassSub(VERSE_RT[i % 8]),
  bassTri(VERSE_RT[i % 8]),
  drumsVerse,
  ...extra
)
const chorusSeg = (i, ...extra) => stack(
  choir(CHORUS_CH[i % 8]),
  bassSub(CHORUS_RT[i % 8]),
  bassTri(CHORUS_RT[i % 8]),
  drumsChorus,
  ...extra
)
const bridgeSeg = (i, ...extra) => stack(
  choir(BRIDGE_CH[i % 8]).gain(0.95),
  bassSub(BRIDGE_RT[i % 8]).gain(0.42),
  ...extra
)
const finaleSeg = (i, ...extra) => stack(
  choir(FINALE_CH[i % 8]),
  bassSub(FINALE_RT[i % 8]),
  bassTri(FINALE_RT[i % 8]),
  drumsFinale,
  ...extra
)
const codaSeg = (i, ...extra) => stack(
  choir(CODA_CH[i % 6]).gain(0.85),
  bassSub(CODA_RT[i % 6]).gain(0.4),
  ...extra
)

// =====================================================================================================
// ARRANGEMENT — 68-cycle pocket-symphony suite. Chords advance because each entry IS the next chord.
// =====================================================================================================
slowcat(
  // INTRO (6) — G major emerging: choir bloom + bare glockenspiel motif + sub. Distant, dawning.
  ...Array.from({ length: 6 }, (_, k) => introSeg(k,
      glock(motifIntro).gain(k < 2 ? 0.12 : 0.2),
      k >= 3 ? bells(motifIntro).gain(0.12) : silence,
      k >= 4 ? shake.gain(0.3) : silence)),

  // VERSE 1 (8) — wistful turns (Cm6, Eb chromatic mediant). Motif + its harmonized third, harp cascade, marimba.
  ...Array.from({ length: 8 }, (_, k) => verseSeg(k,
      glock(motifVerse),
      bells(motifVerseH).gain(0.1),
      harpArp(harpVerse).gain(0.18),
      mallet(motifVerse).gain(0.16))),

  // CHORUS 1 (8) — bright lift through B major (III) and A7 (V/V). Inverted rising answer, fuller drums, crash on 1.
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k,
      k % 8 === 0 ? crashSoft : silence,
      glock(motifChorus),
      harpArp(harpChorus).gain(0.22),
      mallet(motifChorus).gain(0.18))),

  // VERSE 2 (8) — return home but warmer; add folkharp, keep the ache (Cm6/Eb). Slight density bump.
  ...Array.from({ length: 8 }, (_, k) => verseSeg(k,
      glock(motifVerse),
      bells(motifVerseH).gain(0.12),
      harpArp(harpVerse).gain(0.2),
      folk(harpVerse).gain(0.14),
      mallet(motifVerse).gain(0.18))),

  // BRIDGE (8) — chromatic-mediant slip DOWN to Eb major. Drums fall away; hushed, dreamlike wonder.
  //   Motif AUGMENTED & reharmonized. Big reverb, bells + harp cascading, no kick — pure light & shade.
  ...Array.from({ length: 8 }, (_, k) => bridgeSeg(k,
      bells(motifBridge).gain(0.2),
      harpArp(harpBridge).gain(0.22),
      k >= 4 ? glock(motifBridge).gain(0.16) : silence,
      k >= 6 ? shake.gain(0.28) : silence)),

  // RE-LIFT (4) — re-ignite into the new key: drums creep back, marimba pulse, sleigh shimmer rises.
  ...Array.from({ length: 4 }, (_, k) => chorusSeg(k + 4,
      glock(motifChorus).gain(0.18),
      mallet(harpChorus).gain(0.16),
      sleigh.gain(0.5))),

  // FINALE (16) — KEY UP A TONE to A major: the radiant payoff. Motif transposed up, full bell-glock-harp wall,
  //   timpani thump, crash accents. The "teenage symphony to God" peak — sunny and overflowing.
  ...Array.from({ length: 16 }, (_, k) => finaleSeg(k,
      k % 8 === 0 ? crashSoft : silence,
      glock(motifFinale),
      bells(motifFinale).gain(0.12),
      harpArp(harpFinale).gain(0.24),
      mallet(motifFinale).gain(0.2),
      k >= 8 ? folk(harpFinale).gain(0.14) : silence)),

  // CODA (10) — settle home to G major, plagal IV-I "Amen" glow. Thin to choir + bell + sub, motif fragments
  //   to a single fading g. The sun setting on the sandbox. Subtraction = taste.
  ...Array.from({ length: 10 }, (_, k) => codaSeg(k,
      bells(motifCoda).gain(k < 6 ? 0.16 : 0.1),
      k < 5 ? glock(motifCoda).gain(0.14) : silence,
      k < 3 ? harpArp(harpVerse).slow(2).gain(0.12) : silence,
      k < 4 ? shake.gain(0.22) : silence))
)
`
