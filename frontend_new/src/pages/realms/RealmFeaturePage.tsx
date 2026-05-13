import { useTranslation } from 'react-i18next'
import { Link, Navigate, useParams } from 'react-router-dom'
import { RealmMarkdown } from '../../components/realms/RealmMarkdown'
import { REALM_META, isRealmId } from '../../data/threeRealmsMeta'
import { findRealmFeature } from '../../data/threeRealmsFeatureUtils'
import { useI18nRerender } from '../../hooks/useI18nRerender'
import { PATHS, pathToRealm } from '../../routes/paths'
import { RealmsPageShell } from './RealmsPageShell'

export function RealmFeaturePage() {
  const { t } = useTranslation()
  useI18nRerender()
  const { realmId, featureSlug } = useParams()

  if (!isRealmId(realmId)) {
    return <Navigate to={PATHS.realmsIndex} replace />
  }

  const feature = featureSlug ? findRealmFeature(realmId, featureSlug) : undefined
  if (!feature) {
    return <Navigate to={pathToRealm(realmId)} replace />
  }

  const meta = REALM_META[realmId]

  return (
    <RealmsPageShell>
      <main className="realms-page-main" id="realms-feature-page">
        <div className={`container realms-feature-hero realms-feature-hero--${meta.accent}`}>
          <Link className="realms-back-link" to={pathToRealm(realmId)}>
            <span className="ui-chevron-right realms-back-chevron" aria-hidden="true" />
            {t('realms_back_realm', { realm: t(meta.titleKey) })}
          </Link>
          <p className="section-label">{t(meta.titleKey)}</p>
          <h1 className="realms-page-title">{feature.title}</h1>
          <p className="realms-page-lead">{feature.summary}</p>
          <div className="realms-fc-tags realms-feature-tags">
            {feature.tags.map((tag) => (
              <span key={tag} className="realms-fc-tag">{tag}</span>
            ))}
          </div>
          <div className="realms-ix-actions">
            <a className="realms-ix-link realms-ix-link--ghost" href={feature.sourceUrl} target="_blank" rel="noopener noreferrer">
              {t('realms_fc_source')}
              <span className="ui-chevron-right" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="container realms-feature-layout">
          <aside className={`realms-feature-summary realms-feature-summary--${meta.accent}`}>
            <h2>{t('realms_feature_summary')}</h2>
            {feature.bullets.length > 0 ? (
              <ul>
                {feature.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : (
              <p>{feature.summary}</p>
            )}
          </aside>
          <article className="realms-feature-body">
            <h2>{t('realms_feature_markdown')}</h2>
            <RealmMarkdown markdown={feature.bodyMarkdown} />
          </article>
        </div>
      </main>
    </RealmsPageShell>
  )
}
