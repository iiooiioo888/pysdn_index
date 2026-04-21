import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useReveal } from '../hooks/useAnimations'

export function Products() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('video')
  const observe = useReveal()
  const [needsGesture, setNeedsGesture] = useState(false)
  /** 短劇分頁：主畫面監看目前播放的集數（EP1→EP3 連續輪播，可點選切換） */
  const [dramaMonitorEp, setDramaMonitorEp] = useState(1)
  const [stats, setStats] = useState<{
    videosTotal?: number
    dramasTotal?: number
    imagesTotal?: number
  }>({})
  const [statsStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('ready')

  const tabs = useMemo(
    () => [
      { id: 'video', label: t('tab_video') },
      { id: 'drama', label: t('tab_drama') },
      { id: 'image', label: t('tab_image') },
    ],
    [t],
  )

  const assetMp4 = (filename: string) => `${import.meta.env.BASE_URL}assets/${filename}`

  // 靜態 demo：影片/短劇直接引用 public/assets 內的 mp4
  useEffect(() => {
    setStats({
      videosTotal: 3,
      dramasTotal: 2,
      imagesTotal: 15,
    })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      document
        .querySelectorAll('#products .reveal:not(.visible)')
        .forEach((el) => observe(el))
    }, 50)
    return () => clearTimeout(timer)
  }, [activeTab, observe])

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
    const timer = setTimeout(() => {
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
    return () => clearTimeout(timer)
  }, [activeTab])

  useEffect(() => {
    if (activeTab === 'drama') setDramaMonitorEp(1)
  }, [activeTab])

  return (
    <section id="products" className="section products">
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
              </ul>
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
                </div>
              </div>
            </aside>
          </div>

          <div className="products-intro-stats" role="status" aria-live="polite">
            <div className="quickstat">
              <span className="quickstat-label">{t('tab_video')}</span>
              <span className="quickstat-val">{statsStatus === 'loading' ? '…' : (stats.videosTotal ?? '—')}</span>
            </div>
            <div className="quickstat">
              <span className="quickstat-label">{t('tab_drama')}</span>
              <span className="quickstat-val">{statsStatus === 'loading' ? '…' : (stats.dramasTotal ?? '—')}</span>
            </div>
            <div className="quickstat">
              <span className="quickstat-label">{t('tab_image')}</span>
              <span className="quickstat-val">{statsStatus === 'loading' ? '…' : (stats.imagesTotal ?? '—')}</span>
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
              aria-selected={activeTab === tab.id ? 'true' : 'false'}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Video Panel */}
        {activeTab === 'video' && (
          <div className="product-panel active reveal" role="tabpanel">
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
                        aria-label="Click to start playback"
                      >
                        點一下啟動播放
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
                    <div className="progress-track" role="progressbar" aria-valuenow={78} aria-valuemin={0} aria-valuemax={100}>
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
          <div className="product-panel product-panel--drama active reveal" role="tabpanel">
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
          <div className="product-panel active reveal" role="tabpanel">
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
            <p>{t('modules_split_desc')}</p>
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
            </article>

            <article className="module-card module-card--track reveal">
              <div className="module-card-header">
                <span className="module-card-badge module-card-badge--track">SIGNAL TRACKING</span>
                <span className="module-card-id">03</span>
              </div>
              <h4>SuperTrack</h4>
              <p>{t('track_desc')}</p>
              <div className="module-card-tags">
                <span className="tech-tag tech-tag--emerald">Crawl</span>
                <span className="tech-tag tech-tag--emerald">Time-series</span>
                <span className="tech-tag tech-tag--emerald">AlertEngine</span>
              </div>
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
            </article>
          </div>
        </div>


        <div className="product-cta reveal">
          <a href="#contact" className="btn btn-primary btn-lg">
            <span>{t('products_cta')}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

function LightningStage({ type }: { type: string }) {
  const colors = useMemo(() => {
    const baseHues: Record<string, number> = { video: 198, drama: 314, image: 168 }
    const baseHue = baseHues[type] || 200
    const hsl = (h: number, s: number, l: number, a: number) =>
      `hsla(${h + (Math.random() - 0.5) * 28}, ${s}%, ${l}%, ${a})`
    return {
      '--lt-a': hsl(baseHue, 82, 58, 0.85),
      '--lt-b': hsl(baseHue + 38, 76, 66, 0.78),
      '--lt-c': hsl(baseHue + 5, 92, 76, 0.86),
    }
  }, [type])

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
