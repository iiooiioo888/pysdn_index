import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './labPanelStyles.css'

const ENTITIES = [
  { icon: '👤', name: '@design_daily', kind: 'up' as const, m: '+12.4%' },
  { icon: '🏢', name: 'BrandX Studio', kind: 'hot' as const, m: '🔥 熱詞' },
  { icon: '👤', name: '@ai_creative', kind: 'up' as const, m: '+8.7%' },
  { icon: '👤', name: '@cyberpunk_art', kind: 'flat' as const, m: '穩定' },
  { icon: '👤', name: '@neon_editor', kind: 'up' as const, m: '+5.1%' },
  { icon: '🏢', name: 'FluxWorks', kind: 'up' as const, m: '+3.0%' },
  { icon: '👤', name: '@shortfilm_lab', kind: 'hot' as const, m: '警報' },
  { icon: '👤', name: '@visual_poem', kind: 'flat' as const, m: '觀望' },
  { icon: '👤', name: '@synth_cinema', kind: 'up' as const, m: '+6.8%' },
  { icon: '🏢', name: 'Nebula Ads', kind: 'up' as const, m: '+2.2%' },
  { icon: '👤', name: '@vfx_breakdown', kind: 'flat' as const, m: '盤整' },
  { icon: '👤', name: '@lofi_radar', kind: 'hot' as const, m: '情緒尖峰' },
] as const

const TRENDS = [
  { rank: '#1', name: '賽博龐克 AI', w: 94, heat: '🔥340%' },
  { rank: '#2', name: '數位孿生倫理', w: 78, heat: '🔥210%' },
  { rank: '#3', name: '短劇爆發期', w: 72, heat: '↑185%' },
  { rank: '#4', name: '虛擬偶像 IP', w: 65, heat: '↑142%' },
  { rank: '#5', name: 'RAG 知識庫', w: 61, heat: '↑128%' },
  { rank: '#6', name: 'AI 配音一致性', w: 58, heat: '↑110%' },
  { rank: '#7', name: '品牌短影音', w: 54, heat: '↑98%' },
  { rank: '#8', name: '互動劇分支', w: 49, heat: '↑86%' },
  { rank: '#9', name: '微短劇三幕化', w: 46, heat: '↑79%' },
  { rank: '#10', name: '生成浮水印倫理', w: 42, heat: '↑71%' },
  { rank: '#11', name: '音樂版權探路', w: 38, heat: '↑64%' },
  { rank: '#12', name: 'UGC 二創合規', w: 35, heat: '↑58%' },
] as const

const ALERTS = [
  { t: '09:12', sev: 'P1', who: '@design_daily', what: '互動率 3× baseline' },
  { t: '08:44', sev: 'P2', who: 'BrandX Studio', what: '新話題 #cybercafe 升溫' },
  { t: '01:15', sev: 'P2', who: '@ai_creative', what: '夜間增粉 +2.1% / 15m' },
  { t: '昨 23:40', sev: '—', who: '系統', what: '全域情緒指數 0.78' },
  { t: '昨 20:11', sev: 'P1', who: '@shortfilm_lab', what: '貼文延遲 12m 仍觸發預警' },
  { t: '07:50', sev: 'P0', who: '@lofi_radar', what: '負面情緒突增 0.22 → 0.41 / 1h' },
  { t: '07:12', sev: 'P2', who: 'FluxWorks', what: '關鍵字「配音一致性」闖入榜單' },
  { t: '06:33', sev: 'P2', who: '@synth_cinema', what: '轉推鏈 19 跳，疑似機器人簇群' },
  { t: '05:10', sev: 'P3', who: 'Nebula Ads', what: '投放素材 A/B 點擊分岔 18%' },
  { t: '04:01', sev: 'P2', who: '系統', what: '爬蟲節流：IG story 欄位 429×12' },
  { t: '02:40', sev: 'P1', who: '@vfx_breakdown', what: '留言「造假疑雲」熱度爬升' },
  { t: '昨 22:15', sev: 'P2', who: '@cyberpunk_art', what: '互動中樞但分享率低於同儕' },
] as const

const AUDIENCE = [
  { a: '🧑‍💻', n: 'Z 世代數位原住民', m: '18-25 · 影迷', s: 87 },
  { a: '👨‍👩‍👧', n: '家庭觀影族群', m: '30-45 · 闔家', s: 74 },
  { a: '🎬', n: '影評 / 影迷', m: '25-50 · 核心', s: 81 },
  { a: '🧵', n: '劇作研究員', m: '22-40 · 深度', s: 79 },
  { a: '🛒', n: '品牌內容採購', m: '28-55 · B2B', s: 72 },
  { a: '🎧', n: '播客/解說 up', m: '20-38 · 二次創作', s: 77 },
]

