import './labPanelStyles.css'

const APPLY_LOG = [
  { when: '14:00', from: 'SuperScript S07', what: '套用變體 B', est: 'ΔE +9%' },
  { when: '11:20', from: 'SuperForge prompt #8821', what: '壓縮 + 分層', est: '−$0.14' },
  { when: '昨 19:02', from: 'Batch #14', what: 'Tier 下調 gpt-4o-mini', est: '−$0.22' },
  { when: '昨 16:11', from: '長劇 EP3', what: '節奏拆場', est: 'pacing 0.81→0.88' },
  { when: '昨 10:40', from: '廣告文案 A/B', what: '勝出 B 已回寫', est: 'conf 99.2%' },
  { when: '昨 08:20', from: 'SuperTrack 信號', what: '熱詞權重 +cybercafe', est: 'hook +4%' },
  { when: '昨 01:10', from: 'Batch #11', what: '圖示解析度 −25%', est: '−$0.09' },
  { when: '週一', from: '導演風格實驗', what: '切換 王家衛 15% 混和', est: 'fid 80.2%' },
  { when: '週一', from: '成本護欄', what: '單場 token 超標阻擋 3 次', est: '省 $0.31' },
  { when: '上週', from: '多臂賭局', what: '模型臂 #2 凍結', est: '收益 +2.1%' },
]

const MODEL_COST = [
  { model: 'gpt-4o', share: 28, usd: 4.2, tok: '1.1M' },
  { model: 'gpt-4o-mini', share: 44, usd: 0.9, tok: '3.8M' },
  { model: 'claude-3.5-sonnet', share: 12, usd: 1.1, tok: '0.24M' },
  { model: 'embed-3-small', share: 9, usd: 0.12, tok: '8.2M' },
  { model: '其他 / 微調', share: 7, usd: 0.6, tok: '—' },
]

const GUARDRAIL = [
  { k: '幻覺率', v: '0.7%', s: 92 },
  { k: '越欄引用', v: '0.2%', s: 88 },
  { k: '品牌安全', v: 'A-', s: 85 },
  { k: '版權遮罩', v: 'on', s: 100 },
  { k: '人審佇列', v: '6 筆', s: 79 },
]

