// Fixture: rule 2 — the code string is not valid JS (unclosed paren).
export const title = 'Syntax Error'
export const cycles = 4
export const code = `
setcps(0.5)
stack(
  s("bd sd bd sd"),
  note("c3 e3 g3 e3").s("sine").gain(0.5)
`
