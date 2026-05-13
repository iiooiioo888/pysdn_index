import { useTranslation } from 'react-i18next'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { REALM_META, REALM_ORDER, isRealmId } from '../data/threeRealmsMeta'
import { REALMS_FEATURE_COUNTS } from '../data/threeRealmsFeatures'
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

  return (
    <RealmsPageShell>
      <main className="realms-page-main" id="realms-page">
        <div className="container realms-page-hero">
          <p className="section-label">{t('realms_label')}</p>
          <h1 className="realms-page-title">{t('realms_index_title')}</h1>
          <p className="realms-page-lead">{t('realms_index_lead')}</p>
          <p className="realms-page-flow">{t('realms_flow')}</p>
        </div>
        <div className="container realms-index-grid">
          {REALM_ORDER.map((realmId) => {
            const meta = REALM_META[realmId]
            const count = REALMS_FEATURE_COUNTS[realmId]
            return (
              <Link key={realmId} className={`realms-index-card realms-index-card--${meta.accent}`} to={pathToRealm(realmId)}>
                <span className="realms-index-card-step">{t('realms_ix_step', { n: REALM_ORDER.indexOf(realmId) + 1 })}</span>
                <h2>{t(meta.titleKey)}</h2>
                <p>{t(meta.descKey)}</p>
                <span className="realms-index-card-meta">{t('realms_index_feature_count', { count })}</span>
              </Link>
            )
          })}
        </div>
      </main>
    </RealmsPageShell>
  )
}
