import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiService } from '../../lib/api'
import { PATHS } from '../../routes/paths'
import { RealmsPageShell } from './RealmsPageShell'

type FlowLog = {
  at: string
  step: string
  detail: string
}

function nowTime() {
  return new Date().toLocaleTimeString('zh-TW', { hour12: false })
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function RealmIntegrationPage() {
  const [userInput, setUserInput] = useState('')
  const [dataQuery, setDataQuery] = useState('')
  const [running, setRunning] = useState(false)
  const [useDemoMode, setUseDemoMode] = useState(true)
  const [logs, setLogs] = useState<FlowLog[]>([])
  const [finalOutput, setFinalOutput] = useState('')
  const [error, setError] = useState('')

  const canRun = useMemo(() => userInput.trim().length > 0 && dataQuery.trim().length > 0 && !running, [dataQuery, running, userInput])

  const pushLog = (step: string, detail: string) => {
    setLogs((prev) => [...prev, { at: nowTime(), step, detail }])
  }

  async function runDemoFlow() {
    pushLog('天域', '建立任務中...')
    await sleep(400)
    const taskId = `demo-task-${Date.now()}`
    pushLog('天域', `任務已建立：${taskId}`)

    pushLog('鏡界', '啟動資料採集與清洗...')
    await sleep(500)
    pushLog('鏡界', '爬取進度 35%')
    await sleep(500)
    pushLog('鏡界', '爬取進度 80%')
    await sleep(500)
    pushLog('鏡界', '資料處理完成，產生 resultId=demo-result-001')

    pushLog('天域', '回填鏡界結果並生成最終決策...')
    await sleep(400)
    setFinalOutput(`已完成整合流程（Demo）：\n1) 任務拆解完成\n2) 外部數據回填完成\n3) 建議下一步：由神域進行多 AI 交叉驗證`)
    pushLog('完成', '天域↔鏡界最小閉環完成')
  }

  async function runApiFlow() {
    pushLog('天域', '建立任務中...')
    const createRes = await apiService.tianyuCreateTask({
      userInput: userInput.trim(),
      requireExternalData: true,
      dataIntent: dataQuery.trim(),
    })
    const taskId = createRes.data.taskId
    pushLog('天域', `任務已建立：${taskId}`)

    pushLog('鏡界', '啟動爬取...')
    const crawlRes = await apiService.jingjieStartCrawl({
      taskId,
      query: dataQuery.trim(),
    })
    const crawlId = crawlRes.data.crawlId
    pushLog('鏡界', `爬取工作已啟動：${crawlId}`)

    let resultId = ''
    for (let i = 0; i < 20; i += 1) {
      await sleep(1200)
      const statusRes = await apiService.jingjieCrawlStatus(crawlId)
      const status = statusRes.data.status
      const progress = typeof statusRes.data.progress === 'number' ? ` (${statusRes.data.progress}%)` : ''
      pushLog('鏡界', `狀態：${status}${progress}`)
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

    const resultRes = await apiService.jingjieDataResult(resultId)
    const summary = resultRes.data.summary || ''
    pushLog('鏡界', `結果摘要：${summary.slice(0, 80)}${summary.length > 80 ? '...' : ''}`)

    pushLog('天域', '回填鏡界結果並收斂任務...')
    const finalizeRes = await apiService.tianyuFinalizeTask({
      taskId,
      crawlResultId: resultId,
      summary,
    })
    setFinalOutput(finalizeRes.data.output || '流程完成，但後端未提供 output。')
    pushLog('完成', `流程完成，狀態：${finalizeRes.data.status}`)
  }

  const onRun = async () => {
    setRunning(true)
    setError('')
    setFinalOutput('')
    setLogs([])
    try {
      if (useDemoMode) await runDemoFlow()
      else await runApiFlow()
    } catch (err) {
      const msg = err instanceof Error ? err.message : '整合流程失敗'
      setError(msg)
      pushLog('錯誤', msg)
    } finally {
      setRunning(false)
    }
  }

  return (
    <RealmsPageShell>
      <main className="realms-page-main" id="realms-integration-page">
        <div className="container realms-page-hero realms-page-hero--cyan">
          <nav className="realms-breadcrumb" aria-label="breadcrumb">
            <Link className="realms-bc-link" to={PATHS.realmsIndex}>三界</Link>
            <span className="realms-bc-sep" aria-hidden="true">/</span>
            <span className="realms-bc-current">整合流程</span>
          </nav>
          <h1 className="realms-page-title">天域 ↔ 鏡界整合流程</h1>
          <p className="realms-page-lead">任務建立（天域）→ 資料處理（鏡界）→ 回填決策（天域）</p>
        </div>

        <div className="container realms-detail-layout">
          <section className="realms-ix-panel realms-ix-panel--cyan realms-integration-panel">
            <div className="realms-integration-grid">
              <label>
                <div>用戶需求（交給天域）</div>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="例如：分析近 30 天社群對某產品的情緒趨勢，並提出內容策略。"
                  rows={4}
                  className="realms-integration-textarea"
                />
              </label>
              <label>
                <div>外部數據查詢（交給鏡界）</div>
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
                使用 Demo 模式（不呼叫後端 API）
              </label>

              <div className="realms-integration-actions">
                <button type="button" className="realms-ix-link realms-ix-link--primary" onClick={onRun} disabled={!canRun}>
                  {running ? '執行中...' : '執行整合流程'}
                </button>
                <Link className="realms-ix-link realms-ix-link--ghost" to={PATHS.realmsIndex}>
                  回三界首頁
                </Link>
              </div>

              {error ? <p className="realms-fc-empty realms-integration-error">{error}</p> : null}

              <div className="realms-ix-highlights">
                <h2 className="realms-ix-highlights-label">流程日誌</h2>
                {logs.length === 0 ? (
                  <p className="realms-fc-empty">尚未執行流程</p>
                ) : (
                  <ul className="realms-ix-points">
                    {logs.map((item, index) => (
                      <li key={`${item.at}-${item.step}-${index}`}>
                        [{item.at}] {item.step}：{item.detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {finalOutput ? (
                <div className="realms-ix-highlights">
                  <h2 className="realms-ix-highlights-label">最終輸出</h2>
                  <pre className="realms-integration-output">{finalOutput}</pre>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </main>
    </RealmsPageShell>
  )
}
