// Forty-Seven Saved Voicemails
// Sadgirl Trap (bedroom voicemail soul) · early 2020s late-night internet · melancholy, numb, quietly aching

// Genre: Sadgirl Trap (bedroom voicemail soul)
// Era: early 2020s late-night internet
// Mood: melancholy, numb, quietly aching
// Sounds: 808 sub (sine), Rhodes chords, triangle lead, TR808 kick/clap/hats, vinyl crackle
// Sound choice: Rhodes warmth + 808 sub + halftime TR808 = intimate sad girl trap
setcps(0.58)

stack(
  // 808 sub bass following chord roots, halftime hits
  note("<c2 ab1 f1 g1>")
    .struct("x ~ ~ x ~ ~ x ~")
    .s("sine").lpf(120)
    .attack(0.01).decay(0.22).sustain(0.55).release(0.12)
    .gain(0.85).shape(0.2),

  // Rhodes chords: Cm9 - Abmaj7 - Fm9 - G7b9 (V7b9 pulls back home)
  note("<[c3,eb3,g3,bb3,d4] [ab2,c3,eb3,g3] [f2,ab2,c3,eb3,g3] [g2,b2,d3,f3,ab3]>")
    .s("rhodes")
    .attack(0.02).release(0.7)
    .lpf(sine.range(900,2300).slow(8))
    .room(0.45).gain(0.4),

  // Triangle lead motif: a falling sigh, developed and answered each cycle
  note("<[g4 ~ eb4 d4 ~ c4 ~ ~] [eb4 ~ c4 bb3 ~ ~ ~ ~] [ab4 ~ f4 eb4 ~ c4 ~ ~] [d4 ~ ~ b3 ~ d4 ~ ~]>")
    .s("triangle").lpf(1800)
    .room(0.5).delay(0.3).delaytime(0.375).delayfeedback(0.32)
    .gain(0.32),

  // TR808 kick, halftime trap placement
  s("bd ~ ~ bd ~ ~ bd ~").bank("RolandTR808")
    .gain(0.9).shape(0.15),

  // Clap on the halftime backbeat
  s("~ ~ ~ ~ cp ~ ~ ~").bank("RolandTR808")
    .gain(0.55).room(0.25),

  // Rolling hats with trap stutter variation
  s("hh*8").bank("RolandTR808")
    .gain("0.3 0.18 0.24 0.18 0.3 0.18 0.4 0.2")
    .sometimesBy(0.22, x=>x.fast(2))
    .every(8, x=>x.fast(2).gain(0.22)),

  // Vinyl crackle for bedroom intimacy
  s("vinyl").gain(0.04)
)
