import type { MouseEvent } from 'react'

/** Smooth-scroll to an in-page section; keeps `href` for no-JS / middle-click. */
export function scrollToHash(hash: string, e?: MouseEvent<HTMLAnchorElement>) {
  e?.preventDefault()
  const id = hash.startsWith('#') ? hash.slice(1) : hash
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  window.history.replaceState(null, '', `#${id}`)
}
