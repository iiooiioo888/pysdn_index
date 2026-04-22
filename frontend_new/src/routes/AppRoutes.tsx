import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { PATHS } from './paths'
import {
  HomePage,
  ModulesPage,
  ModelsPage,
  FaqPage,
  SuperForgeDocPage,
  SuperScriptDocPage,
  SuperTrackDocPage,
  SuperTuneDocPage,
  SuperForgeLabPage,
  SuperScriptLabPage,
  SuperTrackLabPage,
  SuperTrackPanelPage,
  SuperTuneLabPage,
} from './lazyPages'
import { NotFoundRedirect } from './NotFoundRedirect'
import { RouteFallback } from './RouteFallback'

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path={PATHS.home} element={<HomePage />} />
        <Route path={PATHS.modules} element={<ModulesPage />} />
        <Route path={PATHS.models} element={<ModelsPage />} />
        <Route path={PATHS.faq} element={<FaqPage />} />
        <Route path={PATHS.docs.superforge} element={<SuperForgeDocPage />} />
        <Route path={PATHS.docs.superscript} element={<SuperScriptDocPage />} />
        <Route path={PATHS.docs.supertrack} element={<SuperTrackDocPage />} />
        <Route path={PATHS.docs.supertune} element={<SuperTuneDocPage />} />
        <Route path={PATHS.labs.superforge} element={<SuperForgeLabPage />} />
        <Route path={PATHS.labs.superscript} element={<SuperScriptLabPage />} />
        <Route path={PATHS.labs.supertrack} element={<SuperTrackLabPage />} />
        <Route path={PATHS.panel.supertrack} element={<SuperTrackPanelPage />} />
        <Route path={PATHS.labs.supertune} element={<SuperTuneLabPage />} />
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
    </Suspense>
  )
}
