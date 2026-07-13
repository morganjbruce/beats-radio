// Rich unfurls for shared /?song=<id> permalinks: splice og:/twitter: meta into the SPA
// template so links preview as the song instead of a blank card. Unknown/garbage ids get
// the untouched template.
import type { Request } from 'express'
import type { BeatsSong } from '../src/types'

export type SongMeta = Pick<BeatsSong, 'id' | 'title' | 'genre' | 'mood' | 'author'>
export type SongMetaLookup = (id: number) => SongMeta | null

// Song fields land inside meta-tag attributes — full entity escaping or it's an injection vector.
const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

export function withSongMeta(indexHtml: string, req: Request, lookup: SongMetaLookup): string {
  const id = Math.trunc(Number(req.query.song))
  if (!Number.isInteger(id) || id <= 0) return indexHtml
  const song = lookup(id)
  if (!song) return indexHtml
  const title = escapeHtml(song.title ?? `Song #${song.id}`)
  const description = escapeHtml(
    [song.author ? `by ${song.author}` : null, song.genre, song.mood].filter(Boolean).join(' · ').slice(0, 300),
  )
  // behind fly's proxy the request protocol arrives in x-forwarded-proto
  const proto = (req.headers['x-forwarded-proto'] as string | undefined)?.split(',')[0] ?? req.protocol
  const url = escapeHtml(`${proto}://${req.get('host')}/?song=${song.id}`)
  const tags = [
    `<meta property="og:site_name" content="Beats" />`,
    `<meta property="og:type" content="music.song" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta name="twitter:card" content="summary" />`,
  ].join('\n    ')
  return indexHtml.replace('</head>', `    ${tags}\n  </head>`)
}
