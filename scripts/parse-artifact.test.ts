// Proves parseArtifactStatic against the real corpus: for every examples/**/*.mjs
// that exports code, the statically-extracted exports must match the actually-
// import()ed ones exactly. (Importing here is fine — it's a trusted local corpus;
// the point is that the VALIDATOR never has to.) Files that aren't artifacts (the
// raw paste-into-strudel.cc sketches — not even importable: they call Strudel
// builtins or unresolvable imports at top level) must genuinely export no code,
// checked against the raw source so the parser can't silently skip a real one.
import { describe, expect, test } from 'bun:test'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseArtifactStatic } from './_artifact.mjs'

const EXPORT_KEYS = ['code', 'cycles', 'title', 'genre', 'mood', 'model', 'prompt', 'author'] as const

const examplesDir = join(import.meta.dir, '..', 'examples')
const files = (readdirSync(examplesDir, { recursive: true }) as string[])
  .filter((f) => f.endsWith('.mjs'))
  .map((f) => join(examplesDir, f))
  .sort()

test('corpus is present', () => {
  expect(files.length).toBeGreaterThan(30)
})

describe('parseArtifactStatic matches import() across examples/', () => {
  for (const file of files) {
    test(file.slice(examplesDir.length + 1), async () => {
      const raw = readFileSync(file, 'utf8')
      const parsed = parseArtifactStatic(raw)
      if (parsed.code === undefined) {
        // Not an artifact — confirm against the raw source that the parser
        // didn't skip a real code export (these sketches also can't be imported).
        expect(/^export\s+const\s+code\b/m.test(raw)).toBe(false)
        return
      }
      const mod: Record<string, unknown> = await import(pathToFileURL(file).href)
      for (const key of EXPORT_KEYS) {
        expect(parsed[key]).toEqual(mod[key])
      }
    })
  }
})