export function SuperTuneLabPanel() {
  return (
    <div className="sim-panel sim-panel--lab">
      <div className="sim-header">
        <div className="sim-header-left">
          <span className="sim-icon">🧠</span>
          <span className="sim-title">SuperTune</span>
          <span className="sim-badge sim-badge--purple">OPTIMIZATION</span>
          <span className="sim-live">
            <span className="sim-dot sim-dot--purple" /> LIVE
          </span>
          <span className="sim-badge-soft" style={{ marginLeft: 8 }}>
            LAB · 示範資料
          </span>
        </div>
        <div className="sim-header-right">
          <button type="button" className="sim-btn sim-btn--primary">
            ✅ 套用變體 B
          </button>
          <button type="button" className="sim-btn sim-btn--outline">
            ↩️ 復原
          </button>
        </div>
      </div>

      <p className="doc-lab-note">A/B 與成本面板：兩組平行測試＋彙總；下方為品質三卡與風格遷移。</p>

      <div className="sim-grid-2">
        <div className="sim-card">
          <div className="sim-card-head">🔬 A/B · 行銷文案（n=1,247）</div>
          <p style={{ fontSize: '0.65rem', opacity: 0.5, marginBottom: 8 }}>E=互動、R=回應品質；紫色勝出。</p>
          <div className="sim-ab-universe">
            <div className="sim-ab-label">宇宙 A (原始)</div>
            <div className="sim-ab-row">
              <span className="sim-ab-dim">E</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--cyan" style={{ width: '72%' }} />
              </div>
              <span className="sim-ab-score">72.0%</span>
            </div>
            <div className="sim-ab-row">
              <span className="sim-ab-dim">R</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--cyan" style={{ width: '68%' }} />
              </div>
              <span className="sim-ab-score">68.1%</span>
            </div>
          </div>
          <div className="sim-ab-universe" style={{ marginTop: 8 }}>
            <div className="sim-ab-label" style={{ color: '#a78bfa' }}>
              宇宙 B (變體) ✓
            </div>
            <div className="sim-ab-row">
              <span className="sim-ab-dim">E</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--purple" style={{ width: '88%' }} />
              </div>
              <span className="sim-ab-score">88.0%</span>
            </div>
            <div className="sim-ab-row">
              <span className="sim-ab-dim">R</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--purple" style={{ width: '79%' }} />
              </div>
              <span className="sim-ab-score">79.3%</span>
            </div>
          </div>
          <div className="sim-kpis" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginTop: 8 }}>
            <div className="sim-kpi">
              <div className="sim-kpi-label">effect size</div>
              <div className="sim-kpi-val sim-kpi-val--highlight" style={{ fontSize: '0.8rem' }}>
                0.38
              </div>
            </div>
            <div className="sim-kpi">
              <div className="sim-kpi-label">confidence</div>
              <div className="sim-kpi-val" style={{ fontSize: '0.8rem' }}>
                99.7%
              </div>
            </div>
            <div className="sim-kpi">
              <div className="sim-kpi-label">winner</div>
              <div className="sim-kpi-val" style={{ fontSize: '0.8rem', color: '#a78bfa' }}>
                B ↑16%
              </div>
            </div>
          </div>
        </div>

        <div className="sim-card">
          <div className="sim-card-head">🔬 A/B · 圖像 prompt（n=512）</div>
          <div className="sim-ab-universe">
            <div className="sim-ab-label">Short prompt (A)</div>
            <div className="sim-ab-row">
              <span className="sim-ab-dim">detail</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--cyan" style={{ width: '62%' }} />
              </div>
              <span className="sim-ab-score">62%</span>
            </div>
            <div className="sim-ab-row">
              <span className="sim-ab-dim">style</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--cyan" style={{ width: '74%' }} />
              </div>
              <span className="sim-ab-score">74%</span>
            </div>
          </div>
          <div className="sim-ab-universe" style={{ marginTop: 8 }}>
            <div className="sim-ab-label" style={{ color: '#a78bfa' }}>
              Long + lens (B) ✓
            </div>
            <div className="sim-ab-row">
              <span className="sim-ab-dim">detail</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--purple" style={{ width: '91%' }} />
              </div>
              <span className="sim-ab-score">91%</span>
            </div>
            <div className="sim-ab-row">
              <span className="sim-ab-dim">style</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--purple" style={{ width: '88%' }} />
              </div>
              <span className="sim-ab-score">88%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sim-card" style={{ marginTop: 12 }}>
        <div className="sim-card-head">🔬 A/B · 分鏡敘事節奏（n=2,180 · 7 秒內要抓住）</div>
        <p style={{ fontSize: '0.65rem', opacity: 0.5, marginBottom: 8 }}>C=觀眾留在前 7s、H=情緒抬升；B 在剪輯點上勝出。</p>
        <div className="sim-grid-2" style={{ marginTop: 0 }}>
          <div className="sim-ab-universe">
            <div className="sim-ab-label">剪輯方案 A（均速）</div>
            <div className="sim-ab-row">
              <span className="sim-ab-dim">C</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--cyan" style={{ width: '64%' }} />
              </div>
              <span className="sim-ab-score">64%</span>
            </div>
            <div className="sim-ab-row">
              <span className="sim-ab-dim">H</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--cyan" style={{ width: '58%' }} />
              </div>
              <span className="sim-ab-score">0.58</span>
            </div>
          </div>
          <div className="sim-ab-universe">
            <div className="sim-ab-label" style={{ color: '#a78bfa' }}>
              剪輯方案 B（兩次 micro-hook）✓
            </div>
            <div className="sim-ab-row">
              <span className="sim-ab-dim">C</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--purple" style={{ width: '79%' }} />
              </div>
              <span className="sim-ab-score">79%</span>
            </div>
            <div className="sim-ab-row">
              <span className="sim-ab-dim">H</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--purple" style={{ width: '74%' }} />
              </div>
              <span className="sim-ab-score">0.72</span>
            </div>
          </div>
        </div>
        <div className="sim-kpis" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginTop: 8 }}>
          <div className="sim-kpi">
            <div className="sim-kpi-label">uplift</div>
            <div className="sim-kpi-val sim-kpi-val--highlight" style={{ fontSize: '0.8rem' }}>
              +15%
            </div>
          </div>
          <div className="sim-kpi">
            <div className="sim-kpi-label">p-value</div>
            <div className="sim-kpi-val" style={{ fontSize: '0.8rem' }}>
              0.002
            </div>
          </div>
          <div className="sim-kpi">
            <div className="sim-kpi-label">cohort</div>
            <div className="sim-kpi-val" style={{ fontSize: '0.7rem' }}>
              Z / 行動
            </div>
          </div>
          <div className="sim-kpi">
            <div className="sim-kpi-label">建議</div>
            <div className="sim-kpi-val" style={{ fontSize: '0.7rem', color: '#a78bfa' }}>
              導出至剪輯
            </div>
          </div>
        </div>
      </div>

      <div className="sim-grid-2" style={{ marginTop: 12 }}>
        <div className="sim-card">
          <div className="sim-card-head">🧮 近 7 天模型與權重成本（示範）</div>
          <div className="sim-table-wrap">
            <table className="sim-table">
              <thead>
                <tr>
                  <th>模型</th>
                  <th>佔比</th>
                  <th>USD(估)</th>
                  <th>Token</th>
                </tr>
              </thead>
              <tbody>
                {MODEL_COST.map((r) => (
                  <tr key={r.model}>
                    <td>{r.model}</td>
                    <td className="sim-mono">{r.share}%</td>
                    <td>${r.usd.toFixed(2)}</td>
                    <td className="sim-mono">{r.tok}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="sim-card">
          <div className="sim-card-head">🛡️ 安全 / 合規儀表（抽樣＋人審佇列）</div>
          {GUARDRAIL.map((r) => (
            <div key={r.k} className="sim-net-row" style={{ marginBottom: 6 }}>
              <span style={{ fontSize: '0.72rem' }}>{r.k}</span>
              <div className="sim-bar" style={{ flex: 1, margin: '0 8px' }}>
                <div className="sim-bar-fill sim-bar-fill--green" style={{ width: `${r.s}%` }} />
              </div>
              <span className="sim-mono" style={{ fontSize: '0.72rem' }}>
                {r.v}
              </span>
            </div>
          ))}
          <p className="sim-mini-hint" style={{ marginTop: 8 }}>
            分數僅用於實驗室展示；實務須接貴司合規與內審流。
          </p>
        </div>
      </div>

      <div className="sim-card" style={{ marginTop: 12 }}>
        <div className="sim-card-head">⏱️ 端到端延遲分解（p95，示範 ms）</div>
        <div className="sim-net-metrics" style={{ marginTop: 6 }}>
          <div className="sim-net-row">
            <span>queue_wait</span>
            <div className="sim-bar">
              <div className="sim-bar-fill sim-bar-fill--purple" style={{ width: '22%' }} />
            </div>
            <span>8</span>
          </div>
          <div className="sim-net-row">
            <span>llm_decode</span>
            <div className="sim-bar">
              <div className="sim-bar-fill sim-bar-fill--purple" style={{ width: '62%' }} />
            </div>
            <span>420</span>
          </div>
          <div className="sim-net-row">
            <span>post_edit</span>
            <div className="sim-bar">
              <div className="sim-bar-fill sim-bar-fill--purple" style={{ width: '12%' }} />
            </div>
            <span>24</span>
          </div>
          <div className="sim-net-row">
            <span>export_hook</span>
            <div className="sim-bar">
              <div className="sim-bar-fill sim-bar-fill--purple" style={{ width: '4%' }} />
            </div>
            <span>4</span>
          </div>
        </div>
      </div>

      <div className="sim-card" style={{ marginTop: 12 }}>
        <div className="sim-card-head">💸 成本與快取（累計示範）</div>
        <p style={{ fontSize: '0.65rem', opacity: 0.5, marginBottom: 6 }}>今日已省與可預估節省。</p>
        <div style={{ textAlign: 'center', padding: '4px 0 10px' }}>
          <div style={{ fontSize: '0.55rem', color: 'rgba(148,163,184,0.4)' }}>Total Saved (24h)</div>
          <div
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#34d399',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            $2.86
          </div>
          <div style={{ fontSize: '0.55rem', color: '#22c55e' }}>↓ 22% vs baseline</div>
        </div>
        <div className="sim-strategy-list">
          <div className="sim-strategy sim-strategy--active">
            <span>✅</span>
            <span>Prompt 壓縮</span>
            <span className="sim-strategy-saving">-$0.38</span>
          </div>
          <div className="sim-strategy sim-strategy--active">
            <span>✅</span>
            <span>Context Window 管理</span>
            <span className="sim-strategy-saving">-$0.22</span>
          </div>
          <div className="sim-strategy sim-strategy--active">
            <span>✅</span>
            <span>Batch 合併請求</span>
            <span className="sim-strategy-saving">-$0.15</span>
          </div>
          <div className="sim-strategy sim-strategy--active">
            <span>✅</span>
            <span>Model Tier 降級</span>
            <span className="sim-strategy-saving">-$0.19</span>
          </div>
          <div className="sim-strategy">
            <span>○</span>
            <span>推理快取 (Redis)</span>
            <span style={{ color: 'rgba(148,163,184,0.4)' }}>-$0.12 est.</span>
          </div>
          <div className="sim-strategy">
            <span>○</span>
            <span>圖示解析度自適應</span>
            <span style={{ color: 'rgba(148,163,184,0.4)' }}>-$0.08 est.</span>
          </div>
        </div>
      </div>

      <p className="doc-lab-note" style={{ marginTop: 12 }}>
        品質三卡：節奏、張力、新鮮度；右下為導演風格實驗室。
      </p>
      <div className="sim-grid-3">
        <div className="sim-card">
          <div className="sim-card-head">⏱️ 節奏指數 0.87</div>
          <div className="sim-metric-list">
            <div className="sim-metric-row">
              <span>Scene Length</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--purple" style={{ width: '82%' }} />
              </div>
              <span>0.82</span>
            </div>
            <div className="sim-metric-row">
              <span>Dialogue Dense</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--purple" style={{ width: '75%' }} />
              </div>
              <span>0.75</span>
            </div>
            <div className="sim-metric-row">
              <span>Action Rhythm</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--purple" style={{ width: '91%' }} />
              </div>
              <span>0.91</span>
            </div>
            <div className="sim-metric-row">
              <span>Cuttability</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--purple" style={{ width: '68%' }} />
              </div>
              <span>0.68</span>
            </div>
          </div>
        </div>
        <div className="sim-card">
          <div className="sim-card-head">🔥 張力曲線 0.83</div>
          <div className="sim-metric-list">
            <div className="sim-metric-row">
              <span>Act1 Setup</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--red" style={{ width: '35%' }} />
              </div>
              <span>0.35</span>
            </div>
            <div className="sim-metric-row">
              <span>Act2 Rising</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--amber" style={{ width: '72%' }} />
              </div>
              <span>0.72</span>
            </div>
            <div className="sim-metric-row">
              <span>Act3 Climax</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--red" style={{ width: '95%' }} />
              </div>
              <span>0.95</span>
            </div>
            <div className="sim-metric-row">
              <span>Resolution</span>
              <div className="sim-bar">
                <div className="sim-bar-fill sim-bar-fill--cyan" style={{ width: '28%' }} />
              </div>
              <span>0.28</span>
            </div>
          </div>
          <div
            style={{ marginTop: 6, fontSize: '0.5rem', color: 'rgba(148,163,184,0.4)', textAlign: 'center' }}
          >
            Hollywood curve match: <strong style={{ color: '#e2e8f0' }}>88%</strong>
          </div>
        </div>
        <div className="sim-card">
          <div className="sim-card-head">✨ 新鮮度 0.76</div>
          <div className="sim-trope-list">
            <div className="sim-trope sim-trope--warn">
              <span>⚠ HIGH</span>
              <span>Chosen One (S02)</span>
            </div>
            <div className="sim-trope sim-trope--warn">
              <span>⚠ HIGH</span>
              <span>Love Triangle (S05)</span>
            </div>
            <div className="sim-trope sim-trope--ok">
              <span>LOW</span>
              <span>Training Montage (S03)</span>
            </div>
            <div className="sim-trope sim-trope--ok">
              <span>LOW</span>
              <span>Betrayal Twist (S09)</span>
            </div>
            <div className="sim-trope sim-trope--ok">
              <span>LOW</span>
              <span>夢境蒙太奇 (S08)</span>
            </div>
          </div>
          <div className="sim-kpis" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: 4, marginTop: 8 }}>
            <div className="sim-kpi">
              <div className="sim-kpi-label">tropes</div>
              <div className="sim-kpi-val" style={{ fontSize: '0.8rem' }}>
                5
              </div>
            </div>
            <div className="sim-kpi">
              <div className="sim-kpi-label">originality</div>
              <div className="sim-kpi-val sim-kpi-val--highlight" style={{ fontSize: '0.8rem' }}>
                0.84
              </div>
            </div>
            <div className="sim-kpi">
              <div className="sim-kpi-label">surprise</div>
              <div className="sim-kpi-val" style={{ fontSize: '0.8rem' }}>
                0.71
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sim-card" style={{ marginTop: 12 }}>
        <div className="sim-card-head">🎨 神經風格遷移 BETA</div>
        <p style={{ fontSize: '0.6rem', opacity: 0.5, marginBottom: 8 }}>導演指紋＋敘事節奏學習；示範進度 S05。</p>
        <div className="sim-kpis" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
          <div className="sim-kpi">
            <div className="sim-kpi-label">active</div>
            <div className="sim-kpi-val" style={{ fontSize: '0.75rem' }}>
              諾蘭敘事
            </div>
          </div>
          <div className="sim-kpi">
            <div className="sim-kpi-label">fidelity</div>
            <div className="sim-kpi-val sim-kpi-val--highlight" style={{ fontSize: '0.8rem' }}>
              83.1%
            </div>
          </div>
          <div className="sim-kpi">
            <div className="sim-kpi-label">scene</div>
            <div className="sim-kpi-val" style={{ fontSize: '0.75rem' }}>
              S05 ⟳
            </div>
          </div>
          <div className="sim-kpi">
            <div className="sim-kpi-label">voice 保留</div>
            <div className="sim-kpi-val" style={{ fontSize: '0.8rem' }}>
              81%
            </div>
            <div className="sim-bar">
              <div className="sim-bar-fill sim-bar-fill--purple" style={{ width: '81%' }} />
            </div>
          </div>
        </div>
        <div className="sim-style-tags" style={{ marginTop: 8 }}>
          <span className="sim-style-tag sim-style-tag--active">諾蘭敘事</span>
          <span className="sim-style-tag">是枝裕和</span>
          <span className="sim-style-tag">王家衛</span>
          <span className="sim-style-tag">昆汀</span>
          <span className="sim-style-tag">新海誠</span>
          <span className="sim-style-tag">+ 自定義</span>
        </div>
      </div>

      <div className="sim-card" style={{ marginTop: 12 }}>
        <div className="sim-card-head">🧾 最近套用紀錄（{APPLY_LOG.length} 筆 · 示範）</div>
        <div className="sim-table-wrap">
          <table className="sim-table">
            <thead>
              <tr>
                <th>時間</th>
                <th>來源</th>
                <th>操作</th>
                <th>指標 / 金額</th>
              </tr>
            </thead>
            <tbody>
              {APPLY_LOG.map((r) => (
                <tr key={r.when + r.from}>
                  <td className="sim-mono">{r.when}</td>
                  <td>{r.from}</td>
                  <td>{r.what}</td>
                  <td>{r.est}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
