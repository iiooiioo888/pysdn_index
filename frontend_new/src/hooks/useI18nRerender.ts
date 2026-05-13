import { useEffect, useState } from 'react'
import i18n from '../lib/i18n'

export function useI18nRerender(): void {
  const [, setTick] = useState(0)

  useEffect(() => {
    const bump = () => setTick((n) => n + 1)

    if (i18n.isInitialized) bump()
    i18n.on('initialized', bump)
    i18n.on('languageChanged', bump)
    i18n.on('loaded', bump)

    return () => {
      i18n.off('initialized', bump)
      i18n.off('languageChanged', bump)
      i18n.off('loaded', bump)
    }
  }, [i18n])
}
