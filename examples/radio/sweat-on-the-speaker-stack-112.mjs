export const title = 'Sweat On The Speaker Stack'
export const genre = 'New-rave dance-punk — São Paulo/DFA lineage, scrappy 2006 basement-party disco-punk, ~122 BPM'
export const mood = 'Flirty and bratty at once: a fuzzy bass riff struts around the room while a toy synth grins back. Sweaty, stop-start, irresistibly danceable — recorded in one take, nobody cares, everybody dances.'
export const cycles = 60
export const model = 'claude-fable-5'
export const prompt = 'css lets make love & listen to death from above — sao paulo new-rave dance-punk, fuzzy bass, toy synth hook'
export const author = 'morgan'

export const code = `setcps(122/240)

// ---- the riff (one bar, punk played by a disco band) ----
const RIFF = 'e1 [e1 e1] [~ e2] e1 g1 [~ g1] [a1 b1] [d2 b1]'
const RIFF_HALF = 'e1 ~ [~ e1] ~ [e2 ~] ~ [d2 ~] [b1 a1]'

// riff positions: verse hammers E then shoves to F (bII); hook lifts G G F E
const VERSE_OFF = [0, 0, 0, 1]
const HOOK_OFF  = [3, 3, 1, 0]
const BD_OFF    = [0, 0, 0, 1, 0, 0, 1, 1]
const BD_CUT    = [340, 340, 380, 420, 480, 560, 700, 900]

const fuzzBass = (k, cut) => stack(
  note(m(RIFF)).add(k).s("sawtooth")
    .lpf(cut).shape(0.55).gain(0.6).release(0.12),
  note(m(RIFF)).add(k).s("square")
    .lpf(150).gain(0.34).release(0.12)
)
const bdBass = (k, cut) => stack(
  note(m(RIFF_HALF)).add(k).s("sawtooth")
    .lpf(cut).shape(0.6).gain(0.62).release(0.2),
  note(m(RIFF_HALF)).add(k).s("square")
    .lpf(150).gain(0.36).release(0.2)
)

// ---- toy synth hook (cheap, bright, slightly detuned) ----
const HOOK_MEL = [
  '~ b4 [d5 b4] ~ ~ g4 [a4 b4] ~',
  '~ b4 [d5 b4] ~ g4 ~ [f4 e4] ~',
  '~ a4 [c5 a4] ~ ~ f4 [g4 a4] ~',
  'b4 ~ [g4 ~] ~ e4 ~ ~ [~ b3]',
]
const toyHook = (mel) => stack(
  note(m(mel)).s("square").lpf(2500)
    .attack(0.005).decay(0.12).sustain(0.5).release(0.12)
    .gain(0.3).pan(-0.15),
  note(m(mel)).add(0.12).s("square").lpf(2100)
    .attack(0.005).decay(0.12).sustain(0.5).release(0.12)
    .gain(0.2).pan(0.2)
)

// ---- bratty shout stabs (formant-style, the other half of the band) ----
const VERSE_STAB = ['e3,g3,b3', 'e3,g3,b3', 'g3,b3,e4', 'f3,a3,c4']
const STAB_PAT   = ['~ ~ [x x] ~', '~ ~ ~ [~ x]', '~ ~ [x x] ~', '[x x] ~ [x x] ~']
const shout = (ch, pat, g) => note(m(ch)).struct(m(pat)).s("sawtooth")
  .hpf(420).lpf(1400).resonance(12)
  .attack(0.004).decay(0.09).sustain(0).release(0.08)
  .vib(5).vmod(0.07).room(0.15).gain(g)

// ---- drums (TR909 body, TR808 cowbell) ----
const kick = s("bd*4").bank("RolandTR909").gain(0.95).shape(0.2).clip(1.4).release(0.28)
const clapA = s("~ cp ~ cp").bank("RolandTR909").gain(0.48).clip(1.6).release(0.3).room(0.18)
const clapBD = s("~ cp ~ [cp cp]").bank("RolandTR909").gain(0.52).clip(1.7).release(0.32).room(0.3)
const hatsA = s("hh*8").bank("RolandTR909")
  .gain("0.5 0.24 0.38 0.26 0.46 0.24 0.4 0.3").swingBy(0.09, 8).clip(0.9)
const ohats = s("[~ oh]*4").bank("RolandTR909").gain(0.24).clip(0.6)
const shakerP = s("shaker*8").swingBy(0.09, 8)
  .gain("0.22 0.1 0.16 0.11 0.2 0.1 0.17 0.12")
const cowbell = s("cb*4").bank("RolandTR808").gain("0.26 0.15 0.22 0.15").clip(0.8)

// ---- sections ----
const introSeg = (i) => {
  if (i === 0) return stack(hatsA, clapA)
  if (i === 1) return stack(kick, hatsA, clapA)
  if (i === 2) return stack(fuzzBass(0, 350), kick, hatsA, clapA)
  return stack(fuzzBass(0, 420), kick, hatsA, clapA, ohats)
}
const verseSeg = (i) => stack(
  fuzzBass(VERSE_OFF[i % 4], 420),
  shout(VERSE_STAB[i % 4], STAB_PAT[i % 4], 0.4),
  kick, clapA, hatsA
)
const hookSeg = (i) => stack(
  fuzzBass(HOOK_OFF[i % 4], 700),
  toyHook(HOOK_MEL[i % 4]),
  kick, clapA, hatsA, ohats, shakerP
)
const bdSeg = (i) => stack(
  bdBass(BD_OFF[i % 8], BD_CUT[i % 8]),
  clapBD,
  ...(i >= 5 ? [shout(VERSE_STAB[i % 4], STAB_PAT[i % 4], 0.34)] : [])
)
const bigHookSeg = (i) => stack(
  fuzzBass(HOOK_OFF[i % 4], 800),
  toyHook(HOOK_MEL[i % 4]),
  kick, clapA, hatsA, ohats, shakerP, cowbell,
  ...(i === 0 ? [s("cr ~ ~ ~").bank("RolandTR909").gain(0.32).clip(2).release(0.35)] : [])
)
const outroSeg = (i) => {
  if (i === 0) return stack(fuzzBass(0, 500), toyHook(HOOK_MEL[3]), clapA)
  if (i === 1) return stack(fuzzBass(0, 400), clapA)
  if (i === 2) return stack(fuzzBass(1, 300), shout('f3,a3,c4', '~ ~ [x x] ~', 0.36))
  return stack(
    s("bd ~ ~ ~").bank("RolandTR909").gain(0.9).clip(2).release(0.35),
    shout('e3,g3,b3,e4', 'x ~ ~ ~', 0.42).room(0.5),
    s("oh ~ ~ ~").bank("RolandTR909").gain(0.3).clip(2)
  )
}

const PLAN = [
  [introSeg, 4],
  [verseSeg, 8], [hookSeg, 8],
  [verseSeg, 8], [hookSeg, 8],
  [bdSeg, 8],
  [bigHookSeg, 12],
  [outroSeg, 4],
]
slowcat(...PLAN.flatMap(([seg, len]) => Array.from({ length: len }, (_, k) => seg(k))))`
