import { lazy, Suspense } from 'react'
import { Navbar } from '../components/Navbar'
import { useCanvasBackground } from '../hooks/useCanvasBackground'

const ModelsSection = lazy(() =>
  import('../components/ModelsSection').then((m) => ({ default: m.ModelsSection })),
)
const Footer = lazy(() => import('../components/Footer').then((m) => ({ default: m.Footer })))

export function ModelsPage() {
  const canvasRef = useCanvasBackground()

  return (
    <>
      <canvas ref={canvasRef} id="bgCanvas" aria-hidden="true" />

      <div className="site-shell">
        <Navbar />
        <main className="models-page-main">
          <Suspense fallback={null}>
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
