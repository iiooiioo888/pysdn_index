import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { ThreeRealmsInteractive } from '../components/ThreeRealmsInteractive'
import { TianyuIllustration, ShenyuIllustration, JingjieIllustration } from '../components/realms/RealmIllustrations'
import { REALM_FEATURES_TIANYU } from '../data/threeRealmsFeatures.tianyu'
import { REALM_FEATURES_SHENYU } from '../data/threeRealmsFeatures.shenyu'
import { REALM_FEATURES_JINGJIE } from '../data/threeRealmsFeatures.jingjie'
import { REALM_META, REALM_ORDER, isRealmId } from '../data/threeRealmsMeta'
import type { RealmId } from '../data/threeRealmsFeatures'
import { useI18nRerender } from '../hooks/useI18nRerender'
import { useLangQuery } from '../hooks/useLangQuery'
import { PATHS, pathToRealm } from '../routes/paths'
import { RealmsPageShell } from './realms/RealmsPageShell'

const REALM_ILLUSTRATIONS: Record<RealmId, React.FC<{ className?: string; size?: number }>> = {
  tianyu: TianyuIllustration,
  shenyu: ShenyuIllustration,
  jingjie: JingjieIllustration,
}

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

  // Compute stats
  const stats = useMemo(() => {
    const counts: Record<RealmId, number> = {
      tianyu: REALM_FEATURES_TIANYU.length,
      shenyu: REALM_FEATURES_SHENYU.length,
      jingjie: REALM_FEATURES_JINGJIE.length,
    }
    const total = counts.tianyu + counts.shenyu + counts.jingjie
    return { counts, total }
  }, [])

  return (
    <RealmsPageShell>
      <main className="realms-page-main" id="realms-index">
        <div className="container realms-page-hero realms-page-hero--cyan">
          <p className="section-label">{t('realms_label')}</p>
          <h1 className="realms-page-title">{t('realms_index_title')}</h1>
          <p className="realms-page-lead">{t('realms_index_lead')}</p>

          {/* Realm quick-nav grid */}
          <div className="realms-quicknav-grid">
            {REALM_ORDER.map((id) => {
              const m = REALM_META[id]
              const Illustration = REALM_ILLUSTRATIONS[id]
              return (
                <Link
                  key={id}
                  className={`realms-quicknav-card realms-quicknav-card--${m.accent}`}
                  to={{ pathname: pathToRealm(id), search: langSearch }}
                >
                  <Illustration className={`realms-ix-illustration realms-ix-illustration--${m.accent}`} size={52} />
                  <span className="realms-quicknav-title">{t(m.titleKey)}</span>
                  <span className="realms-quicknav-sub">{t(m.subKey)}</span>
                  <span className="realms-quicknav-count">{t('realms_index_feature_count', { count: stats.counts[id] })}</span>
                </Link>
              )
            })}
          </div>

          {/* Stats row */}
          <div className="realms-index-stats">
            <span className="realms-index-stat">
              <span className="realms-index-stat-value">{stats.total}</span>
              {t('realms_stats_total')}
            </span>
            {REALM_ORDER.map((id) => (
              <span key={id} className="realms-index-stat">
                <span className="realms-index-stat-value">{stats.counts[id]}</span>
                {t(REALM_META[id].titleKey)}
              </span>
            ))}
          </div>

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
