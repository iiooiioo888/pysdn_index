/** 對齊 CSS `@media (prefers-reduced-motion: reduce)` 與無障礙偏好 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
