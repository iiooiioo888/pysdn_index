import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { isAppLangCode, type AppLangCode } from '../routes/langQuery'

/** 將 i18n 語系對應到 <html lang>，讓 `index.css` 的 `:lang()` 字體堆疊生效 */
function toDocumentLang(i18nLang: string | undefined): AppLangCode | 'en' {
  const raw = i18nLang ?? ''
  if (!raw) return 'zh-TW'
  if (isAppLangCode(raw)) return raw
  if (raw === 'zh') return 'zh-TW'
  if (raw.startsWith('zh-CN')) return 'zh-CN'
  if (raw.startsWith('zh-TW')) return 'zh-TW'
  if (raw.startsWith('ja')) return 'ja'
  if (raw.startsWith('ko')) return 'ko'
  if (raw.startsWith('en')) return 'en'
  return 'en'
}

/**
 * 掛在根 layout：隨語系更新 `document.documentElement.lang`，供簡／繁／日／韓使用正確 CJK 字型（見 index.css）。
 */
export function DocumentLangFont() {
  const { i18n } = useTranslation()

  useEffect(() => {
    if (!i18n.isInitialized || typeof i18n.on !== 'function') return
    const apply = () => {
      const code = toDocumentLang(i18n.resolvedLanguage ?? i18n.language)
      document.documentElement.lang = code === 'en' ? 'en' : code
    }
    apply()
    i18n.on('languageChanged', apply)
    return () => {
      i18n.off('languageChanged', apply)
    }
  }, [i18n, i18n.isInitialized])

  return null
}
