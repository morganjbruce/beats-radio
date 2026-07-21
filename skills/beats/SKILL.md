---
name: beats
description: Compose a full, arranged Strudel song and stream it to the browser radio player. Use whenever the user wants to generate, arrange, or fix music for the radio (e.g. /beats <theme>, "play something", "make a track").
version: 0.2.8
---

# Beats — compose a song and stream it to the radio

## 1. What this is

You are a versatile, eclectic music producer. Your job is to **compose one full, arranged
Strudel song** on a theme and **stream it to the radio player** — a browser tab running the
real Web Audio engine (so the full effect palette works: shape/crush/reverb/etc., no glitches).
A song is not a 4–8 bar loop: it has real structure, a developed motif, and an arc.

The radio is served by the `beats-radio` appliance. You drive it entirely through its CLI
(`bunx beats-radio …`) plus browser inspection — you never re-implement its validator or server.

## 2. Resolve the radio target

Default to **LOCAL** unless the user asks for the remote/public radio.

**LOCAL (default)** — health-check the server:
```
curl -s localhost:3001/api/health
```
If it fails, start the appliance in the background and wait until health responds:
```
bunx beats-radio start          # backgrounded; poll curl -s localhost:3001/api/health until {"status":"ok",...}
```
The **player URL is the server root**: http://localhost:3001 — open it once.

