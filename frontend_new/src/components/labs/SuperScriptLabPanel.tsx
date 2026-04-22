import './labPanelStyles.css'

const SUGGEST_EXTRA = [
  { p: 'P1' as const, t: '補強 EP2 伏筆', d: 'S03 出現的道具需在 EP2 埋線', i: '+5%' },
  { p: 'P2' as const, t: '壓縮臺詞長度', d: 'S11 單句平均字數 48 → 目標 32', i: '+3%' },
  { p: 'P2' as const, t: '角色 @Lin 出場平衡', d: 'S08 出場少於 20 行', i: '+2%' },
  { p: 'P3' as const, t: '刪減同義反覆', d: 'S02/S09 有 3 處情緒重複', i: '+1%' },
]

const SCENE_Q = [
  { id: 'EP1·S01', fn: 'Hook', st: 'done', line: 38 },
  { id: 'EP1·S02', fn: 'Rising', st: 'done', line: 44 },
  { id: 'EP1·S03', fn: 'Rising+', st: 'writing', line: 47 },
  { id: 'EP1·S04', fn: 'Turn', st: 'queued', line: 0 },
  { id: 'EP1·S05', fn: 'Climax', st: 'queued', line: 0 },
  { id: 'EP1·S06', fn: 'Resolution', st: 'queued', line: 0 },
]

const WRITER_BUFFER = `@MEI (INT. 倉庫 - 夜)
她盯著螢幕上亂跳的信號。遠方雷聲被金屬牆悶住。

@MEI
看見了。不用解釋。

@KAI (小聲)
我以為我們已經——`

