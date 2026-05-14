/**
 * Single source of truth for in-app paths（basename 下之相對路徑）。
 * 實際路由樹見 `routes/registry.ts`（`APP_ROUTE_ENTRIES`）與 `routes/appRouter.tsx`（`createBrowserRouter`）。
 */
export const PATHS = {
  home: '/',
  modules: '/modules',
  models: '/models',
  /** 動態段與 `CATALOG_MODELS[].id` 對齊，例如 `/models/seedance-2` */
  modelsDetailPattern: '/models/:modelId',
  faq: '/faq',
  /** 網紅數位資產備份系統 */
  backup: '/backup',
  /** Note 倉庫三界：互動式資訊導覽 */
  realms: '/realms',
  realmsIndex: '/realms',
  realmsIntegration: '/realms/integration',
  realmsRealmPattern: '/realms/:realmId',
  realmsFeaturePattern: '/realms/:realmId/:featureSlug',
  docs: {
    superforge: '/docs/superforge',
    superscript: '/docs/superscript',
    supertrack: '/docs/supertrack',
    supertune: '/docs/supertune',
  },
  /** 各模組大螢幕模擬儀表板（示範資料） */
  labs: {
    superforge: '/labs/superforge',
    superscript: '/labs/superscript',
    supertrack: '/labs/supertrack',
    supertune: '/labs/supertune',
  },
  /** SuperTrack 示範面板（/panel；與 /labs/supertrack 為同模組不同版面） */
  panel: {
    supertrack: '/panel/supertrack',
  },
} as const

export type DocSlug = keyof typeof PATHS.docs
export type RealmPathId = 'tianyu' | 'shenyu' | 'jingjie'

/** 模型詳情頁路徑（會編碼 id，與路由 `models/:modelId` 一致） */
export function pathToModelDetail(modelId: string): string {
  return `${PATHS.models}/${encodeURIComponent(modelId)}`
}

export function pathToRealm(realmId: RealmPathId): string {
  return `${PATHS.realmsIndex}/${encodeURIComponent(realmId)}`
}

export function pathToRealmFeature(realmId: RealmPathId, featureSlug: string): string {
  return `${pathToRealm(realmId)}/${encodeURIComponent(featureSlug)}`
}
