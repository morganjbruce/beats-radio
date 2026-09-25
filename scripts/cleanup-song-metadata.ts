// One-time library maintenance. Dry run by default:
// bun scripts/cleanup-song-metadata.ts /app/.beats/history.db [--apply]
import { Database } from 'bun:sqlite'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { randomUUID } from 'node:crypto'

export function cleanupSongMetadata(file: string, apply = false) {
  const path = resolve(file)
  if (!existsSync(path)) throw new Error(`Database does not exist: ${path}`)
  const db = new Database(path, apply ? { readwrite: true } : { readonly: true })
  try {
    db.run('PRAGMA busy_timeout = 5000')
    const counts = () => db.query(`SELECT COUNT(*) AS songs,
      COALESCE(SUM(author IS NOT 'morgan'), 0) AS authorsToFix,
      COALESCE(SUM(model IS NULL OR trim(model) = ''), 0) AS missingModels
      FROM songs`).get() as { songs: number; authorsToFix: number; missingModels: number }
    if (!apply) return { applied: false, ...counts() }

    // SQLite makes a consistent backup, including WAL data, before any updates.
    const backup = `${path}.before-metadata-cleanup-${randomUUID()}.sqlite`
    db.query('VACUUM INTO ?').run(backup)
    return db.transaction(() => {
      const before = counts()
      const authors = db.query("UPDATE songs SET author = 'morgan' WHERE author IS NOT 'morgan'").run().changes
      const models = db.query("UPDATE songs SET model = 'claude-opus-4.8' WHERE model IS NULL OR trim(model) = ''").run().changes
      const after = counts()
      if (after.songs !== before.songs || after.authorsToFix || after.missingModels)
        throw new Error('Metadata verification failed; rolling back')
      return { applied: true, songs: after.songs, authorsUpdated: authors, modelsUpdated: models, backup }
    }).immediate()
  } finally {
    db.close()
  }
}

if (import.meta.main) {
  const [file, ...flags] = process.argv.slice(2)
  if (!file || flags.some(flag => flag !== '--apply')) {
    console.error('Usage: bun scripts/cleanup-song-metadata.ts <history.db> [--apply]')
    process.exit(2)
  }
  console.log(JSON.stringify(cleanupSongMetadata(file, flags.includes('--apply')), null, 2))
}
