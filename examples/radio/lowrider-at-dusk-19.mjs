export const title = 'Lowrider at Dusk'
export const genre = 'Dr. Dre "2001" / Chronic-era G-funk (late-90s/2000 West Coast)'
export const mood = 'menacing, swaggering, smooth, cinematic, laid-back head-nod heavy'
export const cycles = 78
// exported from the radio DB (2026-06-30); restore with: bun scripts/post-song.mjs <this file>
export const code = `// Genre: Dr. Dre "2001" / Chronic-era G-funk — West Coast, ~92 BPM laid-back head-nod, menacing & smooth
// FIX: the Cm9|Abmaj7#11|Fm9|G7b9 vamp lived in top-level <a b c d> (pad/bass/piano) repeated in
//      slowcat, which freezes on Cm for the whole first pass (slowcat queries each entry at cycle
//      floor(t/N)=0). Corrected by spelling the vamp out ONE chord per cycle with a CONTINUOUS index
//      (g % 4) across the whole arrangement, so the vamp actually cycles. Same groove & harmony.
// Harmony: C minor vamp, one chord per bar: Cm9 | Abmaj7#11 | Fm9 | G7(b9). The G7(b9) is the altered
//      V (Ab over G = West-Coast menace pulling to Cm); Abmaj7#11 (D-natural) is the borrowed bright lift.
// Motif: the G-funk WHISTLE — high whining lead leaping a 4th then bending down (g5->c6->bb5->g5), vibrato
//      + glide. hook1 states it; hook2 reaches up to the #11 (eb6); final hook inverts to the climax reach.
// Rhythm: hard punchy 808 kick, clap+snare backbeat, swung 16th hats, deep DETUNED saw bass locked to kick.
setcps(0.383)   // ~92 BPM laid-back West Coast head-nod

// ===== DRUMS — hard, punchy, locked (within-cycle patterns, reused) ===============================
const kick = s("bd ~ ~ ~ bd ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~").bank("RolandTR808").lpf(2600).shape(0.3)
  .gain("0.95 0 0 0 0.7 0 0 0 0 0 0.82 0 0 0 0 0").release(0.22)
const snare = s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").bank("RolandTR808").gain(0.6).shape(0.12)
  .lpf(6000).room(0.14).release(0.16)
const clap = s("~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~").gain(0.5).hpf(900).room(0.22).release(0.18)
const ghosts = s("~ ~ cp ~ ~ ~ ~ cp ~ ~ ~ cp ~ ~ ~ ~").gain("0 0 0.13 0 0 0 0 0.1 0 0 0 0.12 0 0 0 0")
  .hpf(1600).room(0.14).release(0.05).sometimesBy(0.3, x => x.gain(0))
const hats = s("hh*16").bank("RolandTR808").hpf(8200).lpf(12000)
  .gain("0.2 0.06 0.13 0.05 0.18 0.06 0.12 0.05 0.2 0.06 0.13 0.05 0.18 0.06 0.12 0.05")
  .release(0.04).swingBy(1/3, 8).sometimesBy(0.16, x => x.gain(0))
const ophat = s("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ oh").bank("RolandTR808").hpf(7000).gain(0.16)
  .release(0.14).someCyclesBy(0.4, x => x.gain(0))

const drumsCore = stack(kick, snare, clap, hats)
const drumsFull = stack(kick, snare, clap, hats, ghosts, ophat)

// ===== THE G-FUNK WHISTLE LEAD — high triangle, vibrato + glide (within-cycle phrases) ============
const leadVoice = (phrase) => note(m(phrase)).s("triangle")
  .lpf(3400).resonance(7).attack(0.03).release(0.42).gain(0.32)
  .vib(5).vmod(0.12).room(0.34).delay(0.2).delaytime(0.375).delayfeedback(0.3).pan(0.06)
const motifA = leadVoice('~ ~ g5 ~ c6 ~ bb5 ~ g5 ~ ~ ~ ~ f5 ~ g5')
const leadTease = leadVoice('~ ~ ~ ~ ~ ~ g5 ~ c6 ~ ~ ~ ~ ~ ~ ~').gain(0.22).lpf(2800)
const motifB = leadVoice('~ ~ ~ g5 ~ bb5 ~ c6 ~ eb6 ~ ~ ~ c6 ~ ~')
const motifC = leadVoice('~ ~ g5 ~ ~ c6 ~ ~ eb6 ~ ~ ~ ~ ~ ~ ~').vmod(0.15).release(0.7).gain(0.34).lpf(3800)

// ===== THE VAMP — Cm9 | Abmaj7#11 | Fm9 | G7(b9), one chord per cycle (NOT via <...> in slowcat) ==
const PAD_CH = ['c3,eb3,g3,bb3,d4', 'ab2,c3,g3,d4', 'f3,ab3,c4,eb4,g4', 'g2,b2,f3,ab3']
const ROOT = ['c2', 'ab1', 'f1', 'g1']
// per-bar swagger bass riffs (one 16-step riff per chord)
const BASS_HOOK = [
  'c2 ~ ~ ~ c2 ~ ~ ~ ~ ~ c2 ~ eb2 ~ g2 ~',
  'ab1 ~ ~ ~ ab1 ~ ~ ~ ~ ~ ab1 ~ c2 ~ eb2 ~',
  'f1 ~ ~ ~ f1 ~ ~ ~ ~ ~ f1 ~ ab1 ~ c2 ~',
  'g1 ~ ~ ~ g1 ~ ~ ~ ~ ~ g1 ~ b1 ~ d2 ~',
]
const PIANO_HOOK = ['~ ~ d4 ~ ~ ~ ~ ~', '~ ~ ~ ~ d4 ~ ~ ~', '~ ~ eb4 ~ ~ ~ ~ ~', '~ ~ ~ ~ f3 ~ ~ ~']

const padVerseSeg = (i) => note(m(PAD_CH[i])).struct("x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~").s("rhodes")
  .lpf(1500).attack(0.02).release(0.6).gain(0.34).room(0.34).delay(0.16).delaytime(0.5).delayfeedback(0.22).pan(-0.08)
const padHookSeg = (i) => note(m(PAD_CH[i])).struct("x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~").s("rhodes")
  .lpf(2600).attack(0.015).release(0.55).gain(0.38).room(0.38).delay(0.16).delaytime(0.5).delayfeedback(0.24).pan(-0.06)
const bassMkSeg = (i) => note(m(ROOT[i])).struct("x ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~").s("sawtooth")
  .lpf(220).shape(0.2).attack(0.012).release(0.26).gain(0.5)
const bassDetuneSeg = (i) => note(m(ROOT[i])).struct("x ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~").add(note(12)).s("sawtooth")
  .lpf(420).shape(0.16).attack(0.014).release(0.24).gain(0.22).pan(0.12)
const bassHookSeg = (i) => note(m(BASS_HOOK[i])).s("sawtooth").lpf(260).shape(0.2).attack(0.012).release(0.24).gain(0.5)
const pianoHookSeg = (i) => note(m(PIANO_HOOK[i])).s("piano").lpf(3200).gain(0.26).room(0.3).release(0.4).delay(0.14).delaytime(0.5).delayfeedback(0.2)

// ===== SECTION SEGMENTS — chord index i (= continuous g%4) advances the vamp cycle by cycle =======
const introSeg = (i) => stack(drumsCore.gain(0.86), padVerseSeg(i).lpf(1000).gain(0.28))
const introBSeg = (i) => stack(drumsCore, bassMkSeg(i), bassDetuneSeg(i), padVerseSeg(i).lpf(1300))
const verseSeg = (i) => stack(drumsFull, bassMkSeg(i), bassDetuneSeg(i), padVerseSeg(i), leadTease)
const hookSeg = (i) => stack(drumsFull, bassHookSeg(i), bassDetuneSeg(i), padHookSeg(i), pianoHookSeg(i), motifA)
const hook2Seg = (i) => stack(drumsFull, bassHookSeg(i), bassDetuneSeg(i), padHookSeg(i), pianoHookSeg(i), motifB)
const hookEndSeg = (i) => stack(drumsFull, bassHookSeg(i), bassDetuneSeg(i), padHookSeg(i), pianoHookSeg(i), motifC)
const breakdownSeg = (i) => stack(
  kick.gain("0.78 0 0 0 0.55 0 0 0 0 0 0.62 0 0 0 0 0"),
  clap.gain(0.42).room(0.34).delay(0.22).delaytime(0.5).delayfeedback(0.3),
  bassMkSeg(i), bassDetuneSeg(i),
  padVerseSeg(i).lpf(800).gain(0.2),
  leadTease.gain(0.2).delay(0.28).delayfeedback(0.42)
)
const outroSeg = (i) => stack(drumsCore.gain(0.7), bassMkSeg(i).gain(0.36), bassDetuneSeg(i).gain(0.16),
  padVerseSeg(i).lpf(1100).gain(0.26))

// ===== ARRANGEMENT — 78 cycles, vamp advancing continuously (g % 4) across every section ==========
const layout = [
  [introSeg, 2], [introBSeg, 4],
  [verseSeg, 10],
  [hookSeg, 8],
  [verseSeg, 10],
  [hook2Seg, 8],
  [breakdownSeg, 6],
  [verseSeg, 8],
  [hookSeg, 6],
  [hookEndSeg, 8],
  [outroSeg, 8],
]
const segs = []
let g = 0
for (const [fn, count] of layout) {
  for (let k = 0; k < count; k++) { segs.push(fn(g % 4)); g++ }
}
slowcat(...segs)
`
