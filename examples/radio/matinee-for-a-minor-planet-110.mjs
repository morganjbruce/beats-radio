export const title = 'Matinee for a Minor Planet'
export const genre = 'theatrical piano ballad — Hunky Dory-era glam art-pop lineage, 1971, ~64 BPM'
export const mood = 'A kid at an upright piano dreaming the room into a proscenium, each phrase reaching one rung higher than the last. Chromatic bass sinks under steady chords while the melody climbs, until the key lifts a whole step and the roof comes off on one long held note. Then the lights come down and the piano is alone again.'
export const cycles = 64
export const model = 'claude-fable-5'
export const prompt = 'hunky dory bowie — piano theatre ballad, life on mars territory, climbing melody, chromatic bass'
export const author = 'morgan'

export const code = `setcps(64/240)

// ---------- F major: verse — chromatic bass descent F E Eb D Db C B C ----------
const VERSE_CH = ['f2,a3,c4,f4','e2,g3,c4,e4','eb2,a3,c4,eb4','d2,bb3,d4,f4','db2,bb3,db4,f4','c2,a3,c4,f4','b1,g3,b3,f4','c2,g3,c4,e4']
const VERSE_AR = ['f3 a3 c4 f4 a4 f4 c4 a3','e3 g3 c4 e4 g4 e4 c4 g3','eb3 a3 c4 eb4 a4 eb4 c4 a3','d3 f3 bb3 d4 f4 d4 bb3 f3','db3 f3 bb3 db4 f4 db4 bb3 f3','c3 f3 a3 c4 f4 c4 a3 f3','b2 d3 g3 b3 f4 b3 g3 d3','c3 e3 g3 c4 e4 c4 g3 e3']
const VERSE_RT = ['f1','e1','eb1','d1','db1','c1','b1','c1']
const VERSE_ML = ['~ c4 f4 ~ g4 a4 ~ ~','g4 ~ e4 ~ c4 ~ ~ ~','~ c4 f4 a4 ~ bb4 ~ ~','bb4 ~ f4 ~ d4 ~ ~ ~','~ db4 ~ f4 ~ ~ ~ ~','~ c4 ~ f4 g4 a4 ~ ~','b4 ~ g4 ~ f4 ~ d4 ~','c4']

// ---------- D minor: the doubt verse — descent D C# C B Bb A G A ----------
const DOUBT_CH = ['d2,f3,a3,d4','cs2,f3,a3,d4','c2,f3,a3,d4','b1,f3,a3,d4','bb1,f3,bb3,d4','a1,g3,cs4,e4','g1,g3,bb3,d4','a1,g3,cs4,e4']
const DOUBT_AR = ['d3 f3 a3 d4 f4 d4 a3 f3','cs3 f3 a3 d4 f4 d4 a3 f3','c3 f3 a3 d4 f4 d4 a3 f3','b2 f3 a3 d4 f4 d4 a3 f3','bb2 f3 bb3 d4 f4 d4 bb3 f3','a2 e3 g3 cs4 e4 cs4 g3 e3','g2 bb2 d3 g3 bb3 g3 d3 bb2','a2 e3 g3 cs4 e4 g4 e4 cs4']
const DOUBT_RT = ['d1','cs1','c1','b1','bb1','a1','g1','a1']
const DOUBT_ML = ['~ a3 d4 ~ e4 f4 ~ ~','f4 ~ e4 ~ d4 ~ ~ ~','~ a3 d4 f4 ~ g4 ~ ~','g4 ~ f4 ~ d4 ~ ~ ~','~ bb3 ~ d4 ~ f4 ~ ~','e4 ~ cs4 ~ a3 ~ ~ ~','~ bb3 ~ d4 ~ g4 ~ ~','a4 ~ e4 ~ cs4 ~ ~ ~']

// ---------- pre-chorus: secondary dominant chain A7 -> Dm -> G7 -> C7 ----------
const PRE_CH = ['a1,g3,cs4,e4','d2,f3,a3,d4','g1,f3,b3,d4','c2,e3,g3,bb3']
const PRE_PD = ['a2,cs3,g3','d3,f3,a3','g2,d3,f3','c3,e3,bb3']
const PRE_RT = ['a1','d2','g1','c2']
const PRE_ML = ['~ cs4 e4 ~ g4 ~ a4 ~','a4 ~ f4 ~ d4 ~ ~ ~','~ d4 ~ f4 g4 b4 ~ ~','c5 ~ ~ ~ bb4 ~ g4 ~']

// ---------- chorus in F: Bb C F/A Dm Bb Bbm(iv) F/C C7 ----------
const CHO_CH = ['bb1,f3,bb3,d4','c2,g3,c4,e4','a1,f3,a3,c4','d2,f3,a3,d4','bb1,f3,bb3,d4','bb1,f3,bb3,db4','c2,f3,a3,c4','c2,g3,bb3,e4']
const CHO_PD = ['bb2,d3,f3','c3,e3,g3','a2,c3,f3','d3,f3,a3','bb2,d3,f3','bb2,db3,f3','c3,f3,a3','c3,e3,bb3']
const CHO_RT = ['bb1','c2','a1','d2','bb1','bb1','c2','c2']
const CH1_ML = ['~ f4 ~ bb4 c5 d5 ~ ~','c5 ~ g4 ~ e4 ~ ~ ~','~ a4 c5 ~ d5 ~ ~ ~','d5 ~ a4 ~ f4 ~ ~ ~','~ f4 bb4 d5 ~ ~ ~ ~','db5 ~ bb4 ~ f4 ~ ~ ~','~ a4 ~ c5 ~ d5 ~ ~','c5 ~ bb4 ~ g4 ~ e4 ~']
const CH2_ML = ['~ bb4 ~ d5 ~ f5 ~ ~','e5 ~ c5 ~ g4 ~ ~ ~','~ c5 ~ d5 ~ f5 ~ ~','f5 ~ d5 ~ a4 ~ ~ ~','~ bb4 d5 f5 ~ ~ ~ ~','f5 ~ db5 ~ bb4 ~ ~ ~','~ c5 ~ d5 ~ e5 ~ ~','e5 ~ ~ c5 ~ bb4 g4 ~']

// ---------- pivot: C7 then D7 — the roof opens, everything lifts a whole step ----------
const PIV_AR = ['c3 e3 g3 bb3 c4 e4 g4 bb4','d3 fs3 a3 c4 d4 fs4 a4 c5']
const PIV_PD = ['c3,e3,bb3','d3,fs3,c4']
const PIV_RT = ['c2','d2']

// ---------- final chorus in G: C D G/B Em C Cm(iv) G/D D7 ----------
const G_CH = ['c2,g3,c4,e4','d2,a3,d4,fs4','b1,g3,b3,d4','e2,g3,b3,e4','c2,g3,c4,e4','c2,g3,c4,eb4','d2,g3,b3,d4','d2,a3,c4,fs4']
const G_PD = ['c3,e3,g3','d3,fs3,a3','b2,d3,g3','e3,g3,b3','c3,e3,g3','c3,eb3,g3','d3,g3,b3','d3,fs3,c4']
const G_RT = ['c2','d2','b1','e2','c2','c2','d2','d2']
const G_AR = ['c3 g3 c4 e4 g4 e4 c4 g3','d3 a3 d4 fs4 a4 fs4 d4 a3','b2 g3 b3 d4 g4 d4 b3 g3','e3 g3 b3 e4 g4 e4 b3 g3','c3 g3 c4 e4 g4 e4 c4 g3','c3 g3 c4 eb4 g4 eb4 c4 g3','d3 g3 b3 d4 g4 d4 b3 g3','d3 fs3 a3 c4 fs4 a4 c5 d5']
const G_ML = ['~ g4 ~ c5 d5 e5 ~ ~','d5 ~ a4 ~ fs4 ~ ~ ~','~ b4 d5 ~ e5 ~ ~ ~','e5 ~ b4 ~ g4 ~ ~ ~','~ g4 c5 e5 ~ g5 ~ ~','g5 ~ eb5 ~ c5 ~ ~ ~','~ b4 ~ d5 ~ e5 ~ ~','~ d5 ~ e5 fs5 ~ g5 ~']

// ---------- climax extension: C Cm G/D G — the held highest note ----------
const EXT_CH = ['c2,g3,c4,e4','c2,g3,c4,eb4','d2,g3,b3,d4','g1,d3,g3,b3']
const EXT_PD = ['c3,e3,g3','c3,eb3,g3','d3,g3,b3','d3,g3,b3']
const EXT_RT = ['c2','c2','d2','g1']
const EXT_ML = ['a5','g5@5 eb5@2 c5@1','e5 ~ d5 ~ b4 ~ a4 ~','g4']

// ---------- intro: piano alone, previewing the descent F C/E Bb/D F/C ----------
const INT_CH = ['f2,a3,c4,f4','e2,g3,c4,e4','d2,bb3,d4,f4','c2,a3,c4,f4']
const INT_AR = ['f3 a3 c4 f4 a4 f4 c4 a3','e3 g3 c4 e4 g4 e4 c4 g3','d3 f3 bb3 d4 f4 d4 bb3 f3','c3 f3 a3 c4 f4 c4 a3 f3']

// ---------- outro: piano alone in G, sinking home ----------
const OUT_CH = ['g1,g3,b3,d4','fs2,a3,d4','e2,g3,b3,e4','c2,g3,c4,e4','c2,g3,c4,eb4','g1,d3,g3,b3']
const OUT_AR = ['g2 b2 d3 g3 b3 g3 d3 b2','fs2 a2 d3 fs3 a3 fs3 d3 a2','e2 g2 b2 e3 g3 e3 b2 g2','c3 e3 g3 c4 e4 c4 g3 e3','c3 eb3 g3 c4 eb4 c4 g3 eb3','g1 d2 b2 g3 b3 d4 g4 ~']

// ---------- voices ----------
const pianoChord = (chord, amt) => note(m(chord)).s("piano").gain(amt).release(0.4).room(0.35)
const pianoPush = (chord, amt) => note(m(chord)).struct("x ~ ~ ~ x ~ x ~").s("piano").gain(amt).clip(1.5).release(0.3).room(0.35)
const pianoArp = (line, amt) => note(m(line)).s("piano").gain(amt).clip(1.3).room(0.4)
const voiceLine = (line, amt) => note(m(line)).s("triangle").lpf(1500).attack(0.03).release(0.35).clip(1.4).vib(5).vmod(0.07).room(0.5).gain(amt)
const stringPad = (chord, amt) => note(m(chord)).s("sawtooth").lpf(720).attack(0.9).release(1.4).room(0.6).gain(amt)
const subBass = (root) => note(m(root)).s("sine").lpf(110).attack(0.04).release(0.5).gain(0.38)

// ---------- ballad kit (soft CR-78, ride from house kit) ----------
const kitFull = stack(
  s("bd ~ ~ ~ bd ~ ~ ~").bank("RolandCompurhythm78").gain(0.5).clip(1.6).release(0.3),
  s("~ ~ sd ~ ~ ~ sd ~").bank("RolandCompurhythm78").gain(0.3).clip(1.5).release(0.3),
  s("rd ~ rd ~ rd ~ rd ~").gain(0.15).clip(1.8).release(0.3)
)
const kitRide = s("rd ~ rd ~ rd ~ rd ~").gain(0.12).clip(1.8).release(0.3)
const kitThin = stack(
  s("bd ~ ~ ~ bd ~ ~ ~").bank("RolandCompurhythm78").gain(0.45).clip(1.6).release(0.3),
  s("rd ~ rd ~ rd ~ rd ~").gain(0.13).clip(1.8).release(0.3)
)

// ---------- segments ----------
const introSeg = (k) => stack(
  pianoChord(INT_CH[k % 4], 0.48),
  pianoArp(INT_AR[k % 4], 0.3)
)
const verseSeg = (k) => stack(
  pianoChord(VERSE_CH[k % 8], 0.5),
  pianoArp(VERSE_AR[k % 8], 0.3),
  voiceLine(VERSE_ML[k % 8], 0.36),
  subBass(VERSE_RT[k % 8])
)
const doubtSeg = (k) => stack(
  pianoChord(DOUBT_CH[k % 8], 0.44),
  pianoArp(DOUBT_AR[k % 8], 0.26),
  voiceLine(DOUBT_ML[k % 8], 0.3),
  subBass(DOUBT_RT[k % 8])
)
const preSeg = (k, kit) => stack(
  pianoPush(PRE_CH[k % 4], 0.48),
  voiceLine(PRE_ML[k % 4], 0.36),
  stringPad(PRE_PD[k % 4], 0.15),
  subBass(PRE_RT[k % 4]),
  kit
)
const chorusSeg = (k, melody) => stack(
  pianoPush(CHO_CH[k % 8], 0.5),
  voiceLine(melody[k % 8], 0.4),
  stringPad(CHO_PD[k % 8], 0.2),
  subBass(CHO_RT[k % 8]),
  kitFull
)
const pivotSeg = (k) => stack(
  pianoArp(PIV_AR[k % 2], 0.42),
  stringPad(PIV_PD[k % 2], 0.2),
  subBass(PIV_RT[k % 2])
)
const finalSeg = (k) => stack(
  pianoPush(G_CH[k % 8], 0.52),
  pianoArp(G_AR[k % 8], 0.26),
  voiceLine(G_ML[k % 8], 0.42),
  stringPad(G_PD[k % 8], 0.22),
  subBass(G_RT[k % 8]),
  kitFull,
  s("cr ~ ~ ~ ~ ~ ~ ~").gain(k === 0 ? 0.28 : 0).clip(2).release(0.3)
)
const extSeg = (k) => stack(
  pianoChord(EXT_CH[k % 4], 0.52),
  voiceLine(EXT_ML[k % 4], 0.42),
  stringPad(EXT_PD[k % 4], 0.2),
  subBass(EXT_RT[k % 4]),
  kitThin
)
const outroSeg = (k) => stack(
  pianoChord(OUT_CH[k % 6], 0.42),
  pianoArp(OUT_AR[k % 6], 0.26)
)

// ---------- arrangement: 4+8+4+8+8+4+8+2+8+4+6 = 64 cycles ----------
slowcat(
  ...Array.from({ length: 4 }, (_, k) => introSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => verseSeg(k)),
  ...Array.from({ length: 4 }, (_, k) => preSeg(k, silence)),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k, CH1_ML)),
  ...Array.from({ length: 8 }, (_, k) => doubtSeg(k)),
  ...Array.from({ length: 4 }, (_, k) => preSeg(k, kitRide)),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k, CH2_ML)),
  ...Array.from({ length: 2 }, (_, k) => pivotSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => finalSeg(k)),
  ...Array.from({ length: 4 }, (_, k) => extSeg(k)),
  ...Array.from({ length: 6 }, (_, k) => outroSeg(k))
)`
