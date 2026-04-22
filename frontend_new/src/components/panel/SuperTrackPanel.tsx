import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SuperTrackLabPanel } from '../labs/SuperTrackLabPanel'
import { useSocialCrawlerApi } from '../../hooks/useSocialCrawlerApi'
import { PATHS } from '../../routes/paths'
import { toLangSearch } from '../../routes/langQuery'
import './supertrackPanel.css'

type PanelTab = 'dashboard' | 'targets' | 'crawl'

/** 追蹤主體類型：人物（KOL／創作者）、品牌、話題等 */
export type SubjectKind = 'person' | 'brand' | 'topic' | 'other'

type TrackTarget = {
  id: string
  name: string
  platform: string
  subjectKind: SubjectKind
  status: 'active' | 'paused'
}

const SUBJECT_KIND_OPTIONS: { value: SubjectKind; label: string }[] = [
  { value: 'person', label: '人物' },
  { value: 'brand', label: '品牌' },
  { value: 'topic', label: '話題／關鍵字' },
  { value: 'other', label: '其他' },
]

/** 擷取測試：示範人物帳號快速帶入 query */
const PERSON_QUERY_PRESETS: { value: string; label: string }[] = [
  { value: '', label: '（手動輸入 query）' },
  { value: '@lifestyle_mika', label: '人物：@lifestyle_mika' },
  { value: '@tech_notes_daily', label: '人物：@tech_notes_daily' },
  { value: '@urban_photo_lab', label: '人物：@urban_photo_lab' },
]

function subjectKindLabel(k: SubjectKind): string {
  return SUBJECT_KIND_OPTIONS.find((o) => o.value === k)?.label ?? k
}

function subjectKindBadgeClass(k: SubjectKind): string {
  switch (k) {
    case 'person':
      return 'st-panel__badge st-panel__badge--person'
    case 'brand':
      return 'st-panel__badge st-panel__badge--brand'
    case 'topic':
      return 'st-panel__badge st-panel__badge--topic'
    default:
      return 'st-panel__badge st-panel__badge--subject-other'
  }
}

const INITIAL_TARGETS: TrackTarget[] = [
  { id: 't1', name: '@design_daily', platform: '小紅書', subjectKind: 'person', status: 'active' },
  { id: 't2', name: 'BrandX Studio', platform: '抖音', subjectKind: 'brand', status: 'active' },
  { id: 't3', name: '@ai_creative', platform: 'Instagram', subjectKind: 'person', status: 'paused' },
  { id: 't4', name: '#賽博龐克創作', platform: 'X (Twitter)', subjectKind: 'topic', status: 'active' },
]

const PLATFORM_OPTIONS = [
  '小紅書',
  '抖音',
  '快手',
  'Bilibili',
  '微博',
  'Instagram',
  'X (Twitter)',
  'YouTube',
  'TikTok',
  '其他',
]

export type SuperTrackPanelProps = {
  lang: string
}

