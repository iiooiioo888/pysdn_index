import { lazy, Suspense } from 'react'
import { Navbar } from '../components/Navbar'
import { useCanvasBackground } from '../hooks/useCanvasBackground'

const ModelsSection = lazy(() =>
  import('../components/ModelsSection').then((m) => ({ default: m.ModelsSection })),
)
const Footer = lazy(() => import('../components/Footer').then((m) => ({ default: m.Footer })))

/** 骨架屏佔位（同步組件，不走 lazy） */
function ModelsSkeletonFallback() {
  return (
    <section className="section models-section">
      <div className="container models-container">
        <div className="models-skeleton-grid" aria-label="Loading models…">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="models-skeleton-card">
              <div className="models-skeleton-thumb" />
              <div className="models-skeleton-body">
                <div className="models-skeleton-line models-skeleton-line--title" />
                <div className="models-skeleton-line models-skeleton-line--desc" />
                <div className="models-skeleton-line models-skeleton-line--desc2" />
                <div className="models-skeleton-line models-skeleton-line--price" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ModelsPage() {
  const canvasRef = useCanvasBackground()

  return (
    <>
      <canvas ref={canvasRef} id="bgCanvas" aria-hidden="true" />

      <div className="site-shell">
        <Navbar />
        <main className="models-page-main">
          <Suspense fallback={<ModelsSkeletonFallback />}>
            <ModelsSection />
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </>
  )
}
