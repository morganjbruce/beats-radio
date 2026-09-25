// Run with agent-browser on Vite to exercise the mounted React event handlers.
export async function checkVisualizerNavigation() {
  const { MODES, MODE_LABELS } = await import('./visualizer/modes/index.ts')
  const { MODE_KEY } = await import('./visualizer/constants.ts')
  const stage = document.querySelector('section[aria-label^="Music visualizer"]')
  const canvas = stage?.querySelector('canvas')
  if (!stage || !canvas) throw new Error('Missing visualizer')
  const settle = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  await settle()
  let index = MODES.indexOf(localStorage.getItem(MODE_KEY))
  if (index < 0) throw new Error('Missing selected mode')
  const initialIndex = index
  let checks = 0
  const expectStep = async (direction, activate) => {
    activate()
    await settle()
    index = (index + direction + MODES.length) % MODES.length
    if (!stage.getAttribute('aria-label').startsWith(`Music visualizer (${MODE_LABELS[MODES[index]]} mode)`))
      throw new Error(`Expected ${MODES[index]} after step ${checks + 1}`)
    if (localStorage.getItem(MODE_KEY) !== MODES[index])
      throw new Error('Mode selection was not saved')
    checks++
  }
  const click = (fraction, detail = 1) => {
    const bounds = stage.getBoundingClientRect()
    canvas.dispatchEvent(new MouseEvent('click', {
      bubbles: true, detail,
      clientX: bounds.left + bounds.width * fraction,
      clientY: bounds.top + bounds.height / 2,
    }))
  }
  // A complete loop each way covers both wrap boundaries and every scene pair.
  for (let step = 0; step < MODES.length; step++)
    await expectStep(-1, () => click(0.25))
  for (let step = 0; step < MODES.length; step++)
    await expectStep(1, () => click(0.75))
  await expectStep(-1, () => click(0.499))
  await expectStep(1, () => click(0.5))
  stage.focus()
  for (const key of ['ArrowLeft', 'ArrowRight', 'Enter', ' ']) {
    await expectStep(key === 'ArrowLeft' ? -1 : 1, () => {
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
      stage.dispatchEvent(event)
      if (!event.defaultPrevented) throw new Error(`${key} could also scroll the page`)
    })
  }
  // Screen-reader activation has no pointer coordinates.
  await expectStep(1, () => canvas.click())
  while (index !== initialIndex) await expectStep(-1, () => click(0.25))
  return { checks, leftAndRight: true, wrapsBothWays: true, keyboard: true, selectionSaved: true }
}
