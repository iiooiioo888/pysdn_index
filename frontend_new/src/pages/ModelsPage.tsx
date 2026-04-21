import { lazy, Suspense, useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { useCanvasBackground } from '../hooks/useCanvasBackground'
import { useReveal } from '../hooks/useAnimations'

const ModelsSection = lazy(() =>
  import('../components/ModelsSection').then((m) => ({ default: m.ModelsSection })),
)
const Footer = lazy(() => import('../components/Footer').then((m) => ({ default: m.Footer })))

export function ModelsPage() {
  const canvasRef = useCanvasBackground()
  const observe = useReveal()

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
        observe(el)
      })
    }, 100)
    return () => clearTimeout(timer)
  }, [observe])

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
