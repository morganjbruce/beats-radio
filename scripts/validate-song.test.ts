// End-to-end: spawn the validator the way agents run it, one bad fixture per rule.
import { describe, expect, test } from 'bun:test'
import { join } from 'node:path'

const root = join(import.meta.dir, '..')
const fixture = (name: string) => join(root, 'scripts', 'fixtures', name)

function runValidator(...args: string[]) {
  const proc = Bun.spawnSync(['bun', 'scripts/validate-song.mjs', ...args], { cwd: root })
  return {
    exitCode: proc.exitCode,
    stdout: proc.stdout.toString(),
    stderr: proc.stderr.toString(),
  }
}

describe('validate-song.mjs', () => {
  test('passes a known-good real artifact', () => {
    const r = runValidator(join(root, 'examples', 'radio', 'soft-compiler-5.mjs'))
    expect(r.stdout).toContain('OK')
    expect(r.exitCode).toBe(0)
  })

  const badCases: [file: string, expected: string][] = [
    ['missing-setcps.mjs', 'missing a setcps(...) tempo call'],
    ['missing-stack.mjs', 'missing a top-level stack(...) or slowcat(...)'],
    ['syntax-error.mjs', 'JS syntax error'],
    ['shadow-m.mjs', 'variable named "m" shadows a Strudel builtin'],
    ['s-before-note.mjs', 'found s(...).note(...) — write note("...") FIRST'],
    ['interpolated-mini.mjs', 'a variable is interpolated into a mini-notation template literal'],
    ['unbalanced-brackets.mjs', 'unbalanced brackets in mini-notation: "[c3 e3 g3 e3'],
    ['unwrapped-variable.mjs', 'variable(s) passed to note()/s() without an m() wrap'],
    [
      'dq-const-through-helper.mjs',
      'const "lead" is a double-quoted string that gets m()-wrapped (directly or via a helper chain)',
    ],
  ]

  for (const [file, expected] of badCases) {
    test(`fails ${file}: ${expected.slice(0, 40)}...`, () => {
      const r = runValidator(fixture(file))
      expect(r.exitCode).toBe(1)
      expect(r.stderr).toContain(expected)
      // exactly this rule's problem, no collateral trips from the fixture's scaffolding
      expect(r.stderr).toContain('FAIL: 1 problem(s):')
    })
  }
})

describe('artifact loading via validate-song.mjs', () => {
  test('no argument: prints usage and exits 2', () => {
    const r = runValidator()
    expect(r.exitCode).toBe(2)
    expect(r.stderr).toContain('usage: bun scripts/validate-song.mjs <artifact.mjs>')
  })

  test('missing code export: exits 1', () => {
    const r = runValidator(fixture('no-code-export.mjs'))
    expect(r.exitCode).toBe(1)
    expect(r.stderr).toContain('FAIL: artifact must export a non-empty `code` string')
  })

  test('unreadable file: exits 1 with a load FAIL', () => {
    const r = runValidator(fixture('does-not-exist.mjs'))
    expect(r.exitCode).toBe(1)
    expect(r.stderr).toContain('FAIL: could not load artifact')
  })
})
