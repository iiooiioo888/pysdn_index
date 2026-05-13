import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type OpenCCConvert = (text: string) => string

/**
 * 介面語言為 zh-TW 時，將筆記內容由簡體轉為臺灣繁體（OpenCC，cn→tw）。
 * 以動態 import 延後載入字庫，避免非繁中使用者下載。
 */
export function useCnToTwConverter(): { convert: (text: string) => string, ready: boolean } {
  const { i18n } = useTranslation()
  const enabled = i18n.language.startsWith('zh-TW')
  const [openccConvert, setOpenccConvert] = useState<OpenCCConvert | null>(null)

  useEffect(() => {
    if (!enabled) {
      setOpenccConvert(null)
      return undefined
    }

    let cancelled = false
    void import('opencc-js').then((mod) => {
      if (cancelled) return
      const OpenCC = mod.default
      const conv = OpenCC.Converter({ from: 'cn', to: 'tw' })
      setOpenccConvert(() => (text: string) => (text ? conv(text) : ''))
    })

    return () => {
      cancelled = true
    }
  }, [enabled])

  const convert = useCallback(
    (text: string) => {
      if (!text) return ''
      if (!enabled) return text
      if (!openccConvert) return text
      return openccConvert(text)
    },
    [enabled, openccConvert],
  )

  return { convert, ready: !enabled || openccConvert !== null }
}
