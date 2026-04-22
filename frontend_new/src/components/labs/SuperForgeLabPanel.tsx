import './labPanelStyles.css'

type T = (key: string) => string

type HealthCell = { pct: number; labelKey: string } | { pct: number; label: string }

const MOCK_HEALTH: HealthCell[] = [
  { pct: 88, labelKey: 'doc_sf_sim_h_struct' },
  { pct: 79, labelKey: 'doc_sf_sim_h_search' },
  { pct: 92, labelKey: 'doc_sf_sim_h_tag' },
  { pct: 85, labelKey: 'doc_sf_sim_h_sync' },
  { pct: 76, labelKey: 'doc_sf_sim_h_ver' },
  { pct: 83, labelKey: 'doc_sf_sim_h_model' },
  { pct: 71, label: 'Webhook 簽章' },
  { pct: 94, label: 'Embedding 工作佇列' },
]

const MOCK_TABLE = [
  { t: '14:02:11', ep: 'POST /v1/prompts', ms: '8ms', code: '201' },
  { t: '14:02:08', ep: 'GET /v1/prompts/similar', ms: '22ms', code: '200' },
  { t: '14:01:59', ep: 'POST /v1/generations', ms: '11ms', code: '201' },
  { t: '14:01:44', ep: 'POST /v1/webhooks/mj', ms: '6ms', code: '204' },
  { t: '14:01:40', ep: 'GET /v1/prompts', ms: '14ms', code: '200' },
  { t: '14:01:22', ep: 'DELETE /v1/prompts/:id', ms: '9ms', code: '204' },
]

const MOCK_ENTITIES = [
  { icon: '✏️', name: 'cinematic drone shot of mountains at golden hour', metric: '58 gen' },
  { icon: '✏️', name: 'portrait of a girl in neon-lit Tokyo street', metric: '31 gen' },
  { icon: '✏️', name: 'oil painting of a cottage in autumn forest', metric: '19 gen' },
  { icon: '✏️', name: 'isometric server room, volumetric fog, cyan rim light', metric: '44 gen' },
  { icon: '✏️', name: 'macro water droplets on glass, bokeh city night', metric: '22 gen' },
  { icon: '✏️', name: 'studio product shot, matte black bottle, softbox', metric: '36 gen' },
  { icon: '✏️', name: 'hand-drawn storyboard grid, anime style, ink lines', metric: '12 gen' },
  { icon: '✏️', name: 'abstract fluid gold on deep blue, 8k detail', metric: '27 gen' },
]

function RingSm({ pct, stroke = '#06b6d4' }: { pct: number; stroke?: string }) {
  const dash = 150.8 * (1 - pct / 100)
  return (
    <div className="sim-ring sim-ring--sm">
      <svg viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle
          cx="30"
          cy="30"
          r="24"
          fill="none"
          stroke={stroke}
          strokeWidth="4"
          strokeDasharray="150.8"
          strokeDashoffset={dash}
          strokeLinecap="round"
        />
      </svg>
      <span className="sim-ring-label">{pct}%</span>
    </div>
  )
}

