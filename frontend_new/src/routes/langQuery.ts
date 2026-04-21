/** ISO codes used in UI + doc bundles (`?lang=`). */
export const APP_LANG_CODES = ['zh-TW', 'zh-CN', 'en', 'ja', 'ko'] as const
export type AppLangCode = (typeof APP_LANG_CODES)[number]

export function isAppLangCode(s: string): s is AppLangCode {
  return (APP_LANG_CODES as readonly string[]).includes(s)
}

/** Builds `?lang=…` for Link `search` / template literals. */
export function toLangSearch(langCode: string): string {
  return `?lang=${encodeURIComponent(langCode)}`
}

/** Merge extra query params into an existing `search` string (e.g. from `useLangQuery()`). */
export function withSearchParam(search: string, key: string, value: string): string {
  const q = search.startsWith('?') ? search.slice(1) : search
  const p = new URLSearchParams(q)
  p.set(key, value)
  return `?${p.toString()}`
}
