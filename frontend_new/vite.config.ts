import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const PUBLIC_BASE = '/pysdn_index/'
const PUBLIC_BASE_NO_SLASH = PUBLIC_BASE.replace(/\/$/, '')

/** Dev-only: redirect `/` and bare `/pysdn_index` to the app root under `base`. */
function devRedirectRootToBase(): Plugin {
  return {
    name: 'dev-redirect-root-to-base',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const raw = req.url ?? '/'
        let pathname = raw
        const q = raw.indexOf('?')
        if (q !== -1) pathname = raw.slice(0, q)
        const search = q !== -1 ? raw.slice(q) : ''

        if (pathname === '/' || pathname === '') {
          const path = PUBLIC_BASE.endsWith('/') ? PUBLIC_BASE : `${PUBLIC_BASE}/`
          res.writeHead(302, { Location: `${path}${search}` })
          res.end()
          return
        }
        if (pathname === PUBLIC_BASE_NO_SLASH) {
          res.writeHead(302, { Location: `${PUBLIC_BASE}${search}` })
          res.end()
          return
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [devRedirectRootToBase(), react()],
  base: PUBLIC_BASE,
  server: {
    port: 3000,
    host: true,
    /* With non-root `base`, string `open` is resolved under `base` → duplicate path. Use `true` only. */
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    cssMinify: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor'
          }
          if (id.includes('node_modules/react-i18next/') || id.includes('node_modules/i18next/')) {
            return 'i18n'
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
