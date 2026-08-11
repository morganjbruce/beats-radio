# Sounds & synthesis

This file is the **generation allowlist**: use only the sounds and drum banks approved below.
The runtime may load additional sounds for compatibility, but generated songs must not select
them. `bunx beats-radio sounds` prints the authoritative machine-readable runtime inventory.

## Synth waveforms (use with `note().s()`)
- **sine** — smooth, pure tone (sub bass, soft leads)
- **sawtooth** — bright, rich harmonics (leads, bass, pads)
- **square** — hollow, reedy (bass, chiptune-style leads)
- **triangle** — softer than square (bass, mellow leads)

Example: `note("c3 e3 g3").s("sawtooth").lpf(800).gain(0.5)`

## Drum samples (use with `s()`)
- **bd** — bass drum (variations bd:0, bd:1, …)
- **sd** — snare drum (sd:0, sd:1, …)
- **sn** — alternate snare samples
- **cp** — clap
- **hh** — closed hi-hat
- **oh** — open hi-hat
- **lt, mt, ht** — low / mid / high toms
- **rim** — rim shot
- **shaker** — shaker
- **cr** — crash cymbal
- **rd** — ride cymbal

Example: `s("bd sd:2 bd cp").gain(0.8)`

## Drum banks (use `.bank()`) — PICK THE KIT BY GENRE
The runtime exposes 71 classic drum machines; generated songs may use only the banks named in the
table below. Write generic voice names in `s()` and select the machine with `.bank()`. **Choose the
kit like a producer choosing hardware for the session — the era/genre match matters as much as the
pattern.**

| Genre / vibe | Reach for |
|---|---|
| Hip hop, boom bap, neo-soul | **EmuSP12** (dusty crunch), **AkaiMPC60** (mid-90s thump), **RolandTR808** (deep low-end weight), **RolandTR909** (hard, punchy attack), MPC1000, OberheimDMX |
| Electro, Miami bass, trap lineage | **RolandTR808** |
| House, techno, French touch | **RolandTR909**, RolandTR707 |
| Acid, minimal, early Aphex | **RolandTR606**, RolandTR505 |
| 80s pop, synthwave, italo, Prince | **LinnDrum**, LinnLM1/LinnLM2, OberheimDMX, SequentialCircuitsDrumtracks |
| Latin, disco, boogie | **RolandTR727** (latin percussion), RolandCompurhythm8000, KorgKR55 |
| Vintage exotica, dub, reggae organ-box | **RolandCompurhythm78**, RhythmAce, KorgMinipops |
| Lo-fi, toy, bedroom, glitch | **CasioSK1**, CasioVL1, CasioRZ1, UnivoxMicroRhythmer12 |
| 90s digital pop / R&B / new jack | **YamahaRY30**, YamahaRX5, KorgM1, RolandR8, BossDR550 |
| Industrial, EBM, post-punk | **SimmonsSDS5** (huge gated toms), EmuDrumulator, YamahaRX21 |

Voice availability varies per bank (all have `bd`/`sd`; most add `hh`/`oh`/`cp`; toms, `rim`,
`cb`, `sh`, `rd`/`cr` vary) — `bunx beats-radio sounds` lists the manifests; if a voice is
missing from your chosen bank it silently won't fire, so keep essentials to bd/sd/hh/oh/cp
or verify. Mixing banks is fair game (SP12 kick under LinnDrum claps). The bare, bank-less
samples (`bd`, `sd`, `hh`, …) are the Dirt-Samples defaults — fine for neutral/idm textures,
a cop-out for era pieces.

Example: `s("bd ~ sd ~").bank("EmuSP12")` + `s("~ cp ~ cp").bank("LinnDrum")`

## Melodic samples (use with `note().s()`)
- **piano** — acoustic piano (the default for chordal/melodic piano parts)
- **steinway** — grand piano. Sparsely sampled — warbles on dense/extended chords; prefer `piano` for chords, save `steinway` for sparse single-note lines if at all
- **rhodes** — warm electric piano (soul, jazz, lo-fi, neo-soul)
- **marimba** — warm wooden mallet
- **vibraphone** — jazz vibes. VERY loud — keep gain ≤ 0.25, e.g. `.s("vibraphone").gain(0.2)`
- **harp** — arpeggios, dreamy textures
- **folkharp** — warmer, more intimate harp
- **organ_full** — church/gospel organ
- **harmonica** — blues/folk harmonica

