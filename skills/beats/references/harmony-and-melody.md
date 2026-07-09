# Harmony & melody

## Why harmony matters
A good song prioritizes, in order: **harmony → rhythm → texture → atmosphere**. Drums alone do
not make music; a beat without harmony is a demo, not a song.

Harmony must be intentional and cohesive — but intentional does not mean obvious, and clarity
does not mean predictability. Choose harmony that fits the concept rather than reaching for the
most familiar loop. You don't need to name roman numerals in code, but you must:
- choose a tonal center (or a deliberate modal / ambiguous center)
- imply harmony consistently across voices
- let melody outline AND contrast the harmony — non-chord tones that resolve add character

Random pitch without harmonic intent sounds bad — but "harmonic intent" includes modal color,
borrowed chords, and chromatic motion, not only safe diatonic choices.

### Expressing harmony in Strudel
```js
// chord tones via stacked notes — top-level <...> is for continuous layers ONLY,
// never repeated through slowcat (see syntax.md rule 2)
note("<[c3,e3,g3] [a2,c3,e3] [f2,a2,c3] [g2,b2,d3]>")
// bass outlining roots
note("c2 a1 f1 g1").slow(4).s("sawtooth").lpf(200)
// pads holding long notes
note("[c3,e3,g3]").slow(8).s("triangle").room(0.3)
// arpeggios implying chords
note("c3 e3 g3 c4 g3 e3").fast(2)
```
Keep the scale consistent across voices (if the harmony is C major, bass and pads use C-major
tones) — avoid random chromatic notes that clash.

### Lock the bass to the harmony (the #1 alignment failure)
The bass is the ear's reference for the chord — a bass note that isn't in the current chord makes
the whole harmony sound "wrong," even when the chords themselves are good. Derive the bass FROM the
progression; do not compose a "melodic bassline" independently and hope it fits.
- Pull the bass from the SAME progression that drives the chords (same array, same index). Its
  default note is the chord ROOT; use the 5th, 3rd, or octave for movement.
- Any non-chord bass note must be a brief passing/approach tone that lands on a chord tone on the
  next strong beat — never let the bass sit or land on a note outside the current chord.
- A non-root bass is fine when it's a CHOSEN inversion/slash chord (e.g. `"e2"` under C = C/E),
  named in your plan — not an accident of an independently-written line.
- Test it: mentally play the bass against each chord of the progression. If any bar clashes, fix
  the bass, not the chord.

---

## Writing melodies with craft (not scale runs)
A predictable melody is the #1 thing that makes a song feel generic. Avoid stepwise diatonic runs
and aimless wandering. Apply these when the genre calls for melodic content:

- **Motif, then development.** Write ONE short, distinctive gesture (2–4 notes/rhythms) and
  develop it across the song — transpose, invert, fragment, re-rhythm, sequence. A memorable hook
  is one idea varied, NOT a new line each section.
- **Give it a contour.** Shape the phrase: question-and-answer, a rising arc, a single climax note
  that appears only once. The line should go somewhere, not meander.
- **Steps AND leaps.** Mix stepwise motion with deliberate leaps (4ths, 5ths, octaves). Pure
  steps = dull; pure leaps = aimless.
- **Target tension tones.** Land on then resolve non-chord tones — 9ths, #11, 13ths, b9,
  suspensions, chromatic passing/neighbor notes. Character lives in the "wrong" notes that resolve
  right; pure chord-tone melodies sound like exercises.
- **Rhythm is half the melody.** Syncopate, displace the phrase start off the downbeat, push and
  pull against the grid, use ties. Same pitches + different rhythm = a different melody. Use rests
  as expressive phrasing, not filler.
- **Call-and-response and space.** Phrase like a conversation — a statement, then an answer or
  echo, possibly in another voice/octave. Leave room to breathe.
- **Sound & layering.** Use sawtooth/triangle (shaped with `lpf`) or melodic samples; layer
  harmony by stacking lines at different octaves. Don't default to purely percussive patterns.

Develop a line over a full phrase with rhythm and rests rather than a couple of notes on repeat —
but do NOT cram in a long stepwise scale run:
`note("c4 ~ e4 g4 ~ c5 ~ g4").s("piano")` rather than `note("c4 d4 e4 f4 g4 a4 b4 c5").s("piano")`.

---

## Harmonic vocabulary & adventure

**Voicings** (comma-separated chord tones):
- Basic triad: `"c3,e3,g3"` (C major)
- Seventh: `"c3,e3,g3,b3"` (Cmaj7)
- Ninth: `"c3,e3,g3,b3,d4"` (Cmaj9)
- Eleventh: `"c3,e3,g3,b3,f4"` (Cmaj11)
- Suspended: `"c3,f3,g3"` (Csus4)
- Minor seventh: `"c3,eb3,g3,bb3"` (Cm7)

**Go beyond the obvious progression.** The default I–V–vi–IV (C–G–Am–F) and i–bVI–bIII–bVII loops
are clichés — avoid them unless the genre genuinely demands that simplicity. Aim for at least one
non-diatonic or borrowed chord per progression. Reach for, AS FITS THE GENRE:
- **Modal color** — pick a mode (Dorian, Phrygian, Lydian, Mixolydian), not just plain major/minor.
- **Modal interchange / borrowed chords** — bVII, bVI, iv-in-major, the Mixolydian bVII.
- **Secondary dominants** — V/vi, V/V to pull toward a target chord.
- **Chromatic mediants** — C → Ab, C → E (cinematic, dreamy, unexpected).
- **Non-functional / static harmony** — pedal points, one-chord vamps, quartal voicings (stacked
  4ths) for techno, ambient, modal, hypnotic styles.
- **Slash chords & inversions** — moving bass under static harmony (e.g. `"g2,c3,e3"` for C/G).

**Match sophistication to genre** — a jazz ballad wants extended/altered chords; a four-on-the-
floor house track wants a simple hypnotic riff over a static or two-chord vamp, NOT jazz harmony.
Pick the right complexity for the concept. And sophistication is never layer count: put the
ambition into the chords and the motif, voiced with restraint (see `musical-taste.md` → Balance).

---

## Melodic anti-patterns
- No 3+ consecutive rests in an ACTIVE melodic line (sounds choppy) — sparse/ambient styles are
  exempt; there, space is the point.
- No repetitive copy-paste without variation.

## Atmospheric & ambient styles
- Embrace space and silence; long attack/release (`.attack(0.4).release(0.8)`).
- Layer subtle textures (pads, filtered noise, sparse melodies); heavy reverb (`.room(0.8–1.5)`).
- Slow-moving LFOs (`sine.range().slow(8)`); irregular/sparse rhythms; extended voicings (9ths/11ths).

## Danceability (where the genre calls for it)
- Strong, consistent kick on downbeats; clear hi-hat/snare foundation.
- 90–130 BPM works for most dance genres (set via `setcps`).
- Percussive accents (shaker, cp, rim); bass locked to the kick.
- Energy through build-ups, drops, and dynamic variation.
