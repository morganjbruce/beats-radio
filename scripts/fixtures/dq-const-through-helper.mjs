// Fixture: rule 8 — a double-quoted pattern string stored in a const, then passed
// through a helper that m()-wraps it (the transpiler already made it a pattern).
export const title = 'Double-Quoted Const Through Helper'
export const cycles = 4
export const code = `
setcps(0.5)
const lead = "c3 e3 g3 e3"
const pad = (p) => note(m(p)).s("sine").gain(0.5)
stack(
  s("bd sd bd sd"),
  pad(lead)
)
`
