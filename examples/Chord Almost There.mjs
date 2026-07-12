// You're Almost There
// Hand-on-Your-Back Gospel House · Contemporary (warm, uplifting electronic-soul) · Encouraging, building, joyful — a friend running beside you to the finish line

// Genre: Hand-on-Your-Back Gospel House
// Era: Contemporary uplifting electronic-soul
// Mood: Encouraging, building, joyful
// Sounds: rhodes chords, organ_full pad, sawtooth bass, 909 kick/clap/hh, sawtooth lead
// Sound choice: warm Rhodes+organ harmony, crowd-like claps, and a lead that climbs higher each bar to feel like cheering someone on

setcps(0.5)

const cG  = "g3,b3,d4,f#4"
const cBb = "bb3,d4,f4,a4"
const cC  = "c4,e4,g4,b4"
const cD  = "d3,f#3,a3,c#4"

const mG  = "~ d4 ~ g4 b4 ~ a4 g4"
const mBb = "~ d4 ~ f4 bb4 ~ a4 f4"
const mC  = "~ e4 ~ g4 c5 ~ b4 g4"
const mD  = "~ f#4 ~ a4 d5 ~ c#5 a4"

const fullDrums = stack(
  s("bd*4").bank("RolandTR909").gain(0.55),
  s("~ cp ~ cp").gain(0.4),
  s("hh*8").bank("RolandTR909").gain(0.16).pan(sine.range(-0.3,0.3).fast(2))
)
const lightDrums = stack(
  s("bd ~ bd ~").bank("RolandTR909").gain(0.5),
  s("hh*4").bank("RolandTR909").gain(0.14)
)

const intro = (ch, root) => stack(
  note(ch).s("rhodes").gain(0.38).lpf(1600).room(0.4).attack(0.02),
  note(root).s("sine").gain(0.4).lpf(300)
)
const build = (ch, root) => stack(
  note(ch).s("rhodes").gain(0.4).lpf(1900).room(0.3),
  note(root).s("sawtooth").gain(0.42).lpf(420).struct("x ~ x ~ x ~ x x"),
  lightDrums
)
const full = (ch, root, mel) => stack(
  note(ch).s("rhodes").gain(0.36).lpf(2200).room(0.3),
  note(ch).s("organ_full").gain(0.16).lpf(1600).attack(0.05),
  note(root).s("sawtooth").gain(0.45).lpf(460).struct("x ~ x ~ x ~ x x"),
  fullDrums,
  note(mel).s("sawtooth").gain(0.3).lpf(2600).room(0.35).delay(0.2)
)
const intimate = (ch, root, mel) => stack(
  note(ch).s("rhodes").gain(0.4).lpf(1800).room(0.5),
  note(root).s("sine").gain(0.4).lpf(300),
  note(mel).s("triangle").gain(0.3).lpf(2000).room(0.4)
)

slowcat(
  intro(cG,"g2"),intro(cBb,"bb2"),intro(cC,"c3"),intro(cD,"d3"),
  intro(cG,"g2"),intro(cBb,"bb2"),intro(cC,"c3"),intro(cD,"d3"),
  build(cG,"g2"),build(cBb,"bb2"),build(cC,"c3"),build(cD,"d3"),
  build(cG,"g2"),build(cBb,"bb2"),build(cC,"c3"),build(cD,"d3"),
  full(cG,"g2",mG),full(cBb,"bb2",mBb),full(cC,"c3",mC),full(cD,"d3",mD),
  full(cG,"g2",mG),full(cBb,"bb2",mBb),full(cC,"c3",mC),full(cD,"d3",mD),
  full(cG,"g2",mG),full(cBb,"bb2",mBb),full(cC,"c3",mC),full(cD,"d3",mD),
  full(cG,"g2",mG),full(cBb,"bb2",mBb),full(cC,"c3",mC),full(cD,"d3",mD),
  intimate(cG,"g2",mG),intimate(cBb,"bb2",mBb),intimate(cC,"c3",mC),intimate(cD,"d3",mD),
  intimate(cG,"g2",mG),intimate(cBb,"bb2",mBb),intimate(cC,"c3",mC),intimate(cD,"d3",mD),
  full(cG,"g2",mG),full(cBb,"bb2",mBb),full(cC,"c3",mC),full(cD,"d3",mD),
  full(cG,"g2",mG),full(cBb,"bb2",mBb),full(cC,"c3",mC),full(cD,"d3",mD),
  full(cG,"g2",mG),full(cBb,"bb2",mBb),full(cC,"c3",mC),full(cD,"d3",mD),
  full(cG,"g2",mG),full(cBb,"bb2",mBb),full(cC,"c3",mC),full(cD,"d3",mD),
  intro(cG,"g2"),intro(cBb,"bb2"),intro(cC,"c3"),intro(cD,"d3"),
  intro(cG,"g2"),intro(cBb,"bb2"),intro(cC,"c3"),intro(cD,"d3")
)
