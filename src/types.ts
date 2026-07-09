// The song wire contract shared by the server and the player: the SSE `song` event
// payload, the /api/beats/history row, and the POST /api/beats body all carry this shape.
// One definition so the two halves of the app can't drift.
export interface BeatsSong {
  id?: number // DB row id — the player uses it for /?song=<id> permalinks
  title?: string
  genre?: string
  mood?: string
  author?: string // who (or whose agent) pushed the song — shown in the player
  model?: string // which model generated it (provenance, stored for future analysis)
  prompt?: string // the composition brief (provenance; stored server-side, never sent to clients)
  cycles?: number // how many Strudel cycles to play before advancing
  code: string
}
