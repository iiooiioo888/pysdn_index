import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageShell } from '../components/PageShell'
import { useLangQuery } from '../hooks/useLangQuery'
import { getModelDetailDoc } from '../data/modelDetailDocs'
import { BEDROCK_MODELS } from '../data/bedrockCatalog'
import {
  CATALOG_MODELS,
  pickModelText,
  resolveUiLang,
  type UiLang,
} from '../data/modelsCatalog'
import {
  cardPipelineLabel,
  detailCapabilityLabel,
  detailProductLineLabel,
  listingSourceLabel,
} from '../data/modelDisplayLabels'
import { OPENROUTER_MODELS } from '../data/openRouterModels'
import { PATHS } from '../routes/paths'

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

  const langSearch = useLangQuery()

  const mergedModels = useMemo(
    () => [...CATALOG_MODELS, ...BEDROCK_MODELS, ...OPENROUTER_MODELS],
    [],
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
    return <Navigate to={{ pathname: PATHS.models, search: langSearch }} replace />
  }

  const title = pickModelText(model.title, uiLang)
  const lead = pickModelText(model.desc, uiLang)
  const openRouterPageUrl = model.openRouterApiId
    ? `https://openrouter.ai/${model.openRouterApiId}`
    : undefined

  return (
    <PageShell>
      <main className="model-detail-main">
        <div className="model-detail-inner">
            <Link className="model-detail-back" to={{ pathname: PATHS.models, search: langSearch }}>
              <span className="ui-chevron-right model-detail-back-chevron" aria-hidden="true" />
              {t('model_detail_back')}
            </Link>

            <header className="model-detail-hero">
              <div className="model-detail-hero-meta">
                <span className="model-detail-hero-pill">{t('models_label')}</span>
                <span className="model-detail-hero-pill model-detail-hero-pill--cap">
                  {detailCapabilityLabel(model.capability, t)}
                </span>
                <span className="model-detail-hero-pill model-detail-hero-pill--pipe">
                  {cardPipelineLabel(model.product, t)}
                </span>
                {model.badges.includes('new') ? (
                  <span className="model-detail-hero-pill">{t('models_badge_new')}</span>
                ) : null}
                {model.badges.includes('hot') ? (
                  <span className="model-detail-hero-pill">{t('models_badge_hot')}</span>
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

            <section className="model-detail-block model-detail-block--quick" aria-labelledby="model-detail-quick">
              <h2 id="model-detail-quick">{t('model_detail_quick_facts')}</h2>
              <div className="model-detail-specs-wrap">
                <table className="model-detail-specs model-detail-specs--facts">
                  <tbody>
                    <tr>
                      <th scope="row">{t('model_detail_capability')}</th>
                      <td>{detailCapabilityLabel(model.capability, t)}</td>
                    </tr>
                    <tr>
                      <th scope="row">{t('model_detail_product_line')}</th>
                      <td>{detailProductLineLabel(model, t)}</td>
                    </tr>
                    <tr>
                      <th scope="row">{t('model_detail_listing_source')}</th>
                      <td>{listingSourceLabel(model, t)}</td>
                    </tr>
                    {model.contextLength != null ? (
                      <tr>
                        <th scope="row">{t('models_ctx_prefix')}</th>
                        <td>{model.contextLength.toLocaleString()}</td>
                      </tr>
                    ) : null}
                    <tr>
                      <th scope="row">{t('model_detail_modalities')}</th>
                      <td>
                        {model.modalitiesLine ? model.modalitiesLine : t('model_detail_modalities_note')}
                      </td>
                    </tr>
                    {model.price ? (
                      <tr>
                        <th scope="row">{t('model_detail_pricing')}</th>
                        <td className="model-detail-td-verbose">{model.price}</td>
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
    </PageShell>
  )
}
