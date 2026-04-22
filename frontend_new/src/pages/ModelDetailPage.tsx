import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../components/Navbar'
import { useCanvasBackground } from '../hooks/useCanvasBackground'
import { useLangQuery } from '../hooks/useLangQuery'
import { getModelDetailDoc } from '../data/modelDetailDocs'
import { BEDROCK_MODELS } from '../data/bedrockCatalog'
import {
  CATALOG_MODELS,
  pickModelText,
  resolveUiLang,
  type CatalogModel,
  type UiLang,
} from '../data/modelsCatalog'
import { ensureOpenRouterModels } from '../data/openRouterModels'
import { PATHS } from '../routes/paths'

const Footer = lazy(() => import('../components/Footer').then((m) => ({ default: m.Footer })))

function pickDetailLang<T>(row: Record<UiLang, T>, lang: UiLang): T {
  return row[lang] ?? row.en
}

function isOpenRouterDetailId(id: string): boolean {
  return id.startsWith('or--')
}

function isBedrockDetailId(id: string): boolean {
  return id.startsWith('br--')
}

export function ModelDetailPage() {
  const { t, i18n } = useTranslation()
  const { modelId: rawId } = useParams()
  const modelId = rawId ? decodeURIComponent(rawId) : ''
  const uiLang = resolveUiLang(i18n.language)

  const canvasRef = useCanvasBackground()
  const langSearch = useLangQuery()

  const [openRouterExtra, setOpenRouterExtra] = useState<CatalogModel[]>([])
  const [openRouterFetched, setOpenRouterFetched] = useState(false)

  useEffect(() => {
    let cancelled = false
    ensureOpenRouterModels()
      .then((rows) => {
        if (!cancelled) setOpenRouterExtra(rows)
      })
      .catch(() => {
        if (!cancelled) setOpenRouterExtra([])
      })
      .finally(() => {
        if (!cancelled) setOpenRouterFetched(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const mergedModels = useMemo(
    () => [...CATALOG_MODELS, ...BEDROCK_MODELS, ...openRouterExtra],
    [openRouterExtra],
  )

  const model = modelId ? mergedModels.find((m) => m.id === modelId) : undefined
  const doc = modelId ? getModelDetailDoc(modelId) : undefined

  const curatedHit = modelId ? CATALOG_MODELS.some((m) => m.id === modelId) : false
  const orSlug = modelId ? isOpenRouterDetailId(modelId) : false
  const bedrockSlug = modelId ? isBedrockDetailId(modelId) : false

  if (!modelId) {
    return <Navigate to={{ pathname: PATHS.models, search: langSearch }} replace />
  }

  if (!curatedHit && !orSlug && !bedrockSlug) {
    return <Navigate to={{ pathname: PATHS.models, search: langSearch }} replace />
  }

  if (!model) {
    if (orSlug && !openRouterFetched) {
      return (
        <>
          <canvas ref={canvasRef} id="bgCanvas" aria-hidden="true" />
          <div className="site-shell">
            <Navbar />
            <main className="model-detail-main">
              <div className="model-detail-inner">
                <p className="model-detail-loading" role="status">
                  {t('models_openrouter_loading')}
                </p>
              </div>
            </main>
          </div>
        </>
      )
    }
    return <Navigate to={{ pathname: PATHS.models, search: langSearch }} replace />
  }

  const title = pickModelText(model.title, uiLang)
  const lead = pickModelText(model.desc, uiLang)
  const openRouterPageUrl = model.openRouterApiId
    ? `https://openrouter.ai/${model.openRouterApiId}`
    : undefined

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
                {model.product === 'openrouter' ? (
                  <span className="model-detail-hero-pill">{t('models_filter_openrouter')}</span>
                ) : null}
                {model.product === 'bedrock' ? (
                  <span className="model-detail-hero-pill">{t('models_filter_bedrock')}</span>
                ) : null}
              </div>
              <h1>{title}</h1>
              <p className="model-detail-lead">{lead}</p>
              {doc?.officialUrl || openRouterPageUrl ? (
                <div className="model-detail-actions">
                  {doc?.officialUrl ? (
                    <a
                      className="model-detail-official"
                      href={doc.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('model_detail_official')}
                    </a>
                  ) : null}
                  {openRouterPageUrl ? (
                    <a
                      className="model-detail-official model-detail-official--secondary"
                      href={openRouterPageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('model_detail_openrouter')}
                    </a>
                  ) : null}
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

            {!doc && (model.openRouterApiId || model.product === 'bedrock') ? (
              <section className="model-detail-block" aria-labelledby="model-detail-or-specs">
                <h2 id="model-detail-or-specs">{t('model_detail_specs')}</h2>
                <div className="model-detail-specs-wrap">
                  <table className="model-detail-specs">
                    <tbody>
                      {model.contextLength != null ? (
                        <tr>
                          <th scope="row">{t('models_ctx_prefix')}</th>
                          <td>{model.contextLength.toLocaleString()}</td>
                        </tr>
                      ) : null}
                      {model.modalitiesLine ? (
                        <tr>
                          <th scope="row">{t('model_detail_modalities')}</th>
                          <td>{model.modalitiesLine}</td>
                        </tr>
                      ) : null}
                      {model.price ? (
                        <tr>
                          <th scope="row">{t('model_detail_pricing')}</th>
                          <td>{model.price}</td>
                        </tr>
                      ) : null}
                      <tr>
                        <th scope="row">{t('model_detail_api_id')}</th>
                        <td>
                          <code className="model-detail-code">
                            {model.openRouterApiId ?? model.id}
                          </code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
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
