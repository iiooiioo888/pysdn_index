import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DocLayout } from '../../components/docs/DocLayout'
import { DocNavbar } from '../../components/docs/DocNavbar'
import { DocFooter } from '../../components/docs/DocFooter'
import { DocReadingSummary } from '../../components/docs/DocReadingSummary'
import { DocMermaid } from '../../components/docs/DocMermaid'
import { SUPERFORGE_MINDMAP } from '../../components/docs/mermaidCharts'
import { useDocBundle } from '../../hooks/useDocBundle'
import { PATHS } from '../../routes/paths'
import { toLangSearch } from '../../routes/langQuery'

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
      <DocNavbar t={t} lang={lang} moduleNav={{ mode: 'docs', current: 'superforge' }} />
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

            <h2>{t('h_char')}</h2>
            <div dangerouslySetInnerHTML={{ __html: t('doc_sf_characters_html') }} />

            <div className="doc-diagram-block">
              <h3>架構與能力（示意）</h3>
              <p className="doc-diagram-lead">知識儲存、檢索與應用的大致分工，對照上文功能說明即可。</p>
              <DocMermaid chart={SUPERFORGE_MINDMAP} />
            </div>

            <h2>{t('doc_sf_sim_h2')}</h2>
            <p>{t('doc_sf_sim_p')}</p>
            <p>
              <Link className="doc-lab-cta" to={{ pathname: PATHS.labs.superforge, search: toLangSearch(lang) }}>
                開啟大螢幕儀表板（示範資料）→
              </Link>
            </p>

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
