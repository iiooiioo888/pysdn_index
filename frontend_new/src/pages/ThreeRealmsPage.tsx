import { useTranslation } from 'react-i18next'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { ThreeRealmsInteractive } from '../components/ThreeRealmsInteractive'
import { isRealmId } from '../data/threeRealmsMeta'
import { useI18nRerender } from '../hooks/useI18nRerender'
import { useLangQuery } from '../hooks/useLangQuery'
import { PATHS, pathToRealm } from '../routes/paths'
import { RealmsPageShell } from './realms/RealmsPageShell'

export function ThreeRealmsPage() {
  const { t } = useTranslation()
  useI18nRerender()
  const langSearch = useLangQuery()
  const [searchParams] = useSearchParams()
  const legacyRealm = searchParams.get('realm') ?? undefined

  if (isRealmId(legacyRealm)) {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('realm')
    return <Navigate to={{ pathname: pathToRealm(legacyRealm), search: nextParams.toString() }} replace />
  }

  return (
    <RealmsPageShell>
      <main className="realms-page-main" id="realms-index">
        <div className="container realms-page-hero realms-page-hero--cyan">
          <p className="section-label">{t('realms_label')}</p>
          <h1 className="realms-page-title">{t('realms_index_title')}</h1>
          <p className="realms-page-lead">{t('realms_index_lead')}</p>
          <div className="realms-integration-entry">
            <Link
              className="realms-ix-link realms-ix-link--primary"
              to={{ pathname: PATHS.realmsIntegration, search: langSearch }}
            >
              {t('realms_integration_demo_link')}
              <span className="ui-chevron-right" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="container realms-index-interactive-wrap">
          <ThreeRealmsInteractive layout="standalone" />
        </div>
      </main>
    </RealmsPageShell>
  )
}
