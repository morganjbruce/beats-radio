export const title = 'Pepper Soup Diplomacy'
export const genre = 'Afrobeat — Fela Kuti / Africa 70 lineage, Lagos early-70s, one-chord E9 vamp, ~103 BPM'
export const mood = 'A Lagos club at 2am: the rhythm engine assembles part by part until the room is locked in a sweat, then the horn section walks in like a verdict. Political heat kept on a leash by dancefloor discipline.'
export const cycles = 96
export const model = 'claude-fable-5'
export const prompt = 'fela kuti afrobeat — africa 70 lagos, interlocking engine, horn call-and-response, long-form patience'
export const author = 'morgan'

export const code = `setcps(0.43)

// ============ THE ENGINE — E9 vamp, everything interlocks ============
// bass anchors 16th slots 0,3,6,8,10,12,14 — guitar chops the gaps

const bassRiff = note("[e2 ~ ~ e2] [~ ~ g2 ~] [a2 ~ b2 ~] [d3 ~ e2 ~]")
  .s("triangle").lpf(520).shape(0.15).clip(0.95).release(0.12).gain(0.62)

const guitarCell = note("~ ~ [e4,g4] ~ [e4,g4] [d4,e4] ~ [e4,g4] ~ [d4,f#4] ~ [e4,g4] ~ [d4,e4] ~ [b3,e4]")
  .s("sawtooth").hpf(600).lpf(2000).resonance(5)
  .attack(0.001).clip(0.35).release(0.05).gain(0.3).pan(0.2)

const shekere = stack(
  s("shaker*8").clip(0.8).gain("0.38 0.22 0.3 0.22 0.36 0.22 0.3 0.24"),
  s("hh*8").bank("RolandCompurhythm78").gain("0.3 0.16 0.24 0.16 0.3 0.16 0.24 0.18")
)

const kickLine = s("bd ~ ~ ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~")
  .bank("RolandCompurhythm78").clip(1.6).release(0.3).gain(0.72)

const snareLine = s("~ ~ ~ ~ sd ~ ~ sd ~ ~ ~ ~ sd ~ ~ ~")
  .bank("RolandCompurhythm78").clip(1.4).release(0.28).gain(0.5)

const kitFull = stack(kickLine, snareLine)

const organVamp = note("[e3,g#3,b3,d4]").struct("~ x ~ ~ ~ ~ x ~")
  .s("organ_full").lpf(1100).clip(0.6).room(0.2).gain(0.2).pan(-0.25)

// ============ THE HORNS — one call, one answer (leans on the b7) ============
const HORN_CALL = '[e4 ~ e4 ~] [g#4 ~ ~ ~] [b4 ~ d5 ~] [~ ~ ~ ~]'
const HORN_ANSW = '[~ ~ ~ ~] [d5 ~ c#5 ~] [b4 a4 ~ ~] [g#4 ~ ~ ~]'
const HORN_CALL_BIG = '[[e4,e5] ~ [e4,e5] ~] [[g#4,g#5] ~ ~ ~] [[b4,b5] ~ [d5,d6] ~] [~ ~ ~ ~]'
const HORN_ANSW_BIG = '[~ ~ ~ ~] [[d5,d6] ~ [c#5,c#6] ~] [[b4,b5] [a4,a5] ~ ~] [[g#4,g#5] ~ ~ ~]'

const horn = (phrase, hgain) => note(m(phrase)).s("sawtooth")
  .lpf(2400).hpf(220).resonance(4).shape(0.25)
  .attack(0.004).clip(0.5).release(0.08).room(0.15).gain(hgain)

const ohAccent = s("~ ~ ~ oh").bank("RolandCompurhythm78").clip(1.2).gain(0.22)

// ============ SECTIONS — the add/remove IS the arrangement ============
// A(8): guitar + shekere — the cell states itself
const segA = (k) => stack(guitarCell, shekere)

// B(8): bass riff enters, total conviction
const segB = (k) => stack(bassRiff, guitarCell, shekere)

// C(10): full kit locks in — the engine is running
const segC = (k) => stack(
  bassRiff, guitarCell, shekere, kitFull,
  ...(k % 4 === 3 ? [ohAccent] : [])
)

// D(8): organ vamps quietly underneath — hypnosis deepens
const segD = (k) => stack(bassRiff, guitarCell, shekere, kitFull, organVamp)

// E(12): THE HORNS ARRIVE — short bursts, long gaps
const segE = (k) => stack(
  bassRiff, guitarCell, shekere, kitFull,
  ...(k % 3 === 0 ? [horn(HORN_CALL, 0.5)] : [organVamp])
)

// F(12): call-and-response heat — call answers alternate by cycle
const segF = (k) => stack(
  bassRiff, guitarCell, shekere, kitFull,
  k % 2 === 0 ? horn(HORN_CALL, 0.5) : horn(HORN_ANSW, 0.48)
)

// G(10): breakdown — engine strips to bass + shekere (the part Fela talks over)
const segG = (k) => stack(
  bassRiff, shekere,
  ...(k >= 7 ? [guitarCell] : [])
)

// H(12): horns return BIGGER — octave-doubled, full engine underneath
const segH = (k) => stack(
  bassRiff, guitarCell, shekere, kitFull,
  k % 2 === 0 ? horn(HORN_CALL_BIG, 0.55) : horn(HORN_ANSW_BIG, 0.52)
)

// I(8): horns leave — the engine grooves on, organ back
const segI = (k) => stack(
  bassRiff, guitarCell, shekere, kitFull, organVamp,
  ...(k % 4 === 3 ? [ohAccent] : [])
)

// J(8): parts leave one by one — drums, then guitar, then bass
const segJ = (k) => {
  if (k < 3) return stack(bassRiff, guitarCell, shekere)
  if (k < 6) return stack(bassRiff, shekere)
  return stack(shekere)
}

const PLAN = [
  [segA, 8], [segB, 8], [segC, 10], [segD, 8],
  [segE, 12], [segF, 12], [segG, 10], [segH, 12],
  [segI, 8], [segJ, 8],
]

slowcat(...PLAN.flatMap(([seg, len]) => Array.from({ length: len }, (_, k) => seg(k))))`
