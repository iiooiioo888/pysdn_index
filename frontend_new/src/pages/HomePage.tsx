import { lazy, Suspense, useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { useCanvasBackground } from '../hooks/useCanvasBackground'
import { useReveal } from '../hooks/useAnimations'

const About = lazy(() => import('../components/About').then((m) => ({ default: m.About })))
const Products = lazy(() => import('../components/Products').then((m) => ({ default: m.Products })))
const ModulesPanel = lazy(() => import('../components/ModulesPanel').then((m) => ({ default: m.ModulesPanel })))
const Showcase = lazy(() => import('../components/Showcase').then((m) => ({ default: m.Showcase })))
const WorkflowSection = lazy(() =>
  import('../components/WorkflowSection').then((m) => ({ default: m.WorkflowSection }))
)
const Contact = lazy(() => import('../components/Contact').then((m) => ({ default: m.Contact })))
const Footer = lazy(() => import('../components/Footer').then((m) => ({ default: m.Footer })))

export function HomePage() {
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
        <main>
          <Hero />
          <Suspense fallback={null}>
            <About />
            <Products />
            <ModulesPanel />
            <Showcase />
            <WorkflowSection />
            <Contact />
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </>
  )
}
