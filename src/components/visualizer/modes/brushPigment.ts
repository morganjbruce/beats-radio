const PIGMENTS = [
  { color: '#cc4929', highlight: '#e27750', shadow: '#ad3c21' },
  { color: '#c33c56', highlight: '#e37987', shadow: '#952d46' },
  { color: '#d47c29', highlight: '#ebb364', shadow: '#aa551c' },
  { color: '#8d467c', highlight: '#b77aa2', shadow: '#68315f' },
  { color: '#ce664d', highlight: '#eca184', shadow: '#a04736' },
  { color: '#b89328', highlight: '#dcc16d', shadow: '#8d6b1d' },
] as const

/** Reload the broad brush with fresh pigment after three or four painted gestures. */
export function createBrushPigment(random = Math.random) {
  let index = 0
  let lastStroke: number | undefined
  let strokes = 0
  let limit = 3 + Math.floor(random() * 2)
  return {
    forStroke(stroke: number) {
      if (stroke !== lastStroke) {
        if (strokes === limit) {
          index = (index + 1 + Math.floor(random() * (PIGMENTS.length - 1))) % PIGMENTS.length
          limit = 3 + Math.floor(random() * 2)
          strokes = 0
        }
        lastStroke = stroke
        strokes++
      }
      return PIGMENTS[index]
    },
  }
}
