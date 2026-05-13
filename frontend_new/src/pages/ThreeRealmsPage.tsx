import { useTranslation } from 'react-i18next'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { isRealmId } from '../data/threeRealmsMeta'
import { useI18nRerender } from '../hooks/useI18nRerender'
import { PATHS, pathToRealm } from '../routes/paths'
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
      <div className="container realms-integration-entry">
        <Link className="realms-ix-link realms-ix-link--primary" to={PATHS.realmsIntegration}>
          天域 ↔ 鏡界整合流程 Demo
          <span className="ui-chevron-right" aria-hidden="true" />
        </Link>
      </div>
      <iframe
        src={base + 'three-realms.html'}
        title={t('realms_index_title')}
        className="realms-index-iframe"
      />
    </RealmsPageShell>
  )
}
