import { useTranslation } from 'react-i18next'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { REALM_META, REALM_ORDER, isRealmId } from '../data/threeRealmsMeta'
import { REALMS_FEATURE_COUNTS } from '../data/threeRealmsFeatures'
import { useI18nRerender } from '../hooks/useI18nRerender'
import { pathToRealm } from '../routes/paths'
import { RealmsPageShell } from './realms/RealmsPageShell'
import { useMemo } from 'react'

export function ThreeRealmsPage() {
  const { t } = useTranslation()
  useI18nRerender()
  const [searchParams] = useSearchParams()
  const legacyRealm = searchParams.get('realm') ?? undefined

  if (isRealmId(legacyRealm)) {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('realm')
    return <Navigate to={{ pathname: pathToRealm(legacyRealm), search: nextParams.toString() }} replace />
  }

  const base = useMemo(() => {
    const meta = document.querySelector('base')
    return meta?.getAttribute('href') ?? import.meta.env.BASE_URL ?? '/'
  }, [])

  const iframeSrc = base + 'three-realms.html'

  return (
    <RealmsPageShell>
      <iframe
        src={iframeSrc}
        title={t('realms_index_title')}
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
          display: 'block',
          position: 'relative',
          zIndex: 1,
        }}
      />
    </RealmsPageShell>
  )
}
