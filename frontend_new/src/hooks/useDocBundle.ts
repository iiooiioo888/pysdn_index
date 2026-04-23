/**
 * 技術文件／模組長文案：資料在 `src/locales/doc/{name}.json`（與主站 `src/locales/*.json` 同屬 i18next 生態），
 * 載入後註冊為命名空間 `doc_{name}`，與首頁 `translation` 命名空間並存，統一走 react-i18next。
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import i18n from '../lib/i18n'

const SUPPORTED = ['zh-TW', 'zh-CN', 'en', 'ja', 'ko'] as const
export type DocLang = (typeof SUPPORTED)[number]

export type DocBundleName =
  | 'superforge'
  | 'superscript'
  | 'supertrack'
  | 'supertune'
  | 'modules'

type BundleJson = Record<string, Record<string, string>>

const docLoaders: Record<DocBundleName, () => Promise<{ default: BundleJson }>> = {
  superforge: () => import('../locales/doc/superforge.json'),
  superscript: () => import('../locales/doc/superscript.json'),
  supertrack: () => import('../locales/doc/supertrack.json'),
  supertune: () => import('../locales/doc/supertune.json'),
  modules: () => import('../locales/doc/modules.json'),
}

function isDocLang(s: string): s is DocLang {
  return (SUPPORTED as readonly string[]).includes(s)
}

function registerMergedBundles(ns: string, data: BundleJson) {
  const tw = data['zh-TW'] ?? {}
  for (const l of SUPPORTED) {
    const merged = { ...tw, ...(data[l] ?? {}) }
    i18n.addResourceBundle(l, ns, merged, true, true)
  }
}

export function useDocBundle(name: DocBundleName) {
  const ns = `doc_${name}`
  const { t: tNs, i18n: i18nFromHook } = useTranslation(ns, { useSuspense: false })
  const [searchParams, setSearchParams] = useSearchParams()
  const [loaded, setLoaded] = useState(() => i18n.hasResourceBundle('zh-TW', ns))
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (i18n.hasResourceBundle('zh-TW', ns)) {
      setLoaded(true)
      setLoadError(false)
      return
    }
    setLoaded(false)
    setLoadError(false)
    docLoaders[name]()
      .then((mod) => {
        if (cancelled) return
        registerMergedBundles(ns, mod.default)
        setLoaded(true)
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(true)
          setLoaded(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [name, ns])

  const resolvedLang: DocLang = useMemo(() => {
    const q = searchParams.get('lang')
    if (q && isDocLang(q)) return q
    const il = i18nFromHook.language
    if (isDocLang(il)) return il
    return 'zh-TW'
  }, [searchParams, i18nFromHook.language])

  useEffect(() => {
    const q = searchParams.get('lang')
    if (q && isDocLang(q) && i18nFromHook.language !== q) {
      void i18nFromHook.changeLanguage(q)
    }
  }, [searchParams, i18nFromHook])

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

  const t = useCallback(
    (key: string) => tNs(key, { defaultValue: key }),
    [tNs],
  )

  const dict = useMemo((): Record<string, string> | null => {
    if (!loaded) return null
    const raw = i18n.getResourceBundle(resolvedLang, ns) as Record<string, string> | undefined
    return raw ?? null
  }, [loaded, resolvedLang, ns])

  useEffect(() => {
    if (!loaded || !dict) return
    const title = dict.title
    const desc = dict.description
    if (title) document.title = title
    const meta = document.querySelector('meta[name="description"]')
    if (meta && desc) meta.setAttribute('content', desc)
  }, [dict, loaded])

  const ready = Boolean(
    !loadError && loaded && i18n.exists('title', { ns, lng: resolvedLang }),
  )

  return { t, ready, loadError, lang: resolvedLang, dict }
}
