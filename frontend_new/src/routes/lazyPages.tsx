import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import { HomePage as HomePageCmp } from '../pages/HomePage'
import { ModulesPage as ModulesPageCmp } from '../pages/ModulesPage'
import { ModelsPage as ModelsPageCmp } from '../pages/ModelsPage'
import { ModelDetailPage as ModelDetailPageCmp } from '../pages/ModelDetailPage'
import { FaqPage as FaqPageCmp } from '../pages/FaqPage'
import { ThreeRealmsPage as ThreeRealmsPageCmp } from '../pages/ThreeRealmsPage'
import { RealmPage as RealmPageCmp } from '../pages/realms/RealmPage'
import { RealmFeaturePage as RealmFeaturePageCmp } from '../pages/realms/RealmFeaturePage'

/**
 * 對齊 `registry` 的 `LazyExoticComponent` 型別，但實際為同步元件。
 * 在 dev + `base` 非 `/` 時，`import()` 動態載入 `.tsx` 可能出現
 * 「Failed to fetch dynamically imported module」；核心頁改靜態匯入可避開。
 */
function eagerPage(C: ComponentType<object>): LazyExoticComponent<ComponentType<object>> {
  return C as unknown as LazyExoticComponent<ComponentType<object>>
}

export const HomePage = eagerPage(HomePageCmp)
export const ModulesPage = eagerPage(ModulesPageCmp)
export const ModelsPage = eagerPage(ModelsPageCmp)
export const ModelDetailPage = eagerPage(ModelDetailPageCmp)
export const FaqPage = eagerPage(FaqPageCmp)
export const ThreeRealmsPage = eagerPage(ThreeRealmsPageCmp)
export const RealmPage = eagerPage(RealmPageCmp)
export const RealmFeaturePage = eagerPage(RealmFeaturePageCmp)
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
export const SuperTrackPanelPage = lazy(() =>
  import('../pages/panel/SuperTrackPanelPage').then((m) => ({ default: m.SuperTrackPanelPage })),
)
export const SuperTuneLabPage = lazy(() =>
  import('../pages/labs/SuperTuneLabPage').then((m) => ({ default: m.SuperTuneLabPage })),
)