export function SuperForgeLabPanel({ t }: { t: T }) {
  return (
    <div className="sim-panel sim-panel--lab">
      <div className="sim-header">
        <div className="sim-header-left">
          <span className="sim-icon">🗂️</span>
          <span className="sim-title">SuperForge</span>
          <span className="sim-badge sim-badge--cyan">KNOWLEDGE BASE</span>
          <span className="sim-live">
            <span className="sim-dot" /> LIVE
          </span>
          <span className="sim-badge-soft" style={{ marginLeft: 8 }}>
            LAB · 示範資料
          </span>
        </div>
        <div className="sim-header-right">
          <button type="button" className="sim-btn">
            {t('doc_sf_sim_btn_refresh')}
          </button>
          <button type="button" className="sim-btn sim-btn--outline">
            {t('doc_sf_sim_btn_export')}
          </button>
        </div>
      </div>

      <p className="doc-lab-note">{t('doc_sf_sim_kpi_note')}</p>
      <div className="sim-kpis" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        <div className="sim-kpi">
          <div className="sim-kpi-label">prompts</div>
          <div className="sim-kpi-val">3,128</div>
          <div className="sim-kpi-delta sim-kpi-delta--up">+24 today</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">generations</div>
          <div className="sim-kpi-val">14,902</div>
          <div className="sim-kpi-delta sim-kpi-delta--up">+112 today</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">hit rate</div>
          <div className="sim-kpi-val sim-kpi-val--highlight">94.2%</div>
          <div className="sim-bar">
            <div className="sim-bar-fill sim-bar-fill--cyan" style={{ width: '94%' }} />
          </div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">cache_hit</div>
          <div className="sim-kpi-val">81%</div>
          <div className="sim-bar">
            <div className="sim-bar-fill sim-bar-fill--cyan" style={{ width: '81%' }} />
          </div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">queue</div>
          <div className="sim-kpi-val">23</div>
          <div className="sim-bar">
            <div className="sim-bar-fill sim-bar-fill--cyan" style={{ width: '38%' }} />
          </div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">avg_latency</div>
          <div className="sim-kpi-val">9.4ms</div>
          <div className="sim-kpi-sub">p99 31ms</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">vector_idx</div>
          <div className="sim-kpi-val">ok</div>
          <div className="sim-kpi-sub">HNSW · m=16</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">storage</div>
          <div className="sim-ring">
            <svg viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="3"
                strokeDasharray="100.53"
                strokeDashoffset="28"
                strokeLinecap="round"
              />
            </svg>
            <span className="sim-ring-label">72%</span>
          </div>
          <div className="sim-kpi-sub">7.4G / 10.2G</div>
        </div>
      </div>

      <div className="sim-grid-2" style={{ marginTop: 16 }}>
        <div className="sim-card">
          <div className="sim-card-head">{t('doc_sf_sim_health_title')}（8 維度）</div>
          <div className="sim-health-grid">
            {MOCK_HEALTH.map((h, i) => (
              <div className="sim-health-item" key={i}>
                <RingSm pct={h.pct} />
                <div className="sim-health-label">{'labelKey' in h ? t(h.labelKey) : h.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="sim-card">
          <div className="sim-card-head">{t('doc_sf_sim_stats_title')}</div>
          <div className="sim-stats">
            <div className="sim-stat-row">
              <span className="sim-stat-label">{t('doc_sf_sim_stat_model')}</span>
              <span className="sim-stat-val">Midjourney v6 · SDXL 1.0</span>
            </div>
            <div className="sim-stat-row">
              <span className="sim-stat-label">{t('doc_sf_sim_stat_week')}</span>
              <span className="sim-stat-val">{t('doc_sf_sim_week_val')}</span>
            </div>
            <div className="sim-stat-row">
              <span className="sim-stat-label">{t('doc_sf_sim_stat_tags')}</span>
              <span className="sim-stat-val">
                <span className="doc-tag">cinematic</span> <span className="doc-tag">neon</span>{' '}
                <span className="doc-tag">product</span>
              </span>
            </div>
            <div className="sim-stat-row">
              <span className="sim-stat-label">{t('doc_sf_sim_stat_rate')}</span>
              <span className="sim-stat-val">94.2%</span>
            </div>
          </div>
          <div className="sim-log">
            <div className="sim-log-title">recent activity</div>
            <div className="sim-log-line">{t('doc_sf_sim_log_1')}</div>
            <div className="sim-log-line">{t('doc_sf_sim_log_2')}</div>
            <div className="sim-log-line">{t('doc_sf_sim_log_3')}</div>
            <div className="sim-log-line">[sync] 批次 128 embed 完成 · 1.1s</div>
            <div className="sim-log-line">[tag] 推斷: cinematic / golden_hour / 35mm</div>
            <div className="sim-log-line">[webhook] generation #a8f2 狀態 → done</div>
          </div>
        </div>
      </div>

      <p className="doc-lab-note" style={{ marginTop: 12 }}>
        {t('doc_sf_sim_health_grid_note')}
      </p>

      <div className="sim-card" style={{ marginTop: 8 }}>
        <div className="sim-card-head">即時 API 端點（示範）</div>
        <div className="sim-table-wrap">
          <table className="sim-table">
            <thead>
              <tr>
                <th>時間</th>
                <th>端點</th>
                <th>延遲</th>
                <th>狀態</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TABLE.map((r) => (
                <tr key={r.t + r.ep}>
                  <td className="sim-mono">{r.t}</td>
                  <td>
                    <code>{r.ep}</code>
                  </td>
                  <td>{r.ms}</td>
                  <td>
                    <span className="sim-badge-soft">{r.code}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="doc-lab-note" style={{ marginTop: 12 }}>{t('doc_sf_sim_list_note')}</p>
      <div className="sim-card">
        <div className="sim-card-head">{t('doc_sf_sim_recent_title')}（TOP 8）</div>
        <div className="sim-entity-list">
          {MOCK_ENTITIES.map((e) => (
            <div className="sim-entity" key={e.name}>
              <span className="sim-entity-icon">{e.icon}</span>
              <span className="sim-entity-name">{e.name}</span>
              <span className="sim-entity-metric">{e.metric}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
