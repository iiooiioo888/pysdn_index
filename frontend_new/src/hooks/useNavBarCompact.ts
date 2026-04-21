import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import i18n from '../lib/i18n'

/**
 * 偵測導覽列是否「一行放不下」。
 * 注意：進入 compact 後會隱藏連結，若仍用 ResizeObserver 量「收合後」的寬度會誤判為不溢出，
 * 造成 compact ↔ 展開 快速切換閃爍。因此 compact 為 true 時忽略 inner 的 RO，只在視窗變寬或換語系時重新評估。
 */
export function useNavBarCompact(linksSelector: string | null = '.nav-links') {
  const navInnerRef = useRef<HTMLDivElement>(null)
  const compactRef = useRef(false)
  const lastWindowWidth = useRef(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [compact, setCompact] = useState(false)

  const applyMeasure = useCallback(() => {
    const inner = navInnerRef.current
    if (!inner) return

    const linkRow = linksSelector ? (inner.querySelector(linksSelector) as HTMLElement | null) : null

    const innerOverflowX = inner.scrollWidth > inner.clientWidth + 2
    const innerWrappedY = inner.scrollHeight > inner.clientHeight + 6
    const linksOverflowX = linkRow ? linkRow.scrollWidth > linkRow.clientWidth + 2 : false

    const next = innerOverflowX || innerWrappedY || linksOverflowX
    if (next !== compactRef.current) {
      compactRef.current = next
      setCompact(next)
    }
  }, [linksSelector])

  /** 先假設可展開，下一幀再量（用於視窗變寬、換語系後重新判斷） */
  const releaseAndMeasure = useCallback(() => {
    compactRef.current = false
    setCompact(false)
    requestAnimationFrame(() => {
      applyMeasure()
    })
  }, [applyMeasure])

  useLayoutEffect(() => {
    const inner = navInnerRef.current
    if (!inner) return

    lastWindowWidth.current = window.innerWidth
    applyMeasure()

    let widenDebounce: ReturnType<typeof setTimeout> | undefined

    const ro = new ResizeObserver(() => {
      if (compactRef.current) return
      requestAnimationFrame(applyMeasure)
    })
    ro.observe(inner)
    if (linksSelector) {
      const linkRow = inner.querySelector(linksSelector)
      if (linkRow) ro.observe(linkRow)
    }

    const onResize = () => {
      const w = window.innerWidth
      const prev = lastWindowWidth.current
      lastWindowWidth.current = w

      if (w > prev) {
        clearTimeout(widenDebounce)
        widenDebounce = setTimeout(() => {
          releaseAndMeasure()
        }, 100)
      } else if (!compactRef.current) {
        requestAnimationFrame(applyMeasure)
      }
    }

    window.addEventListener('resize', onResize)
    const onLang = () => releaseAndMeasure()
    i18n.on('languageChanged', onLang)

    return () => {
      clearTimeout(widenDebounce)
      ro.disconnect()
      window.removeEventListener('resize', onResize)
      i18n.off('languageChanged', onLang)
    }
  }, [applyMeasure, releaseAndMeasure, linksSelector])

  return { navInnerRef, compact }
}
