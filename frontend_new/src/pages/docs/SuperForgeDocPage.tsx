import { useTranslation } from 'react-i18next'
import { DocLayout } from '../../components/docs/DocLayout'
import { DocNavbar } from '../../components/docs/DocNavbar'
import { DocFooter } from '../../components/docs/DocFooter'
import { DocReadingSummary } from '../../components/docs/DocReadingSummary'
import { useDocBundle } from '../../hooks/useDocBundle'

export function SuperForgeDocPage() {
  const { t: tUi } = useTranslation()
  const { t, ready, loadError, lang } = useDocBundle('superforge')

  if (!ready) {
    return (
      <DocLayout variant="forge">
        <main className="doc-main">
          <div className="doc-main-inner" style={{ paddingTop: 100 }}>
            <p className="doc-hero-lead" style={{ opacity: loadError ? 1 : 0.5 }}>
              {loadError ? tUi('doc_page_load_error') : tUi('doc_page_loading')}
            </p>
          </div>
        </main>
      </DocLayout>
    )
  }

  return (
    <DocLayout variant="forge">
      <DocNavbar t={t} lang={lang} />
      <main className="doc-main">
        <div className="doc-main-inner">
          <section className="doc-hero" aria-labelledby="doc-hero-title">
            <div className="doc-hero-card">
              <div className="doc-hero-fx" aria-hidden="true">
                <span className="doc-hero-grid" />
                <span className="doc-hero-orb doc-hero-orb--1" />
                <span className="doc-hero-orb doc-hero-orb--2" />
              </div>
              <div className="doc-hero-body">
                <span className="doc-hero-badge">KNOWLEDGE BASE</span>
                <h1 id="doc-hero-title">SuperForge</h1>
                <p className="doc-hero-sub">{t('hero_sub')}</p>
                <p className="doc-hero-lead">{t('intro_p')}</p>
              </div>
            </div>
          </section>

          <article className="doc">
            <DocReadingSummary t={t} variant="superforge" />
            <h2>{t('h_feat')}</h2>
            <div dangerouslySetInnerHTML={{ __html: t('doc_sf_body_html') }} />

            <h2>{t('h_flow')}</h2>
            <pre>{t('flow_pre')}</pre>

            <h2>{t('doc_sf_sim_h2')}</h2>
            <p>{t('doc_sf_sim_p')}</p>

            <div className="sim-panel">
              <div className="sim-header">
                <div className="sim-header-left">
                  <span className="sim-icon">🗂️</span>
                  <span className="sim-title">SuperForge</span>
                  <span className="sim-badge sim-badge--cyan">KNOWLEDGE BASE</span>
                  <span className="sim-live">
                    <span className="sim-dot"></span> LIVE
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

              <p
                style={{
                  fontSize: '0.75rem',
                  color: 'rgba(148,163,184,0.6)',
                  margin: '8px 0 4px',
                }}
              >
                {t('doc_sf_sim_kpi_note')}
              </p>
              <div className="sim-kpis">
                <div className="sim-kpi">
                  <div className="sim-kpi-label">prompts</div>
                  <div className="sim-kpi-val">2,847</div>
                  <div className="sim-kpi-delta sim-kpi-delta--up">+12 today</div>
                </div>
                <div className="sim-kpi">
                  <div className="sim-kpi-label">generations</div>
                  <div className="sim-kpi-val">12,503</div>
                  <div className="sim-kpi-delta sim-kpi-delta--up">+84 today</div>
                </div>
                <div className="sim-kpi">
                  <div className="sim-kpi-label">hit rate</div>
                  <div className="sim-kpi-val sim-kpi-val--highlight">94.2%</div>
                  <div className="sim-bar">
                    <div
                      className="sim-bar-fill sim-bar-fill--cyan"
                      style={{ width: '94%' }}
                    ></div>
                  </div>
                </div>
                <div className="sim-kpi">
                  <div className="sim-kpi-label">queue</div>
                  <div className="sim-kpi-val">17</div>
                  <div className="sim-bar">
                    <div
                      className="sim-bar-fill sim-bar-fill--cyan"
                      style={{ width: '34%' }}
                    ></div>
                  </div>
                </div>
                <div className="sim-kpi">
                  <div className="sim-kpi-label">avg_latency</div>
                  <div className="sim-kpi-val">11ms</div>
                </div>
                <div className="sim-kpi">
                  <div className="sim-kpi-label">storage</div>
                  <div className="sim-ring">
                    <svg viewBox="0 0 40 40">
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="3"
                      />
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="3"
                        strokeDasharray="100.53"
                        strokeDashoffset="30"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="sim-ring-label">70%</span>
                  </div>
                  <div className="sim-kpi-sub">7.2G / 10.2G</div>
                </div>
              </div>

              <p
                style={{
                  fontSize: '0.75rem',
                  color: 'rgba(148,163,184,0.6)',
                  margin: '12px 0 4px',
                }}
              >
                {t('doc_sf_sim_health_grid_note')}
              </p>
              <div className="sim-grid-2">
                <div className="sim-card">
                  <div className="sim-card-head">{t('doc_sf_sim_health_title')}</div>
                  <div className="sim-health-grid">
                    <div className="sim-health-item">
                      <div className="sim-ring sim-ring--sm">
                        <svg viewBox="0 0 60 60">
                          <circle
                            cx="30"
                            cy="30"
                            r="24"
                            fill="none"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="4"
                          />
                          <circle
                            cx="30"
                            cy="30"
                            r="24"
                            fill="none"
                            stroke="#06b6d4"
                            strokeWidth="4"
                            strokeDasharray="150.8"
                            strokeDashoffset="21"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="sim-ring-label">86%</span>
                      </div>
                      <div className="sim-health-label">{t('doc_sf_sim_h_struct')}</div>
                    </div>
                    <div className="sim-health-item">
                      <div className="sim-ring sim-ring--sm">
                        <svg viewBox="0 0 60 60">
                          <circle
                            cx="30"
                            cy="30"
                            r="24"
                            fill="none"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="4"
                          />
                          <circle
                            cx="30"
                            cy="30"
                            r="24"
                            fill="none"
                            stroke="#06b6d4"
                            strokeWidth="4"
                            strokeDasharray="150.8"
                            strokeDashoffset="33"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="sim-ring-label">78%</span>
                      </div>
                      <div className="sim-health-label">{t('doc_sf_sim_h_search')}</div>
                    </div>
                    <div className="sim-health-item">
                      <div className="sim-ring sim-ring--sm">
                        <svg viewBox="0 0 60 60">
                          <circle
                            cx="30"
                            cy="30"
                            r="24"
                            fill="none"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="4"
                          />
                          <circle
                            cx="30"
                            cy="30"
                            r="24"
                            fill="none"
                            stroke="#06b6d4"
                            strokeWidth="4"
                            strokeDasharray="150.8"
                            strokeDashoffset="15"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="sim-ring-label">90%</span>
                      </div>
                      <div className="sim-health-label">{t('doc_sf_sim_h_tag')}</div>
                    </div>
                    <div className="sim-health-item">
                      <div className="sim-ring sim-ring--sm">
                        <svg viewBox="0 0 60 60">
                          <circle
                            cx="30"
                            cy="30"
                            r="24"
                            fill="none"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="4"
                          />
                          <circle
                            cx="30"
                            cy="30"
                            r="24"
                            fill="none"
                            stroke="#06b6d4"
                            strokeWidth="4"
                            strokeDasharray="150.8"
                            strokeDashoffset="27"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="sim-ring-label">82%</span>
                      </div>
                      <div className="sim-health-label">{t('doc_sf_sim_h_sync')}</div>
                    </div>
                    <div className="sim-health-item">
                      <div className="sim-ring sim-ring--sm">
                        <svg viewBox="0 0 60 60">
                          <circle
                            cx="30"
                            cy="30"
                            r="24"
                            fill="none"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="4"
                          />
                          <circle
                            cx="30"
                            cy="30"
                            r="24"
                            fill="none"
                            stroke="#06b6d4"
                            strokeWidth="4"
                            strokeDasharray="150.8"
                            strokeDashoffset="39"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="sim-ring-label">74%</span>
                      </div>
                      <div className="sim-health-label">{t('doc_sf_sim_h_ver')}</div>
                    </div>
                    <div className="sim-health-item">
                      <div className="sim-ring sim-ring--sm">
                        <svg viewBox="0 0 60 60">
                          <circle
                            cx="30"
                            cy="30"
                            r="24"
                            fill="none"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="4"
                          />
                          <circle
                            cx="30"
                            cy="30"
                            r="24"
                            fill="none"
                            stroke="#06b6d4"
                            strokeWidth="4"
                            strokeDasharray="150.8"
                            strokeDashoffset="30"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="sim-ring-label">80%</span>
                      </div>
                      <div className="sim-health-label">{t('doc_sf_sim_h_model')}</div>
                    </div>
                  </div>
                </div>

                <div className="sim-card">
                  <div className="sim-card-head">{t('doc_sf_sim_stats_title')}</div>
                  <div className="sim-stats">
                    <div className="sim-stat-row">
                      <span className="sim-stat-label">{t('doc_sf_sim_stat_model')}</span>
                      <span className="sim-stat-val">Midjourney v6</span>
                    </div>
                    <div className="sim-stat-row">
                      <span className="sim-stat-label">{t('doc_sf_sim_stat_week')}</span>
                      <span className="sim-stat-val">{t('doc_sf_sim_week_val')}</span>
                    </div>
                    <div className="sim-stat-row">
                      <span className="sim-stat-label">{t('doc_sf_sim_stat_tags')}</span>
                      <span className="sim-stat-val">
                        <span className="doc-tag">cinematic</span>{' '}
                        <span className="doc-tag">neon</span>
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
                  </div>
                </div>
              </div>

              <p
                style={{
                  fontSize: '0.75rem',
                  color: 'rgba(148,163,184,0.6)',
                  margin: '12px 0 4px',
                }}
              >
                {t('doc_sf_sim_list_note')}
              </p>
              <div className="sim-card" style={{ marginTop: 12 }}>
                <div className="sim-card-head">{t('doc_sf_sim_recent_title')}</div>
                <div className="sim-entity-list">
                  <div className="sim-entity">
                    <span className="sim-entity-icon">✏️</span>
                    <span className="sim-entity-name">
                      cinematic drone shot of mountains at golden hour
                    </span>
                    <span className="sim-entity-metric">42 generations</span>
                  </div>
                  <div className="sim-entity">
                    <span className="sim-entity-icon">✏️</span>
                    <span className="sim-entity-name">
                      portrait of a girl in neon-lit Tokyo street
                    </span>
                    <span className="sim-entity-metric">28 generations</span>
                  </div>
                  <div className="sim-entity">
                    <span className="sim-entity-icon">✏️</span>
                    <span className="sim-entity-name">
                      oil painting of a cottage in autumn forest
                    </span>
                    <span className="sim-entity-metric">15 generations</span>
                  </div>
                </div>
              </div>
            </div>

            <h2>{t('h_board')}</h2>
            <ul>
              <li>{t('bd1')}</li>
              <li>{t('bd2')}</li>
              <li>{t('bd3')}</li>
              <li>{t('bd4')}</li>
            </ul>

            <h2>{t('h_adv')}</h2>
            <div dangerouslySetInnerHTML={{ __html: t('doc_sf_adv_html') }} />

            <h2>{t('h_sec')}</h2>
            <ul>
              <li>{t('s1')}</li>
              <li>{t('s2')}</li>
              <li>{t('s3')}</li>
              <li>{t('s4')}</li>
            </ul>

            <h2>{t('h_future')}</h2>
            <ul>
              <li>{t('fu1')}</li>
              <li>{t('fu2')}</li>
              <li>{t('fu3')}</li>
              <li>{t('fu4')}</li>
            </ul>

            <p style={{ marginTop: '2rem', opacity: 0.6 }}>{t('license_p')}</p>
          </article>

          <DocFooter t={t} lang={lang} />
        </div>
      </main>
    </DocLayout>
  )
}
