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

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'
const router = createAppRouter(basename)

void initI18n().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </StrictMode>,
  )
})
