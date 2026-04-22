import { lazy } from 'react'

export const HomePage = lazy(() =>
  import('../pages/HomePage').then((m) => ({ default: m.HomePage })),
)
export const ModulesPage = lazy(() =>
  import('../pages/ModulesPage').then((m) => ({ default: m.ModulesPage })),
)
export const ModelsPage = lazy(() =>
  import('../pages/ModelsPage').then((m) => ({ default: m.ModelsPage })),
)
export const FaqPage = lazy(() => import('../pages/FaqPage').then((m) => ({ default: m.FaqPage })))
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
export const SuperForgeLabPage = lazy(() =>
  import('../pages/labs/SuperForgeLabPage').then((m) => ({ default: m.SuperForgeLabPage })),
)
export const SuperScriptLabPage = lazy(() =>
  import('../pages/labs/SuperScriptLabPage').then((m) => ({ default: m.SuperScriptLabPage })),
)
export const SuperTrackLabPage = lazy(() =>
  import('../pages/labs/SuperTrackLabPage').then((m) => ({ default: m.SuperTrackLabPage })),
)
export const SuperTuneLabPage = lazy(() =>
  import('../pages/labs/SuperTuneLabPage').then((m) => ({ default: m.SuperTuneLabPage })),
)
