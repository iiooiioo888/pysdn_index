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
  { pct: 86, label: '多租戶隔離' },
  { pct: 91, label: '稽核日誌' },
  { pct: 78, label: 'PII 遮罩' },
  { pct: 89, label: '引用／授權' },
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
  { t: '13:58:10', ep: 'GET /v1/prompts/:id/lineage', ms: '27ms', code: '200' },
  { t: '13:57:55', ep: 'POST /v1/dedup/cluster', ms: '190ms', code: '200' },
  { t: '13:57:20', ep: 'PUT /v1/tenants/:id/quota', ms: '14ms', code: '200' },
  { t: '13:56:48', ep: 'GET /v1/rag/hydrate?k=8', ms: '55ms', code: '200' },
  { t: '13:56:01', ep: 'POST /v1/license/verify', ms: '33ms', code: '200' },
  { t: '13:55:40', ep: 'GET /v1/metrics/usage/by-org', ms: '19ms', code: '200' },
  { t: '13:55:02', ep: 'POST /v1/export/parquet', ms: '240ms', code: '202' },
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
  { k: 'RAG 串流首字', v: '88ms' },
  { k: '跨模態對齊', v: '41ms' },
  { k: '去重叢集讀', v: '26ms' },
  { k: '金鑰簽名驗證', v: '3ms' },
]

const MOCK_RAG = [
  { m: 'recall@5', v: '0.941' },
  { m: 'MRR', v: '0.882' },
  { m: 'nDCG@10', v: '0.901' },
  { m: '幻覺率(抽樣)', v: '0.6%' },
  { m: '重排序延遲 p95', v: '22ms' },
  { m: '負向 chunk 權重', v: '0.12' },
]

const MOCK_TENANT = [
  { org: 'acme_creative', rps: '48/s', burst: '120', role: 'admin' },
  { org: 'studio_north', rps: '12/s', burst: '40', role: 'write' },
  { org: 'vendor_x', rps: '4/s', burst: '12', role: 'read' },
  { org: 'partner_api', rps: '200/s', burst: '500', role: 'service' },
]

