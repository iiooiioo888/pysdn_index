import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toLangSearch } from '../routes/langQuery'

/** Current UI language as `?lang=` query (synced with react-i18next). */
export function useLangQuery(): string {
  const { i18n } = useTranslation()
  return useMemo(() => toLangSearch(i18n.language), [i18n.language])
}
