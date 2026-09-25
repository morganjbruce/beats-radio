import { expect, test } from 'bun:test'
import { shuffle } from '../src/shuffle'

test('shuffling preserves every song object and permalink ID without mutating the source', () => {
  const songs = [{ id: 138 }, { id: 91 }, { id: 7 }, { id: 1 }]
  const original = [...songs]
  const shuffled = shuffle(songs, () => 0)
  expect(shuffled.map(song => song.id)).toEqual([91, 7, 1, 138])
  expect(songs).toEqual(original)
  expect(new Set(shuffled)).toEqual(new Set(songs))
  expect(shuffled.find(song => song.id === 7)).toBe(songs[2])
})

test('handles empty and single-song libraries', () => {
  expect(shuffle([])).toEqual([])
  const song = { id: 42 }
  expect(shuffle([song])).toEqual([song])
})
