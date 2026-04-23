import type { MouseEvent } from 'react'
import { prefersReducedMotion } from '../lib/motionPreference'

/** 捲到首頁區塊；成功則為 true（供重試邏輯使用）。 */
export function scrollToElementByHash(hash: string): boolean {
  const id = hash.startsWith('#') ? hash.slice(1) : hash
  if (!id) return false
  const el = document.getElementById(id)
  if (!el) return false
  const behavior = prefersReducedMotion() ? ('auto' as const) : ('smooth' as const)
  el.scrollIntoView({ behavior, block: 'start' })
  return true
}

/** 已在首頁時補捲（Router 不捲、同一錨點再點時）。 */
export function scheduleScrollToHomeHash(hash: string, isHome: boolean) {
  if (!isHome) return
  const run = () => scrollToElementByHash(hash)
  requestAnimationFrame(run)
  window.setTimeout(run, 0)
  window.setTimeout(run, 120)
}

/** Smooth-scroll to an in-page section; keeps `href` for no-JS / middle-click. */
export function scrollToHash(hash: string, e?: MouseEvent<HTMLAnchorElement>) {
  e?.preventDefault()
  if (!scrollToElementByHash(hash)) return
  const id = hash.startsWith('#') ? hash.slice(1) : hash
  const { pathname, search } = window.location
  window.history.replaceState(null, '', `${pathname}${search}#${id}`)
}
