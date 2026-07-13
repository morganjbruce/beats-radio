// Fixture: rule 5 — a variable interpolated into a mini-notation template literal.
// The rule checks the RAW source (a resolved code string has already lost the
// `\${...}`), so the offending literal lives at the artifact's top level; the
// static gate never executes it.
export const title = 'Interpolated Mini-Notation'
export const cycles = 4
const root = 'c3'
export const lead = note(`${root} e3 g3 e3`)
export const code = `
setcps(0.5)
stack(
  s("bd sd bd sd"),
  note('c3 e3 g3 e3').s("sine").gain(0.5)
)
`
