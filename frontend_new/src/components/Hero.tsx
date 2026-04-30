import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLangQuery } from '../hooks/useLangQuery'
import { PATHS } from '../routes/paths'
import { prefetchSuperTrackPanel } from '../routes/routePrefetch'
import { withSearchParam } from '../routes/langQuery'
import {
  useTypingAnimation,
  useCountUp,
  useInView,
  DEFAULT_TYPING_TIERS,
  type TypingTierPhrase,
} from '../hooks/useAnimations'
import { scrollToHash } from '../utils/scrollToHash'
import { sanitizeHtml } from '../lib/sanitize'
import { prefersReducedMotion } from '../lib/motionPreference'

/**
 * 與 `ModelsSection` 匯總一致：精選目錄(10) + Bedrock(107) + OpenRouter(349)。
 * 此處硬編碼避免 Hero chunk 拉入 500KB+ JSON；模型數量異動時需同步更新。
 * @see data/modelsCatalog.ts, data/bedrockCatalog.ts, data/openRouterModelsSnapshot.json
 */
const HERO_MODELS_TOTAL = 466

/** 首頁數據條：隊列／並行為管線容量取向；可接入模型數隨目錄更新 */
const HERO_STATS = {
  modelQueue: 64,
  concurrentJobs: 16,
  availableModels: HERO_MODELS_TOTAL,
} as const