Example: `note("c4 e4 g4").s("vibraphone").room(0.6).gain(0.2)`

## Percussion samples (use with `s()`)
- **cajon** — acoustic box drum
- **bongo** — hand drums
- **conga** — congas
- **timpani** — orchestral timpani (cinematic)
- **tambourine** — accents

## Atmospheric / texture samples
- **tubularbells** — cinematic, ethereal
- **space** — ambient pads, drones
- **noise** — white noise (risers, texture)
- **metal** — metallic hits

## DO NOT USE
These are banned — never select them, even if the genre seems to call for one:
- **sax** — the sample sounds bad. For a sax-like lead, use a triangle/sawtooth lead shaped with `lpf`.
- **vinyl** — the crackle sample sounds bad. For lo-fi texture, use lightly-filtered `noise` at low gain.
- **vocal samples** (`yeah`, `miniyeah`, `bev`, `ade`, `speech`, `alphabet`, `numbers`, `mouth`,  `speakspell`, etc.) — tried and cut: the short ones are ~20ms blips, the long phrases chop awkwardly. For a vocal-ish hook, SYNTHESIZE it: formant-style bandpassed sawtooth/square stabs (`.hpf(300–500)` + `.lpf(900–1600)` + `.resonance(10–16)`, pluck envelope, `.vib(5).vmod(0.08)`).

---

# Creating different timbres with synthesis

Strudel has limited samples — create timbres with synthesis.

## Bass
- Sub bass: `note("c2").s("sine").lpf(100).gain(0.7)`
- Fuzzy bass: `note("c2").s("sawtooth").lpf(300).shape(0.5).gain(0.6)`
- Square bass: `note("c2").s("square").lpf(200).gain(0.6)`

## Leads
- Bright lead: `note("c4").s("sawtooth").lpf(2000).resonance(10).gain(0.4)`
- Soft lead: `note("c4").s("triangle").lpf(1500).gain(0.4)`
- Aggressive lead: `note("c4").s("square").lpf(3000).shape(0.4).distort(0.2)`

## Pads
- Warm pad: `note("[c3,e3,g3]").s("sawtooth").lpf(600).attack(0.2).room(0.4).gain(0.3)`
- Soft pad: `note("[c3,e3,g3]").s("triangle").lpf(800).room(0.5).gain(0.3)`

## Texture
- Filtered noise: `s("noise").lpf(sine.range(200, 2000).slow(4)).gain(0.1)`
- Rhythmic noise: `s("noise*8").lpf(400).gain("0.1 0.05 0.08 0.05")`

## Key effects for shaping sound
- `.lpf(freq)` low-pass (warmth/darkness) · `.hpf(freq)` high-pass (removes mud)
- `.resonance(amt)` filter resonance · `.shape(amt)` soft saturation (0–1) · `.distort(amt)` harder
- `.room(amt)` reverb (typically 0–1; up to 1.5 for deliberately heavy ambient space) · `.delay(time)` echo
- `.attack/.decay/.sustain/.release` envelope · `.pan(pos)` (-1..1) · `.gain(level)` (typ. 0.3–0.8)
- `.vib(freq)` vibrato rate (4–6 Hz) · `.vmod(amt)` vibrato depth (0.05–0.15) · `.velocity(amt)`

## Advanced modulation (LFOs via `sine.range()`)
- Filter sweep: `.lpf(sine.range(200, 2000).slow(4))`
- Auto-pan: `.pan(sine.range(-0.5, 0.5).slow(8))`
- Tremolo: `.gain(sine.range(0.3, 0.7).slow(2))`
- Vibrato: `.vmod(sine.range(0.05, 0.12).slow(6))`
- Organic drift: `.lpf(perlin.slow(2).range(100, 2000))`
