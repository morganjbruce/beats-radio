// Shared loader for song artifacts (.mjs exporting { title, genre, mood, cycles, code }).
// Keeps arg-parsing, dynamic import, raw-source read, and the code-string check in one
// place so validate-song.mjs and post-song.mjs can't drift.
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

// Loads the artifact named in argv[2]. Prints `usage` + exits 2 if missing; prints FAIL +
// exits 1 if it can't load or has no non-empty `code`. Returns { file, raw, ...exports }.
export async function loadArtifact(usage) {
  const arg = process.argv[2]
  if (!arg) {
    console.error(usage)
    process.exit(2)
  }
  const file = resolve(arg)
  let mod, raw
  try {
    mod = await import(pathToFileURL(file).href)
    raw = readFileSync(file, 'utf8')
  } catch (err) {
    console.error(`FAIL: could not load artifact "${arg}": ${err?.message ?? err}`)
    process.exit(1)
  }
  if (typeof mod.code !== 'string' || !mod.code.trim()) {
    console.error('FAIL: artifact must export a non-empty `code` string')
    process.exit(1)
  }
  return { file, raw, ...mod }
}
