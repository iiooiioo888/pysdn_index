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
  { t: '14:01:05', ep: 'GET /v1/prompts/:id/versions', ms: '18ms', code: '200' },
  { t: '14:00:58', ep: 'POST /v1/search/semantic', ms: '34ms', code: '200' },
  { t: '14:00:41', ep: 'POST /v1/embed/batch', ms: '112ms', code: '202' },
  { t: '14:00:33', ep: 'GET /v1/health', ms: '3ms', code: '200' },
  { t: '14:00:19', ep: 'POST /v1/webhooks/sd', ms: '7ms', code: '204' },
  { t: '13:59:48', ep: 'GET /v1/stats/usage?range=24h', ms: '16ms', code: '200' },
  { t: '13:59:31', ep: 'PATCH /v1/prompts/:id/tags', ms: '11ms', code: '200' },
  { t: '13:59:02', ep: 'POST /v1/generations/preview', ms: '44ms', code: '201' },
  { t: '13:58:51', ep: 'GET /v1/prompts?cursor=...', ms: '21ms', code: '200' },
  { t: '13:58:40', ep: 'POST /v1/webhooks/dall-e', ms: '5ms', code: '204' },
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
  { icon: '✏️', name: 'cinematic dolly through rainy alley, anamorphic flare', metric: '41 gen' },
  { icon: '✏️', name: 'ultra-macro watch gears, brass patina, studio lighting', metric: '18 gen' },
  { icon: '✏️', name: 'aerial top-down of night market, long exposure, neon trails', metric: '33 gen' },
  { icon: '✏️', name: 'fashion editorial, silk motion blur, 85mm, fog machine', metric: '29 gen' },
  { icon: '✏️', name: 'brutalist concrete atrium, god rays, dust particles, IMAX', metric: '24 gen' },
  { icon: '✏️', name: 'mecha repair bay, oil stains, welder sparks, 35mm grain', metric: '31 gen' },
  { icon: '✏️', name: 'underwater caustics, sun shafts, sardine school silhouette', metric: '15 gen' },
]

const MOCK_WEBHOOKS = [
  { src: 'Midjourney', ok: '99.4%', p95: '38ms', q: '4', err: '0.1%' },
  { src: 'SDXL API', ok: '98.1%', p95: '52ms', q: '7', err: '0.6%' },
  { src: 'DALL·E 3', ok: '100%', p95: '29ms', q: '0', err: '0%' },
  { src: 'Comfy 工作流', ok: '96.8%', p95: '120ms', q: '12', err: '1.2%' },
  { src: 'Kling 外掛', ok: '97.2%', p95: '64ms', q: '3', err: '0.4%' },
]

const MOCK_EMBED = [
  { id: 'job-8a2', n: 128, st: 'running', eta: '1.1s', dim: 1536 },
  { id: 'job-7c1', n: 512, st: 'queued', eta: '—', dim: 1536 },
  { id: 'job-3f0', n: 256, st: 'done', eta: '0.4s', dim: 768 },
  { id: 'reindex-nightly', n: 8902, st: 'scheduled', eta: '02:00', dim: 1536 },
  { id: 'job-1bb', n: 64, st: 'failed×1', eta: 'retry', dim: 1536 },
]

const MOCK_MODEL_SHARE = [
  { m: 'Midjourney v6', w: 42 },
  { m: 'SDXL 1.0 + refiner', w: 28 },
  { m: 'DALL·E 3', w: 16 },
  { m: 'Custom SD (LoRA)', w: 9 },
  { m: '其他 / 實驗', w: 5 },
]

const MOCK_TAGS = [
  { tag: 'cinematic', n: 1820, d: '+6%' },
  { tag: 'neon', n: 1402, d: '+3%' },
  { tag: 'portrait', n: 1211, d: '—' },
  { tag: 'product', n: 980, d: '+11%' },
  { tag: 'anime', n: 901, d: '−1%' },
  { tag: 'isometric', n: 640, d: '+8%' },
  { tag: 'macro', n: 512, d: '+4%' },
  { tag: 'HDR / 8k', n: 480, d: '+19%' },
  { tag: 'film_grain', n: 390, d: '+2%' },
  { tag: 'cyberpunk', n: 360, d: '−2%' },
]

const MOCK_LAT = [
  { k: '語意搜尋 p50', v: '18ms' },
  { k: '語意搜尋 p90', v: '31ms' },
  { k: '語意搜尋 p99', v: '58ms' },
  { k: '全文搜尋 p50', v: '6ms' },
  { k: '以圖搜圖 p90', v: '124ms' },
  { k: 'Webhook ack p99', v: '12ms' },
]

const MOCK_VERSIONS = [
  { id: 'prm_8f2a1', ver: 'v12', at: '13:40', note: 'cfg 7→6.2、加 negative' },
  { id: 'prm_8f2a1', ver: 'v11', at: '12:05', note: 'seed 輪替、構圖微調' },
  { id: 'prm_71cd9', ver: 'v3', at: '11:22', note: '新增標籤 cinematic / 雨夜' },
  { id: 'prm_71cd9', ver: 'v2', at: '10:10', note: '初版配對' },
  { id: 'gen_a9ee', ver: 'out#4', at: '09:55', note: 'Webhook 回寫完成' },
  { id: 'gen_a9ee', ver: 'out#3', at: '09:52', note: '一次修復顏色漂移' },
]

