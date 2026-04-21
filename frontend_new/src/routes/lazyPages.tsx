import { lazy } from 'react'

export const HomePage = lazy(() =>
  import('../pages/HomePage').then((m) => ({ default: m.HomePage })),
)
export const ModulesPage = lazy(() =>
  import('../pages/ModulesPage').then((m) => ({ default: m.ModulesPage })),
)
export const SuperForgeDocPage = lazy(() =>
  import('../pages/docs/SuperForgeDocPage').then((m) => ({ default: m.SuperForgeDocPage })),
)
export const SuperScriptDocPage = lazy(() =>
  import('../pages/docs/SuperScriptDocPage').then((m) => ({ default: m.SuperScriptDocPage })),
)
export const SuperTrackDocPage = lazy(() =>
  import('../pages/docs/SuperTrackDocPage').then((m) => ({ default: m.SuperTrackDocPage })),
)
export const SuperTuneDocPage = lazy(() =>
  import('../pages/docs/SuperTuneDocPage').then((m) => ({ default: m.SuperTuneDocPage })),
)
