import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { useLangQuery } from '../hooks/useLangQuery'
import { BEDROCK_MODELS } from '../data/bedrockCatalog'
import { OPENROUTER_MODELS } from '../data/openRouterModels'
import {
  CATALOG_MODELS,
  pickModelText,
  resolveUiLang,
  type CatalogModel,
  type ModelCapability,
  type ModelDeveloper,
  type ModelProduct,
} from '../data/modelsCatalog'
import { pathToModelDetail } from '../routes/paths'
import { cardPipelineLabel, contextLengthPill, isCuratedCatalogModel } from '../data/modelDisplayLabels'
import { ModelCardPrice } from './ModelCardPrice'
import { ModelDeveloperIcon } from './ModelDeveloperIcon'

type CapFilter = 'all' | ModelCapability
/** `volcano`：Seedance + Seedream，皆為火山引擎產品線 */
type BrandFilter = 'all' | ModelProduct | 'volcano'
type DevFilter = 'all' | ModelDeveloper

/** 首屏與每次捲到底自動載入的筆數 */
const MODELS_BATCH_SIZE = 9

function catalogCapabilityLabel(cap: ModelCapability, t: (k: string) => string): string {
  const key =
    cap === 'video'
      ? 'models_tab_video'
      : cap === 'image'
        ? 'models_tab_image'
        : cap === 'text'
          ? 'models_tab_text'
          : cap === 'audio'
            ? 'models_tab_audio'
            : 'models_tab_multimodal'
  return t(key)
}

function catalogListingSourceShort(m: CatalogModel, t: (k: string) => string): string | null {
  if (m.product === 'openrouter') return t('models_card_source_openrouter')
  if (m.product === 'bedrock') return t('models_card_source_bedrock')
  return null
}

function developerTitleKey(developer: ModelDeveloper): string {
  const map: Record<ModelDeveloper, string> = {
    bytedance: 'models_dev_bytedance',
    alibaba: 'models_dev_alibaba',
    qwencloud: 'models_dev_qwencloud',
    openrouter: 'models_dev_openrouter',
    aws: 'models_dev_aws',
  }
  return map[developer]
}

function brandFromLocationSearch(search: string): BrandFilter {
  const q = search.startsWith('?') ? search.slice(1) : search
  const b = new URLSearchParams(q).get('brand')
  if (b === 'seedance' || b === 'seedream' || b === 'volcano') return 'volcano'
  if (b === 'qwencloud' || b === 'openrouter' || b === 'bedrock') return b
  return 'all'
}

const THUMB_HUES = [198, 280, 168, 32, 210, 145, 260, 22, 320]

