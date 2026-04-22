import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SuperTrackLabPanel } from '../labs/SuperTrackLabPanel'
import { useSocialCrawlerApi } from '../../hooks/useSocialCrawlerApi'
import { useSuperTrackPanelEditMode } from '../../hooks/useSuperTrackPanelEditMode'
import { PATHS } from '../../routes/paths'
import { toLangSearch } from '../../routes/langQuery'
import './supertrackPanel.css'

type PanelTab = 'dashboard' | 'targets' | 'crawl' | 'probes'

/** 追蹤主體類型：人物（KOL／創作者）、品牌、話題等 */
export type SubjectKind = 'person' | 'brand' | 'topic' | 'other'

export type ProbeStatus = 'online' | 'offline' | 'maintenance'

/** 面板「平台」顯示名稱 → SocialCrawler API `platform` 鍵（與 content_items 一致） */
const PANEL_PLATFORM_TO_API: Record<string, string> = {
  小紅書: 'xhs',
  抖音: 'douyin',
  快手: 'kuaishou',
  Bilibili: 'bilibili',
  微博: 'weibo',
  Instagram: 'instagram',
  'X (Twitter)': 'x_twitter',
  YouTube: 'youtube',
  TikTok: 'tiktok',
  其他: 'demo',
}

type CrawlSnapshot = {
  /** ISO 8601；後端離線或未載入 /api/items 時作為示範顯示 */
  lastIngestAt: string | null
  /** 示範或快取：統計視窗內筆數 */
  itemWindowCount: number
  /** 示範：近 24h 排程任務成功次數（實際需對接任務 API） */
  jobsSuccess24h: number
  /** 示範：近 24h 排程任務失敗次數 */
  jobsFailed24h: number
  /** 示範：下一輪預定採集（ISO 8601） */
  nextRunAt: string | null
  /** 示範：視窗內互動加總（與即時 payload 分開，離線時顯示） */
  engagementLikesSum: number
  engagementCommentsSum: number
  /** 示範：含至少一則媒體的條目數 */
  itemsWithMedia: number
  /** 示範：內容型態文字摘要 */
  contentMixLabel: string
}

type ItemRow = { platform: string; created_at: string; payload?: string }

type PlatformCrawlStats = {
  lastMs: number | null
  firstMs: number | null
  count: number
  contentTypes: Map<string, number>
  likesSum: number
  commentsSum: number
  withMedia: number
}

type TrackTarget = {
  id: string
  name: string
  platform: string
  subjectKind: SubjectKind
  status: 'active' | 'paused'
  /** 綁定之探針器；欄位建立後不可改，可暫停追蹤或刪除後重建 */
  probeId: string
  /** 爬蟲入庫示範快照（連線後會盡量以 /api/items 覆蓋顯示） */
  crawlSnapshot: CrawlSnapshot
}

type Probe = {
  id: string
  name: string
  region: string
  status: ProbeStatus
}

const SUBJECT_KIND_OPTIONS: { value: SubjectKind; label: string }[] = [
  { value: 'person', label: '人物' },
  { value: 'brand', label: '品牌' },
  { value: 'topic', label: '話題／關鍵字' },
  { value: 'other', label: '其他' },
]

const PROBE_STATUS_OPTIONS: { value: ProbeStatus; label: string }[] = [
  { value: 'online', label: '在線' },
  { value: 'offline', label: '離線' },
  { value: 'maintenance', label: '維護中' },
]

function subjectKindLabel(k: SubjectKind): string {
  return SUBJECT_KIND_OPTIONS.find((o) => o.value === k)?.label ?? k
}

function subjectKindBadgeClass(k: SubjectKind): string {
  switch (k) {
    case 'person':
      return 'st-panel__badge--person'
    case 'brand':
      return 'st-panel__badge--brand'
    case 'topic':
      return 'st-panel__badge--topic'
    default:
      return 'st-panel__badge--subject-other'
  }
}

function probeStatusLabel(s: ProbeStatus): string {
  return PROBE_STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s
}

function panelPlatformToApi(label: string): string {
  return PANEL_PLATFORM_TO_API[label] ?? 'demo'
}

