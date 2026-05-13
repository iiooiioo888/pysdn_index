import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiService } from '../../lib/api'
import { PATHS } from '../../routes/paths'
import { RealmsPageShell } from './RealmsPageShell'

/* ─── types ─── */
type FlowStep = 'idle' | 'tianyu-init' | 'jingjie-crawl' | 'jingjie-process' | 'tianyu-finalize' | 'done' | 'error'
type FlowLog = { at: string; step: string; detail: string; icon: LogIconKind }
type LogIconKind = 'tianyu' | 'jingjie' | 'shenyu' | 'done' | 'error' | 'data' | 'arrow'

/* ─── SVG icons ─── */
function TianyuIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" opacity="0.3" />
      <path d="M12 2a10 10 0 0 1 0 20" strokeDasharray="4 3" />
      <path d="M12 6v6l4 2" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </svg>
  )
}

function JingjieIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" opacity="0.3" />
      <path d="M3 9h18" />
      <path d="M9 3v18" />
      <circle cx="15" cy="15" r="3" />
      <path d="M17.5 17.5L21 21" />
    </svg>
  )
}

function ShenyuIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" opacity="0.3" />
      <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
    </svg>
  )
}

function ArrowRightIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  )
}

function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function ErrorIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6" />
      <path d="M9 9l6 6" />
    </svg>
  )
}

function DataIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
    </svg>
  )
}

function CrawlerIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4" /><path d="M12 18v4" />
      <path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" />
      <path d="M2 12h4" /><path d="M18 12h4" />
      <path d="M4.93 19.07l2.83-2.83" /><path d="M16.24 7.76l2.83-2.83" />
    </svg>
  )
}

function BrainIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a5 5 0 0 1 5 5c0 .8-.2 1.5-.5 2.2A4 4 0 0 1 20 13a4 4 0 0 1-3 3.9V20a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-3.1A4 4 0 0 1 4 13a4 4 0 0 1 3.5-3.8A5 5 0 0 1 7 7a5 5 0 0 1 5-5z" />
      <path d="M9 20h6" />
      <path d="M12 2v2" />
    </svg>
  )
}

/* ─── step config ─── */
const FLOW_STEPS: { key: FlowStep; label: string; sub: string; accent: 'cyan' | 'emerald' | 'violet' | 'amber' }[] = [
  { key: 'tianyu-init', label: '天域', sub: '任務拆解', accent: 'cyan' },
  { key: 'jingjie-crawl', label: '鏡界', sub: '資料採集', accent: 'emerald' },
  { key: 'jingjie-process', label: '鏡界', sub: '數據清洗', accent: 'emerald' },
  { key: 'tianyu-finalize', label: '天域', sub: '決策回填', accent: 'cyan' },
  { key: 'done', label: '完成', sub: '閉環輸出', accent: 'amber' },
]

const STEP_ACCENT_MAP: Record<string, string> = {
  cyan: '#06b6d4',
  emerald: '#10b981',
  violet: '#8b5cf6',
  amber: '#f59e0b',
}

/* ─── helpers ─── */
function nowTime() {
  return new Date().toLocaleTimeString('zh-TW', { hour12: false })
}

function sleep(ms: number) {
  return new Promise((resolve) => { window.setTimeout(resolve, ms) })
}

function LogIcon({ kind, size = 16 }: { kind: LogIconKind; size?: number }) {
  switch (kind) {
    case 'tianyu': return <TianyuIcon size={size} />
    case 'jingjie': return <JingjieIcon size={size} />
    case 'shenyu': return <ShenyuIcon size={size} />
    case 'done': return <CheckIcon size={size} />
    case 'error': return <ErrorIcon size={size} />
    case 'data': return <DataIcon size={size} />
    case 'arrow': return <ArrowRightIcon size={size} />
  }
}

