import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { RealmMarkdown } from '../../components/realms/RealmMarkdown'
import { getRealmIllustration } from '../../components/realms/RealmIllustrations'
import type { ResolvedRealmFeatureCard } from '../../data/threeRealmsFeatureUtils'
import { REALM_META, isRealmId } from '../../data/threeRealmsMeta'
import { formatZhDate, relativeZhFromIso } from '../../lib/tianyuFormat'
import { useCnToTwConverter } from '../../hooks/useCnToTwConverter'
import { useI18nRerender } from '../../hooks/useI18nRerender'
import { useLangQuery } from '../../hooks/useLangQuery'
import { useRealmFeatures } from '../../hooks/useRealmFeatures'
import { PATHS, pathToRealm, pathToRealmFeature } from '../../routes/paths'
import { RealmsPageShell } from './RealmsPageShell'

function TianyuBadgeRow({ feature }: { feature: ResolvedRealmFeatureCard }) {
  const { t } = useTranslation()

  const pr = feature.priorityRank
  const sr = feature.statusRank

  let prClass = ''
  let prLabel = ''

  if (pr === 'high') {
    prClass = 'realms-tianyu-badge realms-tianyu-badge--prio realms-tianyu-badge--prio-high'
    prLabel = t('realms_tianyu_prio_high')
  }
  else if (pr === 'medium') {
    prClass = 'realms-tianyu-badge realms-tianyu-badge--prio realms-tianyu-badge--prio-medium'
    prLabel = t('realms_tianyu_prio_medium')
  }
  else if (pr === 'low') {
    prClass = 'realms-tianyu-badge realms-tianyu-badge--prio realms-tianyu-badge--prio-low'
    prLabel = t('realms_tianyu_prio_low')
  }

  let srClass = ''
  let srLabelKey = 'realms_tianyu_stat_unknown'

  if (sr === 'done') {
    srClass = 'realms-tianyu-badge realms-tianyu-badge--stat realms-tianyu-badge--stat-done'
    srLabelKey = 'realms_tianyu_stat_done'
  }
  else if (sr === 'pending') {
    srClass = 'realms-tianyu-badge realms-tianyu-badge--stat realms-tianyu-badge--stat-pending'
    srLabelKey = 'realms_tianyu_stat_pending'
  }
  else if (sr === 'mixed') {
    srClass = 'realms-tianyu-badge realms-tianyu-badge--stat realms-tianyu-badge--stat-mixed'
    srLabelKey = 'realms_tianyu_stat_mixed'
  }

  return (
    <div className="realms-feature-meta-row">
      {prClass ? <span className={prClass}>{prLabel}</span> : null}
      {srClass ? <span className={srClass}>{t(srLabelKey)}</span> : null}
      {feature.requestCanonicalId ? (
        <span className="realms-feature-request-id">{t('realms_tianyu_request_id_label')}: {feature.requestCanonicalId}</span>
      ) : null}
      {typeof feature.iterationCount === 'number' && feature.iterationCount > 1 ? (
        <span className="realms-feature-iters-chip">
          {t('realms_tianyu_merged_iterations', { n: feature.iterationCount })}
        </span>
      ) : null}
    </div>
  )
}

