// Fixture: rule 1b — no top-level stack(...) or slowcat(...).
export const title = 'Missing Stack'
export const cycles = 4
export const code = `
setcps(0.5)
note("c3 e3 g3 e3").s("sine").gain(0.5)
`
