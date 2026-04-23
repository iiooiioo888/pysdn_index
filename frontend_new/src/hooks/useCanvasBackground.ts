import { useEffect, useRef, useCallback, useState } from 'react'
import { CANVAS_VISUAL } from '../lib/canvasVisualConfig'

type StarSpec = { x: number; y: number; dim: number; big?: boolean; tint?: 0 | 1 | 2 }

/**
 * 全站背景：僅靜態漸層底色 + 靜態星點（無 rAF、無捲動／滑鼠特效）。
 */
export function useCanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const starsRef = useRef<StarSpec[]>([])
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const init = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const CONTENT_SCALE = CANVAS_VISUAL.contentScale
    const cv = CANVAS_VISUAL

    const buildStars = (w: number, h: number) => {
      const area = w * h
      const nDistant = Math.max(
        isMobile ? cv.stars.distantMinMobile : cv.stars.distantMinDesktop,
        Math.min(
          Math.floor(area / (isMobile ? cv.stars.areaDivMobile : cv.stars.areaDivDesktop)),
          isMobile ? cv.stars.distantCapMobile : cv.stars.distantCapDesktop,
        ),
      )
      const nBright = isMobile ? cv.stars.brightMobile : cv.stars.brightDesktop
      const list: StarSpec[] = []
      for (let i = 0; i < nDistant; i++) {
        const r = Math.random()
        const tint: 0 | 1 | 2 = r > 0.88 ? 1 : r > 0.94 ? 2 : 0
        list.push({
          x: Math.random() * w,
          y: Math.random() * h,
          dim: 0.2 + Math.random() * 0.78,
          tint,
        })
      }
      for (let i = 0; i < nBright; i++) {
        list.push({
          x: Math.random() * w,
          y: Math.random() * h,
          dim: 0.5 + Math.random() * 0.5,
          big: true,
          tint: (i % 3) as 0 | 1 | 2,
        })
      }
      starsRef.current = list
    }

    const starTint = (tint: 0 | 1 | 2 | undefined, tw: number): { r: number; g: number; b: number } => {
      if (tint === 1) return { r: 160 + tw * 60, g: 240, b: 255 }
      if (tint === 2) return { r: 255, g: 180 + tw * 40, b: 255 }
      return { r: 220 + tw * 30, g: 235, b: 255 }
    }

    const drawDeepSpaceStatic = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const g = ctx.createLinearGradient(0, 0, w, h)
      g.addColorStop(0, 'rgb(4, 2, 22)')
      g.addColorStop(0.3, 'rgb(18, 4, 32)')
      g.addColorStop(0.55, 'rgb(4, 12, 36)')
      g.addColorStop(1, 'rgb(0, 2, 14)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      const wash = ctx.createRadialGradient(w * 0.45, h * 0.35, 0, w * 0.5, h * 0.4, h * 0.95)
      wash.addColorStop(0, 'rgba(80, 40, 120, 0.06)')
      wash.addColorStop(0.4, 'rgba(20, 60, 100, 0.03)')
      wash.addColorStop(1, 'transparent')
      ctx.fillStyle = wash
      ctx.fillRect(0, 0, w, h)
    }

    const drawStarFieldStatic = (ctx: CanvasRenderingContext2D) => {
      for (const st of starsRef.current) {
        const tw = st.dim * 0.72
        const c = starTint(st.tint, tw)
        if (st.big) {
          const br = 1.1 + tw * 0.55
          ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${0.45 + tw * 0.5})`
          ctx.shadowColor =
            st.tint === 1 ? 'rgba(0, 255, 255, 0.6)' : st.tint === 2 ? 'rgba(255, 0, 255, 0.45)' : 'rgba(200, 230, 255, 0.4)'
          ctx.shadowBlur = 6
          ctx.beginPath()
          ctx.arc(st.x, st.y, br, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
          ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${0.15 + 0.2 * tw})`
          ctx.lineWidth = 0.45
          ctx.beginPath()
          ctx.moveTo(st.x - 6, st.y)
          ctx.lineTo(st.x + 6, st.y)
          ctx.moveTo(st.x, st.y - 6)
          ctx.lineTo(st.x, st.y + 6)
          ctx.moveTo(st.x - 4.2, st.y - 4.2)
          ctx.lineTo(st.x + 4.2, st.y + 4.2)
          ctx.moveTo(st.x - 4.2, st.y + 4.2)
          ctx.lineTo(st.x + 4.2, st.y - 4.2)
          ctx.stroke()
        } else {
          ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${0.25 + tw * 0.65})`
          const sz = 0.7 + (st.dim % 0.25)
          ctx.fillRect(st.x, st.y, sz, sz)
        }
      }
    }

    const paint = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const cssW = window.innerWidth
      const cssH = window.innerHeight
      const w = cssW / CONTENT_SCALE
      const h = cssH / CONTENT_SCALE
      canvas.style.width = `${cssW}px`
      canvas.style.height = `${cssH}px`
      canvas.width = Math.round(cssW * dpr)
      canvas.height = Math.round(cssH * dpr)
      ctx.setTransform(dpr * CONTENT_SCALE, 0, 0, dpr * CONTENT_SCALE, 0, 0)
      buildStars(w, h)
      ctx.clearRect(0, 0, w, h)
      drawDeepSpaceStatic(ctx, w, h)
      drawStarFieldStatic(ctx)
    }

    paint()
    window.addEventListener('resize', paint)
    return () => {
      window.removeEventListener('resize', paint)
    }
  }, [isMobile])

  useEffect(() => {
    return init()
  }, [init])

  return canvasRef
}
