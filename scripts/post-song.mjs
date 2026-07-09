// Post a validated Strudel song artifact to the radio server.
//
//   bun scripts/post-song.mjs <artifact.mjs>
//
// The artifact is a .mjs exporting { title, genre, mood, cycles, code }. This POSTs it to
// the local server's /api/beats endpoint, which streams it (SSE) to the open browser player.
// Validate first with scripts/validate-song.mjs.
import { userInfo } from 'node:os'
import { loadArtifact } from './_artifact.mjs'

// For a deployed server, set BEATS_SERVER to its URL and BEATS_TOKEN to its auth token.
const SERVER = process.env.BEATS_SERVER ?? 'http://localhost:3001'
const TOKEN = process.env.BEATS_TOKEN

const {
  title, genre, mood, cycles, code,
  author: artifactAuthor, model: artifactModel, prompt: artifactPrompt,
} = await loadArtifact('usage: bun scripts/post-song.mjs <artifact.mjs>')

// Attribution for shared/team radios: artifact `export const author` wins, then
// $BEATS_AUTHOR, then the OS username — so every post carries a byline by default.
const author = artifactAuthor ?? process.env.BEATS_AUTHOR ?? userInfo().username
// Generation provenance (stored for later analysis): the orchestrator knows the model +
// brief and passes them via env; an artifact export can override. Both optional.
const model = artifactModel ?? process.env.BEATS_MODEL
const prompt = artifactPrompt ?? process.env.BEATS_PROMPT

let res
try {
  res = await fetch(`${SERVER}/api/beats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}) },
    body: JSON.stringify({ title, genre, mood, author, model, prompt, cycles: Number(cycles) || undefined, code }),
  })
} catch (err) {
  console.error(`FAIL: could not reach ${SERVER} — is the dev server running? (${err?.message ?? err})`)
  process.exit(1)
}

const text = await res.text()
if (!res.ok) {
  console.error(`FAIL: server returned ${res.status}: ${text}`)
  process.exit(1)
}
console.log(`posted "${title ?? '(untitled)'}" (${Number(cycles) || '?'} cyc) -> ${text}`)
