// Boots the real server (express + bun:sqlite) on an ephemeral port with a throwaway
// state dir — shared by every server test file so the lifecycle dance lives once.
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { AddressInfo } from 'node:net'
import type { Server } from 'node:http'
import { startServer } from './index'

export interface TestServer {
  server: Server
  dir: string
  url: string
}

export function boot(opts: { staticDir?: string } = {}): TestServer {
  const dir = mkdtempSync(join(tmpdir(), 'beats-test-'))
  const server = startServer({ port: 0, stateDir: dir, ...opts }) as unknown as Server
  const { port } = server.address() as AddressInfo
  return { server, dir, url: `http://localhost:${port}` }
}

export function shutdown(ctx: TestServer): Promise<void> {
  return new Promise((resolve) => {
    // close() alone waits for lingering keep-alive/SSE sockets and would hang the hook
    ctx.server.closeAllConnections?.()
    ctx.server.close(() => {
      rmSync(ctx.dir, { recursive: true, force: true })
      resolve()
    })
  })
}

export const postSong = (url: string, body: unknown, headers: Record<string, string> = {}) =>
  fetch(`${url}/api/beats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
