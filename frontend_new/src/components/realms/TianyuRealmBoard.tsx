import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { ResolvedRealmFeatureCard } from '../../data/threeRealmsFeatureUtils'
import type { RealmAccent } from '../../data/threeRealmsMeta'
import type { TianyuCardKind, TianyuTopicClusterId } from '../../data/threeRealmsFeatures'
import { useCnToTwConverter } from '../../hooks/useCnToTwConverter'
import { useLangQuery } from '../../hooks/useLangQuery'
import { relativeZhFromIso } from '../../lib/tianyuFormat'
import { pathToRealmFeature } from '../../routes/paths'

type TabKey = 'conclusions' | 'interactions' | 'library' | 'all'

function tabFromKind(kind: TianyuCardKind | undefined): TabKey {
  if (kind === 'conclusion') return 'conclusions'
  if (kind === 'interaction') return 'interactions'
  return 'library'
}

function GithubGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 1.2c-3.73 0-6.74 3.06-6.74 6.82 0 3.03 1.93 5.56 4.61 6.46.34.06.46-.14.46-.31 0-.16-.01-.69-.02-1.26-1.77.39-2.14-.86-2.14-.86-.29-.73-.71-.92-.71-.92-.58-.41.05-.41.05-.41.63.05.97.67.97.67.56.97 1.48.69 1.84.53.06-.41.23-.69.41-.84-1.43-.17-2.93-.71-2.93-3.21 0-.71.25-1.29.67-1.74-.06-.17-.29-.84.06-1.76 0 0 .55-.17 1.79.67a6.06 6.06 0 0 1 1.94-.26c.66 0 1.33.08 1.94.26 1.24-.83 1.79-.67 1.79-.67.35.92.13 1.59.06 1.76.42.46.67 1.05.67 1.74 0 2.53-1.52 3.06-2.94 3.22.23.21.43.61.43 1.23 0 .89-.01 1.6-.01 1.82 0 .18.12.39.46.31a6.71 6.71 0 0 0 4.61-6.46C14.73 4.26 11.71 1.2 8 1.2z"
      />
    </svg>
  )
}

function PriorityBadge({
  rank,
}: {
  rank: NonNullable<ResolvedRealmFeatureCard['priorityRank']>
}) {
  const { t } = useTranslation()
  const tone = rank === 'high' ? 'high' : rank === 'medium' ? 'medium' : 'low'
  return (
    <span className={`realms-tianyu-badge realms-tianyu-badge--prio realms-tianyu-badge--prio-${tone}`}>
      {rank === 'high' ? t('realms_tianyu_prio_high') : rank === 'medium' ? t('realms_tianyu_prio_medium') : t('realms_tianyu_prio_low')}
    </span>
  )
}

function StatusBadge({
  rank,
}: {
  rank: NonNullable<ResolvedRealmFeatureCard['statusRank']>
}) {
  const { t } = useTranslation()
  const tone =
    rank === 'done' ? 'done' : rank === 'pending' ? 'pending' : rank === 'mixed' ? 'mixed' : 'unknown'
  let labelKey = 'realms_tianyu_stat_unknown'
  if (rank === 'done') labelKey = 'realms_tianyu_stat_done'
  else if (rank === 'pending') labelKey = 'realms_tianyu_stat_pending'
  else if (rank === 'mixed') labelKey = 'realms_tianyu_stat_mixed'
  return (
    <span className={`realms-tianyu-badge realms-tianyu-badge--stat realms-tianyu-badge--stat-${tone}`}>
      {t(labelKey)}
    </span>
  )
}

function topicI18nKey(cluster: TianyuTopicClusterId | string | undefined): string {
  if (!cluster || cluster === 'general') return 'realms_tianyu_topic_general'
  return `realms_tianyu_topic_${cluster}`
}

function shouldEmitTopicHeading(tab: TabKey, cardKind: TianyuCardKind | undefined): boolean {
  if (tab === 'conclusions') return true
  if (tab === 'all') return cardKind === 'conclusion'
  return false
}

