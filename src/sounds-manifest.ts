// Authoritative sound inventory for the radio: which sample packs load, the custom sample
// aliases, and the synth/pitched-instrument name sets. PURE DATA — no browser/react imports —
// so it can be consumed both by the browser engine (src/components/StrudelHost.tsx prebake)
// and printed as JSON by the CLI (`beats-radio sounds`). Neither can drift from the other.

// Sample-pack manifests loaded via `samples(url)` in prebake. Each is a Strudel-format JSON
// index that maps sample names to their audio files.
export const SAMPLE_MANIFESTS: { url: string; note: string }[] = [
  {
    url: 'https://raw.githubusercontent.com/felixroos/dough-samples/main/vcsl.json',
    note: 'VCSL: steinway, marimba, vibraphone, harp, etc.',
  },
  {
    url: 'https://raw.githubusercontent.com/felixroos/dough-samples/main/tidal-drum-machines.json',
    note: 'Tidal drum machines (RolandTR808/909 etc., addressed via .bank()).',
  },
  {
    url: 'https://raw.githubusercontent.com/felixroos/dough-samples/main/piano.json',
    note: 'Acoustic piano multisample.',
  },
  {
    url: 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/strudel.json',
    note: 'Dirt-Samples: the classic TidalCycles sample library. No cache-buster: let the manifest HTTP-cache like its siblings.',
  },
  {
    url: 'https://raw.githubusercontent.com/tidalcycles/uzu-drumkit/main/strudel.json',
    note: 'uzu-drumkit: extra drum one-shots.',
  },
]

// Extra sample maps registered via the `samples(map, baseUrl)` overload — aliases for sounds
// the generation prompt advertises but no loaded pack registers under that bare name.
export const CUSTOM_SAMPLE_MAPS: { map: Record<string, string[]>; baseUrl: string; note: string }[] = [
  {
    // VCSL only registers shaker_small/shaker_large, so `shaker` has no bare-name buffer.
    map: {
      shaker: [
        'Idiophones/Struck%20Idiophones/Shaker%2C%20Small/Mid_Shaker_Slap_rr1.wav',
        'Idiophones/Struck%20Idiophones/Shaker%2C%20Small/Mid_Shaker_Slap_rr2.wav',
      ],
    },
    baseUrl: 'https://raw.githubusercontent.com/sgossner/VCSL/master/',
    note: 'shaker -> VCSL small shaker.',
  },
  {
    // No vinyl sample exists in any standard Strudel pack, and Dirt's fire crackle reads as
    // surface noise at low gain.
    map: {
      vinyl: ['fire/fire.wav'],
    },
    baseUrl: 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/',
    note: "vinyl -> Dirt's fire crackle. Banned for new songs (see BANNED_SOUNDS); kept registered so old songs still play.",
  },
]

// Aliases backed by a registered soundfont: after `registerSoundfonts()`, delegate the alias
// to the soundfont's trigger so the bare name resolves.
export const SOUNDFONT_ALIASES: { alias: string; soundfont: string; note: string }[] = [
  {
    alias: 'rhodes',
    soundfont: 'gm_epiano1',
    note: 'rhodes -> GM electric piano 1 (Rhodes-style EP).',
  },
]

// Whether the soundfont pack (General MIDI instruments) is registered in prebake.
export const USE_SOUNDFONTS = true

// Names that are synths, not samples — never warmed as sample buffers.
export const SYNTH_NAMES: string[] = ['sine', 'sawtooth', 'square', 'triangle', 'noise', 'silence']

// Curated usable sample names, grouped exactly as in skills/beats/references/sounds.md.
// That file is the usage guidance; these arrays are the machine-readable inventory printed
// by `beats-radio sounds` — keep the two in lockstep when either changes.
export const DRUM_SOUNDS: string[] = [
  'bd', 'sd', 'sn', 'cp', 'hh', 'oh', 'lt', 'mt', 'ht', 'rim', 'shaker', 'cr', 'rd',
]
export const MELODIC_SOUNDS: string[] = [
  'piano', 'steinway', 'rhodes', 'marimba', 'vibraphone', 'harp', 'folkharp',
  'organ_full', 'harmonica',
]
export const PERCUSSION_SOUNDS: string[] = ['cajon', 'bongo', 'conga', 'timpani', 'tambourine']
export const ATMOSPHERIC_SOUNDS: string[] = ['tubularbells', 'space', 'noise', 'metal']

// Banned sounds (sounds.md "DO NOT USE"): they still load — vinyl even has a custom map so
// old songs keep playing — but new songs must never select them.
const VOCAL_BAN_NOTE =
  'vocal samples chop awkwardly or are ~20ms blips — synthesize formant-style stabs instead'
export const BANNED_SOUNDS: { name: string; note: string }[] = [
  { name: 'sax', note: 'sample sounds bad — use a triangle/sawtooth lead shaped with lpf' },
  { name: 'vinyl', note: 'crackle sample sounds bad — use lightly-filtered noise at low gain' },
  ...['yeah', 'miniyeah', 'bev', 'ade', 'speech', 'alphabet', 'numbers', 'mouth', 'speakspell']
    .map((name) => ({ name, note: VOCAL_BAN_NOTE })),
]

// Pitched multisamples: warm a few octaves so the nearest-zone buffers load too.
// Derived from the melodic list (plus pitched-atmospheric tubularbells) so it can't drift.
export const PITCHED: string[] = [...MELODIC_SOUNDS, 'tubularbells']
