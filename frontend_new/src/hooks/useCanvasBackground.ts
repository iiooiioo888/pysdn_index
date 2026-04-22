import { useEffect, useRef, useCallback } from 'react'
import { prefersReducedMotion } from '../lib/motionPreference'

type StarSpec = { x: number; y: number; p: number; sp: number; dim: number; big?: boolean; tint?: 0 | 1 | 2 }
type MeteorSpec = { x: number; y: number; vx: number; vy: number; life: number; max: number; w: number; hue: number }
type Dust = { x: number; y: number; vx: number; vy: number; r: number; a: number; ph: number; tint: number }
type OrbitalSpec = { cx: number; cy: number; a: number; b: number; rot: number; phase: number; hue: number }
type DebrisSpec = { x: number; y: number; vx: number; vy: number; rot: number; vr: number; k: 0 | 1 | 2 }

export function useCanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animRef = useRef(0)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const starsRef = useRef<StarSpec[]>([])
  const meteorsRef = useRef<MeteorSpec[]>([])
  const dustRef = useRef<Dust[]>([])
  const constelPairsRef = useRef<[number, number][]>([])
  const orbitalsRef = useRef<OrbitalSpec[]>([])
  const debrisRef = useRef<DebrisSpec[]>([])
  const frameRef = useRef(0)
  const meteorNextRef = useRef(0)
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

  const init = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    /** 與 `index.css` 的 `--app-scale` 同步（+20% 時兩邊一併改） */
    const CONTENT_SCALE = 1.2

    const buildStars = (w: number, h: number) => {
      const area = w * h
      // 以畫面積推算星點量（風格接近靜態頁 doc-bg 的密度思維）：桌面每 ~900–950px² 一顆、手機略疏但仍要「滿天」
      const nDistant = Math.max(
        isMobile ? 520 : 1400,
        Math.min(
          Math.floor(area / (isMobile ? 3800 : 920)),
          isMobile ? 2400 : 5800,
        ),
      )
      const nBright = isMobile ? 40 : 110
      const list: StarSpec[] = []
      for (let i = 0; i < nDistant; i++) {
        const r = Math.random()
        const tint: 0 | 1 | 2 = r > 0.88 ? 1 : r > 0.94 ? 2 : 0
        list.push({
          x: Math.random() * w,
          y: Math.random() * h,
          p: Math.random() * Math.PI * 2,
          sp: 0.014 + Math.random() * 0.045,
          dim: 0.2 + Math.random() * 0.78,
          tint,
        })
      }
      for (let i = 0; i < nBright; i++) {
        list.push({
          x: Math.random() * w,
          y: Math.random() * h,
          p: Math.random() * Math.PI * 2,
          sp: 0.022 + Math.random() * 0.04,
          dim: 0.5 + Math.random() * 0.5,
          big: true,
          tint: (i % 3) as 0 | 1 | 2,
        })
      }
      starsRef.current = list
      const bigIdx: number[] = []
      list.forEach((s, i) => {
        if (s.big) bigIdx.push(i)
      })
      const nConnect = Math.min(12, bigIdx.length)
      const pairs: [number, number][] = []
      for (let i = 0; i < nConnect; i++) {
        pairs.push([bigIdx[i]!, bigIdx[(i + 1) % nConnect]!])
      }
      constelPairsRef.current = pairs
    }

    const buildOrbitals = (w: number, h: number) => {
      orbitalsRef.current = [
        { cx: w * 0.18, cy: h * 0.28, a: w * 0.11, b: h * 0.05, rot: 0.35, phase: 0, hue: 195 },
        { cx: w * 0.55, cy: h * 0.38, a: w * 0.16, b: h * 0.06, rot: -0.4, phase: 0.7, hue: 205 },
        { cx: w * 0.82, cy: h * 0.62, a: w * 0.13, b: h * 0.04, rot: 0.2, phase: 1.1, hue: 188 },
        { cx: w * 0.35, cy: h * 0.65, a: w * 0.2, b: h * 0.08, rot: 0.55, phase: 2, hue: 275 },
        { cx: w * 0.72, cy: h * 0.25, a: w * 0.09, b: h * 0.03, rot: -0.25, phase: 0.3, hue: 190 },
        { cx: w * 0.4, cy: h * 0.18, a: w * 0.14, b: h * 0.035, rot: 0.1, phase: 1.5, hue: 200 },
      ]
    }

    const buildDebris = (w: number, h: number) => {
      const n = isMobile ? 12 : 22
      debrisRef.current = []
      for (let i = 0; i < n; i++) {
        debrisRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.4) * 0.12,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.014,
          k: (i % 3) as 0 | 1 | 2,
        })
      }
    }

    const buildDust = (w: number, h: number) => {
      const n = isMobile ? 70 : 140
      dustRef.current = []
      for (let i = 0; i < n; i++) {
        dustRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: 0.35 + Math.random() * 1.4,
          a: 0.1 + Math.random() * 0.28,
          ph: Math.random() * Math.PI * 2,
          tint: i % 3,
        })
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const cssW = window.innerWidth
      const cssH = window.innerHeight
      const w = cssW / CONTENT_SCALE
      const h = cssH / CONTENT_SCALE
      canvas.style.width = `${cssW}px`
      canvas.style.height = `${cssH}px`
      canvas.style.willChange = 'contents'
      canvas.width = Math.round(cssW * dpr)
      canvas.height = Math.round(cssH * dpr)
      ctx.setTransform(dpr * CONTENT_SCALE, 0, 0, dpr * CONTENT_SCALE, 0, 0)
      buildStars(w, h)
      buildOrbitals(w, h)
      buildDust(w, h)
      buildDebris(w, h)
    }

    const drawDeepSpace = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      const g = ctx.createLinearGradient(0, 0, w, h)
      g.addColorStop(0, 'rgb(4, 2, 22)')
      g.addColorStop(0.3, 'rgb(18, 4, 32)')
      g.addColorStop(0.55, 'rgb(4, 12, 36)')
      g.addColorStop(1, 'rgb(0, 2, 14)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      const a = 0.06 + Math.sin(t * 0.5) * 0.03
      const wash = ctx.createRadialGradient(w * 0.45, h * 0.35, 0, w * 0.5, h * 0.4, h * 0.95)
      wash.addColorStop(0, `rgba(80, 40, 120, ${a})`)
      wash.addColorStop(0.4, `rgba(20, 60, 100, ${a * 0.5})`)
      wash.addColorStop(1, 'transparent')
      ctx.fillStyle = wash
      ctx.fillRect(0, 0, w, h)
    }

    const drawPerspGrid = (ctx: CanvasRenderingContext2D, w: number, h: number, f: number) => {
      const vanY = h * 0.36
      const cx = w * 0.5
      const t = f * 0.006
      ctx.save()
      ctx.globalAlpha = isMobile ? 0.085 : 0.14
      const n = 16
      for (let i = -n; i <= n; i++) {
        const off = (i / n) * 0.92
        const bx = cx + off * w * 0.5
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(34, 211, 238, 0.45)' : 'rgba(167, 139, 250, 0.35)'
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(cx + Math.sin(t + i * 0.2) * 2, vanY)
        ctx.lineTo(bx, h + 2)
        ctx.stroke()
      }
      const step = 20
      const off = (f * 0.42) % step
      for (let y = vanY; y < h; y += step) {
        const yy = y + off
        const spread = (yy - vanY) / (h - vanY)
        const half = Math.min(w * 0.49, 120 + spread * w * 0.46)
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.12 + spread * 0.18})`
        ctx.beginPath()
        ctx.moveTo(cx - half, yy)
        ctx.lineTo(cx + half, yy)
        ctx.stroke()
      }
      ctx.restore()
    }

    const drawScanSweep = (ctx: CanvasRenderingContext2D, w: number, h: number, f: number) => {
      const y = (f * 0.55) % (h + 100) - 50
      const g = ctx.createLinearGradient(0, y - 40, 0, y + 40)
      g.addColorStop(0, 'transparent')
      g.addColorStop(0.45, 'rgba(0, 255, 200, 0.1)')
      g.addColorStop(0.55, 'rgba(100, 200, 255, 0.08)')
      g.addColorStop(1, 'transparent')
      ctx.fillStyle = g
      ctx.fillRect(0, y - 30, w, 60)
      ctx.save()
      ctx.globalAlpha = 0.55
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.45)'
      ctx.lineWidth = 1
      ctx.setLineDash([6, 14])
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()
    }

    const drawScanSweepMagenta = (ctx: CanvasRenderingContext2D, w: number, h: number, f: number) => {
      const y = (f * 0.28 + h * 0.35) % (h + 120) - 60
      const g = ctx.createLinearGradient(0, y - 28, 0, y + 28)
      g.addColorStop(0, 'transparent')
      g.addColorStop(0.5, 'rgba(255, 0, 200, 0.06)')
      g.addColorStop(1, 'transparent')
      ctx.save()
      ctx.globalAlpha = 0.9
      ctx.fillStyle = g
      ctx.fillRect(0, y - 24, w, 48)
      ctx.globalAlpha = 0.35
      ctx.strokeStyle = 'rgba(255, 100, 255, 0.35)'
      ctx.setLineDash([10, 18])
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()
    }

    const drawBlackHole = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      const s = Math.min(w, h)
      const cx = w * 0.78
      const cy = h * 0.2
      const scale = s / 900
      const rEH = 34 * scale
      const rx = 118 * scale
      const ry = 28 * scale
      const rot = -0.36 + Math.sin(t * 0.28) * 0.05

      ctx.save()
      ctx.translate(cx, cy)
      // 外圍能量霧
      const bloom = ctx.createRadialGradient(0, 0, rEH * 1.2, 0, 0, rx * 2.2)
      bloom.addColorStop(0, 'rgba(255, 80, 40, 0.08)')
      bloom.addColorStop(0.4, 'rgba(100, 50, 200, 0.05)')
      bloom.addColorStop(1, 'transparent')
      ctx.beginPath()
      ctx.ellipse(0, 0, rx * 2, ry * 2, rot, 0, Math.PI * 2)
      ctx.fillStyle = bloom
      ctx.fill()
      // 多層偏轉環（虛線、科幻儀表感）
      for (let ring = 0; ring < 4; ring++) {
        const rr = 1.25 + ring * 0.18
        ctx.save()
        ctx.rotate(rot * 0.3 + t * 0.08 * (ring + 1) * (ring % 2 === 0 ? 1 : -1))
        ctx.beginPath()
        ctx.ellipse(0, 0, rx * rr, ry * rr, 0, 0, Math.PI * 2)
        ctx.strokeStyle = `hsla(${190 + ring * 25}, 95%, 65%, ${0.1 - ring * 0.018})`
        ctx.lineWidth = 1.1 * scale
        ctx.setLineDash([4 + ring * 2, 10 + ring * 2])
        ctx.stroke()
        ctx.setLineDash([])
        ctx.restore()
      }
      ctx.rotate(rot)
      const disk = ctx.createLinearGradient(-rx, 0, rx, 0)
      disk.addColorStop(0, 'transparent')
      disk.addColorStop(0.15, 'rgba(50, 200, 255, 0.2)')
      disk.addColorStop(0.4, 'rgba(255, 120, 40, 0.38)')
      disk.addColorStop(0.55, 'rgba(255, 220, 150, 0.42)')
      disk.addColorStop(0.75, 'rgba(255, 60, 120, 0.22)')
      disk.addColorStop(1, 'transparent')
      ctx.beginPath()
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
      ctx.fillStyle = disk
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(0, 0, rx * 0.7, ry * 0.7, 0, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(200, 255, 255, 0.35)'
      ctx.lineWidth = 1.3 * scale
      ctx.stroke()
      // 相對論噴流（淡錐形）
      const jUp = ctx.createLinearGradient(0, -h * 0.22, 0, -rEH)
      jUp.addColorStop(0, 'rgba(120, 220, 255, 0)')
      jUp.addColorStop(1, 'hsla(200, 100%, 75%, 0.18)')
      ctx.fillStyle = jUp
      ctx.beginPath()
      ctx.moveTo(-6 * scale, -rEH)
      ctx.lineTo(6 * scale, -rEH)
      ctx.lineTo(16 * scale, -h * 0.18)
      ctx.lineTo(-16 * scale, -h * 0.18)
      ctx.closePath()
      ctx.fill()
      const jDown = ctx.createLinearGradient(0, rEH, 0, h * 0.12)
      jDown.addColorStop(0, 'hsla(280, 80%, 70%, 0.12)')
      jDown.addColorStop(1, 'rgba(180, 100, 255, 0)')
      ctx.fillStyle = jDown
      ctx.beginPath()
      ctx.moveTo(-5 * scale, rEH)
      ctx.lineTo(5 * scale, rEH)
      ctx.lineTo(12 * scale, h * 0.1)
      ctx.lineTo(-12 * scale, h * 0.1)
      ctx.closePath()
      ctx.fill()
      ctx.beginPath()
      ctx.arc(0, 0, rEH, 0, Math.PI * 2)
      const bh = ctx.createRadialGradient(0, 0, 0, 0, 0, rEH)
      bh.addColorStop(0, '#010108')
      bh.addColorStop(0.7, '#03031a')
      bh.addColorStop(1, '#08081f')
      ctx.fillStyle = bh
      ctx.fill()
      ctx.beginPath()
      ctx.arc(0, 0, rEH * 1.1, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(100, 220, 255, ${0.4 + Math.sin(t * 0.7) * 0.12})`
      ctx.lineWidth = 1.2
      ctx.shadowColor = 'rgba(0, 200, 255, 0.5)'
      ctx.shadowBlur = 12
      ctx.stroke()
      ctx.shadowBlur = 0
      ctx.beginPath()
      ctx.arc(0, 0, rEH * 1.55, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(200, 150, 255, ${0.16 + Math.sin(t * 0.4) * 0.08})`
      ctx.lineWidth = 1.2
      ctx.globalAlpha = 0.5
      ctx.stroke()
      ctx.globalAlpha = 1
      ctx.restore()
    }

    const starTint = (tint: 0 | 1 | 2 | undefined, tw: number): { r: number; g: number; b: number } => {
      if (tint === 1) return { r: 160 + tw * 60, g: 240, b: 255 }
      if (tint === 2) return { r: 255, g: 180 + tw * 40, b: 255 }
      return { r: 220 + tw * 30, g: 235, b: 255 }
    }

    const drawStarField = (ctx: CanvasRenderingContext2D) => {
      for (const st of starsRef.current) {
        st.p += st.sp
        const tw = st.dim * (0.5 + Math.sin(st.p) * 0.5)
        const c = starTint(st.tint, tw)
        if (st.big) {
          const br = 1.1 + tw * 0.55
          ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${0.45 + tw * 0.5})`
          ctx.shadowColor = st.tint === 1 ? 'rgba(0, 255, 255, 0.6)' : st.tint === 2 ? 'rgba(255, 0, 255, 0.45)' : 'rgba(200, 230, 255, 0.4)'
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

    const spawnMeteor = (w: number, h: number) => {
      const side = Math.floor(Math.random() * 3)
      let x = 0
      let y = 0
      const speed = 9 + Math.random() * 11
      let vx = 0
      let vy = 0
      if (side === 0) {
        x = Math.random() * w
        y = -20
        vx = (Math.random() - 0.3) * 2.6
        vy = speed
      } else if (side === 1) {
        x = -20
        y = Math.random() * h * 0.72
        vx = speed
        vy = 3.5 + Math.random() * 3.5
      } else {
        x = w + 20
        y = Math.random() * h * 0.55
        vx = -speed * 0.85
        vy = 2.5 + Math.random() * 4.5
      }
      const hue = Math.random() > 0.5 ? 185 + Math.random() * 20 : 290 + Math.random() * 30
      meteorsRef.current.push({ x, y, vx, vy, life: 38, max: 38, w: 1.3 + Math.random() * 1, hue })
    }

    const drawMeteors = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      for (let i = meteorsRef.current.length - 1; i >= 0; i--) {
        const m = meteorsRef.current[i]!
        m.x += m.vx
        m.y += m.vy
        m.life--
        if (m.life <= 0 || m.x < -200 || m.x > w + 200 || m.y < -200 || m.y > h + 200) {
          meteorsRef.current.splice(i, 1)
          continue
        }
        const a = m.life / m.max
        const len = 48 + 55 * a
        const ang = Math.atan2(m.vy, m.vx)
        const x2 = m.x - Math.cos(ang) * len
        const y2 = m.y - Math.sin(ang) * len
        const g = ctx.createLinearGradient(x2, y2, m.x, m.y)
        g.addColorStop(0, 'rgba(0, 0, 0, 0)')
        g.addColorStop(0.35, `hsla(${(m.hue + 40) % 360}, 100%, 70%, 0.2)`)
        g.addColorStop(0.65, `hsla(${m.hue}, 100%, 75%, 0.55)`)
        g.addColorStop(0.95, 'rgba(255, 255, 255, 0.95)')
        g.addColorStop(1, 'rgba(200, 255, 255, 0.4)')
        ctx.beginPath()
        ctx.moveTo(m.x, m.y)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = g
        ctx.lineWidth = m.w * a
        ctx.lineCap = 'round'
        ctx.globalAlpha = 0.5 + 0.45 * a
        ctx.shadowColor = `hsla(${m.hue}, 100%, 70%, 0.6)`
        ctx.shadowBlur = 12
        ctx.stroke()
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
        ctx.beginPath()
        ctx.arc(m.x, m.y, 1.4, 0, Math.PI * 2)
        ctx.fillStyle = '#e0ffff'
        ctx.fill()
      }
    }

    const drawDust = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      for (const d of dustRef.current) {
        d.x += d.vx
        d.y += d.vy
        d.ph += 0.035
        if (d.x < 0) d.x = w
        if (d.x > w) d.x = 0
        if (d.y < 0) d.y = h
        if (d.y > h) d.y = 0
        const g = 0.55 + Math.sin(d.ph) * 0.4
        const hue = d.tint === 0 ? 195 : d.tint === 1 ? 280 : 320
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r * (0.75 + 0.25 * g), 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${hue}, 90%, 75%, ${d.a * g})`
        ctx.fill()
      }
    }

    const drawFilamentWisps = (ctx: CanvasRenderingContext2D, w: number, h: number, f: number) => {
      const t = f * 0.0011
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      ctx.globalAlpha = 0.14
      const paths: Array<{
        x0: number
        y0: number
        c1x: number
        c1y: number
        c2x: number
        c2y: number
        x1: number
        y1: number
        hue: number
      }> = [
        {
          x0: w * 0.1,
          y0: h * 0.35,
          c1x: w * 0.35,
          c1y: h * 0.2,
          c2x: w * 0.55,
          c2y: h * 0.45,
          x1: w * 0.75,
          y1: h * 0.3,
          hue: 198,
        },
        {
          x0: w * 0.88,
          y0: h * 0.52,
          c1x: w * 0.58,
          c1y: h * 0.72,
          c2x: w * 0.38,
          c2y: h * 0.48,
          x1: w * 0.12,
          y1: h * 0.64,
          hue: 275,
        },
        {
          x0: w * 0.52,
          y0: h * 0.08,
          c1x: w * 0.68,
          c1y: h * 0.24,
          c2x: w * 0.44,
          c2y: h * 0.42,
          x1: w * 0.28,
          y1: h * 0.55,
          hue: 185,
        },
        {
          x0: w * 0.02,
          y0: h * 0.18,
          c1x: w * 0.22,
          c1y: h * 0.12,
          c2x: w * 0.38,
          c2y: h * 0.28,
          x1: w * 0.5,
          y1: h * 0.22,
          hue: 210,
        },
      ]
      for (const p of paths) {
        const g = ctx.createLinearGradient(p.x0, p.y0, p.x1, p.y1)
        g.addColorStop(0, 'transparent')
        g.addColorStop(0.45, `hsla(${p.hue + Math.sin(t * 1.1) * 8}, 85%, 52%, 0.32)`)
        g.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.moveTo(p.x0, p.y0)
        ctx.bezierCurveTo(
          p.c1x + Math.sin(t * 0.4) * 9,
          p.c1y,
          p.c2x,
          p.c2y + Math.cos(t * 0.32) * 7,
          p.x1,
          p.y1,
        )
        ctx.strokeStyle = g
        ctx.lineWidth = 1.15
        ctx.stroke()
      }
      ctx.restore()
    }

    const drawOrbitals = (ctx: CanvasRenderingContext2D, f: number) => {
      const t = f * 0.0021
      ctx.save()
      for (const o of orbitalsRef.current) {
        ctx.save()
        ctx.globalAlpha = 0.2
        ctx.translate(o.cx, o.cy)
        ctx.rotate(o.rot + t * 0.38 + o.phase * 0.08)
        ctx.beginPath()
        ctx.ellipse(0, 0, o.a, o.b, 0, 0, Math.PI * 2)
        ctx.strokeStyle = `hsla(${o.hue}, 78%, 58%, 0.42)`
        ctx.lineWidth = 0.6
        ctx.setLineDash([3, 9])
        ctx.stroke()
        ctx.globalAlpha = 0.1
        ctx.beginPath()
        ctx.ellipse(0, 0, o.a * 0.73, o.b * 0.73, 0, 0, Math.PI * 2)
        ctx.setLineDash([1, 4])
        ctx.stroke()
        ctx.setLineDash([])
        ctx.restore()
      }
      ctx.restore()
    }

    const drawConstellation = (ctx: CanvasRenderingContext2D, f: number) => {
      const pairs = constelPairsRef.current
      const list = starsRef.current
      if (pairs.length === 0) return
      const pulse = 0.1 + Math.sin(f * 0.0085) * 0.04
      ctx.save()
      ctx.globalAlpha = pulse
      ctx.strokeStyle = 'rgba(120, 220, 255, 0.32)'
      ctx.lineWidth = 0.42
      ctx.setLineDash([2, 7])
      for (const [ia, ib] of pairs) {
        const a = list[ia]
        const b = list[ib]
        if (!a || !b) continue
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
      ctx.setLineDash([])
      ctx.globalAlpha = 0.04 + pulse * 0.1
      ctx.strokeStyle = 'rgba(200, 180, 255, 0.2)'
      for (const [ia, ib] of pairs) {
        const a = list[ia]
        const b = list[ib]
        if (!a || !b) continue
        const mx = (a.x + b.x) * 0.5
        const my = (a.y + b.y) * 0.5
        const dx = b.x - a.x
        const dy = b.y - a.y
        const d = Math.hypot(dx, dy) || 1
        const ox = (-dy / d) * 4.5
        const oy = (dx / d) * 4.5
        ctx.beginPath()
        ctx.moveTo(mx - ox, my - oy)
        ctx.lineTo(mx + ox, my + oy)
        ctx.stroke()
      }
      ctx.restore()
    }

    const drawTechDebris = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      for (const d of debrisRef.current) {
        d.x += d.vx
        d.y += d.vy
        d.rot += d.vr
        if (d.x < -24) d.x = w + 24
        if (d.x > w + 24) d.x = -24
        if (d.y < -24) d.y = h + 24
        if (d.y > h + 24) d.y = -24
        ctx.save()
        ctx.globalAlpha = 0.2
        ctx.translate(d.x, d.y)
        ctx.rotate(d.rot)
        ctx.strokeStyle = 'rgba(100, 210, 255, 0.5)'
        ctx.lineWidth = 0.5
        if (d.k === 0) {
          ctx.beginPath()
          ctx.moveTo(-4.2, 0)
          ctx.lineTo(4.2, 0)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(0, -1.2)
          ctx.lineTo(0, 1.2)
          ctx.stroke()
        } else if (d.k === 1) {
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(0, 5.5)
          ctx.lineTo(5.5, 5.5)
          ctx.moveTo(0, 0)
          ctx.lineTo(4, 0)
          ctx.stroke()
        } else {
          ctx.strokeRect(-3.2, -2.1, 6.4, 4.2)
          ctx.beginPath()
          ctx.moveTo(-1.2, 2.1)
          ctx.lineTo(1.2, 2.1)
          ctx.stroke()
        }
        ctx.restore()
      }
    }

    const drawEdgePulse = (ctx: CanvasRenderingContext2D, w: number, h: number, f: number) => {
      const u = (f * 0.012) % (Math.PI * 2)
      ctx.save()
      ctx.globalAlpha = 0.12 + Math.sin(u) * 0.05
      const g = ctx.createLinearGradient(0, 0, w, 0)
      g.addColorStop(0, 'transparent')
      g.addColorStop(0.5, 'rgba(0, 255, 255, 0.12)')
      g.addColorStop(1, 'transparent')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, 3)
      ctx.fillRect(0, h - 2, w, 2)
      ctx.restore()
    }

    const drawHyperspaceStreaks = (ctx: CanvasRenderingContext2D, w: number, h: number, f: number) => {
      const cx = w * 0.5
      const cy = -h * 0.07
      const n = isMobile ? 10 : 20
      const pulse = 0.5 + Math.sin(f * 0.018) * 0.5
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      ctx.globalAlpha = 0.06 + pulse * 0.08
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1 || 1)
        const ang = -Math.PI / 2 + (t - 0.5) * 0.95
        const len = h * 1.18
        const g = ctx.createLinearGradient(cx, cy, cx + Math.cos(ang) * len, cy + Math.sin(ang) * len)
        g.addColorStop(0, 'rgba(200, 255, 255, 0.22)')
        g.addColorStop(0.11, 'rgba(0, 255, 255, 0.1)')
        g.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(cx + Math.cos(ang) * len, cy + Math.sin(ang) * len)
        ctx.strokeStyle = g
        ctx.lineWidth = 0.75
        ctx.stroke()
      }
      ctx.restore()
    }

    const drawTacticalCorners = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      const L = 32
      const pad = 16
      const u = 0.35 + Math.sin(t * 0.8) * 0.12
      ctx.save()
      ctx.globalAlpha = 0.9
      ctx.strokeStyle = `rgba(0, 255, 255, ${u})`
      ctx.lineWidth = 1.2
      ctx.shadowColor = 'rgba(0, 255, 200, 0.45)'
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.moveTo(pad, pad + L)
      ctx.lineTo(pad, pad)
      ctx.lineTo(pad + L, pad)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(w - pad - L, pad)
      ctx.lineTo(w - pad, pad)
      ctx.lineTo(w - pad, pad + L)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(pad, h - pad - L)
      ctx.lineTo(pad, h - pad)
      ctx.lineTo(pad + L, h - pad)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(w - pad - L, h - pad)
      ctx.lineTo(w - pad, h - pad)
      ctx.lineTo(w - pad, h - pad - L)
      ctx.stroke()
      ctx.shadowBlur = 0
      ctx.restore()
    }

    const drawDataStreamBars = (ctx: CanvasRenderingContext2D, w: number, h: number, f: number) => {
      const baseY = h * 0.92
      const nb = isMobile ? 24 : 44
      const gap = w / nb
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      ctx.globalAlpha = 0.2
      for (let i = 0; i < nb; i++) {
        const x = i * gap + 1.5
        const hgt = (0.1 + Math.abs(Math.sin(f * 0.035 + i * 0.35)) * 0.4) * h * 0.06
        const grad = ctx.createLinearGradient(x, baseY, x, baseY - hgt)
        grad.addColorStop(0, 'rgba(0, 255, 200, 0.6)')
        grad.addColorStop(0.6, 'rgba(0, 150, 255, 0.25)')
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(x, baseY - hgt, Math.max(1, gap - 2.5), hgt)
      }
      ctx.restore()
    }

    const draw = () => {
      const w = window.innerWidth / CONTENT_SCALE
      const h = window.innerHeight / CONTENT_SCALE
      ctx.clearRect(0, 0, w, h)
      frameRef.current++
      const frame = frameRef.current
      const t = frame * 0.016

      drawDeepSpace(ctx, w, h, t)
      drawFilamentWisps(ctx, w, h, frame)
      drawHyperspaceStreaks(ctx, w, h, frame)
      drawPerspGrid(ctx, w, h, frame)
      drawScanSweep(ctx, w, h, frame)
      drawScanSweepMagenta(ctx, w, h, frame)
      drawOrbitals(ctx, frame)
      drawConstellation(ctx, frame)
      drawStarField(ctx)
      drawBlackHole(ctx, w, h, t)
      drawDust(ctx, w, h)

      meteorNextRef.current -= 1
      if (meteorNextRef.current <= 0 && meteorsRef.current.length < (isMobile ? 3 : 4)) {
        if (Math.random() > 0.25) spawnMeteor(w, h)
        meteorNextRef.current = isMobile ? 50 + Math.random() * 90 : 28 + Math.random() * 80
      }
      drawMeteors(ctx, w, h)
      drawTechDebris(ctx, w, h)
      drawEdgePulse(ctx, w, h, frame)
      drawTacticalCorners(ctx, w, h, t)
      drawDataStreamBars(ctx, w, h, frame)

      const mouse = mouseRef.current
      const mx = mouse.x / CONTENT_SCALE
      const my = mouse.y / CONTENT_SCALE
      if (mx > 0 && my > 0) {
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, 120)
        g.addColorStop(0, 'rgba(0, 255, 255, 0.08)')
        g.addColorStop(0.35, 'rgba(200, 100, 255, 0.04)')
        g.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(mx, my, 120, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
        ctx.save()
        ctx.globalAlpha = 0.2
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)'
        ctx.lineWidth = 0.5
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.arc(mx, my, 28, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.save()
        ctx.translate(mx, my)
        ctx.rotate(t * 0.35)
        ctx.translate(-mx, -my)
        ctx.globalAlpha = 0.14
        ctx.strokeStyle = 'rgba(120, 220, 255, 0.45)'
        ctx.setLineDash([2, 7])
        ctx.beginPath()
        ctx.arc(mx, my, 46, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.restore()
        ctx.beginPath()
        ctx.moveTo(mx - 8, my)
        ctx.lineTo(mx + 8, my)
        ctx.moveTo(mx, my - 8)
        ctx.lineTo(mx, my + 8)
        ctx.stroke()
        ctx.restore()
      }

      animRef.current = requestAnimationFrame(draw)
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animRef.current)
      } else {
        animRef.current = requestAnimationFrame(draw)
      }
    }

    resize()
    animRef.current = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [isMobile])

  useEffect(() => {
    if (prefersReducedMotion()) return

    let cleanup: (() => void) | undefined
    const run = () => {
      cleanup = init()
    }

    const useRic = typeof requestIdleCallback !== 'undefined'
    const idleId = useRic ? requestIdleCallback(run, { timeout: 500 }) : setTimeout(run, 0)

    return () => {
      if (useRic) cancelIdleCallback(idleId as number)
      else clearTimeout(idleId as ReturnType<typeof setTimeout>)
      cleanup?.()
    }
  }, [init])

  return canvasRef
}