/** 主流分享／社群平台訊號來源（示範矩陣；實際以合規與平台策略為準） */
const PLATFORMS = [
  { p: '小紅書', sig: 3620, lat: '2.0s', q: '簽名 ok', miss: '0.5%' },
  { p: '抖音', sig: 5840, lat: '1.1s', q: 'ok', miss: '0.3%' },
  { p: '快手', sig: 3210, lat: '1.4s', q: 'ok', miss: '0.6%' },
  { p: 'Bilibili', sig: 2980, lat: '1.6s', q: 'ok', miss: '0.4%' },
  { p: '微博', sig: 2650, lat: '0.9s', q: '限流', miss: '1.0%' },
  { p: '微信影片號／公眾號', sig: 1180, lat: '3.2s', q: '公開範圍', miss: '2.1%' },
  { p: 'TikTok（國際）', sig: 5102, lat: '0.9s', q: 'ok', miss: '0.2%' },
  { p: 'Instagram', sig: 2890, lat: '2.8s', q: '429 節流', miss: '1.1%' },
  { p: 'X (Twitter)', sig: 4120, lat: '1.2s', q: 'ok', miss: '0.4%' },
  { p: 'YouTube', sig: 2240, lat: '2.2s', q: 'ok', miss: '0.5%' },
  { p: 'Facebook', sig: 1560, lat: '2.5s', q: 'ok', miss: '0.9%' },
  { p: 'Threads', sig: 920, lat: '1.8s', q: 'ok', miss: '1.2%' },
  { p: 'LinkedIn', sig: 480, lat: '1.5s', q: 'ok', miss: '0.8%' },
  { p: 'Reddit', sig: 640, lat: '1.4s', q: '審查延遲', miss: '2.0%' },
  { p: 'Telegram 公開頻道', sig: 410, lat: '1.1s', q: 'ok', miss: '1.4%' },
  { p: '新聞 RSS', sig: 210, lat: '0.3s', q: 'ok', miss: '0%' },
] as const

const GEO = [
  { r: '東亞', h: 88 },
  { r: '北美西岸', h: 72 },
  { r: '歐陸 DACH', h: 54 },
  { r: '拉美', h: 61 },
  { r: '其他', h: 43 },
]

const MOOD_MIX = [
  { dim: '喜', w: 22 },
  { dim: '驚', w: 18 },
  { dim: '怒', w: 8 },
  { dim: '哀', w: 11 },
  { dim: '厭(疲)', w: 15 },
  { dim: '信任', w: 26 },
]

const COMPET = [
  { b: '品牌 A', sov: 32, dsov: '+2.1' },
  { b: '品牌 B', sov: 24, dsov: '−0.4' },
  { b: '我們', sov: 19, dsov: '+0.8' },
  { b: '長尾帳號', sov: 25, dsov: '—' },
]

const CONTENT_MIX = [
  { t: '短影片', p: 44 },
  { t: '圖文 / 輪播', p: 28 },
  { t: '直播切片', p: 12 },
  { t: '純文字串文', p: 9 },
  { t: '音訊 / 播客', p: 7 },
]

const FUNNEL = [
  { st: '曝光', p: 100, drop: '—' },
  { st: '互動', p: 38, drop: '62%' },
  { st: '點擊外連', p: 12, drop: '68%' },
  { st: '轉私域', p: 4, drop: '66%' },
]

const TRUST_INT = [
  { k: '帳號合併置信', v: 0.91, note: '跨平台' },
  { k: 'bot / 假互動風險', v: 0.12, note: '低' },
  { k: '同簇操控嫌疑', v: 0.08, note: '監控中' },
  { k: '來源多樣性', v: 0.86, note: '健康' },
]

type DashboardKpi = {
  entities: number
  alerts24h: number
  alertsBarPct: number
  hotTopics: number
  sentiment: number
  crawlRate: number
  signalsPerMin: number
  noiseFilter: number
  latencyP95: number
  entityLink: number
  shareVoice: number
  toxicity: number
  topicDrift: number
  langZh: number
}

type RoiState = {
  mult: number
  audienceFit: number
  genreMatch: number
  trendAlign: number
}

/** 小紅書／Spider_XHS 能力地圖對照之示範數據（非真實後端） */
type XhsDemoState = {
  notes24h: number
  commentBatches: number
  searchJobs: number
  kolSnapshots: number
  creatorQueue: number
  cookieHoursLeft: number
  apiSuccessPct: number
  signerLabel: string
}

