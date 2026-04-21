import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { DocLang } from '../../hooks/useDocBundle'

const LABELS: Record<DocLang, string> = {
  'zh-TW': '繁中',
  'zh-CN': '简中',
  en: 'EN',
  ja: '日本語',
  ko: '한국어',
}

const ORDER: DocLang[] = ['zh-TW', 'zh-CN', 'en', 'ja', 'ko']

const hrefLang = (code: DocLang) =>
  code === 'zh-TW' ? 'zh-TW' : code === 'zh-CN' ? 'zh-CN' : code

export function DocLangPills({ lang }: { lang: DocLang }) {
  const { i18n } = useTranslation()
  const location = useLocation()

  return (
    <div id="lang-switch" className="doc-lang lang-switch" role="navigation" aria-label="Language">
      {ORDER.map((code) => (
        <Link
          key={code}
          className={`lang-pill${code === lang ? ' is-active' : ''}`}
          to={{ pathname: location.pathname, search: `?lang=${encodeURIComponent(code)}` }}
          hrefLang={hrefLang(code)}
          replace
          onClick={() => {
            void i18n.changeLanguage(code)
          }}
        >
          {LABELS[code]}
        </Link>
      ))}
    </div>
  )
}
