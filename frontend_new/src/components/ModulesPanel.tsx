import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLangQuery } from '../hooks/useLangQuery'
import { PATHS } from '../routes/paths'
import { prefetchDocRoute, prefetchSuperTrackPanel } from '../routes/routePrefetch'
import { ModuleMiniCards } from './ModuleMiniCards'

export function ModulesPanel() {
  const { t } = useTranslation()
  const langSearch = useLangQuery()
  const [activeTab, setActiveTab] = useState<'forge' | 'script' | 'track' | 'tune' | 'nova' | 'sight' | 'stocksx' | 'stockquant'>('forge')

  const tabs = [
    { id: 'forge' as const, label: t('mp_tab_forge', 'SuperForge'), color: 'cyan' },
    { id: 'script' as const, label: t('mp_tab_script', 'SuperScript'), color: 'amber' },
    { id: 'track' as const, label: t('mp_tab_track', 'SuperTrack'), color: 'emerald' },
    { id: 'tune' as const, label: t('mp_tab_tune', 'SuperTune'), color: 'purple' },
    { id: 'nova' as const, label: t('mp_tab_nova', 'SuperNova'), color: 'blue' },
    { id: 'sight' as const, label: t('mp_tab_sight', 'SuperSight'), color: 'green' },
    { id: 'stocksx' as const, label: t('mp_tab_stocksx', 'StocksX'), color: 'yellow' },
    { id: 'stockquant' as const, label: t('mp_tab_stockquant', 'Stock Quant'), color: 'rose' },
  ]

  return (
    <section id="modules-panel" className="section modules-panel-section">
      <div className="container">
        <div className="mp-surface reveal">
          <header className="mp-surface-head">
            <div className="section-heading mp-heading">
              <div className="section-label">{t('mp_label', 'MODULE DASHBOARD')}</div>
              <h2 className="section-title">{t('mp_title', '模組面板')}</h2>
              <p className="section-desc">{t('mp_desc', '每個模組都有自己的工作空間，點進去就能直接用。')}</p>
            </div>
          </header>

          <div className="mp-tablist-shell" role="presentation">
            <div className="mp-tabs" role="tablist" aria-label="Module panels">
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
          </div>

          <div className="mp-mini-cards">
            <ModuleMiniCards variant="modules-panel" />
          </div>

          {/* ===== SuperForge Panel ===== */}
        {activeTab === 'forge' && (
          <div className="mp-panel mp-panel--forge active" role="tabpanel">
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
              <a href="https://github.com/iiooiioo888/SuperForge" target="_blank" rel="noopener noreferrer" className="mp-doc-link" style={{marginTop:8,display:'inline-flex',alignItems:'center',gap:6}}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                GitHub →
              </a>
            </div>
          </div>
        )}

        {/* ===== SuperScript Panel ===== */}
        {activeTab === 'script' && (
          <div className="mp-panel mp-panel--script active" role="tabpanel">
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
              <a href="https://github.com/iiooiioo888/SuperScript" target="_blank" rel="noopener noreferrer" className="mp-doc-link" style={{marginTop:8,display:'inline-flex',alignItems:'center',gap:6}}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                GitHub →
              </a>
            </div>
          </div>
        )}

        {/* ===== SuperTrack Panel ===== */}
        {activeTab === 'track' && (
          <div className="mp-panel mp-panel--track active" role="tabpanel">
            <div className="mp-panel-mockup">
              <div className="mp-mockup-header">
                <div className="mockup-dots"><span /><span /><span /></div>
                <span>{t('mp_track_mockup_title', 'SuperTrack（全網追蹤助手）')}</span>
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
              <h3>{t('mp_track_title', 'SuperTrack（全網追蹤助手）')}</h3>
              <p>{t('mp_track_desc', '幫你追蹤網紅、品牌、熱門內容，自動整理成可用的創作素材。流量突然暴增？自動通知你。')}</p>
              <ul className="mp-features">
                <li>✅ {t('mp_track_f1', '人物識別：同一個人在不同平台自動對上')}</li>
                <li>✅ {t('mp_track_f2', '智慧採集：像真人一樣追蹤各平台更新')}</li>
                <li>✅ {t('mp_track_f3', '預警通知：流量暴增自動通知你')}</li>
                <li>✅ {t('mp_track_f4', '靈感庫串接：好內容自動存進提示詞素材庫')}</li>
                <li>✅ {t('mp_track_f5', '合規追蹤：只抓公開資料，遵守網站規範')}</li>
              </ul>
              <div className="mp-doc-link-stack">
                <Link
                  to={{ pathname: PATHS.docs.supertrack, search: langSearch }}
                  className="mp-doc-link"
                  onMouseEnter={() => prefetchDocRoute('supertrack')}
                >
                  {t('mp_view_docs', '查看完整文件')} →
                </Link>
                <Link
                  to={{ pathname: PATHS.panel.supertrack, search: langSearch }}
                  className="mp-doc-link mp-doc-link--panel"
                  onMouseEnter={prefetchSuperTrackPanel}
                >
                  {t('mp_open_supertrack_panel', '開啟 SuperTrack 示範面板')} →
                </Link>
                <a href="https://github.com/iiooiioo888/SuperTrack" target="_blank" rel="noopener noreferrer" className="mp-doc-link" style={{display:'inline-flex',alignItems:'center',gap:6}}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                  GitHub →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ===== SuperTune Panel ===== */}
        {activeTab === 'tune' && (
          <div className="mp-panel mp-panel--tune active" role="tabpanel">
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
              <a href="https://github.com/iiooiioo888/SuperTune" target="_blank" rel="noopener noreferrer" className="mp-doc-link" style={{marginTop:8,display:'inline-flex',alignItems:'center',gap:6}}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                GitHub →
              </a>
            </div>
          </div>
        )}

        {/* ===== SuperNova Panel ===== */}
        {activeTab === 'nova' && (
          <div className="mp-panel mp-panel--forge active" role="tabpanel">
            <div className="mp-panel-mockup">
              <div className="mp-mockup-header">
                <div className="mockup-dots"><span /><span /><span /></div>
                <span>{t('mp_nova_mockup_title', 'SuperNova — Social Data Collection')}</span>
              </div>
              <div className="mp-mockup-body">
                <div className="mp-stats-row">
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--cyan">5</span>
                    <span className="mp-stat-label">{t('mp_nova_stat_platforms', 'Platforms')}</span>
                  </div>
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--cyan">2,847</span>
                    <span className="mp-stat-label">{t('mp_nova_stat_tasks', 'Tasks')}</span>
                  </div>
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--cyan">1.2M</span>
                    <span className="mp-stat-label">{t('mp_nova_stat_records', 'Records')}</span>
                  </div>
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--green">99.7%</span>
                    <span className="mp-stat-label">{t('mp_nova_stat_uptime', 'Uptime')}</span>
                  </div>
                </div>
                <div className="mp-flow">
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--cyan">📡</div>
                    <span>{t('mp_nova_flow_1', 'Select Platform')}</span>
                  </div>
                  <div className="mp-flow-arrow">→</div>
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--cyan">⚙️</div>
                    <span>{t('mp_nova_flow_2', 'Configure Crawl')}</span>
                  </div>
                  <div className="mp-flow-arrow">→</div>
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--cyan">📊</div>
                    <span>{t('mp_nova_flow_3', 'Collect Data')}</span>
                  </div>
                  <div className="mp-flow-arrow">→</div>
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--cyan">💾</div>
                    <span>{t('mp_nova_flow_4', 'Store & Analyze')}</span>
                  </div>
                </div>
                <div className="mp-recent-list">
                  <div className="mp-recent-head">
                    <span>{t('mp_nova_stat_platforms', 'Platforms')}</span>
                  </div>
                  {[
                    { name: 'Bilibili', status: 'Active', type: 'Video' },
                    { name: 'Douyin', status: 'Active', type: 'Short Video' },
                    { name: 'Weibo', status: 'Active', type: 'Social' },
                    { name: 'Instagram', status: 'Active', type: 'Photo' },
                    { name: 'Telegram', status: 'Active', type: 'Messaging' },
                  ].map((item, i) => (
                    <div className="mp-recent-item" key={i}>
                      <div className="mp-recent-text">{item.name}</div>
                      <div className="mp-recent-meta">
                        <span className="mp-recent-tag">{item.type}</span>
                        <span className="mp-recent-change mp-change--hot">{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mp-panel-info">
              <h3>{t('mp_nova_title', 'Multi-Platform Social Data Collection')}</h3>
              <p>{t('mp_nova_desc', 'Enterprise-grade multi-platform social data collection system.')}</p>
              <ul className="mp-features">
                <li>✅ {t('mp_nova_f1', 'Plugin-based adapters for 5+ platforms')}</li>
                <li>✅ {t('mp_nova_f2', 'Three-layer storage: MongoDB + PostgreSQL + Elasticsearch')}</li>
                <li>✅ {t('mp_nova_f3', 'Enterprise fault tolerance: circuit breakers, retry, account pool')}</li>
                <li>✅ {t('mp_nova_f4', 'Dynamic feature flags: 4-layer control with hot reload')}</li>
                <li>✅ {t('mp_nova_f5', 'Async high concurrency: asyncio + uvloop + Celery')}</li>
              </ul>
              <Link to={{ pathname: PATHS.docs.supernova, search: langSearch }} className="mp-doc-link">
                {t('mp_view_docs', '查看完整文件')} →
              </Link>
              <a href="https://github.com/iiooiioo888/SuperNova" target="_blank" rel="noopener noreferrer" className="mp-doc-link" style={{marginTop:8,display:'inline-flex',alignItems:'center',gap:6}}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                GitHub →
              </a>
            </div>
          </div>
        )}

        {/* ===== SuperSight Panel ===== */}
        {activeTab === 'sight' && (
          <div className="mp-panel mp-panel--track active" role="tabpanel">
            <div className="mp-panel-mockup">
              <div className="mp-mockup-header">
                <div className="mockup-dots"><span /><span /><span /></div>
                <span>{t('mp_sight_mockup_title', 'SuperSight — AI Photo Memory')}</span>
              </div>
              <div className="mp-mockup-body">
                <div className="mp-stats-row">
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--emerald">12,450</span>
                    <span className="mp-stat-label">{t('mp_sight_stat_photos', 'Photos')}</span>
                  </div>
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--emerald">3,892</span>
                    <span className="mp-stat-label">{t('mp_sight_stat_faces', 'Faces')}</span>
                  </div>
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--emerald">8,721</span>
                    <span className="mp-stat-label">{t('mp_sight_stat_memories', 'Memories')}</span>
                  </div>
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--green">96.5%</span>
                    <span className="mp-stat-label">{t('mp_sight_stat_accuracy', 'Accuracy')}</span>
                  </div>
                </div>
                <div className="mp-flow">
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--emerald">📷</div>
                    <span>{t('mp_sight_flow_1', 'Upload Photo')}</span>
                  </div>
                  <div className="mp-flow-arrow">→</div>
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--emerald">🧠</div>
                    <span>{t('mp_sight_flow_2', 'AI Analysis')}</span>
                  </div>
                  <div className="mp-flow-arrow">→</div>
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--emerald">💾</div>
                    <span>{t('mp_sight_flow_3', 'Memory Store')}</span>
                  </div>
                  <div className="mp-flow-arrow">→</div>
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--emerald">🔍</div>
                    <span>{t('mp_sight_flow_4', 'Smart Recall')}</span>
                  </div>
                </div>
                <div className="mp-recent-list">
                  <div className="mp-recent-head">
                    <span>{t('mp_sight_stat_memories', 'Memories')}</span>
                  </div>
                  {[
                    { text: 'Qwen3-VL FP4 · 4.5GB VRAM', tag: 'Vision', time: 'V3.0' },
                    { text: 'bge-m4 1024-dim · 96.5% recall', tag: 'Embedding', time: 'Active' },
                    { text: 'ChromaDB 1.2.x · Hybrid Search', tag: 'Vector DB', time: 'Ready' },
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
              <h3>{t('mp_sight_title', 'AI Photo Memory System')}</h3>
              <p>{t('mp_sight_desc', 'Advanced AI-powered photo analysis with face recognition, scene understanding, and knowledge graph.')}</p>
              <ul className="mp-features">
                <li>✅ {t('mp_sight_f1', 'Qwen3-VL FP4: native hardware acceleration, VRAM 4.5GB')}</li>
                <li>✅ {t('mp_sight_f2', 'bge-m4 1024-dim: multimodal, 96.5% Chinese recall')}</li>
                <li>✅ {t('mp_sight_f3', 'ChromaDB hybrid: vector + BM25 combined search')}</li>
                <li>✅ {t('mp_sight_f4', 'InsightFace buffalo_m: 2026 updated, smaller & faster')}</li>
                <li>✅ {t('mp_sight_f5', 'LangGraph 0.5.x: native async parallel branches')}</li>
              </ul>
              <Link to={{ pathname: PATHS.docs.supersight, search: langSearch }} className="mp-doc-link">
                {t('mp_view_docs', '查看完整文件')} →
              </Link>
              <a href="https://github.com/iiooiioo888/SuperSight" target="_blank" rel="noopener noreferrer" className="mp-doc-link" style={{marginTop:8,display:'inline-flex',alignItems:'center',gap:6}}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                GitHub →
              </a>
            </div>
          </div>
        )}

        {/* ===== StocksX Panel ===== */}
        {activeTab === 'stocksx' && (
          <div className="mp-panel mp-panel--tune active" role="tabpanel">
            <div className="mp-panel-mockup">
              <div className="mp-mockup-header">
                <div className="mockup-dots"><span /><span /><span /></div>
                <span>{t('mp_stocksx_mockup_title', 'StocksX — Quant Trading')}</span>
              </div>
              <div className="mp-mockup-body">
                <div className="mp-stats-row">
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--amber">130+</span>
                    <span className="mp-stat-label">{t('mp_stocksx_stat_strategies', 'Strategies')}</span>
                  </div>
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--amber">4</span>
                    <span className="mp-stat-label">{t('mp_stocksx_stat_markets', 'Markets')}</span>
                  </div>
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--amber">50K+</span>
                    <span className="mp-stat-label">{t('mp_stocksx_stat_backtests', 'Backtests')}</span>
                  </div>
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--green">+23%</span>
                    <span className="mp-stat-label">{t('mp_stocksx_stat_return', 'Avg Return')}</span>
                  </div>
                </div>
                <div className="mp-flow">
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--amber">📈</div>
                    <span>{t('mp_stocksx_flow_1', 'Select Strategy')}</span>
                  </div>
                  <div className="mp-flow-arrow">→</div>
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--amber">⚙️</div>
                    <span>{t('mp_stocksx_flow_2', 'Configure Params')}</span>
                  </div>
                  <div className="mp-flow-arrow">→</div>
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--amber">🔄</div>
                    <span>{t('mp_stocksx_flow_3', 'Run Backtest')}</span>
                  </div>
                  <div className="mp-flow-arrow">→</div>
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--amber">📊</div>
                    <span>{t('mp_stocksx_flow_4', 'Analyze Results')}</span>
                  </div>
                </div>
                <div className="mp-recent-list">
                  <div className="mp-recent-head">
                    <span>{t('mp_stocksx_stat_strategies', 'Strategies')}</span>
                  </div>
                  {[
                    { text: 'MACD · RSI · Bollinger Bands', tag: 'Trend', time: '18 strats' },
                    { text: 'LSTM · Transformer · FinBERT', tag: 'AI/ML', time: '16 strats' },
                    { text: 'Markowitz · Black-Litterman · HRP', tag: 'Portfolio', time: '12 methods' },
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
              <h3>{t('mp_stocksx_title', 'Institutional-Grade Quant Trading')}</h3>
              <p>{t('mp_stocksx_desc', '130+ quantitative strategies across 10 categories. Multi-market backtesting, portfolio optimization, AI-driven analysis.')}</p>
              <ul className="mp-features">
                <li>✅ {t('mp_stocksx_f1', '130+ strategies across 10 categories')}</li>
                <li>✅ {t('mp_stocksx_f2', 'NumPy vectorized: 10-100x backtest speedup')}</li>
                <li>✅ {t('mp_stocksx_f3', 'Portfolio optimization: Markowitz, Black-Litterman, HRP')}</li>
                <li>✅ {t('mp_stocksx_f4', 'Multi-market: Crypto (CCXT), US/TW stocks, ETF')}</li>
                <li>✅ {t('mp_stocksx_f5', 'AI enhancement: LSTM, Transformer, FinBERT, DQN')}</li>
              </ul>
              <Link to={{ pathname: PATHS.docs.stocksx, search: langSearch }} className="mp-doc-link">
                {t('mp_view_docs', '查看完整文件')} →
              </Link>
              <a href="https://github.com/iiooiioo888/StocksX_V0" target="_blank" rel="noopener noreferrer" className="mp-doc-link" style={{marginTop:8,display:'inline-flex',alignItems:'center',gap:6}}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                GitHub →
              </a>
            </div>
          </div>
        )}

        {/* ===== Stock Quant Panel ===== */}
        {activeTab === 'stockquant' && (
          <div className="mp-panel mp-panel--forge active" role="tabpanel">
            <div className="mp-panel-mockup">
              <div className="mp-mockup-header">
                <div className="mockup-dots"><span /><span /><span /></div>
                <span>{t('mp_stockquant_mockup_title', 'Stock Quant — A-Share Backtesting')}</span>
              </div>
              <div className="mp-mockup-body">
                <div className="mp-stats-row">
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--cyan">30+</span>
                    <span className="mp-stat-label">{t('mp_stockquant_stat_strategies', 'Strategies')}</span>
                  </div>
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--cyan">5,000+</span>
                    <span className="mp-stat-label">{t('mp_stockquant_stat_stocks', 'Stocks')}</span>
                  </div>
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--cyan">1,247</span>
                    <span className="mp-stat-label">{t('mp_stockquant_stat_tasks', 'Tasks')}</span>
                  </div>
                  <div className="mp-stat-card">
                    <span className="mp-stat-num mp-num--green">65%</span>
                    <span className="mp-stat-label">{t('mp_stockquant_stat_cache', 'Cache Hit')}</span>
                  </div>
                </div>
                <div className="mp-flow">
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--cyan">📥</div>
                    <span>{t('mp_stockquant_flow_1', 'Download Data')}</span>
                  </div>
                  <div className="mp-flow-arrow">→</div>
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--cyan">📈</div>
                    <span>{t('mp_stockquant_flow_2', 'Select Strategy')}</span>
                  </div>
                  <div className="mp-flow-arrow">→</div>
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--cyan">🔄</div>
                    <span>{t('mp_stockquant_flow_3', 'Run Backtest')}</span>
                  </div>
                  <div className="mp-flow-arrow">→</div>
                  <div className="mp-flow-step">
                    <div className="mp-flow-icon mp-flow-icon--cyan">📊</div>
                    <span>{t('mp_stockquant_flow_4', 'View Results')}</span>
                  </div>
                </div>
                <div className="mp-recent-list">
                  <div className="mp-recent-head">
                    <span>{t('mp_stockquant_stat_strategies', 'Strategies')}</span>
                  </div>
                  {[
                    { text: 'Dual MA · MACD · RSI', tag: 'Classic', time: '10 strats' },
                    { text: 'Bollinger · Keltner · ATR', tag: 'Volatility', time: '8 strats' },
                    { text: 'Walk-Forward · Optuna · Grid', tag: 'Optimize', time: '5 methods' },
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
              <h3>{t('mp_stockquant_title', 'A-Share Quant Backtesting')}</h3>
              <p>{t('mp_stockquant_desc', 'Production-grade quant system with Yahoo Finance as primary data source. 30+ strategies, smart caching.')}</p>
              <ul className="mp-features">
                <li>✅ {t('mp_stockquant_f1', 'Pro workstation: ECharts + lazy-loading, unified dashboard')}</li>
                <li>✅ {t('mp_stockquant_f2', '30+ strategies with modular registration')}</li>
                <li>✅ {t('mp_stockquant_f3', 'Async task queue: submit & poll workflow')}</li>
                <li>✅ {t('mp_stockquant_f4', 'Smart cache: same params = instant return')}</li>
                <li>✅ {t('mp_stockquant_f5', 'Frontend: smart prefetch, batch, virtual scroll, Web Workers')}</li>
              </ul>
              <Link to={{ pathname: PATHS.docs.stockquant, search: langSearch }} className="mp-doc-link">
                {t('mp_view_docs', '查看完整文件')} →
              </Link>
              <a href="https://github.com/iiooiioo888/stock-quant" target="_blank" rel="noopener noreferrer" className="mp-doc-link" style={{marginTop:8,display:'inline-flex',alignItems:'center',gap:6}}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                GitHub →
              </a>
            </div>
          </div>
        )}
        </div>
      </div>
    </section>
  )
}
