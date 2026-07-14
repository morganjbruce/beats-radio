export const title = 'Blue Hour at the Ras Hotel'
export const genre = 'Ethio-jazz — Mulatu Astatke school, early-70s Addis nightclub groove, ~96 BPM'
export const mood = 'Smoky and nocturnal — a swaying 12/8 vamp in a Tizita-minor haze, vibraphone snaking over a low warm ostinato. Patient, hypnotic, two in the morning in an Addis basement club.'
export const cycles = 72
export const model = 'claude-fable-5'
export const prompt = 'ethio-jazz, mulatu astatke school — smoky addis nightclub modal groove'
export const author = 'morgan'

export const code = `setcps(0.4)

// ---- the vamp: Fm7 | Fm7 | Abmaj7 | Eb7 — F minor pentatonic (Tizita-minor) core
const CH = ['f2,ab2,c3,eb3', 'f2,ab2,c3,eb3', 'ab2,c3,eb3,g3', 'eb2,g2,bb2,db3']
const BASSLN = [
  '[f1 ~ ~] [~ ~ c2] [eb2 ~ ~] [~ c2 ~]',
  '[f1 ~ ~] [~ ~ c2] [eb2 ~ f2] [~ ~ eb2]',
  '[ab1 ~ ~] [~ ~ eb2] [c2 ~ ~] [~ eb2 ~]',
  '[eb1 ~ ~] [~ ~ bb1] [db2 ~ ~] [~ bb1 ~]',
]

// ---- ONE snaking motif (vibes), then its lifted answer, a fragment, solo lines, peak calls
const VIBE = [
  '[c4 ~ eb4] [c4 ~ ~] [~ bb3 ab3] [bb3 ~ ~]',
  '[c4 ~ eb4] [f4 ~ eb4] [c4 ~ ~] [~ ~ bb3]',
  '[ab3 ~ c4] [eb4 ~ ~] [~ f4 eb4] [c4 ~ ~]',
  '[bb3 ~ db4] [bb3 ~ g3] [eb4 ~ ~] [~ ~ ~]',
]
const VIBE_B = [
  '[f4 ~ ab4] [f4 ~ ~] [~ eb4 c4] [eb4 ~ ~]',
  '[f4 ~ ab4] [bb4 ~ ab4] [f4 ~ ~] [~ ~ eb4]',
  '[eb4 ~ g4] [ab4 ~ ~] [~ c5 bb4] [ab4 ~ ~]',
  '[db4 ~ eb4] [~ bb3 ~] [g3 ~ bb3] [eb4 ~ ~]',
]
const VIBE_FRAG = [
  '[c4 ~ ~] [~ ~ ~] [~ bb3 ~] [~ ~ ~]',
  '[~ ~ eb4] [c4 ~ ~] [~ ~ ~] [bb3 ~ ~]',
  '[ab3 ~ ~] [~ ~ c4] [~ ~ ~] [~ ~ ~]',
  '[~ ~ ~] [bb3 ~ ~] [~ g3 ~] [~ ~ ~]',
]
const SOLO = [
  '[~ ~ c4] [eb4 ~ f4] [~ ~ ~] [ab4 ~ f4]',
  '[eb4 ~ ~] [~ c4 eb4] [f4 ~ ~] [~ ~ ~]',
  '[~ ab4 ~] [bb4 ~ ab4] [~ f4 ~] [eb4 ~ ~]',
  '[~ ~ g4] [f4 ~ eb4] [db4 ~ ~] [bb3 ~ ~]',
  '[c5 ~ ~] [~ bb4 ab4] [~ ~ f4] [ab4 ~ ~]',
  '[~ f4 ab4] [~ ~ bb4] [c5 ~ bb4] [~ ~ ~]',
  '[eb5 ~ c5] [~ ~ bb4] [ab4 ~ g4] [ab4 ~ ~]',
  '[f4 ~ ~] [eb4 ~ db4] [~ c4 ~] [~ ~ ~]',
]
const PEAK_CALL = [
  '[~ ~ ~] [c5 ~ ~] [~ ~ bb4] [ab4 ~ ~]',
  '[~ ~ ~] [f4 ~ ab4] [c5 ~ ~] [~ ~ ~]',
  '[~ ~ eb5] [~ c5 ~] [bb4 ~ ~] [~ ~ ~]',
  '[~ ~ ~] [bb4 ~ g4] [~ ~ eb4] [~ ~ ~]',
]
const OUTRO_LPF = [900, 760, 620, 500, 400, 320, 250, 200]

// ---- voices
const bassOst = (i) => note(m(BASSLN[i % 4])).s("sine")
  .lpf(220).gain(0.72).clip(0.95).release(0.18)
const organPad = (i, cut) => note(m(CH[i % 4])).s("organ_full")
  .attack(0.08).release(0.5).lpf(cut).gain(0.24).room(0.35)
const organComp = (i) => note(m(CH[i % 4])).struct("[x ~ ~] [~ ~ x] [~ x ~] [~ ~ x]")
  .s("organ_full").lpf(1100).gain(0.22).release(0.3).room(0.3)
const vibes = (i, bank) => note(m(bank[i % 4])).s("vibraphone")
  .gain(0.2).room(0.5).clip(1.2).pan(0.15)
const soloLead = (i) => note(m(SOLO[i % 8])).s("triangle")
  .lpf(1500).vib(5).vmod(0.08).gain(0.42).room(0.4).release(0.3).pan(-0.1)
const peakLead = (i) => note(m(PEAK_CALL[i % 4])).s("triangle")
  .lpf(1700).vib(5).vmod(0.1).gain(0.4).room(0.45).release(0.35).pan(-0.15)

// ---- drums: warm, dusty, swaying triplets
const kick = s("[bd ~ ~] [~ ~ bd] [~ ~ ~] [bd ~ ~]").bank("EmuSP12")
  .gain(0.75).clip(1.5).release(0.3)
const snare = s("[~ ~ ~] [~ ~ ~] [sd ~ ~] [~ ~ ~]").bank("EmuSP12")
  .gain(0.4).clip(1.4).release(0.3)
const hats = s("[hh ~ hh] [hh ~ hh] [hh ~ hh] [hh hh ~]").bank("EmuSP12").gain(0.26)
const ohAcc = s("[~ ~ ~] [~ ~ oh] [~ ~ ~] [~ ~ ~]").bank("EmuSP12").gain(0.22).clip(1.4).release(0.3)
const shakerLoop = s("[shaker ~ shaker]*4").gain(0.16)
const congas = s("[~ ~ conga] [~ ~ ~] [~ conga ~] [conga ~ ~]").gain(0.3).room(0.25)

// ---- sections (gi = global cycle for the continuous vamp, li = local for fades)
const introSeg = (gi, li) => stack(
  bassOst(gi),
  organPad(gi, 750),
  shakerLoop,
)
const headASeg = (gi, li) => stack(
  bassOst(gi),
  organComp(gi),
  vibes(gi, VIBE),
  kick, hats, shakerLoop,
)
const headBSeg = (gi, li) => stack(
  bassOst(gi),
  organComp(gi),
  vibes(gi, VIBE_B),
  kick, snare, hats, shakerLoop,
)
const soloSeg = (gi, li) => stack(
  bassOst(gi),
  organComp(gi),
  soloLead(li),
  kick, snare, hats,
)
const breakSeg = (gi, li) => stack(
  bassOst(gi),
  vibes(gi, VIBE_FRAG),
  shakerLoop,
)
const peakSeg = (gi, li) => stack(
  bassOst(gi),
  organComp(gi),
  vibes(gi, VIBE),
  peakLead(li),
  kick, snare, hats, ohAcc, congas,
)
const returnSeg = (gi, li) => stack(
  bassOst(gi),
  organComp(gi),
  vibes(gi, VIBE),
  kick, snare, hats, shakerLoop,
)
const outroSeg = (gi, li) => stack(
  bassOst(gi),
  organPad(gi, OUTRO_LPF[li % 8]),
  shakerLoop,
)

const PLAN = [
  [introSeg, 8],
  [headASeg, 12],
  [headBSeg, 8],
  [soloSeg, 12],
  [breakSeg, 4],
  [peakSeg, 8],
  [returnSeg, 12],
  [outroSeg, 8],
]
let cursor = 0
const parts = PLAN.flatMap(([seg, len]) => {
  const base = cursor
  cursor += len
  return Array.from({ length: len }, (_, k) => seg(base + k, k))
})
slowcat(...parts)`
