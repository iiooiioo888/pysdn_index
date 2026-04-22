import { lazy } from 'react'
import { HomeLazySection } from '../components/HomeLazySection'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { useCanvasBackground } from '../hooks/useCanvasBackground'
import { useHomeHashScroll } from '../hooks/useHomeHashScroll'

const About = lazy(() => import('../components/About').then((m) => ({ default: m.About })))
const Products = lazy(() => import('../components/Products').then((m) => ({ default: m.Products })))
const ModulesPanel = lazy(() => import('../components/ModulesPanel').then((m) => ({ default: m.ModulesPanel })))
const Showcase = lazy(() => import('../components/Showcase').then((m) => ({ default: m.Showcase })))
const WorkflowSection = lazy(() =>
  import('../components/WorkflowSection').then((m) => ({ default: m.WorkflowSection })),
)
const Contact = lazy(() => import('../components/Contact').then((m) => ({ default: m.Contact })))
const Footer = lazy(() => import('../components/Footer').then((m) => ({ default: m.Footer })))

export function HomePage() {
  const canvasRef = useCanvasBackground()
  useHomeHashScroll()

  return (
    <>
      <div className="home-sf" aria-hidden="true">
        <canvas ref={canvasRef} id="bgCanvas" className="home-sf__cv" aria-hidden="true" />
        <div className="home-sf__hud" />
        <div className="home-sf__corner home-sf__corner--tl" />
        <div className="home-sf__corner home-sf__corner--tr" />
        <div className="home-sf__chroma" />
        <div className="home-sf__scan" />
        <div className="home-sf__hex" />
        <div className="home-sf__mesh" />
        <div className="home-sf__noise" />
        <div className="home-sf__sheen" />
        <div className="home-sf__orbit" />
        <div className="home-sf__scan2" />
        <div className="home-sf__ticker" />
        <div className="home-sf__flick" />
        <div className="home-sf__vignette" />
      </div>

      <div className="site-shell">
        <Navbar />
        <main className="home-main home-main--sf">
          <Hero />
          <HomeLazySection minHeight={220}>
            <About />
          </HomeLazySection>
          <HomeLazySection minHeight={320}>
            <Products />
          </HomeLazySection>
          <HomeLazySection minHeight={360}>
            <ModulesPanel />
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
        <HomeLazySection minHeight={120}>
          <Footer />
        </HomeLazySection>
      </div>
    </>
  )
}