function parseSqliteDatetime(createdAt: string): number {
  const normalized = createdAt.includes('T') ? createdAt : createdAt.replace(' ', 'T')
  const ms = Date.parse(normalized)
  return Number.isNaN(ms) ? Date.parse(createdAt) : ms
}

type PayloadShape = {
  content_type?: string
  engagement?: { likes?: number; comments?: number; shares?: number; views?: number }
  media?: unknown[]
}

function parseItemPayload(payload: string | undefined): PayloadShape | null {
  if (payload == null || payload === '') return null
  try {
    const j = JSON.parse(payload) as unknown
    return typeof j === 'object' && j !== null ? (j as PayloadShape) : null
  } catch {
    return null
  }
}

function contentTypeLabelZh(key: string): string {
  const m: Record<string, string> = {
    post: '貼文',
    video: '影片',
    image: '圖片',
    story: '限時',
    comment: '評論',
    profile: '主頁',
    live: '直播',
    other: '其他',
  }
  return m[key] ?? key
}

function formatContentTypeBreakdown(typeCounts: Map<string, number>): string {
  if (typeCounts.size === 0) return '—'
  const entries = [...typeCounts.entries()].sort((a, b) => b[1] - a[1])
  return entries
    .slice(0, 4)
    .map(([k, v]) => `${contentTypeLabelZh(k)} ${v}`)
    .join(' · ')
}

