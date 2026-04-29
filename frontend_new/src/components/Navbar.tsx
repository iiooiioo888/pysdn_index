import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLangQuery } from '../hooks/useLangQuery'
import { useNavBarCompact } from '../hooks/useNavBarCompact'
import { PATHS } from '../routes/paths'
import { LanguageSwitcher } from './LanguageSwitcher'

/**
 * 導航連結定義
 * - `homeHash`: 首頁區塊錨點（從任何頁面都能跳回首頁對應區塊）
 * - `path`: 獨立路由頁面
 */
type NavLinkDef =
  | { type: 'homeHash'; hash: string; i18nKey: string }
  | { type: 'route'; path: string; i18nKey: string }

const NAV_LINKS: NavLinkDef[] = [
  { type: 'homeHash', hash: '#home', i18nKey: 'nav_home' },
  { type: 'homeHash', hash: '#products', i18nKey: 'nav_products' },
  { type: 'route', path: PATHS.models, i18nKey: 'nav_models' },
  { type: 'route', path: PATHS.modules, i18nKey: 'nav_module_docs' },
  { type: 'route', path: PATHS.faq, i18nKey: 'nav_faq' },
]

export function Navbar() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const langSearch = useLangQuery()
  const { navInnerRef, compact } = useNavBarCompact('.nav-links')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  /** 跳回首頁指定區塊：已在首頁就直接捲動，不在首頁就先導航再捲動 */
  const goHomeSection = useCallback(
    (hash: string) => {
      const isHome = location.pathname === PATHS.home
      if (isHome) {
        // 已在首頁：直接捲動
        const id = hash.slice(1)
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          window.history.replaceState(null, '', `${location.pathname}${location.search}${hash}`)
        }
      } else {
        // 不在首頁：導航到首頁錨點，useHomeHashScroll 會處理捲動
        navigate({ pathname: PATHS.home, hash, search: langSearch })
      }
    },
    [location.pathname, location.search, navigate, langSearch],
  )

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!compact) setMenuOpen(false)
  }, [compact])

  /** 渲染單個導航連結 */
  const renderLink = (def: NavLinkDef, key: string, onClick?: () => void) => {
    const label = t(def.i18nKey)
    if (def.type === 'homeHash') {
      return (
        <Link
          key={key}
          to={{ pathname: PATHS.home, hash: def.hash, search: langSearch }}
          onClick={() => {
            goHomeSection(def.hash)
            onClick?.()
          }}
        >
          {label}
        </Link>
      )
    }
    return (
      <Link
        key={key}
        to={{ pathname: def.path, search: langSearch }}
        onClick={onClick}
      >
        {label}
      </Link>
    )
  }

  return (
    <>
      <nav
        className={`nav ${scrolled ? 'scrolled' : ''} ${compact ? 'nav--compact' : ''}`}
        aria-label="Main navigation"
      >
        <div className="nav-inner" ref={navInnerRef}>
          <Link
            to={{ pathname: PATHS.home, hash: '#home', search: langSearch }}
            className="nav-logo"
            aria-label="Pysdn home"
            onClick={() => goHomeSection('#home')}
          >
            <span className="logo-mark" aria-hidden="true">⚡</span>
            <span className="logo-text">Pysdn</span>
          </Link>

          <div className="nav-links">
            {NAV_LINKS.map((def) => renderLink(def, def.i18nKey))}
          </div>

          <LanguageSwitcher />

          <Link
            to={{ pathname: PATHS.home, hash: '#contact', search: langSearch }}
            className="nav-cta"
            onClick={() => goHomeSection('#contact')}
          >
            {t('nav_cta')}
          </Link>

          <button
            className={`nav-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-links">
          {NAV_LINKS.map((def) =>
            renderLink(def, `m-${def.i18nKey}`, () => setMenuOpen(false)),
          )}
        </div>
        <div className="mobile-menu-lang">
          <LanguageSwitcher />
        </div>
        <Link
          to={{ pathname: PATHS.home, hash: '#contact', search: langSearch }}
          className="mobile-cta"
          onClick={() => {
            goHomeSection('#contact')
            setMenuOpen(false)
          }}
        >
          {t('nav_cta')}
        </Link>
      </div>
    </>
  )
}