export function SuperTrackPanel({ lang }: SuperTrackPanelProps) {
  const langSearch = toLangSearch(lang)
  const { health, healthBody, platforms, lastError, refresh, runCrawl, fetchItems } = useSocialCrawlerApi()
  const [tab, setTab] = useState<PanelTab>('dashboard')
  const [targets, setTargets] = useState<TrackTarget[]>(() => [...INITIAL_TARGETS])
  const [newName, setNewName] = useState('')
  const [newSubjectKind, setNewSubjectKind] = useState<SubjectKind>('person')
  const [newPlatform, setNewPlatform] = useState(PLATFORM_OPTIONS[0]!)
  const [crawlPersonPreset, setCrawlPersonPreset] = useState('')
  const [crawlPlatform, setCrawlPlatform] = useState('demo')
  const [crawlQuery, setCrawlQuery] = useState('hello')
  const [crawlBusy, setCrawlBusy] = useState(false)
  const [crawlResult, setCrawlResult] = useState<string | null>(null)
  const [crawlError, setCrawlError] = useState<string | null>(null)
  const [itemsPreview, setItemsPreview] = useState<string | null>(null)
  const [itemsBusy, setItemsBusy] = useState(false)

  const platformChoices = useMemo(() => {
    if (platforms.length > 0) return platforms
    return ['demo', 'xhs', 'youtube', 'douyin']
  }, [platforms])

  const statusPill = useMemo(() => {
    if (health === 'loading') {
      return (
        <span className="st-panel__pill st-panel__pill--load">
          <span className="st-panel__dot st-panel__dot--pulse" />
          SocialCrawler 連線中…
        </span>
      )
    }
    if (health === 'ok') {
      return (
        <span className="st-panel__pill st-panel__pill--ok">
          <span className="st-panel__dot" />
          後端已連線
          {healthBody?.service ? ` · ${healthBody.service}` : ''}
        </span>
      )
    }
    return (
      <span className="st-panel__pill st-panel__pill--err" title={lastError ?? ''}>
        <span className="st-panel__dot" />
        後端離線（示範模式）
      </span>
    )
  }, [health, healthBody, lastError])

  const addTarget = useCallback(() => {
    const name = newName.trim()
    if (!name) return
    setTargets((prev) => [
      ...prev,
      {
        id: `t${Date.now()}`,
        name,
        platform: newPlatform,
        subjectKind: newSubjectKind,
        status: 'active',
      },
    ])
    setNewName('')
  }, [newName, newPlatform, newSubjectKind])

  const toggleTarget = useCallback((id: string) => {
    setTargets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === 'active' ? 'paused' : 'active' } : t)),
    )
  }, [])

  const removeTarget = useCallback((id: string) => {
    setTargets((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const handleCrawl = useCallback(async () => {
    setCrawlBusy(true)
    setCrawlError(null)
    setCrawlResult(null)
    try {
      const data = await runCrawl(crawlPlatform, crawlQuery)
      setCrawlResult(JSON.stringify(data, null, 2))
    } catch (e) {
      setCrawlError(e instanceof Error ? e.message : String(e))
    } finally {
      setCrawlBusy(false)
    }
  }, [runCrawl, crawlPlatform, crawlQuery])

  const handleLoadItems = useCallback(async () => {
    if (health !== 'ok') return
    setItemsBusy(true)
    setItemsPreview(null)
    try {
      const data = await fetchItems(15)
      setItemsPreview(JSON.stringify(data, null, 2))
    } catch (e) {
      setItemsPreview(e instanceof Error ? e.message : String(e))
    } finally {
      setItemsBusy(false)
    }
  }, [fetchItems, health])

  return (
    <div className="st-panel">
      <div className="st-panel__hero">
        <div className="st-panel__title-block">
          <h1>SuperTrack 控制台</h1>
          <p className="st-panel__subtitle">
            追蹤目標、警報與擷取管線的<strong>前端操作台</strong>（儀表區仍為示範數據）。啟動{' '}
            <code>social-crawler serve</code> 後可連線實際 <code>/api</code>。
          </p>
          <p className="st-panel__subtitle st-panel__subtitle--tight">
            <Link to={{ pathname: PATHS.docs.supertrack, search: langSearch, hash: '#engineering' }}>工程說明</Link>
            {' · '}
            <Link to={{ pathname: PATHS.labs.supertrack, search: langSearch }}>實驗室大螢幕</Link>
          </p>
        </div>
        <div className="st-panel__status">
          {statusPill}
          <button type="button" className="st-panel__btn-ghost" onClick={() => void refresh()}>
            重新檢查連線
          </button>
        </div>
      </div>

      <nav className="st-panel__tabs" aria-label="控制台分頁">
        {(
          [
            ['dashboard', '儀表總覽'],
            ['targets', '追蹤目標'],
            ['crawl', '擷取測試'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`st-panel__tab${tab === id ? ' st-panel__tab--active' : ''}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === 'dashboard' && (
        <div className="st-panel__dash-wrap">
          <SuperTrackLabPanel context="assistant" />
        </div>
      )}

      {tab === 'targets' && (
        <div className="st-panel__panel">
          <h2>追蹤目標（本機示範清單）</h2>
          <p className="st-panel__hint">以下僅存於瀏覽器工作階段，重新整理後會還原；正式版將與帳號後端同步。</p>
          <div className="st-panel__form-row">
            <div className="st-panel__field">
              <label htmlFor="st-new-subject">主體類型</label>
              <select
                id="st-new-subject"
                value={newSubjectKind}
                onChange={(e) => setNewSubjectKind(e.target.value as SubjectKind)}
              >
                {SUBJECT_KIND_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="st-panel__field">
              <label htmlFor="st-new-name">名稱／帳號</label>
              <input
                id="st-new-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={newSubjectKind === 'person' ? '@人物帳號 或暱稱' : '名稱或關鍵字'}
                autoComplete="off"
              />
            </div>
            <div className="st-panel__field">
              <label htmlFor="st-new-plat">平台</label>
              <select id="st-new-plat" value={newPlatform} onChange={(e) => setNewPlatform(e.target.value)}>
                {PLATFORM_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" className="st-panel__btn" onClick={addTarget}>
              新增追蹤
            </button>
          </div>
          <div className="st-panel__table-wrap">
            <table className="st-panel__table">
              <thead>
                <tr>
                  <th>主體</th>
                  <th>目標</th>
                  <th>平台</th>
                  <th>狀態</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {targets.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <span className={subjectKindBadgeClass(t.subjectKind)} title={subjectKindLabel(t.subjectKind)}>
                        {subjectKindLabel(t.subjectKind)}
                      </span>
                    </td>
                    <td>{t.name}</td>
                    <td>{t.platform}</td>
                    <td>
                      <span className={`st-panel__badge ${t.status === 'active' ? 'st-panel__badge--on' : 'st-panel__badge--off'}`}>
                        {t.status === 'active' ? '追蹤中' : '暫停'}
                      </span>
                    </td>
                    <td>
                      <button type="button" className="st-panel__btn-ghost" onClick={() => toggleTarget(t.id)}>
                        切換
                      </button>{' '}
                      <button type="button" className="st-panel__btn-ghost" onClick={() => removeTarget(t.id)}>
                        移除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'crawl' && (
        <div className="st-panel__panel">
          <h2>擷取測試（SocialCrawler API）</h2>
          <p className="st-panel__hint">
            POST <code>/api/crawl</code>；預設請使用 <code>demo</code> 平台。可從「人物」下拉選示範帳號帶入 <code>query</code>，或手動改寫。
          </p>
          <div className="st-panel__form-row">
            <div className="st-panel__field">
              <label htmlFor="st-crawl-person">人物（帶入 query）</label>
              <select
                id="st-crawl-person"
                value={crawlPersonPreset}
                onChange={(e) => {
                  const v = e.target.value
                  setCrawlPersonPreset(v)
                  if (v) setCrawlQuery(v)
                }}
              >
                {PERSON_QUERY_PRESETS.map((o) => (
                  <option key={o.value || 'custom'} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="st-panel__field">
              <label htmlFor="st-crawl-plat">platform</label>
              <select id="st-crawl-plat" value={crawlPlatform} onChange={(e) => setCrawlPlatform(e.target.value)}>
                {platformChoices.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="st-panel__field">
              <label htmlFor="st-crawl-q">query</label>
              <input
                id="st-crawl-q"
                value={crawlQuery}
                onChange={(e) => {
                  setCrawlQuery(e.target.value)
                  setCrawlPersonPreset('')
                }}
              />
            </div>
            <button type="button" className="st-panel__btn" disabled={crawlBusy || health !== 'ok'} onClick={() => void handleCrawl()}>
              {crawlBusy ? '執行中…' : '執行擷取'}
            </button>
            <button
              type="button"
              className="st-panel__btn st-panel__btn--outline"
              disabled={itemsBusy || health !== 'ok'}
              onClick={() => void handleLoadItems()}
            >
              {itemsBusy ? '讀取中…' : '拉取最近 items'}
            </button>
          </div>
          {health !== 'ok' && (
            <p className="st-panel__hint">後端未連線時無法呼叫 API；請於專案目錄執行 <code>python -m social_crawler serve</code>。</p>
          )}
          {crawlError && <p className="st-panel__hint st-panel__error-text">{crawlError}</p>}
          {crawlResult && (
            <>
              <h3 className="st-panel__section-title">回應</h3>
              <pre className="st-panel__pre">{crawlResult}</pre>
            </>
          )}
          {itemsPreview && (
            <>
              <h3 className="st-panel__section-title">GET /api/items</h3>
              <pre className="st-panel__pre">{itemsPreview}</pre>
            </>
          )}
        </div>
      )}
    </div>
  )
}
