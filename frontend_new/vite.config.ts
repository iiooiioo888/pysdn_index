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
         * 分 chunk 策略：
         * - vendor: React 核心（長期穩定，瀏覽器快取命中率高）
         * - router: react-router-dom（獨立更新）
         * - i18n: 國際化（僅翻譯切換時需要）
         * - mermaid: 僅文件頁 DocMermaid 用，延遲載入
         * - http: axios（僅 API 呼叫時需要）
         * - data-*: 大型 JSON 數據（openRouter 402KB、bedrock 103KB）
         */
        manualChunks(id) {
          if (id.includes('node_modules/react-dom/')) return 'vendor'
          if (id.includes('node_modules/react/')) return 'vendor'
          if (id.includes('node_modules/react-router')) {
            return 'router'
          }
          if (id.includes('node_modules/react-i18next/') || id.includes('node_modules/i18next/')) {
            return 'i18n'
          }
          /* 僅 `DocMermaid` 內 `import('mermaid')` 會觸發；獨立 chunk 利於快取 */
          if (id.includes('node_modules/mermaid')) {
            return 'mermaid'
          }
          if (id.includes('node_modules/axios')) {
            return 'http'
          }
          /* 大型數據 JSON 拆為獨立 chunk（Hero 不再拉入，僅 ModelsSection 延遲載入） */
          if (id.includes('openRouterModelsSnapshot.json') || id.includes('bedrockCatalog.json')) {
            return 'data-models'
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
