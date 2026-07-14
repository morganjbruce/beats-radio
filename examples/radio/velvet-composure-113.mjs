export const title = 'Velvet Composure'
export const genre = 'Quiet storm sophisti-pop — Sade / Diamond Life-era London, mid-80s smooth soul, ~94 BPM'
export const mood = 'A candlelit room where nobody raises their voice. The groove settles in like silk over a heartbreak it never quite names — until the bridge, where the composure cracks for eight bars, then is quietly restored.'
export const cycles = 70
export const model = 'claude-fable-5'
export const prompt = 'sade quiet storm — diamond life sophisti-pop, economical bass, minor-9th silk, restraint as luxury'
export const author = 'morgan'

export const code = `setcps(0.392)

// ---- harmony: D minor quiet-storm world, 9ths on top -----------------
// verse:  Dm9 | Gm9 | Dm9 | Am9   (dorian b-natural lift at bar 4)
const VERSE_CH = ['f3,a3,c4,e4', 'f3,bb3,d4,a4', 'f3,a3,c4,e4', 'g3,c4,e4,b4']
const VERSE_BS = ['d2@3 [~ a1]', 'g1@3 [~ bb1]', 'd2@3 [~ c2]', 'a1@3 [~ c#2]']
// chorus: Bbmaj9 | Am7 | Gm9 | Am9  (the warm bVI turn)
const CHOR_CH = ['d3,f3,a3,c4', 'g3,c4,e4', 'f3,bb3,d4,a4', 'g3,c4,e4,b4']
const CHOR_BS = ['bb1@3 [~ a1]', 'a1@3 [~ g1]', 'g1@3 [~ a1]', 'a1@3 [~ a2]']
// bridge: Ebmaj9 | Dm9 | Ebmaj9 | A7  (the Neapolitan slip — composure cracks)
const BRDG_CH = ['g3,bb3,d4,f4', 'f3,a3,c4,e4', 'g3,bb3,d4,f4', 'e3,g3,a3,c#4']
const BRDG_BS = ['eb2@3 [~ d2]', 'd2@3 [~ f2]', 'eb2@3 [~ e2]', 'a1@3 [~ c#2]']

// ---- lead motif: one gesture, developed by fragment -------------------
const FRAG_A = '~ ~ [~ a4] [c5@2 a4 ~]'
const FRAG_B = '~ ~ [~ f4] [e4@3 ~]'
const PHR_FULL = '[~ a4] [c5@2 d5] [c5 a4@2] [~ f4 e4@2]'
const PHR_PEAK = '[~ a4] [c5 d5@2] [f5@2 d5 c5] [a4@2 g4 e4]'
const PHR_CONF = '~ [~ f4] [g4@2 f4 ~] [d4@3 ~]'
const PHR_SIGH = '~ ~ ~ [~ e4@3]'

// ---- voices ------------------------------------------------------------
const keysOf = (chord) => note(m(chord)).s("rhodes")
  .struct("x@3 [~ x]").attack(0.02).release(0.45)
  .lpf(2400).room(0.35).gain(0.34)

const keysHeld = (chord) => note(m(chord)).s("rhodes")
  .struct("x").attack(0.05).release(0.9)
  .lpf(2000).room(0.45).gain(0.3)

const bassOf = (line) => note(m(line)).s("triangle")
  .lpf(330).shape(0.12).release(0.2).gain(0.55)

const padOf = (chord) => note(m(chord)).s("triangle")
  .struct("x").attack(0.35).release(0.7)
  .lpf(620).room(0.5).gain(0.17)

const sax = (phrase) => note(m(phrase)).s("triangle")
  .lpf(1250).hpf(180).vib(5).vmod(0.06)
  .attack(0.05).release(0.35).room(0.5).gain(0.32)

// ---- drums: brushed whisper, single kick voice, ringing tails ---------
const drumsVerse = stack(
  s("bd ~ [~ bd] ~").bank("LinnDrum").gain(0.48).clip(1.6).release(0.3),
  s("~ sd ~ sd").bank("LinnDrum").gain(0.24).clip(1.4).release(0.3),
  s("hh*8").bank("LinnDrum").gain("[0.13 0.07]*4").clip(1.4).release(0.25)
)
const drumsChorus = stack(
  s("bd ~ [~ bd] ~").bank("LinnDrum").gain(0.5).clip(1.6).release(0.3),
  s("~ sd ~ sd").bank("LinnDrum").gain(0.26).clip(1.4).release(0.3),
  s("hh*8").bank("LinnDrum").gain("[0.14 0.08]*4").clip(1.4).release(0.25),
  s("[~ shaker]*2").gain(0.09).clip(1.5).release(0.3)
)
const drumsSoft = stack(
  s("bd ~ [~ bd] ~").bank("LinnDrum").gain(0.4).clip(1.7).release(0.32),
  s("hh*8").bank("LinnDrum").gain("[0.1 0.06]*4").clip(1.4).release(0.25)
)

// ---- segments ----------------------------------------------------------
const introSeg = (i) => {
  const layers = [keysHeld(VERSE_CH[i % 4])]
  if (i >= 2) layers.push(bassOf(VERSE_BS[i % 4]))
  if (i >= 4) layers.push(s("hh*8").bank("LinnDrum").gain("[0.09 0.05]*4").clip(1.4).release(0.25))
  return stack(...layers)
}
const verseSeg = (i, phrase) => stack(
  keysOf(VERSE_CH[i % 4]),
  bassOf(VERSE_BS[i % 4]),
  drumsVerse,
  ...(phrase ? [sax(phrase)] : [])
)
const chorusSeg = (i, phrase, withPad) => stack(
  keysOf(CHOR_CH[i % 4]),
  bassOf(CHOR_BS[i % 4]),
  drumsChorus,
  ...(withPad ? [padOf(CHOR_CH[i % 4])] : []),
  ...(phrase ? [sax(phrase)] : [])
)
const bridgeSeg = (i, phrase) => stack(
  keysHeld(BRDG_CH[i % 4]),
  bassOf(BRDG_BS[i % 4]),
  padOf(BRDG_CH[i % 4]),
  ...(phrase ? [sax(phrase)] : [])
)
const afterSeg = (i, phrase) => stack(
  keysOf(VERSE_CH[i % 4]),
  bassOf(VERSE_BS[i % 4]),
  drumsSoft,
  ...(phrase ? [sax(phrase)] : [])
)
const outroSeg = (i, phrase) => {
  const layers = [keysHeld(VERSE_CH[i % 4])]
  if (i < 5) layers.push(bassOf(VERSE_BS[i % 4]))
  if (phrase) layers.push(sax(phrase))
  return stack(...layers)
}
const lastSeg = () => note(m('d2,f3,a3,c4,e4')).s("rhodes")
  .struct("x").attack(0.08).release(1.4).lpf(1600).room(0.6).gain(0.28)

// ---- arrangement: 70 cycles --------------------------------------------
const V1_LEAD = [null, null, null, null, null, FRAG_A, null, FRAG_B]
const C1_LEAD = [PHR_FULL, null, FRAG_B, null, PHR_FULL, null, FRAG_B, null]
const V2_LEAD = [null, FRAG_A, null, FRAG_B, null, FRAG_A, null, FRAG_B]
const C2_LEAD = [PHR_FULL, null, FRAG_A, null, PHR_FULL, null, FRAG_B, null]
const BR_LEAD = [null, PHR_CONF, null, null, null, PHR_CONF, null, null]
const C3_LEAD = [PHR_PEAK, null, PHR_FULL, null, PHR_PEAK, null, FRAG_B, null]
const AF_LEAD = [null, null, null, PHR_SIGH, null, null, FRAG_B, null]
const OU_LEAD = [null, null, PHR_SIGH, null, null, null, null, null]

slowcat(
  ...Array.from({ length: 6 }, (_, k) => introSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => verseSeg(k, V1_LEAD[k])),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k, C1_LEAD[k], false)),
  ...Array.from({ length: 8 }, (_, k) => verseSeg(k, V2_LEAD[k])),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k, C2_LEAD[k], true)),
  ...Array.from({ length: 8 }, (_, k) => bridgeSeg(k, BR_LEAD[k])),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k, C3_LEAD[k], true)),
  ...Array.from({ length: 8 }, (_, k) => afterSeg(k, AF_LEAD[k])),
  ...Array.from({ length: 7 }, (_, k) => outroSeg(k, OU_LEAD[k])),
  lastSeg()
)`
