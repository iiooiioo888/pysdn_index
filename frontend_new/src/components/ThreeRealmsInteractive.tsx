import { useCallback, useEffect, useId, useMemo, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import type { ResolvedRealmFeatureCard } from '../data/threeRealmsFeatureUtils'
import { REALM_META, REALM_ORDER, type RealmAccent } from '../data/threeRealmsMeta'
import type { RealmId } from '../data/threeRealmsFeatures'
import { useI18nRerender } from '../hooks/useI18nRerender'
import { useCnToTwConverter } from '../hooks/useCnToTwConverter'
import { useLangQuery } from '../hooks/useLangQuery'
import { useRealmFeatures } from '../hooks/useRealmFeatures'
import { PATHS, pathToRealm, pathToRealmFeature } from '../routes/paths'
import { prefersReducedMotion } from '../lib/motionPreference'
import { getRealmIllustration } from './realms/RealmIllustrations'

/** 三界 Markdown 來源在目錄 `content/note-realms/`（對應本倉 GitHub 樹） */
const THREE_REALMS_SOURCE_TREE_ON_GITHUB =
  'https://github.com/iiooiioo888/pysdn_index/tree/main/frontend_new/content/note-realms'

/** How many cards to show in embedded (homepage) mode */
const EMBEDDED_CARD_LIMIT = 4

/** Kind icon SVGs for tianyu card kinds */
const KIND_ICONS: Record<string, string> = {
  conclusion: '📋',
  interaction: '💬',
  task: '⚡',
  knowledge: '📖',
  doc: '📄',
}

/** Border accent class per kind */
const KIND_BORDER_CLASS: Record<string, string> = {
  conclusion: 'realms-fc--kind-conclusion',
  interaction: 'realms-fc--kind-interaction',
  task: 'realms-fc--kind-task',
  knowledge: 'realms-fc--kind-knowledge',
  doc: 'realms-fc--kind-doc',
}

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
  kindLabelMap,
}: {
  card: ResolvedRealmFeatureCard
  accent: RealmAccent
  sourceLabel: string
  detailLabel: string
  kindLabelMap?: Record<string, string>
}) {
  const { convert } = useCnToTwConverter()
  const langSearch = useLangQuery()
  const featureTo = {
    pathname: pathToRealmFeature(card.realmId, card.slug),
    search: langSearch,
  }
  const kind = card.tianyuKind
  const kindIcon = kind ? KIND_ICONS[kind] : null
  const kindLabel = kind && kindLabelMap ? kindLabelMap[kind] : null
  const kindBorder = kind ? KIND_BORDER_CLASS[kind] : null
  const firstBullet = card.bullets.length > 0 ? convert(card.bullets[0]) : null

  return (
    <article className={`realms-fc realms-fc--${accent}${kindBorder ? ` ${kindBorder}` : ''}`}>
      <div className="realms-fc-header">
        {kindIcon ? <span className="realms-fc-kind-icon" aria-hidden="true">{kindIcon}</span> : null}
        <h5 className="realms-fc-title">
          <Link to={featureTo}>{convert(card.title)}</Link>
        </h5>
      </div>
      {kindLabel ? (
        <span className={`realms-fc-kind-badge realms-fc-kind-badge--${kind}`}>{kindLabel}</span>
      ) : null}
      {firstBullet ? (
        <p className="realms-fc-preview">{firstBullet}</p>
      ) : (
        <p className="realms-fc-summary">{convert(card.summary)}</p>
      )}
      {card.tags.length > 0 ? (
        <div className="realms-fc-tags">
          {card.tags.map((tag) => (
            <span key={tag} className={`realms-fc-tag realms-fc-tag--${accent}`}>{convert(tag)}</span>
          ))}
        </div>
      ) : null}
      <Link className="realms-fc-detail" to={featureTo}>
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
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const reduceMotion = prefersReducedMotion()
  const baseId = useId()

  const [idx, setIdx] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const realmId = REALM_ORDER[idx]
  const meta = REALM_META[realmId]

  const { features: allCards, loading } = useRealmFeatures(realmId)

  // Kind label map for tianyu
  const kindLabelMap = useMemo(() => ({
    conclusion: t('realms_kind_conclusion'),
    interaction: t('realms_kind_interaction'),
    task: t('realms_kind_task'),
    knowledge: t('realms_kind_knowledge'),
    doc: t('realms_kind_doc'),
  }), [t])

  // Kind stats
  const kindStats = useMemo(() => {
    if (realmId !== 'tianyu') return null
    const counts: Record<string, number> = {}
    for (const card of allCards) {
      const k = card.tianyuKind || 'doc'
      counts[k] = (counts[k] || 0) + 1
    }
    return counts
  }, [allCards, realmId])

  // Search/filter
  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return allCards
    const q = searchQuery.toLowerCase()
    return allCards.filter((card) =>
      card.title.toLowerCase().includes(q)
      || card.summary.toLowerCase().includes(q)
      || card.tags.some((tag) => tag.toLowerCase().includes(q))
      || (card.tianyuKind && card.tianyuKind.toLowerCase().includes(q))
    )
  }, [allCards, searchQuery])

  const visibleCards = layout === 'embedded'
    ? filteredCards.slice(0, EMBEDDED_CARD_LIMIT)
    : filteredCards
  const hasMore = layout === 'embedded' && filteredCards.length > EMBEDDED_CARD_LIMIT

  // Realm illustration
  const RealmIllustration = getRealmIllustration(realmId)

  useEffect(() => {
    if (layout !== 'standalone') return
    const r = searchParams.get('realm')
    if (r && REALM_ORDER.includes(r as RealmId)) {
      const next = REALM_ORDER.indexOf(r as RealmId)
      setIdx((prev) => (prev === next ? prev : next))
    }
  }, [layout, searchParams])

  // Reset search when realm changes
  useEffect(() => {
    setSearchQuery('')
  }, [realmId])

  const selectRealm = useCallback(
    (i: number) => {
      const n = REALM_ORDER.length
      const wrapped = ((i % n) + n) % n
      setIdx(wrapped)
      if (layout === 'standalone') {
        const id = REALM_ORDER[wrapped]
        navigate({ pathname: pathToRealm(id), search: langSearch })
      }
    },
    [layout, navigate, langSearch],
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
            const realmPath = { pathname: pathToRealm(id), search: langSearch }
            const tabInner = (
              <>
                <span className="realms-ix-tab-step">{t('realms_ix_step', { n: i + 1 })}</span>
                <span className="realms-ix-tab-title">{t(m.titleKey)}</span>
                <span className="realms-ix-tab-sub">{t(m.subKey)}</span>
              </>
            )
            const tabClassName = `realms-ix-tab realms-ix-tab--${m.accent}${active ? ' realms-ix-tab--active' : ''}`
            return (
              <div key={id} className="realms-ix-flow-cell">
                {i > 0 ? <span className="realms-ix-connector" aria-hidden="true" /> : null}
                {layout === 'standalone' ? (
                  <Link
                    role="tab"
                    id={`${baseId}-tab-${id}`}
                    className={tabClassName}
                    to={realmPath}
                    aria-selected={active}
                    aria-controls={`${baseId}-panel`}
                    tabIndex={active ? 0 : -1}
                  >
                    {tabInner}
                  </Link>
                ) : active ? (
                  <button
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${id}`}
                    className={tabClassName}
                    aria-selected="true"
                    aria-controls={`${baseId}-panel`}
                    tabIndex={0}
                    onClick={() => selectRealm(i)}
                  >
                    {tabInner}
                  </button>
                ) : (
                  <button
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${id}`}
                    className={tabClassName}
                    aria-selected="false"
                    aria-controls={`${baseId}-panel`}
                    tabIndex={-1}
                    onClick={() => selectRealm(i)}
                  >
                    {tabInner}
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
          <div className="realms-ix-panel-title-row">
            {RealmIllustration ? <RealmIllustration className={`realms-ix-illustration realms-ix-illustration--${meta.accent}`} size={48} /> : null}
            <div>
              <h3 className="realms-ix-panel-title">{t(meta.titleKey)}</h3>
              <p className="realms-ix-panel-sub">{t(meta.subKey)}</p>
            </div>
          </div>
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

        {loading ? (
          <p className="realms-fc-empty">{t('realms_fc_loading')}</p>
        ) : allCards.length > 0 ? (
          <div className="realms-fc-section">
            <div className="realms-fc-section-header">
              <h4 className="realms-fc-heading">{t('realms_fc_heading')}</h4>
              <div className="realms-fc-search">
                <input
                  type="text"
                  className="realms-fc-search-input"
                  placeholder={t('realms_fc_search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label={t('realms_fc_search_aria')}
                />
                {searchQuery ? (
                  <button
                    type="button"
                    className="realms-fc-search-clear"
                    onClick={() => setSearchQuery('')}
                    aria-label={t('realms_fc_search_clear')}
                  >
                    ✕
                  </button>
                ) : null}
              </div>
            </div>

            {kindStats ? (
              <div className="realms-fc-kind-stats">
                {Object.entries(kindStats).map(([kind, count]) => (
                  <span key={kind} className={`realms-fc-kind-stat realms-fc-kind-stat--${kind}`}>
                    <span className="realms-fc-kind-stat-icon">{(KIND_ICONS as Record<string, string>)[kind] || '📄'}</span>
                    <span className="realms-fc-kind-stat-label">{(kindLabelMap as Record<string, string>)[kind] || kind}</span>
                    <span className="realms-fc-kind-stat-count">{count}</span>
                  </span>
                ))}
              </div>
            ) : null}

            {visibleCards.length > 0 ? (
              <div className="realms-fc-grid">
                {visibleCards.map((card) => (
                  <RealmFeatureCardLink
                    key={card.slug}
                    card={card}
                    accent={meta.accent}
                    detailLabel={t('realms_fc_detail')}
                    sourceLabel={t('realms_fc_source')}
                    kindLabelMap={kindLabelMap}
                  />
                ))}
              </div>
            ) : (
              <p className="realms-fc-empty">{t('realms_fc_no_results')}</p>
            )}

            {hasMore ? (
              <Link className="realms-fc-more" to={{ pathname: pathToRealm(realmId), search: langSearch }}>
                {t('realms_fc_more', { count: filteredCards.length })}
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
          href={THREE_REALMS_SOURCE_TREE_ON_GITHUB}
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
