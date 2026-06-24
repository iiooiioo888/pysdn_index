import { Link } from 'react-router-dom'
import { DocBundleLoadingShell } from '../../components/docs/DocBundleLoadingShell'
import { DocLayout } from '../../components/docs/DocLayout'
import { DocNavbar } from '../../components/docs/DocNavbar'
import { DocFooter } from '../../components/docs/DocFooter'
import { DocReadingSummary } from '../../components/docs/DocReadingSummary'
import { useDocBundle } from '../../hooks/useDocBundle'
import { PATHS } from '../../routes/paths'
import { toLangSearch } from '../../routes/langQuery'
import { sanitizeHtml } from '../../lib/sanitize'

export function StockQuantDocPage() {
  const { t, ready, loadError, lang } = useDocBundle('stockquant')

  if (!ready) {
    return <DocBundleLoadingShell variant="quant" loadError={loadError} />
  }

  return (
    <DocLayout variant="quant">
      <DocNavbar t={t} lang={lang} moduleNav={{ mode: 'docs', current: 'stockquant' }} />
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
                <span className="doc-hero-badge">STOCK QUANT</span>
                <h1 id="doc-hero-title">StockQuant</h1>
                <p className="doc-hero-sub">{t('hero_sub')}</p>
                <p className="doc-hero-lead">{t('intro_p')}</p>
              </div>
            </div>
          </section>

          <article className="doc">
            <DocReadingSummary t={t} variant="stockquant" />
            <h2>{t('h_feat')}</h2>
            <ul>
              <li>{t('f1')}</li>
              <li>{t('f2')}</li>
              <li>{t('f3')}</li>
              <li>{t('f4')}</li>
              <li>{t('f5')}</li>
            </ul>

            <h2>{t('h_strategies')}</h2>
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('strategies_html')) }} />

            <h2>{t('h_perf')}</h2>
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('perf_html')) }} />

            <h2>{t('h_quick')}</h2>
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('quickstart_html')) }} />

            <h2>{t('h_api')}</h2>
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('api_html')) }} />

            <p>
              <Link className="doc-lab-cta" to={{ pathname: PATHS.labs.stockquant, search: toLangSearch(lang) }}>
                開啟大螢幕儀表板（示範資料）→
              </Link>
            </p>
          </article>
        </div>
      </main>
      <DocFooter t={t} lang={lang} />
    </DocLayout>
  )
}
