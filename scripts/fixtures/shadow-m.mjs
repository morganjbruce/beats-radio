// Fixture: rule 3 — a variable named `m` shadows the Strudel mini-notation builtin.
export const title = 'Shadowed Builtin'
export const cycles = 4
export const code = `
setcps(0.5)
const m = 'c3 e3 g3 e3'
stack(
  s("bd sd bd sd"),
  note('c3 e3 g3 e3').s("sine").gain(0.5)
)
`
