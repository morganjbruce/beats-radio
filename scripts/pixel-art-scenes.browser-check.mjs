// Run in the Vite browser: real Canvas2D coverage of Claude-generated scene behavior.
export async function checkPixelArtScenes(names = ['forest', 'futurecity', 'desert', 'neoncity', 'japan', 'creatures', 'kpop']) {
  const modules = {
    forest: ['forestScene', 'createForestScene'],
    futurecity: ['futureCityScene', 'createFutureCityScene'],
    desert: ['desertScene', 'createDesertScene'],
    neoncity: ['parallaxCityScene', 'createParallaxCityScene'],
    japan: ['japanScene', 'createJapanScene'],
    creatures: ['creatureScene', 'createCreatureScene'],
    kpop: ['kpopDanceScene', 'createKpopDanceScene'],
  }
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  const quiet = { bass: 0, treble: 0, energy: 0, beat: false }
  const changedPixels = (a, b) => {
    let changed = 0
    for (let i = 0; i < a.length; i += 4)
      if (a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2]) changed++
    return changed
  }
  const result = []
  for (const name of names) {
    const [file, exported] = modules[name]
    const createScene = (await import(`/src/components/visualizer/modes/${file}.ts`))[exported]
    const render = (kind) => {
      canvas.width = 320
      canvas.height = 100
      const scene = createScene()
      scene.resize(canvas.width, canvas.height)
      for (let frame = 0; frame < 30; frame++) {
        const audio = kind === 'frequency'
          ? { bass: 0.9, treble: 0.8, energy: 0.85, beat: false }
          : { ...quiet, beat: kind === 'beat' && frame === 20 }
        scene.draw(ctx, canvas.width, canvas.height, audio, 1 / 60)
      }
      return ctx.getImageData(0, 0, canvas.width, canvas.height).data.slice()
    }
    const baseline = render('quiet')
    const deterministic = changedPixels(baseline, render('quiet')) === 0
    const frequencyChangedPixels = changedPixels(baseline, render('frequency'))
    const beatChangedPixels = changedPixels(baseline, render('beat'))
    if (!deterministic || frequencyChangedPixels === 0 || beatChangedPixels === 0)
      throw new Error(`${name}: ${JSON.stringify({ deterministic, frequencyChangedPixels, beatChangedPixels })}`)
    let choreographyChangedPixels
    if (['creatures', 'kpop'].includes(name)) {
      const pose = beatPhase => {
        canvas.width = 320
        canvas.height = 100
        const scene = createScene()
        scene.resize(320, 100)
        for (let frame = 0; frame < 20; frame++)
          scene.draw(ctx, 320, 100, { bass: 0.6, treble: 0.4, energy: 0.6, beat: false, beatCount: 3, beatPhase }, 1 / 60)
        return ctx.getImageData(0, 0, 320, 100).data.slice()
      }
      choreographyChangedPixels = changedPixels(pose(0.15), pose(0.65))
      if (!choreographyChangedPixels) throw new Error(`${name} poses ignore the song beat phase`)
    }
    const sizes = []
    for (const [width, height] of [[16, 8], [98, 145], [320, 76], [480, 220]]) {
      canvas.width = width
      canvas.height = height
      const scene = createScene()
      scene.resize(width, height)
      const start = performance.now()
      for (let frame = 0; frame < 20; frame++)
        scene.draw(ctx, width, height, { bass: 0.7, treble: 0.6, energy: 0.6, beat: frame === 8 }, 1 / 60)
      const msPerFrame = (performance.now() - start) / 20
      const pixels = ctx.getImageData(0, 0, width, height).data
      for (let i = 3; i < pixels.length; i += 4)
        if (pixels[i] !== 255) throw new Error(`${name} has uncovered pixels at ${width}x${height}`)
      sizes.push({ width, height, msPerFrame: +msPerFrame.toFixed(2) })
    }
    result.push({ name, deterministic, frequencyChangedPixels, beatChangedPixels, choreographyChangedPixels, sizes })
  }
  return result
}

export async function checkPixelArtPlayback() {
  const stage = document.querySelector('section[aria-label^="Music visualizer"]')
  const canvas = stage?.querySelector('canvas')
  if (!canvas) throw new Error('Missing visualizer canvas')
  const wait = () => new Promise(resolve => setTimeout(resolve, 250))
  const image = () => canvas.toDataURL()
  const before = image()
  await wait()
  const animated = before !== image()
  const pause = document.querySelector('button[title="Pause"]')
  if (!pause) throw new Error('Start playback before testing')
  pause.click()
  await wait()
  const frozenFrame = image()
  await wait()
  const frozen = frozenFrame === image()
  const resume = document.querySelector('button[title="Play"]')
  if (!resume) throw new Error('Pause did not show the Play control')
  resume.click()
  await wait()
  const resumed = frozenFrame !== image()
  if (!animated || !frozen || !resumed)
    throw new Error(JSON.stringify({ animated, frozen, resumed }))
  return { animated, frozen, resumed }
}
