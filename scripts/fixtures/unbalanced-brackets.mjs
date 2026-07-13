// Fixture: rule 6 — unbalanced brackets inside a mini-notation string.
export const title = 'Unbalanced Brackets'
export const cycles = 4
export const code = `
setcps(0.5)
stack(
  s("bd sd bd sd"),
  note("[c3 e3 g3 e3").s("sine").gain(0.5)
)
`
