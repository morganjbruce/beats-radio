const binRange = (start: number, end: number, binCount: number): [number, number] => {
  const minBin = 2
  const maxBin = Math.floor(binCount * 0.72)
  const first = Math.floor(minBin * Math.pow(maxBin / minBin, start))
  const last = Math.max(first + 1, Math.floor(minBin * Math.pow(maxBin / minBin, end)))
  return [first, Math.min(last, binCount)]
}

export const magnitude = (frequency: Uint8Array, start: number, end: number) => {
  const [first, last] = binRange(start, end, frequency.length)
  let sum = 0
  for (let bin = first; bin < last; bin++) sum += frequency[bin]
  let value = sum / (last - first) / 255
  value *= 0.7 + 0.6 * start
  return Math.min(1, value)
}

export const overallEnergy = (frequency: Uint8Array) => {
  let energy = 0
  for (let bin = 2; bin < 42; bin++) energy += frequency[bin]
  return energy / (40 * 255)
}

export const bassEnergy = (frequency: Uint8Array) => {
  let bass = 0
  for (let bin = 2; bin < 14; bin++) bass += frequency[bin]
  return bass / (12 * 255)
}