export function SuperScriptLabPanel() {
  return (
    <div className="sim-panel sim-panel--lab">
      <div className="sim-header">
        <div className="sim-header-left">
          <span className="sim-icon">🎬</span>
          <span className="sim-title">SuperScript</span>
          <span className="sim-badge sim-badge--amber">SCRIPT ENGINE</span>
          <span className="sim-live">
            <span className="sim-dot sim-dot--amber" /> LIVE
          </span>
          <span className="sim-badge-soft" style={{ marginLeft: 8 }}>
            LAB · 示範資料
          </span>
        </div>
        <div className="sim-header-right">
          <button type="button" className="sim-btn sim-btn--primary">
            ▶️ 繼續生成
          </button>
          <button type="button" className="sim-btn sim-btn--outline">
            ⏸️ 暫停
          </button>
        </div>
      </div>

      <p className="doc-lab-note">四 Agent 流水線；當前 Writer 正在填充 EP1 · S03。</p>
      <div className="sim-pipeline">
        <div className="sim-pipe-step sim-pipe-step--done">
          <span>✓</span> Architect
        </div>
        <span className="sim-pipe-arrow">→</span>
        <div className="sim-pipe-step sim-pipe-step--done">
          <span>✓</span> Continuity
        </div>
        <span className="sim-pipe-arrow">→</span>
        <div className="sim-pipe-step sim-pipe-step--active">
          <span className="sim-pipe-spin">⟳</span> Writer
        </div>
        <span className="sim-pipe-arrow">→</span>
        <div className="sim-pipe-step">
          <span>○</span> Format
        </div>
      </div>

      <p className="doc-lab-note">Writer 當前場景進度</p>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px 0' }}>
        <span className="sim-kpi-label" style={{ margin: 0, flexShrink: 0 }}>
          writer progress
        </span>
        <div
          style={{
            flex: 1,
            height: 10,
            borderRadius: 4,
            background: 'rgba(148,163,184,0.08)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: '64%',
              borderRadius: 4,
              background: 'linear-gradient(90deg, rgba(245,158,11,0.3), #f59e0b)',
            }}
          />
        </div>
        <span className="sim-kpi-val" style={{ fontSize: '0.85rem' }}>
          64%
        </span>
      </div>

      <div className="sim-kpis" style={{ marginTop: 8 }}>
        <div className="sim-kpi">
          <div className="sim-kpi-label">scene</div>
          <div className="sim-kpi-val sim-kpi-val--highlight">EP1 · S03</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">lines</div>
          <div className="sim-kpi-val">51</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">voice_match</div>
          <div className="sim-kpi-val sim-kpi-val--highlight">96.3%</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">pacing</div>
          <div className="sim-kpi-val">0.87</div>
          <div className="sim-bar">
            <div className="sim-bar-fill sim-bar-fill--amber" style={{ width: '87%' }} />
          </div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">beats</div>
          <div className="sim-kpi-val">16</div>
        </div>
        <div className="sim-kpi">
          <div className="sim-kpi-label">EP1 完成</div>
          <div className="sim-ring">
            <svg viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeDasharray="100.53"
                strokeDashoffset="55"
                strokeLinecap="round"
              />
            </svg>
            <span className="sim-ring-label">45%</span>
          </div>
          <div className="sim-kpi-sub">5/12 scenes</div>
        </div>
      </div>

      <div className="sim-card" style={{ marginTop: 16 }}>
        <div className="sim-card-head">分幕佇列（示範）</div>
        <div className="sim-table-wrap">
          <table className="sim-table">
            <thead>
              <tr>
                <th>場次</th>
                <th>敘事功能</th>
                <th>狀態</th>
                <th>行數</th>
              </tr>
            </thead>
            <tbody>
              {SCENE_Q.map((r) => (
                <tr key={r.id}>
                  <td className="sim-mono">{r.id}</td>
                  <td>{r.fn}</td>
                  <td>
                    <span className="sim-badge-soft">{r.st}</span>
                  </td>
                  <td>{r.line}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="sim-card" style={{ marginTop: 12 }}>
        <div className="sim-card-head">Writer 即時緩衝（摘錄）</div>
        <pre
          className="sim-mono"
          style={{
            margin: 0,
            whiteSpace: 'pre-wrap',
            background: 'rgba(0,0,0,0.35)',
            padding: 12,
            borderRadius: 8,
            fontSize: '0.78rem',
            lineHeight: 1.6,
            border: '1px solid var(--border)',
          }}
        >
          {WRITER_BUFFER}
        </pre>
      </div>

      <p className="doc-lab-note" style={{ marginTop: 16 }}>
        左側四維一致性、右側 AI 建議；下方為額外示範列。
      </p>
      <div className="sim-grid-2">
        <div className="sim-card">
          <div className="sim-card-head">🛡️ 一致性監控</div>
          <div className="sim-consist">
            <div className="sim-consist-row">
              <span className="sim-consist-num">L1</span>
              <span className="sim-consist-name">角色一致性</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--green" style={{ width: '96%' }} />
              </div>
              <span className="sim-consist-val">96%</span>
            </div>
            <div className="sim-consist-row">
              <span className="sim-consist-num">L2</span>
              <span className="sim-consist-name">世界觀一致性</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--green" style={{ width: '91%' }} />
              </div>
              <span className="sim-consist-val">91%</span>
            </div>
            <div className="sim-consist-row sim-consist-row--warn">
              <span className="sim-consist-num">L3</span>
              <span className="sim-consist-name">時間線一致性</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--amber" style={{ width: '74%' }} />
              </div>
              <span className="sim-consist-val" style={{ color: '#f59e0b' }}>
                74% ⚠
              </span>
            </div>
            <div className="sim-consist-row">
              <span className="sim-consist-num">L4</span>
              <span className="sim-consist-name">風格一致性</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--green" style={{ width: '88%' }} />
              </div>
              <span className="sim-consist-val">88%</span>
            </div>
            <div className="sim-consist-row">
              <span className="sim-consist-num">L5</span>
              <span className="sim-consist-name">台詞多語一致性</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--green" style={{ width: '93%' }} />
              </div>
              <span className="sim-consist-val">93%</span>
            </div>
            <div className="sim-consist-row">
              <span className="sim-consist-num">L6</span>
              <span className="sim-consist-name">分鏡與劇情對齊</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--green" style={{ width: '89%' }} />
              </div>
              <span className="sim-consist-val">89%</span>
            </div>
          </div>
        </div>

        <div className="sim-card">
          <div className="sim-card-head">💡 優化建議</div>
          <div className="sim-suggest">
            <div className="sim-suggest-item">
              <span className="sim-suggest-prio sim-suggest-prio--p0">P0</span>
              <div>
                <div className="sim-suggest-title">縮短 S07 場景</div>
                <div className="sim-suggest-desc">4m38s → 建議拆分為 S07a + S07b</div>
              </div>
              <span className="sim-suggest-impact">+12%</span>
            </div>
            <div className="sim-suggest-item">
              <span className="sim-suggest-prio sim-suggest-prio--p0">P0</span>
              <div>
                <div className="sim-suggest-title">強化 @Kai 角色動機</div>
                <div className="sim-suggest-desc">S04 缺乏驅動行為的內在衝突</div>
              </div>
              <span className="sim-suggest-impact">+8%</span>
            </div>
            <div className="sim-suggest-item">
              <span className="sim-suggest-prio sim-suggest-prio--p1">P1</span>
              <div>
                <div className="sim-suggest-title">S05 Love Triangle → rival</div>
                <div className="sim-suggest-desc">降低 trope 風險，提升新鮮度</div>
              </div>
              <span className="sim-suggest-impact">+6%</span>
            </div>
            <div className="sim-suggest-item">
              <span className="sim-suggest-prio sim-suggest-prio--p2">P2</span>
              <div>
                <div className="sim-suggest-title">S10 meme-worthy 對白</div>
                <div className="sim-suggest-desc">提升社群傳播潛力</div>
              </div>
              <span className="sim-suggest-impact">+4%</span>
            </div>
            {SUGGEST_EXTRA.map((x) => (
              <div className="sim-suggest-item" key={x.t}>
                <span
                  className={`sim-suggest-prio ${
                    x.p === 'P1' ? 'sim-suggest-prio--p1' : 'sim-suggest-prio--p2'
                  }`}
                >
                  {x.p}
                </span>
                <div>
                  <div className="sim-suggest-title">{x.t}</div>
                  <div className="sim-suggest-desc">{x.d}</div>
                </div>
                <span className="sim-suggest-impact">{x.i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
