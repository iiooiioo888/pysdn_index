import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import { HomePage as HomePageCmp } from '../pages/HomePage'
import { ModulesPage as ModulesPageCmp } from '../pages/ModulesPage'
import { ModelsPage as ModelsPageCmp } from '../pages/ModelsPage'
import { ModelDetailPage as ModelDetailPageCmp } from '../pages/ModelDetailPage'
import { FaqPage as FaqPageCmp } from '../pages/FaqPage'
import { BackupPage as BackupPageCmp } from '../pages/BackupPage'
import { ThreeRealmsPage as ThreeRealmsPageCmp } from '../pages/ThreeRealmsPage'
import { RealmIntegrationPage as RealmIntegrationPageCmp } from '../pages/realms/RealmIntegrationPage'
import { RealmPage as RealmPageCmp } from '../pages/realms/RealmPage'
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
export const BackupPage = eagerPage(BackupPageCmp)
export const ThreeRealmsPage = eagerPage(ThreeRealmsPageCmp)
export const RealmIntegrationPage = eagerPage(RealmIntegrationPageCmp)
export const RealmPage = eagerPage(RealmPageCmp)
export const RealmFeaturePage = lazy(() =>
  import('../pages/realms/RealmFeaturePage').then((m) => ({ default: m.RealmFeaturePage })),
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
export const SuperNovaDocPage = lazy(() =>
  import('../pages/docs/SuperNovaDocPage').then((m) => ({ default: m.SuperNovaDocPage })),
)
export const SuperSightDocPage = lazy(() =>
  import('../pages/docs/SuperSightDocPage').then((m) => ({ default: m.SuperSightDocPage })),
)
export const StocksXDocPage = lazy(() =>
  import('../pages/docs/StocksXDocPage').then((m) => ({ default: m.StocksXDocPage })),
)
export const StockQuantDocPage = lazy(() =>
  import('../pages/docs/StockQuantDocPage').then((m) => ({ default: m.StockQuantDocPage })),
)
export const SuperNovaLabPage = lazy(() =>
  import('../pages/labs/SuperNovaLabPage').then((m) => ({ default: m.SuperNovaLabPage })),
)
export const SuperSightLabPage = lazy(() =>
  import('../pages/labs/SuperSightLabPage').then((m) => ({ default: m.SuperSightLabPage })),
)
export const StocksXLabPage = lazy(() =>
  import('../pages/labs/StocksXLabPage').then((m) => ({ default: m.StocksXLabPage })),
)
export const StockQuantLabPage = lazy(() =>
  import('../pages/labs/StockQuantLabPage').then((m) => ({ default: m.StockQuantLabPage })),
)
