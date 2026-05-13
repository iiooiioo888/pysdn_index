import { useTranslation } from 'react-i18next'
import { Link, Navigate, useParams } from 'react-router-dom'
import { RealmFeatureCardLink } from '../../components/ThreeRealmsInteractive'
import { REALM_META, isRealmId } from '../../data/threeRealmsMeta'
import { resolveRealmFeatures } from '../../data/threeRealmsFeatureUtils'
import { useI18nRerender } from '../../hooks/useI18nRerender'
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
  const features = resolveRealmFeatures(realmId)

  return (
    <RealmsPageShell>
      <main className="realms-page-main" id="realms-page">
        <div className={`container realms-page-hero realms-page-hero--${meta.accent}`}>
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
            <div className="realms-ix-highlights">
              <h2 className="realms-ix-highlights-label">{t('realms_fc_heading')}</h2>
              <div className="realms-fc-grid realms-fc-grid--wide">
                {features.map((card) => (
                  <RealmFeatureCardLink
                    key={card.slug}
                    card={card}
                    accent={meta.accent}
                    detailLabel={t('realms_fc_detail')}
                    sourceLabel={t('realms_fc_source')}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </RealmsPageShell>
  )
}