type ClusterRow = { clusterKey: string, card: ResolvedRealmFeatureCard }

type DisplayPiece =
  | { kind: 'cluster'; clusterKey: string; label: string }
  | { kind: 'row'; cards: ResolvedRealmFeatureCard[] }

function buildDisplayPieces(
  rows: ClusterRow[],
  cols: number,
  tab: TabKey,
  t: (k: string) => string,
): DisplayPiece[] {
  const pieces: DisplayPiece[] = []
  let prevCluster = ''
  let buffer: ResolvedRealmFeatureCard[] = []

  const flushFullRows = () => {
    while (buffer.length >= cols) {
      pieces.push({ kind: 'row', cards: buffer.slice(0, cols) })
      buffer = buffer.slice(cols)
    }
  }

  for (const { clusterKey, card } of rows) {
    if (clusterKey !== prevCluster) {
      if (buffer.length > 0) {
        pieces.push({ kind: 'row', cards: [...buffer] })
        buffer = []
      }
      if (shouldEmitTopicHeading(tab, card.tianyuKind)) {
        pieces.push({
          kind: 'cluster',
          clusterKey,
          label: t(topicI18nKey(clusterKey)),
        })
      }
      prevCluster = clusterKey
    }
    buffer.push(card)
    flushFullRows()
  }
  if (buffer.length > 0) pieces.push({ kind: 'row', cards: buffer })
  return pieces
}

function colsFromWidth(width: number): number {
  if (width >= 1280) return 3
  if (width >= 900) return 2
  return 1
}