export function Hero() {
  const { t, i18n } = useTranslation()
  const langSearch = useLangQuery()
  /** 只跟語系變化；避免依賴 `t`／整個 `i18n` 參考導致 memo 失效、打字 effect 被反覆重置 */
  const typingTiers = useMemo((): TypingTierPhrase[][] => {
    const raw = i18n.t('hero_typing_tiers', { returnObjects: true }) as
      | Record<string, TypingTierPhrase[]>
      | string
    if (!raw || typeof raw === 'string') return DEFAULT_TYPING_TIERS
    const order = ['cute', 'cool', 'business'] as const
    const rows = order.map((k) => (Array.isArray(raw[k]) ? raw[k] : []))
    if (rows.some((tier) => !tier.length)) return DEFAULT_TYPING_TIERS
    return rows
  }, [i18n.language])
  const { textRef: typingTextRef, emojiRef: typingEmojiRef } = useTypingAnimation(typingTiers)
  const [lightningActive, setLightningActive] = useState(false)
  const [introFxInView, setIntroFxInView] = useState(true)
  const introRef = useRef<HTMLDivElement>(null)

  // Stats counters（與 HERO_STATS 對齊）
  // 觀察整個 hero-content 容器而非個別 stat-pill，確保統計數字在首屏載入時即啟動計數
  const heroContentRef = useRef<HTMLDivElement>(null)
  const [statsInView, setStatsInView] = useState(false)
  const countQueue = useCountUp(HERO_STATS.modelQueue, statsInView)
  const countConcurrent = useCountUp(HERO_STATS.concurrentJobs, statsInView)
  const countModels = useCountUp(HERO_STATS.availableModels, statsInView)

  useEffect(() => {
    const el = heroContentRef.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setStatsInView(true)
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStatsInView(true)
          obs.disconnect()
        }
      },
      { threshold: 0.05 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const el = introRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setIntroFxInView(e.isIntersecting), {
      threshold: 0,
      rootMargin: '0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Lightning effect on intro banner（減少動態效果／捲離 intro 時不排程）
  useEffect(() => {
    if (prefersReducedMotion() || !introFxInView) return

    let timer: ReturnType<typeof setTimeout>
    const queuePulse = () => {
      const delay = 1800 + Math.random() * 2600
      timer = setTimeout(() => {
        setLightningActive(true)
        setTimeout(() => setLightningActive(false), 220)
        if (Math.random() > 0.58) {
          setTimeout(() => {
            setLightningActive(true)
            setTimeout(() => setLightningActive(false), 140)
          }, 120)
        }
        queuePulse()
      }, delay)
    }
    queuePulse()
    return () => clearTimeout(timer)
  }, [introFxInView])

  return (
    <section id="home" className="hero">
      {/* Intro Banner */}
      <div
        ref={introRef}
        className={`hero-intro ${lightningActive ? 'lightning-active' : ''} ${introFxInView ? '' : 'hero-intro--at-rest'}`}
      >
        <div className="hero-intro-fx" aria-hidden="true">
          <span className="hero-intro-grid" />
          <span className="hero-intro-bolt hero-intro-bolt--1" />
          <span className="hero-intro-bolt hero-intro-bolt--2" />
          <span className="hero-intro-bolt hero-intro-bolt--3" />
          <span className="hero-intro-orb hero-intro-orb--1" />
          <span className="hero-intro-orb hero-intro-orb--2" />
        </div>
        <div className="intro-badge">
          <span className="badge-dot" aria-hidden="true" />
          <span>{t('hero_intro_label')}</span>
        </div>
        <h2 className="intro-headline">{t('hero_intro_headline')}</h2>
        <p className="intro-desc">{t('hero_intro_desc')}</p>
        <a
          href="#products"
          className="btn btn-ghost btn-sm"
          onClick={(e) => scrollToHash('#products', e)}
        >
          <span className="hero-intro-play-glyph" aria-hidden="true">
            ▶
          </span>
          <span>{t('hero_intro_cta')}</span>
        </a>
      </div>

      {/* Main Hero Content */}
      <div className="hero-content" ref={heroContentRef}>
        <h1 className="hero-title reveal">
          <span className="title-line">{t('hero_line1')}</span>
          <span className="title-line gradient-text typing-stack">
            <span className="typing-main-line">
              <span className="typing-text" ref={typingTextRef} />
              <span className="typing-cursor" aria-hidden="true">|</span>
            </span>
            <span className="typing-emoji-line" ref={typingEmojiRef} aria-hidden="true" />
          </span>
        </h1>
        <p className="hero-desc reveal" dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('hero_desc')) }} />
        <div className="hero-actions reveal">
          <a href="#products" className="btn btn-primary" onClick={(e) => scrollToHash('#products', e)}>
            <span>{t('hero_cta1')}</span>
            <span className="ui-chevron-right" aria-hidden="true" />
          </a>
          <a href="#showcase" className="btn btn-ghost" onClick={(e) => scrollToHash('#showcase', e)}>
            <span>{t('hero_cta2')}</span>
          </a>
        </div>
        <div className="hero-module-docs reveal" aria-label={t('hero_module_entry')}>
          <div className="hero-module-docs-label-wrap">
            <p className="hero-module-docs-label">{t('hero_module_entry')}</p>
          </div>
          <div className="hero-module-docs-panel">
            <div className="hero-module-docs-primary">
              <Link
                className="hero-module-card hero-module-card--modules"
                to={{ pathname: PATHS.modules, search: langSearch }}
              >
                <span className="hero-module-card-shine" aria-hidden="true" />
                <span className="hero-module-card-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Modules">
                    <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </span>
                <span className="hero-module-card-body">
                  <span className="hero-module-card-title">{t('hero_link_modules_overview')}</span>
                  <span className="hero-module-card-sub">{t('hero_module_card_modules_hint')}</span>
                </span>
                <span className="hero-module-card-arrow ui-chevron-right" aria-hidden="true" />
              </Link>
              <Link
                className="hero-module-card hero-module-card--models"
                to={{ pathname: PATHS.models, search: langSearch }}
              >
                <span className="hero-module-card-shine" aria-hidden="true" />
                <span className="hero-module-card-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Models">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </span>
                <span className="hero-module-card-body">
                  <span className="hero-module-card-title">{t('hero_link_models')}</span>
                  <span className="hero-module-card-sub">{t('hero_module_card_models_hint')}</span>
                </span>
                <span className="hero-module-card-arrow ui-chevron-right" aria-hidden="true" />
              </Link>
            </div>
            <div className="hero-module-docs-strips">
              <div className="hero-strip hero-strip--modules">
                <p className="hero-strip-label">{t('hero_strip_modules_label')}</p>
                <div className="hero-module-docs-docs" role="group" aria-label={t('hero_docs_strip_aria')}>
                  <Link className="hero-doc-pill hero-doc-pill--forge" to={{ pathname: PATHS.docs.superforge, search: langSearch }}>
                    <span className="hero-doc-pill-dot hero-doc-pill-dot--forge" aria-hidden="true" />
                    SuperForge
                  </Link>
                  <Link className="hero-doc-pill hero-doc-pill--script" to={{ pathname: PATHS.docs.superscript, search: langSearch }}>
                    <span className="hero-doc-pill-dot hero-doc-pill-dot--script" aria-hidden="true" />
                    SuperScript
                  </Link>
                  <Link className="hero-doc-pill hero-doc-pill--track" to={{ pathname: PATHS.docs.supertrack, search: langSearch }}>
                    <span className="hero-doc-pill-dot hero-doc-pill-dot--track" aria-hidden="true" />
                    SuperTrack
                  </Link>
                  <Link className="hero-doc-pill hero-doc-pill--tune" to={{ pathname: PATHS.docs.supertune, search: langSearch }}>
                    <span className="hero-doc-pill-dot hero-doc-pill-dot--tune" aria-hidden="true" />
                    SuperTune
                  </Link>
                </div>
                <div className="hero-doc-panel-row" role="group" aria-label={t('hero_supertrack_panel_aria')}>
                  <Link
                    className="hero-doc-pill hero-doc-pill--track hero-doc-pill--panel"
                    to={{ pathname: PATHS.panel.supertrack, search: langSearch }}
                    onMouseEnter={prefetchSuperTrackPanel}
                  >
                    <span className="hero-doc-pill-dot hero-doc-pill-dot--track" aria-hidden="true" />
                    {t('hero_link_supertrack_panel')}
                  </Link>
                </div>
              </div>
              <div className="hero-strip hero-strip--models">
                <p className="hero-strip-label">{t('hero_strip_models_label')}</p>
                <div className="hero-provider-grid" role="group" aria-label={t('hero_models_strip_aria')}>
                  <Link
                    className="hero-provider-card hero-provider-card--volcano"
                    to={{ pathname: PATHS.models, search: withSearchParam(langSearch, 'brand', 'volcano') }}
                  >
                    <span className="hero-provider-card-name">{t('models_filter_volcano_short')}</span>
                    <span className="hero-provider-card-models">{t('hero_volcano_flagship_models')}</span>
                  </Link>
                  <Link
                    className="hero-provider-card hero-provider-card--qwencloud"
                    to={{ pathname: PATHS.models, search: withSearchParam(langSearch, 'brand', 'qwencloud') }}
                  >
                    <span className="hero-provider-card-name">{t('models_dev_qwencloud')}</span>
                    <span className="hero-provider-card-models">{t('hero_qwencloud_models_short')}</span>
                  </Link>
                  <Link
                    className="hero-provider-card hero-provider-card--bedrock"
                    to={{ pathname: PATHS.models, search: withSearchParam(langSearch, 'brand', 'bedrock') }}
                  >
                    <span className="hero-provider-card-name">{t('models_dev_aws')}</span>
                    <span className="hero-provider-card-models">{t('hero_bedrock_flagship_models')}</span>
                  </Link>
                  <Link
                    className="hero-provider-card hero-provider-card--openrouter"
                    to={{ pathname: PATHS.models, search: withSearchParam(langSearch, 'brand', 'openrouter') }}
                  >
                    <span className="hero-provider-card-name">{t('models_dev_openrouter')}</span>
                    <span className="hero-provider-card-models">{t('hero_openrouter_flagship_models')}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-stats reveal">
          <div className="stat-pill">
            <div className="stat">
              <span className="stat-num">{countQueue}</span>
              <span className="stat-label">{t('stat_model_queue')}</span>
            </div>
          </div>
          <div className="stat-pill">
            <div className="stat">
              <span className="stat-num">{countConcurrent}</span>
              <span className="stat-suffix">+</span>
              <span className="stat-label">{t('stat_concurrent_jobs')}</span>
            </div>
          </div>
          <div className="stat-pill">
            <div className="stat">
              <span className="stat-num">{countModels}</span>
              <span className="stat-suffix">+</span>
              <span className="stat-label">{t('stat_models_available')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
