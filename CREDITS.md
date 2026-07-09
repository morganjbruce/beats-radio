# Credits & licensing

The beats-radio application code is licensed under the GNU AGPL-3.0-or-later (see
`LICENSE`) — it builds on and bundles [Strudel](https://strudel.cc), which is AGPL-3.0.

It does **not** bundle any audio — the browser player streams sample packs from their
upstream repositories at runtime (see `src/components/StrudelHost.tsx`). Each pack carries
its own license, listed below. Synthesized voices (sine/sawtooth/square/triangle and all
effect-shaped timbres) are generated in Web Audio and involve no samples.

## Sample packs

- **Piano** — Salamander Grand Piano V3 by **Alexander Holm**, licensed
  [CC-BY 3.0](https://creativecommons.org/licenses/by/3.0/), via
  [felixroos/dough-samples](https://github.com/felixroos/dough-samples). *Attribution required.*
- **Electric piano (`rhodes`)** — General MIDI soundfont (FluidR3 lineage, MIT), via
  [`@strudel/soundfonts`](https://github.com/tidalcycles/strudel).
- **VCSL instruments** (`steinway`, `marimba`, `vibraphone`, `harp`, `folkharp`, `organ_full`,
  `harmonica`, `timpani`, `tambourine`, `cajon`, `bongo`, `conga`, `tubularbells`, `shaker`) —
  the [Versilian Community Sample Library](https://github.com/sgossner/VCSL) by Versilian
  Studios LLC, released **CC0** (public domain).
- **uzu-drumkit** — [tidalcycles/uzu-drumkit](https://github.com/tidalcycles/uzu-drumkit),
  released into the public domain (Unlicense).
- **Drum machines** (`RolandTR808`, `RolandTR909` banks) —
  [tidal-drum-machines](https://github.com/ritchse/tidal-drum-machines).
- **Dirt-Samples** (bare drum names, `noise`, `metal`, `space`) —
  [tidalcycles/Dirt-Samples](https://github.com/tidalcycles/Dirt-Samples), the classic
  SuperDirt/TidalCycles sample set.

The `sax`, `vinyl`, and vocal sample sets are intentionally excluded from the composer's
palette. If you fork this project and intend to distribute rendered audio (rather than the
song *code* this app produces), review the terms of Dirt-Samples and tidal-drum-machines
directly — those upstreams do not ship explicit sample licenses.