# Structure & length

## A song is not a loop
Aim for an arc matched to the concept's energy: **intro** (establish groove, set mood) → **main section** (harmony + rhythm established) → **variation** (harmony shifted, texture/density change) → **return or resolution**. Achieve it with pattern changes over cycles, density changes (adding/removing voices), filter sweeps, and harmonic tension/release. Even a 16-cycle piece needs a beginning, middle, and end.

---
## Structure approaches — choose by genre (don't blanket-default to one)

### Approach 1: slowcat sections with per-cycle segments — verse/chorus forms
- Arrange sections with `slowcat`, where each entry is one cycle built by a segment function pulling one literal chord from a progression array (`note(m(CH[i % 4]))`), spread with `Array.from`. This is the only reliable way to make chords progress through slowcat — the full recipe and the freeze trap it avoids are in `syntax.md` rule 2.
- Best for: pop, rock, soul, hip-hop, anthemic dance — anywhere clear contrasting sections are the point.

### Approach 2: natural evolution — generative/transforming patterns
- One continuous pattern that loops and evolves with `.every()`, `.someCycles()`, `.sometimes()`.
- `note("c3 d3 e3").s("piano").every(4, x => x.add(7))`
- Chords may cycle via a top-level `<...>` layer here (never repeated through slowcat).
- Best for: minimal, techno, house, ambient, dub, IDM, drone — forcing these into discrete slowcat sections kills the trance.

### Approach 3: layering different cycle lengths — phasing/polyrhythms
- Stack patterns of different lengths that phase over time: `stack(note("c e g").s("piano"), note("d f a b").s("sine"))` (3 vs 4).
- Best for: experimental, ambient, Steve-Reich-style phasing.

### Approach 4: probabilistic variation — seasoning, not a standalone structure
- `.sometimes()`, `.rarely()`, `.often()`: `s("bd sd").sometimes(x => x.fast(2))`
- Best as a seasoning on Approaches 1–3, not a structure by itself.

A continuously-evolving single pattern and a slowcat-arranged sectioned song are BOTH valid full songs — pick the one the genre actually wants.

---

## Song length

### Sectioned songs (Approach 1)
- Choose the target duration first, then calculate `cycles ≈ target seconds × cps`. For example,
  `setcps(90/60/4)` is 0.375 cps, so 68 cycles is about 3 minutes and 90 cycles is 4 minutes.
- Main sections usually last 8–16 cycles; intros, outros, and transitions may last 4–8.
- Lay the arrangement out as a cycle plan and spread it:
```js
const PLAN = [
  [introSeg, 4],
  [verseSeg, 8], [chorusSeg, 8],
  [verseSeg, 8], [chorusSeg, 8],
  [bridgeSeg, 8],
  [chorusSeg, 8], [chorusSeg, 8],
  [outroSeg, 8],
]  // 68 cycles — `cycles` in the artifact = this total
slowcat(...PLAN.flatMap(([seg, n]) => Array.from({ length: n }, (_, k) => seg(k))))
```

### Evolving / generative songs (Approaches 2–4)
- Length is driven by gradual change rather than section counts — 1–2 minutes is fine if the vibe is minimal/experimental. Still shape a beginning, development, and end, and derive `cycles` from the target duration and cps.

### The `cycles` artifact field
`cycles` is the playback horizon: for `slowcat` songs it is the total number of entries; for continuously evolving songs it is `target seconds × cps`. The radio player advances on the cycle boundary after that count.
