// Genre: Experimental / glitch hip-hop (JPEGMAFIA-style) / 2020s / abrasive, confrontational, jarring beat-switches with sudden beauty
// Sounds: distorted 808 kick (bd/RolandTR808), skittering trap hats (hh/oh), crushed snare+clap (sd/cp),
//         chopped soul rhodes (motif), gospel organ_full (beauty), filtered+crushed noise (glitch texture)
export const title = 'NEAPOLITAN STATIC'
export const genre = 'Experimental / Glitch Hip-Hop (JPEGMAFIA-style)'
export const mood  = 'Abrasive, confrontational, whiplash beat-switches pierced by sudden beauty. The soul chop never plays the same way twice: it gets re-sliced, pitched, fragmented and crushed as the Cm harmony churns beneath it, then a chromatic-mediant lurch into naked Ab gospel, a half-step Neapolitan slam, and home.'
export const cycles = 76
// exported from the radio DB (2026-07-03); restore with: bun scripts/post-song.mjs <this file>
export const code = `// JPEGMAFIA-style glitch hip-hop — Cm tonal center, chromatic-mediant + Neapolitan lurches.
// Chaos as authored spice: hard slowcat cuts, sudden silence drops, the soul chop re-mangled per cycle.
setcps(0.5)

// ---- Cm world: Cm9 -> Abmaj7 -> Fm7 -> G7#9 (bass locked to roots) ----
const VCH   = ['c3,eb3,g3,bb3,d4', 'ab2,c3,eb3,g3', 'f2,ab2,c3,eb3', 'g2,b2,d3,f3,bb3']
const VBASS = ['c1 ~ ~ c1 ~ eb1 ~ ~', 'ab1 ~ ~ ab1 ~ c2 ~ ~', 'f1 ~ ~ f1 ~ ab1 ~ ~', 'g1 ~ ~ g1 ~ b1 ~ ~']
// chopped soul motif (falling 3rd then leap), re-sliced per chord — verse A vs verse B mangles
const VCHOP  = ['g4 eb4 ~ [bb4 bb4]', '[g4 g4] eb4 ~ c5', 'ab4 f4 ~ [c5 c5]', 'g4 f4 ~ [b4 d5]']
const VCHOPB = ['~ [g4 g4] eb4 [bb4 d5]', 'c5 ~ [g4 eb4] ab4', '[ab4 ab4] ~ f4 [eb4 c5]', 'f4 [g4 g4] ~ [b4 b4]']
// pitched-up re-chops for beat-switch 1 (weightless, digital)
const S1CHOP = ['[c5 g4]*2 [bb4 f5]', '[c5 g4] [bb4 f5] [c5 g4] g5', '[eb5 bb4]*2 [c5 g5]', '[f5 c5] ~ [bb4 f5] [g5 eb5]']
// beauty interlude: Abmaj9 -> Fm9 -> Dbmaj7 -> Eb7 -> Abmaj9 -> Ebmaj7 (bVI world)
const BCH   = ['ab2,c3,eb3,g3,bb3', 'f2,ab2,c3,eb3,g3', 'db3,f3,ab3,c4', 'eb3,g3,bb3,db4', 'ab2,c3,eb3,g3,bb3', 'eb2,g2,bb2,d3']
const BROOT = ['ab1', 'f1', 'db1', 'eb1', 'ab1', 'eb1']
const BMOT  = ['g4 eb4 ~ bb4', 'ab4 f4 ~ c5', 'ab4 f4 ~ db5', 'g4 ~ bb4 ~', 'g4 eb4 ~ bb4', 'g4 ~ ~ bb4']
// Neapolitan slam shrieks (Db world) + bass with half-step c-lurch on phrase tails
const S2SHRIEK = ['[f5 db5]*2 ~ ab5', 'ab5 [f5 db5] ~ [c6 ab5]', '[db5 db5] f5 ~ ab5', '[f5 db5]*2 [ab5 ab5] c6']
const S2BASS   = ['db1 ~ ~ db1 ~ ~ db1 ~', 'db1 ~ ~ db1 ~ [c1 db1] ~ ~']
// density ramps
const HATP = ['hh*8', 'hh*8', 'hh*12', 'hh*16']
const STAB = ['x ~ ~ ~', 'x ~ ~ x', 'x ~ x ~', '[x x] ~ x ~']
const FRAG = ['~ ~ ~ [bb4 bb4 bb4 bb4]', '~ [g4 g4] ~ [bb4 ~ bb4 ~]']

// ---- kit ----
const kick = (g, d) => s("bd:3 ~ ~ bd:3 ~ bd:3 ~ ~").bank("RolandTR808").gain(g).shape(0.6).distort(d).lpf(4000)
const subOf = (i) => note(m(VBASS[i % 4])).s("square").lpf(220).shape(0.5).gain(0.55)
const hatsOf = (k) => s(m(HATP[Math.min(3, Math.floor(k / 2))])).bank("RolandTR808").gain("0.32 0.18 0.26 0.18").pan(0.15)
const hatsFast = s("hh*16").bank("RolandTR808").gain("0.3 0.12 0.2 0.12").sometimesBy(0.25, x => x.fast(2)).hpf(900).pan("-0.2 0.2")
const openhat  = s("~ ~ oh ~").bank("RolandTR808").gain(0.3)
const snare    = s("~ cp ~ [sd:2 ~ sd:2 ~]").bank("RolandTR808").gain(0.6).crush(6).shape(0.3)
const roll     = s("~ cp sd:2*4 sd:2*8").bank("RolandTR808").gain(0.55).crush(5).shape(0.4)
const grit  = s("noise*4").gain("0.09 0.04 0.07 0.05").lpf(perlin.slow(3).range(500, 3000)).crush(7).hpf(300)
const riser = s("noise").gain(0.16).lpf(sine.range(400, 6000).slow(4)).crush(6).room(0.3)

// ===================== SECTIONS (per-cycle segment builders) =====================

// intro: glitch build — kick thickens, chop ghosts in on the last bar
const introSeg = (k) => stack(
  s(k < 3 ? "bd:3 ~ ~ ~ ~ ~ bd:3 ~" : "bd:3 ~ ~ bd:3 ~ ~ bd:3 ~").bank("RolandTR808").gain(0.8).shape(0.5).distort(0.3),
  riser.gain(0.1 + 0.03 * k),
  grit,
  k === 3 ? note("g4 eb4 ~ ~").s("rhodes").gain(0.3).crush(5).shape(0.4).lpf(2200).room(0.3) : silence
)

// verse A: abrasive Cm beat — chords churn, chop re-sliced per bar, hats + distortion creep up
const verseASeg = (k) => stack(
  kick(0.95, 0.38 + 0.02 * k),
  subOf(k),
  hatsOf(k),
  k === 7 ? roll : snare,
  note(m(VCHOP[k % 4])).s("rhodes").gain(0.5).crush(5).shape(0.45).lpf(2600).room(0.15),
  grit.gain(0.06)
)

// hook: fuller + harder — chord stab pattern thickens across the section
const hookSeg = (k) => stack(
  kick(1.0, 0.42 + 0.015 * k),
  subOf(k).gain(0.6),
  hatsOf(k), openhat,
  k === 7 ? roll : snare,
  note(m(VCH[k % 4])).s("rhodes").struct(m(STAB[Math.min(3, Math.floor(k / 2))])).gain(0.34).crush(5).shape(0.35).room(0.2),
  note(m(VCHOP[k % 4])).s("rhodes").gain(0.46).crush(5).shape(0.45).lpf(2600)
)

// BEAT-SWITCH 1: pitched-up chop, no sub (weightless) — chop re-sliced per bar; last bar cuts to chop alone
const switch1Seg = (k) => k === 7
  ? stack(
      note(m(S1CHOP[3])).s("rhodes").gain(0.46).crush(4).shape(0.4).pan("0.2 -0.3 0.4 -0.2").lpf(3200).delay(0.25).delaytime(0.1875),
      grit.gain(0.07)
    )
  : stack(
      s(k % 2 === 0 ? "bd:3 ~ bd:3 ~ ~ bd:3 ~ bd:3" : "bd:3 ~ bd:3 ~ ~ [bd:3 bd:3] ~ bd:3").bank("RolandTR808").gain(0.9).shape(0.65).distort(0.5),
      hatsFast.hpf(900 - 40 * k),
      s("~ cp ~ ~").bank("RolandTR808").gain(0.55).crush(6),
      note(m(S1CHOP[k % 4])).s("rhodes").gain(0.42).crush(4).shape(0.4).pan("0.2 -0.3 0.4 -0.2").lpf(3200).delay(0.2).delaytime(0.1875),
      grit.gain(0.08)
    )

// BEAUTY INTERLUDE: chromatic-mediant lurch to the Ab world — moving gospel changes, clean motif, NO drums
const beautySeg = (k) => stack(
  note(m(BCH[k % 6])).s("organ_full").gain(0.3).attack(0.08).release(1.2).room(0.7).lpf(2200),
  note(m(BROOT[k % 6])).s("sine").struct("x ~ ~ ~").gain(0.4).lpf(150).release(0.8),
  note(m(BMOT[k % 6])).s("rhodes").gain(0.3).room(0.6).lpf(2400).slow(2),
  s("noise").gain(0.04).lpf(1200).room(0.5)
)

// DROP: near-silence — motif fragment stuttering into space, everything else gone
const dropSeg = (k) => stack(
  note(m(FRAG[k % 2])).s("rhodes").gain(0.4).crush(4).shape(0.5).room(0.3),
  s("noise").gain(0.05).lpf(800).room(0.6)
)

// verse B: Cm changes return, MORE distorted, chop re-mangled again, real roll into hook 2
const verseBSeg = (k) => stack(
  kick(0.95, 0.5 + 0.02 * k).shape(0.7),
  subOf(k),
  hatsOf(k + 2),
  k === 7 ? roll.gain(0.6).crush(4) : snare,
  note(m(VCHOPB[k % 4])).s("rhodes").gain(0.5).crush(4).shape(0.55).lpf(2600).room(0.15),
  grit.gain(0.08)
)

// hook 2: peak energy of the Cm world — stabs on every other beat, rolls stack on the tail
const hook2Seg = (k) => stack(
  kick(1.0, 0.5),
  subOf(k).gain(0.62),
  hatsOf(k + 4), openhat,
  k >= 6 ? roll.gain(0.58) : snare,
  note(m(VCH[k % 4])).s("rhodes").struct("x ~ x ~").gain(0.34).crush(5).shape(0.4).room(0.2),
  note(m(VCHOPB[k % 4])).s("rhodes").gain(0.46).crush(4).shape(0.5).lpf(2600)
)

// BEAT-SWITCH 2: Neapolitan slam — Db (bII) a half-step above tonic, sub lurching db->c, max chaos
const switch2Seg = (k) => stack(
  s(k % 2 === 0 ? "bd:3*2 ~ bd:3 [bd:3 bd:3]" : "[bd:3 bd:3] ~ bd:3*2 bd:3").bank("RolandTR808").gain(0.95).shape(0.7).distort(0.6),
  note(m(S2BASS[k % 4 === 3 ? 1 : 0])).s("square").lpf(200).shape(0.5).gain(0.55),
  hatsFast.gain("0.34 0.14 0.22 0.14"),
  s("~ cp ~ cp").bank("RolandTR808").gain(0.6).crush(6).shape(0.4),
  note("db3,f3,ab3,c4").s("organ_full").struct(m(STAB[k % 4])).gain(0.3).crush(6).shape(0.4).lpf(2600),
  note(m(S2SHRIEK[k % 4])).s("rhodes").gain(0.4).crush(4).shape(0.5).pan("-0.4 0.4 -0.2")
)

// glitch breakdown: harmony gone — roll density and noise sweep escalate into the final hook
const breakdownSeg = (k) => stack(
  s(m(['~ ~ ~ sd:2*4', '~ ~ sd:2*4 sd:2*4', '~ sd:2*8 ~ sd:2*8', 'sd:2*4 sd:2*8 sd:2*8 sd:2*16'][k % 4])).bank("RolandTR808").gain(0.5).crush(4).shape(0.4),
  s("noise*8").gain("0.12 0.05 0.09 0.05").lpf(sine.range(600, 4000).slow(2 - 0.3 * k)).crush(6).hpf(400),
  s("bd:3 ~ ~ ~ bd:3 ~ ~ ~").bank("RolandTR808").gain(0.85).shape(0.6).distort(0.5)
)

// final hook: everything, widest — the Cm changes at full spectrum, crash on arrival, roll out
const finalHookSeg = (k) => stack(
  kick(1.0, 0.5).shape(0.7),
  subOf(k).gain(0.64),
  hatsOf(k + 4), openhat,
  k >= 6 ? roll : snare,
  note(m(VCH[k % 4])).s("rhodes").struct(m(STAB[Math.min(3, Math.floor(k / 2))])).gain(0.36).crush(5).shape(0.4).room(0.25),
  note(m(k < 4 ? VCHOP[k % 4] : VCHOPB[k % 4])).s("rhodes").gain(0.48).crush(5).shape(0.45).lpf(2600),
  k === 0 ? s("cr ~ ~ ~").gain(0.3) : grit.gain(0.07)
)

// outro: organ Cm9 decays into filtered dust — lpf and gain fall away per cycle
const outroSeg = (k) => stack(
  note("c3,eb3,g3,bb3,d4").s("organ_full").gain([0.3, 0.28, 0.24, 0.18][k % 4]).attack(0.1).release(1.5).room(0.7).lpf([2000, 1500, 1000, 600][k % 4]),
  s("noise").gain(0.06).lpf(sine.range(1500, 300).slow(4)).room(0.5).crush(7)
)

const PLAN = [
  [introSeg, 4],      // glitch build
  [verseASeg, 8],     // abrasive Cm churn
  [hookSeg, 8],       // hook (harder)
  [switch1Seg, 8],    // BEAT-SWITCH 1 (pitched-up, weightless)
  [beautySeg, 6],     // beauty interlude (Ab world, moving changes)
  [dropSeg, 2],       // near-silence drop
  [verseBSeg, 8],     // verse B (re-mangled, more distorted)
  [hook2Seg, 8],      // hook 2 (peak Cm)
  [switch2Seg, 8],    // BEAT-SWITCH 2 (Neapolitan Db slam)
  [breakdownSeg, 4],  // glitch breakdown
  [finalHookSeg, 8],  // final hook (widest)
  [outroSeg, 4],      // resolve home -> dust
]  // 76 cycles

slowcat(...PLAN.flatMap(([seg, len]) => Array.from({ length: len }, (_, k) => seg(k))))
`
