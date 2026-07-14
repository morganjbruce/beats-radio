// OG-tag injection for /?song=<id> permalinks: real songs gain og:/twitter: meta
// (entity-escaped), everything else gets the untouched template.
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { boot, shutdown, postSong, type TestServer } from './test-helpers'

const TEMPLATE = '<!doctype html>\n<html><head><title>Beats</title></head><body><div id="root"></div></body></html>'

let ctx: TestServer

beforeAll(async () => {
  const staticDir = mkdtempSync(join(tmpdir(), 'beats-og-static-'))
  writeFileSync(join(staticDir, 'index.html'), TEMPLATE)
  mkdirSync(join(staticDir, 'assets'))
  writeFileSync(join(staticDir, 'assets', 'app.js'), 'export {}')
  ctx = boot({ staticDir })

  const posted = await postSong(ctx.url, {
    title: 'Neon "Quotes" & <Tags>',
    genre: 'Test genre — synthwave',
    mood: 'A mood line.',
    author: 'tester',
    code: 'setcps(0.5)\nstack(s("bd"))',
  })
  expect(posted.status).toBe(200)
})

afterAll(() => shutdown(ctx))

describe('og meta injection', () => {
  test('valid /?song=<id> gets og tags with escaped fields', async () => {
    const html = await (await fetch(`${ctx.url}/?song=1`)).text()
    expect(html).toContain('<meta property="og:title" content="Neon &quot;Quotes&quot; &amp; &lt;Tags&gt;" />')
    expect(html).toContain('og:description')
    expect(html).toContain('by tester · Test genre — synthwave · A mood line.')
    expect(html).toContain(`<meta property="og:url" content="${ctx.url}/?song=1" />`)
    expect(html).toContain('<meta name="twitter:card" content="summary" />')
    expect(html).not.toContain('content="Neon "Quotes"')
  })

  test('unknown id serves the untouched template', async () => {
    const html = await (await fetch(`${ctx.url}/?song=999`)).text()
    expect(html).toBe(TEMPLATE)
  })

  test('garbage id serves the untouched template', async () => {
    for (const q of ['abc', '-1', '1.7e309', '1%3Bscript']) {
      const html = await (await fetch(`${ctx.url}/?song=${q}`)).text()
      expect(html).toBe(TEMPLATE)
    }
  })

  test('root without ?song serves the untouched template', async () => {
    const html = await (await fetch(`${ctx.url}/`)).text()
    expect(html).toBe(TEMPLATE)
  })

  test('static assets still serve through express.static', async () => {
    const res = await fetch(`${ctx.url}/assets/app.js`)
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('export {}')
  })

  test('SPA fallback still serves html for client routes', async () => {
    const res = await fetch(`${ctx.url}/some/client/route`)
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/html')
  })
})
