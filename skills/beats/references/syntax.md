# Strudel syntax — the five fatal rules, in full

Each rule below, violated, produces a song that validates fine and then plays silently or
wrong in the browser. Numbered to match SKILL.md.

## 1. Wrap every VARIABLE passed to `note()`/`s()` in `m()`

The transpiler auto-parses string **literals** as mini-notation, so `note("c3,e3,g3")` works.
A string held in a **variable** (array entry, function parameter) is not auto-parsed — the raw
string reaches the note parser, which only reads single note names, and the song throws
`not a note: "f#2,a3,c#4,g#4"` and goes silent. `m` is the transpiler's own mini-notation
function, always in scope — wrapping the variable in it restores the parse.

**Wrong — raw variable, plays nothing:**
```js
const CH = ['f#2,a3,c#4,g#4', 'e2,g#3,b3,d#4']
const pad = (chord) => note(chord).s("piano")        // "not a note" → silent
```
**Correct:**
```js
const pad = (chord) => note(m(chord)).s("piano")     // m() parses the comma-chord into a stack
```

Applies to chords, melodies, single roots, and sound names held in variables. Literals stay
bare (`note("c4 e4 g4")`). Numbers stay bare — never `m()` a number: `note(12)`, `.add(note(-12))`.

**The quote rule that makes this work: double quotes ONLY directly inside `note()`/`s()`/pattern
methods (`.struct()`, `.gain()`); single quotes for note material stored ANYWHERE else.** The
transpiler converts every double-quoted (and backtick) literal into a pattern wherever it appears
— inside arrays, in `const phrase = "..."` definitions, and in helper-call arguments. Any of those
is ALREADY a pattern, and wrapping it in `m()` crashes at play time (`not a note: "Object"` /
`cannot parse as numeral: "Object"`).

**Wrong — double-quoted array elements / helper args, then m()-wrapped:**
```js
const RIFF = ["e2 g2 bb2 a2", "e2 g2 c3 b2"]        // transpiler makes these PATTERNS in place
const fuzz = (riff) => note(m(riff)).s("sawtooth")   // m(pattern) → "not a note: Object"
fuzz("c2 d2 e2")                                     // same crash — dq arg is already a pattern
```
**Correct — single quotes in the array/arg, one m() at the boundary:**
```js
const RIFF = ['e2 g2 bb2 a2', 'e2 g2 c3 b2']         // plain strings
const fuzz = (riff) => note(m(riff)).s("sawtooth")   // m(string) → parsed exactly once
fuzz('c2 d2 e2')
```

## 2. Chord progressions must advance through `slowcat` — the per-cycle segment recipe

Never put a progression in top-level `<...>` (or `.slow(N)`) and repeat that variable across
`slowcat` entries — the chords freeze on the first one.

Why: `slowcat(p0…p_{N-1})` plays entry `t mod N` at global cycle `t` but queries it at cycle
`floor(t / N)`. For the whole first pass every entry is queried at cycle 0, and `<a b c d>` at
cycle 0 is always `a` — your verse plays its first chord for the entire song.

**Wrong — every cycle plays Fmaj9:**
```js
const rhodesVerse = note("<[f3,a3,c4] [d3,f3,a3] [bb2,d3,f3] [c3,e3,g3]>").s("rhodes")
const verse = stack(rhodesVerse, drums, motif)
slowcat(verse, verse, verse, verse /* …×12 — all 12 cycles = Fmaj9 */)
```

**Correct — emit ONE literal chord per slowcat entry** via a progression array + per-cycle
segment builder, spread with `Array.from`. Scales to long arrangements; chords always advance:
```js
const VERSE_CH = ['f3,a3,c4', 'd3,f3,a3', 'bb2,d3,f3', 'c3,e3,g3']
const VERSE_RT = ['f2', 'd2', 'bb1', 'c2']
const verseSeg = (i, ...leads) => stack(
  note(m(VERSE_CH[i % 4])).s("rhodes").gain(0.4),
  note(m(VERSE_RT[i % 4])).struct("x ~ x ~").s("triangle").gain(0.5),
  ...leads,
  drumsVerse
)
slowcat(
  ...Array.from({ length: 12 }, (_, k) => verseSeg(k, motifFull)),
  ...Array.from({ length: 8 },  (_, k) => chorusSeg(k, motifLift)),
)
```
Pass a continuous index (`globalCycle % progLen`) instead of `k` for a vamp that keeps cycling
across section boundaries. For short songs, one named variable per chord listed in slowcat
(`slowcat(verseC, verseF, …)`) is the same idea, more verbose.

**When `<...>` IS correct:** a single, continuously-playing layer that is never repeated
through slowcat — e.g. a hypnotic/evolving track that is one `stack(...)` played straight.
The moment that layer becomes a repeated slowcat entry, it freezes.

**This applies to EVERY per-cycle `<...>` value, not just chords** — `.begin("<0.1 0.3>")`,
`.speed("<1 1.2>")`, `.lpf("<400 800>")` all freeze on their first entry when the pattern sits
inside repeated slowcat entries. Rotate any such value the same way: an array indexed by the
segment's cycle parameter (`.begin(m(WINDOWS[i % 4]))`).

## 3. Never do arithmetic on a comma-chord

`.add`/`.sub`/`.mul`/`.mod`/`.range` route values through `parseNumeral`, which accepts only a
number or a single note name. A comma-chord like `"d3,g3,b3"` throws
`cannot parse as numeral: "d3,g3,b3"` and the song goes silent.

**Wrong:** `note(m(chord)).add(note(-12))` — transposing a chord at runtime.
**Correct:** spell the transposed chord out as a literal in its own array:
```js
const PAD_LO = ['d2,g2,b2', 'c2,eb2,g2' /* … one octave down, written out */]
```
Numeral ops are fine on single-note patterns: `note("c2").add(note(12))`, `n("0 2 4").add(7)`.

## 4. Never interpolate variables into mini-notation strings

A variable holding a note/chord becomes a pattern; interpolating it into a template literal
stringifies the pattern into invalid mini-notation → `[mini] parse error`, silence.

**Wrong:** ``note(`${n} ~ ~ ${n}`)``
**Correct:** `note(m(phrase)).struct("x ~ ~ x")` — mini-notation strings are always literal text; the variable goes through `note(m(...))`, the rhythm through a literal `.struct()`.

## 5. Never shadow `m` or other builtins

The transpiler rewrites every quoted string into a call to `m(...)`, and rule 1 has you calling `m()` yourself — a variable or parameter named `m` shadows it and every string in scope throws "m is not a function". Also avoid naming anything `n`, `s`, `note`, `stack`,`sound`, `slowcat`. Prefer `phrase`, `chord`, `root`, `voice`.

---

## Minor rules

- `note()` first, then `.s()`: `note("c4 e4 g4").s("piano")`. The reverse (`s("piano").note(...)`) sticks on the first note. Effects chain after: `.gain(0.5).room(0.6)`.
- Rests with `~`: `note("c4 ~ e4 ~")`. Repetition with `[...]*n`: `note("[c4 e4 g4]*2")`.
