import type { DocSlug } from './paths'

/** 滑入導覽連結時預載入對應頁面 chunk，減少實際點擊後的等待。 */
const docImports: Record<DocSlug, () => Promise<unknown>> = {
  superforge: () => import('../pages/docs/SuperForgeDocPage'),
  superscript: () => import('../pages/docs/SuperScriptDocPage'),
  supertrack: () => import('../pages/docs/SuperTrackDocPage'),
  supertune: () => import('../pages/docs/SuperTuneDocPage'),
}

const labImports: Record<DocSlug, () => Promise<unknown>> = {
  superforge: () => import('../pages/labs/SuperForgeLabPage'),
  superscript: () => import('../pages/labs/SuperScriptLabPage'),
  supertrack: () => import('../pages/labs/SuperTrackLabPage'),
  supertune: () => import('../pages/labs/SuperTuneLabPage'),
}

export function prefetchDocRoute(slug: DocSlug): void {
  void docImports[slug]()
}

export function prefetchLabRoute(slug: DocSlug): void {
  void labImports[slug]()
}

export function prefetchSuperTrackPanel(): void {
  void import('../pages/panel/SuperTrackPanelPage')
}
