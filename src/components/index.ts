export { Visualizer } from './Visualizer'
// StrudelHost is deliberately NOT value-exported: BeatsPlayer lazy()-imports the file
// directly so the >500kB Strudel/CodeMirror graph stays out of the main chunk. The
// type-only re-export is erased at compile time, so it costs nothing.
export type { StrudelAdapter } from './StrudelHost'
