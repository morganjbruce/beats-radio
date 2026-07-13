// Validate a Strudel song artifact — catch the mistakes that make a song fail SILENTLY
// (it posts fine, then just plays nothing). Dependency-free and bun-native on purpose:
// importing @strudel/* headlessly is chronically fragile (CJS/ESM packaging bugs in its
// transitive deps), so this does NOT import Strudel. The browser engine is the final
// runtime check; this catches the well-known killers before a song ever gets there.
//
//   bun scripts/validate-song.mjs <artifact.mjs>
//
// The artifact is a .mjs exporting `code` (the Strudel program string) and `cycles`.
// Prints `OK ...` and exits 0 when clean; prints each problem and exits 1 otherwise.
//
// This is the ONE source of truth for song validation — never re-author it inline.
import { loadArtifact } from './_artifact.mjs'

const { code, raw } = await loadArtifact('usage: bun scripts/validate-song.mjs <artifact.mjs>')

const reserved = ['m', 'n', 's', 'note', 'stack', 'sound', 'slowcat']
const problems = []

// 1. Required structure
if (!/setcps\s*\(/.test(code)) problems.push('missing a setcps(...) tempo call')
if (!/\b(?:stack|slowcat)\s*\(/.test(code)) problems.push('missing a top-level stack(...) or slowcat(...)')

// 2. JS syntax — construct (do NOT call) to surface bracket/paren/quote/template errors
try {
  new Function(code)
} catch (err) {
  problems.push(`JS syntax error: ${err?.message ?? err}`)
}

// 3. Shadowing a Strudel builtin (crashes mini-notation at play time)
const declShadow = new RegExp(`\\b(?:const|let|var)\\s+(${reserved.join('|')})\\b`).exec(code)
if (declShadow) {
  problems.push(`variable named "${declShadow[1]}" shadows a Strudel builtin — rename it (e.g. phrase/chord/root)`)
}
// single-arg arrow param: (m) => ...   and   function foo(m) { ... }
const paramRe = new RegExp(`(?:\\(\\s*(${reserved.join('|')})\\s*\\)\\s*=>|function\\s+[\\w$]*\\s*\\(\\s*(${reserved.join('|')})\\b)`)
if (paramRe.test(code)) {
  problems.push('a function parameter shadows a Strudel builtin (m/n/s/note/stack/sound/slowcat) — rename it')
}

// 4. note() must come before .s(...)
if (/\bs\(\s*["'`][^"'`]*["'`]\s*\)\s*\.note\(/.test(code)) {
  problems.push('found s(...).note(...) — write note("...") FIRST, then .s(...) (otherwise it sticks on the first note)')
}

// 5. Variable interpolated into a mini-notation template literal (check raw source —
//    the resolved string has already lost the `${...}`). Pass variables into note(x)/s(x) instead.
if (/(?:\bnote|\bs|\.struct)\(\s*`[^`]*\$\{/.test(raw)) {
  problems.push('a variable is interpolated into a mini-notation template literal — pass it into note(x)/s(x) and keep rhythm in a literal .struct("x ~ x ~")')
}

// 6. Balanced brackets inside mini-notation strings ([] <> {} ())
const pairs = { ']': '[', '>': '<', '}': '{', ')': '(' }
const opens = new Set(['[', '<', '{', '('])
for (const lit of code.match(/"[^"]*"/g) ?? []) {
  const inner = lit.slice(1, -1)
  if (!/[[\]<>{}]/.test(inner)) continue // only mini-notation that uses grouping
  const st = []
  let ok = true
  for (const ch of inner) {
    if (opens.has(ch)) st.push(ch)
    else if (ch in pairs) {
      if (st.pop() !== pairs[ch]) { ok = false; break }
    }
  }
  if (!ok || st.length) problems.push(`unbalanced brackets in mini-notation: ${lit}`)
}

// 7. A VARIABLE passed to note()/s() without an m() wrap — the #1 silent failure. String LITERALS
//    are auto-parsed as mini-notation, but a chord/melody/root held in a variable is not: note(chord)
//    throws `not a note: "..."` at play time and the song is silent. Matches note(IDENT)/s(IDENT[..]);
//    skips literals (quotes), numbers, and already-m()-wrapped calls (note(m(...)) has `(` after `m`).
const rawVarCalls = [...code.matchAll(/\b(note|s)\(\s*([A-Za-z_$][\w$]*(?:\s*\[[^\]]*\])?)\s*\)/g)]
  .filter((mt) => mt[2] !== 'm')
const uniqRaw = [...new Set(rawVarCalls.map((mt) => `${mt[1]}(${mt[2]})`))]
if (uniqRaw.length) {
  problems.push(`variable(s) passed to note()/s() without an m() wrap — these play NOTHING; wrap each (e.g. note(m(${rawVarCalls[0][2]}))): ${uniqRaw.join(', ')}`)
}

// 8. Double-quoted note material AWAY from a direct note()/s() call. The transpiler converts
//    EVERY double-quoted literal into a pattern — including array elements and helper-call args.
//    m()-wrapping such a value (per the standard helper recipe) then throws `not a note: Object`
//    at play time. Convention: double quotes ONLY as direct args to note()/s()/pattern methods;
//    note material in arrays or helper args is single-quoted, m()-wrapped once at the boundary.
const CALL_OK = new Set(['note', 's', 'n', 'sound', 'm', 'stack', 'slowcat', 'setcps', 'if', 'for', 'while', 'switch', 'return'])
const dqHelper = [...new Set(
  [...code.matchAll(/(?<![.\w])([a-zA-Z_$][\w$]*)\(\s*"/g)].map((mt) => mt[1]).filter((name) => !CALL_OK.has(name)),
)]
if (dqHelper.length) {
  problems.push(`double-quoted string passed to helper(s) ${dqHelper.map((h) => `${h}()`).join(', ')} — the transpiler already turned it into a pattern, so an m() wrap inside the helper breaks ("not a note: Object"). Use single quotes for the argument.`)
}
// double-quoted CONST/LET string defs whose variable flows into m() or an m()-wrapping helper —
// the transpiler already made the const a pattern, so the m() wrap crashes ("cannot parse as
// numeral: Object" / "not a note: Object") at play time.
{
  // wrapper detection is TRANSITIVE: a helper whose param reaches m() directly, or is
  // forwarded to another wrapper (e.g. padPair -> padSaw -> m()), counts as a wrapper
  const helpers = []
  for (const d of code.matchAll(/(?:const|let)\s+([\w$]+)\s*=\s*\(\s*([\w$]+)[^)]*\)\s*=>/g)) {
    const rest = code.slice(d.index + d[0].length)
    const bodyEnd = rest.search(/\n(?:const|let)\s/)
    helpers.push({ name: d[1], param: d[2], body: bodyEnd === -1 ? rest : rest.slice(0, bodyEnd) })
  }
  const wrapHelpers = new Set()
  let grew = true
  while (grew) {
    grew = false
    for (const h of helpers) {
      if (wrapHelpers.has(h.name)) continue
      const direct = new RegExp(`\\bm\\(\\s*${h.param}\\b`).test(h.body)
      const via = [...wrapHelpers].some((w) => new RegExp(`(?<![.\\w])${w}\\(\\s*${h.param}\\b`).test(h.body))
      if (direct || via) {
        wrapHelpers.add(h.name)
        grew = true
      }
    }
  }
  for (const d of code.matchAll(/(?:const|let)\s+([\w$]+)\s*=\s*"[^"]*"/g)) {
    const v = d[1]
    const flows =
      new RegExp(`\\bm\\(\\s*${v}\\b`).test(code) ||
      [...wrapHelpers].some((w) => new RegExp(`(?<![.\\w])${w}\\(\\s*${v}\\b`).test(code))
    if (flows) {
      problems.push(`const "${v}" is a double-quoted string that gets m()-wrapped (directly or via a helper chain) — the transpiler already turned it into a pattern, so it crashes at play time. Define it with single quotes.`)
    }
  }
  // PATTERN consts (const X = note(...)/s(...)) passed into an m()-wrapping helper — the
  // helper m()-wraps an already-built pattern and crashes the same way. Store the note
  // material as a single-quoted string and let the helper do the one m() wrap.
  for (const d of code.matchAll(/(?:const|let)\s+([\w$]+)\s*=\s*(?:note|s)\(/g)) {
    const v = d[1]
    const flows =
      new RegExp(`\\bm\\(\\s*${v}\\b`).test(code) ||
      [...wrapHelpers].some((w) => new RegExp(`(?<![.\\w])${w}\\(\\s*${v}\\b`).test(code))
    if (flows) {
      problems.push(`const "${v}" is already a pattern (built with note()/s()) but is passed into m() or an m()-wrapping helper — that double-wrap crashes at play time. Store it as a single-quoted string and let the helper wrap it.`)
    }
  }
}
// double-quoted ELEMENTS inside array literals (bracket-aware scan; brackets inside strings ignored)
{
  const arrRe = /const\s+([\w$]+)\s*=\s*\[/g
  let am
  while ((am = arrRe.exec(code))) {
    let i = arrRe.lastIndex - 1, depth = 0, inStr = false, q = '', hasDq = false
    for (; i < code.length; i++) {
      const ch = code[i]
      if (inStr) {
        if (ch === q) inStr = false
      } else if (ch === '"' || ch === "'") {
        inStr = true
        q = ch
        if (ch === '"' && /[[,]\s*$/.test(code.slice(am.index, i))) hasDq = true
      } else if (ch === '[') depth++
      else if (ch === ']' && --depth === 0) break
    }
    if (hasDq) {
      problems.push(`array "${am[1]}" holds double-quoted strings — the transpiler turns them into patterns inside the array, so m()-wrapping them at use breaks ("not a note: Object"). Use single quotes for note material in arrays.`)
    }
  }
}

if (problems.length) {
  console.error(`FAIL: ${problems.length} problem(s):`)
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}

const sections = (code.match(/[\w$]+/g) ?? []).length
console.log(`OK structure + syntax checks passed (${code.split('\n').length} lines, ${sections} tokens)`)
