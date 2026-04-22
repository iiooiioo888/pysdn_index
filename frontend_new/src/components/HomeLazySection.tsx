import { Suspense, type CSSProperties, type ReactNode } from 'react'
import { prefersReducedMotion } from '../lib/motionPreference'
import { useInView } from '../hooks/useAnimations'

type HomeLazySectionProps = {
  children: ReactNode
  /** 進入視窗前佔位高度，減少版面跳動（px） */
  minHeight?: number
}

/**
 * 首頁區塊：接近視窗時才掛載子樹，觸發 React.lazy 分塊載入。
 * `prefers-reduced-motion: reduce` 時改為立即顯示，避免與捲動行為衝突。
 */
export function HomeLazySection({ children, minHeight = 280 }: HomeLazySectionProps) {
  const reduceMotion = prefersReducedMotion()
  const { ref, inView } = useInView({ rootMargin: '180px 0px 100px 0px', threshold: 0 })
  const show = reduceMotion || inView
  const skelStyle = { '--home-lazy-min': `${minHeight}px` } as CSSProperties

  return (
    <div ref={ref} className="home-lazy-wrap">
      {show ? (
        <Suspense fallback={<div className="home-lazy-skel" style={skelStyle} aria-hidden />}>
          {children}
        </Suspense>
      ) : (
        <div className="home-lazy-skel" style={skelStyle} aria-hidden />
      )}
    </div>
  )
}
