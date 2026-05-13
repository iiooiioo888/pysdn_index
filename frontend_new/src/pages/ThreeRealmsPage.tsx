import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/Navbar'
import { ThreeRealmsInteractive } from '../components/ThreeRealmsInteractive'
import { useCanvasBackground } from '../hooks/useCanvasBackground'

const Footer = lazy(() => import('../components/Footer').then((m) => ({ default: m.Footer })))

export function ThreeRealmsPage() {
  const canvasRef = useCanvasBackground()
  const { t } = useTranslation()

  return (
    <>
      <canvas ref={canvasRef} id="bgCanvas" aria-hidden="true" />

      <div className="site-shell">
        <Navbar />
        <main className="realms-page-main" id="realms-page">
          <div className="container realms-page-hero">
            <p className="section-label">{t('realms_label')}</p>
            <h1 className="realms-page-title">{t('realms_page_title')}</h1>
            <p className="realms-page-lead">{t('realms_page_lead')}</p>
            <p className="realms-page-flow">{t('realms_flow')}</p>
          </div>
          <div className="container">
            <ThreeRealmsInteractive layout="standalone" />
          </div>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </>
  )
}
