/**
 * Single source of truth for in-app paths (relative to React Router basename).
 */
export const PATHS = {
  home: '/',
  modules: '/modules',
  models: '/models',
  faq: '/faq',
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
  /** SuperTrack：全網追蹤助手（獨立儀表板，精簡導覽） */
  panel: {
    supertrack: '/panel/supertrack',
  },
} as const

export type DocSlug = keyof typeof PATHS.docs
