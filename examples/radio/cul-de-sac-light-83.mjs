export const title = 'Cul-de-Sac Light'
export const genre = 'indie rock — jaunty piano-shuffle anthem, motorik-adjacent 2010s Montreal lineage, ~120 BPM'
export const mood = 'Bike tires on warm asphalt at dusk, sprinklers ticking over lawns that felt safer than they were. Major-key brightness with a borrowed-minor ache folded inside, driving forward because standing still would mean remembering.'
export const cycles = 80
export const model = 'claude-fable-5'
export const prompt = 'arcade fire suburbs — jaunty heartbroken piano shuffle, driving indie rock'
export const author = 'morgan'
export const code = `setcps(0.5)

// D major, chromatic descending bass in the verse; borrowed iv (Gm) is the ache
const V_CH = ['d3,f#3,a3,d4', 'c#3,e3,a3,c#4', 'b2,d3,f#3,a3', 'bb2,d3,g3,a3']
const V_RT = ['d2', 'c#2', 'b1', 'bb1']
// chorus avoids the tonic: IV V vi iv — the Gm mode mixture lands in the melody too
const C_CH = ['g2,b2,d3,g3', 'a2,c#3,e3,a3', 'b2,d3,f#3,b3', 'g2,bb2,d3,g3']
const C_RT = ['g1', 'a1', 'b1', 'g1']
// bridge: chromatic mediant to F major, backdoor return through A7
const B_CH = ['f3,a3,c4', 'e3,g3,c4', 'g2,bb2,d3,g3', 'a2,c#3,e3,g3']
const B_RT = ['f2', 'e2', 'g1', 'a1']
// outro: plagal drift home, I - iv - IV - I
const O_CH = ['d3,f#3,a3,d4', 'bb2,d3,g3,a3', 'g2,b2,d3,g3', 'd3,f#3,a3,d4']
const O_RT = ['d2', 'bb1', 'g1', 'd2']

// ONE motif: f#4-a4-e4-d4 jaunty gesture, varied per chord
const MOT_V = ['f#4 ~ a4 [~ e4] ~ d4 ~ ~', 'e4 ~ a4 [~ e4] ~ c#4 ~ ~', 'f#4 ~ a4 [~ f#4] ~ d4 ~ ~', 'g4 ~ a4 [~ d4] ~ bb3 ~ ~']
// chorus lift: same gesture a fourth up, bb4 carries the mode mixture
const MOT_C = ['b4 ~ d5 [~ a4] ~ g4 ~ ~', 'c#5 ~ e5 [~ b4] ~ a4 ~ ~', 'b4 ~ d5 [~ a4] ~ f#4 ~ ~', 'bb4 ~ d5 [~ a4] ~ g4 ~ ~']
// bridge: motif fragmented, rising sequence toward the final chorus
const MOT_B = ['c5 ~ ~ a4 ~ ~ f4 ~', 'c5 ~ ~ g4 ~ ~ e4 ~', 'd5 ~ ~ bb4 ~ ~ g4 ~', 'e5 ~ ~ c#5 ~ ~ a4 ~']
// outro: motif comes home, softer
const MOT_O = ['f#4 ~ a4 [~ e4] ~ d4 ~ ~', 'g4 ~ a4 [~ d4] ~ bb3 ~ ~', 'g4 ~ b4 [~ a4] ~ d4 ~ ~', 'a4 ~ f#4 ~ ~ d4 ~ ~']

// drums: RolandR8 for the live-ish rock kit; single kick voice, quiet backbeat
const kick = s("bd ~ bd ~ bd ~ bd ~").bank("RolandR8").gain(0.9).clip(1.5)
const backbeat = s("~ ~ sd ~ ~ ~ sd ~").bank("RolandR8").gain(0.45).clip(1.4)
const hatsV = s("hh*8").bank("RolandR8").gain("0.3 0.18 0.26 0.18 0.3 0.18 0.26 0.2").clip(1.4)
const hatsC = s("hh hh hh hh hh hh oh hh").bank("RolandR8").gain("0.32 0.2 0.28 0.2 0.32 0.2 0.3 0.22").clip(1.4)
const shake = s("~ tambourine ~ tambourine").gain(0.26)
const crash = s("cr ~ ~ ~").gain(0.3).clip(2).room(0.3)

// voices
const shuffle = (chord, level) => note(m(chord)).struct("x ~ x [~ x] ~ x x ~").s("piano").gain(level).room(0.25).clip(1.2)
const held = (chord) => note(m(chord)).s("triangle").lpf(900).attack(0.15).release(0.5).gain(0.26).room(0.4)
const bassPulse = (root) => note(m(root)).struct("x ~ ~ x ~ ~ x ~").s("sawtooth").lpf(320).gain(0.55).clip(0.9)
const bassDrive = (root) => note(m(root)).struct("x*8").s("sawtooth").lpf(380).gain("0.55 0.4 0.5 0.4 0.55 0.4 0.5 0.45").clip(0.9)
const hook = (phrase, level) => note(m(phrase)).s("piano").gain(level).room(0.35).pan(0.15)
const hookDouble = (phrase) => note(m(phrase)).s("triangle").lpf(1600).gain(0.22).room(0.4).pan(-0.15)

// sections
const introSeg = (k) => stack(
  shuffle(V_CH[k % 4], 0.45),
  note(m(V_RT[k % 4])).struct("x ~ ~ ~ ~ ~ ~ ~").s("sine").lpf(120).gain(0.5).release(0.3),
  k >= 4 ? hatsV : silence
)

const verseSeg = (k) => stack(
  shuffle(V_CH[k % 4], 0.55),
  bassPulse(V_RT[k % 4]),
  kick, backbeat, hatsV,
  k >= 4 ? hook(MOT_V[k % 4], 0.45) : silence
)

const chorusSeg = (k, peak) => stack(
  shuffle(C_CH[k % 4], 0.6),
  held(C_CH[k % 4]),
  bassDrive(C_RT[k % 4]),
  kick, backbeat, hatsC, shake,
  hook(MOT_C[k % 4], 0.5),
  peak ? hookDouble(MOT_C[k % 4]) : silence,
  k === 0 ? crash : silence
)

const bridgeSeg = (k) => stack(
  note(m(B_CH[k % 4])).struct("x ~ ~ ~ x ~ ~ ~").s("piano").gain(0.5).room(0.35).clip(1.8),
  held(B_CH[k % 4]),
  bassPulse(B_RT[k % 4]),
  kick, hatsV,
  k >= 4 ? hook(MOT_B[k % 4], 0.42) : silence,
  k === 0 ? crash : silence
)

const outroSeg = (k) => stack(
  shuffle(O_CH[k % 4], 0.42),
  note(m(O_RT[k % 4])).struct("x ~ ~ ~ ~ ~ ~ ~").s("sine").lpf(120).gain(0.45).release(0.4),
  k < 4 ? hook(MOT_O[k % 4], 0.32) : silence
)

slowcat(
  ...Array.from({ length: 8 }, (_, k) => introSeg(k)),
  ...Array.from({ length: 12 }, (_, k) => verseSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k, false)),
  ...Array.from({ length: 12 }, (_, k) => verseSeg(k)),
  ...Array.from({ length: 8 }, (_, k) => chorusSeg(k, false)),
  ...Array.from({ length: 12 }, (_, k) => bridgeSeg(k)),
  ...Array.from({ length: 12 }, (_, k) => chorusSeg(k, true)),
  ...Array.from({ length: 8 }, (_, k) => outroSeg(k))
)`