function TianyuCard({
  card,
  accent,
  convert,
}: {
  card: ResolvedRealmFeatureCard
  accent: RealmAccent
  convert: (s: string) => string
}) {
  const { t } = useTranslation()
  const lang = useLangQuery()
  const itLen = card.interactionIterations?.length ?? 0
  const tail = itLen ? card.interactionIterations?.[itLen - 1] : undefined
  const when = relativeZhFromIso(tail?.createdAt ?? undefined)

  const title = convert(card.title)
  const summary = convert(card.summary)

  return (
    <article className={`realms-tianyu-card realms-tianyu-card--${accent}`}>
      <div className="realms-tianyu-card-top">
        <div className="realms-tianyu-meta">
          {card.priorityRank ? <PriorityBadge rank={card.priorityRank} /> : null}
          {card.statusRank ? <StatusBadge rank={card.statusRank} /> : null}
          {typeof card.iterationCount === 'number' && card.iterationCount > 1 ? (
            <span className="realms-tianyu-iters">
              {t('realms_tianyu_merged_iterations', { n: card.iterationCount })}
            </span>
          ) : null}
          {when ? (
            <span className="realms-tianyu-when">
              {t('realms_tianyu_last_activity', { when })}
            </span>
          ) : null}
        </div>
        <a
          className="realms-tianyu-gh-mark"
          href={card.sourceUrl}
          title={card.sourcePath}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t('realms_fc_source')}：${card.sourcePath}`}
        >
          <GithubGlyph />
        </a>
      </div>

      <h3 className="realms-tianyu-card-title">
        <Link to={{ pathname: pathToRealmFeature('tianyu', card.slug), search: lang }}>
          {title}
        </Link>
      </h3>

      <p className="realms-tianyu-card-summary">{summary}</p>

      {card.bullets.length > 0 ? (
        <ul className="realms-tianyu-card-bullets">
          {card.bullets.slice(0, 3).map((b) => (
            <li key={`${card.slug}:${b.slice(0, 48)}`}>{convert(b)}</li>
          ))}
        </ul>
      ) : null}

      {card.tags.length > 0 ? (
        <div className="realms-fc-tags realms-tianyu-card-tags">
          {card.tags.map((tag) => (
            <span key={`${card.slug}:${tag}`} className="realms-fc-tag realms-tianyu-topic-chip">{convert(tag)}</span>
          ))}
        </div>
      ) : null}

      <div className="realms-tianyu-card-actions">
        <Link className="realms-fc-detail" to={{ pathname: pathToRealmFeature('tianyu', card.slug), search: lang }}>
          {t('realms_fc_detail')}
          <span className="ui-chevron-right" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

export function TianyuRealmBoard({
  features,
  accent,
}: {
  features: ResolvedRealmFeatureCard[]
  accent: RealmAccent
}) {
  const { t } = useTranslation()
  const { convert } = useCnToTwConverter()
  const [tab, setTab] = useState<TabKey>('conclusions')
  const [q, setQ] = useState('')
  const [topic, setTopic] = useState<TianyuTopicClusterId | ''>('')
  const [prioFilter, setPrioFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [cols, setCols] = useState(1)
  const scrollParentRef = useRef<HTMLDivElement | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  const setScrollParentRef = useCallback((node: HTMLDivElement | null) => {
    scrollParentRef.current = node
    resizeObserverRef.current?.disconnect()
    resizeObserverRef.current = null
    if (!node || typeof ResizeObserver === 'undefined') return
    setCols(colsFromWidth(node.clientWidth))
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? node.clientWidth
      setCols(colsFromWidth(w))
    })
    ro.observe(node)
    resizeObserverRef.current = ro
  }, [])

  useEffect(() => {
    const prevTitle = typeof document !== 'undefined' ? document.title : ''
    document.title = t('realms_tianyu_browser_title')
    return () => {
      document.title = prevTitle || t('realms_page_title')
    }
  }, [t])

  useEffect(() => {
    if (tab !== 'conclusions' && tab !== 'all') setTopic('')
  }, [tab])

  const stats = useMemo(() => {
    const conclusions = features.filter((c) => c.tianyuKind === 'conclusion')
    const interactions = features.filter((c) => c.tianyuKind === 'interaction')
    const pend = features.filter((c) => c.statusRank === 'pending').length
    const high = features.filter((c) => c.priorityRank === 'high').length
    let rawSnapshots = interactions.reduce((a, g) => a + (g.iterationCount ?? 1), 0)
    const anyMissingIter = interactions.some((x) => x.iterationCount == null)
    if (interactions.length > 0 && anyMissingIter) {
      rawSnapshots = Math.max(rawSnapshots, Math.round(interactions.length * 2.5))
    }

    return {
      conclusions: conclusions.length,
      interactions: interactions.length,
      rawSnapshots,
      pending: pend,
      high,
    }
  }, [features])

  const needle = q.trim().toLowerCase()

  const filteredTabs = useMemo(
    () => features.filter((c) => {
      if (needle) {
        const hay = `${c.title} ${c.summary} ${c.tags.join(' ')}`.toLowerCase()
        if (!hay.includes(needle)) return false
      }
      if (
        topic
        && (tab === 'conclusions' || tab === 'all')
        && c.tianyuKind === 'conclusion'
        && `${c.topicCluster}` !== `${topic}`
      ) return false
      if (prioFilter && `${c.priorityRank}` !== prioFilter) return false
      if (statusFilter && `${c.statusRank}` !== statusFilter) return false
      return true
    }),
    [features, needle, prioFilter, statusFilter, tab, topic],
  )

  const topicOptions = useMemo(() => {
    const set = new Set<string>()
    for (const f of features) {
      if (f.tianyuKind === 'conclusion' && f.topicCluster) set.add(String(f.topicCluster))
    }
    return [...set].sort((a, b) => a.localeCompare(b, 'zh-Hant')) as TianyuTopicClusterId[]
  }, [features])

  const clusteredConclusionsFlat = useMemo((): ClusterRow[] => {
    const rows = filteredTabs
      .filter((c) => c.tianyuKind === 'conclusion')
    const map: Record<string, ResolvedRealmFeatureCard[]> = {}
    for (const r of rows) {
      const key = `${r.topicCluster ?? 'general'}`
      map[key] ??= []
      map[key].push(r)
    }

    const keysSorted = [...Object.keys(map)].sort((a, b) =>
      String(t(topicI18nKey(a))).localeCompare(String(t(topicI18nKey(b))), 'zh-Hant'),
    )

    const out: ClusterRow[] = []
    for (const ck of keysSorted) {
      for (const c of [...map[ck]].sort((a, b) => a.title.localeCompare(b.title, 'zh-Hant'))) {
        out.push({ clusterKey: ck, card: c })
      }
    }
    return out
  }, [filteredTabs, t])

  const flatForTab = useMemo((): ClusterRow[] => {
    if (tab === 'conclusions') return clusteredConclusionsFlat
    if (tab === 'interactions') {
      return filteredTabs
        .filter((c) => c.tianyuKind === 'interaction')
        .slice()
        .sort((a, b) => a.title.localeCompare(b.title, 'zh-Hant'))
        .map((card) => ({ clusterKey: 'interaction', card }))
    }
    if (tab === 'library') {
      return filteredTabs
        .filter((c) => tabFromKind(c.tianyuKind) === 'library')
        .slice()
        .sort((a, b) => a.title.localeCompare(b.title, 'zh-Hant'))
        .map((card) => ({ clusterKey: 'library_bundle', card }))
    }

    const conc = clusteredConclusionsFlat
    const inter = filteredTabs
      .filter((c) => c.tianyuKind === 'interaction')
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title, 'zh-Hant'))
      .map((card) => ({ clusterKey: 'interaction', card }))
    const rest = filteredTabs
      .filter((c) => tabFromKind(c.tianyuKind) === 'library')
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title, 'zh-Hant'))
      .map((card) => ({ clusterKey: 'library_bundle', card }))
    return [...conc, ...inter, ...rest]
  }, [clusteredConclusionsFlat, filteredTabs, tab])

  const displayPieces = useMemo(
    () => buildDisplayPieces(flatForTab, Math.max(1, cols), tab, t),
    [cols, flatForTab, tab, t],
  )

  const virtualizer = useVirtualizer({
    count: displayPieces.length,
    getScrollElement: () => scrollParentRef.current,
    estimateSize: (index) => (displayPieces[index]?.kind === 'cluster' ? 40 : 360),
    overscan: 6,
    measureElement: (el) => el.getBoundingClientRect().height,
  })

  useEffect(() => {
    scrollParentRef.current?.scrollTo({ top: 0 })
  }, [tab, q, topic, prioFilter, statusFilter])

  const tabs: { id: TabKey, labelKey: string }[] = [
    { id: 'conclusions', labelKey: 'realms_tianyu_tab_conclusions' },
    { id: 'interactions', labelKey: 'realms_tianyu_tab_interactions' },
    { id: 'library', labelKey: 'realms_tianyu_tab_library' },
    { id: 'all', labelKey: 'realms_tianyu_tab_all' },
  ]

  return (
    <div className="realms-tianyu-board">
      <section className="realms-tianyu-dash" aria-label={t('realms_tianyu_dash_aria')}>
        <article className="realms-tianyu-stat realms-tianyu-stat--a">
          <h3>{t('realms_tianyu_stat_conclusions')}</h3>
          <p>{stats.conclusions}</p>
        </article>
        <article className="realms-tianyu-stat realms-tianyu-stat--b">
          <h3>{t('realms_tianyu_stat_interactions_groups')}</h3>
          <p>{stats.interactions}</p>
        </article>
        <article className="realms-tianyu-stat realms-tianyu-stat--c">
          <h3>{t('realms_tianyu_stat_interaction_snapshots')}</h3>
          <p>{stats.rawSnapshots}</p>
          <small>{t('realms_tianyu_stat_interaction_hint')}</small>
        </article>
        <article className="realms-tianyu-stat realms-tianyu-stat--d">
          <h3>{t('realms_tianyu_stat_pending')}</h3>
          <p>{stats.pending}</p>
          <small>{t('realms_tianyu_stat_high_prio')}: {stats.high}</small>
        </article>
      </section>

      <div className="realms-tianyu-toolbar">
        <div className="realms-tianyu-tabs" role="tablist" aria-label={t('realms_tianyu_tabs_aria')}>
          {tabs.map((x) =>
            tab === x.id ? (
              <button
                key={x.id}
                type="button"
                role="tab"
                aria-selected="true"
                className="realms-tianyu-tab realms-tianyu-tab--active"
                onClick={() => setTab(x.id)}
              >
                {t(x.labelKey)}
              </button>
            ) : (
              <button
                key={x.id}
                type="button"
                role="tab"
                aria-selected="false"
                className="realms-tianyu-tab"
                onClick={() => setTab(x.id)}
              >
                {t(x.labelKey)}
              </button>
            ),
          )}
        </div>

        <div className="realms-tianyu-filters">
          <label className="realms-tianyu-field">
            <span>{t('realms_tianyu_search')}</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('realms_tianyu_search_ph')} />
          </label>

          {(tab === 'conclusions' || tab === 'all') ? (
            <label className="realms-tianyu-field">
              <span>{t('realms_tianyu_topic_filter')}</span>
              <select
                value={topic}
                onChange={(e) => setTopic((e.target.value || '') as TianyuTopicClusterId | '')}
              >
                <option value="">{t('realms_tianyu_filter_all')}</option>
                {topicOptions.map((o) => (
                  <option key={o} value={o}>{t(topicI18nKey(o))}</option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="realms-tianyu-field">
            <span>{t('realms_tianyu_prio_filter')}</span>
            <select value={prioFilter} onChange={(e) => setPrioFilter(e.target.value)}>
              <option value="">{t('realms_tianyu_filter_all')}</option>
              <option value="high">{t('realms_tianyu_prio_high')}</option>
              <option value="medium">{t('realms_tianyu_prio_medium')}</option>
              <option value="low">{t('realms_tianyu_prio_low')}</option>
            </select>
          </label>

          <label className="realms-tianyu-field">
            <span>{t('realms_tianyu_status_filter')}</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">{t('realms_tianyu_filter_all')}</option>
              <option value="pending">{t('realms_tianyu_stat_pending')}</option>
              <option value="done">{t('realms_tianyu_stat_done')}</option>
              <option value="mixed">{t('realms_tianyu_stat_mixed')}</option>
              <option value="unknown">{t('realms_tianyu_stat_unknown')}</option>
            </select>
          </label>
        </div>
      </div>

      <div className="realms-tianyu-cards-wrap">
        {flatForTab.length === 0 ? (
          <p className="realms-fc-empty realms-tianyu-empty-full">{t('realms_tianyu_filter_empty')}</p>
        ) : (
          <div
            ref={setScrollParentRef}
            className={`realms-tianyu-virtual-viewport realms-tianyu-virtual-viewport--${accent}`}
          >
            <div
              className="realms-tianyu-virtual-track"
              style={{ height: virtualizer.getTotalSize() }}
            >
              {virtualizer.getVirtualItems().map((vi) => {
                const piece = displayPieces[vi.index]
                if (!piece) return null
                return (
                  <div
                    key={vi.key}
                    data-index={vi.index}
                    ref={virtualizer.measureElement}
                    className="realms-tianyu-virtual-row"
                    style={{ transform: `translateY(${vi.start}px)` }}
                  >
                    {piece.kind === 'cluster' ? (
                      <p className="realms-tianyu-cluster-label realms-tianyu-virtual-cluster">{piece.label}</p>
                    ) : (
                      <div
                        className={`realms-tianyu-grid-row realms-tianyu-grid-row--${Math.min(3, Math.max(1, piece.cards.length))}`}
                      >
                        {piece.cards.map((card) => (
                          <TianyuCard key={card.slug} accent={accent} card={card} convert={convert} />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <footer className="realms-tianyu-foot-note">
        <p>{t('realms_tianyu_content_note')}</p>
      </footer>
    </div>
  )
}
