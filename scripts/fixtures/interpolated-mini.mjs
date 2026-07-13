// Fixture: rule 5 — a variable interpolated into a mini-notation template literal.
// The rule checks the RAW source, so the offending literal lives at the artifact's
// top level (behind a stub so the file still imports cleanly).
export const title = 'Interpolated Mini-Notation'
export const cycles = 4
const stub = { struct: (x) => x }
const rhythm = 'x ~ x ~'
export const lead = stub.struct(`${rhythm} x x`)
export const code = `
setcps(0.5)
stack(
  s("bd sd bd sd"),
  note('c3 e3 g3 e3').s("sine").gain(0.5)
)
`
