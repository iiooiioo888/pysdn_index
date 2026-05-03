import compression from 'compression'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const PUBLIC_BASE = '/pysdn_index/'
const PUBLIC_BASE_NO_SLASH = PUBLIC_BASE.replace(/\/$/, '')

/**
 * Dev-only：將 `/` 與 `/pysdn_index` **改寫**為 `base` 路徑（不發 302），避免 Lighthouse
 * 「第一個要求有重新導向」與額外延遲；實際部署若走 GitHub Pages，仍建議直接打帶 base 的網址。
 */
function devRewriteRootToBase(): Plugin {
  return {
    name: 'dev-rewrite-root-to-base',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const raw = req.url ?? '/'
        let pathname = raw
        const q = raw.indexOf('?')
        if (q !== -1) pathname = raw.slice(0, q)
        const search = q !== -1 ? raw.slice(q) : ''

        if (pathname === '/' || pathname === '') {
          req.url = `${PUBLIC_BASE}${search}`
          next()
          return
        }
        if (pathname === PUBLIC_BASE_NO_SLASH) {
          req.url = `${PUBLIC_BASE}${search}`
          next()
          return
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [
    {
      name: 'dev-preview-compression',
      configureServer(server) {
        server.middlewares.use(compression({ threshold: 1024 }))
      },
      configurePreviewServer(server) {
        server.middlewares.use(compression({ threshold: 1024 }))
      },
    },
    devRewriteRootToBase(),
    react(),
  ],
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
    target: 'es2022',
    outDir: 'dist',
    /** 產物含 map 供 Sentry 等上傳，但不寫入 bundle 註解連結，避免對外暴露路徑 */
    sourcemap: 'hidden',
    cssMinify: true,
    cssCodeSplit: true,
    /** 使用 esbuild 壓縮（預設），比 terser 更快 */
    minify: 'esbuild',
    rollupOptions: {
      output: {
        /**
         * Chunk 分割策略（Vite 8 + Rolldown）：
         * - vendor / router / i18n / http / purify: 框架核心，長期穩定可快取
         * - Mermaid 及其子依賴（cytoscape、katex）由 Rolldown 自動按動態 import 邊界分割
         * - 大型 JSON 數據隨對應頁面 lazy chunk 一起載入
         */
        manualChunks(id) {
          if (id.includes('node_modules/react-dom/')) return 'vendor'
          if (id.includes('node_modules/react/')) return 'vendor'
          if (id.includes('node_modules/react-router')) return 'router'
          if (id.includes('node_modules/react-i18next/') || id.includes('node_modules/i18next/')) return 'i18n'
          if (id.includes('node_modules/axios')) return 'http'
          if (id.includes('node_modules/dompurify')) return 'purify'
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
})
