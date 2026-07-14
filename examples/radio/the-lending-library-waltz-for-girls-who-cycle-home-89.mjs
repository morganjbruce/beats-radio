export const title = 'The Lending Library Waltz (For Girls Who Cycle Home)'
export const genre = 'Twee chamber-pop / Glasgow indie, late-90s Belle & Sebastian lineage, ~108 BPM'
export const mood = 'A shy story told from a bicycle seat: jangling piano arpeggios skip along while the melody looks at its shoes. The chorus lifts by warmth, not volume, and a borrowed minor chord keeps pressing on the bruise.'
export const cycles = 64
export const model = 'claude-fable-5'
export const prompt = 'belle & sebastian — glasgow twee chamber-pop, sinister era, bookish melancholy with a skip'
export const author = 'morgan'

export const code = `setcps(0.45)

// ---- G major, one chord per cycle ------------------------------------
// Verse: I vi7 ii7 V7 | I V/vi vi7 V7   (the B7 is the skip in its step)
const V_CH = ['g3,b3,d4', 'e3,g3,b3,d4', 'a2,c3,e3,g3', 'd3,f#3,a3,c4',
              'g3,b3,d4', 'b2,d#3,f#3,a3', 'e3,g3,b3,d4', 'd3,f#3,a3,c4']
const V_ARP = ['g3 d4 b3 g4 d4 b3 d4 b3', 'e3 b3 g3 e4 b3 g3 b3 g3',
               'a3 e4 c4 g4 e4 c4 e4 c4', 'd3 a3 f#3 c4 a3 f#3 a3 f#3',
               'g3 d4 b3 g4 d4 b3 d4 b3', 'b2 f#3 d#3 a3 f#3 d#3 f#3 d#3',
               'e3 b3 g3 e4 b3 g3 b3 g3', 'd3 a3 f#3 c4 a3 f#3 a3 c4']
const V_BASS = ['g2 ~ ~ d3 ~ ~ f#2 ~', 'e2 ~ ~ b2 ~ ~ g2 ~',
                'a2 ~ ~ e2 ~ ~ c3 ~', 'd2 ~ ~ a2 ~ ~ d2 ~',
                'g2 ~ ~ d3 ~ ~ a2 ~', 'b1 ~ ~ f#2 ~ ~ d#2 ~',
                'e2 ~ ~ b2 ~ ~ e2 ~', 'd2 ~ ~ a2 ~ c3 ~ ~']
const V_MEL = ['b4 ~ ~ a4 g4 ~ d4 ~', '~ g4 ~ f#4 e4 ~ b3 ~',
               'c5 ~ ~ b4 a4 ~ e4 ~', '~ ~ f#4 ~ e4 d4 ~ ~',
               'b4 ~ ~ a4 g4 ~ d4 e4', 'd#4 ~ ~ f#4 ~ a4 ~ b4',
               'g4 ~ f#4 e4 ~ b3 ~ ~', 'a4 ~ ~ f#4 ~ e4 d4 ~']
const V_HARP = ['~ ~ ~ ~ ~ b5 a5 g5', '~ ~ ~ ~ ~ ~ ~ ~',
                '~ ~ ~ ~ ~ c6 b5 a5', '~ ~ ~ ~ ~ ~ ~ ~',
                '~ ~ ~ ~ ~ b5 a5 g5', '~ ~ ~ ~ ~ ~ ~ ~',
                '~ ~ ~ ~ g5 f#5 e5 ~', '~ ~ ~ ~ ~ ~ ~ ~']

// Chorus: IV V iii7 vi7 | IV iv I V7    (the Cm is the bruise)
const C_CH = ['c3,e3,g3,d4', 'd3,f#3,a3', 'b2,d3,f#3,a3', 'e3,g3,b3,d4',
              'c3,e3,g3,d4', 'c3,eb3,g3', 'g3,b3,d4', 'd3,f#3,a3,c4']
const C_ARP = ['c3 g3 e3 c4 g3 e3 g3 d4', 'd3 a3 f#3 d4 a3 f#3 a3 f#3',
               'b2 f#3 d3 b3 f#3 d3 f#3 a3', 'e3 b3 g3 e4 b3 g3 b3 d4',
               'c3 g3 e3 c4 g3 e3 g3 d4', 'c3 g3 eb3 c4 g3 eb3 g3 eb3',
               'g3 d4 b3 g4 d4 b3 d4 b3', 'd3 a3 f#3 c4 a3 f#3 a3 c4']
const C_BASS = ['c2 ~ ~ g2 ~ ~ c2 ~', 'd2 ~ ~ a2 ~ ~ f#2 ~',
                'b1 ~ ~ f#2 ~ ~ b1 ~', 'e2 ~ ~ b2 ~ ~ d2 ~',
                'c2 ~ ~ g2 ~ ~ c2 ~', 'c2 ~ ~ eb2 ~ ~ g2 ~',
                'g2 ~ ~ d2 ~ ~ b1 ~', 'd2 ~ ~ a1 ~ ~ d2 ~']
const C_MEL = ['~ e4 g4 ~ a4 ~ g4 ~', '~ f#4 a4 ~ b4 ~ a4 ~',
               'd5 ~ b4 ~ a4 ~ f#4 ~', 'g4 ~ ~ e4 ~ ~ b4 ~',
               '~ e4 g4 ~ a4 ~ b4 ~', 'g4 ~ ~ eb4 ~ ~ d4 ~',
               'd4 ~ g4 ~ b4 ~ a4 g4', 'a4 ~ f#4 ~ e4 ~ d4 ~']
const C_CNT = ['e4 g4', 'f#4 a4', 'f#4 d4', 'e4 g4',
               'g4 a4', 'g4 eb4', 'd4 g4', 'f#4 a4']
const C_HARP = ['~ ~ ~ ~ ~ ~ ~ ~', '~ ~ ~ ~ ~ b5 a5 ~',
                '~ ~ ~ ~ ~ ~ ~ ~', '~ ~ ~ ~ g5 ~ e5 ~',
                '~ ~ ~ ~ ~ ~ ~ ~', '~ ~ ~ g5 ~ eb5 ~ d5',
                '~ ~ ~ ~ ~ ~ ~ ~', '~ ~ ~ ~ a5 f#5 e5 d5']

// Bridge: relative minor, clouds gather — Em Cmaj7 Am7 B7, twice
const B_CH = ['e3,g3,b3', 'c3,e3,g3,b3', 'a2,c3,e3,g3', 'b2,d#3,f#3,a3',
              'e3,g3,b3', 'c3,e3,g3,b3', 'a2,c3,e3,g3', 'b2,d#3,f#3,a3']
const B_ARP = ['e3 ~ g3 b3 ~ g3 ~ b3', 'c3 ~ e3 g3 ~ b3 ~ g3',
               'a2 ~ c3 e3 ~ g3 ~ e3', 'b2 ~ d#3 f#3 ~ a3 ~ f#3',
               'e3 ~ g3 b3 ~ g3 ~ e4', 'c3 ~ e3 g3 ~ b3 ~ c4',
               'a2 ~ c3 e3 ~ g3 ~ a3', 'b2 ~ d#3 f#3 ~ a3 ~ b3']
const B_BASS = ['e2 ~ ~ ~ b2 ~ ~ ~', 'c2 ~ ~ ~ g2 ~ ~ ~',
                'a1 ~ ~ ~ e2 ~ ~ ~', 'b1 ~ ~ ~ f#2 ~ ~ ~',
                'e2 ~ ~ ~ b2 ~ ~ ~', 'c2 ~ ~ ~ g2 ~ ~ ~',
                'a1 ~ ~ ~ e2 ~ ~ ~', 'b1 ~ ~ f#2 ~ a2 ~ ~']
const B_MEL = ['b3 ~ ~ ~ e4 ~ g4 ~', 'g4 ~ f#4 ~ e4 ~ ~ ~',
               '~ e4 ~ ~ c4 ~ b3 ~', '~ ~ ~ d#4 ~ f#4 ~ ~',
               'b3 ~ ~ ~ e4 ~ g4 ~', 'g4 ~ f#4 ~ e4 ~ c4 ~',
               '~ e4 ~ ~ c4 ~ b3 ~', 'a3 ~ ~ b3 ~ d#4 ~ f#4']
const B_CNT = ['b4 g4', 'g4 e4', 'e4 c4', 'f#4 d#4',
               'b4 g4', 'g4 b4', 'a4 e4', 'f#4 a4']

// Coda: home, with the minor-iv goodbye — G Cm G G
const O_CH = ['g3,b3,d4', 'c3,eb3,g3', 'g3,b3,d4', 'g2,d3,g3,b3']
const O_ARP = ['g3 d4 b3 g4 d4 b3 d4 b3', 'c3 g3 eb3 c4 g3 eb3 g3 eb3',
               'g3 d4 b3 g4 d4 b3 d4 b3', 'g3 ~ d4 ~ b3 ~ g4 ~']
const O_HARP = ['~ ~ ~ ~ b5 a5 g5 ~', '~ ~ ~ ~ ~ eb5 ~ d5',
                '~ ~ ~ ~ b4 a4 g4 ~', '~ ~ ~ ~ ~ ~ g5 ~']

// ---- voices -----------------------------------------------------------
const jangle = (phrase, amp) => note(m(phrase)).s("piano")
  .clip(1.2).gain(amp).room(0.35).pan(-0.15)
const bassV = (phrase) => note(m(phrase)).s("triangle")
  .lpf(420).clip(0.95).release(0.12).gain(0.5)
const shyLead = (phrase, amp) => note(m(phrase)).s("triangle")
  .lpf(1900).vib(4.5).vmod(0.06).clip(0.9).release(0.2)
  .gain(amp).room(0.45).pan(0.1)
const harpEcho = (phrase, amp) => note(m(phrase)).s("folkharp")
  .clip(1.5).gain(amp).room(0.6).pan(0.3)
const organCnt = (phrase, amp) => note(m(phrase)).s("organ_full")
  .lpf(1100).attack(0.08).clip(1).release(0.3)
  .gain(amp).room(0.4).pan(-0.25)
const padSoft = (chord, amp) => note(m(chord)).s("organ_full")
  .lpf(750).attack(0.25).clip(1.6).release(0.4).gain(amp).room(0.5)

// ---- drums (CR-78: soft organ-box brushes; none in intro/coda) --------
const kickV = s("bd ~ ~ bd ~ ~ ~ ~").bank("RolandCompurhythm78")
  .clip(1.6).release(0.3).gain(0.5)
const snrV = s("~ ~ ~ ~ sd ~ ~ ~").bank("RolandCompurhythm78")
  .clip(1.8).release(0.3).gain(0.26).room(0.3)
const hatV = s("~ hh ~ hh ~ hh ~ hh").bank("RolandCompurhythm78")
  .clip(1.4).gain(0.16)
const kickC = s("bd ~ ~ ~ bd ~ ~ ~").bank("RolandCompurhythm78")
  .clip(1.6).release(0.3).gain(0.52)
const snrC = s("~ ~ sd ~ ~ ~ sd ~").bank("RolandCompurhythm78")
  .clip(1.8).release(0.3).gain(0.28).room(0.3)
const hatC = s("hh hh ~ hh hh hh ~ hh").bank("RolandCompurhythm78")
  .clip(1.4).gain(0.15)
const shakerB = s("~ shaker ~ shaker ~ shaker ~ shaker")
  .clip(1.4).gain(0.14).room(0.35)
const tambP = s("~ ~ tambourine ~ ~ ~ tambourine ~")
  .clip(1.5).release(0.25).gain(0.2).room(0.4)

// ---- sections ----------------------------------------------------------
const introSeg = (i) => stack(
  jangle(V_ARP[i % 8], 0.3),
  harpEcho(V_HARP[i % 8], 0.22),
  padSoft(V_CH[i % 8], 0.1)
)
const verseSeg = (i, echo) => stack(
  jangle(V_ARP[i % 8], 0.34),
  bassV(V_BASS[i % 8]),
  shyLead(V_MEL[i % 8], 0.3),
  echo ? harpEcho(V_HARP[i % 8], 0.2) : silence,
  kickV, snrV, hatV
)
const chorusSeg = (i, lvl) => stack(
  jangle(C_ARP[i % 8], 0.36),
  bassV(C_BASS[i % 8]),
  lvl > 0 ? shyLead(C_MEL[i % 8], 0.32) : silence,
  organCnt(C_CNT[i % 8], lvl > 0 ? 0.17 : 0.2),
  lvl >= 2 ? harpEcho(C_HARP[i % 8], 0.2) : silence,
  lvl >= 3 ? tambP : silence,
  kickC, snrC, lvl > 0 ? hatC : hatV
)
const bridgeSeg = (i) => stack(
  jangle(B_ARP[i % 8], 0.32),
  bassV(B_BASS[i % 8]),
  shyLead(B_MEL[i % 8], 0.28),
  organCnt(B_CNT[i % 8], 0.16),
  padSoft(B_CH[i % 8], 0.09),
  shakerB
)
const codaSeg = (i) => stack(
  jangle(O_ARP[i % 4], 0.28),
  harpEcho(O_HARP[i % 4], 0.2),
  padSoft(O_CH[i % 4], 0.11)
)

slowcat(
  ...Array.from({ length: 4 }, (_, k) => introSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => verseSeg(k, false)),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k, 1)),
  ...Array.from({ length: 8 }, (_, k) => verseSeg(k, true)),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k, 2)),
  ...Array.from({ length: 8 }, (_, k) => bridgeSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k, 3)),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k, 0)),
  ...Array.from({ length: 4 }, (_, k) => codaSeg(k))
)`