const SPARK_24H = [12, 18, 14, 22, 30, 28, 24, 20, 26, 32, 40, 38, 35, 44, 50, 48, 46, 42, 40, 36, 34, 30, 25, 20]

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

      <div className="sim-card" style={{ marginTop: 12 }}>
        <div className="sim-card-head">過去 24h · 寫入與查詢熱度（每小時佔位，示範）</div>
        <p className="sim-mini-hint">尖峰 15:00–18:00；與團隊批次 embed 重疊。</p>
        <div className="sim-spark" aria-hidden="true">
          {SPARK_24H.map((h, i) => (
            <span
              key={i}
              style={{
                height: `${Math.min(26, 8 + h * 0.35)}px`,
                opacity: 0.35 + h / 180,
              }}
            />
          ))}
        </div>
      </div>

      <div className="sim-grid-2" style={{ marginTop: 12 }}>
        <div className="sim-card">
          <div className="sim-card-head">Webhook 來源健康度</div>
          <div className="sim-table-wrap">
            <table className="sim-table">
              <thead>
                <tr>
                  <th>來源</th>
                  <th>成功率</th>
                  <th>p95</th>
                  <th>佇列</th>
                  <th>錯誤率</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_WEBHOOKS.map((r) => (
                  <tr key={r.src}>
                    <td>{r.src}</td>
                    <td>{r.ok}</td>
                    <td className="sim-mono">{r.p95}</td>
                    <td>{r.q}</td>
                    <td>{r.err}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="sim-card">
          <div className="sim-card-head">模型佔比（近 7 天請求加权）</div>
          <p className="sim-mini-hint">用於成本分攤與提示詞風格校準參考。</p>
          {MOCK_MODEL_SHARE.map((r) => (
            <div key={r.m} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                <span>{r.m}</span>
                <span className="sim-mono">{r.w}%</span>
              </div>
              <div className="sim-bar" style={{ marginTop: 4 }}>
                <div className="sim-bar-fill sim-bar-fill--cyan" style={{ width: `${r.w}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sim-grid-3" style={{ marginTop: 12 }}>
        <div className="sim-card">
          <div className="sim-card-head">標籤熱度（TOP 10）</div>
          <div className="sim-table-wrap">
            <table className="sim-table">
              <thead>
                <tr>
                  <th>標籤</th>
                  <th>次數</th>
                  <th>週比</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TAGS.map((r) => (
                  <tr key={r.tag}>
                    <td>
                      <span className="doc-tag">{r.tag}</span>
                    </td>
                    <td className="sim-mono">{r.n.toLocaleString()}</td>
                    <td>{r.d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="sim-card">
          <div className="sim-card-head">延遲分位（示範）</div>
          <div className="sim-stats" style={{ marginTop: 4 }}>
            {MOCK_LAT.map((r) => (
              <div className="sim-stat-row" key={r.k}>
                <span className="sim-stat-label">{r.k}</span>
                <span className="sim-stat-val sim-mono">{r.v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="sim-card">
          <div className="sim-card-head">提示詞 / 產出版本流（節選）</div>
          <div className="sim-table-wrap">
            <table className="sim-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>版</th>
                  <th>時間</th>
                  <th>摘要</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_VERSIONS.map((r, i) => (
                  <tr key={`${r.id}-${i}`}>
                    <td className="sim-mono">{r.id}</td>
                    <td>{r.ver}</td>
                    <td className="sim-mono">{r.at}</td>
                    <td style={{ fontSize: '0.7rem' }}>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="sim-card" style={{ marginTop: 12 }}>
        <div className="sim-card-head">Embedding 佇列與重索引</div>
        <div className="sim-table-wrap">
          <table className="sim-table">
            <thead>
              <tr>
                <th>Job</th>
                <th>筆數</th>
                <th>狀態</th>
                <th>耗時/排程</th>
                <th>維度</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_EMBED.map((r) => (
                <tr key={r.id}>
                  <td className="sim-mono">{r.id}</td>
                  <td>{r.n}</td>
                  <td>
                    <span className="sim-badge-soft">{r.st}</span>
                  </td>
                  <td>{r.eta}</td>
                  <td>{r.dim}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
            <div className="sim-log-line">[index] HNSW ef_search=64 · recall@10 0.991</div>
            <div className="sim-log-line">[quota] org_a 剩餘 1.2M tokens 等價額度</div>
            <div className="sim-log-line">[dup] 合併重複提示詞 14 筆（相似度 0.97+）</div>
            <div className="sim-log-line">[api_key] 輪替 secondary key · 0 失敗</div>
          </div>
        </div>
      </div>

      <p className="doc-lab-note" style={{ marginTop: 12 }}>
        {t('doc_sf_sim_health_grid_note')}
      </p>

      <div className="sim-card" style={{ marginTop: 8 }}>
        <div className="sim-card-head">即時 API 端點（示範 · {MOCK_TABLE.length} 筆節錄）</div>
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
        <div className="sim-card-head">{t('doc_sf_sim_recent_title')}（TOP {MOCK_ENTITIES.length}）</div>
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
