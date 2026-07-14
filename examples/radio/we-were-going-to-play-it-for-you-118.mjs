export const title = 'We Were Going To Play It For You'
export const genre = 'DFA dance-rock / disco-punk long build — This Is Happening-era LCD Soundsystem lineage, ~107 BPM'
export const mood = 'A band walks into the room one member at a time and refuses to hurry. Deadpan motorik-disco cool on the surface, a relative-minor ache underneath that only shows itself once the groove has earned it.'
export const cycles = 90
export const model = 'claude-fable-5'
export const prompt = 'lcd soundsystem you wanted a hit — DFA dance-rock long build, rubbery bass, inevitable payoff'
export const author = 'morgan'

export const code = `setcps(107/240)

// ---- harmony: two-chord cool (Amaj7 <-> Gmaj7, bVII) ; the reveal is F#m7 ----
const VAMP_CH  = ['a2,c#3,e3,g#3', 'g2,b2,d3,f#3']
const VAMP_PAD = ['e3,g#3,c#4', 'd3,f#3,b3']
const VAMP_GTR = ['a3,c#4,e4', 'g3,b3,d4']

const HIT_CH  = ['a2,c#3,e3,g#3', 'g2,b2,d3,f#3', 'f#2,a2,c#3,e3', 'g2,b2,d3,f#3']
const HIT_PAD = ['e3,g#3,c#4', 'd3,f#3,b3', 'c#3,e3,a3', 'd3,f#3,b3']
const HIT_GTR = ['a3,c#4,e4', 'g3,b3,d4', 'f#3,a3,c#4', 'g3,b3,d4']

// ---- the constant: one rubbery bass figure, approach tones aimed at the next root ----
const BASS_A_TO_G  = 'a1 ~ a1 [~ a1] a2 ~ a1 [~ g1]'
const BASS_G_TO_A  = 'g1 ~ g1 [~ g1] g2 ~ g1 [~ g#1]'
const BASS_G_TO_F  = 'g1 ~ g1 [~ g1] g2 ~ g1 [~ f#1]'
const BASS_F_TO_G  = 'f#1 ~ f#1 [~ f#1] f#2 ~ f#1 [~ g1]'
const VAMP_BASS  = [BASS_A_TO_G, BASS_G_TO_A]
const HIT_BASS   = [BASS_A_TO_G, BASS_G_TO_F, BASS_F_TO_G, BASS_G_TO_A]
const DOUBT_BASS = [BASS_F_TO_G, BASS_G_TO_A]
const OUT_BASS   = ['a1 ~ a1 [~ a1] a2 ~ a1 ~', 'a1 ~ ~ ~ [a1,a2] ~ ~ ~']

// ---- the deadpan hook (arrives only at the payoff; widened by octave in the ride-out) ----
const HOOK = [
  'e4 ~ [~ c#4] ~ b3 ~ e4 ~',
  'd4 ~ [~ b3] ~ a3 ~ d4 ~',
  'c#4 ~ [~ a3] ~ g#3 ~ c#4 ~',
  'd4 ~ [~ d4] ~ e4 ~ f#4 ~',
]
const HOOK_HI = [
  'e5 ~ [~ c#5] ~ b4 ~ e5 ~',
  'd5 ~ [~ b4] ~ a4 ~ d5 ~',
  'c#5 ~ [~ a4] ~ g#4 ~ c#5 ~',
  'd5 ~ [~ d5] ~ e5 ~ f#5 ~',
]

// ---- voices ----
const kickV  = s("bd*4").bank("RolandTR707").gain(0.72).clip(1.5).release(0.3)
const hatsV  = s("hh*8").bank("RolandTR707").gain("0.42 0.24 0.34 0.24 0.42 0.24 0.34 0.27").clip(0.8)
const snareV = s("~ sd ~ sd").bank("RolandTR707").gain(0.5).clip(1.4).release(0.28)
const ohV    = s("[~ oh]*4").bank("RolandTR707").gain(0.24).clip(0.7)
const shakV  = s("shaker*8").gain("0.18 0.1 0.14 0.1 0.18 0.1 0.14 0.12").hpf(2200)

const bassV = (fig) => note(m(fig)).s("sawtooth")
  .lpf(300).shape(0.3).decay(0.16).sustain(0.3).release(0.12).gain(0.62)
const bassOutV = (fig, cut, lvl) => note(m(fig)).s("sawtooth")
  .lpf(cut).shape(0.25).decay(0.16).sustain(0.3).release(0.15).gain(lvl)

const gtrV = (chord) => note(m(chord)).struct("[~ x]*4").s("square")
  .hpf(350).lpf(2600).decay(0.09).sustain(0).gain(0.3).pan(0.15)

const padV = (chord, cut) => note(m(chord)).s("sawtooth")
  .attack(0.4).release(0.9).lpf(cut).room(0.35).gain(0.24).pan(-0.15)

const hookV = (phr) => note(m(phr)).s("triangle")
  .lpf(1800).decay(0.2).sustain(0.5).release(0.2).gain(0.38).delay(0.2)
const hookHiV = (phr) => note(m(phr)).s("triangle")
  .lpf(2200).decay(0.2).sustain(0.4).release(0.25).gain(0.24).pan(0.3).delay(0.25)

// ---- sections: each arrival earns its keep ----
// s1 (8): the machine starts dry — kick + hats; the bass walks in at cycle 2 and never leaves
const seg1 = (k) => k < 2
  ? stack(kickV, hatsV)
  : stack(kickV, hatsV, bassV(VAMP_BASS[k % 2]))

// s2 (8): snare + offbeat open hat — the drummer commits
const seg2 = (k) => stack(kickV, hatsV, snareV, ohV, bassV(VAMP_BASS[k % 2]))

// s3 (10): clipped offbeat guitar-chords — the two-chord vamp becomes audible
const seg3 = (k) => stack(kickV, hatsV, snareV, ohV,
  bassV(VAMP_BASS[k % 2]), gtrV(VAMP_GTR[k % 2]))

// s4 (10): shimmer slides in UNDER the groove, filter opening one notch per cycle
const S4_LPF = [500, 590, 680, 770, 860, 950, 1040, 1130, 1220, 1310]
const seg4 = (k) => stack(kickV, hatsV, snareV, ohV,
  bassV(VAMP_BASS[k % 2]), gtrV(VAMP_GTR[k % 2]),
  padV(VAMP_PAD[k % 2], S4_LPF[k % 10]))

// s5 (8): shaker joins, pad keeps opening — leaning forward, still no event
const S5_LPF = [1400, 1480, 1560, 1640, 1720, 1800, 1880, 1960]
const seg5 = (k) => stack(kickV, hatsV, snareV, ohV, shakV,
  bassV(VAMP_BASS[k % 2]), gtrV(VAMP_GTR[k % 2]),
  padV(VAMP_PAD[k % 2], S5_LPF[k % 8]))

// s6 (12): the hit — F#m7 reveal in the progression, deadpan hook finally speaks
const seg6 = (k) => stack(kickV, hatsV, snareV, ohV, shakV,
  bassV(HIT_BASS[k % 4]), gtrV(HIT_GTR[k % 4]),
  padV(HIT_PAD[k % 4], 1900), hookV(HOOK[k % 4]))

// s7 (8): the doubt — everything walks out except bass and hats, minor lingers
const seg7 = (k) => stack(
  s("hh*8").bank("RolandTR707").gain("0.3 0.16 0.24 0.16 0.3 0.16 0.24 0.18").clip(0.8),
  bassV(DOUBT_BASS[k % 2]))

// s8 (16): ride-out — full band back, hook doubled an octave up, widest the room gets
const seg8 = (k) => stack(kickV, hatsV, snareV, ohV, shakV,
  bassV(HIT_BASS[k % 4]), gtrV(HIT_GTR[k % 4]),
  padV(HIT_PAD[k % 4], 2000), hookV(HOOK[k % 4]), hookHiV(HOOK_HI[k % 4]))

// s9 (10): machines switch off one by one
const seg9 = (k) => {
  if (k < 3) return stack(kickV, hatsV, snareV,
    bassV(VAMP_BASS[k % 2]), gtrV(VAMP_GTR[k % 2]))
  if (k < 6) return stack(kickV, hatsV, bassV(VAMP_BASS[k % 2]))
  if (k < 8) return stack(kickV, bassV(VAMP_BASS[k % 2]))
  return bassOutV(OUT_BASS[k - 8], 230, 0.5)
}

const PLAN = [
  [seg1, 8], [seg2, 8], [seg3, 10], [seg4, 10], [seg5, 8],
  [seg6, 12], [seg7, 8], [seg8, 16], [seg9, 10],
]
slowcat(...PLAN.flatMap(([seg, len]) => Array.from({ length: len }, (_, k) => seg(k))))`