/* ─── component ─── */
export function RealmIntegrationPage() {
  const [userInput, setUserInput] = useState('')
  const [dataQuery, setDataQuery] = useState('')
  const [running, setRunning] = useState(false)
  const [useDemoMode, setUseDemoMode] = useState(true)
  const [logs, setLogs] = useState<FlowLog[]>([])
  const [finalOutput, setFinalOutput] = useState('')
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState<FlowStep>('idle')
  const [crawlProgress, setCrawlProgress] = useState(0)

  const canRun = useMemo(() => userInput.trim().length > 0 && dataQuery.trim().length > 0 && !running, [dataQuery, running, userInput])

  const pushLog = (step: string, detail: string, icon: LogIconKind = 'tianyu') => {
    setLogs((prev) => [...prev, { at: nowTime(), step, detail, icon }])
  }

  /* ─── demo flow ─── */
  async function runDemoFlow() {
    setCurrentStep('tianyu-init')
    pushLog('天域', '🔍 分析用戶需求，拆解為可執行任務...', 'tianyu')
    await sleep(600)
    pushLog('天域', '📋 Solver 生成任務方案：3 個子任務', 'tianyu')
    await sleep(300)
    pushLog('天域', '✅ Verifier 驗證通過（置信度 0.92）', 'done')
    await sleep(200)
    const taskId = `demo-task-${Date.now()}`
    pushLog('天域', `📌 任務已建立：${taskId}`, 'tianyu')

    setCurrentStep('jingjie-crawl')
    pushLog('鏡界', '🌐 啟動網站指紋分析，識別目標數據源...', 'jingjie')
    await sleep(500)
    pushLog('鏡界', '📡 分布式爬蟲節點就緒（3 workers）', 'crawler' as LogIconKind)
    await sleep(400)
    setCrawlProgress(20)
    pushLog('鏡界', '📥 爬取進度 20% — 正在採集頁面數據...', 'jingjie')
    await sleep(500)
    setCrawlProgress(55)
    pushLog('鏡界', '📥 爬取進度 55% — 解析結構化內容...', 'jingjie')
    await sleep(500)
    setCrawlProgress(85)
    pushLog('鏡界', '📥 爬取進度 85% — 資料清洗中...', 'data')
    await sleep(400)
    setCrawlProgress(100)

    setCurrentStep('jingjie-process')
    pushLog('鏡界', '🔄 數據品質檢查通過（完整性 98%，準確性 95%）', 'jingjie')
    await sleep(300)
    pushLog('鏡界', '📦 資料處理完成，產生 resultId=demo-result-001', 'data')

    setCurrentStep('tianyu-finalize')
    pushLog('天域', '🧠 回填鏡界結果至知識庫...', 'tianyu')
    await sleep(400)
    pushLog('天域', '📊 Archivist 提取 5 條新知識點', 'brain' as LogIconKind)
    await sleep(200)
    pushLog('天域', '🎯 Coordinator 收斂任務，生成最終決策', 'tianyu')

    setCurrentStep('done')
    setFinalOutput(`✅ 整合流程完成（Demo 模式）

━━━ 任務拆解 ━━━
• 主任務：分析近 30 天社群情緒趨勢
• 子任務 1：採集社群討論數據 → ✅ 已完成
• 子任務 2：情緒分類與趨勢分析 → ✅ 已完成
• 子任務 3：生成內容策略建議 → ✅ 已完成

━━━ 數據回填 ━━━
• 爬取來源：Twitter / Reddit / PTT
• 有效數據：1,247 筆
• 情緒分佈：正面 62% / 中性 28% / 負面 10%

━━━ 建議下一步 ━━━
• 由神域進行多 AI 交叉驗證
• 將知識點沉澱至長期知識庫
• 觸發後續行銷內容自動生成`)
    pushLog('完成', '🎉 天域↔鏡界最小閉環完成', 'done')
  }

  /* ─── API flow ─── */
  async function runApiFlow() {
    setCurrentStep('tianyu-init')
    pushLog('天域', '建立任務中...', 'tianyu')
    const createRes = await apiService.tianyuCreateTask({
      userInput: userInput.trim(),
      requireExternalData: true,
      dataIntent: dataQuery.trim(),
    })
    const taskId = createRes.data.taskId
    pushLog('天域', `任務已建立：${taskId}`, 'tianyu')

    setCurrentStep('jingjie-crawl')
    pushLog('鏡界', '啟動爬取...', 'jingjie')
    const crawlRes = await apiService.jingjieStartCrawl({
      taskId,
      query: dataQuery.trim(),
    })
    const crawlId = crawlRes.data.crawlId
    pushLog('鏡界', `爬取工作已啟動：${crawlId}`, 'jingjie')

    let resultId = ''
    for (let i = 0; i < 20; i += 1) {
      await sleep(1200)
      const statusRes = await apiService.jingjieCrawlStatus(crawlId)
      const status = statusRes.data.status
      const progress = typeof statusRes.data.progress === 'number' ? statusRes.data.progress : undefined
      if (progress !== undefined) setCrawlProgress(progress)
      const progressStr = progress !== undefined ? ` (${progress}%)` : ''
      pushLog('鏡界', `狀態：${status}${progressStr}`, 'jingjie')
      if (status === 'done' && statusRes.data.resultId) {
        resultId = statusRes.data.resultId
        break
      }
      if (status === 'failed') {
        throw new Error(statusRes.data.message || '鏡界處理失敗')
      }
    }

    if (!resultId) {
      throw new Error('鏡界回傳逾時，未取得 resultId')
    }

    setCurrentStep('jingjie-process')
    const resultRes = await apiService.jingjieDataResult(resultId)
    const summary = resultRes.data.summary || ''
    pushLog('鏡界', `結果摘要：${summary.slice(0, 80)}${summary.length > 80 ? '...' : ''}`, 'data')

    setCurrentStep('tianyu-finalize')
    pushLog('天域', '回填鏡界結果並收斂任務...', 'tianyu')
    const finalizeRes = await apiService.tianyuFinalizeTask({
      taskId,
      crawlResultId: resultId,
      summary,
    })
    setFinalOutput(finalizeRes.data.output || '流程完成，但後端未提供 output。')
    setCurrentStep('done')
    pushLog('完成', `流程完成，狀態：${finalizeRes.data.status}`, 'done')
  }

  /* ─── run handler ─── */
  const onRun = async () => {
    setRunning(true)
    setError('')
    setFinalOutput('')
    setLogs([])
    setCrawlProgress(0)
    setCurrentStep('idle')
    try {
      if (useDemoMode) await runDemoFlow()
      else await runApiFlow()
    } catch (err) {
      const msg = err instanceof Error ? err.message : '整合流程失敗'
      setError(msg)
      setCurrentStep('error')
      pushLog('錯誤', msg, 'error')
    } finally {
      setRunning(false)
    }
  }

  /* ─── step index for progress ─── */
  const activeStepIndex = FLOW_STEPS.findIndex((s) => s.key === currentStep)
  const isFinished = currentStep === 'done'
  const isFailed = currentStep === 'error'

  return (
    <RealmsPageShell>
      <main className="realms-page-main" id="realms-integration-page">
        {/* ─── hero ─── */}
        <div className="container realms-page-hero realms-page-hero--cyan">
          <nav className="realms-breadcrumb" aria-label="breadcrumb">
            <Link className="realms-bc-link" to={PATHS.realmsIndex}>三界</Link>
            <span className="realms-bc-sep" aria-hidden="true">/</span>
            <span className="realms-bc-current">整合流程</span>
          </nav>
          <h1 className="realms-page-title">
            <span className="rix-hero-icon rix-hero-icon--cyan"><TianyuIcon size={28} /></span>
            天域 ↔ 鏡界
            <span className="rix-hero-icon rix-hero-icon--emerald"><JingjieIcon size={28} /></span>
            整合流程
          </h1>
          <p className="realms-page-lead">任務建立（天域）→ 資料處理（鏡界）→ 回填決策（天域）</p>
        </div>

        <div className="container realms-detail-layout">
          <section className="realms-ix-panel realms-ix-panel--cyan realms-integration-panel">

            {/* ─── visual flow diagram ─── */}
            <div className="rix-flow-diagram" aria-label="整合流程圖">
              <div className={`rix-flow-node rix-flow-node--tianyu ${currentStep === 'tianyu-init' || currentStep === 'tianyu-finalize' ? 'rix-flow-node--active' : ''} ${isFinished ? 'rix-flow-node--done' : ''}`}>
                <div className="rix-flow-node-icon">
                  <TianyuIcon size={28} />
                </div>
                <div className="rix-flow-node-label">天域</div>
                <div className="rix-flow-node-sub">任務引擎</div>
              </div>

              <div className={`rix-flow-connector ${currentStep === 'jingjie-crawl' || currentStep === 'jingjie-process' || currentStep === 'tianyu-finalize' || isFinished ? 'rix-flow-connector--active' : ''}`}>
                <div className="rix-flow-connector-line" />
                <ArrowRightIcon size={18} />
                <div className="rix-flow-connector-line" />
              </div>

              <div className={`rix-flow-node rix-flow-node--jingjie ${currentStep === 'jingjie-crawl' || currentStep === 'jingjie-process' ? 'rix-flow-node--active' : ''} ${isFinished ? 'rix-flow-node--done' : ''}`}>
                <div className="rix-flow-node-icon">
                  <JingjieIcon size={28} />
                </div>
                <div className="rix-flow-node-label">鏡界</div>
                <div className="rix-flow-node-sub">數據平台</div>
              </div>

              <div className={`rix-flow-connector ${currentStep === 'tianyu-finalize' || isFinished ? 'rix-flow-connector--active' : ''}`}>
                <div className="rix-flow-connector-line" />
                <ArrowRightIcon size={18} />
                <div className="rix-flow-connector-line" />
              </div>

              <div className={`rix-flow-node rix-flow-node--output ${isFinished ? 'rix-flow-node--active rix-flow-node--done' : ''}`}>
                <div className="rix-flow-node-icon">
                  {isFinished ? <CheckIcon size={28} /> : <BrainIcon size={28} />}
                </div>
                <div className="rix-flow-node-label">{isFinished ? '完成' : '輸出'}</div>
                <div className="rix-flow-node-sub">{isFinished ? '閉環' : '決策'}</div>
              </div>
            </div>

            {/* ─── step progress bar ─── */}
            <div className="rix-step-bar" role="progressbar" aria-valuenow={activeStepIndex + 1} aria-valuemin={0} aria-valuemax={FLOW_STEPS.length}>
              {FLOW_STEPS.map((step, i) => {
                const isActive = step.key === currentStep
                const isPast = activeStepIndex > i || isFinished
                const accent = STEP_ACCENT_MAP[step.accent]
                return (
                  <div
                    key={step.key}
                    className={`rix-step ${isActive ? 'rix-step--active' : ''} ${isPast ? 'rix-step--past' : ''} ${isFailed && isActive ? 'rix-step--error' : ''}`}
                    style={{ '--step-accent': accent } as React.CSSProperties}
                  >
                    <div className="rix-step-dot">
                      {isPast && !isActive ? <CheckIcon size={12} /> : <span className="rix-step-dot-num">{i + 1}</span>}
                    </div>
                    <div className="rix-step-label">{step.label}</div>
                    <div className="rix-step-sub">{step.sub}</div>
                    {i < FLOW_STEPS.length - 1 && <div className={`rix-step-line ${isPast ? 'rix-step-line--filled' : ''}`} />}
                  </div>
                )
              })}
            </div>

            {/* ─── inputs ─── */}
            <div className="realms-integration-grid">
              <label className="rix-input-group">
                <div className="rix-input-label">
                  <span className="rix-input-icon"><TianyuIcon size={16} /></span>
                  用戶需求（交給天域）
                </div>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="例如：分析近 30 天社群對某產品的情緒趨勢，並提出內容策略。"
                  rows={4}
                  className="realms-integration-textarea"
                />
              </label>
              <label className="rix-input-group">
                <div className="rix-input-label">
                  <span className="rix-input-icon rix-input-icon--emerald"><JingjieIcon size={16} /></span>
                  外部數據查詢（交給鏡界）
                </div>
                <input
                  value={dataQuery}
                  onChange={(e) => setDataQuery(e.target.value)}
                  placeholder="例如：product sentiment last 30 days"
                  className="realms-integration-input"
                />
              </label>
              <label className="realms-integration-demo-toggle">
                <input
                  type="checkbox"
                  checked={useDemoMode}
                  onChange={(e) => setUseDemoMode(e.target.checked)}
                />
                <span className="rix-demo-toggle-label">使用 Demo 模式（不呼叫後端 API）</span>
              </label>

              {/* ─── actions ─── */}
              <div className="realms-integration-actions">
                <button type="button" className="rix-btn rix-btn--primary" onClick={onRun} disabled={!canRun}>
                  {running ? (
                    <><span className="rix-spinner" />執行中...</>
                  ) : (
                    <><ArrowRightIcon size={16} />執行整合流程</>
                  )}
                </button>
                <Link className="rix-btn rix-btn--ghost" to={PATHS.realmsIndex}>
                  回三界首頁
                </Link>
              </div>

              {error ? (
                <div className="rix-error-box">
                  <ErrorIcon size={18} />
                  <span>{error}</span>
                </div>
              ) : null}

              {/* ─── crawl progress bar ─── */}
              {currentStep === 'jingjie-crawl' || currentStep === 'jingjie-process' ? (
                <div className="rix-progress-wrap">
                  <div className="rix-progress-head">
                    <span className="rix-progress-label"><CrawlerIcon size={14} /> 鏡界爬取進度</span>
                    <span className="rix-progress-pct">{crawlProgress}%</span>
                  </div>
                  <div className="rix-progress-track">
                    <div className="rix-progress-fill" style={{ width: `${crawlProgress}%` }} />
                  </div>
                </div>
              ) : null}

              {/* ─── logs ─── */}
              <div className="rix-logs-section">
                <h2 className="realms-ix-highlights-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>
                  流程日誌
                </h2>
                {logs.length === 0 ? (
                  <div className="rix-logs-empty">
                    <DataIcon size={32} />
                    <p>尚未執行流程</p>
                    <p className="rix-logs-empty-hint">輸入需求後點擊「執行整合流程」開始</p>
                  </div>
                ) : (
                  <ul className="rix-logs-list">
                    {logs.map((item, index) => (
                      <li
                        key={`${item.at}-${item.step}-${index}`}
                        className={`rix-log-entry rix-log-entry--${item.icon}`}
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <span className={`rix-log-icon rix-log-icon--${item.icon}`}>
                          <LogIcon kind={item.icon} size={14} />
                        </span>
                        <span className="rix-log-time">{item.at}</span>
                        <span className={`rix-log-step rix-log-step--${item.icon}`}>{item.step}</span>
                        <span className="rix-log-detail">{item.detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* ─── final output ─── */}
              {finalOutput ? (
                <div className="rix-output-section">
                  <h2 className="realms-ix-highlights-label">
                    <CheckIcon size={14} /> 最終輸出
                  </h2>
                  <pre className="rix-output-pre">{finalOutput}</pre>
                </div>
              ) : null}

              {/* ─── architecture hint ─── */}
              <div className="rix-arch-hint">
                <div className="rix-arch-row">
                  <div className="rix-arch-node rix-arch-node--tianyu">
                    <TianyuIcon size={18} />
                    <span>天域 TITMS</span>
                    <small>Solver · Verifier · Archivist · Coordinator</small>
                  </div>
                  <div className="rix-arch-arrow">⟶</div>
                  <div className="rix-arch-node rix-arch-node--jingjie">
                    <JingjieIcon size={18} />
                    <span>鏡界平台</span>
                    <small>爬蟲 · 指紋分析 · 數據清洗 · 質量管理</small>
                  </div>
                  <div className="rix-arch-arrow">⟶</div>
                  <div className="rix-arch-node rix-arch-node--shenyu">
                    <ShenyuIcon size={18} />
                    <span>神域協作</span>
                    <small>AI 註冊 · 信任管理 · 知識共享</small>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </RealmsPageShell>
  )
}
