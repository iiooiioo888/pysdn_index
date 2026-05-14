import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { ResolvedRealmFeatureCard } from '../../data/threeRealmsFeatureUtils'
import type { RealmAccent } from '../../data/threeRealmsMeta'
import { useCnToTwConverter } from '../../hooks/useCnToTwConverter'
import { useLangQuery } from '../../hooks/useLangQuery'
import { pathToRealmFeature } from '../../routes/paths'

type TabKey = 'all' | 'crawler' | 'data' | 'infra' | 'security'

const TAB_KEYWORDS: Record<TabKey, string[]> = {
  all: [],
  crawler: ['爬蟲', 'crawler', 'scrapy', 'spider', '指紋', '代理', 'proxy', '反爬', 'anti-bot'],
  data: ['數據', 'data', '處理', 'pipeline', 'ETL', '清洗', '質量', 'quality', '監控'],
  infra: ['部署', 'deploy', 'docker', 'kubernetes', 'k8s', 'CI/CD', '微服務', '架構', '中間件'],
  security: ['安全', 'security', '合規', 'compliance', '加密', '認證', 'auth', '權限'],
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

function colsFromWidth(width: number): number {
  if (width >= 1280) return 3
  if (width >= 900) return 2
  return 1
}

type DisplayPiece =
  | { kind: 'heading'; label: string }
  | { kind: 'row'; cards: ResolvedRealmFeatureCard[] }

function buildDisplayPieces(
  cards: ResolvedRealmFeatureCard[],
  cols: number,
): DisplayPiece[] {
  const pieces: DisplayPiece[] = []
  let buffer: ResolvedRealmFeatureCard[] = []

  const flushFullRows = () => {
    while (buffer.length >= cols) {
      pieces.push({ kind: 'row', cards: buffer.slice(0, cols) })
      buffer = buffer.slice(cols)
    }
  }

  for (const card of cards) {
    buffer.push(card)
    flushFullRows()
  }
  if (buffer.length > 0) pieces.push({ kind: 'row', cards: [...buffer] })
  return pieces
}

function categorizeCard(card: ResolvedRealmFeatureCard, tab: TabKey): boolean {
  if (tab === 'all') return true
  const keywords = TAB_KEYWORDS[tab]
  const haystack = `${card.title} ${card.summary} ${card.tags.join(' ')} ${card.bodyMarkdown.slice(0, 500)}`.toLowerCase()
  return keywords.some((kw) => haystack.includes(kw))
}

/** Extract tech stack tags from card content */
function extractTechTags(card: ResolvedRealmFeatureCard): string[] {
  const techKeywords = [
    'PostgreSQL', 'Redis', 'MongoDB', 'Elasticsearch', 'Kafka', 'Docker',
    'Kubernetes', 'Scrapy', 'FastAPI', 'React', 'Nginx', 'Prometheus',
    'Grafana', 'Flink', 'Airflow', 'Celery', 'RabbitMQ', 'ClickHouse',
    'InfluxDB', 'Python', 'TypeScript', 'Playwright', 'Selenium',
  ]
  const haystack = `${card.title} ${card.summary} ${card.bodyMarkdown.slice(0, 1000)}`
  return techKeywords.filter((kw) => haystack.includes(kw))
}

function JingjieCard({
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
  const title = convert(card.title)
  const summary = convert(card.summary)
  const techTags = extractTechTags(card)

  return (
    <article className={`realms-tianyu-card realms-tianyu-card--${accent}`}>
      <div className="realms-tianyu-card-top">
        <div className="realms-tianyu-meta">
          {card.tags.length > 0 ? (
            <span className="realms-fc-kind-badge realms-fc-kind-badge--knowledge">
              {convert(card.tags[0])}
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
        <Link to={{ pathname: pathToRealmFeature('jingjie', card.slug), search: lang }}>
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

      {/* Tech stack tags */}
      {techTags.length > 0 ? (
        <div className="realms-fc-tags realms-tianyu-card-tags">
          {techTags.slice(0, 4).map((tag) => (
            <span key={`${card.slug}:tech:${tag}`} className="realms-fc-tag realms-jingjie-tech-tag">{tag}</span>
          ))}
        </div>
      ) : card.tags.length > 0 ? (
        <div className="realms-fc-tags realms-tianyu-card-tags">
          {card.tags.map((tag) => (
            <span key={`${card.slug}:${tag}`} className="realms-fc-tag realms-tianyu-topic-chip">{convert(tag)}</span>
          ))}
        </div>
      ) : null}

      <div className="realms-tianyu-card-actions">
        <Link className="realms-fc-detail" to={{ pathname: pathToRealmFeature('jingjie', card.slug), search: lang }}>
          {t('realms_fc_detail')}
          <span className="ui-chevron-right" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

export function JingjieRealmBoard({
  features,
  accent,
}: {
  features: ResolvedRealmFeatureCard[]
  accent: RealmAccent
}) {
  const { t } = useTranslation()
  const { convert } = useCnToTwConverter()
  const [tab, setTab] = useState<TabKey>('all')
  const [q, setQ] = useState('')
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
    document.title = t('realms_jingjie_browser_title')
    return () => {
      document.title = prevTitle || t('realms_page_title')
    }
  }, [t])

  // Stats
  const stats = useMemo(() => {
    const crawlerCount = features.filter((c) => categorizeCard(c, 'crawler')).length
    const dataCount = features.filter((c) => categorizeCard(c, 'data')).length
    const infraCount = features.filter((c) => categorizeCard(c, 'infra')).length
    const securityCount = features.filter((c) => categorizeCard(c, 'security')).length
    const allTechTags = new Set<string>()
    for (const f of features) extractTechTags(f).forEach((tag) => allTechTags.add(tag))
    return {
      total: features.length,
      crawler: crawlerCount,
      data: dataCount,
      infra: infraCount,
      security: securityCount,
      techCount: allTechTags.size,
    }
  }, [features])

  const needle = q.trim().toLowerCase()

  const filtered = useMemo(
    () => features.filter((c) => {
      if (!categorizeCard(c, tab)) return false
      if (needle) {
        const hay = `${c.title} ${c.summary} ${c.tags.join(' ')}`.toLowerCase()
        if (!hay.includes(needle)) return false
      }
      return true
    }),
    [features, needle, tab],
  )

  const sorted = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => a.title.localeCompare(b.title, 'zh-Hant'))
    return arr
  }, [filtered])

  const displayPieces = useMemo(
    () => buildDisplayPieces(sorted, Math.max(1, cols)),
    [sorted, cols],
  )

  const virtualizer = useVirtualizer({
    count: displayPieces.length,
    getScrollElement: () => scrollParentRef.current,
    estimateSize: () => 340,
    overscan: 6,
    measureElement: (el) => el.getBoundingClientRect().height,
  })

  useEffect(() => {
    scrollParentRef.current?.scrollTo({ top: 0 })
  }, [tab, q])

  const tabs: { id: TabKey; labelKey: string }[] = [
    { id: 'all', labelKey: 'realms_jingjie_tab_all' },
    { id: 'crawler', labelKey: 'realms_jingjie_tab_crawler' },
    { id: 'data', labelKey: 'realms_jingjie_tab_data' },
    { id: 'infra', labelKey: 'realms_jingjie_tab_infra' },
    { id: 'security', labelKey: 'realms_jingjie_tab_security' },
  ]

  return (
    <div className="realms-tianyu-board">
      {/* Dashboard stats */}
      <section className="realms-tianyu-dash" aria-label={t('realms_jingjie_dash_aria')}>
        <article className="realms-tianyu-stat realms-tianyu-stat--a">
          <h3>{t('realms_jingjie_stat_total')}</h3>
          <p>{stats.total}</p>
        </article>
        <article className="realms-tianyu-stat realms-tianyu-stat--b">
          <h3>{t('realms_jingjie_stat_crawler')}</h3>
          <p>{stats.crawler}</p>
        </article>
        <article className="realms-tianyu-stat realms-tianyu-stat--c">
          <h3>{t('realms_jingjie_stat_data')}</h3>
          <p>{stats.data}</p>
        </article>
        <article className="realms-tianyu-stat realms-tianyu-stat--d">
          <h3>{t('realms_jingjie_stat_tech')}</h3>
          <p>{stats.techCount}</p>
          <small>{t('realms_jingjie_stat_infra')}: {stats.infra} · {t('realms_jingjie_stat_security')}: {stats.security}</small>
        </article>
      </section>

      {/* Toolbar */}
      <div className="realms-tianyu-toolbar">
        <div className="realms-tianyu-tabs" role="tablist" aria-label={t('realms_jingjie_tabs_aria')}>
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
            <span>{t('realms_jingjie_search')}</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('realms_jingjie_search_ph')} />
          </label>
        </div>
      </div>

      {/* Cards */}
      <div className="realms-tianyu-cards-wrap">
        {sorted.length === 0 ? (
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
                    {piece.kind === 'heading' ? (
                      <p className="realms-tianyu-cluster-label realms-tianyu-virtual-cluster">{piece.label}</p>
                    ) : (
                      <div
                        className={`realms-tianyu-grid-row realms-tianyu-grid-row--${Math.min(3, Math.max(1, piece.cards.length))}`}
                      >
                        {piece.cards.map((card) => (
                          <JingjieCard key={card.slug} accent={accent} card={card} convert={convert} />
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
        <p>{t('realms_jingjie_content_note')}</p>
      </footer>
    </div>
  )
}
