// Fixture: rule 4 — .note(...) chained after s(...), which sticks on the first note.
export const title = 'S Before Note'
export const cycles = 4
export const code = `
setcps(0.5)
stack(
  s("bd sd bd sd"),
  s("sine").note("c3 e3 g3 e3").gain(0.5)
)
`
