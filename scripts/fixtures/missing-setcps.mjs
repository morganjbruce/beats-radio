// Fixture: rule 1a — no setcps(...) tempo call anywhere in the code.
export const title = 'Missing Setcps'
export const cycles = 4
export const code = `
stack(
  s("bd sd bd sd"),
  note("c3 e3 g3 e3").s("sine").gain(0.5)
)
`
