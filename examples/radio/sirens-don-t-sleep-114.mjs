export const title = 'Sirens Don\'t Sleep'
export const genre = 'Minimalist hip-hop — 2018 Wyoming-sessions lineage, obsessive chop-loop production, ~92 BPM'
export const mood = 'One bright chopped phrase repeats like an alarm nobody will switch off. Drums crack underneath and then vanish without warning — the held breath before they slam back harder. Anger disciplined into a loop.'
export const cycles = 61
export const model = 'claude-fable-5'
export const prompt = 'nas kanye 2018 cops shot the kid energy — obsessive loop as alarm, hard minimal drums, mutes as punctuation'
export const author = 'morgan'

export const code = `setcps(0.3833)

// ---- the alarm: one chopped formant stab, never rests ----
const alarm = () =>
  note("[bb4 g4 bb4 d5]*2").s("sawtooth")
    .hpf(430).lpf(1350).resonance(11)
    .attack(0.004).decay(0.14).sustain(0.1).release(0.12)
    .vib(5).vmod(0.06)
    .room(0.18).gain(0.33)

// final phrase cut dead mid-cycle
const alarmCut = () =>
  note("bb4 g4 bb4 ~ ~ ~ ~ ~").s("sawtooth")
    .hpf(430).lpf(1350).resonance(11)
    .attack(0.004).decay(0.14).sustain(0.1).release(0.12)
    .vib(5).vmod(0.06)
    .room(0.18).gain(0.33)

// ---- kick conversation (two bars), bass locks the same grid ----
const KICKS = [
  'x ~ ~ ~ ~ ~ ~ x ~ ~ x ~ ~ ~ ~ ~',
  'x ~ ~ ~ ~ ~ ~ ~ ~ x x ~ ~ ~ x ~',
]
const KICKS_HARD = [
  'x ~ ~ x ~ ~ ~ x ~ ~ x ~ ~ ~ ~ ~',
  'x ~ ~ ~ ~ ~ x x ~ ~ x ~ ~ x ~ ~',
]

const bassPulse = (grid) =>
  note("g1").struct(m(grid))
    .s("sine").lpf(95).shape(0.2)
    .attack(0.005).decay(0.35).sustain(0.55).release(0.18)
    .gain(0.8)

const drumsA = (grid) => stack(
  s("bd").struct(m(grid)).bank("EmuSP12").clip(1.5).release(0.3).gain(0.85),
  s("sd").struct("~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~ ~ ~").bank("EmuSP12").clip(1.6).release(0.32).gain(0.66),
  s("hh").struct("x ~ x ~ x ~ x x x ~ x ~ x ~ x ~").bank("EmuSP12").gain(0.28),
)

const drumsB = (grid) => stack(
  s("bd").struct(m(grid)).bank("EmuSP12").clip(1.5).release(0.3).gain(0.87),
  s("sd").struct("~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ x x ~ ~ ~").bank("EmuSP12").clip(1.7).release(0.34).gain(0.68),
  s("hh").struct("x ~ x x x ~ x x x ~ x x x ~ x x").bank("EmuSP12").gain(0.3),
  s("oh").struct("~ ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ x ~").bank("EmuSP12").clip(0.6).gain(0.22),
)

// ---- the dark shade: bVI held under the loop (Eb/G — bass pedal is its 3rd) ----
const shade = () =>
  note("eb2,g2,bb2").s("sawtooth")
    .lpf(480).attack(0.35).release(0.7)
    .room(0.35).gain(0.26)

// ---- sections ----
const introSeg  = ()  => alarm()
const grooveA   = (i) => stack(alarm(), bassPulse(KICKS[i % 2]), drumsA(KICKS[i % 2]))
const breathSeg = ()  => alarm()
const grooveB   = (i) => stack(alarm(), bassPulse(KICKS_HARD[i % 2]), drumsB(KICKS_HARD[i % 2]))
const shadeSeg  = (i) => stack(alarm(), bassPulse(KICKS_HARD[i % 2]), drumsB(KICKS_HARD[i % 2]), shade())
const cutSeg    = ()  => alarmCut()

const PLAN = [
  [introSeg, 4],   // the loop alone — already urgent
  [grooveA, 8],    // drums slam in
  [grooveA, 8],    // verse groove settles
  [breathSeg, 2],  // everything cuts — held breath
  [grooveB, 12],   // drums return harder
  [shadeSeg, 12],  // dark second chord shades the loop
  [breathSeg, 2],  // second breath, shorter felt
  [shadeSeg, 12],  // final stretch — full stack
  [cutSeg, 1],     // cut dead mid-phrase
]

slowcat(...PLAN.flatMap(([seg, len]) => Array.from({ length: len }, (_, k) => seg(k))))`
