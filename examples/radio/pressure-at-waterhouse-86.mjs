export const title = 'Pressure at Waterhouse'
export const genre = 'roots dub — King Tubby / Scientist school, mid-70s Kingston mixing desk, ~72 BPM one-drop'
export const mood = 'A hot night in a small studio, the desk faders moving like hands over water. The bassline walks the room while everything above it dissolves into spring reverb and tape echo, vanishes, and comes back dry as if nothing happened.'
export const cycles = 72
export const model = 'claude-fable-5'
export const prompt = 'roots dub, king tubby school — one-drop, cavernous echo, mix as performance'
export const author = 'morgan'

export const code = `setcps(0.3)

// G minor two-chord riddim: i (Gm) -> bVII (F). The bass IS the hook.
const SKANK = ['bb3,d4,g4', 'a3,c4,f4']
const BUBBLE = ['g3,bb3,d4', 'f3,a3,c4']
const BASSA = ['g1 ~ g1 ~ ~ bb1 d2 ~', 'f1 ~ f1 ~ ~ eb2 c2 ~']
const BASSB = ['g1 ~ g1 ~ ~ bb1 [d2 f2] d2', 'f1 ~ f1 ~ ~ eb2 [c2 a1] f1']
const MELCALL = ['~ ~ d5 ~ c5 ~ bb4 ~', '~ ~ ~ c5 ~ a4 ~ f4']
const MELECHO = ['g4 ~ ~ bb4 ~ a4 ~ g4', '~ f4 ~ ~ a4 ~ c5 ~']

// --- drums: one-drop, kick+snare together on beat 3, CR-78 organ-box warmth ---
const kickOne = s("~ ~ ~ ~ bd ~ ~ ~").bank("RolandCompurhythm78")
  .gain(0.95).clip(1.6).release(0.3).lpf(2200)
const snareDry = s("~ ~ ~ ~ sd ~ ~ ~").bank("RolandCompurhythm78")
  .gain(0.5).clip(1.4).release(0.28)
const snareEcho = s("~ ~ ~ ~ sd ~ ~ ~").bank("RolandCompurhythm78")
  .gain(0.48).clip(1.4).release(0.28)
  .delay(0.55).delaytime(0.625).delayfeedback(0.6).room(0.35)
const snareCavern = s("~ ~ ~ ~ sd ~ ~ ~").bank("RolandCompurhythm78")
  .gain(0.46).clip(1.4).release(0.28)
  .delay(0.75).delaytime(0.625).delayfeedback(0.74).room(0.55)
const hatsFull = s("~ hh ~ hh ~ hh ~ hh").bank("RolandCompurhythm78")
  .gain(0.26).clip(0.9).pan(0.2)
const hatsSparse = s("~ ~ ~ hh ~ ~ ~ hh").bank("RolandCompurhythm78")
  .gain(0.2).clip(0.9).pan(0.2)
const rimSpace = s("~ ~ rim ~ ~ ~ ~ rim")
  .gain(0.26).delay(0.6).delaytime(0.625).delayfeedback(0.58).room(0.4).pan(-0.25)

// --- bass: round, forward, the lead voice ---
const bassSeg = (i) => note(m(BASSA[i % 2])).s("sine")
  .lpf(330).shape(0.22).gain(0.82).clip(0.95).release(0.15)
const bassVarSeg = (i) => note(m(BASSB[i % 2])).s("sine")
  .lpf(330).shape(0.22).gain(0.82).clip(0.95).release(0.15)

// --- skank: piano on 2 and 4, dry or thrown into the chamber ---
const skankDry = (i) => note(m(SKANK[i % 2])).struct("~ ~ x ~ ~ ~ x ~")
  .s("piano").gain(0.5).clip(0.45).hpf(260).room(0.12)
const skankWet = (i) => note(m(SKANK[i % 2])).struct("~ ~ x ~ ~ ~ x ~")
  .s("piano").gain(0.42).clip(0.45).hpf(260)
  .delay(0.7).delaytime(0.625).delayfeedback(0.7).room(0.5)

// --- organ bubble: off-beat square burble, low in the mix ---
const bubbleSeg = (i) => note(m(BUBBLE[i % 2])).struct("~ x ~ x ~ x ~ x")
  .s("square").lpf(850).gain(0.16).clip(0.4).attack(0.01).pan(-0.15)

// --- melodica-ish triangle fragments, always already half in the echo ---
const melCallSeg = (i) => note(m(MELCALL[i % 2])).s("triangle")
  .lpf(1800).vib(5).vmod(0.06).gain(0.4).clip(0.8).release(0.3)
  .delay(0.45).delaytime(0.625).delayfeedback(0.55).room(0.3).pan(0.15)
const melDeepSeg = (i) => note(m(MELECHO[i % 2])).s("triangle")
  .lpf(1400).vib(5).vmod(0.08).gain(0.34).clip(0.8).release(0.4)
  .delay(0.85).delaytime(0.625).delayfeedback(0.75).room(0.6).pan(0.15)

// --- sections: the mix is the performance ---
const introSeg = (i) => stack(kickOne, hatsSparse, bassSeg(i))
const riddimSeg = (i) => stack(
  kickOne, snareDry, hatsFull, bassSeg(i), skankDry(i), bubbleSeg(i))
const stripSeg = (i) => stack(
  kickOne, snareEcho, hatsSparse, bassSeg(i),
  ...(i % 4 === 3 ? [skankWet(i)] : []))
const melodicaSeg = (i) => stack(
  kickOne, snareDry, hatsSparse, bassSeg(i), melCallSeg(i))
const bassoutSeg = (i) => stack(
  snareCavern, rimSpace, skankWet(i), melDeepSeg(i))
const rebuildSeg = (i) => stack(
  kickOne, snareDry, hatsFull, bassVarSeg(i), skankDry(i),
  ...(i % 4 >= 2 ? [melCallSeg(i)] : []))
const chamberSeg = (i) => stack(
  kickOne, snareCavern, bassSeg(i), melDeepSeg(i),
  ...(i % 2 === 1 ? [skankWet(i)] : []))
const finalSeg = (i) => stack(
  kickOne, snareDry, hatsFull, bassVarSeg(i), skankDry(i),
  ...(i % 4 < 2 ? [bubbleSeg(i)] : [melCallSeg(i)]))
const outroSeg = (i) => stack(
  snareEcho, bassSeg(i), skankWet(i))

const PLAN = [
  [introSeg, 4],     // drum + bass alone: the foundation states itself
  [riddimSeg, 10],   // full riddim, dry and confident
  [stripSeg, 8],     // desk pulls everything but drum+bass; skank flashes once wet
  [melodicaSeg, 10], // melodica calls over the stripped riddim
  [bassoutSeg, 8],   // bass and kick GONE — only echoes hold the room
  [rebuildSeg, 10],  // bass returns with the varied tail, mix dries out
  [chamberSeg, 8],   // deepest chamber: kick+bass anchor, all else drowns
  [finalSeg, 10],    // last full pass, bubble and melodica trading
  [outroSeg, 4],     // bass walks out through the spring
]
slowcat(...PLAN.flatMap(([seg, len]) => Array.from({ length: len }, (_, k) => seg(k))))`
