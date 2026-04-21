/**
 * Single source of truth for in-app paths (relative to React Router basename).
 */
export const PATHS = {
  home: '/',
  modules: '/modules',
  docs: {
    superforge: '/docs/superforge',
    superscript: '/docs/superscript',
    supertrack: '/docs/supertrack',
    supertune: '/docs/supertune',
  },
} as const

export type DocSlug = keyof typeof PATHS.docs