function thumbHueClassForModelId(id: string): string {
  const idx = [...id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % THUMB_HUES.length
  return `models-atlas-thumb--${idx}`
}

function matchesBrandFilter(m: CatalogModel, brand: BrandFilter): boolean {
  if (brand === 'all') return true
  if (brand === 'volcano') return m.product === 'seedance' || m.product === 'seedream'
  return m.product === brand
}

function matchesFilters(
  cap: CapFilter,
  brand: BrandFilter,
  dev: DevFilter,
): (m: CatalogModel) => boolean {
  return (m) => {
    const okCap = cap === 'all' || m.capability === cap
    const okBrand = matchesBrandFilter(m, brand)
    const okDev = dev === 'all' || m.developer === dev
    return okCap && okBrand && okDev
  }
}

export function ModelsSection() {
  const { t, i18n } = useTranslation()
  const { search } = useLocation()
  const langSearch = useLangQuery()
  const lang = resolveUiLang(i18n.language)
  const [capFilter, setCapFilter] = useState<CapFilter>('all')
  const [brandFilter, setBrandFilter] = useState<BrandFilter>(() => brandFromLocationSearch(search))
  const [devFilter, setDevFilter] = useState<DevFilter>('all')
  const [searchText, setSearchText] = useState('')
  const [listLimit, setListLimit] = useState(MODELS_BATCH_SIZE)
  const loadSentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setBrandFilter(brandFromLocationSearch(search))
  }, [search])

  const allModels = useMemo(
    () => [...CATALOG_MODELS, ...BEDROCK_MODELS, ...OPENROUTER_MODELS],
    [],
  )

  const counts = useMemo(() => {
    const total = allModels.length
    const video = allModels.filter((m) => m.capability === 'video').length
    const image = allModels.filter((m) => m.capability === 'image').length
    const text = allModels.filter((m) => m.capability === 'text').length
    const audio = allModels.filter((m) => m.capability === 'audio').length
    const multimodal = allModels.filter((m) => m.capability === 'multimodal').length
    const seedance = allModels.filter((m) => m.product === 'seedance').length
    const seedream = allModels.filter((m) => m.product === 'seedream').length
    const qwencloud = allModels.filter((m) => m.product === 'qwencloud').length
    const openrouter = allModels.filter((m) => m.product === 'openrouter').length
    const bedrock = allModels.filter((m) => m.product === 'bedrock').length
    const bytedance = allModels.filter((m) => m.developer === 'bytedance').length
    const alibaba = allModels.filter((m) => m.developer === 'alibaba').length
    const qwencloudDev = allModels.filter((m) => m.developer === 'qwencloud').length
    const openrouterDev = allModels.filter((m) => m.developer === 'openrouter').length
    const awsDev = allModels.filter((m) => m.developer === 'aws').length
    const volcano = seedance + seedream
    return {
      total,
      video,
      image,
      text,
      audio,
      multimodal,
      seedance,
      seedream,
      volcano,
      qwencloud,
      openrouter,
      bedrock,
      bytedance,
      alibaba,
      qwencloudDev,
      openrouterDev,
      awsDev,
    }
  }, [allModels])

  const visible = useMemo(() => {
    const q = searchText.trim().toLowerCase()
    let rows = allModels.filter(matchesFilters(capFilter, brandFilter, devFilter))
    if (q) {
      rows = rows.filter((m) => {
        const title = pickModelText(m.title, lang).toLowerCase()
        const desc = pickModelText(m.desc, lang).toLowerCase()
        const id = m.id.toLowerCase()
        const api = (m.openRouterApiId ?? '').toLowerCase()
        const modalities = (m.modalitiesLine ?? '').toLowerCase()
        const prov = (m.providerName ?? '').toLowerCase()
        return (
          title.includes(q) ||
          desc.includes(q) ||
          id.includes(q) ||
          api.includes(q) ||
          modalities.includes(q) ||
          prov.includes(q)
        )
      })
    }
    return rows
  }, [allModels, capFilter, brandFilter, devFilter, searchText, lang])

  useEffect(() => {
    setListLimit(MODELS_BATCH_SIZE)
  }, [capFilter, brandFilter, devFilter, searchText])

  const visibleSlice = useMemo(() => visible.slice(0, listLimit), [visible, listLimit])

  const bumpListLimit = useCallback(() => {
    setListLimit((n) => {
      if (n >= visible.length) return n
      return Math.min(n + MODELS_BATCH_SIZE, visible.length)
    })
  }, [visible.length])

  useEffect(() => {
    const el = loadSentinelRef.current
    if (!el || visible.length === 0) return

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) bumpListLimit()
      },
      { root: null, rootMargin: '160px 0px', threshold: 0 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [bumpListLimit, visible.length, visibleSlice.length])

  const filtersClear =
    capFilter === 'all' && brandFilter === 'all' && devFilter === 'all' && searchText.trim() === ''

  return (
    <section id="models" className="section models-section">
      <div className="container models-container">
        <div className="models-hero">
          <div className="section-heading models-hero-heading">
            <div className="section-label reveal">{t('models_label')}</div>
            <h2 className="section-title models-hero-title reveal">{t('models_title')}</h2>
            <p className="section-desc reveal">{t('models_desc')}</p>
          </div>
        </div>

        <div className="models-layout reveal">
          <aside className="models-sidebar">
            <nav className="models-sidebar-nav" aria-label={t('models_nav_aria')}>
              <div className="models-sidebar-head">
                <span className="models-sidebar-title">{t('models_ui_sidebar_title')}</span>
                <button
                  type="button"
                  className="models-sidebar-clear"
                  onClick={() => {
                    setCapFilter('all')
                    setBrandFilter('all')
                    setDevFilter('all')
                    setSearchText('')
                  }}
                  disabled={filtersClear}
                >
                  {t('models_ui_clear')}
                </button>
              </div>

              {/* 側欄：① 模型能力 ② 資料來源／平台 ③ 開發商／系譜 */}
              <ol className="models-menu-tier1" role="list">
                <li className="models-menu-tier1-item">
                  <details className="models-menu-tier" open>
                    <summary className="models-menu-tier-summary">
                      <span className="models-menu-tier-summary-text">
                        {t('models_sidebar_group_function')}
                      </span>
                      <span className="models-menu-tier-chevron" aria-hidden="true" />
                    </summary>
                    <ul
                      className="models-filter-list models-filter-list--nested models-filter-list--tier3"
                      role="list"
                    >
                      <li>
                        <button
                          type="button"
                          className={`models-filter-item ${capFilter === 'all' ? 'is-active' : ''}`}
                          onClick={() => setCapFilter('all')}
                        >
                          <span>{t('models_ui_all')}</span>
                          <span className="models-filter-count">{counts.total}</span>
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className={`models-filter-item ${capFilter === 'text' ? 'is-active' : ''}`}
                          onClick={() => setCapFilter('text')}
                        >
                          <span>{t('models_tab_text')}</span>
                          <span className="models-filter-count">{counts.text}</span>
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className={`models-filter-item ${capFilter === 'multimodal' ? 'is-active' : ''}`}
                          onClick={() => setCapFilter('multimodal')}
                        >
                          <span>{t('models_tab_multimodal')}</span>
                          <span className="models-filter-count">{counts.multimodal}</span>
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className={`models-filter-item ${capFilter === 'image' ? 'is-active' : ''}`}
                          onClick={() => setCapFilter('image')}
                        >
                          <span>{t('models_tab_image')}</span>
                          <span className="models-filter-count">{counts.image}</span>
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className={`models-filter-item ${capFilter === 'video' ? 'is-active' : ''}`}
                          onClick={() => setCapFilter('video')}
                        >
                          <span>{t('models_tab_video')}</span>
                          <span className="models-filter-count">{counts.video}</span>
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className={`models-filter-item ${capFilter === 'audio' ? 'is-active' : ''}`}
                          onClick={() => setCapFilter('audio')}
                        >
                          <span>{t('models_tab_audio')}</span>
                          <span className="models-filter-count">{counts.audio}</span>
                        </button>
                      </li>
                    </ul>
                  </details>
                </li>

                <li className="models-menu-tier1-item">
                  <details className="models-menu-tier models-menu-tier--bordered" open>
                    <summary className="models-menu-tier-summary">
                      <span className="models-menu-tier-summary-text">
                        {t('models_sidebar_group_kind')}
                      </span>
                      <span className="models-menu-tier-chevron" aria-hidden="true" />
                    </summary>
                    <ul
                      className="models-filter-list models-filter-list--nested models-filter-list--tier3"
                      role="list"
                    >
                      <li>
                        <button
                          type="button"
                          className={`models-filter-item ${brandFilter === 'all' ? 'is-active' : ''}`}
                          onClick={() => setBrandFilter('all')}
                        >
                          <span>{t('models_ui_all')}</span>
                          <span className="models-filter-count">{counts.total}</span>
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className={`models-filter-item ${brandFilter === 'volcano' ? 'is-active' : ''}`}
                          onClick={() => setBrandFilter('volcano')}
                        >
                          <span>{t('models_filter_volcano_short')}</span>
                          <span className="models-filter-count">{counts.volcano}</span>
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className={`models-filter-item ${brandFilter === 'qwencloud' ? 'is-active' : ''}`}
                          onClick={() => setBrandFilter('qwencloud')}
                        >
                          <span>{t('models_filter_qwencloud')}</span>
                          <span className="models-filter-count">{counts.qwencloud}</span>
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className={`models-filter-item ${brandFilter === 'openrouter' ? 'is-active' : ''}`}
                          onClick={() => setBrandFilter('openrouter')}
                        >
                          <span>{t('models_filter_openrouter')}</span>
                          <span className="models-filter-count">{counts.openrouter}</span>
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className={`models-filter-item ${brandFilter === 'bedrock' ? 'is-active' : ''}`}
                          onClick={() => setBrandFilter('bedrock')}
                        >
                          <span>{t('models_filter_bedrock')}</span>
                          <span className="models-filter-count">{counts.bedrock}</span>
                        </button>
                      </li>
                    </ul>
                  </details>
                </li>

                <li className="models-menu-tier1-item">
                  <details className="models-menu-tier models-menu-tier--bordered" open>
                    <summary className="models-menu-tier-summary">
                      <span className="models-menu-tier-summary-text">
                        {t('models_sidebar_group_developer')}
                      </span>
                      <span className="models-menu-tier-chevron" aria-hidden="true" />
                    </summary>
                    <ul
                      className="models-filter-list models-filter-list--nested models-filter-list--tier3"
                      role="list"
                    >
                      <li>
                        <button
                          type="button"
                          className={`models-filter-item ${devFilter === 'all' ? 'is-active' : ''}`}
                          onClick={() => setDevFilter('all')}
                        >
                          <span>{t('models_ui_all')}</span>
                          <span className="models-filter-count">{counts.total}</span>
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className={`models-filter-item ${devFilter === 'bytedance' ? 'is-active' : ''}`}
                          onClick={() => setDevFilter('bytedance')}
                        >
                          <span>{t('models_dev_bytedance')}</span>
                          <span className="models-filter-count">{counts.bytedance}</span>
                        </button>
                      </li>
                      {counts.alibaba > 0 ? (
                        <li>
                          <button
                            type="button"
                            className={`models-filter-item ${devFilter === 'alibaba' ? 'is-active' : ''}`}
                            onClick={() => setDevFilter('alibaba')}
                          >
                            <span>{t('models_dev_alibaba')}</span>
                            <span className="models-filter-count">{counts.alibaba}</span>
                          </button>
                        </li>
                      ) : null}
                      <li>
                        <button
                          type="button"
                          className={`models-filter-item ${devFilter === 'qwencloud' ? 'is-active' : ''}`}
                          onClick={() => setDevFilter('qwencloud')}
                        >
                          <span>{t('models_dev_qwencloud')}</span>
                          <span className="models-filter-count">{counts.qwencloudDev}</span>
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className={`models-filter-item ${devFilter === 'openrouter' ? 'is-active' : ''}`}
                          onClick={() => setDevFilter('openrouter')}
                        >
                          <span>{t('models_dev_openrouter')}</span>
                          <span className="models-filter-count">{counts.openrouterDev}</span>
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className={`models-filter-item ${devFilter === 'aws' ? 'is-active' : ''}`}
                          onClick={() => setDevFilter('aws')}
                        >
                          <span>{t('models_dev_aws')}</span>
                          <span className="models-filter-count">{counts.awsDev}</span>
                        </button>
                      </li>
                    </ul>
                  </details>
                </li>
              </ol>
            </nav>
          </aside>

          <div className="models-main">
            <div className="models-toolbar-surface">
              <div className="models-toolbar">
                <p className="models-toolbar-count">
                  {t('models_ui_count', {
                    total: counts.total,
                    filtered: visible.length,
                    rendered: visibleSlice.length,
                  })}
                </p>
                <span className="models-toolbar-sort">{t('models_ui_sort')}</span>
              </div>
              <div className="models-toolbar-row">
                <label className="models-search">
                  <span className="models-search-label">{t('models_search_label')}</span>
                  <input
                    className="models-search-input"
                    type="search"
                    name="models-search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder={t('models_search_placeholder')}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </label>
                <p className="models-openrouter-status models-openrouter-status--ok" role="status">
                  {t('models_openrouter_ok', { count: counts.openrouter })}
                </p>
              </div>
            </div>

            {visible.length === 0 ? (
              <p className="models-filter-empty">{t('models_filter_empty')}</p>
            ) : (
              <>
              <div className="models-card-grid">
                {visibleSlice.map((m) => {
                  const cap = catalogCapabilityLabel(m.capability, t)
                  const pipeline = cardPipelineLabel(m.product, t)
                  const sourceShort = catalogListingSourceShort(m, t)
                  const showCurated = isCuratedCatalogModel(m)
                  const ctxPill = contextLengthPill(m.contextLength, t)
                  return (
                    <Link
                      key={m.id}
                      className="models-atlas-card models-atlas-card--link"
                      to={{ pathname: pathToModelDetail(m.id), search: langSearch }}
                    >
                      <div className="models-atlas-card-inner">
                        <div
                          className={`models-atlas-thumb ${thumbHueClassForModelId(m.id)}`}
                          data-developer={m.developer}
                        >
                          <span className="models-atlas-thumb-shine" aria-hidden="true" />
                          <ModelDeveloperIcon
                            developer={m.developer}
                            title={t(developerTitleKey(m.developer))}
                          />
                        </div>
                        <div className="models-atlas-body">
                          <div className="models-atlas-meta">
                            {m.badges.includes('new') && (
                              <span className="models-atlas-pill models-atlas-pill--new">
                                {t('models_badge_new')}
                              </span>
                            )}
                            {m.badges.includes('hot') && (
                              <span className="models-atlas-pill models-atlas-pill--hot">
                                {t('models_badge_hot')}
                              </span>
                            )}
                            <div className="models-atlas-meta-tags">
                              <span className="models-atlas-cap" title={t('models_card_hint_capability')}>
                                {cap}
                              </span>
                              <span
                                className="models-atlas-pipeline"
                                title={t('models_card_hint_pipeline')}
                              >
                                {pipeline}
                              </span>
                              {sourceShort ? (
                                <span
                                  className="models-atlas-source"
                                  title={t('models_card_hint_listing')}
                                >
                                  {sourceShort}
                                </span>
                              ) : showCurated ? (
                                <span
                                  className="models-atlas-curated"
                                  title={t('models_card_hint_curated')}
                                >
                                  {t('models_card_badge_curated')}
                                </span>
                              ) : null}
                              {ctxPill ? (
                                <span
                                  className="models-atlas-ctx"
                                  title={t('models_card_hint_context')}
                                >
                                  {ctxPill}
                                </span>
                              ) : null}
                            </div>
                          </div>
                          <h3 className="models-atlas-title">{pickModelText(m.title, lang)}</h3>
                          <p className="models-atlas-desc">{pickModelText(m.desc, lang)}</p>
                          <div
                            className="models-atlas-body-spacer"
                            aria-hidden="true"
                          />
                          <div
                            className={`models-atlas-footer${m.price ? '' : ' models-atlas-footer--empty'}`}
                            aria-hidden={m.price ? undefined : true}
                          >
                            {m.price ? <ModelCardPrice price={m.price} /> : null}
                          </div>
                          <div className="models-atlas-cta">
                            <span>{t('model_detail_cta')}</span>
                            <span className="ui-chevron-right models-atlas-cta-chevron" aria-hidden="true" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
              {visibleSlice.length < visible.length ? (
                <div
                  ref={loadSentinelRef}
                  className="models-infinite-sentinel"
                  aria-hidden="true"
                />
              ) : null}
              </>
            )}
          </div>
        </div>

        <p className="models-footnote reveal">{t('models_source')}</p>
      </div>
    </section>
  )
}
