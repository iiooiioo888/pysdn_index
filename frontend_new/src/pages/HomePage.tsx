import { lazy, Suspense } from 'react'
import { HomeLazySection } from '../components/HomeLazySection'
import { PageShell } from '../components/PageShell'
import { useCanvasBackground } from '../hooks/useCanvasBackground'
import { useHomeHashScroll } from '../hooks/useHomeHashScroll'

const Hero = lazy(() => import('../components/Hero').then((m) => ({ default: m.Hero })))
const About = lazy(() => import('../components/About').then((m) => ({ default: m.About })))
const ThreeRealmsSection = lazy(() =>
  import('../components/ThreeRealmsSection').then((m) => ({ default: m.ThreeRealmsSection })),
)
const Products = lazy(() => import('../components/Products').then((m) => ({ default: m.Products })))
const ModulesPanel = lazy(() => import('../components/ModulesPanel').then((m) => ({ default: m.ModulesPanel })))
const HardwarePlanSection = lazy(() => import('../components/HardwarePlanSection').then((m) => ({ default: m.HardwarePlanSection })))
const Showcase = lazy(() => import('../components/Showcase').then((m) => ({ default: m.Showcase })))
const WorkflowSection = lazy(() =>
  import('../components/WorkflowSection').then((m) => ({ default: m.WorkflowSection })),
)
const Contact = lazy(() => import('../components/Contact').then((m) => ({ default: m.Contact })))

export function HomePage() {
  const canvasRef = useCanvasBackground()
  useHomeHashScroll()

  return (
    <>
      <div className="home-sf" aria-hidden="true">
        <canvas ref={canvasRef} id="bgCanvas" className="home-sf__cv" aria-hidden="true" />
      </div>

      <PageShell>
        <main className="home-main home-main--sf">
          <Suspense fallback={<section className="hero" aria-busy="true" />}>
            <Hero />
          </Suspense>
          <HomeLazySection minHeight={220}>
            <About />
          </HomeLazySection>
          <HomeLazySection minHeight={300}>
            <ThreeRealmsSection />
          </HomeLazySection>
          <HomeLazySection minHeight={320}>
            <Products />
          </HomeLazySection>
          <HomeLazySection minHeight={360}>
            <ModulesPanel />
          </HomeLazySection>
          <HomeLazySection minHeight={400}>
            <HardwarePlanSection />
          </HomeLazySection>
          <HomeLazySection minHeight={280}>
            <Showcase />
          </HomeLazySection>
          <HomeLazySection minHeight={300}>
            <WorkflowSection />
          </HomeLazySection>
          <HomeLazySection minHeight={240}>
            <Contact />
          </HomeLazySection>
        </main>
      </PageShell>
    </>
  )
}
