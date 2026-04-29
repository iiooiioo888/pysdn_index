import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isAppLangCode } from '../routes/langQuery'

const languages = [
  { code: 'zh-TW', label: '繁中', flag: '🇹🇼' },
  { code: 'zh-CN', label: '简中', flag: '🇨🇳' },
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
] as const

function resolvePickerLang(i18n: { resolvedLanguage?: string; language?: string }): string {
  const raw = i18n.resolvedLanguage ?? i18n.language ?? ''
  if (!raw) return 'zh-TW'
  if (isAppLangCode(raw)) return raw
  if (raw === 'zh') return 'zh-TW'
  const hit = languages.find((l) => raw === l.code || raw.startsWith(`${l.code}-`))
  return hit?.code ?? 'zh-TW'
}

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!i18n.isInitialized) return
    const q = searchParams.get('lang')
    if (q && isAppLangCode(q) && i18n.language !== q) {
      void i18n.changeLanguage(q)
    }
  }, [searchParams, i18n])

  useEffect(() => {
    if (!isOpen) return
    const onDocPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('pointerdown', onDocPointer, true)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDocPointer, true)
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen])

  const langKey = resolvePickerLang(i18n)
  const current = languages.find((l) => l.code === langKey) ?? languages[0]

  const selectLang = useCallback(
    (code: (typeof languages)[number]['code']) => {
      if (i18n.isInitialized) void i18n.changeLanguage(code)
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set('lang', code)
          return next
        },
        { replace: true },
      )
      setIsOpen(false)
    },
    [i18n, setSearchParams],
  )

  return (
    <div ref={rootRef} className={`lang-switcher ${isOpen ? 'open' : ''}`}>
      <button
        type="button"
        className="lang-current"
        id="lang-switcher-button"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen((v) => !v)
        }}
        aria-haspopup="menu"
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-controls="lang-switcher-menu"
        aria-label="Select language"
      >
        <span className="lang-flag" aria-hidden="true">{current.flag}</span>
        <span className="lang-code">{current.label}</span>
        <span className={`ui-chevron-down ${isOpen ? 'ui-chevron-down--open' : ''}`} aria-hidden="true" />
      </button>
      <div
        className="lang-dropdown"
        id="lang-switcher-menu"
        role="menu"
        aria-labelledby="lang-switcher-button"
        aria-hidden={!isOpen}
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            role="menuitemradio"
            aria-checked={langKey === lang.code}
            className={`lang-option ${langKey === lang.code ? 'active' : ''}`}
            onClick={() => selectLang(lang.code)}
          >
            <span className="lang-opt-flag">{lang.flag}</span>
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  )
}
