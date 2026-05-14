import type { ComponentType, LazyExoticComponent } from 'react'
import { PATHS } from './paths'
import {
  HomePage,
  ModulesPage,
  ModelsPage,
  ModelDetailPage,
  FaqPage,
  BackupPage,
  ThreeRealmsPage,
  RealmIntegrationPage,
  RealmPage,
  RealmFeaturePage,
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

/** 與 React.lazy 相容的頁面元件型別 */
export type AppLazyPage = LazyExoticComponent<ComponentType<object>>

export type AppRouteGroup = 'core' | 'docs' | 'labs' | 'panel'

export type AppRouteEntry = {
  path: string
  group: AppRouteGroup
  Page: AppLazyPage
}

/**
 * 全站路由表（順序：核心頁 → 文件 → 實驗室 → 面板）。
 * 新增頁面時請同步更新此表與 `paths.ts`。
 */
export const APP_ROUTE_ENTRIES: AppRouteEntry[] = [
  { path: PATHS.home, group: 'core', Page: HomePage },
  { path: PATHS.modules, group: 'core', Page: ModulesPage },
  { path: PATHS.models, group: 'core', Page: ModelsPage },
  { path: PATHS.modelsDetailPattern, group: 'core', Page: ModelDetailPage },
  { path: PATHS.faq, group: 'core', Page: FaqPage },
  { path: PATHS.backup, group: 'core', Page: BackupPage },
  { path: PATHS.realmsIndex, group: 'core', Page: ThreeRealmsPage },
  { path: PATHS.realmsIntegration, group: 'core', Page: RealmIntegrationPage },
  { path: PATHS.realmsFeaturePattern, group: 'core', Page: RealmFeaturePage },
  { path: PATHS.realmsRealmPattern, group: 'core', Page: RealmPage },

  { path: PATHS.docs.superforge, group: 'docs', Page: SuperForgeDocPage },
  { path: PATHS.docs.superscript, group: 'docs', Page: SuperScriptDocPage },
  { path: PATHS.docs.supertrack, group: 'docs', Page: SuperTrackDocPage },
  { path: PATHS.docs.supertune, group: 'docs', Page: SuperTuneDocPage },

  { path: PATHS.labs.superforge, group: 'labs', Page: SuperForgeLabPage },
  { path: PATHS.labs.superscript, group: 'labs', Page: SuperScriptLabPage },
  { path: PATHS.labs.supertrack, group: 'labs', Page: SuperTrackLabPage },
  { path: PATHS.labs.supertune, group: 'labs', Page: SuperTuneLabPage },

  { path: PATHS.panel.supertrack, group: 'panel', Page: SuperTrackPanelPage },
]
