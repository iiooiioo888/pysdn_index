/**
 * 入口：主站 `initI18n` → `src/locales`；文件頁 `useDocBundle` → `src/locales/doc`（i18next 命名空間 `doc_*`）。
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import './index.css'
import { initI18n } from './lib/i18n.ts'
import { createAppRouter } from './routes/appRouter'

/**
 * Vite `base` 為 `/pysdn_index/` 時，若瀏覽器位址列是 `http://host:port/`（pathname 為 `/`），
 * React Router 的 basename 與實際 pathname 不一致會**沒有任何路由匹配** → 畫面空白。
 * 在建立 router 前把 pathname 對齊到 base（不重載頁面）。
 */
function syncPathnameWithViteBase(): void {
  if (typeof window === 'undefined') return
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/'
  if (base === '/') return

  const { pathname, search, hash } = window.location
  if (pathname === '/' || pathname === '') {
    window.history.replaceState(null, '', `${base}/${search}${hash}`)
    return
  }
  if (pathname === base) {
    window.history.replaceState(null, '', `${base}/${search}${hash}`)
  }
}

syncPathnameWithViteBase()

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'
const router = createAppRouter(basename)

const rootEl = document.getElementById('root')
if (!rootEl) {
  console.error('[pysdn] 找不到 #root，無法掛載 React')
} else {
  // 先掛載 React，讓 app shell（導航、骨架）立即可見；i18n 翻譯在背景載入。
  createRoot(rootEl).render(
    <StrictMode>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </StrictMode>,
  )
  // i18n 初始化不阻塞掛載；翻譯到位後 react-i18next 會自動 re-render。
  void initI18n().catch((err) => {
    console.error('[pysdn] initI18n 失敗', err)
  })
}
