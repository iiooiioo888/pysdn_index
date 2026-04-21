import { Link } from 'react-router-dom'
import { useDocBundle } from '../hooks/useDocBundle'
import { ModulesNav } from '../components/modules/ModulesNav'
import { ModulesPageSidebar } from '../components/modules/ModulesPageSidebar'
import { ModulesVideoFlowSection } from '../components/modules/ModulesVideoFlowSection'
import { PATHS } from '../routes/paths'
import { toLangSearch } from '../routes/langQuery'
import '../styles/modules-page.css'

export function ModulesPage() {
  const { t, ready, loadError, lang } = useDocBundle('modules')
  const langSearch = toLangSearch(lang)

  if (!ready) {
    return (
      <div className="modules-page">
        <ModulesNav />
        <main className="mod-hero" style={{ paddingTop: 140 }}>
          <p className="hero-desc" style={{ opacity: loadError ? 1 : 0.5, textAlign: 'center' }}>
            {loadError ? '無法載入模組總覽資料，請重新整理頁面。' : '…'}
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="modules-page">
      <ModulesNav />
      <div className="modules-shell">
        <ModulesPageSidebar tm={t} langSearch={langSearch} />
        <div className="modules-main">
          <main>
            <section id="mod-overview" className="mod-hero">
              <div className="mod-hero-fx" aria-hidden="true">
                <span className="mod-hero-grid" />
                <span className="mod-hero-orb mod-hero-orb--1" />
                <span className="mod-hero-orb mod-hero-orb--2" />
              </div>
              <div className="intro-badge">
                <span className="badge-dot" aria-hidden="true" />
                <span>{t('mod_hero_badge')}</span>
              </div>
              <h1>
                {t('mod_hero_title_line')}{' '}
                <span className="gradient-text">{t('mod_hero_title_grad')}</span>
              </h1>
              <p className="hero-desc">{t('mod_hero_desc')}</p>
            </section>

            <section id="mod-doc-guide" className="mod-doc-guide">
              <div className="mod-doc-guide-inner">
                <p className="mod-doc-guide-label">{t('mod_doc_guide_title')}</p>
                <p className="mod-doc-guide-lead">{t('mod_doc_guide_p')}</p>
                <ul className="mod-doc-guide-list">
                  <li>{t('mod_doc_guide_li1')}</li>
                  <li>{t('mod_doc_guide_li2')}</li>
                  <li>{t('mod_doc_guide_li3')}</li>
                  <li>{t('mod_doc_guide_li4')}</li>
                </ul>
              </div>
            </section>

            <section id="mod-pipeline" className="mod-pipeline">
              <h3>{t('mod_pipe_label')}</h3>
              <div className="mod-pipeline-flow">
                <div className="mod-pipeline-node mod-pipeline-node--script">{t('mod_pipe_n1')}</div>
                <span className="mod-pipeline-arrow">→</span>
                <div className="mod-pipeline-node mod-pipeline-node--forge">{t('mod_pipe_n2')}</div>
                <span className="mod-pipeline-arrow">→</span>
                <div className="mod-pipeline-node mod-pipeline-node--tune">{t('mod_pipe_n3')}</div>
                <span className="mod-pipeline-arrow">→</span>
                <div className="mod-pipeline-node mod-pipeline-node--core">{t('mod_pipe_n4')}</div>
                <span className="mod-pipeline-arrow">→</span>
                <div className="mod-pipeline-node mod-pipeline-node--track">{t('mod_pipe_n5')}</div>
              </div>
              <p className="mod-pipeline-loop">{t('mod_pipe_loop')}</p>
            </section>

            <ModulesVideoFlowSection tm={t} />

            <div id="mod-core" className="mod-core-block">
              <div className="mod-section-heading">
                <div className="mod-section-label">{t('mod_sec_main_label')}</div>
                <h2 className="mod-section-title">{t('mod_sec_main_title')}</h2>
                <p className="mod-section-desc">{t('mod_sec_main_desc')}</p>
              </div>

              <div className="mod-grid">
                <article id="module-forge" className="mod-card mod-card--forge">
                  <span className="mod-card-num">01</span>
                  <div className="mod-card-icon">🗂️</div>
                  <span className="mod-card-badge">{t('mod_forge_badge')}</span>
                  <h2>SuperForge</h2>
                  <p className="mod-card-desc">{t('mod_forge_desc')}</p>
                  <ul className="mod-card-features">
                    <li>{t('mod_forge_f1')}</li>
                    <li>{t('mod_forge_f2')}</li>
                    <li>{t('mod_forge_f3')}</li>
                    <li>{t('mod_forge_f4')}</li>
                  </ul>
                  <Link className="mod-card-link" to={{ pathname: PATHS.docs.superforge, search: langSearch }}>
                    {t('mod_link_doc')}
                  </Link>
                  <div className="mod-card-tags">
                    <span>{t('mod_forge_tag1')}</span>
                    <span>{t('mod_forge_tag2')}</span>
                    <span>{t('mod_forge_tag3')}</span>
                  </div>
                </article>

                <article id="module-tune" className="mod-card mod-card--tune">
                  <span className="mod-card-num">02</span>
                  <div className="mod-card-icon">🧠</div>
                  <span className="mod-card-badge">{t('mod_tune_badge')}</span>
                  <h2>SuperTune</h2>
                  <p className="mod-card-desc">{t('mod_tune_desc')}</p>
                  <ul className="mod-card-features">
                    <li>{t('mod_tune_f1')}</li>
                    <li>{t('mod_tune_f2')}</li>
                    <li>{t('mod_tune_f3')}</li>
                    <li>{t('mod_tune_f4')}</li>
                  </ul>
                  <Link className="mod-card-link" to={{ pathname: PATHS.docs.supertune, search: langSearch }}>
                    {t('mod_link_doc')}
                  </Link>
                  <div className="mod-card-tags">
                    <span>{t('mod_tune_tag1')}</span>
                    <span>{t('mod_tune_tag2')}</span>
                    <span>{t('mod_tune_tag3')}</span>
                  </div>
                </article>

                <article id="module-track" className="mod-card mod-card--track">
                  <span className="mod-card-num">03</span>
                  <div className="mod-card-icon">🛰️</div>
                  <span className="mod-card-badge">{t('mod_track_badge')}</span>
                  <h2>SuperTrack</h2>
                  <p className="mod-card-desc">{t('mod_track_desc')}</p>
                  <ul className="mod-card-features">
                    <li>{t('mod_track_f1')}</li>
                    <li>{t('mod_track_f2')}</li>
                    <li>{t('mod_track_f3')}</li>
                    <li>{t('mod_track_f4')}</li>
                  </ul>
                  <Link className="mod-card-link" to={{ pathname: PATHS.docs.supertrack, search: langSearch }}>
                    {t('mod_link_doc')}
                  </Link>
                  <div className="mod-card-tags">
                    <span>{t('mod_track_tag1')}</span>
                    <span>{t('mod_track_tag2')}</span>
                    <span>{t('mod_track_tag3')}</span>
                  </div>
                </article>

                <article id="module-script" className="mod-card mod-card--script">
                  <span className="mod-card-num">04</span>
                  <div className="mod-card-icon">🎬</div>
                  <span className="mod-card-badge">{t('mod_script_badge')}</span>
                  <h2>SuperScript</h2>
                  <p className="mod-card-desc">{t('mod_script_desc')}</p>
                  <ul className="mod-card-features">
                    <li>{t('mod_script_f1')}</li>
                    <li>{t('mod_script_f2')}</li>
                    <li>{t('mod_script_f3')}</li>
                    <li>{t('mod_script_f4')}</li>
                  </ul>
                  <Link className="mod-card-link" to={{ pathname: PATHS.docs.superscript, search: langSearch }}>
                    {t('mod_link_doc')}
                  </Link>
                  <div className="mod-card-tags">
                    <span>{t('mod_script_tag1')}</span>
                    <span>{t('mod_script_tag2')}</span>
                    <span>{t('mod_script_tag3')}</span>
                  </div>
                </article>
              </div>
            </div>

            <div id="mod-cross" className="mod-cross-block">
              <div className="mod-section-heading" style={{ marginTop: 20 }}>
                <div className="mod-section-label">{t('mod_cross_label')}</div>
                <h2 className="mod-section-title">{t('mod_cross_title')}</h2>
                <p className="mod-section-desc">{t('mod_cross_desc')}</p>
              </div>

              <div className="mod-grid">
                <article className="mod-card mod-card--track mod-card--compact">
                  <h2>{t('mod_x1_title')}</h2>
                  <p className="mod-card-desc">{t('mod_x1_desc')}</p>
                </article>
                <article className="mod-card mod-card--script mod-card--compact">
                  <h2>{t('mod_x2_title')}</h2>
                  <p className="mod-card-desc">{t('mod_x2_desc')}</p>
                </article>
                <article className="mod-card mod-card--forge mod-card--compact">
                  <h2>{t('mod_x3_title')}</h2>
                  <p className="mod-card-desc">{t('mod_x3_desc')}</p>
                </article>
                <article className="mod-card mod-card--tune mod-card--compact">
                  <h2>{t('mod_x4_title')}</h2>
                  <p className="mod-card-desc">{t('mod_x4_desc')}</p>
                </article>
              </div>
            </div>
          </main>

          <footer className="mod-footer">
            <p>
              {t('footer_copy')}{' '}
              <Link to={{ pathname: PATHS.home, search: langSearch }}>{t('footer_link')}</Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}