function GithubIconBtn({ href, title }: { href: string, title: string }) {
  const { t } = useTranslation()
  return (
    <a
      href={href}
      title={title}
      target="_blank"
      rel="noopener noreferrer"
      className="realms-feature-gh-icon"
      aria-label={`${t('realms_fc_source')}：${title}`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path fill="currentColor" d="M8 1.2c-3.73 0-6.74 3.06-6.74 6.82 0 3.03 1.93 5.56 4.61 6.46.34.06.46-.14.46-.31 0-.16-.01-.69-.02-1.26-1.77.39-2.14-.86-2.14-.86-.29-.73-.71-.92-.71-.92-.58-.41.05-.41.05-.41.63.05.97.67.97.67.56.97 1.48.69 1.84.53.06-.41.23-.69.41-.84-1.43-.17-2.93-.71-2.93-3.21 0-.71.25-1.29.67-1.74-.06-.17-.29-.84.06-1.76 0 0 .55-.17 1.79.67a6.06 6.06 0 0 1 1.94-.26c.66 0 1.33.08 1.94.26 1.24-.83 1.79-.67 1.79-.67.35.92.13 1.59.06 1.76.42.46.67 1.05.67 1.74 0 2.53-1.52 3.06-2.94 3.22.23.21.43.61.43 1.23 0 .89-.01 1.6-.01 1.82 0 .18.12.39.46.31a6.71 6.71 0 0 0 4.61-6.46C14.73 4.26 11.71 1.2 8 1.2z" />
      </svg>
    </a>
  )
}

/** Find features with overlapping tags */
function findRelatedFeatures(
  current: ResolvedRealmFeatureCard,
  all: ResolvedRealmFeatureCard[],
  max = 4,
): ResolvedRealmFeatureCard[] {
  if (current.tags.length === 0) return []
  const currentTags = new Set(current.tags.map((t) => t.toLowerCase()))
  const scored = all
    .filter((c) => c.slug !== current.slug)
    .map((c) => {
      const overlap = c.tags.filter((t) => currentTags.has(t.toLowerCase())).length
      return { card: c, score: overlap }
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
  return scored.slice(0, max).map((s) => s.card)
}

/** Iteration timeline for interaction cards */
function IterationTimeline({ feature, convert }: { feature: ResolvedRealmFeatureCard; convert: (s: string) => string }) {
  const { t } = useTranslation()
  const iters = feature.interactionIterations ?? []
  if (iters.length === 0) return null

  return (
    <div className="realms-tianyu-detail-iters">
      <h3>{t('realms_tianyu_iteration_links')}</h3>
      <ol className="realms-iter-timeline">
        {iters.map((it) => {
          const rel = relativeZhFromIso(it.createdAt)
          return (
            <li key={it.sourceSlug} className="realms-iter-timeline-item">
              <span className="realms-iter-timeline-dot">{it.ordinal}</span>
              <div className="realms-iter-timeline-content">
                <a
                  className="realms-iter-timeline-link"
                  href={it.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('realms_tianyu_iteration_round', { n: it.ordinal })}
                </a>
                <div className="realms-iter-timeline-meta">
                  {it.createdAt ? (
                    <>
                      {formatZhDate(it.createdAt)}
                      {rel ? `（${rel}）` : ''}
                    </>
                  ) : null}
                  {it.statusHint ? <> · {convert(it.statusHint)}</> : null}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
      <p className="realms-tianyu-iter-note">{t('realms_tianyu_iteration_note')}</p>
    </div>
  )
}

export function RealmFeaturePage() {
  const { t } = useTranslation()
  useI18nRerender()
  const { realmId, featureSlug } = useParams()
  const navigate = useNavigate()
  const langSearch = useLangQuery()

  if (!isRealmId(realmId)) {
    return <Navigate to={PATHS.realmsIndex} replace />
  }

  const { features, loading } = useRealmFeatures(realmId)
  const feature = featureSlug ? features.find((card) => card.slug === featureSlug) : undefined
  const meta = REALM_META[realmId]
  const { convert } = useCnToTwConverter()
  const RealmIllustration = getRealmIllustration(realmId)

  // Current feature index for keyboard nav
  const currentIndex = featureSlug ? features.findIndex((c) => c.slug === featureSlug) : -1
  const prevFeature = currentIndex > 0 ? features[currentIndex - 1] : null
  const nextFeature = currentIndex >= 0 && currentIndex < features.length - 1 ? features[currentIndex + 1] : null

  // Related features
  const related = useMemo(
    () => (feature ? findRelatedFeatures(feature, features) : []),
    [feature, features],
  )

  const display = useMemo(() => {
    if (!feature) return null
    return {
      title: convert(feature.title),
      summary: convert(feature.summary),
      bullets: feature.bullets.map((b) => convert(b)),
      tags: feature.tags.map((tag) => convert(tag)),
    }
  }, [convert, feature])

  // Keyboard navigation: ← →
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowLeft' && prevFeature) {
        e.preventDefault()
        navigate({ pathname: pathToRealmFeature(realmId, prevFeature.slug), search: langSearch })
      } else if (e.key === 'ArrowRight' && nextFeature) {
        e.preventDefault()
        navigate({ pathname: pathToRealmFeature(realmId, nextFeature.slug), search: langSearch })
      }
    },
    [prevFeature, nextFeature, realmId, navigate, langSearch],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (!feature || loading) return undefined
    const prev = typeof document !== 'undefined' ? document.title : ''
    const tabTitle = display?.title ?? feature.title
    document.title = t('realms_feature_browser_title', { title: tabTitle, realm: t(meta.titleKey) })
    return () => {
      document.title = prev || t('realms_page_title')
    }
  }, [display?.title, feature, loading, meta.titleKey, t])

  if (loading) {
    return (
      <RealmsPageShell>
        <main className="realms-page-main" id="realms-feature-page">
          <div className={`container realms-feature-hero realms-feature-hero--${meta.accent}`}>
            <Link className="realms-back-link" to={pathToRealm(realmId)}>
              <span className="ui-chevron-right realms-back-chevron" aria-hidden="true" />
              {t('realms_back_realm', { realm: t(meta.titleKey) })}
            </Link>
            <p className="section-label">{t(meta.titleKey)}</p>
            <h1 className="realms-page-title">{t('realms_fc_loading')}</h1>
          </div>
        </main>
      </RealmsPageShell>
    )
  }

  if (!feature) {
    return <Navigate to={pathToRealm(realmId)} replace />
  }

  if (!display) return null

  return (
    <RealmsPageShell>
      <main className="realms-page-main" id="realms-feature-page">
        <div className={`container realms-feature-hero realms-feature-hero--${meta.accent}`}>
          <nav className="realms-breadcrumb" aria-label={t('realms_breadcrumb_aria')}>
            <Link className="realms-bc-link" to={PATHS.realmsIndex}>{t('realms_index_short')}</Link>
            <span className="realms-bc-sep" aria-hidden="true">/</span>
            <Link className="realms-bc-link" to={pathToRealm(realmId)}>{t(meta.titleKey)}</Link>
            <span className="realms-bc-sep" aria-hidden="true">/</span>
            <span className="realms-bc-current">{display.title.slice(0, 48)}{display.title.length > 48 ? '…' : ''}</span>
          </nav>

          <Link className="realms-back-link" to={pathToRealm(realmId)}>
            <span className="ui-chevron-right realms-back-chevron" aria-hidden="true" />
            {t('realms_back_realm', { realm: t(meta.titleKey) })}
          </Link>

          {RealmIllustration ? (
            <div className="realms-feature-hero-illustration">
              <RealmIllustration className={`realms-ix-illustration realms-ix-illustration--${meta.accent}`} size={56} />
            </div>
          ) : null}

          <p className="section-label">{t(meta.titleKey)}</p>
          <h1 className="realms-page-title">{display.title}</h1>
          <p className="realms-page-lead">{display.summary}</p>

          {realmId === 'tianyu' ? <TianyuBadgeRow feature={feature} /> : null}

          <div className="realms-fc-tags realms-feature-tags">
            {display.tags.map((tag) => (
              <span key={tag} className="realms-fc-tag">{tag}</span>
            ))}
          </div>

          <div className="realms-feature-src-row">
            <GithubIconBtn href={feature.sourceUrl} title={feature.sourcePath} />
            <span className="realms-feature-src-tip" title={feature.sourceUrl}>
              {t('realms_tianyu_source_hover_tip')}
            </span>
          </div>
        </div>

        <div className="container realms-feature-layout">
          <aside className={`realms-feature-summary realms-feature-summary--${meta.accent}`}>
            <h2>{t('realms_feature_summary')}</h2>
            {feature.bullets.length > 0 ? (
              <ul>
                {display.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : (
              <p>{display.summary}</p>
            )}
            <IterationTimeline feature={feature} convert={convert} />
          </aside>
          <article className="realms-feature-body">
            <h2>{t('realms_feature_markdown')}</h2>
            <RealmMarkdown markdown={feature.bodyMarkdown} textTransform={convert} showToc />
          </article>
        </div>

        {/* Keyboard navigation */}
        <div className="container">
          <nav className="realms-feature-kb-nav" aria-label={t('realms_feature_kb_nav_aria')}>
            {prevFeature ? (
              <Link
                className="realms-feature-kb-btn"
                to={{ pathname: pathToRealmFeature(realmId, prevFeature.slug), search: langSearch }}
              >
                <span aria-hidden="true">←</span>
                {convert(prevFeature.title).slice(0, 32)}{convert(prevFeature.title).length > 32 ? '…' : ''}
              </Link>
            ) : <span />}
            <span className="realms-feature-kb-hint">{t('realms_feature_kb_hint')}</span>
            {nextFeature ? (
              <Link
                className="realms-feature-kb-btn"
                to={{ pathname: pathToRealmFeature(realmId, nextFeature.slug), search: langSearch }}
              >
                {convert(nextFeature.title).slice(0, 32)}{convert(nextFeature.title).length > 32 ? '…' : ''}
                <span aria-hidden="true">→</span>
              </Link>
            ) : <span />}
          </nav>
        </div>

        {/* Related features */}
        {related.length > 0 ? (
          <div className="container realms-related-section">
            <h2 className="realms-related-heading">{t('realms_related_heading')}</h2>
            <div className="realms-related-grid">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  className={`realms-index-card realms-index-card--${meta.accent}`}
                  to={{ pathname: pathToRealmFeature(realmId, rel.slug), search: langSearch }}
                >
                  <h5 className="realms-fc-title">{convert(rel.title)}</h5>
                  <p className="realms-fc-summary">{convert(rel.summary)}</p>
                  {rel.tags.length > 0 ? (
                    <div className="realms-fc-tags">
                      {rel.tags.map((tag) => (
                        <span key={tag} className="realms-fc-tag">{convert(tag)}</span>
                      ))}
                    </div>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </main>
    </RealmsPageShell>
  )
}
