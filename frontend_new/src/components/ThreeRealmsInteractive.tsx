import { useCallback, useEffect, useId, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import { useLangQuery } from '../hooks/useLangQuery'
import { PATHS } from '../routes/paths'
import { prefersReducedMotion } from '../lib/motionPreference'

const NOTE_REPO = 'https://github.com/iiooiioo888/Note'

const REALM_ORDER = ['tianyu', 'shenyu', 'jingjie'] as const
export type RealmId = (typeof REALM_ORDER)[number]

const REALM_META: Record<
  RealmId,
  {
    titleKey: string
    subKey: string
    descKey: string
    pointsKey: string
    folderTreeUrl: string
    folderLabelKey: string
    accent: 'cyan' | 'violet' | 'emerald'
  }
> = {
  tianyu: {
    titleKey: 'realms_tianyu_title',
    subKey: 'realms_tianyu_sub',
    descKey: 'realms_tianyu_desc',
    pointsKey: 'realms_tianyu_points',
    folderTreeUrl: 'https://github.com/iiooiioo888/Note/tree/main/%E5%A4%A9%E5%9F%9F',
    folderLabelKey: 'realms_tianyu_folder',
    accent: 'cyan',
  },
  shenyu: {
    titleKey: 'realms_shenyu_title',
    subKey: 'realms_shenyu_sub',
    descKey: 'realms_shenyu_desc',
    pointsKey: 'realms_shenyu_points',
    folderTreeUrl: 'https://github.com/iiooiioo888/Note/tree/main/%E7%A5%9E%E5%9F%9F',
    folderLabelKey: 'realms_shenyu_folder',
    accent: 'violet',
  },
  jingjie: {
    titleKey: 'realms_jingjie_title',
    subKey: 'realms_jingjie_sub',
    descKey: 'realms_jingjie_desc',
    pointsKey: 'realms_jingjie_points',
    folderTreeUrl: 'https://github.com/iiooiioo888/Note/tree/main/%E9%8F%A1%E7%95%8C',
    folderLabelKey: 'realms_jingjie_folder',
    accent: 'emerald',
  },
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

export function ThreeRealmsInteractive({ layout, showFullPageLink }: ThreeRealmsInteractiveProps) {
  const { t } = useTranslation()
  const langSearch = useLangQuery()
  const [searchParams, setSearchParams] = useSearchParams()
  const reduceMotion = prefersReducedMotion()
  const baseId = useId()

  const [idx, setIdx] = useState(0)
  const realmId = REALM_ORDER[idx]
  const meta = REALM_META[realmId]

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
                <button
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${id}`}
                  className={`realms-ix-tab realms-ix-tab--${m.accent} ${active ? 'realms-ix-tab--active' : ''}`}
                  aria-selected={active ? 'true' : 'false'}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => selectRealm(i)}
                >
                  <span className="realms-ix-tab-step">{t('realms_ix_step', { n: i + 1 })}</span>
                  <span className="realms-ix-tab-title">{t(m.titleKey)}</span>
                  <span className="realms-ix-tab-sub">{t(m.subKey)}</span>
                </button>
              </div>
            )
          })}
        </div>

        <div className="realms-ix-nav">
          <button type="button" className="realms-ix-arrow" onClick={() => selectRealm(idx - 1)} aria-label={t('realms_ix_prev')}>
            <span className="realms-ix-arrow-inner" aria-hidden="true">
              ‹
            </span>
          </button>
          <button type="button" className="realms-ix-arrow" onClick={() => selectRealm(idx + 1)} aria-label={t('realms_ix_next')}>
            <span className="realms-ix-arrow-inner" aria-hidden="true">
              ›
            </span>
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

        <div className="realms-ix-actions">
          <a
            className="realms-ix-folder-link"
            href={meta.folderTreeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="realms-ix-folder-icon" aria-hidden="true">📂</span>
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
