import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { PATHS } from './paths'
import {
  HomePage,
  ModulesPage,
  SuperForgeDocPage,
  SuperScriptDocPage,
  SuperTrackDocPage,
  SuperTuneDocPage,
} from './lazyPages'
import { NotFoundRedirect } from './NotFoundRedirect'
import { RouteFallback } from './RouteFallback'

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path={PATHS.home} element={<HomePage />} />
        <Route path={PATHS.modules} element={<ModulesPage />} />
        <Route path={PATHS.docs.superforge} element={<SuperForgeDocPage />} />
        <Route path={PATHS.docs.superscript} element={<SuperScriptDocPage />} />
        <Route path={PATHS.docs.supertrack} element={<SuperTrackDocPage />} />
        <Route path={PATHS.docs.supertune} element={<SuperTuneDocPage />} />
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
    </Suspense>
  )
}
