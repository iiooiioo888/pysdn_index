import { useTranslation } from 'react-i18next'
import { Link, Navigate, useParams } from 'react-router-dom'
import { TianyuRealmBoard } from '../../components/realms/TianyuRealmBoard'
import { ShenyuRealmBoard } from '../../components/realms/ShenyuRealmBoard'
import { JingjieRealmBoard } from '../../components/realms/JingjieRealmBoard'
import { REALM_META, isRealmId } from '../../data/threeRealmsMeta'
import { useI18nRerender } from '../../hooks/useI18nRerender'
import { useRealmFeatures } from '../../hooks/useRealmFeatures'
import { PATHS } from '../../routes/paths'
import { RealmsPageShell } from './RealmsPageShell'

export function RealmPage() {
  const { t } = useTranslation()
  useI18nRerender()
  const { realmId } = useParams()

  if (!isRealmId(realmId)) {
    return <Navigate to={PATHS.realmsIndex} replace />
  }

  const meta = REALM_META[realmId]
  const { features, loading } = useRealmFeatures(realmId)

  return (
    <RealmsPageShell>
      <main className="realms-page-main" id="realms-page">
        <div className={`container realms-page-hero realms-page-hero--${meta.accent}`}>
          <nav className="realms-breadcrumb" aria-label={t('realms_breadcrumb_aria')}>
            <Link className="realms-bc-link" to={PATHS.realmsIndex}>{t('realms_index_short')}</Link>
            <span className="realms-bc-sep" aria-hidden="true">
              /
            </span>
            <span className="realms-bc-current">{t(meta.titleKey)}</span>
          </nav>
          <Link className="realms-back-link" to={PATHS.realmsIndex}>
            <span className="ui-chevron-right realms-back-chevron" aria-hidden="true" />
            {t('realms_back_index')}
          </Link>
          <p className="section-label">{t('realms_label')}</p>
          <h1 className="realms-page-title">{t(meta.titleKey)}</h1>
          <p className="realms-page-lead">{t(meta.descKey)}</p>
          <p className="realms-page-flow">{t(meta.subKey)}</p>
        </div>

        <div className="container realms-detail-layout">
          <section className={`realms-ix-panel realms-ix-panel--${meta.accent}`}>
            {loading ? (
              <p className="realms-fc-empty">{t('realms_fc_loading')}</p>
            ) : realmId === 'tianyu' ? (
              <TianyuRealmBoard features={features} accent={meta.accent} />
            ) : realmId === 'shenyu' ? (
              <ShenyuRealmBoard features={features} accent={meta.accent} />
            ) : realmId === 'jingjie' ? (
              <JingjieRealmBoard features={features} accent={meta.accent} />
            ) : null}
          </section>
        </div>
      </main>
    </RealmsPageShell>
  )
}
