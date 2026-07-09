// Tidal Waters
// Inspired by complex polyrhythmic atmospheres
// Original composition

setcps(92/60/4)

// Custom split function for pattern manipulation
const split = register('split', (deflt, callback, pat) => callback(deflt.map((d,i)=> pat.withValue((v)=>{
  const isobj = v.value !== undefined; const value = isobj ? v.value : v;
  const result = Array.isArray(value)?(i<value.length?value[i]:d):(i==0?value:d);
  return (i==0 && isobj) ? {...v,value:result} : result; }))));

// Chord voicings - minor/suspended harmonies
let chords = {
  A: "e2,b2,g3,b3,e4",      // Em11
  B: "d2,a2,f#3,a3,d4",     // Dmaj9
  C: "c2,g2,e3,g3,c4",      // Cmaj9
  D: "a2,e3,c3,e3,a3",      // Am7
  E: "g2,d3,b3,d4,g4",      // Gmaj7
  F: "f2,c3,a3,c4,f4",      // Fmaj9
}

// Main piano pattern - irregular groupings (3+3+2 feel)
let piano = "<[p1 p2 p3]@3 [p4 p5]@2 [p1 p2 p3]@3 [p4 p6]@2>/8".pickRestart({
  p1: "<[A:.7 A:.9] [B:.6 C:.7] [A:.8 A:.6]>/3",
  p2: "<[B:.5 C:.6] [D:.7 D:.8] [B:.6 C:.5]>/3",
  p3: "<[D:.8 E:.7] [A:.6 B:.7] [D:.7 E:.6]>/3",
  p4: "<[C:.6 D:.7] [E:.8 F:.6] [C:.7 D:.6]>/3",
  p5: "<[A:.9 B:.7] [C:.8 D:.6] [A:.8 B:.7]>/3",
  p6: "<[E:.7 F:.8] [D:.6 E:.7] [E:.8 A:.9]>/3",
}).split([0,.5],(x)=>x[0].pickOut(chords).velocity(x[1])).note().s("piano").gain(0.7).room(0.8).lpf(3000)

// Atmospheric pad layer - slow evolving texture
let pad = "<A B C D E F A D>/4".pickOut(chords).note().s("sawtooth")
  .attack(0.4).decay(0.3).sustain(0.6).release(0.8)
  .lpf(sine.range(400, 1200).slow(8))
  .gain(0.25).room(1.2).pan(sine.range(-0.3, 0.3).slow(7))

// High melodic fragments - appearing irregularly
let melody = "<~ ~ m1 ~ m2 ~@3 ~ m3 ~ ~ m1 ~@2 m2 ~ m3 ~@3>/8".pickRestart({
  m1: "e5 g5 b5 d5",
  m2: "b4 d5 g5 a5",
  m3: "a4 c5 e5 g5",
}).note().s("triangle").attack(0.1).release(0.3)
  .gain(0.35).lpf(2500).room(1.0).vib(4).vmod(0.08)

// Subtle percussion - minimal, spacious
let perc = "<~ ~ ~ [0,1] ~ ~@2 [0,2] ~@3 [1,3] ~ ~@2>/8".pick([
  "bd ~ ~ bd ~ ~",
  "~ ~ ~ rim",
  "~ shaker ~ ~",
  "~ ~ ~ oh"
]).s().gain(0.4).room(0.3)

// Bass - sparse, foundational
let bass = "<e2@4 ~ d2@3 ~ c2@4 ~ a1@3 ~ g1@4>/4"
  .note().s("sine").lpf(150).gain(0.6).attack(0.05).release(0.4)

stack(
  piano,
  pad,
  melody,
  perc,
  bass
)
