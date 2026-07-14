export const title = 'The Kitchen Is a Forest'
export const genre = 'icy Scandinavian electro-ritual — Fever Ray-era Stockholm synth shamanism, tribal downtempo, ~84 BPM'
export const mood = 'Frost forms on the inside of the window while something with antlers waits by the stove. A masked voice chants low over deep toms and a sub that never lets go of the floor. Nocturnal, feverish, and very still.'
export const cycles = 70
export const model = 'claude-fable-5'
export const prompt = 'fever ray shiver — icy stockholm electronic ritual, frost arps, masked voice, tribal thuds'
export const author = 'morgan'

export const code = `setcps(0.35)

// ---- palette ---------------------------------------------------------
// A minor, static. The shiver = bb rubbing a minor 2nd against the a drone.
// Fever peak: the whole floor drops a step to G, arp carries an ab rub.

const subDrone = (root, level) =>
  note(m(root)).s("sine").lpf(90).attack(0.08).release(0.5).clip(1).gain(level)

const frostArp = (phrase, cutoff, level) =>
  note(m(phrase)).s("sawtooth")
    .lpf(cutoff).resonance(5)
    .attack(0.01).decay(0.18).sustain(0.1).release(0.2)
    .room(0.55).delay(0.35)
    .pan(sine.range(-0.3, 0.3).slow(7))
    .gain(level)

const icePad = (chord, level) =>
  note(m(chord)).s("triangle")
    .lpf(650).attack(0.9).release(1.4).room(0.75).gain(level)

// masked voice: formant-banded sawtooth, narrow, chant-like, slightly feverish
const maskVoice = (phrase, level) =>
  note(m(phrase)).s("sawtooth")
    .hpf(340).lpf(1100).resonance(12)
    .vib(5).vmod(0.09).shape(0.25)
    .attack(0.04).decay(0.25).sustain(0.35).release(0.35)
    .room(0.5).delay(0.28)
    .gain(level)

// the cry at the peak: same throat, octave up, more air
const maskCry = (phrase, level) =>
  note(m(phrase)).s("sawtooth")
    .hpf(400).lpf(1500).resonance(11)
    .vib(5.5).vmod(0.12).shape(0.2)
    .attack(0.05).decay(0.3).sustain(0.4).release(0.5)
    .room(0.7).delay(0.35)
    .gain(level)

const kickPulse = (patt, level) =>
  s(m(patt)).bank("RolandTR808").lpf(180).clip(1.5).release(0.3).gain(level)

const tomRitual = (patt, level) =>
  s(m(patt)).bank("SimmonsSDS5").lpf(480).clip(1.6).release(0.3).room(0.35).gain(level)

const frostNoise = (level) =>
  s("noise").lpf(sine.range(220, 700).slow(9)).attack(0.6).release(0.8).gain(level)

// ---- material --------------------------------------------------------
const ARP_A  = 'a3 c4 e4 a4 bb4 a4 e4 c4'          // bb4 against a: the ice
const ARP_A2 = 'a3 c4 e4 bb3 a3 e4 c4 bb3'          // rub moved low, darker
const ARP_G  = 'g3 bb3 d4 g4 ab4 g4 d4 bb3'         // fever floor, ab rub

const PAD_A  = 'a2,e3,c4'
const PAD_A9 = 'a2,e3,b3'                            // open 9th, colder
const PAD_G  = 'g2,d3,bb3'

const KICK_RIT = 'bd ~ ~ bd ~ ~ bd ~'                // 3+3+2 tribal pulse
const KICK_LOW = 'bd ~ ~ ~ ~ ~ bd ~'

const TOMS = [
  '~ lt ~ ~ mt ~ lt ~',
  '~ lt ~ mt ~ ~ lt [~ mt]',
  '~ lt ~ ~ mt ~ [lt lt] ~',
  '~ lt ~ mt ~ ~ lt ~',
]

// chant: statement falling to the root, answer carrying the bb shiver
const VOX = [
  'e4 ~ e4 [d4 c4] ~ c4 ~ a3',
  '~ ~ ~ ~ ~ ~ ~ ~',
  'c4 ~ d4 [c4 bb3] ~ a3 ~ ~',
  '~ ~ ~ ~ ~ ~ ~ ~',
]
const VOX_FRAG = [
  '~ ~ e4 [d4 c4] ~ ~ ~ ~',
  '~ ~ ~ ~ ~ ~ ~ ~',
  '~ ~ ~ ~ ~ c4 ~ a3',
  '~ ~ ~ ~ ~ bb3 ~ a3',
]
const CRY = [
  'g4 ~ bb4 [c5 bb4] ~ g4 ab4 ~',
  '~ ~ ~ ~ ~ ~ ~ ~',
  'bb4 ~ c5 ~ [bb4 ab4] ~ g4 ~',
  '~ ~ ~ ~ ~ g4 ~ ~',
]

// ---- sections --------------------------------------------------------
// frost intro: drone + arp condensing out of the air, no drums
const FROST_LPF = [500, 560, 620, 680, 740, 800, 860, 920]
const frostSeg = (k) => stack(
  subDrone('a1', 0.5 + k * 0.015),
  frostArp(ARP_A, FROST_LPF[k % 8], 0.16 + k * 0.012),
  frostNoise(0.05)
)

// the ritual starts: toms and soft kick under the arp, pad breathes in
const ritualSeg = (k) => stack(
  subDrone('a1', 0.62),
  frostArp(ARP_A, 950, 0.26),
  icePad(k % 4 < 2 ? PAD_A : PAD_A9, 0.16),
  kickPulse(KICK_RIT, 0.5),
  tomRitual(TOMS[k % 4], 0.34)
)

// the masked voice enters over the full ritual
const chantSeg = (k) => stack(
  subDrone('a1', 0.62),
  frostArp(k % 4 < 2 ? ARP_A : ARP_A2, 1000, 0.24),
  icePad(k % 4 < 2 ? PAD_A : PAD_A9, 0.15),
  maskVoice(VOX[k % 4], 0.3),
  kickPulse(KICK_RIT, 0.5),
  tomRitual(TOMS[k % 4], 0.34)
)

// fever peak: floor drops a whole step to G, the voice cries an octave up
const feverSeg = (k) => stack(
  subDrone('g1', 0.66),
  frostArp(ARP_G, 1200, 0.28),
  icePad(PAD_G, 0.18),
  maskCry(CRY[k % 4], 0.3),
  kickPulse(KICK_RIT, 0.52),
  tomRitual(TOMS[(k + 1) % 4], 0.36)
)

// the voice alone: no drums, just breath and the floor coming home to A
const aloneSeg = (k) => stack(
  subDrone('a1', 0.58),
  icePad(k % 4 < 2 ? PAD_A9 : PAD_A, 0.17),
  maskVoice(VOX[(k * 2) % 4 === 0 ? 0 : 2], 0.32),
  frostNoise(0.045)
)

// the ritual returns, colder: fragmented voice, darker arp, sparser kick
const RETURN_LPF = [820, 820, 780, 780, 740, 740, 700, 700, 660, 660, 620, 620]
const returnSeg = (k) => stack(
  subDrone('a1', 0.6),
  frostArp(ARP_A2, RETURN_LPF[k % 12], 0.24),
  icePad(PAD_A9, 0.14),
  maskVoice(VOX_FRAG[k % 4], 0.26),
  kickPulse(k % 4 < 3 ? KICK_RIT : KICK_LOW, 0.46),
  tomRitual(TOMS[k % 4], 0.3)
)

// thaw: drums gone, the arp dissolves, frost melting off the glass
const THAW_LPF = [640, 580, 520, 470, 430, 400, 380, 360]
const thawSeg = (k) => stack(
  subDrone('a1', 0.55 - k * 0.03),
  frostArp(ARP_A, THAW_LPF[k % 8], 0.18 - k * 0.016),
  icePad(PAD_A, k < 5 ? 0.13 : 0.09),
  frostNoise(0.05)
)

// ---- arrangement: 70 cycles ------------------------------------------
const PLAN = [
  [frostSeg, 8],
  [ritualSeg, 12],
  [chantSeg, 12],
  [feverSeg, 10],
  [aloneSeg, 8],
  [returnSeg, 12],
  [thawSeg, 8],
]
slowcat(...PLAN.flatMap(([seg, len]) => Array.from({ length: len }, (_, k) => seg(k))))`
