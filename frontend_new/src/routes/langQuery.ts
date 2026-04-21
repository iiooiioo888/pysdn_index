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
