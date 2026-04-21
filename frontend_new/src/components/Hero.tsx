import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLangQuery } from '../hooks/useLangQuery'
import { PATHS } from '../routes/paths'
import {
  useTypingAnimation,
  useCountUp,
  useInView,
  DEFAULT_TYPING_TIERS,
  type TypingTierPhrase,
} from '../hooks/useAnimations'
import { scrollToHash } from '../utils/scrollToHash'

export function Hero() {
  const { t, i18n } = useTranslation()
  const langSearch = useLangQuery()
  const typingTiers = useMemo((): TypingTierPhrase[][] => {
    const raw = i18n.t('hero_typing_tiers', { returnObjects: true }) as
      | Record<string, TypingTierPhrase[]>
      | string
    if (!raw || typeof raw === 'string') return DEFAULT_TYPING_TIERS
    const order = ['cute', 'cool', 'business'] as const
    const rows = order.map((k) => (Array.isArray(raw[k]) ? raw[k] : []))
    if (rows.some((tier) => !tier.length)) return DEFAULT_TYPING_TIERS
    return rows
  }, [i18n, i18n.language])
  const { displayText, emoji } = useTypingAnimation(typingTiers)
  const [lightningActive, setLightningActive] = useState(false)
  const introRef = useRef<HTMLDivElement>(null)

  // Stats counters
  const stats99 = useInView();
  const stats50 = useInView();
  const stats200 = useInView();
  const count99 = useCountUp(99, stats99.inView);
  const count50 = useCountUp(50, stats50.inView);
  const count200 = useCountUp(200, stats200.inView);

  // Lightning effect on intro banner
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const queuePulse = () => {
      const delay = 1800 + Math.random() * 2600;
      timer = setTimeout(() => {
        setLightningActive(true);
        setTimeout(() => setLightningActive(false), 220);
        if (Math.random() > 0.58) {
          setTimeout(() => {
            setLightningActive(true);
            setTimeout(() => setLightningActive(false), 140);
          }, 120);
        }
        queuePulse();
      }, delay);
    };
    queuePulse();
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="home" className="hero">
      {/* Intro Banner */}
      <div ref={introRef} className={`hero-intro ${lightningActive ? 'lightning-active' : ''}`}>
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <span>{t('hero_intro_cta')}</span>
        </a>
      </div>

      {/* Main Hero Content */}
      <div className="hero-content">
        <h1 className="hero-title reveal">
          <span className="title-line">{t('hero_line1')}</span>
          <span className="title-line gradient-text typing-stack">
            <span className="typing-main-line">
              <span className="typing-text">{displayText}</span>
              <span className="typing-cursor" aria-hidden="true">|</span>
            </span>
            <span className="typing-emoji-line" aria-hidden="true">{emoji}</span>
          </span>
        </h1>
        <p className="hero-desc reveal" dangerouslySetInnerHTML={{ __html: t('hero_desc') }} />
        <div className="hero-actions reveal">
          <a href="#products" className="btn btn-primary" onClick={(e) => scrollToHash('#products', e)}>
            <span>{t('hero_cta1')}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#showcase" className="btn btn-ghost" onClick={(e) => scrollToHash('#showcase', e)}>
            <span>{t('hero_cta2')}</span>
          </a>
        </div>
        <div className="hero-module-docs reveal" aria-label={t('hero_module_entry')}>
          <p className="hero-module-docs-label">{t('hero_module_entry')}</p>
          <div className="hero-module-docs-links">
            <Link className="hero-doc-pill hero-doc-pill--neutral" to={{ pathname: PATHS.modules, search: langSearch }}>
              {t('hero_link_modules_overview')}
            </Link>
            <Link className="hero-doc-pill hero-doc-pill--forge" to={{ pathname: PATHS.docs.superforge, search: langSearch }}>
              SuperForge
            </Link>
            <Link className="hero-doc-pill hero-doc-pill--script" to={{ pathname: PATHS.docs.superscript, search: langSearch }}>
              SuperScript
            </Link>
            <Link className="hero-doc-pill hero-doc-pill--track" to={{ pathname: PATHS.docs.supertrack, search: langSearch }}>
              SuperTrack
            </Link>
            <Link className="hero-doc-pill hero-doc-pill--tune" to={{ pathname: PATHS.docs.supertune, search: langSearch }}>
              SuperTune
            </Link>
          </div>
        </div>
        <div className="hero-stats reveal">
          <div className="stat-pill" ref={stats99.ref}>
            <div className="stat">
              <span className="stat-num">{count99}</span>
              <span className="stat-suffix">%</span>
              <span className="stat-label">{t('stat_accuracy')}</span>
            </div>
          </div>
          <div className="stat-pill" ref={stats50.ref}>
            <div className="stat">
              <span className="stat-num">{count50}</span>
              <span className="stat-suffix">K+</span>
              <span className="stat-label">{t('stat_daily')}</span>
            </div>
          </div>
          <div className="stat-pill" ref={stats200.ref}>
            <div className="stat">
              <span className="stat-num">{count200}</span>
              <span className="stat-suffix">+</span>
              <span className="stat-label">{t('stat_partners')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero-scroll" aria-hidden="true">
        <div className="scroll-indicator">
          <div className="scroll-dot" />
        </div>
        <span>SCROLL</span>
      </div>
    </section>
  )
}
