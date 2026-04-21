import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { isAppLangCode, type AppLangCode } from '../routes/langQuery'

const loaders: Record<AppLangCode, () => Promise<{ default: Record<string, unknown> }>> = {
  'zh-TW': () => import('../locales/zh-TW.json'),
  'zh-CN': () => import('../locales/zh-CN.json'),
  en: () => import('../locales/en.json'),
  ja: () => import('../locales/ja.json'),
  ko: () => import('../locales/ko.json'),
}

/** 與 Navbar / docs 的 `?lang=` 一致，決定首屏要載入的翻譯檔（不再一次打包五種語系）。 */
export function getInitialLngFromUrl(): AppLangCode {
  if (typeof window === 'undefined') return 'zh-TW'
  const q = new URLSearchParams(window.location.search).get('lang')
  if (q && isAppLangCode(q)) return q
  return 'zh-TW'
}

let changeLanguageWrapped = false

export async function initI18n(): Promise<void> {
  if (i18n.isInitialized) return

  const lng = getInitialLngFromUrl()
  const langsToLoad: AppLangCode[] = lng === 'zh-TW' ? ['zh-TW'] : [lng, 'zh-TW']

  const loaded = await Promise.all(
    langsToLoad.map(async (l) => {
      const mod = await loaders[l]()
      return [l, mod.default] as const
    }),
  )

  const resources: Record<string, { translation: Record<string, unknown> }> = {}
  for (const [l, data] of loaded) {
    resources[l] = { translation: data }
  }

  await i18n.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: 'zh-TW',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })

  if (!changeLanguageWrapped) {
    changeLanguageWrapped = true
    const origChange = i18n.changeLanguage.bind(i18n)
    i18n.changeLanguage = async (lng?: string | string[], ...args: unknown[]) => {
      const code = (Array.isArray(lng) ? lng[0] : lng) ?? ''
      if (code && isAppLangCode(code) && !i18n.hasResourceBundle(code, 'translation')) {
        const mod = await loaders[code]()
        i18n.addResourceBundle(code, 'translation', mod.default, true, true)
      }
      return origChange(lng as never, ...(args as []))
    }
  }

}

export default i18n
