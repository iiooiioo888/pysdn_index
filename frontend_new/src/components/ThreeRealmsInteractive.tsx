import { useCallback, useEffect, useId, useMemo, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import { resolveRealmFeatures, type ResolvedRealmFeatureCard } from '../data/threeRealmsFeatureUtils'
import { REALM_META, REALM_ORDER, type RealmAccent } from '../data/threeRealmsMeta'
import type { RealmId } from '../data/threeRealmsFeatures'
import { useI18nRerender } from '../hooks/useI18nRerender'
import { useLangQuery } from '../hooks/useLangQuery'
import { PATHS, pathToRealm, pathToRealmFeature } from '../routes/paths'
import { prefersReducedMotion } from '../lib/motionPreference'

const NOTE_REPO = 'https://github.com/iiooiioo888/Note'

/** How many cards to show in embedded (homepage) mode */
const EMBEDDED_CARD_LIMIT = 4

type Layout = 'embedded' | 'standalone'

export type ThreeRealmsInteractiveProps = {
  layout: Layout
  /** 首頁嵌入時顯示前往完整資訊頁的連結 */
  showFullPageLink?: boolean
}

function readPoints(t: (key: string, opts?: { returnObjects?: boolean }) => unknown, pointsKey: string): string[] {
  const raw = t(pointsKey, { returnObjects: true })
  return Array.isArray(raw) ? raw.filter((x): x is string => typeof x === 'string') : []
}

export function RealmFeatureCardLink({
  card,
  accent,
  sourceLabel,
  detailLabel,
}: {
  card: ResolvedRealmFeatureCard
  accent: RealmAccent
  sourceLabel: string
  detailLabel: string
}) {
  return (
    <article className={`realms-fc realms-fc--${accent}`}>
      <h5 className="realms-fc-title">
        <Link to={pathToRealmFeature(card.realmId, card.slug)}>{card.title}</Link>
      </h5>
      <p className="realms-fc-summary">{card.summary}</p>
      {card.bullets.length > 0 ? (
        <ul className="realms-fc-bullets">
          {card.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      ) : null}
      {card.tags.length > 0 ? (
        <div className="realms-fc-tags">
          {card.tags.map((tag) => (
            <span key={tag} className="realms-fc-tag">{tag}</span>
          ))}
        </div>
      ) : null}
      <Link className="realms-fc-detail" to={pathToRealmFeature(card.realmId, card.slug)}>
        {detailLabel}
        <span className="ui-chevron-right" aria-hidden="true" />
      </Link>
      <a
        className="realms-fc-source"
        href={card.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${sourceLabel}: ${card.sourcePath}`}
      >
        <span>{sourceLabel}</span>
        <span className="realms-fc-source-path">{card.sourcePath}</span>
        <span className="ui-chevron-right" aria-hidden="true" />
      </a>
    </article>
  )
}

export function ThreeRealmsInteractive({ layout, showFullPageLink }: ThreeRealmsInteractiveProps) {
  const { t } = useTranslation()
  useI18nRerender()
  const langSearch = useLangQuery()
  const [searchParams, setSearchParams] = useSearchParams()
  const reduceMotion = prefersReducedMotion()
  const baseId = useId()

  const [idx, setIdx] = useState(0)
  const realmId = REALM_ORDER[idx]
  const meta = REALM_META[realmId]

  const allCards = useMemo(() => resolveRealmFeatures(realmId), [realmId])
  const visibleCards = layout === 'embedded' ? allCards.slice(0, EMBEDDED_CARD_LIMIT) : allCards
  const hasMore = layout === 'embedded' && allCards.length > EMBEDDED_CARD_LIMIT

  useEffect(() => {
    if (layout !== 'standalone') return
    const r = searchParams.get('realm')
    if (r && REALM_ORDER.includes(r as RealmId)) {
      const next = REALM_ORDER.indexOf(r as RealmId)
      setIdx((prev) => (prev === next ? prev : next))
    }
  }, [layout, searchParams])

  const selectRealm = useCallback(
    (i: number) => {
      const n = REALM_ORDER.length
      const wrapped = ((i % n) + n) % n
      setIdx(wrapped)
      if (layout === 'standalone') {
        setSearchParams({ realm: REALM_ORDER[wrapped] }, { replace: true })
      }
    },
    [layout, setSearchParams],
  )

  const onTabListKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      selectRealm((idx + 1) % REALM_ORDER.length)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      selectRealm((idx + REALM_ORDER.length - 1) % REALM_ORDER.length)
    } else if (e.key === 'Home') {
      e.preventDefault()
      selectRealm(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      selectRealm(REALM_ORDER.length - 1)
    }
  }

  const points = readPoints(t, meta.pointsKey)

  return (
    <div className={`realms-ix realms-ix--${layout}`}>
      <div className="realms-ix-toolbar">
        <div
          className="realms-ix-flow"
          role="tablist"
          aria-label={t('realms_ix_flow_aria')}
          onKeyDown={onTabListKeyDown}
        >
          {REALM_ORDER.map((id, i) => {
            const m = REALM_META[id]
            const active = i === idx
            return (
              <div key={id} className="realms-ix-flow-cell">
                {i > 0 ? <span className="realms-ix-connector" aria-hidden="true" /> : null}
                {active ? (
                  <button
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${id}`}
                    className={`realms-ix-tab realms-ix-tab--${m.accent} realms-ix-tab--active`}
                    aria-selected="true"
                    aria-controls={`${baseId}-panel`}
                    tabIndex={0}
                    onClick={() => selectRealm(i)}
                  >
                    <span className="realms-ix-tab-step">{t('realms_ix_step', { n: i + 1 })}</span>
                    <span className="realms-ix-tab-title">{t(m.titleKey)}</span>
                    <span className="realms-ix-tab-sub">{t(m.subKey)}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${id}`}
                    className={`realms-ix-tab realms-ix-tab--${m.accent}`}
                    aria-selected="false"
                    aria-controls={`${baseId}-panel`}
                    tabIndex={-1}
                    onClick={() => selectRealm(i)}
                  >
                    <span className="realms-ix-tab-step">{t('realms_ix_step', { n: i + 1 })}</span>
                    <span className="realms-ix-tab-title">{t(m.titleKey)}</span>
                    <span className="realms-ix-tab-sub">{t(m.subKey)}</span>
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <div className="realms-ix-nav">
          <button type="button" className="realms-ix-arrow" onClick={() => selectRealm(idx - 1)} aria-label={t('realms_ix_prev')}>
            <span className="realms-ix-arrow-inner" aria-hidden="true">‹</span>
          </button>
          <button type="button" className="realms-ix-arrow" onClick={() => selectRealm(idx + 1)} aria-label={t('realms_ix_next')}>
            <span className="realms-ix-arrow-inner" aria-hidden="true">›</span>
          </button>
        </div>
      </div>

      <p className="realms-ix-hint">{t('realms_ix_keyboard')}</p>

      <div
        key={realmId}
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${realmId}`}
        className={`realms-ix-panel realms-ix-panel--${meta.accent} ${reduceMotion ? 'realms-ix-panel--reduce' : ''}`}
      >
        <div className="realms-ix-panel-head">
          <h3 className="realms-ix-panel-title">{t(meta.titleKey)}</h3>
          <p className="realms-ix-panel-sub">{t(meta.subKey)}</p>
        </div>
        <p className="realms-ix-panel-desc">{t(meta.descKey)}</p>
        <div className="realms-ix-highlights">
          <h4 className="realms-ix-highlights-label">{t('realms_ix_highlights')}</h4>
          <ul className="realms-ix-points">
            {points.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        {visibleCards.length > 0 ? (
          <div className="realms-fc-section">
            <h4 className="realms-fc-heading">{t('realms_fc_heading')}</h4>
            <div className="realms-fc-grid">
              {visibleCards.map((card) => (
                <RealmFeatureCardLink
                  key={card.slug}
                  card={card}
                  accent={meta.accent}
                  detailLabel={t('realms_fc_detail')}
                  sourceLabel={t('realms_fc_source')}
                />
              ))}
            </div>
            {hasMore ? (
              <Link className="realms-fc-more" to={{ pathname: pathToRealm(realmId), search: langSearch }}>
                {t('realms_fc_more', { count: allCards.length })}
                <span className="ui-chevron-right" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        ) : (
          <p className="realms-fc-empty">{t('realms_fc_empty')}</p>
        )}

        <div className="realms-ix-actions">
          <a className="realms-ix-folder-link" href={meta.folderTreeUrl} target="_blank" rel="noopener noreferrer">
            {t(meta.folderLabelKey)}
          </a>
        </div>
      </div>

      <div className="realms-ix-actions">
        {showFullPageLink ? (
          <Link className="realms-ix-link realms-ix-link--primary" to={{ pathname: PATHS.realms, search: langSearch }}>
            {t('realms_ix_full_page')}
            <span className="ui-chevron-right" aria-hidden="true" />
          </Link>
        ) : null}
        <a
          className="realms-ix-link realms-ix-link--ghost"
          href={NOTE_REPO}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('realms_github_aria')}
        >
          {t('realms_ix_repo')}
          <span className="ui-chevron-right" aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