const MOCK_LINEAGE = [
  { src: 'Webhook MJ', to: 'prm_8f2a1', st: 'linked' },
  { src: '手動匯入 CSV', to: 'batch_14', st: 'parsed' },
  { src: 'embed job-7c1', to: 'vec_ns_prod', st: 'indexing' },
  { src: 'SuperTrack 採集', to: 'tag_ext_ref', st: 'enriched' },
  { src: '版本 diff v11→v12', to: 'audit_902', st: 'recorded' },
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

const MOCK_CHAR_ROWS: {
  name: string
  profile: string
  license: string
  style: string
  status: 'verified' | 'active' | 'review' | 'hold'
  opt: string
}[] = [
  {
    name: '星川 澪（OC）',
    profile: '二次元·自社原創',
    license: '自有版權',
    style: '2D',
    status: 'active',
    opt: '0.94',
  },
  {
    name: '合作 KOL 肖像',
    profile: '真人·書面合約',
    license: '商用＋期間',
    style: '寫實',
    status: 'verified',
    opt: '0.88',
  },
  {
    name: '同人二創（標註出處）',
    profile: '二次元·二創',
    license: '需載明出處',
    style: '2D',
    status: 'review',
    opt: '0.71',
  },
  {
    name: '企業聯名 IP 角色',
    profile: '版權方授權',
    license: '區域＋品類',
    style: '2D/3D',
    status: 'verified',
    opt: '0.91',
  },
  {
    name: '內測素人素材',
    profile: '真人',
    license: '待審',
    style: '寫實',
    status: 'hold',
    opt: '0.62',
  },
]

const MOCK_LICENSE_MIX: { k: 'inhouse' | 'contract' | 'fan' | 'ip'; w: number }[] = [
  { k: 'inhouse', w: 38 },
  { k: 'contract', w: 22 },
  { k: 'fan', w: 18 },
  { k: 'ip', w: 22 },
]

const MOCK_CHAR_OPT_QUEUE: { q: 'q1' | 'q2' | 'q3'; st: string }[] = [
  { q: 'q1', st: 'running' },
  { q: 'q2', st: 'queued' },
  { q: 'q3', st: 'queued' },
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

      <p className="doc-lab-note" style={{ marginTop: 14 }}>
        {t('doc_sf_lab_char_p')}
      </p>
      <div className="sim-kpis" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        <div className="sim-kpi">
          <div className="sim-kpi-label">{t('doc_sf_lab_char_kpi_n')}</div>
          <div className="sim-kpi-val">42</div>
          <div className="sim-kpi-delta sim-kpi-delta--up">{t('doc_sf_lab_char_kpi_delta_wow')}</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">{t('doc_sf_lab_char_kpi_g')}</div>
          <div className="sim-kpi-val">1,204</div>
          <div className="sim-kpi-delta sim-kpi-delta--up">+86</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">{t('doc_sf_lab_char_kpi_l')}</div>
          <div className="sim-kpi-val sim-kpi-val--highlight">91%</div>
          <div className="sim-bar">
            <div className="sim-bar-fill sim-bar-fill--cyan" style={{ width: '91%' }} />
          </div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">{t('doc_sf_lab_char_kpi_o')}</div>
          <div className="sim-kpi-val">156</div>
          <div className="sim-kpi-sub">{t('doc_sf_lab_char_kpi_sub_7d')}</div>
        </div>
      </div>

      <div className="sim-grid-2" style={{ marginTop: 12 }}>
        <div className="sim-card">
          <div className="sim-card-head">{t('doc_sf_lab_char_h')}</div>
          <div className="sim-table-wrap">
            <table className="sim-table">
              <thead>
                <tr>
                  <th>{t('doc_sf_lab_char_th_name')}</th>
                  <th>{t('doc_sf_lab_char_th_profile')}</th>
                  <th>{t('doc_sf_lab_char_th_license')}</th>
                  <th>{t('doc_sf_lab_char_th_style')}</th>
                  <th>{t('doc_sf_lab_char_th_status')}</th>
                  <th className="sim-mono">{t('doc_sf_lab_char_th_opt')}</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_CHAR_ROWS.map((r) => (
                  <tr key={r.name}>
                    <td>{r.name}</td>
                    <td>{r.profile}</td>
                    <td>{r.license}</td>
                    <td>{r.style}</td>
                    <td>
                      {r.status === 'verified' && t('doc_sf_lab_char_st_verified')}
                      {r.status === 'active' && t('doc_sf_lab_char_st_active')}
                      {r.status === 'review' && t('doc_sf_lab_char_st_review')}
                      {r.status === 'hold' && t('doc_sf_lab_char_st_hold')}
                    </td>
                    <td className="sim-mono">{r.opt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="sim-card">
          <div className="sim-card-head">{t('doc_sf_lab_char_sub_license')}</div>
          {MOCK_LICENSE_MIX.map((row) => (
            <div key={row.k} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                <span>
                  {row.k === 'inhouse' && t('doc_sf_lab_char_lic_inhouse')}
                  {row.k === 'contract' && t('doc_sf_lab_char_lic_contract')}
                  {row.k === 'fan' && t('doc_sf_lab_char_lic_fan')}
                  {row.k === 'ip' && t('doc_sf_lab_char_lic_ip')}
                </span>
                <span className="sim-mono">{row.w}%</span>
              </div>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--cyan" style={{ width: `${row.w}%` }} />
              </div>
            </div>
          ))}
          <div className="sim-card-head" style={{ marginTop: 14 }}>
            {t('doc_sf_lab_char_sub_queue')}
          </div>
          <ul className="sim-mini-list" style={{ margin: 0, paddingLeft: 18, fontSize: '0.75rem', lineHeight: 1.6 }}>
            {MOCK_CHAR_OPT_QUEUE.map((row) => (
              <li key={row.q}>
                <span className="sim-mono" style={{ marginRight: 6 }}>
                  {row.q === 'q1' ? t('doc_sf_lab_char_q1') : row.q === 'q2' ? t('doc_sf_lab_char_q2') : t('doc_sf_lab_char_q3')}
                </span>
                <span style={{ opacity: 0.75 }}>
                  {row.st === 'running' ? t('doc_sf_lab_char_queue_st_running') : t('doc_sf_lab_char_queue_st_queued')}
                </span>
              </li>
            ))}
          </ul>
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

      <p className="doc-lab-note" style={{ marginTop: 12 }}>
        多租戶、RAG 與譜系：示範維度覆蓋配額、檢索品質與資料血緣；與 health 圖分開呈現便於排錯。
      </p>
      <div className="sim-grid-2" style={{ marginTop: 8 }}>
        <div className="sim-card">
          <div className="sim-card-head">RAG / 重排序品質</div>
          <div className="sim-stats" style={{ marginTop: 4 }}>
            {MOCK_RAG.map((r) => (
              <div className="sim-stat-row" key={r.m}>
                <span className="sim-stat-label">{r.m}</span>
                <span className="sim-stat-val sim-mono">{r.v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="sim-card">
          <div className="sim-card-head">租戶與配額（示範）</div>
          <div className="sim-table-wrap">
            <table className="sim-table">
              <thead>
                <tr>
                  <th>組織 / 專案</th>
                  <th>RPS</th>
                  <th>Burst</th>
                  <th>權限</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TENANT.map((r) => (
                  <tr key={r.org}>
                    <td className="sim-mono">{r.org}</td>
                    <td>{r.rps}</td>
                    <td>{r.burst}</td>
                    <td>
                      <span className="sim-badge-soft">{r.role}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="sim-card" style={{ marginTop: 12 }}>
        <div className="sim-card-head">資料譜系與審核（節選）</div>
        <p className="sim-mini-hint">由來源 → 產物／索引狀態；可串稽核匯出。</p>
        <div className="sim-table-wrap">
          <table className="sim-table">
            <thead>
              <tr>
                <th>來源</th>
                <th>關聯目標</th>
                <th>狀態</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LINEAGE.map((r, i) => (
                <tr key={`${r.src}-${i}`}>
                  <td>{r.src}</td>
                  <td className="sim-mono">{r.to}</td>
                  <td>
                    <span className="sim-badge-soft">{r.st}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="sim-kpis" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))', marginTop: 12 }}>
        <div className="sim-kpi">
          <div className="sim-kpi-label">dedup_cluster</div>
          <div className="sim-kpi-val">1,204</div>
          <div className="sim-kpi-sub">合併候選</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">s3_egress</div>
          <div className="sim-kpi-val">1.1TB/mo</div>
          <div className="sim-kpi-delta">−6% 優化</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">pii_hits(24h)</div>
          <div className="sim-kpi-val">3</div>
          <div className="sim-kpi-sub">已遮罩</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">est_cost(月)</div>
          <div className="sim-kpi-val">$480</div>
          <div className="sim-kpi-sub">全租戶加總</div>
        </div>
      </div>

      <div className="sim-grid-2" style={{ marginTop: 16 }}>
        <div className="sim-card">
          <div className="sim-card-head">
            {t('doc_sf_sim_health_title')}（12 維度 · 含合規／租戶）
          </div>
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
