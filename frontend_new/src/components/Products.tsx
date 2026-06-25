import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLangQuery } from '../hooks/useLangQuery'
import { PATHS } from '../routes/paths'
import { ModuleMiniCards } from './ModuleMiniCards'
const MODULE_CHEATSHEET = [
  { id: 'forge' as const, name: 'SuperForge', textKey: 'modules_split_cheat_forge' },
  { id: 'script' as const, name: 'SuperScript', textKey: 'modules_split_cheat_script' },
  { id: 'track' as const, name: 'SuperTrack', textKey: 'modules_split_cheat_track' },
  { id: 'tune' as const, name: 'SuperTune', textKey: 'modules_split_cheat_tune' },
  { id: 'nova' as const, name: 'SuperNova', textKey: 'modules_split_cheat_nova' },
  { id: 'sight' as const, name: 'SuperSight', textKey: 'modules_split_cheat_sight' },
  { id: 'stocksx' as const, name: 'StocksX', textKey: 'modules_split_cheat_stocksx' },
  { id: 'stockquant' as const, name: 'StockQuant', textKey: 'modules_split_cheat_stockquant' },
]

export function Products() {
  const { t } = useTranslation()
  const langSearch = useLangQuery()
  const sectionRef = useRef<HTMLElement>(null)
  const [fxInView, setFxInView] = useState(true)
  const [activeTab, setActiveTab] = useState('video')
  const [needsGesture, setNeedsGesture] = useState(false)
  /** 短劇分頁：主畫面監看目前播放的集數（EP1→EP3 連續輪播，可點選切換） */
  const [dramaMonitorEp, setDramaMonitorEp] = useState(1)
  const tabs = useMemo(
    () => [
      { id: 'video', label: t('tab_video') },
      { id: 'drama', label: t('tab_drama') },
      { id: 'image', label: t('tab_image') },
    ],
    [t],
  )

  const assetMp4 = (filename: string) => `${import.meta.env.BASE_URL}assets/${filename}`

  // Static demo stats (no backend needed)
  const [stats] = useState({ videosTotal: 3, dramasTotal: 2, imagesTotal: 15 })

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setFxInView(e.isIntersecting), {
      threshold: 0,
      rootMargin: '48px 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const tryPlayWithRetry = (v: HTMLVideoElement, retries = 4) => {
    const attempt = (n: number) => {
      try {
        v.muted = true
        v.playsInline = true
        void v.play().catch(() => {
          if (n > 0) setTimeout(() => attempt(n - 1), 250)
          else setNeedsGesture(true)
        })
      } catch {
        if (n > 0) setTimeout(() => attempt(n - 1), 250)
        else setNeedsGesture(true)
      }
    }
    attempt(retries)
  }

  const playAllInProducts = () => {
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('#products video'))
    let rejected = false
    videos.forEach((v) => {
      try {
        v.muted = true
        v.playsInline = true
        v.load()
        void v.play().catch(() => {
          rejected = true
        })
      } catch {
        rejected = true
      }
    })
    setNeedsGesture(rejected)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (activeTab === 'drama') setDramaMonitorEp(1)
    const timer = window.setTimeout(() => {
      const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('#products video'))
      videos.forEach((v) => {
        try {
          v.muted = true
          v.playsInline = true
          v.load()
          void v.play().catch(() => setNeedsGesture(true))
        } catch {
          // ignore autoplay failures
        }
      })
    }, 80)
    return () => window.clearTimeout(timer)
  }, [activeTab])

  return (
    <section
      ref={sectionRef}
      id="products"
      className={`section products${fxInView ? '' : ' products--fx-rest'}`}
    >
      <div className="container">
        <div className="products-intro reveal">
          <div className="products-intro-inner">
            <div className="products-intro-copy">
              <span className="products-intro-eyebrow">{t('products_label')}</span>
              <h2 className="products-intro-title">
                <span className="products-intro-kicker">{t('products_title_kicker')}</span>
                <span className="products-intro-subline">{t('products_title_subline')}</span>
              </h2>
              <p className="products-intro-desc">{t('products_desc')}</p>
              <ul className="products-intro-modules" aria-label={t('products_modules_aria')}>
                <li>
                  <span className="products-mod products-mod--forge">SuperForge</span>
                </li>
                <li>
                  <span className="products-mod products-mod--tune">SuperTune</span>
                </li>
                <li>
                  <span className="products-mod products-mod--track">SuperTrack</span>
                </li>
                <li>
                  <span className="products-mod products-mod--script">SuperScript</span>
                </li>
                <li>
                  <span className="products-mod" style={{color:'var(--color-primary-400,#60a5fa)'}}>SuperNova</span>
                </li>
                <li>
                  <span className="products-mod" style={{color:'#34d399'}}>SuperSight</span>
                </li>
                <li>
                  <span className="products-mod" style={{color:'#fbbf24'}}>StocksX</span>
                </li>
                <li>
                  <span className="products-mod" style={{color:'#fb7185'}}>StockQuant</span>
                </li>
              </ul>
              <div className="products-mini-cards">
                <ModuleMiniCards variant="products" />
              </div>
            </div>
            <aside className="products-intro-rail" aria-hidden="true">
              <div className="products-rail-visual">
                <div className="products-rail-core">
                  <span className="products-rail-core-ring" />
                  <span className="products-rail-core-label">{t('products_rail_core_label')}</span>
                  <span className="products-rail-core-hint">{t('products_rail_core_hint')}</span>
                </div>
                <div className="products-rail-connector">
                  <span className="products-rail-line" />
                  <span className="products-rail-arrow">↓</span>
                  <span className="products-rail-line" />
                </div>
                <div className="products-rail-modules">
                  <span className="products-rail-chip products-rail-chip--forge">Forge</span>
                  <span className="products-rail-chip products-rail-chip--tune">Tune</span>
                  <span className="products-rail-chip products-rail-chip--track">Track</span>
                  <span className="products-rail-chip products-rail-chip--script">Script</span>
                  <span className="products-rail-chip" style={{borderColor:'var(--color-primary-400,#60a5fa)'}}>Nova</span>
                  <span className="products-rail-chip" style={{borderColor:'#34d399'}}>Sight</span>
                  <span className="products-rail-chip" style={{borderColor:'#fbbf24'}}>StocksX</span>
                  <span className="products-rail-chip" style={{borderColor:'#fb7185'}}>Quant</span>
                </div>
              </div>
            </aside>
          </div>

          <div className="products-intro-stats" role="status" aria-live="polite">
            <div className="quickstat">
              <span className="quickstat-label">{t('tab_video')}</span>
              <span className="quickstat-val">{stats.videosTotal ?? '—'}</span>
            </div>
            <div className="quickstat">
              <span className="quickstat-label">{t('tab_drama')}</span>
              <span className="quickstat-val">{stats.dramasTotal ?? '—'}</span>
            </div>
            <div className="quickstat">
              <span className="quickstat-label">{t('tab_image')}</span>
              <span className="quickstat-val">{stats.imagesTotal ?? '—'}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="product-tabs reveal" role="tablist" aria-label="Product categories">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Video Panel */}
        {activeTab === 'video' && (
          <div className="product-panel product-panel--stack active reveal" role="tabpanel">
            <div className="panel-visual">
              <div className="panel-mockup">
                <LightningStage type="video" />
                <div className="mockup-header">
                  <div className="mockup-dots"><span /><span /><span /></div>
                  <span className="mockup-title">{t('mockup_video_title')}</span>
                </div>
                <div className="mockup-body">
                  <div className="video-preview-window">
                    <div className="video-preview-head">
                      <span className="video-preview-dot" />
                      <span>Generated Clip Preview</span>
                    </div>
                    {needsGesture && (
                      <button
                        type="button"
                        onClick={playAllInProducts}
                        className="video-autoplay-overlay"
                        aria-label={t('products_video_autoplay_aria')}
                      >
                        {t('products_video_autoplay_cta')}
                      </button>
                    )}
                    <video
                      className="video-preview-screen"
                      muted
                      loop
                      autoPlay
                      playsInline
                      preload="metadata"
                      poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230a0a1a'/%3E%3Cstop offset='.5' stop-color='%23111827'/%3E%3Cstop offset='1' stop-color='%230a0a1a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='640' height='360'/%3E%3Ctext x='320' y='180' text-anchor='middle' dominant-baseline='central' fill='%23374151' font-family='sans-serif' font-size='18'%3E▶ Loading%3C/text%3E%3C/svg%3E"
                      aria-label="Model generated video clip"
                      onLoadedMetadata={(e) => {
                        tryPlayWithRetry(e.currentTarget)
                      }}
                      onCanPlay={(e) => {
                        tryPlayWithRetry(e.currentTarget, 2)
                      }}
                    >
                      <source src={assetMp4('319.mp4')} type="video/mp4" />
                    </video>
                  </div>
                  <div className="mockup-prompt">
                    <div className="prompt-label">{t('mockup_video_prompt')}</div>
                    <div className="prompt-text">{t('mockup_video_text')}</div>
                    <div className="prompt-btn">{t('mockup_video_btn')}</div>
                  </div>
                  <div className="mockup-progress">
                    <div
                      className="progress-track"
                      role="progressbar"
                      aria-label={t('mockup_video_progress')}
                      aria-valuenow={78}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div className="progress-fill progress-fill--78" />
                    </div>
                    <span>{t('mockup_video_progress')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel-info">
              <h3>{t('video_title')}</h3>
              <p>{t('video_desc')}</p>
              <ul className="panel-features">
                {[1,2,3,4,5].map(i => (
                  <li key={i}><span className="check" aria-hidden="true">✓</span> <span>{t(`video_f${i}`)}</span></li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Drama Panel：上下結構（mockup 全寬在上、說明在下） */}
        {activeTab === 'drama' && (
          <div className="product-panel product-panel--stack active reveal" role="tabpanel">
            <div className="panel-visual">
              <div className="panel-mockup">
                <LightningStage type="drama" />
                <div className="mockup-header">
                  <div className="mockup-dots"><span /><span /><span /></div>
                  <span className="mockup-title">{t('mockup_drama_title')}</span>
                </div>
                <div className="mockup-body">
                  <div className="drama-studio-ui">
                    <div className="drama-studio-head">
                      <span className="drama-chip">{t('drama_mock_pipeline')}</span>
                      <span className="drama-chip drama-chip-live">{t('drama_mock_live')}</span>
                    </div>
                    <section className="drama-main-visual" aria-label={t('drama_mock_main_view')}>
                      <div className="drama-main-head">
                        <span className="drama-main-head-primary">{t('drama_mock_main_view')}</span>
                        <span className="drama-main-head-secondary">{t('drama_mock_continuous_hint')}</span>
                      </div>
                      <div className="drama-monitor-bezel">
                        <div className="drama-monitor-led" aria-hidden="true" />
                        <div className="drama-main-screen">
                          <video
                            key={dramaMonitorEp}
                            className="drama-main-video"
                            muted
                            playsInline
                            preload="metadata"
                            loop={false}
                            aria-label={`${t('drama_mock_main_view')} EP${dramaMonitorEp}`}
                            onEnded={() => setDramaMonitorEp((ep) => (ep >= 3 ? 1 : ep + 1))}
                            onLoadedMetadata={(e) => {
                              tryPlayWithRetry(e.currentTarget)
                            }}
                            onCanPlay={(e) => {
                              tryPlayWithRetry(e.currentTarget, 2)
                            }}
                            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230a0a1a'/%3E%3Cstop offset='.5' stop-color='%23111827'/%3E%3Cstop offset='1' stop-color='%230a0a1a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='640' height='360'%3E%3Ctext x='320' y='180' text-anchor='middle' dominant-baseline='central' fill='%23374151' font-family='sans-serif' font-size='18'%3E▶ Loading%3C/text%3E%3C/svg%3E"
                          >
                            <source src={assetMp4(`${318 + dramaMonitorEp}.mp4`)} type="video/mp4" />
                          </video>
                        </div>
                      </div>
                      <div
                        className="drama-main-queue"
                        role="group"
                        aria-label={t('drama_mock_queue_aria')}
                      >
                        {[1, 2, 3].map((ep) => (
                          <button
                            key={ep}
                            type="button"
                            className={`drama-queue-chip ${dramaMonitorEp === ep ? 'drama-queue-chip--on' : ''}`}
                            onClick={() => setDramaMonitorEp(ep)}
                          >
                            <span className="drama-queue-chip-ep">EP{ep}</span>
                            <span className="drama-queue-chip-status">
                              {dramaMonitorEp === ep ? t('drama_mock_on_air') : t('drama_mock_standby')}
                            </span>
                          </button>
                        ))}
                      </div>
                    </section>
                    <div className="drama-studio-main drama-studio-stack">
                      <div className="drama-episodes-grid">
                        {[1, 2, 3].map((ep) => (
                          <article className="drama-preview-card" key={ep}>
                            <div className="drama-preview-header">
                              <div className="drama-preview-title">
                                EP{ep} · <span>{t(`drama_scene${ep}`)}</span>
                              </div>
                              <div className="drama-preview-sub">{t('drama_mock_preview_desc')}</div>
                            </div>
                            <div className="drama-preview-media">
                              <video
                                className="drama-episode-video"
                                muted
                                loop
                                autoPlay
                                playsInline
                                preload="metadata"
                                aria-label={`Drama EP${ep} preview`}
                                onLoadedMetadata={(e) => {
                                  tryPlayWithRetry(e.currentTarget)
                                }}
                                onCanPlay={(e) => {
                                  tryPlayWithRetry(e.currentTarget, 2)
                                }}
                                poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230a0a1a'/%3E%3Cstop offset='.5' stop-color='%23111827'/%3E%3Cstop offset='1' stop-color='%230a0a1a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='640' height='360'%3E%3Ctext x='320' y='180' text-anchor='middle' dominant-baseline='central' fill='%23374151' font-family='sans-serif' font-size='18'%3E▶ Loading%3C/text%3E%3C/svg%3E"
                              >
                                <source src={assetMp4(`${318 + ep}.mp4`)} type="video/mp4" />
                              </video>
                            </div>
                            <div className="drama-preview-prompt">{t(`drama_scene${ep}_prompt`)}</div>
                          </article>
                        ))}
                      </div>
                      <aside className="drama-side-panel">
                        <div className="drama-consistency-box">
                          <h5>{t('drama_mock_consistency_title')}</h5>
                          <div className="drama-meter-row">
                            <span>{t('drama_mock_consistency_face')}</span>
                            <div className="drama-meter">
                              <span className="drama-meter-fill drama-meter-fill-92" />
                            </div>
                          </div>
                          <div className="drama-meter-row">
                            <span>{t('drama_mock_consistency_style')}</span>
                            <div className="drama-meter">
                              <span className="drama-meter-fill drama-meter-fill-88" />
                            </div>
                          </div>
                          <div className="drama-meter-row">
                            <span>{t('drama_mock_consistency_voice')}</span>
                            <div className="drama-meter">
                              <span className="drama-meter-fill drama-meter-fill-84" />
                            </div>
                          </div>
                        </div>
                        <div className="drama-episode-list">
                          <h5>{t('drama_mock_episode_title')}</h5>
                          {[1, 2, 3].map((ep) => (
                            <button
                              type="button"
                              className={`drama-episode-item ${dramaMonitorEp === ep ? 'active' : ''}`}
                              key={ep}
                              onClick={() => setDramaMonitorEp(ep)}
                            >
                              <span>EP{ep}</span>
                              <span>{t(`drama_scene${ep}`)}</span>
                            </button>
                          ))}
                        </div>
                      </aside>
                    </div>
                    <div className="drama-timeline">
                      <div className="drama-timeline-item">{t('drama_mock_timeline_script')}</div>
                      <div className="drama-timeline-item">{t('drama_mock_timeline_shot')}</div>
                      <div className="drama-timeline-item">{t('drama_mock_timeline_publish')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel-info">
              <h3>{t('drama_title')}</h3>
              <p>{t('drama_desc')}</p>
              <ul className="panel-features">
                {[1, 2, 3, 4, 5].map((i) => (
                  <li key={i}>
                    <span className="check" aria-hidden="true">
                      ✓
                    </span>{' '}
                    <span>{t(`drama_f${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Image Panel */}
        {activeTab === 'image' && (
          <div className="product-panel product-panel--stack active reveal" role="tabpanel">
            <div className="panel-visual">
              <div className="panel-mockup">
                <LightningStage type="image" />
                <div className="mockup-header">
                  <div className="mockup-dots"><span /><span /><span /></div>
                  <span className="mockup-title">{t('mockup_image_title')}</span>
                </div>
                <div className="mockup-body">
                  <div className="image-showcase">
                    <div className="image-showcase-head">
                      <div className="image-showcase-label">{t('mockup_image_label')}</div>
                      <div className="image-showcase-title">{t('mockup_image_heading')}</div>
                    </div>
                    <div className="image-example-list">
                      {[1, 2, 3, 4].map(i => (
                        <article className={`image-example-card image-example-card--${i}`} key={i}>
                          <div className="image-example-lightning" aria-hidden="true">
                            <span className="image-lightning-grid" />
                            <span className="image-lightning-orb image-lightning-orb--a" />
                            <span className="image-lightning-orb image-lightning-orb--b" />
                            <span className="image-lightning-bolt image-lightning-bolt--1" />
                            <span className="image-lightning-bolt image-lightning-bolt--2" />
                          </div>
                          <div className="image-example-info">
                            <span className="image-example-tag">{t(`mockup_image_clip${i}_tag`)}</span>
                            <span className="image-example-meta">{t(`mockup_image_clip${i}_meta`)}</span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel-info">
              <h3>{t('image_title')}</h3>
              <p>{t('image_desc')}</p>
              <ul className="panel-features">
                {[1,2,3,4,5].map(i => (
                  <li key={i}><span className="check" aria-hidden="true">✓</span> <span>{t(`image_f${i}`)}</span></li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Modules Section */}
        <div className="modules-split reveal">
          <div className="modules-split-head">
            <h3>{t('modules_split_title')}</h3>
            <p className="modules-split-intro">{t('modules_split_intro')}</p>
            <ul
              className="modules-split-cheatsheet"
              aria-label={t('modules_split_cheatsheet_aria')}
            >
              {MODULE_CHEATSHEET.map((row) => (
                <li key={row.id} className={`modules-split-cheat modules-split-cheat--${row.id}`}>
                  <span className="modules-split-cheat-name">{row.name}</span>
                  <span className="modules-split-cheat-text">{t(row.textKey)}</span>
                </li>
              ))}
            </ul>
            <p className="modules-split-hub">
              {t('modules_split_hub_before')}
              <Link
                className="modules-split-hub-link"
                to={{ pathname: PATHS.modules, search: langSearch }}
              >
                {t('nav_module_docs')}
              </Link>
              {t('modules_split_hub_after')}
            </p>
          </div>

          <div className="modules-card-grid">
            <article className="module-card module-card--forge reveal">
              <div className="module-card-header">
                <span className="module-card-badge module-card-badge--forge">KNOWLEDGE BASE</span>
                <span className="module-card-id">01</span>
              </div>
              <h4>SuperForge</h4>
              <p>{t('forge_desc')}</p>
              <div className="module-card-tags">
                <span className="tech-tag tech-tag--cyan">pgvector</span>
                <span className="tech-tag tech-tag--cyan">Prompt</span>
                <span className="tech-tag tech-tag--cyan">Full-text</span>
              </div>
              <a className="module-card-github" href="https://github.com/iiooiioo888/SuperForge" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                GitHub
              </a>
            </article>

            <article className="module-card module-card--tune reveal">
              <div className="module-card-header">
                <span className="module-card-badge module-card-badge--tune">OPTIMIZATION</span>
                <span className="module-card-id">02</span>
              </div>
              <h4>SuperTune</h4>
              <p>{t('tune_desc')}</p>
              <div className="module-card-tags">
                <span className="tech-tag tech-tag--violet">A/B</span>
                <span className="tech-tag tech-tag--violet">Batch</span>
                <span className="tech-tag tech-tag--violet">Cost</span>
              </div>
              <a className="module-card-github" href="https://github.com/iiooiioo888/SuperTune" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                GitHub
              </a>
            </article>

            <article className="module-card module-card--track reveal">
              <div className="module-card-header">
                <span className="module-card-badge module-card-badge--track">SIGNAL TRACKING</span>
                <span className="module-card-id">03</span>
              </div>
              <h4>SuperTrack</h4>
              <p>{t('track_desc')}</p>
              <div className="module-card-tags">
                <span className="tech-tag tech-tag--emerald">18 Platforms</span>
                <span className="tech-tag tech-tag--emerald">One-Click</span>
                <span className="tech-tag tech-tag--emerald">CLI</span>
              </div>
              <a className="module-card-github" href="https://github.com/iiooiioo888/SuperTrack" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                GitHub
              </a>
            </article>

            <article className="module-card reveal">
              <div className="module-card-header">
                <span className="module-card-badge module-card-badge--script">SCRIPT ENGINE</span>
                <span className="module-card-id">04</span>
              </div>
              <h4>SuperScript</h4>
              <p>{t('script_desc')}</p>
              <div className="module-card-tags">
                <span className="tech-tag tech-tag--amber">Multi-Agent</span>
                <span className="tech-tag tech-tag--amber">Branching</span>
                <span className="tech-tag tech-tag--amber">Consistency</span>
              </div>
              <a className="module-card-github" href="https://github.com/iiooiioo888/SuperScript" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                GitHub
              </a>
            </article>

            <article className="module-card reveal">
              <div className="module-card-header">
                <span className="module-card-badge" style={{background:'rgba(96,165,250,0.15)',color:'#60a5fa'}}>SOCIAL DATA</span>
                <span className="module-card-id">05</span>
              </div>
              <h4>SuperNova</h4>
              <p>企业级多平台社交数据采集系统 — B站/抖音/微博/IG/TG，插件化适配器、三层存储、动态降级与灰度发布。</p>
              <div className="module-card-tags">
                <span className="tech-tag" style={{color:'#60a5fa'}}>FastAPI</span>
                <span className="tech-tag" style={{color:'#60a5fa'}}>Celery</span>
                <span className="tech-tag" style={{color:'#60a5fa'}}>5 Platforms</span>
              </div>
              <a className="module-card-github" href="https://github.com/iiooiioo888/SuperNova" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                GitHub
              </a>
            </article>

            <article className="module-card reveal">
              <div className="module-card-header">
                <span className="module-card-badge" style={{background:'rgba(52,211,153,0.15)',color:'#34d399'}}>AI VISION</span>
                <span className="module-card-id">06</span>
              </div>
              <h4>SuperSight</h4>
              <p>本地 AI 記憶體代理 — 人臉識別、場景理解、RAG 語義檢索，為你構建「數字自傳」。</p>
              <div className="module-card-tags">
                <span className="tech-tag" style={{color:'#34d399'}}>Qwen3-VL</span>
                <span className="tech-tag" style={{color:'#34d399'}}>InsightFace</span>
                <span className="tech-tag" style={{color:'#34d399'}}>ChromaDB</span>
              </div>
              <a className="module-card-github" href="https://github.com/iiooiioo888/SuperSight" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                GitHub
              </a>
            </article>

            <article className="module-card reveal">
              <div className="module-card-header">
                <span className="module-card-badge" style={{background:'rgba(251,191,36,0.15)',color:'#fbbf24'}}>QUANT TRADING</span>
                <span className="module-card-id">07</span>
              </div>
              <h4>StocksX</h4>
              <p>機構級量化交易平台 — 130+ 種策略、10 大類、多市場回測、投資組合優化、AI 驅動即時監控。</p>
              <div className="module-card-tags">
                <span className="tech-tag" style={{color:'#fbbf24'}}>130+ Strategies</span>
                <span className="tech-tag" style={{color:'#fbbf24'}}>Streamlit</span>
                <span className="tech-tag" style={{color:'#fbbf24'}}>CCXT</span>
              </div>
              <a className="module-card-github" href="https://github.com/iiooiioo888/StocksX_V0" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                GitHub
              </a>
            </article>

            <article className="module-card reveal">
              <div className="module-card-header">
                <span className="module-card-badge" style={{background:'rgba(251,113,133,0.15)',color:'#fb7185'}}>A-SHARE QUANT</span>
                <span className="module-card-id">08</span>
              </div>
              <h4>Stock Quant</h4>
              <p>A股量化回測 + 實時盯盤預警 — 30+ 策略、ECharts 工作台、異步任務佇列、Optuna 貝葉斯優化。</p>
              <div className="module-card-tags">
                <span className="tech-tag" style={{color:'#fb7185'}}>Yahoo Finance</span>
                <span className="tech-tag" style={{color:'#fb7185'}}>FastAPI</span>
                <span className="tech-tag" style={{color:'#fb7185'}}>30+ Strategies</span>
              </div>
              <a className="module-card-github" href="https://github.com/iiooiioo888/stock-quant" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                GitHub
              </a>
            </article>
          </div>
        </div>


        <div className="product-cta reveal">
          <a href="#contact" className="btn btn-primary btn-lg">
            <span>{t('products_cta')}</span>
            <span className="ui-chevron-right" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}

function LightningStage({ type }: { type: string }) {
  const [colors] = useState(() => {
    const baseHues: Record<string, number> = { video: 198, drama: 314, image: 168 }
    const baseHue = baseHues[type] || 200
    const hsl = (h: number, s: number, l: number, a: number) =>
      `hsla(${h + (Math.random() - 0.5) * 28}, ${s}%, ${l}%, ${a})`
    return {
      '--lt-a': hsl(baseHue, 82, 58, 0.85),
      '--lt-b': hsl(baseHue + 38, 76, 66, 0.78),
      '--lt-c': hsl(baseHue + 5, 92, 76, 0.86),
    }
  })

  return (
    <div className="lightning-stage" aria-hidden="true" style={colors as React.CSSProperties}>
      <span className="lightning-grid" />
      <span className="lightning-orb lightning-orb--a" />
      <span className="lightning-orb lightning-orb--b" />
      <span className="lightning-bolt lightning-bolt--1" />
      <span className="lightning-bolt lightning-bolt--2" />
      <span className="lightning-bolt lightning-bolt--3" />
      <span className="lightning-pulse" />
    </div>
  )
}
