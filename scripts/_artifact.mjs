// Shared loader for song artifacts (.mjs exporting { title, genre, mood, cycles, code }).
// Keeps arg-parsing, dynamic import, raw-source read, and the code-string check in one
// place so validate-song.mjs and post-song.mjs can't drift.
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

// ---------------------------------------------------------------------------
// Static extraction — read the artifact's exports straight out of the raw
// source WITHOUT executing it. validate-song.mjs uses this so the "static
// gate" never runs artifact code; post-song.mjs keeps the executing loader.
// ---------------------------------------------------------------------------

const SIMPLE_ESCAPES = { n: '\n', t: '\t', r: '\r', b: '\b', f: '\f', v: '\v', 0: '\0' }

// Cooks the escape sequence whose backslash sits at src[i].
// Returns [cookedText, indexAfterEscape].
function readEscape(src, i) {
  const ch = src[i + 1]
  if (ch === 'x') return [String.fromCharCode(parseInt(src.slice(i + 2, i + 4), 16)), i + 4]
  if (ch === 'u') {
    if (src[i + 2] === '{') {
      const end = src.indexOf('}', i + 3)
      if (end === -1) return [src[i + 1], i + 2]
      return [String.fromCodePoint(parseInt(src.slice(i + 3, end), 16)), end + 1]
    }
    return [String.fromCharCode(parseInt(src.slice(i + 2, i + 6), 16)), i + 6]
  }
  if (ch === '\n') return ['', i + 2] // line continuation
  return [SIMPLE_ESCAPES[ch] ?? ch, i + 2]
}

// Cooks a single/double-quoted string literal whose opening quote is src[i].
// Returns the string value, or undefined if unterminated.
function readQuoted(src, i) {
  const quote = src[i]
  let out = ''
  let j = i + 1
  while (j < src.length) {
    const ch = src[j]
    if (ch === '\\') {
      const [text, next] = readEscape(src, j)
      out += text
      j = next
    } else if (ch === quote) {
      return out
    } else if (ch === '\n') {
      return undefined
    } else {
      out += ch
      j++
    }
  }
  return undefined
}

// Cooks a template literal whose opening backtick is src[i], handling \\ escapes,
// \` and \$ escapes, and ${...} interpolations (kept verbatim as raw text — a
// static parser cannot evaluate them). Returns { value, end } (end = index after
// the closing backtick), or undefined if unterminated.
function readTemplate(src, i) {
  let out = ''
  let j = i + 1
  while (j < src.length) {
    const ch = src[j]
    if (ch === '\\') {
      const [text, next] = readEscape(src, j)
      out += text
      j = next
    } else if (ch === '`') {
      return { value: out, end: j + 1 }
    } else if (ch === '$' && src[j + 1] === '{') {
      const end = skipInterpolation(src, j + 2)
      if (end === -1) return undefined
      out += src.slice(j, end)
      j = end
    } else {
      out += ch
      j++
    }
  }
  return undefined
}

// Scans past a ${...} interpolation body starting just after the "${" at src[i].
// Brace-counts, skipping strings and nested template literals. Returns the index
// just after the matching "}", or -1 if unterminated.
function skipInterpolation(src, i) {
  let depth = 1
  let j = i
  while (j < src.length) {
    const ch = src[j]
    if (ch === "'" || ch === '"') {
      j++
      while (j < src.length && src[j] !== ch) j += src[j] === '\\' ? 2 : 1
      j++
    } else if (ch === '`') {
      const nested = readTemplate(src, j)
      if (!nested) return -1
      j = nested.end
    } else {
      if (ch === '{') depth++
      else if (ch === '}' && --depth === 0) return j + 1
      j++
    }
  }
  return -1
}

const STRING_EXPORTS = ['title', 'genre', 'mood', 'model', 'prompt', 'author']

// Extracts the artifact's exports from raw source without executing it:
// `code` must be a backtick template literal, title/genre/mood/model/prompt/author
// single/double-quoted string literals, `cycles` a numeric literal. Exports that
// are absent (or not statically extractable) come back undefined.
export function parseArtifactStatic(raw) {
  const out = {}
  for (const key of STRING_EXPORTS) {
    const m = new RegExp(`^export\\s+const\\s+${key}\\s*=\\s*['"]`, 'm').exec(raw)
    if (m) out[key] = readQuoted(raw, m.index + m[0].length - 1)
  }
  const cyclesMatch = /^export\s+const\s+cycles\s*=\s*(-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)/im.exec(raw)
  if (cyclesMatch) out.cycles = Number(cyclesMatch[1])
  const codeMatch = /^export\s+const\s+code\s*=\s*`/m.exec(raw)
  if (codeMatch) out.code = readTemplate(raw, codeMatch.index + codeMatch[0].length - 1)?.value
  return out
}

// Static twin of loadArtifact: same argv contract (prints `usage` + exits 2 when
// no file is given; prints FAIL + exits 1 when it can't be read or `code` can't
// be statically extracted) but never executes the artifact.
export function loadArtifactStatic(usage) {
  const arg = process.argv[2]
  if (!arg) {
    console.error(usage)
    process.exit(2)
  }
  const file = resolve(arg)
  let raw
  try {
    raw = readFileSync(file, 'utf8')
  } catch (err) {
    console.error(`FAIL: could not load artifact "${arg}": ${err?.message ?? err}`)
    process.exit(1)
  }
  const parsed = parseArtifactStatic(raw)
  if (typeof parsed.code !== 'string' || !parsed.code.trim()) {
    console.error('FAIL: could not statically extract `code` — artifact must export code as a template literal')
    process.exit(1)
  }
  return { file, raw, ...parsed }
}

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