function formatWindowSpan(firstMs: number | null, lastMs: number | null): string {
  if (firstMs == null || lastMs == null || Number.isNaN(firstMs) || Number.isNaN(lastMs)) return '—'
  const fmt = new Intl.DateTimeFormat('zh-TW', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  if (firstMs === lastMs) return fmt.format(new Date(lastMs))
  return `${fmt.format(new Date(firstMs))} → ${fmt.format(new Date(lastMs))}`
}

function formatIntZh(n: number): string {
  return new Intl.NumberFormat('zh-TW').format(Math.round(n))
}

function aggregateItemsByPlatform(items: ItemRow[]): Map<string, PlatformCrawlStats> {
  const byPlat = new Map<string, ItemRow[]>()
  for (const it of items) {
    const arr = byPlat.get(it.platform) ?? []
    arr.push(it)
    byPlat.set(it.platform, arr)
  }
  const out = new Map<string, PlatformCrawlStats>()
  for (const [plat, rows] of byPlat) {
    const times = rows.map((r) => parseSqliteDatetime(r.created_at)).filter((n) => !Number.isNaN(n))
    const contentTypes = new Map<string, number>()
    let likesSum = 0
    let commentsSum = 0
    let withMedia = 0
    for (const r of rows) {
      const p = parseItemPayload(r.payload)
      if (p?.content_type) {
        const ct = String(p.content_type)
        contentTypes.set(ct, (contentTypes.get(ct) ?? 0) + 1)
      }
      const lk = p?.engagement?.likes
      const cm = p?.engagement?.comments
      if (typeof lk === 'number' && !Number.isNaN(lk)) likesSum += lk
      if (typeof cm === 'number' && !Number.isNaN(cm)) commentsSum += cm
      if (Array.isArray(p?.media) && p.media.length > 0) withMedia += 1
    }
    out.set(plat, {
      lastMs: times.length ? Math.max(...times) : null,
      firstMs: times.length ? Math.min(...times) : null,
      count: rows.length,
      contentTypes,
      likesSum,
      commentsSum,
      withMedia,
    })
  }
  return out
}

function formatIngestDisplay(ms: number | null): { absolute: string; relative: string } {
  if (ms == null || Number.isNaN(ms)) return { absolute: '—', relative: '' }
  const d = new Date(ms)
  const absolute = new Intl.DateTimeFormat('zh-TW', { dateStyle: 'medium', timeStyle: 'short' }).format(d)
  const diffMin = Math.round((Date.now() - ms) / 60_000)
  let relative = ''
  if (diffMin < 1) relative = '剛剛'
  else if (diffMin < 60) relative = `${diffMin} 分鐘前`
  else if (diffMin < 1440) relative = `${Math.floor(diffMin / 60)} 小時前`
  else relative = `${Math.floor(diffMin / 1440)} 天前`
  return { absolute, relative }
}

/** 擷取測試：示範人物帳號快速帶入 query */
const PERSON_QUERY_PRESETS: { value: string; label: string }[] = [
  { value: '', label: '（手動輸入 query）' },
  { value: '@lifestyle_mika', label: '人物：@lifestyle_mika' },
  { value: '@tech_notes_daily', label: '人物：@tech_notes_daily' },
  { value: '@urban_photo_lab', label: '人物：@urban_photo_lab' },
]

const INITIAL_PROBES: Probe[] = [
  { id: 'PRB-SEA-001', name: '邊緣節點 · 新加坡 A', region: '新加坡', status: 'online' },
  { id: 'PRB-TW-002', name: '主節點 · 台北', region: '台北', status: 'online' },
  { id: 'PRB-US-003', name: '備援 · 美西', region: '舊金山', status: 'offline' },
  { id: 'PRB-CN-004', name: '採集探針 · 長三角', region: '上海', status: 'maintenance' },
]

const INITIAL_TARGETS: TrackTarget[] = [
  {
    id: 't1',
    name: '@design_daily',
    platform: '小紅書',
    subjectKind: 'person',
    status: 'active',
    probeId: 'PRB-SEA-001',
    crawlSnapshot: {
      lastIngestAt: '2026-04-22T09:12:00+08:00',
      itemWindowCount: 142,
      jobsSuccess24h: 18,
      jobsFailed24h: 1,
      nextRunAt: '2026-04-22T10:30:00+08:00',
      engagementLikesSum: 42800,
      engagementCommentsSum: 1920,
      itemsWithMedia: 118,
      contentMixLabel: '貼文 96 · 影片 46',
    },
  },
  {
    id: 't2',
    name: 'BrandX Studio',
    platform: '抖音',
    subjectKind: 'brand',
    status: 'active',
    probeId: 'PRB-TW-002',
    crawlSnapshot: {
      lastIngestAt: '2026-04-22T08:40:00+08:00',
      itemWindowCount: 89,
      jobsSuccess24h: 22,
      jobsFailed24h: 0,
      nextRunAt: '2026-04-22T09:45:00+08:00',
      engagementLikesSum: 210000,
      engagementCommentsSum: 6400,
      itemsWithMedia: 89,
      contentMixLabel: '影片 62 · 貼文 27',
    },
  },
  {
    id: 't3',
    name: '@ai_creative',
    platform: 'Instagram',
    subjectKind: 'person',
    status: 'paused',
    probeId: 'PRB-US-003',
    crawlSnapshot: {
      lastIngestAt: '2026-04-21T18:05:00+08:00',
      itemWindowCount: 36,
      jobsSuccess24h: 6,
      jobsFailed24h: 2,
      nextRunAt: null,
      engagementLikesSum: 8900,
      engagementCommentsSum: 412,
      itemsWithMedia: 36,
      contentMixLabel: '貼文 28 · 限時 8',
    },
  },
  {
    id: 't4',
    name: '#賽博龐克創作',
    platform: 'X (Twitter)',
    subjectKind: 'topic',
    status: 'active',
    probeId: 'PRB-CN-004',
    crawlSnapshot: {
      lastIngestAt: '2026-04-22T07:55:00+08:00',
      itemWindowCount: 210,
      jobsSuccess24h: 40,
      jobsFailed24h: 3,
      nextRunAt: '2026-04-22T11:00:00+08:00',
      engagementLikesSum: 15300,
      engagementCommentsSum: 2800,
      itemsWithMedia: 45,
      contentMixLabel: '貼文 198 · 影片 12',
    },
  },
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
  const canEdit = useSuperTrackPanelEditMode()
  const { health, healthBody, platforms, lastError, refresh, runCrawl, fetchItems } = useSocialCrawlerApi()
  const [tab, setTab] = useState<PanelTab>('dashboard')
  const [probes, setProbes] = useState<Probe[]>(() => [...INITIAL_PROBES])
  const [targets, setTargets] = useState<TrackTarget[]>(() => [...INITIAL_TARGETS])
  const [newName, setNewName] = useState('')
  const [newSubjectKind, setNewSubjectKind] = useState<SubjectKind>('person')
  const [newPlatform, setNewPlatform] = useState(PLATFORM_OPTIONS[0]!)
  const [newTargetProbeId, setNewTargetProbeId] = useState('')
  const [newProbeId, setNewProbeId] = useState('')
  const [newProbeName, setNewProbeName] = useState('')
  const [newProbeRegion, setNewProbeRegion] = useState('')
  const [newProbeStatus, setNewProbeStatus] = useState<ProbeStatus>('online')
  const [crawlPersonPreset, setCrawlPersonPreset] = useState('')
  const [crawlPlatform, setCrawlPlatform] = useState('demo')
  const [crawlQuery, setCrawlQuery] = useState('hello')
  const [crawlBusy, setCrawlBusy] = useState(false)
  const [crawlResult, setCrawlResult] = useState<string | null>(null)
  const [crawlError, setCrawlError] = useState<string | null>(null)
  const [itemsPreview, setItemsPreview] = useState<string | null>(null)
  const [itemsBusy, setItemsBusy] = useState(false)
  const [targetsItemsRows, setTargetsItemsRows] = useState<ItemRow[]>([])
  const [targetsItemsFetched, setTargetsItemsFetched] = useState(false)
  const [targetsItemsLoading, setTargetsItemsLoading] = useState(false)
  const [targetsItemsError, setTargetsItemsError] = useState<string | null>(null)

  const platformChoices = useMemo(() => {
    if (platforms.length > 0) return platforms
    return ['demo', 'xhs', 'youtube', 'douyin']
  }, [platforms])

  const unboundProbeIds = useMemo(() => {
    const used = new Set(targets.map((t) => t.probeId))
    return probes.map((p) => p.id).filter((id) => !used.has(id))
  }, [targets, probes])

  const itemsByPlatform = useMemo(() => aggregateItemsByPlatform(targetsItemsRows), [targetsItemsRows])

  const loadTargetsCrawl = useCallback(async () => {
    if (health !== 'ok') {
      setTargetsItemsFetched(false)
      return
    }
    setTargetsItemsLoading(true)
    setTargetsItemsError(null)
    try {
      const data = await fetchItems(200)
      const raw = data.items ?? []
      const rows: ItemRow[] = []
      if (Array.isArray(raw)) {
        for (const x of raw) {
          if (typeof x === 'object' && x !== null && 'platform' in x && 'created_at' in x) {
            const payloadRaw = (x as { payload?: unknown }).payload
            rows.push({
              platform: String((x as { platform: unknown }).platform),
              created_at: String((x as { created_at: unknown }).created_at),
              ...(typeof payloadRaw === 'string' ? { payload: payloadRaw } : {}),
            })
          }
        }
      }
      setTargetsItemsRows(rows)
      setTargetsItemsFetched(true)
    } catch (e) {
      setTargetsItemsError(e instanceof Error ? e.message : String(e))
      setTargetsItemsFetched(false)
    } finally {
      setTargetsItemsLoading(false)
    }
  }, [fetchItems, health])

  useEffect(() => {
    if (health !== 'ok') {
      setTargetsItemsFetched(false)
    }
  }, [health])

  useEffect(() => {
    if (tab === 'targets') void loadTargetsCrawl()
  }, [tab, loadTargetsCrawl])

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

  const resolveProbeName = useCallback(
    (probeId: string) => probes.find((p) => p.id === probeId)?.name ?? probeId,
    [probes],
  )

  const addTarget = useCallback(() => {
    if (!canEdit) return
    const name = newName.trim()
    if (!name || !newTargetProbeId) return
    if (!probes.some((p) => p.id === newTargetProbeId)) return
    if (targets.some((t) => t.probeId === newTargetProbeId)) return
    setTargets((prev) => [
      ...prev,
      {
        id: `t${Date.now()}`,
        name,
        platform: newPlatform,
        subjectKind: newSubjectKind,
        status: 'active',
        probeId: newTargetProbeId,
        crawlSnapshot: {
          lastIngestAt: null,
          itemWindowCount: 0,
          jobsSuccess24h: 0,
          jobsFailed24h: 0,
          nextRunAt: null,
          engagementLikesSum: 0,
          engagementCommentsSum: 0,
          itemsWithMedia: 0,
          contentMixLabel: '—',
        },
      },
    ])
    setNewName('')
    setNewTargetProbeId('')
  }, [canEdit, newName, newPlatform, newSubjectKind, newTargetProbeId, probes, targets])

  const toggleTarget = useCallback(
    (id: string) => {
      if (!canEdit) return
      setTargets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: t.status === 'active' ? 'paused' : 'active' } : t)),
      )
    },
    [canEdit],
  )

  const removeTarget = useCallback(
    (id: string) => {
      if (!canEdit) return
      setTargets((prev) => prev.filter((t) => t.id !== id))
    },
    [canEdit],
  )

  const addProbe = useCallback(() => {
    if (!canEdit) return
    const id = newProbeId.trim()
    if (!id || probes.some((p) => p.id === id)) return
    const name = newProbeName.trim() || id
    const region = newProbeRegion.trim() || '—'
    setProbes((prev) => [...prev, { id, name, region, status: newProbeStatus }])
    setNewProbeId('')
    setNewProbeName('')
    setNewProbeRegion('')
    setNewProbeStatus('online')
  }, [canEdit, newProbeId, newProbeName, newProbeRegion, newProbeStatus, probes])

  const patchProbe = useCallback(
    (id: string, patch: Partial<Pick<Probe, 'name' | 'region' | 'status'>>) => {
      if (!canEdit) return
      setProbes((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
    },
    [canEdit],
  )

  const removeProbe = useCallback(
    (id: string) => {
      if (!canEdit) return
      if (targets.some((t) => t.probeId === id)) return
      setProbes((prev) => prev.filter((p) => p.id !== id))
    },
    [canEdit, targets],
  )

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
    <div className="st-panel st-panel--fullscreen">
      <div className="st-panel__hero">
        <div className="st-panel__title-block">
          <h1>SuperTrack 控制台</h1>
          <p className="st-panel__subtitle">
            追蹤目標、警報與擷取管線的前端操作台（儀表區仍為示範數據）。啟動{' '}
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
            ['probes', '探針器'],
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

      <div className="st-panel__workspace">
        {tab === 'dashboard' && (
          <div className="st-panel__dash-wrap">
            <SuperTrackLabPanel context="assistant" />
          </div>
        )}

        {tab === 'targets' && (
          <div className="st-panel__panel st-panel__panel--tab">
          <h2>追蹤目標</h2>
          <div className="st-panel__hint-row">
            <p className="st-panel__hint st-panel__hint--grow">
              每筆目標對應一個探針器 ID。建立後欄位不可改，但可暫停／恢復追蹤或刪除；刪除後可用上方表單重新建立。卡片上的「爬蟲入庫」會在後端連線時依{' '}
              <code>/api/items</code> 以平台彙總：時間範圍、內容型態、互動加總與媒體則數（由 <code>payload</code> 解析；同平台多目標仍共用統計）。「任務／排程」欄位目前為營運示範，待對接任務 API。離線時其餘數字為示範。重新整理頁面後示範清單會還原。
            </p>
            {health === 'ok' && (
              <button
                type="button"
                className="st-panel__btn-ghost st-panel__btn-ghost--nowrap"
                onClick={() => void loadTargetsCrawl()}
                disabled={targetsItemsLoading}
              >
                {targetsItemsLoading ? '同步中…' : '同步入庫統計'}
              </button>
            )}
          </div>
          {targetsItemsError && (
            <p className="st-panel__hint st-panel__error-text" title={targetsItemsError}>
              無法讀取入庫統計：{targetsItemsError}
            </p>
          )}
          {canEdit && (
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
              <div className="st-panel__field">
                <label htmlFor="st-new-probe">探針器 ID（未綁定）</label>
                <select
                  id="st-new-probe"
                  value={newTargetProbeId}
                  onChange={(e) => setNewTargetProbeId(e.target.value)}
                >
                  <option value="">請選擇</option>
                  {unboundProbeIds.map((pid) => (
                    <option key={pid} value={pid}>
                      {pid} · {resolveProbeName(pid)}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="st-panel__btn"
                onClick={addTarget}
                disabled={!newName.trim() || !newTargetProbeId}
              >
                新增追蹤
              </button>
            </div>
          )}
          <div className="st-panel__card-matrix">
            <ul className="st-panel__card-grid st-panel__card-grid--integrated">
            {targets.map((t) => (
              <li key={t.id} className={`st-panel__target-card st-panel__target-card--kind-${t.subjectKind}`}>
                <div className="st-panel__target-card__header">
                  <h3 className="st-panel__target-card__title">{t.name}</h3>
                  <div className="st-panel__target-card__toolbar">
                    <span className={`st-panel__badge ${subjectKindBadgeClass(t.subjectKind)}`}>
                      {subjectKindLabel(t.subjectKind)}
                    </span>
                    <span
                      className={`st-panel__target-card__status st-panel__target-card__status--${t.status}`}
                    >
                      <span className="st-panel__target-card__status-dot" aria-hidden="true" />
                      {t.status === 'active' ? '追蹤中' : '暫停'}
                    </span>
                  </div>
                </div>

                <div className="st-panel__target-card__probe-box">
                  <span className="st-panel__target-card__probe-label">探針器 ID</span>
                  <code id={`st-card-probe-${t.id}`} className="st-panel__probe-id st-panel__probe-id--card">
                    {t.probeId}
                  </code>
                  {(() => {
                    const probe = probes.find((p) => p.id === t.probeId)
                    return (
                      <div className="st-panel__target-card__probe-meta">
                        <div className="st-panel__target-card__probe-meta-row">
                          <span className="st-panel__target-card__probe-meta-k">節點</span>
                          <span className="st-panel__target-card__probe-meta-v">{probe?.name ?? '—'}</span>
                        </div>
                        <div className="st-panel__target-card__probe-meta-row">
                          <span className="st-panel__target-card__probe-meta-k">運行</span>
                          <span className="st-panel__target-card__probe-meta-v">
                            {probe ? probeStatusLabel(probe.status) : '—'}
                          </span>
                        </div>
                      </div>
                    )
                  })()}
                </div>

                <div className="st-panel__target-card__platform">
                  <div className="st-panel__target-card__platform-read">
                    <span className="st-panel__target-card__platform-k">平台</span>
                    <span className="st-panel__target-card__platform-v">{t.platform}</span>
                  </div>
                </div>

                {(() => {
                  const apiPlat = panelPlatformToApi(t.platform)
                  const useLive = health === 'ok' && targetsItemsFetched
                  const liveAgg = useLive ? itemsByPlatform.get(apiPlat) : undefined
                  const demoMs = t.crawlSnapshot.lastIngestAt ? Date.parse(t.crawlSnapshot.lastIngestAt) : null
                  const lastMs = useLive ? liveAgg?.lastMs ?? null : demoMs
                  const windowCount = useLive ? liveAgg?.count ?? 0 : t.crawlSnapshot.itemWindowCount
                  const { absolute, relative } = formatIngestDisplay(lastMs)
                  const windowSpan = useLive
                    ? formatWindowSpan(liveAgg?.firstMs ?? null, liveAgg?.lastMs ?? null)
                    : '—'
                  const contentMix = useLive
                    ? formatContentTypeBreakdown(liveAgg?.contentTypes ?? new Map())
                    : t.crawlSnapshot.contentMixLabel
                  const likesSum = useLive ? liveAgg?.likesSum ?? 0 : t.crawlSnapshot.engagementLikesSum
                  const commentsSum = useLive ? liveAgg?.commentsSum ?? 0 : t.crawlSnapshot.engagementCommentsSum
                  const mediaCount = useLive ? liveAgg?.withMedia ?? 0 : t.crawlSnapshot.itemsWithMedia
                  const mediaDenomLive = liveAgg?.count ?? 0
                  const mediaDenomDemo = t.crawlSnapshot.itemWindowCount
                  const mediaLine =
                    useLive && mediaDenomLive === 0
                      ? '—'
                      : !useLive && mediaDenomDemo === 0
                        ? '—'
                        : `${formatIntZh(mediaCount)} 則（約 ${Math.round((mediaCount / Math.max(1, useLive ? mediaDenomLive : mediaDenomDemo)) * 100)}%）`
                  const snap = t.crawlSnapshot
                  const nextRunDisp = formatIngestDisplay(snap.nextRunAt ? Date.parse(snap.nextRunAt) : null)
                  const sourceLabel =
                    health === 'loading'
                      ? 'SocialCrawler 連線檢查中…'
                      : useLive
                        ? `即時 · API ${apiPlat} · 視窗最多 200 筆 · payload 解析`
                        : health === 'ok' && targetsItemsLoading
                          ? '載入入庫統計…'
                          : '示範數據（後端離線或未載入時）'
                  return (
                    <div className="st-panel__target-card__crawl">
                      <div className="st-panel__target-card__crawl-title">爬蟲入庫</div>
                      <div className="st-panel__target-card__crawl-row">
                        <span className="st-panel__target-card__crawl-k">最近入庫</span>
                        <span className="st-panel__target-card__crawl-v">
                          {absolute}
                          {relative ? (
                            <span className="st-panel__target-card__crawl-rel">（{relative}）</span>
                          ) : null}
                        </span>
                      </div>
                      <div className="st-panel__target-card__crawl-row">
                        <span className="st-panel__target-card__crawl-k">視窗內筆數</span>
                        <span className="st-panel__target-card__crawl-v">
                          {windowCount} 筆
                          {useLive && (liveAgg?.count ?? 0) === 0 ? '（尚無對應平台資料）' : ''}
                        </span>
                      </div>
                      <div className="st-panel__target-card__crawl-row">
                        <span className="st-panel__target-card__crawl-k">視窗時間</span>
                        <span className="st-panel__target-card__crawl-v">{useLive ? windowSpan : '—（即時載入後顯示）'}</span>
                      </div>
                      <div className="st-panel__target-card__crawl-row">
                        <span className="st-panel__target-card__crawl-k">內容型態</span>
                        <span className="st-panel__target-card__crawl-v">{contentMix}</span>
                      </div>
                      <div className="st-panel__target-card__crawl-row">
                        <span className="st-panel__target-card__crawl-k">互動加總</span>
                        <span className="st-panel__target-card__crawl-v">
                          讚 {formatIntZh(likesSum)} · 留言 {formatIntZh(commentsSum)}
                        </span>
                      </div>
                      <div className="st-panel__target-card__crawl-row">
                        <span className="st-panel__target-card__crawl-k">含媒體</span>
                        <span className="st-panel__target-card__crawl-v">{mediaLine}</span>
                      </div>
                      <p className="st-panel__target-card__crawl-source">{sourceLabel}</p>

                      <div className="st-panel__target-card__crawl-title st-panel__target-card__crawl-title--sub">
                        任務與排程（示範）
                      </div>
                      <div className="st-panel__target-card__crawl-row">
                        <span className="st-panel__target-card__crawl-k">24h 成功／失敗</span>
                        <span className="st-panel__target-card__crawl-v">
                          {snap.jobsSuccess24h} / {snap.jobsFailed24h}
                        </span>
                      </div>
                      <div className="st-panel__target-card__crawl-row">
                        <span className="st-panel__target-card__crawl-k">下一輪採集</span>
                        <span className="st-panel__target-card__crawl-v">
                          {snap.nextRunAt ? (
                            <>
                              {nextRunDisp.absolute}
                              {nextRunDisp.relative ? (
                                <span className="st-panel__target-card__crawl-rel">（{nextRunDisp.relative}）</span>
                              ) : null}
                            </>
                          ) : (
                            '—'
                          )}
                        </span>
                      </div>
                      <p className="st-panel__target-card__crawl-source st-panel__target-card__crawl-source--dim">
                        任務節奏為面板示範欄位；實際排程與成敗統計需後端任務／排程 API。
                      </p>
                    </div>
                  )
                })()}

                {canEdit && (
                  <div className="st-panel__target-card__actions">
                    <button type="button" className="st-panel__btn-ghost" onClick={() => toggleTarget(t.id)}>
                      {t.status === 'active' ? '暫停' : '恢復'}
                    </button>
                    <button
                      type="button"
                      className="st-panel__btn-ghost"
                      onClick={() => removeTarget(t.id)}
                      title="刪除後探針器釋出，可用上方表單重新建立追蹤"
                    >
                      刪除
                    </button>
                  </div>
                )}
              </li>
            ))}
            </ul>
          </div>
        </div>
      )}

      {tab === 'probes' && (
        <div className="st-panel__panel st-panel__panel--tab">
          <h2>探針器</h2>
          <p className="st-panel__hint">
            探針器為實際執行採集／心跳的節點。綁定關係由追蹤目標上的探針器 ID 決定；未綁定者可指派給新追蹤目標。
          </p>
          {canEdit && (
            <div className="st-panel__form-row st-panel__form-row--probes">
              <div className="st-panel__field">
                <label htmlFor="st-new-probe-id">探針器 ID</label>
                <input
                  id="st-new-probe-id"
                  value={newProbeId}
                  onChange={(e) => setNewProbeId(e.target.value)}
                  placeholder="例如 PRB-EU-010"
                  autoComplete="off"
                />
              </div>
              <div className="st-panel__field">
                <label htmlFor="st-new-probe-name">顯示名稱</label>
                <input
                  id="st-new-probe-name"
                  value={newProbeName}
                  onChange={(e) => setNewProbeName(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="st-panel__field">
                <label htmlFor="st-new-probe-region">區域</label>
                <input
                  id="st-new-probe-region"
                  value={newProbeRegion}
                  onChange={(e) => setNewProbeRegion(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="st-panel__field">
                <label htmlFor="st-new-probe-st">狀態</label>
                <select
                  id="st-new-probe-st"
                  value={newProbeStatus}
                  onChange={(e) => setNewProbeStatus(e.target.value as ProbeStatus)}
                >
                  {PROBE_STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <button type="button" className="st-panel__btn" onClick={addProbe}>
                註冊探針器
              </button>
            </div>
          )}
          <div className="st-panel__table-wrap">
            <table className="st-panel__table st-panel__table--probes">
              <thead>
                <tr>
                  <th>探針器 ID</th>
                  <th>名稱</th>
                  <th>區域</th>
                  <th>狀態</th>
                  <th>綁定追蹤目標</th>
                  {canEdit && <th />}
                </tr>
              </thead>
              <tbody>
                {probes.map((p) => {
                  const bound = targets.find((t) => t.probeId === p.id)
                  return (
                    <tr key={p.id}>
                      <td>
                        <code className="st-panel__probe-id st-panel__probe-id--table">{p.id}</code>
                      </td>
                      <td>
                        {canEdit ? (
                          <input
                            className="st-panel__table-input"
                            value={p.name}
                            onChange={(e) => patchProbe(p.id, { name: e.target.value })}
                            aria-label={`探針器 ${p.id} 顯示名稱`}
                            placeholder="名稱"
                          />
                        ) : (
                          p.name
                        )}
                      </td>
                      <td>
                        {canEdit ? (
                          <input
                            className="st-panel__table-input"
                            value={p.region}
                            onChange={(e) => patchProbe(p.id, { region: e.target.value })}
                            aria-label={`探針器 ${p.id} 區域`}
                            placeholder="區域"
                          />
                        ) : (
                          p.region
                        )}
                      </td>
                      <td>
                        {canEdit ? (
                          <select
                            className="st-panel__table-select"
                            value={p.status}
                            onChange={(e) => patchProbe(p.id, { status: e.target.value as ProbeStatus })}
                            aria-label={`探針器 ${p.id} 運行狀態`}
                          >
                            {PROBE_STATUS_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          probeStatusLabel(p.status)
                        )}
                      </td>
                      <td>{bound ? bound.name : '—'}</td>
                      {canEdit && (
                        <td>
                          <button
                            type="button"
                            className="st-panel__btn-ghost"
                            disabled={!!bound}
                            title={bound ? '請先解除追蹤目標綁定' : '刪除此探針器'}
                            onClick={() => removeProbe(p.id)}
                          >
                            刪除
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'crawl' && (
        <div className="st-panel__panel st-panel__panel--tab st-panel__panel--tab-crawl">
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
    </div>
  )
}
