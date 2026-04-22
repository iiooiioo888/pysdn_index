import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import {
  CATALOG_MODELS,
  pickModelText,
  resolveUiLang,
  type CatalogModel,
  type ModelCapability,
  type ModelDeveloper,
  type ModelProduct,
} from '../data/modelsCatalog'

type CapFilter = 'all' | ModelCapability
type BrandFilter = 'all' | ModelProduct
type DevFilter = 'all' | ModelDeveloper

function brandFromLocationSearch(search: string): BrandFilter {
  const q = search.startsWith('?') ? search.slice(1) : search
  const b = new URLSearchParams(q).get('brand')
  return b === 'seedance' || b === 'seedream' || b === 'qwencloud' ? b : 'all'
}

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

function catalogDeveloperLabel(dev: ModelDeveloper, t: (k: string) => string): string {
  if (dev === 'bytedance') return t('models_dev_bytedance')
  if (dev === 'alibaba') return t('models_dev_alibaba')
  return t('models_dev_qwencloud')
}

const THUMB_HUES = [198, 280, 168, 32, 210, 145, 260, 22, 320]

function thumbHueClassForModelId(id: string): string {
  const idx = [...id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % THUMB_HUES.length
  return `models-atlas-thumb--${idx}`
}

function matchesFilters(
  cap: CapFilter,
  brand: BrandFilter,
  dev: DevFilter,
): (m: CatalogModel) => boolean {
  return (m) => {
    const okCap = cap === 'all' || m.capability === cap
    const okBrand = brand === 'all' || m.product === brand
    const okDev = dev === 'all' || m.developer === dev
    return okCap && okBrand && okDev
  }
}

export function ModelsSection() {
  const { t, i18n } = useTranslation()
  const { search } = useLocation()
  const lang = resolveUiLang(i18n.language)
  const [capFilter, setCapFilter] = useState<CapFilter>('all')
  const [brandFilter, setBrandFilter] = useState<BrandFilter>(() => brandFromLocationSearch(search))
  const [devFilter, setDevFilter] = useState<DevFilter>('all')

  useEffect(() => {
    setBrandFilter(brandFromLocationSearch(search))
  }, [search])

  const counts = useMemo(() => {
    const total = CATALOG_MODELS.length
    const video = CATALOG_MODELS.filter((m) => m.capability === 'video').length
    const image = CATALOG_MODELS.filter((m) => m.capability === 'image').length
    const text = CATALOG_MODELS.filter((m) => m.capability === 'text').length
    const audio = CATALOG_MODELS.filter((m) => m.capability === 'audio').length
    const multimodal = CATALOG_MODELS.filter((m) => m.capability === 'multimodal').length
    const seedance = CATALOG_MODELS.filter((m) => m.product === 'seedance').length
    const seedream = CATALOG_MODELS.filter((m) => m.product === 'seedream').length
    const qwencloud = CATALOG_MODELS.filter((m) => m.product === 'qwencloud').length
    const bytedance = CATALOG_MODELS.filter((m) => m.developer === 'bytedance').length
    const alibaba = CATALOG_MODELS.filter((m) => m.developer === 'alibaba').length
    const qwencloudDev = CATALOG_MODELS.filter((m) => m.developer === 'qwencloud').length
    return {
      total,
      video,
      image,
      text,
      audio,
      multimodal,
      seedance,
      seedream,
      qwencloud,
      bytedance,
      alibaba,
      qwencloudDev,
    }
  }, [])

  const visible = useMemo(
    () => CATALOG_MODELS.filter(matchesFilters(capFilter, brandFilter, devFilter)),
    [capFilter, brandFilter, devFilter],
  )

  const filtersClear = capFilter === 'all' && brandFilter === 'all' && devFilter === 'all'

  return (
    <section id="models" className="section models-section">
      <div className="container models-container">
        <div className="section-heading">
          <div className="section-label reveal">{t('models_label')}</div>
          <h2 className="section-title reveal">{t('models_title')}</h2>
          <p className="section-desc reveal">{t('models_desc')}</p>
          <p className="models-layout-note reveal">{t('models_ui_layout_note')}</p>
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
                  }}
                  disabled={filtersClear}
                >
                  {t('models_ui_clear')}
                </button>
              </div>

              {/* 三級：L1 分類標題列 · L2 功能／品牌／開發商（可摺疊）· L3 選項 */}
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
                          className={`models-filter-item ${capFilter === 'audio' ? 'is-active' : ''}`}
                          onClick={() => setCapFilter('audio')}
                        >
                          <span>{t('models_tab_audio')}</span>
                          <span className="models-filter-count">{counts.audio}</span>
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
                    </ul>
                  </details>
                </li>

                <li className="models-menu-tier1-item">
                  <details className="models-menu-tier models-menu-tier--bordered" open>
                    <summary className="models-menu-tier-summary">
                      <span className="models-menu-tier-summary-text">
                        {t('models_sidebar_group_brand')}
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
                          className={`models-filter-item ${brandFilter === 'seedance' ? 'is-active' : ''}`}
                          onClick={() => setBrandFilter('seedance')}
                        >
                          <span>{t('models_filter_seedance')}</span>
                          <span className="models-filter-count">{counts.seedance}</span>
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className={`models-filter-item ${brandFilter === 'seedream' ? 'is-active' : ''}`}
                          onClick={() => setBrandFilter('seedream')}
                        >
                          <span>{t('models_filter_seedream')}</span>
                          <span className="models-filter-count">{counts.seedream}</span>
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
                    </ul>
                  </details>
                </li>
              </ol>
            </nav>
          </aside>

          <div className="models-main">
            <div className="models-toolbar">
              <p className="models-toolbar-count">
                {t('models_ui_count', { total: counts.total, shown: visible.length })}
              </p>
              <span className="models-toolbar-sort">{t('models_ui_sort')}</span>
            </div>

            {visible.length === 0 ? (
              <p className="models-filter-empty">{t('models_filter_empty')}</p>
            ) : (
              <div className="models-card-grid">
                {visible.map((m) => {
                  const cap = catalogCapabilityLabel(m.capability, t)
                  const devLabel = catalogDeveloperLabel(m.developer, t)
                  return (
                    <article key={m.id} className="models-atlas-card models-atlas-card--static">
                      <div className="models-atlas-card-inner">
                        <div className={`models-atlas-thumb ${thumbHueClassForModelId(m.id)}`}>
                          <span className="models-atlas-thumb-shine" aria-hidden="true" />
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
                              <span className="models-atlas-cap">{cap}</span>
                              <span className="models-atlas-dev">{devLabel}</span>
                            </div>
                          </div>
                          <h3 className="models-atlas-title">{pickModelText(m.title, lang)}</h3>
                          <p className="models-atlas-desc">{pickModelText(m.desc, lang)}</p>
                          {m.price ? (
                            <div className="models-atlas-footer">
                              <span className="models-atlas-price">{m.price}</span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <p className="models-footnote reveal">{t('models_source')}</p>
      </div>
    </section>
  )
}
