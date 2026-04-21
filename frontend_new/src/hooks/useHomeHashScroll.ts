import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { PATHS } from '../routes/paths'
import { scrollToElementByHash } from '../utils/scrollToHash'

const HOME = PATHS.home

/**
 * 首頁錨點：React Router 不會自動捲到 #section；懶載入區塊也可能晚於導覽。
 * 在 hash 變化或路由進入首頁時重試直到目標節點存在。
 */
export function useHomeHashScroll() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== HOME) return
    const raw = location.hash
    if (!raw || raw === '#') return
    const id = raw.startsWith('#') ? raw.slice(1) : raw
    if (!id) return

    let cancelled = false
    let attempts = 0
    const maxAttempts = 100

    const tick = () => {
      if (cancelled) return
      if (scrollToElementByHash(`#${id}`)) return
      attempts += 1
      if (attempts >= maxAttempts) return
      requestAnimationFrame(tick)
    }

    tick()
    const t1 = window.setTimeout(tick, 50)
    const t2 = window.setTimeout(tick, 300)
    const t3 = window.setTimeout(tick, 800)

    return () => {
      cancelled = true
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
    }
  }, [location.pathname, location.hash])
}
