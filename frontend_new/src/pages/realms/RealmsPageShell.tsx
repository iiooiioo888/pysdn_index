import { lazy, Suspense, type ReactNode } from 'react'
import { Navbar } from '../../components/Navbar'
import { useCanvasBackground } from '../../hooks/useCanvasBackground'

const Footer = lazy(() => import('../../components/Footer').then((m) => ({ default: m.Footer })))

export function RealmsPageShell({ children }: { children: ReactNode }) {
  const canvasRef = useCanvasBackground()

  return (
    <>
      <canvas ref={canvasRef} id="bgCanvas" aria-hidden="true" />
      <div className="site-shell">
        <Navbar />
        {children}
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </>
  )
}
