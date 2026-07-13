// Fixture: rule 7 — a variable passed to note() without an m() wrap (plays nothing).
export const title = 'Unwrapped Variable'
export const cycles = 4
export const code = `
setcps(0.5)
const melody = 'c3 e3 g3 e3'
stack(
  s("bd sd bd sd"),
  note(melody).s("sine").gain(0.5)
)
`
