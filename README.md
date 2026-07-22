# beats-radio

I spent some time teaching Claude to write music in Javascript and inadvertently recreated [this meme](https://x.com/jahirsheikh8/status/2073027725619835353).

# Watch an example

TODO: add

(or visit [my radio](https://beats-radio.fly.dev))

## Some favourites

* https://beats-radio.fly.dev/?song=72 (The Cars)
* https://beats-radio.fly.dev/?song=91 (90s DJ Premier/Nas track)
* https://beats-radio.fly.dev/?song=109 (over-the-top teenage symphony)
* https://beats-radio.fly.dev/?song=104 (The Streets?)
* https://beats-radio.fly.dev/?song=105 (wall of sound, My Bloody Valentine with synths)
* https://beats-radio.fly.dev/?song=126 (Claude attempts Death Grips)
* https://beats-radio.fly.dev/?song=31 (Chromatics inspired italo-disco)


# Why did you make this?

My thought process:

1. I wonder if Claude can write music?
2. Ok, it’s not an audio model, but surely there’s a music coding library? LLMs love writing code. Yes, I know that Suno exists...
3. Strudel looks good, let’s try that!
4. Ok, some other people have tried that too
5. How can it write good songs if it can’t hear them?
6. Hmm alright let’s teach it some rules of style
7. Back to #4, I don’t actually know that much music theory
8. Ok, now we’re getting somewhere
9. Ah, there’s a `/radio` skill now in Claude Code
10. That just opens YouTube, lame. Let the agents create!
11. Let's make this into an agent-driven radio
12. (Fable gets released) it should have Winamp style visualisations too, right?
13. Here we are :sparkle:

It also turns out Claude loves writing Chromatics-inspired italodisco and Ethiopian jazz. Who knew?

# How does this work?

Your coding agent composes full, arranged songs in
[Strudel](https://strudel.cc/) (a live-coding music language); a browser player (the 'radio') streams the
shared queue with the real Web Audio engine

The `/beats` skill writes a song based on a theme (yours or your agents), and you can work collaboratively with your agent to give feedback, tweak or rewrite each song

## Get started

Requires [bun](https://bun.sh/) ≥ 1.2.

To have an agent compose for the radio, install the **beats** skill to drive the `beats-radio` CLI. Two ways:

**Any SKILL.md-aware agent** (Claude Code, Codex, …):

```bash
bunx beats-radio install-skill
```

This copies `skills/beats` into the agent homes it finds (`~/.claude/skills`, `~/.codex/skills`);
pass `--target <dir>` to install elsewhere.

**Claude Code plugin:**

```
/plugin marketplace add morganjbruce/beats-radio
/plugin install beats@funkmaster
```

And you then can compose with:

```
/beats <theme>
```

The skill will open http://localhost:3001: click **▶ Start radio** once to unlock browser audio.

## Usage

- **Themes** — `/beats midnight city pop`, `/beats something like Boards of Canada`, or just
  `/beats` and let it choose. The agent plans, writes, validates, and iterates on a full arranged
  song (real structure and an arc, not a 4-bar loop), then posts it to the queue.
- **The queue** — songs stream to every open player tab over SSE and advance on the cycle
  boundary. Each song has a permalink and shows its generation provenance; you can delete songs
  from the player.
- **Evolving radio** - `/loop 3m /beats <your theme>` to generate songs on an ongoing basis
- **Team / remote radio** — point your agent and the CLI at a shared deployment by putting
  `BEATS_SERVER` and `BEATS_TOKEN` in `~/.beats/env`:

  ```
  BEATS_SERVER=https://your-radio.example.com
  BEATS_TOKEN=your-secret-token
  ```

  And ask your agent to use the remote radio (eg `/beats <theme>, post remote`)

# Development

Working in a checkout of this repo:

```bash
bun install
bun run dev
```

`dev` runs Vite (player on http://localhost:5173) + a watched server (:3001) concurrently. 

The repo dogfoods its own
skill: `.claude/skills/beats` symlinks to `skills/beats`, so `/beats` here uses the same skill
that ships in the package.

# Deploy your own public radio

The appliance runs anywhere bun does. The repo includes a `Dockerfile` and `fly.toml` for
[fly.io](https://fly.io/):

```bash
fly launch --no-deploy                          # create the app (keep the bundled fly.toml)
fly volumes create beats_data --size 1 --region lhr   # persistent state for history.db + songs
fly secrets set BEATS_TOKEN=<token>             # required to post to the public radio
fly deploy
```

Notes:

- The volume mounts at `/app/.beats` (the server's cwd-relative default), so history and posted
  songs survive redeploys.
- Keep `auto_stop_machines = "off"` with `min_machines_running = 1`: the radio holds open SSE
  streams, so the machine must stay up for the queue and listeners to survive idle periods.
- Once deployed, listeners just open the app URL; composers point `~/.beats/env` at it (see
  **Usage** above).

__Share it with your friends, send songs from each other's agents!__

# CLI reference

| Command | What it does |
| --- | --- |
| `start [--port N] [--open]` | Start the server + built-in player on :3001 (`--open` launches a browser) |
| `stop` | Stop a radio started with `start` (reads the pid file in the state dir) |
| `validate <artifact.mjs>` | Statically check a song artifact (regex + syntax) before it plays |
| `post <artifact.mjs> [--remote]` | Post a song to the running radio; `--remote` uses `~/.beats/env` |
| `sounds` | Print the authoritative prebaked-sound inventory as JSON |
| `install-skill [--target <dir>]` | Copy the beats skill into `~/.agents/skills` (the universal dir) plus `~/.claude/skills` / `~/.codex/skills` where present (or `--target`) |
| `version` | Print the version |

# What would make this better?

* A real critique loop. Claude can’t process audio, so we could feed it through a model that can, like Gemini. But I wanted something that was only dependent on one agent harness, so we just have structural validation & a bunch of rules to follow... which mostly works, but sometimes you get slop
* Build a corpus of generated songs that meet human preference, and use those as examples for Claude of good/bad songwriting.
* It’s probably overfitted on verse-chorus-verse-chorus-bridge songs, because I got sick of little loops
* It could be faster, I haven't optimised for speed at all (can take 3-6m to generate a song on large models w/ high+ thinking)
* 99.7FM Wu-Tang Claw?

# Huge appreciation for:

* This [excellent project](https://github.com/DorsaRoh/audial), from which I cribbed a bunch of my initial prompting (particularly around harmony & music theory)
* The folks behind Strudel, Tidal Cycles and the many, many giants that this is standing on :)

See also:

- [LICENSE](LICENSE)
- [CREDITS.md](CREDITS.md)

# Thanks, I hate it

* It’s not a replacement for human creativity and genius, I built this to satisfy my curiousity! 
* Best to think of these as rough prototypes, not real songs
* Fable/Opus love using every cliche in the book, but sometimes, they generate something that’s (at the very least) memorable, and sometimes genuinely touching
* You probably shouldn't read my code too closely, this is the repo where I let the agents run wild


