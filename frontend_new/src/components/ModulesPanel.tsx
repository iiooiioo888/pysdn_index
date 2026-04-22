import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLangQuery } from '../hooks/useLangQuery'
import { PATHS } from '../routes/paths'

export function ModulesPanel() {
  const { t } = useTranslation()
  const langSearch = useLangQuery()
  const [activeTab, setActiveTab] = useState<'forge' | 'script' | 'track' | 'tune'>('forge')

  const tabs = [
    { id: 'forge' as const, label: t('mp_tab_forge', 'SuperForge'), color: 'cyan' },
    { id: 'script' as const, label: t('mp_tab_script', 'SuperScript'), color: 'amber' },
    { id: 'track' as const, label: t('mp_tab_track', 'SuperTrack'), color: 'emerald' },
    { id: 'tune' as const, label: t('mp_tab_tune', 'SuperTune'), color: 'purple' },
  ]

  return (
    <section id="modules-panel" className="section modules-panel-section">
      <div className="container">
        <div className="section-heading">
          <div className="section-label reveal">{t('mp_label', 'MODULE DASHBOARD')}</div>
          <h2 className="section-title reveal">{t('mp_title', '模組面板')}</h2>
          <p className="section-desc reveal">
            {t('mp_desc', '每個模組都有自己的工作空間，點進去就能直接用。')}
          </p>
        </div>

        {/* Tabs */}
        <div className="mp-tabs reveal" role="tablist" aria-label="Module panels">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`mp-tab mp-tab--${tab.color} ${activeTab === tab.id ? 'active' : ''}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== SuperForge Panel ===== */}
        {activeTab === 'forge' && (
          <div className="mp-panel active reveal" role="tabpanel">
            <div className="mp-panel-mockup">
              <div className="mp-mockup-header">
                <div className="mockup-dots"><span /><span /><span /></div>
                <span>{t('mp_forge_mockup_title', 'SuperForge — 提示詞收藏夾')}</span>
              </div>
              <div className="mp-mockup-body">
                {/* Stats row */}
                <div className="mp-stats-row">
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--cyan">1,284</span>
                    <span className="mp-stat-label">{t('mp_forge_stat_prompts', '提示詞')}</span>
                  </div>
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--cyan">5,731</span>
                    <span className="mp-stat-label">{t('mp_forge_stat_gen', '生成結果')}</span>
                  </div>
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--cyan">342</span>
                    <span className="mp-stat-label">{t('mp_forge_stat_tags', 'AI 標籤')}</span>
                  </div>
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--green">97%</span>
                    <span className="mp-stat-label">{t('mp_forge_stat_success', '成功率')}</span>
                  </div>
                </div>

                {/* Flow diagram */}
                <div className="mp-flow">
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--cyan">✏️</div>
                    <span>{t('mp_forge_flow_1', '輸入提示詞')}</span>
                  </div>
                  <div className="mp-flow-arrow">→</div>
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--cyan">🤖</div>
                    <span>{t('mp_forge_flow_2', 'AI 生成')}</span>
                  </div>
                  <div className="mp-flow-arrow">→</div>
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--cyan">🏷️</div>
                    <span>{t('mp_forge_flow_3', '自動標籤')}</span>
                  </div>
                  <div className="mp-flow-arrow">→</div>
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--cyan">🔍</div>
                    <span>{t('mp_forge_flow_4', '智慧搜尋')}</span>
                  </div>
                </div>

                {/* Recent prompts list */}
                <div className="mp-recent-list">
                  <div className="mp-recent-head">
                    <span>{t('mp_forge_recent', '最近的提示詞')}</span>
                    <span className="mp-recent-count">1,284 {t('mp_total', '筆')}</span>
                  </div>
                  {[
                    { text: 'cyberpunk cityscape, neon lights, rain...', tag: '賽博龐克', time: '2 min' },
                    { text: 'watercolor portrait, soft lighting...', tag: '水彩', time: '15 min' },
                    { text: 'cinematic landscape, golden hour...', tag: '電影感', time: '1 hr' },
                  ].map((item, i) => (
                    <div className="mp-recent-item" key={i}>
                      <div className="mp-recent-text">{item.text}</div>
                      <div className="mp-recent-meta">
                        <span className="mp-recent-tag">{item.tag}</span>
                        <span className="mp-recent-time">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mp-panel-info">
              <h3>{t('mp_forge_title', '提示詞知識庫')}</h3>
              <p>{t('mp_forge_desc', '把你用過的每句提示詞、生成的每張圖每段影片，全部整理在一起。下次想找？用說的就能找到。')}</p>
              <ul className="mp-features">
                <li>✅ {t('mp_forge_f1', '提示詞與結果自動配對，再也不會忘記上次用什麼 prompt')}</li>
                <li>✅ {t('mp_forge_f2', '智慧搜尋，找風格類似的創作')}</li>
                <li>✅ {t('mp_forge_f3', '版本紀錄，每次變化都存好，隨時比較差異')}</li>
                <li>✅ {t('mp_forge_f4', 'AI 自動分類：風格、主題、光線標籤')}</li>
                <li>✅ {t('mp_forge_f5', '進度自動同步，外部工具完成通知自動回來')}</li>
              </ul>
              <Link to={{ pathname: PATHS.docs.superforge, search: langSearch }} className="mp-doc-link">
                {t('mp_view_docs', '查看完整文件')} →
              </Link>
            </div>
          </div>
        )}

        {/* ===== SuperScript Panel ===== */}
        {activeTab === 'script' && (
          <div className="mp-panel active reveal" role="tabpanel">
            <div className="mp-panel-mockup">
              <div className="mp-mockup-header">
                <div className="mockup-dots"><span /><span /><span /></div>
                <span>{t('mp_script_mockup_title', 'SuperScript — AI 劇本助手')}</span>
              </div>
              <div className="mp-mockup-body">
                {/* Stats row */}
                <div className="mp-stats-row">
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--amber">24</span>
                    <span className="mp-stat-label">{t('mp_script_stat_scripts', '劇本')}</span>
                  </div>
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--amber">186</span>
                    <span className="mp-stat-label">{t('mp_script_stat_scenes', '場景')}</span>
                  </div>
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--amber">742</span>
                    <span className="mp-stat-label">{t('mp_script_stat_beats', '節拍')}</span>
                  </div>
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--green">94%</span>
                    <span className="mp-stat-label">{t('mp_script_stat_consistency', '一致性')}</span>
                  </div>
                </div>

                {/* Agent pipeline */}
                <div className="mp-agents">
                  <div className="mp-agents-title">{t('mp_script_agents_title', 'AI 助手分工')}</div>
                  <div className="mp-agents-row">
                    {[
                      { emoji: '🏗️', name: t('mp_agent_architect', '構思'), pct: 100 },
                      { emoji: '🔍', name: t('mp_agent_continuity', '檢查'), pct: 100 },
                      { emoji: '✍️', name: t('mp_agent_writer', '對白'), pct: 78 },
                      { emoji: '📐', name: t('mp_agent_format', '格式'), pct: 100 },
                    ].map((agent, i) => (
                      <div className="mp-agent-card" key={i}>
                        <div className="mp-agent-emoji">{agent.emoji}</div>
                        <div className="mp-agent-name">{agent.name}</div>
                        <div className="mp-agent-bar">
                          <div className="mp-agent-bar-fill mp-bar--amber" style={{ width: `${agent.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Script tree */}
                <div className="mp-script-tree">
                  <div className="mp-tree-title">{t('mp_script_tree_title', '劇本結構')}</div>
                  <div className="mp-tree">
                    <div className="mp-tree-node mp-tree-root">📽️ {t('mp_tree_ep', '第一季 · 全 6 集')}</div>
                    <div className="mp-tree-branch">
                      <div className="mp-tree-node mp-tree-act">🎬 {t('mp_tree_act', '第一幕：起')}</div>
                      <div className="mp-tree-leaves">
                        <div className="mp-tree-leaf">📍 {t('mp_tree_scene1', '場景 1：咖啡廳初遇')}</div>
                        <div className="mp-tree-leaf">📍 {t('mp_tree_scene2', '場景 2：雨中追車')}</div>
                        <div className="mp-tree-leaf">📍 {t('mp_tree_scene3', '場景 3：屋頂對峙')}</div>
                      </div>
                    </div>
                    <div className="mp-tree-branch">
                      <div className="mp-tree-node mp-tree-act">🎬 {t('mp_tree_act2', '第二幕：承')}</div>
                      <div className="mp-tree-leaves">
                        <div className="mp-tree-leaf mp-tree-leaf--active">📍 {t('mp_tree_scene4', '場景 4：秘密基地')}</div>
                        <div className="mp-tree-leaf">📍 {t('mp_tree_scene5', '場景 5：⋯')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mp-panel-info">
              <h3>{t('mp_script_title', 'AI 劇本助手')}</h3>
              <p>{t('mp_script_desc', '從一句想法到完整劇本，多個 AI 助手一起幫你搞定。一幕一幕層次分明，修改不怕亂，角色不會走鐘。')}</p>
              <ul className="mp-features">
                <li>✅ {t('mp_script_f1', '清楚的故事結構：一幕一幕、一場一場')}</li>
                <li>✅ {t('mp_script_f2', '修改不怕亂：每次改動都有紀錄，隨時比較還原')}</li>
                <li>✅ {t('mp_script_f3', '多個 AI 一起寫：構思、對白、檢查一致性各有分工')}</li>
                <li>✅ {t('mp_script_f4', '角色不會走鐘：AI 確保每個角色說話方式前後一致')}</li>
                <li>✅ {t('mp_script_f5', '和其他模組串接：自動抓熱門趨勢、生成畫面提示詞')}</li>
              </ul>
              <Link to={{ pathname: PATHS.docs.superscript, search: langSearch }} className="mp-doc-link">
                {t('mp_view_docs', '查看完整文件')} →
              </Link>
            </div>
          </div>
        )}

        {/* ===== SuperTrack Panel ===== */}
        {activeTab === 'track' && (
          <div className="mp-panel active reveal" role="tabpanel">
            <div className="mp-panel-mockup">
              <div className="mp-mockup-header">
                <div className="mockup-dots"><span /><span /><span /></div>
                <span>{t('mp_track_mockup_title', 'SuperTrack — 全網追蹤助手')}</span>
              </div>
              <div className="mp-mockup-body">
                {/* Stats row */}
                <div className="mp-stats-row">
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--emerald">156</span>
                    <span className="mp-stat-label">{t('mp_track_stat_entities', '追蹤對象')}</span>
                  </div>
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--emerald">12.4K</span>
                    <span className="mp-stat-label">{t('mp_track_stat_content', '採集內容')}</span>
                  </div>
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--emerald">89</span>
                    <span className="mp-stat-label">{t('mp_track_stat_alerts', '預警通知')}</span>
                  </div>
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--green">4</span>
                    <span className="mp-stat-label">{t('mp_track_stat_platforms', '追蹤平台')}</span>
                  </div>
                </div>

                {/* Platform icons */}
                <div className="mp-platforms">
                  <div className="mp-platform-chip mp-chip--active">📸 {t('mp_plat_ig', 'Instagram')}</div>
                  <div className="mp-platform-chip mp-chip--active">📕 {t('mp_plat_xhs', '小紅書')}</div>
                  <div className="mp-platform-chip">🐦 {t('mp_plat_tw', 'Twitter')}</div>
                  <div className="mp-platform-chip">🎵 {t('mp_plat_tt', 'TikTok')}</div>
                </div>

                {/* Tracking flow */}
                <div className="mp-flow">
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--emerald">👤</div>
                    <span>{t('mp_track_flow_1', '追蹤人物')}</span>
                  </div>
                  <div className="mp-flow-arrow">→</div>
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--emerald">📊</div>
                    <span>{t('mp_track_flow_2', '採集數據')}</span>
                  </div>
                  <div className="mp-flow-arrow">→</div>
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--emerald">⚡</div>
                    <span>{t('mp_track_flow_3', '趨勢預警')}</span>
                  </div>
                  <div className="mp-flow-arrow">→</div>
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--emerald">💡</div>
                    <span>{t('mp_track_flow_4', '靈感素材')}</span>
                  </div>
                </div>

                {/* Entity list */}
                <div className="mp-recent-list">
                  <div className="mp-recent-head">
                    <span>{t('mp_track_entities_title', '追蹤中的對象')}</span>
                    <span className="mp-recent-count">156 {t('mp_total', '筆')}</span>
                  </div>
                  {[
                    { name: '@designer_kol', type: 'KOL', change: '+12%', alert: true },
                    { name: 'CyberBrand Official', type: t('mp_entity_brand', '品牌'), change: '+3%', alert: false },
                    { name: '@creative_studio', type: 'KOL', change: '+8%', alert: false },
                  ].map((item, i) => (
                    <div className="mp-recent-item" key={i}>
                      <div className="mp-recent-text">
                        {item.name}
                        {item.alert && <span className="mp-alert-badge">{t('mp_alert', '🔥 熱')}</span>}
                      </div>
                      <div className="mp-recent-meta">
                        <span className="mp-recent-tag">{item.type}</span>
                        <span className={`mp-recent-change ${item.alert ? 'mp-change--hot' : ''}`}>{item.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mp-panel-info">
              <h3>{t('mp_track_title', '全網追蹤助手')}</h3>
              <p>{t('mp_track_desc', '幫你追蹤網紅、品牌、熱門內容，自動整理成可用的創作素材。流量突然暴增？自動通知你。')}</p>
              <ul className="mp-features">
                <li>✅ {t('mp_track_f1', '人物識別：同一個人在不同平台自動對上')}</li>
                <li>✅ {t('mp_track_f2', '智慧採集：像真人一樣追蹤各平台更新')}</li>
                <li>✅ {t('mp_track_f3', '預警通知：流量暴增自動通知你')}</li>
                <li>✅ {t('mp_track_f4', '靈感庫串接：好內容自動存進提示詞素材庫')}</li>
                <li>✅ {t('mp_track_f5', '合規追蹤：只抓公開資料，遵守網站規範')}</li>
              </ul>
              <div className="mp-doc-link-stack">
                <Link to={{ pathname: PATHS.docs.supertrack, search: langSearch }} className="mp-doc-link">
                  {t('mp_view_docs', '查看完整文件')} →
                </Link>
                <Link to={{ pathname: PATHS.panel.supertrack, search: langSearch }} className="mp-doc-link mp-doc-link--panel">
                  {t('mp_open_supertrack_panel', '開啟全網追蹤助手（示範面板）')} →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ===== SuperTune Panel ===== */}
        {activeTab === 'tune' && (
          <div className="mp-panel active reveal" role="tabpanel">
            <div className="mp-panel-mockup">
              <div className="mp-mockup-header">
                <div className="mockup-dots"><span /><span /><span /></div>
                <span>{t('mp_tune_mockup_title', 'SuperTune — 優化引擎')}</span>
              </div>
              <div className="mp-mockup-body">
                {/* A/B Test */}
                <div className="mp-mock-section">
                  <div className="mp-mock-label">{t('mp_tune_ab_label', '🔬 A/B 平行宇宙測試')}</div>
                  <div className="mp-ab-grid">
                    <div className="mp-ab-col">
                      <div className="mp-ab-title">{t('mp_tune_ua', '宇宙 A (原始)')}</div>
                      <div className="mp-ab-row"><span>E</span><div className="mp-ab-bar"><div className="mp-ab-fill mp-ab-fill--a" style={{ width: '72%' }} /></div><span>72%</span></div>
                      <div className="mp-ab-row"><span>R</span><div className="mp-ab-bar"><div className="mp-ab-fill mp-ab-fill--a" style={{ width: '68%' }} /></div><span>68%</span></div>
                    </div>
                    <div className="mp-ab-col mp-ab-col--b">
                      <div className="mp-ab-title">{t('mp_tune_ub', '宇宙 B (變體) ✓')}</div>
                      <div className="mp-ab-row"><span>E</span><div className="mp-ab-bar"><div className="mp-ab-fill mp-ab-fill--b" style={{ width: '88%' }} /></div><span>88%</span></div>
                      <div className="mp-ab-row"><span>R</span><div className="mp-ab-bar"><div className="mp-ab-fill mp-ab-fill--b" style={{ width: '79%' }} /></div><span>79%</span></div>
                    </div>
                  </div>
                  <div className="mp-ab-stats">
                    <span>{t('mp_tune_eff', 'effect size')} <strong>0.38</strong></span>
                    <span>{t('mp_tune_conf', 'confidence')} <strong>99.7%</strong></span>
                    <span>{t('mp_tune_winner', 'winner')} <strong>B ↑16%</strong></span>
                  </div>
                </div>
                {/* Cost */}
                <div className="mp-mock-section">
                  <div className="mp-mock-label">{t('mp_tune_cost_label', '💸 成本優化')}</div>
                  <div className="mp-cost-ticker">
                    <span className="mp-cost-saved">$1.24</span>
                    <span className="mp-cost-sub">↓ 18% {t('mp_tune_vs', 'vs baseline')}</span>
                  </div>
                  <div className="mp-cost-strategies">
                    <div className="mp-cost-strategy active"><span>✅</span><span>{t('mp_tune_s1', 'Prompt 壓縮')}</span><span className="mp-cost-val">-$0.38</span></div>
                    <div className="mp-cost-strategy active"><span>✅</span><span>{t('mp_tune_s2', 'Context Window 管理')}</span><span className="mp-cost-val">-$0.22</span></div>
                    <div className="mp-cost-strategy active"><span>✅</span><span>{t('mp_tune_s3', 'Batch 合併請求')}</span><span className="mp-cost-val">-$0.15</span></div>
                    <div className="mp-cost-strategy"><span>○</span><span>{t('mp_tune_s4', 'Model Tier 降級')}</span><span className="mp-cost-val dim">-$0.09</span></div>
                  </div>
                </div>
                {/* Pacing / Tension / Freshness */}
                <div className="mp-mock-section mp-mock-section--grid3">
                  <div>
                    <div className="mp-mock-label">{t('mp_tune_pacing', '⏱️ 節奏 0.87')}</div>
                    <div className="mp-mini-metrics">
                      <div className="mp-mini-row"><span>Scene</span><div className="mp-mini-bar"><div style={{ width: '82%' }} /></div><span>0.82</span></div>
                      <div className="mp-mini-row"><span>Dialogue</span><div className="mp-mini-bar"><div style={{ width: '75%' }} /></div><span>0.75</span></div>
                      <div className="mp-mini-row"><span>Action</span><div className="mp-mini-bar"><div style={{ width: '91%' }} /></div><span>0.91</span></div>
                    </div>
                  </div>
                  <div>
                    <div className="mp-mock-label">{t('mp_tune_tension', '🔥 張力 0.83')}</div>
                    <div className="mp-mini-metrics">
                      <div className="mp-mini-row"><span>Act1</span><div className="mp-mini-bar"><div style={{ width: '35%' }} /></div><span>0.35</span></div>
                      <div className="mp-mini-row"><span>Act2</span><div className="mp-mini-bar"><div style={{ width: '72%' }} /></div><span>0.72</span></div>
                      <div className="mp-mini-row"><span>Act3</span><div className="mp-mini-bar"><div style={{ width: '95%' }} /></div><span>0.95</span></div>
                    </div>
                  </div>
                  <div>
                    <div className="mp-mock-label">{t('mp_tune_fresh', '✨ 新鮮度 0.76')}</div>
                    <div className="mp-mini-metrics">
                      <div className="mp-mini-row mp-mini-row--warn"><span>⚠</span><span>Chosen One (S02)</span></div>
                      <div className="mp-mini-row mp-mini-row--warn"><span>⚠</span><span>Love Triangle (S05)</span></div>
                      <div className="mp-mini-row"><span>✓</span><span>Montage (S03)</span></div>
                    </div>
                  </div>
                </div>
                {/* Style Transfer */}
                <div className="mp-mock-section">
                  <div className="mp-mock-label">{t('mp_tune_style', '🎨 風格遷移')}</div>
                  <div className="mp-style-tags">
                    <span className="mp-style-tag active">{t('mp_tune_st1', '諾蘭敘事')}</span>
                    <span className="mp-style-tag">{t('mp_tune_st2', '是枝裕和')}</span>
                    <span className="mp-style-tag">{t('mp_tune_st3', '王家衛')}</span>
                    <span className="mp-style-tag">{t('mp_tune_st4', '昆汀')}</span>
                    <span className="mp-style-tag">{t('mp_tune_st5', '新海誠')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mp-panel-info">
              <h3>{t('mp_tune_title', '智能優化引擎')}</h3>
              <p>{t('mp_tune_desc', '幫你把內容做到最好，省錢、省 token、還能測試哪個版本更強。')}</p>
              <ul className="mp-features">
                <li>✅ {t('mp_tune_f1', 'A/B 平行測試：同一段內容跑兩個版本，用數據告訴你哪個更強')}</li>
                <li>✅ {t('mp_tune_f2', '成本優化：自動壓縮 prompt、管理上下文視窗、合併請求')}</li>
                <li>✅ {t('mp_tune_f3', '節奏分析：檢查每一幕的長度、對白密度、動作節奏')}</li>
                <li>✅ {t('mp_tune_f4', '張力曲線：對照好萊塢標準曲線')}</li>
                <li>✅ {t('mp_tune_f5', '風格遷移：套用諾蘭、是枝裕和、王家衛等導演風格')}</li>
              </ul>
              <Link to={{ pathname: PATHS.docs.supertune, search: langSearch }} className="mp-doc-link">
                {t('mp_view_docs', '查看完整文件')} →
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
