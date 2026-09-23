// Run via agent-browser on the Vite preview. Real canvas checks plus an optional comparison sheet.
export async function checkFinePixels(showComparison = false) {
  const { createPixelPainter } = await import('/src/components/visualizer/pixelPainter.ts')
  const { createModeRegistry } = await import('/src/components/visualizer/modes/index.ts')
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 40
  const context = canvas.getContext('2d', { willReadFrequently: true })
  // Batching must preserve overpainting order between square runs.
  const renderTiles = batch => {
    context.clearRect(0, 0, 40, 40)
    const tiles = createPixelPainter(context, { cols: 10, rows: 10 }, 4, false, 0, batch)
    for (let row = 0; row < 10; row++)
      for (let col = 0; col < 10; col++) tiles.cell(col, row, row < 5 ? '#468' : '#abc')
    for (let col = 2; col < 8; col++)
      for (let row = 2; row < 8; row++) tiles.cell(col, row, '#d75')
    for (let index = 0; index < 4; index++) {
      tiles.cell(index + 2, 5, '#236')
      tiles.cell(index + 3, 4, '#fcb')
    }
    tiles.flush()
    return context.getImageData(0, 0, 40, 40).data
  }
  const immediate = renderTiles(false)
  const batched = renderTiles(true)
  if (immediate.some((value, index) => value !== batched[index]))
    throw new Error('Batching changed the rendered pixels or overpainting order')

  const modes = createModeRegistry()
  const frequency = Uint8Array.from({ length: 2048 }, (_, i) => Math.round(155 * Math.exp(-i / 500)))
  const waveform = new Uint8Array(4096).fill(128)
  const sheet = document.createElement('canvas')
  sheet.width = 720
  sheet.height = 1116
  const sheetContext = sheet.getContext('2d')
  sheetContext.fillStyle = '#f4f6fc'
  sheetContext.fillRect(0, 0, sheet.width, sheet.height)
  const metrics = []
  for (const [pair, name] of ['japan', 'outrun', 'neoncity'].entries()) {
    canvas.width = 720
    canvas.height = 324
    const grid = { cols: 120, rows: 54 }
    const pixels = createPixelPainter(context, grid, 6, true)
    const mode = modes[name]
    mode.resize(grid)
    let triangles = 0
    const fill = context.fill.bind(context)
    context.fill = (...args) => { triangles++; fill(...args) }
    let seed = 42
    const random = Math.random
    const durations = []
    try {
      Math.random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
      for (let tick = 1; tick <= 120; tick++) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        pixels.resetFillCache()
        const start = performance.now()
        mode.draw({ canvas, context, ...grid, ...pixels, frequency, waveform,
          tick, flash: tick % 30 < 3 ? 1 : 0, now: tick * 1000 / 60 })
        durations.push(performance.now() - start)
      }
    } finally {
      Math.random = random
      context.fill = fill
    }
    if (triangles !== 0) throw new Error(`${name} used non-square cells`)
    {
      const rgba = context.getImageData(0, 0, canvas.width, canvas.height).data
      const gridColor = name === 'neoncity' ? [5, 9, 20, 255]
        : name === 'outrun' ? [112, 83, 68, 255] : [244, 246, 252, 255]
      const gridOpacity = name === 'outrun' ? 0.45 : 1
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const index = (y * canvas.width + x) * 4
          const cellIndex = ((y - y % 4 + 1) * canvas.width + x - x % 4 + 1) * 4
          if (x % 4 === 0 || y % 4 === 0) {
            if (gridColor.some((color, c) => Math.abs(rgba[index + c]
              - (color * gridOpacity + rgba[cellIndex + c] * (1 - gridOpacity))) > 1.5))
              throw new Error(`${name} has a missing grid line at ${x},${y}`)
          } else {
            for (let c = 0; c < 4; c++)
              if (rgba[index + c] !== rgba[cellIndex + c])
                throw new Error(`${name} has a partially filled cell at ${x},${y}`)
          }
        }
      }
    }
    durations.sort((a, b) => a - b)
    metrics.push({ name, triangles, meanMs: +(durations.reduce((a, b) => a + b) / durations.length).toFixed(2), p95Ms: +durations[114].toFixed(2) })
    sheetContext.fillStyle = '#26384b'
    sheetContext.font = '16px monospace'
    sheetContext.fillText(`${name} · 4 px square grid`, 16, pair * 372 + 30)
    sheetContext.drawImage(canvas, 0, pair * 372 + 48)
  }
  if (showComparison) {
    const preview = document.createElement('div')
    preview.style.cssText = 'position:fixed;inset:0;z-index:99999;overflow:auto;background:#f4f6fc'
    preview.append(sheet)
    document.body.append(preview)
  }
  return { squareCellsOnly: true, gridLinesIntact: true, batchPixelsMatch: true, metrics }
}
