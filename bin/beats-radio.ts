#!/usr/bin/env bun
// beats-radio CLI — the standalone appliance. start/stop/validate/post/sounds/install-skill
// all work with no agent involved. bun-only: it runs the same bun:sqlite server and shells the
// canonical scripts/ validators, so validation + post payload can never drift from the server.
import { join } from 'node:path'
import { homedir } from 'node:os'
import { existsSync, readFileSync, writeFileSync, rmSync, cpSync, mkdirSync } from 'node:fs'
import { defineCommand, runMain } from 'citty'
import pkg from '../package.json'
import {
  SAMPLE_MANIFESTS,
  CUSTOM_SAMPLE_MAPS,
  SOUNDFONT_ALIASES,
  USE_SOUNDFONTS,
  SYNTH_NAMES,
  PITCHED,
} from '../src/sounds-manifest'

// bunx runs bins with the bun runtime, so bun:sqlite works; plain node does not.
if (typeof Bun === 'undefined') {
  console.error('beats-radio requires bun — run: bunx beats-radio')
  process.exit(1)
}

// The installed-user state dir, in one place: BEATS_STATE_DIR (if set) always wins,
// otherwise ~/.beats. Every subcommand resolves state paths through this.
const stateDir = () => process.env.BEATS_STATE_DIR ?? join(homedir(), '.beats')

// Parse a KEY=VALUE env file (blank lines and #-comments ignored).
function parseEnvFile(path: string): Record<string, string> {
  const out: Record<string, string> = {}
  if (!existsSync(path)) return out
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    out[t.slice(0, eq).trim()] = t.slice(eq + 1).trim()
  }
  return out
}

// Run a canonical scripts/ tool with the runtime the CLI is already on; exit with its code.
function runScript(script: string, artifact: string, env?: Record<string, string | undefined>): never {
  const child = Bun.spawnSync([process.execPath, join(import.meta.dir, '../scripts', script), artifact], {
    stdio: ['inherit', 'inherit', 'inherit'],
    env: (env ?? process.env) as Record<string, string>,
  })
  process.exit(child.exitCode)
}

const start = defineCommand({
  meta: { name: 'start', description: 'Start the radio server + player' },
  args: {
    port: { type: 'string', description: 'Port to listen on (default 3001)' },
    open: { type: 'boolean', description: 'Open the player in a browser' },
  },
  async run({ args }) {
    const port = args.port ? Number(args.port) : undefined
    // The bin entrypoint owns the installed-user default (the server's own default is ./.beats).
    process.env.BEATS_STATE_DIR = stateDir()
    const { startServer, resolvePort } = await import('../server/index.ts')
    startServer({ port })
    const url = `http://localhost:${resolvePort(port)}`
    console.log(`Player:    ${url}`)
    console.log(`State dir: ${process.env.BEATS_STATE_DIR}`)
    // pid file so `beats-radio stop` can find us; removed on any clean exit
    const pidFile = join(stateDir(), 'server.pid')
    writeFileSync(pidFile, String(process.pid))
    const removePidFile = () => rmSync(pidFile, { force: true })
    process.on('exit', removePidFile)
    for (const sig of ['SIGINT', 'SIGTERM'] as const) {
      process.on(sig, () => {
        removePidFile()
        process.exit(0)
      })
    }
    if (args.open) {
      const opener = process.platform === 'darwin' ? 'open' : 'xdg-open'
      try {
        Bun.spawn([opener, url], { stdio: ['ignore', 'ignore', 'ignore'] })
      } catch {
        // best-effort: the URL is already printed above
      }
    }
  },
})

const stop = defineCommand({
  meta: { name: 'stop', description: 'Stop a radio started with `start`' },
  run() {
    const pidFile = join(stateDir(), 'server.pid')
    if (!existsSync(pidFile)) {
      console.error(`no running radio found (no ${pidFile})`)
      process.exit(1)
    }
    const pid = Number(readFileSync(pidFile, 'utf8').trim())
    rmSync(pidFile, { force: true })
    try {
      process.kill(pid, 'SIGTERM')
      console.log(`stopped radio (pid ${pid})`)
    } catch {
      console.error(`radio not running (stale pid ${pid}) — cleaned up`)
      process.exit(1)
    }
  },
})

const validate = defineCommand({
  meta: { name: 'validate', description: 'Validate a song artifact' },
  args: {
    artifact: { type: 'positional', description: 'Path to the artifact .mjs', required: true },
  },
  run({ args }) {
    runScript('validate-song.mjs', args.artifact)
  },
})

const post = defineCommand({
  meta: { name: 'post', description: 'Post a song to the running radio' },
  args: {
    artifact: { type: 'positional', description: 'Path to the artifact .mjs', required: true },
    remote: { type: 'boolean', description: 'Post to the deployed radio (reads ~/.beats/env)' },
  },
  run({ args }) {
    const env: Record<string, string | undefined> = { ...process.env }
    // --remote sources the deployed radio's config into the child env, but only fills gaps —
    // an explicit BEATS_SERVER in the environment always wins. BEATS_TOKEN is never printed.
    if (args.remote && !process.env.BEATS_SERVER) {
      Object.assign(env, parseEnvFile(join(stateDir(), 'env')))
    }
    runScript('post-song.mjs', args.artifact, env)
  },
})

const sounds = defineCommand({
  meta: { name: 'sounds', description: 'Print the sound inventory as JSON' },
  run() {
    console.log(
      JSON.stringify(
        {
          synths: SYNTH_NAMES,
          pitched: PITCHED,
          soundfonts: USE_SOUNDFONTS,
          sampleManifests: SAMPLE_MANIFESTS,
          customSampleMaps: CUSTOM_SAMPLE_MAPS,
          soundfontAliases: SOUNDFONT_ALIASES,
        },
        null,
        2,
      ),
    )
  },
})

const installSkill = defineCommand({
  meta: { name: 'install-skill', description: 'Install the beats skill for your agent' },
  args: {
    target: { type: 'string', description: 'Install into <target>/beats instead of detected agent homes' },
  },
  run({ args }) {
    const skillSrc = join(import.meta.dir, '../skills/beats')
    if (!existsSync(skillSrc)) {
      console.error('skill folder not found in this build (skills/beats missing)')
      process.exit(1)
    }
    const dests: string[] = []
    if (args.target) {
      dests.push(join(args.target, 'beats'))
    } else {
      // Always install the universal agentskills.io dir (~/.agents/skills) — convention-following
      // agents (cline, warp, zed, …) read it directly. Then any agent homes that exist, honoring
      // their config-dir env overrides.
      dests.push(join(homedir(), '.agents', 'skills', 'beats'))
      const agentHomes = [process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), '.claude'), process.env.CODEX_HOME ?? join(homedir(), '.codex')]
      for (const home of agentHomes) {
        if (existsSync(home)) dests.push(join(home, 'skills', 'beats'))
      }
    }
    for (const dest of dests) {
      mkdirSync(join(dest, '..'), { recursive: true })
      cpSync(skillSrc, dest, { recursive: true })
      console.log(`installed skill -> ${dest}`)
    }
  },
})

const version = defineCommand({
  meta: { name: 'version', description: 'Print the version' },
  run() {
    console.log(pkg.version)
  },
})

await runMain(
  defineCommand({
    meta: {
      name: 'beats-radio',
      version: pkg.version,
      description: 'Agent-composed Strudel radio: server + browser player. State dir defaults to ~/.beats (override with BEATS_STATE_DIR).',
    },
    subCommands: { start, stop, validate, post, sounds, 'install-skill': installSkill, version },
  }),
)
