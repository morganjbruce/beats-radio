import { expect, test } from 'bun:test'
import { Database } from 'bun:sqlite'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { cleanupSongMetadata } from './cleanup-song-metadata'

test('cleanup preserves IDs, music, timestamps and existing models, with a restorable backup', () => {
  const dir = mkdtempSync(join(tmpdir(), 'beats-cleanup-test-'))
  const path = join(dir, 'history.db')
  const db = new Database(path)
  try {
    db.run('CREATE TABLE songs (id INTEGER PRIMARY KEY, ts INTEGER, author TEXT, model TEXT, code TEXT, prompt TEXT)')
    const insert = db.query('INSERT INTO songs VALUES (?, ?, ?, ?, ?, ?)')
    insert.run(7, 123, null, null, 'first song', 'original brief')
    insert.run(91, 456, 'exedev', '  ', 'second song', null)
    insert.run(138, 789, 'morgan', 'claude-opus-5-5', 'third song', 'another brief')
    const rows = () => db.query('SELECT * FROM songs ORDER BY id').all() as Record<string, unknown>[]
    const before = rows()
    expect(cleanupSongMetadata(path)).toEqual({ applied: false, songs: 3, authorsToFix: 2, missingModels: 2 })
    expect(rows()).toEqual(before)
    const result = cleanupSongMetadata(path, true)
    expect(result).toMatchObject({ applied: true, songs: 3, authorsUpdated: 2, modelsUpdated: 2 })
    expect(rows()).toEqual(before.map(row => ({ ...row, author: 'morgan', model: String(row.model ?? '').trim() ? row.model : 'claude-opus-4.8' })))
    if (!('backup' in result)) throw new Error('Missing backup')
    const backup = new Database(result.backup, { readonly: true })
    try { expect(backup.query('SELECT * FROM songs ORDER BY id').all()).toEqual(before) }
    finally { backup.close() }
    expect(cleanupSongMetadata(path, true)).toMatchObject({ authorsUpdated: 0, modelsUpdated: 0 })
  } finally {
    db.close()
    rmSync(dir, { recursive: true, force: true })
  }
})