const SIGNER_LABEL_POOL = ['PC xs · v56 示範', 'PC+Creator 簽名 · 示範', '靜態 JS 引擎 · 示範'] as const

const DEFAULT_XHS: XhsDemoState = {
  notes24h: 142,
  commentBatches: 54,
  searchJobs: 11,
  kolSnapshots: 9,
  creatorQueue: 2,
  cookieHoursLeft: 21,
  apiSuccessPct: 97.6,
  signerLabel: 'PC xs · v56 示範',
}

const DEFAULT_KPI: DashboardKpi = {
  entities: 42,
  alerts24h: 12,
  alertsBarPct: 62,
  hotTopics: 16,
  sentiment: 0.78,
  crawlRate: 98.2,
  signalsPerMin: 168,
  noiseFilter: 91,
  latencyP95: 2.1,
  entityLink: 98.1,
  shareVoice: 19,
  toxicity: 3.1,
  topicDrift: 0.04,
  langZh: 72,
}

const DEFAULT_ROI: RoiState = {
  mult: 3.4,
  audienceFit: 0.86,
  genreMatch: 0.91,
  trendAlign: 0.75,
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function jitterKpi(prev: DashboardKpi): DashboardKpi {
  const r = () => (Math.random() - 0.5) * 2
  return {
    entities: Math.round(clamp(prev.entities + r() * 6, 30, 55)),
    alerts24h: Math.round(clamp(prev.alerts24h + r() * 4, 5, 22)),
    alertsBarPct: Math.round(clamp(prev.alertsBarPct + r() * 15, 35, 92)),
    hotTopics: Math.round(clamp(prev.hotTopics + r() * 5, 8, 24)),
    sentiment: clamp(prev.sentiment + r() * 0.06, 0.55, 0.92),
    crawlRate: clamp(prev.crawlRate + r() * 1.2, 94.5, 99.4),
    signalsPerMin: Math.round(clamp(prev.signalsPerMin + r() * 40, 110, 240)),
    noiseFilter: Math.round(clamp(prev.noiseFilter + r() * 8, 78, 97)),
    latencyP95: clamp(prev.latencyP95 + r() * 0.5, 0.8, 4.2),
    entityLink: clamp(prev.entityLink + r() * 1.5, 93, 99.6),
    shareVoice: Math.round(clamp(prev.shareVoice + r() * 5, 12, 32)),
    toxicity: clamp(prev.toxicity + r() * 1.2, 1.2, 8.5),
    topicDrift: clamp(prev.topicDrift + r() * 0.03, 0.01, 0.14),
    langZh: Math.round(clamp(prev.langZh + r() * 10, 55, 85)),
  }
}

function jitterRoi(prev: RoiState): RoiState {
  const r = () => (Math.random() - 0.5) * 2
  return {
    mult: clamp(prev.mult + r() * 0.35, 2.4, 4.2),
    audienceFit: clamp(prev.audienceFit + r() * 0.06, 0.65, 0.96),
    genreMatch: clamp(prev.genreMatch + r() * 0.05, 0.72, 0.97),
    trendAlign: clamp(prev.trendAlign + r() * 0.08, 0.55, 0.92),
  }
}

function jitterXhs(prev: XhsDemoState): XhsDemoState {
  const r = () => (Math.random() - 0.5) * 2
  return {
    notes24h: Math.round(clamp(prev.notes24h + r() * 35, 70, 260)),
    commentBatches: Math.round(clamp(prev.commentBatches + r() * 12, 28, 88)),
    searchJobs: Math.round(clamp(prev.searchJobs + r() * 4, 4, 22)),
    kolSnapshots: Math.round(clamp(prev.kolSnapshots + r() * 3, 3, 18)),
    creatorQueue: Math.round(clamp(prev.creatorQueue + r() * 2, 0, 8)),
    cookieHoursLeft: clamp(prev.cookieHoursLeft + r() * 6, 4, 72),
    apiSuccessPct: clamp(prev.apiSuccessPct + r() * 1.2, 93.5, 99.2),
    signerLabel: SIGNER_LABEL_POOL[Math.floor(Math.random() * SIGNER_LABEL_POOL.length)],
  }
}

type SuperTrackLabPanelProps = {
  /** lab：實驗室頁；assistant：全網追蹤助手獨立面板 */
  context?: 'lab' | 'assistant'
}

type AlertSevFilter = 'all' | 'P0' | 'P1' | 'P2' | 'P3' | 'other'

export function SuperTrackLabPanel({ context = 'lab' }: SuperTrackLabPanelProps = {}) {
  const contextBadge = context === 'assistant' ? '全網追蹤助手 · 示範資料' : 'LAB · 示範資料'
  const [kpi, setKpi] = useState<DashboardKpi>(() => ({ ...DEFAULT_KPI }))
  const [roi, setRoi] = useState<RoiState>(() => ({ ...DEFAULT_ROI }))
  const [xhs, setXhs] = useState<XhsDemoState>(() => ({ ...DEFAULT_XHS }))
  const [syncBusy, setSyncBusy] = useState(false)
  const [exportBusy, setExportBusy] = useState(false)
  const [injectBusy, setInjectBusy] = useState(false)
  const [statusMsg, setStatusMsg] = useState<string | null>(null)
  const [entityQuery, setEntityQuery] = useState('')
  const [alertSev, setAlertSev] = useState<AlertSevFilter>('all')
  const [selectedTrendRank, setSelectedTrendRank] = useState<string | null>(null)

  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showStatus = useCallback((msg: string) => {
    if (statusTimer.current) clearTimeout(statusTimer.current)
    setStatusMsg(msg)
    statusTimer.current = setTimeout(() => {
      setStatusMsg(null)
      statusTimer.current = null
    }, 4500)
  }, [])

  useEffect(() => {
    return () => {
      if (statusTimer.current) clearTimeout(statusTimer.current)
    }
  }, [])

  const filteredEntities = useMemo(() => {
    const q = entityQuery.trim().toLowerCase()
    if (!q) return [...ENTITIES]
    return ENTITIES.filter((e) => e.name.toLowerCase().includes(q))
  }, [entityQuery])

  const filteredAlerts = useMemo(() => {
    if (alertSev === 'all') return [...ALERTS]
    if (alertSev === 'other') return ALERTS.filter((a) => a.sev === '—')
    return ALERTS.filter((a) => a.sev === alertSev)
  }, [alertSev])

  const injectHooks = useMemo(() => {
    if (selectedTrendRank != null) {
      const one = TRENDS.find((t) => t.rank === selectedTrendRank)
      return one ? [one.name] : TRENDS.slice(0, 3).map((t) => t.name)
    }
    return TRENDS.slice(0, 3).map((t) => t.name)
  }, [selectedTrendRank])

  const handleRetryAll = useCallback(() => {
    if (syncBusy) return
    setSyncBusy(true)
    window.setTimeout(() => {
      setKpi((prev) => jitterKpi(prev))
      setRoi((prev) => jitterRoi(prev))
      setXhs((prev) => jitterXhs(prev))
      setSyncBusy(false)
      showStatus('已重新同步示範資料（KPI／ROI／小紅書管線已擾動）')
    }, 520)
  }, [syncBusy, showStatus])

  const handleExport = useCallback(() => {
    if (exportBusy) return
    setExportBusy(true)
    try {
      const report = {
        title: 'SuperTrack 示範報告',
        disclaimer: '數值為前端示範，不代表真實平台',
        generated_at: new Date().toISOString(),
        kpi,
        roi,
        xhs_pipeline: xhs,
        xhs_reference_repo: 'https://github.com/cv-cat/Spider_XHS',
        top_trends: TRENDS.slice(0, 8),
        alerts_sample: ALERTS.slice(0, 8),
        entities_tracked: ENTITIES.map((e) => e.name),
      }
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
      a.href = url
      a.download = `supertrack-report-${stamp}.json`
      a.rel = 'noopener'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showStatus('已下載 JSON 報告（示範匯出）')
    } catch {
      showStatus('匯出失敗，請稍後再試')
    } finally {
      window.setTimeout(() => setExportBusy(false), 200)
    }
  }, [exportBusy, kpi, roi, xhs, showStatus])

  const handleInjectScript = useCallback(async () => {
    if (injectBusy) return
    setInjectBusy(true)
    const payload = {
      source: 'supertrack',
      action: 'inject_superscript',
      generated_at: new Date().toISOString(),
      topic_hooks: injectHooks,
      selected_rank: selectedTrendRank,
      note: '示範：正式環境將由 SuperScript API 接收',
    }
    const text = JSON.stringify(payload, null, 2)
    try {
      await navigator.clipboard.writeText(text)
      showStatus('已複製注入 payload 到剪貼簿（JSON）')
    } catch {
      showStatus('無法寫入剪貼簿，請手動複製主控台 payload')
      console.info('[SuperTrack inject demo]', text)
    } finally {
      window.setTimeout(() => setInjectBusy(false), 200)
    }
  }, [injectBusy, injectHooks, selectedTrendRank, showStatus])

  const toggleTrendRow = useCallback((rank: string) => {
    setSelectedTrendRank((prev) => (prev === rank ? null : rank))
  }, [])

  return (
    <div className="sim-panel sim-panel--lab">
      <div
        className="sim-track-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {statusMsg ?? ''}
      </div>

      <div className="sim-header">
        <div className="sim-header-left">
          <span className="sim-icon">🛰️</span>
          <span className="sim-title">SuperTrack</span>
          <span className="sim-badge sim-badge--green">SIGNAL TRACKING</span>
          <span className="sim-live">
            <span className="sim-dot sim-dot--green" /> LIVE
          </span>
          <span className="sim-badge-soft" style={{ marginLeft: 8 }}>
            {contextBadge}
          </span>
        </div>
        <div className="sim-header-right">
          <button
            type="button"
            className="sim-btn"
            disabled={syncBusy}
            onClick={handleRetryAll}
          >
            {syncBusy ? '⏳ 同步中…' : '🔄 重試全部'}
          </button>
          <button
            type="button"
            className="sim-btn sim-btn--outline"
            disabled={exportBusy}
            onClick={handleExport}
          >
            {exportBusy ? '…' : '📤 匯出報告'}
          </button>
        </div>
      </div>

      <p className="doc-lab-note">
        即時 KPI：實體、警報、熱詞、情緒、爬蟲成功率、訊號量；含小紅書採集管線示範與平台矩陣。
      </p>
      <div className="sim-kpis" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        <div className="sim-kpi">
          <div className="sim-kpi-label">entities</div>
          <div className="sim-kpi-val">{kpi.entities}</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">alerts (24h)</div>
          <div className="sim-kpi-val sim-kpi-val--highlight">{kpi.alerts24h}</div>
          <div className="sim-bar">
            <div className="sim-bar-fill sim-bar-fill--green" style={{ width: `${kpi.alertsBarPct}%` }} />
          </div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">hot_topics</div>
          <div className="sim-kpi-val sim-kpi-val--highlight">{kpi.hotTopics}</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">sentiment</div>
          <div className="sim-kpi-val">{kpi.sentiment.toFixed(2)}</div>
          <div className="sim-bar">
            <div
              className="sim-bar-fill sim-bar-fill--green"
              style={{ width: `${Math.round(kpi.sentiment * 100)}%` }}
            />
          </div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">crawl_rate</div>
          <div className="sim-kpi-val">{kpi.crawlRate.toFixed(1)}%</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">signals/min</div>
          <div className="sim-kpi-val">{kpi.signalsPerMin}</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">noise filter</div>
          <div className="sim-kpi-val">{kpi.noiseFilter}%</div>
          <div className="sim-kpi-sub">已剃除機器/重複</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">跨平台延遲 p95</div>
          <div className="sim-kpi-val">{kpi.latencyP95.toFixed(1)}s</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">entity_link</div>
          <div className="sim-kpi-val">{kpi.entityLink.toFixed(1)}%</div>
          <div className="sim-kpi-sub">合併成功率</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">share_voice</div>
          <div className="sim-kpi-val">{kpi.shareVoice}%</div>
          <div className="sim-kpi-sub">本品牌 SOV</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">toxicity(估)</div>
          <div className="sim-kpi-val">{kpi.toxicity.toFixed(1)}%</div>
          <div className="sim-kpi-sub">負向尖峰可告警</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">topic_drift</div>
          <div className="sim-kpi-val">{kpi.topicDrift.toFixed(2)}</div>
          <div className="sim-kpi-sub">24h 向量位移</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">lang_mix</div>
          <div className="sim-kpi-val">zh {kpi.langZh}%</div>
          <div className="sim-kpi-sub">en/ja 副語</div>
        </div>
      </div>

      <div className="sim-card sim-card--xhs" style={{ marginTop: 14 }}>
        <div className="sim-card-head">📒 小紅書採集管線（示範 · 對照 Spider_XHS）</div>
        <p className="sim-mini-hint" style={{ marginBottom: 10 }}>
          下列數值為儀表板示範，欄位意涵對齊社群專案{' '}
          <a
            href="https://github.com/cv-cat/Spider_XHS"
            target="_blank"
            rel="noopener noreferrer"
            className="sim-ext-link"
          >
            Spider_XHS
          </a>
          （PC 端／創作者／蒲公英等模組）；正式環境須遵守平台條款與授權。
        </p>
        <div
          className="sim-kpis sim-kpis--compact"
          style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', marginTop: 0 }}
        >
          <div className="sim-kpi">
            <div className="sim-kpi-label">xhs 筆記 24h</div>
            <div className="sim-kpi-val sim-kpi-val--highlight">{xhs.notes24h}</div>
            <div className="sim-kpi-sub">入庫（搜尋+詳情）</div>
          </div>
          <div className="sim-kpi">
            <div className="sim-kpi-label">評論批次</div>
            <div className="sim-kpi-val">{xhs.commentBatches}</div>
            <div className="sim-kpi-sub">本輪抓取</div>
          </div>
          <div className="sim-kpi">
            <div className="sim-kpi-label">關鍵字任務</div>
            <div className="sim-kpi-val">{xhs.searchJobs}</div>
            <div className="sim-kpi-sub">監控佇列</div>
          </div>
          <div className="sim-kpi">
            <div className="sim-kpi-label">API 成功率</div>
            <div className="sim-kpi-val">{xhs.apiSuccessPct.toFixed(1)}%</div>
            <div className="sim-kpi-sub">PC 端示範</div>
          </div>
        </div>
        <div className="sim-table-wrap" style={{ marginTop: 12 }}>
          <table className="sim-table">
            <thead>
              <tr>
                <th>能力面向</th>
                <th>對照模組（概念）</th>
                <th>示範狀態</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>PC 端筆記／搜尋</td>
                <td className="sim-mono">xhs_pc_apis</td>
                <td>
                  運作中 · 本日 {xhs.notes24h} 筆 · 搜尋任務 {xhs.searchJobs}
                </td>
              </tr>
              <tr>
                <td>筆記評論</td>
                <td className="sim-mono">get_note_comments</td>
                <td>本日批次 {xhs.commentBatches}</td>
              </tr>
              <tr>
                <td>創作者發布</td>
                <td className="sim-mono">xhs_creator_apis</td>
                <td>佇列待發 {xhs.creatorQueue} 則</td>
              </tr>
              <tr>
                <td>蒲公英 KOL</td>
                <td className="sim-mono">xhs_pugongying_apis</td>
                <td>快照 {xhs.kolSnapshots} 位</td>
              </tr>
              <tr>
                <td>登入 Cookie 時效</td>
                <td className="sim-mono">.env COOKIES</td>
                <td>約剩 {Math.max(1, Math.round(xhs.cookieHoursLeft))} h（示範）</td>
              </tr>
              <tr>
                <td>簽名／JS 引擎</td>
                <td className="sim-mono">static/*.js</td>
                <td>{xhs.signerLabel}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="sim-grid-2" style={{ marginTop: 12 }}>
        <div className="sim-card">
          <div className="sim-card-head">情緒混合（6 維度 · 相對佔比）</div>
          <p className="sim-mini-hint">從多模態內容與互動情緒反饋綜合，示範非臨床診斷。</p>
          {MOOD_MIX.map((m) => (
            <div key={m.dim} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                <span>{m.dim}</span>
                <span className="sim-mono">{m.w}%</span>
              </div>
              <div className="sim-bar" style={{ marginTop: 4 }}>
                <div className="sim-bar-fill sim-bar-fill--amber" style={{ width: `${m.w * 2.5}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="sim-card">
          <div className="sim-card-head">競品聲量佔比（SOV %）</div>
          <div className="sim-table-wrap">
            <table className="sim-table">
              <thead>
                <tr>
                  <th>主體</th>
                  <th>聲量</th>
                  <th>週變化</th>
                </tr>
              </thead>
              <tbody>
                {COMPET.map((c) => (
                  <tr key={c.b}>
                    <td>{c.b}</td>
                    <td className="sim-mono">{c.sov}%</td>
                    <td
                      style={{
                        color:
                          c.dsov === '—'
                            ? 'var(--text-muted)'
                            : c.dsov.startsWith('−') || c.dsov.startsWith('-')
                              ? '#f87171'
                              : '#4ade80',
                      }}
                    >
                      {c.dsov}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="sim-grid-2" style={{ marginTop: 12 }}>
        <div className="sim-card">
          <div className="sim-card-head">內容型態結構</div>
          {CONTENT_MIX.map((c) => (
            <div key={c.t} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                <span>{c.t}</span>
                <span className="sim-mono">{c.p}%</span>
              </div>
              <div className="sim-bar" style={{ marginTop: 4 }}>
                <div className="sim-bar-fill sim-bar-fill--green" style={{ width: `${c.p * 1.5}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="sim-card">
          <div className="sim-card-head">轉化漏斗（相對 100% 曝光）</div>
          <div className="sim-table-wrap">
            <table className="sim-table">
              <thead>
                <tr>
                  <th>階段</th>
                  <th>到達 %</th>
                  <th>層內衰減</th>
                </tr>
              </thead>
              <tbody>
                {FUNNEL.map((f) => (
                  <tr key={f.st}>
                    <td>{f.st}</td>
                    <td className="sim-mono">{f.p}%</td>
                    <td>{f.drop}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="sim-card" style={{ marginTop: 12 }}>
        <div className="sim-card-head">信任與風險層</div>
        <div className="sim-grid-2" style={{ marginTop: 4 }}>
          <div>
            {TRUST_INT.map((r) => (
              <div className="sim-net-row" key={r.k} style={{ marginBottom: 4 }}>
                <span style={{ fontSize: '0.65rem' }}>{r.k}</span>
                <div className="sim-bar" style={{ flex: 1, margin: '0 6px' }}>
                  <div className="sim-bar-fill sim-bar-fill--green" style={{ width: `${r.v * 100}%` }} />
                </div>
                <span className="sim-mono" style={{ fontSize: '0.65rem' }}>
                  {(r.v * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
          <p className="sim-mini-hint" style={{ margin: 0 }}>
            與帳號合併、行為叢集、內容多樣性一併監控；高風險觸發可降權或人工覆核。
          </p>
        </div>
      </div>

      <div className="sim-grid-2" style={{ marginTop: 12 }}>
        <div className="sim-card">
          <div className="sim-card-head">訊號來源佔比（主流平台 · {PLATFORMS.length} · 示範）</div>
          <div className="sim-table-wrap">
            <table className="sim-table">
              <thead>
                <tr>
                  <th>平台</th>
                  <th>sig/h</th>
                  <th>延遲</th>
                  <th>品質</th>
                  <th>漏抓</th>
                </tr>
              </thead>
              <tbody>
                {PLATFORMS.map((r) => (
                  <tr key={r.p}>
                    <td>{r.p}</td>
                    <td className="sim-mono">{r.sig.toLocaleString()}</td>
                    <td>{r.lat}</td>
                    <td>{r.q}</td>
                    <td>{r.miss}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="sim-card">
          <div className="sim-card-head">地理情緒熱力（相對 0–100）</div>
          <p className="sim-mini-hint">與內容投放與配樂風險參考；非真實人口統計。</p>
          {GEO.map((g) => (
            <div key={g.r} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                <span>{g.r}</span>
                <span className="sim-mono">{g.h}</span>
              </div>
              <div className="sim-bar" style={{ marginTop: 4 }}>
                <div className="sim-bar-fill sim-bar-fill--red" style={{ width: `${g.h}%`, opacity: 0.75 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sim-card" style={{ marginTop: 16 }}>
        <div className="sim-card-head sim-card-head--row">
          <span>最近警報（{filteredAlerts.length} 筆 · 示範）</span>
          <label className="sim-filter-label">
            <span className="sim-sr-only">依嚴重度篩選</span>
            <select
              className="sim-filter-input"
              value={alertSev}
              onChange={(e) => setAlertSev(e.target.value as AlertSevFilter)}
            >
              <option value="all">全部嚴重度</option>
              <option value="P0">P0</option>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
              <option value="other">系統／其他（—）</option>
            </select>
          </label>
        </div>
        <div className="sim-table-wrap">
          <table className="sim-table">
            <thead>
              <tr>
                <th>時間</th>
                <th>嚴重度</th>
                <th>對象</th>
                <th>內容</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="sim-table-empty">
                    此條件下沒有警報
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((a) => (
                  <tr key={a.t + a.who + a.what}>
                    <td className="sim-mono">{a.t}</td>
                    <td>
                      <span
                        className="sim-badge-soft"
                        style={
                          a.sev === 'P0'
                            ? { color: '#fecaca', border: '1px solid rgba(239,68,68,0.35)' }
                            : undefined
                        }
                      >
                        {a.sev}
                      </span>
                    </td>
                    <td>{a.who}</td>
                    <td>{a.what}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="doc-lab-note" style={{ marginTop: 12 }}>
        追蹤中的帳號：顯示 {filteredEntities.length} / {ENTITIES.length} 筆；含上升、熱詞與穩定狀態。
      </p>
      <div className="sim-card">
        <div className="sim-card-head sim-card-head--row">
          <span>📡 追蹤中的帳號</span>
          <input
            type="search"
            className="sim-filter-input sim-filter-input--grow"
            placeholder="篩選帳號名稱…"
            value={entityQuery}
            onChange={(e) => setEntityQuery(e.target.value)}
            aria-label="篩選追蹤帳號"
          />
        </div>
        <div className="sim-entity-list">
          {filteredEntities.length === 0 ? (
            <p className="sim-table-empty sim-table-empty--pad">沒有符合條件的帳號</p>
          ) : (
            filteredEntities.map((e) => (
              <div className="sim-entity" key={e.name}>
                <span className="sim-entity-icon">{e.icon}</span>
                <span className="sim-entity-name">{e.name}</span>
                <span
                  className={
                    e.kind === 'up'
                      ? 'sim-entity-metric sim-entity-metric--up'
                      : e.kind === 'hot'
                        ? 'sim-entity-metric sim-entity-metric--alert'
                        : 'sim-entity-metric'
                  }
                >
                  {e.m}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="sim-grid-2" style={{ marginTop: 12 }}>
        <div className="sim-card">
          <div className="sim-card-head">👥 觀眾畫像（6 群組）</div>
          <div className="sim-audience">
            {AUDIENCE.map((r) => (
              <div className="sim-audience-row" key={r.n}>
                <span className="sim-audience-avatar">{r.a}</span>
                <div className="sim-audience-info">
                  <div className="sim-audience-name">{r.n}</div>
                  <div className="sim-audience-meta">{r.m}</div>
                </div>
                <span className="sim-audience-score" style={{ color: r.s >= 80 ? '#22c55e' : '#f59e0b' }}>
                  {r.s}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="sim-card">
          <div className="sim-card-head">📡 熱詞趨勢（TOP {TRENDS.length}）</div>
          <p className="sim-mini-hint" style={{ marginBottom: 8 }}>
            點列可選定要注入的熱詞（未選時預設取前三項）；再按「一鍵注入腳本」複製 JSON。
          </p>
          <div className="sim-trend">
            {TRENDS.map((r) => {
              const selected = selectedTrendRank === r.rank
              return (
                <button
                  key={r.rank}
                  type="button"
                  className={`sim-trend-row sim-trend-row--btn${selected ? ' sim-trend-row--selected' : ''}`}
                  onClick={() => toggleTrendRow(r.rank)}
                >
                  <span className="sim-trend-rank">{r.rank}</span>
                  <span className="sim-trend-name">{r.name}</span>
                  <div className="sim-bar">
                    <div
                      className="sim-bar-fill sim-bar-fill--red"
                      style={{ width: `${r.w}%`, opacity: r.w > 80 ? 1 : 0.85 }}
                    />
                  </div>
                  <span className="sim-trend-heat">{r.heat}</span>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            className="sim-btn sim-btn--primary"
            style={{ marginTop: 8, width: '100%', textAlign: 'center' }}
            disabled={injectBusy}
            onClick={() => void handleInjectScript()}
          >
            {injectBusy ? '…' : '💉 一鍵注入腳本'}
          </button>
        </div>
      </div>

      <div className="sim-card" style={{ marginTop: 12 }}>
        <div className="sim-card-head">💰 商業潛力預測</div>
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div style={{ fontSize: '0.6rem', color: 'rgba(148,163,184,0.4)' }}>ROI PREDICT</div>
          <div
            style={{
              fontSize: '2.2rem',
              fontWeight: 800,
              color: '#34d399',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {roi.mult.toFixed(1)}×
          </div>
        </div>
        <div className="sim-net-metrics">
          <div className="sim-net-row">
            <span>audience_fit</span>
            <div className="sim-bar">
              <div
                className="sim-bar-fill sim-bar-fill--green"
                style={{ width: `${roi.audienceFit * 100}%` }}
              />
            </div>
            <span>{roi.audienceFit.toFixed(2)}</span>
          </div>
          <div className="sim-net-row">
            <span>genre_match</span>
            <div className="sim-bar">
              <div
                className="sim-bar-fill sim-bar-fill--green"
                style={{ width: `${roi.genreMatch * 100}%` }}
              />
            </div>
            <span>{roi.genreMatch.toFixed(2)}</span>
          </div>
          <div className="sim-net-row">
            <span>trend_align</span>
            <div className="sim-bar">
              <div
                className="sim-bar-fill sim-bar-fill--green"
                style={{ width: `${roi.trendAlign * 100}%` }}
              />
            </div>
            <span>{roi.trendAlign.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
