import { lazy, Suspense } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/Navbar'
import { useCanvasBackground } from '../hooks/useCanvasBackground'
import { useLangQuery } from '../hooks/useLangQuery'
import { getModelDetailDoc } from '../data/modelDetailDocs'
import { getCatalogModelById, pickModelText, resolveUiLang, type UiLang } from '../data/modelsCatalog'
import { PATHS } from '../routes/paths'

const Footer = lazy(() => import('../components/Footer').then((m) => ({ default: m.Footer })))

function pickDetailLang<T>(row: Record<UiLang, T>, lang: UiLang): T {
  return row[lang] ?? row.en
}

export function ModelDetailPage() {
  const { t, i18n } = useTranslation()
  const { modelId: rawId } = useParams()
  const modelId = rawId ? decodeURIComponent(rawId) : ''
  const uiLang = resolveUiLang(i18n.language)

  const canvasRef = useCanvasBackground()
  const langSearch = useLangQuery()

  const model = modelId ? getCatalogModelById(modelId) : undefined
  const doc = modelId ? getModelDetailDoc(modelId) : undefined

  if (!modelId || !model) {
    return <Navigate to={{ pathname: PATHS.models, search: langSearch }} replace />
  }

  const title = pickModelText(model.title, uiLang)
  const lead = pickModelText(model.desc, uiLang)

  return (
    <>
      <canvas ref={canvasRef} id="bgCanvas" aria-hidden="true" />

      <div className="site-shell">
        <Navbar />
        <main className="model-detail-main">
          <div className="model-detail-inner">
            <Link className="model-detail-back" to={{ pathname: PATHS.models, search: langSearch }}>
              <span className="ui-chevron-right model-detail-back-chevron" aria-hidden="true" />
              {t('model_detail_back')}
            </Link>

            <header className="model-detail-hero">
              <div className="model-detail-hero-meta">
                <span className="model-detail-hero-pill">{t('models_label')}</span>
                {model.badges.includes('new') ? (
                  <span className="model-detail-hero-pill">{t('models_badge_new')}</span>
                ) : null}
                {model.badges.includes('hot') ? (
                  <span className="model-detail-hero-pill">{t('models_badge_hot')}</span>
                ) : null}
              </div>
              <h1>{title}</h1>
              <p className="model-detail-lead">{lead}</p>
              {doc?.officialUrl ? (
                <div className="model-detail-actions">
                  <a
                    className="model-detail-official"
                    href={doc.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('model_detail_official')}
                  </a>
                </div>
              ) : null}
            </header>

            {doc ? (
              <>
                <section className="model-detail-block" aria-labelledby="model-detail-highlights">
                  <h2 id="model-detail-highlights">{t('model_detail_highlights')}</h2>
                  <ul className="model-detail-highlights">
                    {pickDetailLang(doc.highlights, uiLang).map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                </section>

                <section className="model-detail-block" aria-labelledby="model-detail-specs">
                  <h2 id="model-detail-specs">{t('model_detail_specs')}</h2>
                  <div className="model-detail-specs-wrap">
                    <table className="model-detail-specs">
                      <tbody>
                        {pickDetailLang(doc.specs, uiLang).map((row) => (
                          <tr key={row.label}>
                            <th scope="row">{row.label}</th>
                            <td>{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="model-detail-block" aria-labelledby="model-detail-deep">
                  <h2 id="model-detail-deep">{t('model_detail_read_more')}</h2>
                  {pickDetailLang(doc.sections, uiLang).map((sec) => (
                    <div key={sec.heading} className="model-detail-section">
                      <h3>{sec.heading}</h3>
                      <p>{sec.body}</p>
                    </div>
                  ))}
                </section>
              </>
            ) : null}

            <p className="model-detail-disclaimer">{t('model_detail_disclaimer')}</p>
          </div>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </>
  )
}
