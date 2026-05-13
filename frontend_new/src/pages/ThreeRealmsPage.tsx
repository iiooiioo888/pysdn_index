import { useTranslation } from 'react-i18next'
import { Navigate, useSearchParams } from 'react-router-dom'
import { isRealmId } from '../data/threeRealmsMeta'
import { useI18nRerender } from '../hooks/useI18nRerender'
import { pathToRealm } from '../routes/paths'
import { RealmsPageShell } from './realms/RealmsPageShell'

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

  const base = import.meta.env.BASE_URL ?? '/'

  return (
    <RealmsPageShell>
      <iframe
        src={base + 'three-realms.html'}
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
