import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin } from 'vite'

// In-memory state + SSE clients
let liveState: Record<string, unknown> = {
  activeItemId: null,
  activeSlideId: null,
  isBlanked: false,
  showReference: true,
  pipLayout: 'lower-third',
  pipPosition: 'bottom-left',
}
const clients = new Set<import('http').ServerResponse>()

function broadcast() {
  const data = `data: ${JSON.stringify(liveState)}\n\n`
  for (const res of clients) {
    try { res.write(data) } catch { clients.delete(res) }
  }
}

function ssePlugin(): Plugin {
  return {
    name: 'sse-state',
    configureServer(server) {
      server.middlewares.use('/api/state', (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

        if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

        if (req.method === 'GET' && req.url === '/') {
          // current state snapshot
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(liveState))
          return
        }

        if (req.method === 'GET' && req.url === '/stream') {
          // SSE stream
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
          })
          res.write(`data: ${JSON.stringify(liveState)}\n\n`)
          clients.add(res)
          req.on('close', () => clients.delete(res))
          return
        }

        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => { body += chunk })
          req.on('end', () => {
            try {
              liveState = { ...liveState, ...JSON.parse(body) }
              broadcast()
            } catch {}
            res.writeHead(204)
            res.end()
          })
          return
        }

        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [tailwindcss(), react(), ssePlugin()],
  server: { port: 5173, host: '0.0.0.0' },
})
