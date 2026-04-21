import type { ReactNode } from 'react'
import { useCanvasBackground } from '../../hooks/useCanvasBackground'
import '../../styles/doc-page.css'

export type DocVariant = 'forge' | 'script' | 'track' | 'tune'

export function DocLayout({ variant, children }: { variant: DocVariant; children: ReactNode }) {
  const canvasRef = useCanvasBackground()
  const mod = variant === 'forge' ? 'forge' : variant === 'script' ? 'script' : variant === 'tune' ? 'tune' : 'track'

  return (
    <div className={`doc-page doc-page--${mod}`}>
      <canvas ref={canvasRef} id="bgCanvas" className="doc-canvas" aria-hidden="true" />
      <div className="doc-shell">{children}</div>
    </div>
  )
}
