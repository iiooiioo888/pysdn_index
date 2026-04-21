import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const SUPPORTED = ['zh-TW', 'zh-CN', 'en', 'ja', 'ko'] as const
export type DocLang = (typeof SUPPORTED)[number]

export type DocBundleName =
  | 'superforge'
  | 'superscript'
  | 'supertrack'
  | 'supertune'
  | 'modules'

type BundleJson = Record<string, Record<string, string>>

function isDocLang(s: string): s is DocLang {
  return (SUPPORTED as readonly string[]).includes(s)
}

export function useDocBundle(name: DocBundleName) {
  const { i18n } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [bundle, setBundle] = useState<BundleJson | null>(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoadError(false)
    setBundle(null)
    fetch(`${import.meta.env.BASE_URL}i18n/${name}.json`)
      .then((r) => r.json())
      .then((j: BundleJson) => {
        if (!cancelled) setBundle(j)
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(true)
          setBundle(null)
        }
      })
    return () => {
      cancelled = true
    }
  }, [name])

  const resolvedLang: DocLang = useMemo(() => {
    const q = searchParams.get('lang')
    if (q && isDocLang(q)) return q
    const il = i18n.language
    if (isDocLang(il)) return il
    return 'zh-TW'
  }, [searchParams, i18n.language])

  useEffect(() => {
    const q = searchParams.get('lang')
    if (q && isDocLang(q) && i18n.language !== q) {
      void i18n.changeLanguage(q)
    }
  }, [searchParams, i18n])

  useEffect(() => {
    if (!searchParams.has('lang')) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set('lang', resolvedLang)
          return next
        },
        { replace: true },
      )
    }
  }, [searchParams, resolvedLang, setSearchParams])

  const dict = useMemo(() => {
    if (!bundle) return null
    const tw = bundle['zh-TW'] ?? {}
    const cur = bundle[resolvedLang] ?? {}
    return { ...tw, ...cur }
  }, [bundle, resolvedLang])

  const t = useCallback(
    (key: string) => {
      if (!dict) return ''
      return dict[key] ?? key
    },
    [dict],
  )

  useEffect(() => {
    if (!dict) return
    const title = dict.title
    const desc = dict.description
    if (title) document.title = title
    const meta = document.querySelector('meta[name="description"]')
    if (meta && desc) meta.setAttribute('content', desc)
  }, [dict])

  useEffect(() => {
    const map: Record<string, string> = {
      'zh-CN': "'Plus Jakarta Sans', 'Noto Sans SC', sans-serif",
      ja: "'Plus Jakarta Sans', 'Noto Sans JP', sans-serif",
      ko: "'Plus Jakarta Sans', 'Noto Sans KR', sans-serif",
    }
    const f = map[resolvedLang]
    if (f) document.body.style.fontFamily = f
    else document.body.style.fontFamily = "'Plus Jakarta Sans', 'Noto Sans TC', sans-serif"
    document.documentElement.lang =
      resolvedLang === 'zh-TW'
        ? 'zh-TW'
        : resolvedLang === 'zh-CN'
          ? 'zh-CN'
          : resolvedLang

    return () => {
      document.body.style.fontFamily = ''
    }
  }, [resolvedLang])

  const ready = Boolean(!loadError && dict && dict.title)

  return { t, ready, loadError, lang: resolvedLang, dict }
}
