import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { ThreeRealmsInteractive } from '../components/ThreeRealmsInteractive'
import { TianyuIllustration, ShenyuIllustration, JingjieIllustration } from '../components/realms/RealmIllustrations'
import { REALM_FEATURES_TIANYU } from '../data/threeRealmsFeatures.tianyu'
import { REALM_FEATURES_SHENYU } from '../data/threeRealmsFeatures.shenyu'
import { REALM_FEATURES_JINGJIE } from '../data/threeRealmsFeatures.jingjie'
import { REALM_META, REALM_ORDER, isRealmId } from '../data/threeRealmsMeta'
import type { RealmId, RealmFeatureCard } from '../data/threeRealmsFeatures'
import { resolveRealmFeatureCards, type ResolvedRealmFeatureCard } from '../data/threeRealmsFeatureUtils'
import { useI18nRerender } from '../hooks/useI18nRerender'
import { useCnToTwConverter } from '../hooks/useCnToTwConverter'
import { useLangQuery } from '../hooks/useLangQuery'
import { PATHS, pathToRealm, pathToRealmFeature } from '../routes/paths'
import { RealmsPageShell } from './realms/RealmsPageShell'

const REALM_ILLUSTRATIONS: Record<RealmId, React.FC<{ className?: string; size?: number }>> = {
  tianyu: TianyuIllustration,
  shenyu: ShenyuIllustration,
  jingjie: JingjieIllustration,
}

const REALM_DATA: Record<RealmId, RealmFeatureCard[]> = {
  tianyu: REALM_FEATURES_TIANYU,
  shenyu: REALM_FEATURES_SHENYU,
  jingjie: REALM_FEATURES_JINGJIE,
}

type SortKey = 'relevance' | 'title' | 'realm'

export function ThreeRealmsPage() {
  const { t } = useTranslation()
  useI18nRerender()
  const { convert } = useCnToTwConverter()
  const langSearch = useLangQuery()
  const [searchParams] = useSearchParams()
  const legacyRealm = searchParams.get('realm') ?? undefined

  const [globalSearch, setGlobalSearch] = useState('')
  const [realmFilter, setRealmFilter] = useState<RealmId | ''>('')
  const [sortBy, setSortBy] = useState<SortKey>('relevance')

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

  // All resolved cards across all realms
  const allCards = useMemo(() => {
    const result: ResolvedRealmFeatureCard[] = []
    for (const realmId of REALM_ORDER) {
      const resolved = resolveRealmFeatureCards(realmId, REALM_DATA[realmId])
      result.push(...resolved)
    }
    return result
  }, [])

  // Global search results
  const searchResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase()
    if (!q) return []

    let filtered = allCards.filter((card) => {
      const haystack = `${card.title} ${card.summary} ${card.tags.join(' ')}`.toLowerCase()
      return haystack.includes(q)
    })

    if (realmFilter) {
      filtered = filtered.filter((card) => card.realmId === realmFilter)
    }

    // Sort
    if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title, 'zh-Hant'))
    } else if (sortBy === 'realm') {
      filtered.sort((a, b) => {
        const realmDiff = REALM_ORDER.indexOf(a.realmId) - REALM_ORDER.indexOf(b.realmId)
        if (realmDiff !== 0) return realmDiff
        return a.title.localeCompare(b.title, 'zh-Hant')
      })
    }
    // 'relevance' keeps the default order

    return filtered.slice(0, 30) // Limit results
  }, [allCards, globalSearch, realmFilter, sortBy])

  return (
    <RealmsPageShell>
      <main className="realms-page-main" id="realms-index">
        <div className="container realms-page-hero realms-page-hero--cyan">
          <p className="section-label">{t('realms_label')}</p>
          <h1 className="realms-page-title">{t('realms_index_title')}</h1>
          <p className="realms-page-lead">{t('realms_index_lead')}</p>

          {/* Global search bar */}
          <div className="realms-global-search">
            <div className="realms-global-search-input-wrap">
              <svg className="realms-global-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                className="realms-global-search-input"
                placeholder={t('realms_global_search_ph')}
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                aria-label={t('realms_global_search_aria')}
              />
              {globalSearch ? (
                <button
                  type="button"
                  className="realms-global-search-clear"
                  onClick={() => setGlobalSearch('')}
                  aria-label={t('realms_fc_search_clear')}
                >
                  ✕
                </button>
              ) : null}
            </div>

            {globalSearch ? (
              <div className="realms-global-search-controls">
                <label className="realms-global-search-field">
                  <span>{t('realms_global_filter_realm')}</span>
                  <select value={realmFilter} onChange={(e) => setRealmFilter(e.target.value as RealmId | '')}>
                    <option value="">{t('realms_global_filter_all')}</option>
                    {REALM_ORDER.map((id) => (
                      <option key={id} value={id}>{t(REALM_META[id].titleKey)}</option>
                    ))}
                  </select>
                </label>
                <label className="realms-global-search-field">
                  <span>{t('realms_global_sort')}</span>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)}>
                    <option value="relevance">{t('realms_global_sort_relevance')}</option>
                    <option value="title">{t('realms_global_sort_title')}</option>
                    <option value="realm">{t('realms_global_sort_realm')}</option>
                  </select>
                </label>
              </div>
            ) : null}
          </div>

          {/* Search results */}
          {globalSearch ? (
            <div className="realms-global-results">
              <p className="realms-global-results-count">
                {t('realms_global_results_count', { count: searchResults.length })}
              </p>
              {searchResults.length > 0 ? (
                <div className="realms-global-results-grid">
                  {searchResults.map((card) => {
                    const m = REALM_META[card.realmId]
                    return (
                      <Link
                        key={`${card.realmId}-${card.slug}`}
                        className={`realms-global-result-card realms-global-result-card--${m.accent}`}
                        to={{ pathname: pathToRealmFeature(card.realmId, card.slug), search: langSearch }}
                      >
                        <span className={`realms-global-result-realm realms-global-result-realm--${m.accent}`}>
                          {t(m.titleKey)}
                        </span>
                        <h4 className="realms-global-result-title">{convert(card.title)}</h4>
                        <p className="realms-global-result-summary">{convert(card.summary)}</p>
                        {card.tags.length > 0 ? (
                          <div className="realms-fc-tags">
                            {card.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className={`realms-fc-tag realms-fc-tag--${m.accent}`}>{convert(tag)}</span>
                            ))}
                          </div>
                        ) : null}
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <p className="realms-fc-empty">{t('realms_global_no_results')}</p>
              )}
            </div>
          ) : null}

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
