// Run with agent-browser eval on the Vite preview:
// import('/scripts/brush-tip.browser-check.mjs').then(m => m.checkBrushTip())
export async function checkBrushTip() {
  const { paintBrush } = await import('/src/components/visualizer/modes/paintTexture.ts')
  const canvas = document.createElement('canvas')
  canvas.width = 300
  canvas.height = 140
  const context = canvas.getContext('2d')
  const brush = { color: '#cc4929', highlight: '#e27750', shadow: '#ad3c21', bristles: 25,
    life: 12, naturalTip: true, points: Array.from({ length: 30 }, (_, index) => ({
      x: 65 + index * 5, y: 70, nx: 0, ny: 1, width: 70, stroke: 9, time: index / 30,
    })),
  }
  paintBrush(context, brush, 1, 140)
  const pixels = context.getImageData(0, 0, 300, 140).data
  const fronts = []
  for (let y = 48; y <= 92; y++) {
    let front = 0
    for (let x = 190; x < 260; x++) if (pixels[(y * 300 + x) * 4 + 3] > 220) front = x
    fronts.push(front)
    for (let x = 190; x < 206; x++) {
      if (pixels[(y * 300 + x) * 4 + 3] < 220) throw new Error('The loaded paint body became transparent or spotty')
    }
  }
  const frontVariation = Math.max(...fronts) - Math.min(...fronts)
  if (frontVariation < 5 || Math.max(...fronts) < 220) throw new Error('The brush still has a flat front edge')
  const before = canvas.toDataURL()
  context.clearRect(0, 0, 300, 140)
  paintBrush(context, brush, 1.1, 140)
  if (before !== canvas.toDataURL()) throw new Error('The tip texture changes when the brush is stationary')
  return { frontVariation, solidPaintBody: true, stableTip: true }
}

export async function checkBrushFade() {
  const { paintBrush, strokeOpacity } = await import('/src/components/visualizer/modes/paintTexture.ts')
  const canvas = document.createElement('canvas')
  canvas.width = 380
  canvas.height = 180
  const context = canvas.getContext('2d')
  let maxOpacityError = 0, checkedPixels = 0
  for (const bristles of [25, 6]) {
    const brush = { color: bristles === 25 ? '#cc4929' : '#174f8d',
      highlight: '#e27750', shadow: '#ad3c21', bristles, life: 12, naturalTip: true,
      points: Array.from({ length: 80 }, (_, index) => ({
        x: 45 + index * 3.5, y: 90 + Math.sin(index * 0.17) * 18,
        nx: 0, ny: 1, width: bristles === 25 ? 48 : 14, stroke: 3, time: index / 20,
      })),
    }
    const finishedAt = brush.points.at(-1).time
    const render = age => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      paintBrush(context, brush, finishedAt + age, 180)
      return context.getImageData(0, 0, canvas.width, canvas.height).data
    }
    const fresh = render(0)
    for (const age of [2, 6, 10]) {
      const faded = render(age)
      for (let i = 3; i < fresh.length; i += 4) {
        if (fresh[i] < 180) continue
        const error = Math.abs(faded[i] / fresh[i] - strokeOpacity(age, brush.life))
        maxOpacityError = Math.max(maxOpacityError, error)
        checkedPixels++
      }
    }
    const expired = render(13)
    if (expired.some((value, index) => index % 4 === 3 && value)) throw new Error('Expired paint remains visible')
  }
  if (checkedPixels < 1000 || maxOpacityError > 0.015) {
    throw new Error(`Uneven whole-stroke fading: ${maxOpacityError} across ${checkedPixels} pixels`)
  }
  return { maxOpacityError, checkedPixels, wholeStrokesFadeUniformly: true }
}