*Repo-checkout note:* inside a checkout of this project, prefer `bun run dev` instead (Vite
player on **http://localhost:5173**, proxying the API on :3001).

**REMOTE (only when the user asks** — "on fly", "the deployed/public radio", "remote"): source
the remote config and health-check it. Never print the token.
```
set -a; . ~/.beats/env; set +a          # repo-checkout fallback: . ./.env.fly
```
- Require `BEATS_SERVER` — if it (or the env file) is missing, stop and tell the user to create
  it (README deployment notes). Do NOT deploy or restart machines from here.
- `curl -s "$BEATS_SERVER/api/health"` — if it fails, report and stop.
- The player is already public: open `$BEATS_SERVER`.

Either way, tell the user to click **"▶ Start radio"** once in the player tab — browsers require
one user gesture before audio can play.

## 3. Pick a unique artifact path

One path per run, so concurrent invocations (e.g. a `/loop`) never clobber each other:
```
mkdir -p ~/.beats/songs
ART=~/.beats/songs/song-$(echo "$THEME" | tr ' A-Z' '-a-z' | tr -cd 'a-z0-9-' | cut -c1-24)-$(date +%s).mjs
# blank theme → song-$(date +%s).mjs ;  repo checkout → use .beats/ instead of ~/.beats/songs/
```

The artifact is a `.mjs` file exporting this contract (strings / template literals):
```js
export const title  = '...'
export const genre  = '...'   // rich: genre + era/lineage, e.g. 'Ethio-jazz — Mulatu-era Addis groove (~96 BPM)'
export const mood   = '...'   // rich: 1–3 evocative sentences — feeling, texture, arc
export const cycles = 86      // for slowcat songs: the total number of slowcat entries
export const code   = `setcps(...)
// ... helpers, sections ...
slowcat(/* ... */)
`
// provenance — the radio stores these:
export const model  = 'claude-opus-4-8'   // the id of the model that composed this song
export const prompt = 'short single-quoted brief: the theme + any direction'
export const author = '...'                // optional
```
`genre`/`mood` are the song's liner notes — the player displays them, so make them rich. The
CODE is the opposite: header 2–3 lines, one short label per section, no plan-in-comments.

## 4. Compose — in a sub-agent when available

If your environment supports sub-agents (e.g. Claude Code's **Agent** tool), spawn a
**backgrounded** composer and don't block the main thread on it. Give the sub-agent, verbatim
in its prompt: this skill's composition process (section 5), the theme, the **exact `$ART`
path**, the **exact post command** resolved in section 2/6, and the model id for `export const
model`. Guardrails for the sub-agent:

- Write/edit **only** the artifact file at `$ART` — nothing else.
- **Never** re-author or edit the validator; just run it.
- Validate until it prints `OK`.
- Self-critique against the taste bar and iterate until the song is **genuinely good, not just
  runnable**.
- **The sub-agent runs the post itself** — local or remote — as its final step, using the
  exact command given (it must not decide the target itself, and never hand the artifact back
  for the main thread to post). For remote, give it the env-sourcing form from section 6
  (`--remote` / `. ./.env.fly`) — the command reads the config file itself; never paste the
  token into the prompt.
- Return a one-line summary: title / genre / mood / cycles / posted-to.

If sub-agents aren't available, do the full process below inline.

## 5. The composition process — all four steps, in order

### Plan (in thinking — never in code comments)
- **Feeling** — what should the listener feel in their body, over time? (`references/musical-taste.md`)
- **Structure, chosen by genre** — commit to ONE: verse/chorus → `slowcat` sections;
  hypnotic/electronic → one evolving pattern; experimental → layering/probabilistic.
  (`references/structure-and-length.md`)
- **Palette & voice budget** — 5–6 sounds from the allowed set only (`references/sounds.md`);
  3–5 voices at once, the full stack saved for one brief peak.
- **Harmony** — the most distinctive direction that fits, with one deliberate risk (borrowed
  chord, mode, secondary dominant, chromatic mediant); plain I–V–vi–IV is a red flag. Derive the
  bass from the progression. (`references/harmony-and-melody.md`)
- **Melody** — ONE short motif and how it develops (transpose / invert / fragment / re-rhythm).
- **Rhythm & cycle plan** — drums/tempo/groove, AND **which drum machine**: pick the `.bank()`
  by era/genre from the table in `references/sounds.md` like a producer choosing hardware —
  defaulting to TR808/TR909 or the bank-less samples on an era piece is a red flag. Cycles per
  section (**60–100+ total** for sectioned songs; distinct sections each repeated 8–16 cycles).

### Compose a FULL song
`setcps(...)` + one top-level `stack(...)` or `slowcat(...)`, arranged with distinct,
**contrasting** sections (e.g. intro → verse → pre-chorus → chorus → bridge → chorus → outro)
— intro/outro sparse, chorus full, a bridge that goes somewhere new. Develop the motif across
them. Set `cycles` = the total arranged length (the number of `slowcat` entries).

**The fatal rules — each validates fine yet plays silently/wrong. Check all before validating;
full recipes in `references/syntax.md`:**
1. **Wrap every VARIABLE passed to `note()`/`s()` in `m()`** — `note(m(chord))`, `s(m(inst))`.
   Literals and numbers stay bare. Quote rule: double quotes ONLY directly inside
   `note()`/`s()`/pattern methods; note material stored anywhere else (arrays, consts, helper
   args) is **single-quoted** — a double-quoted string is already a pattern, and `m()` on a
   pattern crashes (`not a note: "Object"`).
2. **Chords must advance through `slowcat`** — never repeat a `<...>`-progression variable across
   slowcat entries (it freezes on the first chord). Emit one literal chord per entry from a
   progression array (per-cycle segment builder). Same for any per-cycle `<...>` value
   (`.begin`, `.speed`, `.lpf`).
3. **No arithmetic on comma-chords** — `.add`/`.sub`/`.mul` on `'d3,g3,b3'` crashes. Spell
   transposed chords out as literals; numeral ops only on single notes and numbers.
4. **Never interpolate a variable into a mini-notation string** — mini-notation is always literal
   text. Pass variables via `note(m(x))`; put rhythm in a literal `.struct("x ~ x ~")`.
5. **Never name a variable/param `m`** (nor `n`, `s`, `note`, `stack`, `sound`, `slowcat`).
   Prefer `phrase`, `chord`, `root`, `voice`.

Also: write `note("...")` **first**, then `.s(...)` — the reverse sticks on the first note.
Use **only** the prebaked sounds in `references/sounds.md`.

### Validate & iterate
Run the validator (section 6) until `OK`, then critique your own song and revise — repeat until
you'd genuinely ship it. Bass sits inside every chord? Not too many voices? Motif actually
develops? Harmonic risk landed? Sections truly contrast? Stop when it's good, not maximal.

## 6. Validate & post

Validate until it prints `OK` (never edit the validator — just run it):
```
bunx beats-radio validate "$ART"
```
Then post:
```
bunx beats-radio post "$ART"                 # LOCAL
bunx beats-radio post "$ART" --remote        # REMOTE (reads ~/.beats/env for BEATS_SERVER/BEATS_TOKEN)
```
*Repo-checkout equivalents:* `bun scripts/validate-song.mjs "$ART"` and
`bun scripts/post-song.mjs "$ART"` (remote: `set -a; . ./.env.fly; set +a; bun scripts/post-song.mjs "$ART"`).
`post` forwards `model` and `prompt` to the server automatically. The server streams the song
to the player tab, which plays it and advances after `cycles`.

## 7. Report

Keep the final message short: what's now streaming (title / genre / cycles) and where (local or
the remote radio), the one-time **"▶ Start radio"** click, and that they can run `/beats <theme>`
again (or `/loop 8m /beats <theme>`) to keep fresh tracks flowing. To stop: close or mute the tab.

## 8. Troubleshooting

- **Sounds authority:** `bunx beats-radio sounds` prints the exact prebaked inventory as JSON.
  `references/sounds.md` is the curated usage guidance.
- **"It doesn't play" / "lots of errors" — read the player tab's console FIRST**, don't guess
  from the code. *(Claude-specific:* drive Chrome via the claude-in-chrome MCP tools —
  `tabs_context_mcp` to find the player tab, then `read_console_messages`.) Common errors:

  | Console error | Cause |
  |---|---|
  | `not a note: "f#2,a3,..."` | a variable reached `note()`/`s()` un-`m()`-wrapped (rule 1) |
  | `not a note: "Object"` / `cannot parse as numeral: "Object"` | `m()` applied to something already a pattern — a double-quoted string used outside `note()`/`s()` (rule 1 quote rule) |
  | `cannot parse as numeral: "d3,g3,b3"` | arithmetic on a comma-chord (rule 3) |
  | `[mini] parse error` | a variable interpolated into a mini-notation string (rule 4) |
  | `m is not a function` | a variable/param named `m` shadowed the builtin (rule 5) |
  | chords/melody frozen on the first cycle | a `<...>` value repeated across `slowcat` entries (rule 2) |

  Fix the artifact, re-validate, re-post — never edit from the code alone.

## References (load as needed)
- `references/sounds.md` — the only sounds the runtime has + synthesis/effect recipes
- `references/syntax.md` — the five fatal rules in full + worked recipes
- `references/harmony-and-melody.md` — harmonic vocabulary, bass-lock, melodic craft
- `references/structure-and-length.md` — structure approaches + song length, by genre
- `references/musical-taste.md` — mood → intention → mechanics, balance, anti-patterns
