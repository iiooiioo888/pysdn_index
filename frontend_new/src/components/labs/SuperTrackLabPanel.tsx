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
]

const ALERTS = [
  { t: '09:12', who: '@design_daily', what: '互動率 3× baseline' },
  { t: '08:44', who: 'BrandX Studio', what: '新話題 #cybercafe 升溫' },
  { t: '01:15', who: '@ai_creative', what: '夜間增粉 +2.1% / 15m' },
  { t: '昨 23:40', who: '系統', what: '全域情緒指數 0.78' },
  { t: '昨 20:11', who: '@shortfilm_lab', what: '貼文延遲 12m 仍觸發預警' },
]

const AUDIENCE = [
  { a: '🧑‍💻', n: 'Z 世代數位原住民', m: '18-25 · 影迷', s: 87 },
  { a: '👨‍👩‍👧', n: '家庭觀影族群', m: '30-45 · 闔家', s: 74 },
  { a: '🎬', n: '影評 / 影迷', m: '25-50 · 核心', s: 81 },
  { a: '🧵', n: '劇作研究員', m: '22-40 · 深度', s: 79 },
  { a: '🛒', n: '品牌內容採購', m: '28-55 · B2B', s: 72 },
]

export function SuperTrackLabPanel() {
  return (
    <div className="sim-panel sim-panel--lab">
      <div className="sim-header">
        <div className="sim-header-left">
          <span className="sim-icon">🛰️</span>
          <span className="sim-title">SuperTrack</span>
          <span className="sim-badge sim-badge--green">SIGNAL TRACKING</span>
          <span className="sim-live">
            <span className="sim-dot sim-dot--green" /> LIVE
          </span>
          <span className="sim-badge-soft" style={{ marginLeft: 8 }}>
            LAB · 示範資料
          </span>
        </div>
        <div className="sim-header-right">
          <button type="button" className="sim-btn">
            🔄 重試全部
          </button>
          <button type="button" className="sim-btn sim-btn--outline">
            📤 匯出報告
          </button>
        </div>
      </div>

      <p className="doc-lab-note">即時 KPI：實體、警報、熱詞、情緒、爬蟲成功率、訊號量。</p>
      <div className="sim-kpis" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }}>
        <div className="sim-kpi">
          <div className="sim-kpi-label">entities</div>
          <div className="sim-kpi-val">36</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">alerts</div>
          <div className="sim-kpi-val sim-kpi-val--highlight">9</div>
          <div className="sim-bar">
            <div className="sim-bar-fill sim-bar-fill--green" style={{ width: '52%' }} />
          </div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">hot_topics</div>
          <div className="sim-kpi-val sim-kpi-val--highlight">16</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">sentiment</div>
          <div className="sim-kpi-val">0.78</div>
          <div className="sim-bar">
            <div className="sim-bar-fill sim-bar-fill--green" style={{ width: '78%' }} />
          </div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">crawl_rate</div>
          <div className="sim-kpi-val">98.2%</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">signals/min</div>
          <div className="sim-kpi-val">168</div>
        </div>
      </div>

      <div className="sim-card" style={{ marginTop: 16 }}>
        <div className="sim-card-head">最近警報（示範）</div>
        <div className="sim-table-wrap">
          <table className="sim-table">
            <thead>
              <tr>
                <th>時間</th>
                <th>對象</th>
                <th>內容</th>
              </tr>
            </thead>
            <tbody>
              {ALERTS.map((a) => (
                <tr key={a.t + a.who}>
                  <td className="sim-mono">{a.t}</td>
                  <td>{a.who}</td>
                  <td>{a.what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="doc-lab-note" style={{ marginTop: 12 }}>
        追蹤中的帳號：共 8 筆；含上升、熱詞與穩定狀態。
      </p>
      <div className="sim-card">
        <div className="sim-card-head">📡 追蹤中的帳號</div>
        <div className="sim-entity-list">
          {ENTITIES.map((e) => (
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
          ))}
        </div>
      </div>

      <div className="sim-grid-2" style={{ marginTop: 12 }}>
        <div className="sim-card">
          <div className="sim-card-head">👥 觀眾畫像（5 群組）</div>
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
          <div className="sim-card-head">📡 熱詞趨勢（TOP 8）</div>
          <div className="sim-trend">
            {TRENDS.map((r) => (
              <div className="sim-trend-row" key={r.rank}>
                <span className="sim-trend-rank">{r.rank}</span>
                <span className="sim-trend-name">{r.name}</span>
                <div className="sim-bar">
                  <div
                    className="sim-bar-fill sim-bar-fill--red"
                    style={{ width: `${r.w}%`, opacity: r.w > 80 ? 1 : 0.85 }}
                  />
                </div>
                <span className="sim-trend-heat">{r.heat}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="sim-btn sim-btn--primary"
            style={{ marginTop: 8, width: '100%', textAlign: 'center' }}
          >
            💉 一鍵注入腳本
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
            3.4×
          </div>
        </div>
        <div className="sim-net-metrics">
          <div className="sim-net-row">
            <span>audience_fit</span>
            <div className="sim-bar">
              <div className="sim-bar-fill sim-bar-fill--green" style={{ width: '86%' }} />
            </div>
            <span>0.86</span>
          </div>
          <div className="sim-net-row">
            <span>genre_match</span>
            <div className="sim-bar">
              <div className="sim-bar-fill sim-bar-fill--green" style={{ width: '91%' }} />
            </div>
            <span>0.91</span>
          </div>
          <div className="sim-net-row">
            <span>trend_align</span>
            <div className="sim-bar">
              <div className="sim-bar-fill sim-bar-fill--green" style={{ width: '75%' }} />
            </div>
            <span>0.75</span>
          </div>
        </div>
      </div>
    </div>
  )
}
