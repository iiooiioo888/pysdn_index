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
]

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
]

const AUDIENCE = [
  { a: '🧑‍💻', n: 'Z 世代數位原住民', m: '18-25 · 影迷', s: 87 },
  { a: '👨‍👩‍👧', n: '家庭觀影族群', m: '30-45 · 闔家', s: 74 },
  { a: '🎬', n: '影評 / 影迷', m: '25-50 · 核心', s: 81 },
  { a: '🧵', n: '劇作研究員', m: '22-40 · 深度', s: 79 },
  { a: '🛒', n: '品牌內容採購', m: '28-55 · B2B', s: 72 },
  { a: '🎧', n: '播客/解說 up', m: '20-38 · 二次創作', s: 77 },
]

const PLATFORMS = [
  { p: 'X (Twitter)', sig: 4120, lat: '1.2s', q: 'ok', miss: '0.4%' },
  { p: 'Instagram', sig: 2890, lat: '2.8s', q: '429 節流', miss: '1.1%' },
  { p: 'TikTok 熱榜', sig: 5102, lat: '0.9s', q: 'ok', miss: '0.2%' },
  { p: 'YouTube 留言', sig: 980, lat: '3.1s', q: 'ok', miss: '0.7%' },
  { p: 'Reddit / 子版', sig: 640, lat: '1.4s', q: '審查延遲', miss: '2.0%' },
  { p: '新聞 RSS', sig: 210, lat: '0.3s', q: 'ok', miss: '0%' },
]

const GEO = [
  { r: '東亞', h: 88 },
  { r: '北美西岸', h: 72 },
  { r: '歐陸 DACH', h: 54 },
  { r: '拉美', h: 61 },
  { r: '其他', h: 43 },
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

      <p className="doc-lab-note">即時 KPI：實體、警報、熱詞、情緒、爬蟲成功率、訊號量；下方加上平台與地理熱力示範。</p>
      <div className="sim-kpis" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        <div className="sim-kpi">
          <div className="sim-kpi-label">entities</div>
          <div className="sim-kpi-val">42</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">alerts (24h)</div>
          <div className="sim-kpi-val sim-kpi-val--highlight">12</div>
          <div className="sim-bar">
            <div className="sim-bar-fill sim-bar-fill--green" style={{ width: '62%' }} />
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
        <div className="sim-kpi">
          <div className="sim-kpi-label">noise filter</div>
          <div className="sim-kpi-val">91%</div>
          <div className="sim-kpi-sub">已剃除機器/重複</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">跨平台延遲 p95</div>
          <div className="sim-kpi-val">2.1s</div>
        </div>
      </div>

      <div className="sim-grid-2" style={{ marginTop: 12 }}>
        <div className="sim-card">
          <div className="sim-card-head">訊號來源佔比（6 平台 · 示範）</div>
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
        <div className="sim-card-head">最近警報（{ALERTS.length} 筆 · 示範）</div>
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
              {ALERTS.map((a) => (
                <tr key={a.t + a.who}>
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
