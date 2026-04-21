import { lazy, Suspense, useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { useCanvasBackground } from '../hooks/useCanvasBackground'
import { useReveal } from '../hooks/useAnimations'

const FaqSection = lazy(() => import('../components/FaqSection').then((m) => ({ default: m.FaqSection })))
const Footer = lazy(() => import('../components/Footer').then((m) => ({ default: m.Footer })))

export function FaqPage() {
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
        <main className="faq-page-main">
          <Suspense fallback={null}>
            <FaqSection />
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </>
  )
}
