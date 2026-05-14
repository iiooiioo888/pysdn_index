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
    <div ref={rootRef} className="relative shrink-0 z-[120] lang-switcher">
      <button
        type="button"
        className="flex items-center gap-1.5 px-3 py-1.5 text-ui text-text-dim border border-border rounded-lg bg-transparent hover:border-border-hover hover:text-text transition-colors duration-200"
        id="lang-switcher-button"
        onClick={(e) => { e.stopPropagation(); setIsOpen((v) => !v) }}
        aria-haspopup="menu"
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-controls="lang-switcher-menu"
        aria-label="Select language"
      >
        <span aria-hidden="true">{current.flag}</span>
        <span>{current.label}</span>
        <span className={`inline-block w-[0.42em] h-[0.42em] border-r-2 border-b-2 border-current transition-transform duration-200 ml-1 ${isOpen ? 'rotate-[225deg]' : 'rotate-45'}`} aria-hidden="true" />
      </button>
      <div
        className={[
          'absolute top-[calc(100%+8px)] right-0 min-w-[160px] z-[200]',
          'bg-[rgba(12,12,22,0.96)] glass-blur border border-white/[0.08] rounded-[14px] p-1.5',
          'shadow-[0_16px_40px_rgba(0,0,0,0.45)]',
          'transition-all duration-200',
          isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2',
        ].join(' ')}
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
            className={[
              'flex items-center gap-2 w-full px-3 py-2 text-ui rounded-lg transition-colors duration-150',
              langKey === lang.code
                ? 'bg-primary-500/10 text-primary-400'
                : 'text-text-dim hover:bg-white/[0.06] hover:text-white',
            ].join(' ')}
            onClick={() => selectLang(lang.code)}
          >
            <span>{lang.flag}</span>
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  )
}
