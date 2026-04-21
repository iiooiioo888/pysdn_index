import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLangQuery } from '../hooks/useLangQuery'
import { useNavBarCompact } from '../hooks/useNavBarCompact'
import { PATHS } from '../routes/paths'
import { scheduleScrollToHomeHash } from '../utils/scrollToHash'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Navbar() {
  const { t } = useTranslation()
  const location = useLocation()
  const langSearch = useLangQuery()
  const { navInnerRef, compact } = useNavBarCompact('.nav-links')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const onHomeHashClick = useCallback(
    (hash: string) => scheduleScrollToHomeHash(hash, location.pathname === PATHS.home),
    [location.pathname]
  )

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!compact) setMenuOpen(false)
  }, [compact])

  const links: (
    | { type: 'home'; hash: string; key: string }
    | { type: 'modules'; key: string }
    | { type: 'models'; key: string }
    | { type: 'faq'; key: string }
  )[] = [
    { type: 'home', hash: '#home', key: 'nav_home' },
    { type: 'home', hash: '#about', key: 'nav_about' },
    { type: 'home', hash: '#products', key: 'nav_products' },
    { type: 'models', key: 'nav_models' },
    { type: 'home', hash: '#showcase', key: 'nav_showcase' },
    { type: 'home', hash: '#workflow', key: 'nav_workflow' },
    { type: 'faq', key: 'nav_faq' },
    { type: 'modules', key: 'nav_module_docs' },
    { type: 'home', hash: '#contact', key: 'nav_contact' },
  ]

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
            onClick={() => onHomeHashClick('#home')}
          >
            <span className="logo-mark" aria-hidden="true">⚡</span>
            <span className="logo-text">Pysdn</span>
          </Link>
          <div className="nav-links">
            {links.map((link) =>
              link.type === 'modules' ? (
                <Link key={link.key} to={{ pathname: PATHS.modules, search: langSearch }}>
                  {t(link.key)}
                </Link>
              ) : link.type === 'models' ? (
                <Link key={link.key} to={{ pathname: PATHS.models, search: langSearch }}>
                  {t(link.key)}
                </Link>
              ) : link.type === 'faq' ? (
                <Link key={link.key} to={{ pathname: PATHS.faq, search: langSearch }}>
                  {t(link.key)}
                </Link>
              ) : (
                <Link
                  key={link.key}
                  to={{ pathname: PATHS.home, hash: link.hash, search: langSearch }}
                  onClick={() => onHomeHashClick(link.hash)}
                >
                  {t(link.key)}
                </Link>
              )
            )}
          </div>
          <LanguageSwitcher />
          <Link
            to={{ pathname: PATHS.home, hash: '#contact', search: langSearch }}
            className="nav-cta"
            onClick={() => onHomeHashClick('#contact')}
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
          {links.map((link) =>
            link.type === 'modules' ? (
              <Link
                key={link.key}
                to={{ pathname: PATHS.modules, search: langSearch }}
                onClick={() => setMenuOpen(false)}
              >
                {t(link.key)}
              </Link>
            ) : link.type === 'models' ? (
              <Link
                key={link.key}
                to={{ pathname: PATHS.models, search: langSearch }}
                onClick={() => setMenuOpen(false)}
              >
                {t(link.key)}
              </Link>
            ) : link.type === 'faq' ? (
              <Link
                key={link.key}
                to={{ pathname: PATHS.faq, search: langSearch }}
                onClick={() => setMenuOpen(false)}
              >
                {t(link.key)}
              </Link>
            ) : (
              <Link
                key={link.key}
                to={{ pathname: PATHS.home, hash: link.hash, search: langSearch }}
                onClick={() => {
                  onHomeHashClick(link.hash)
                  setMenuOpen(false)
                }}
              >
                {t(link.key)}
              </Link>
            )
          )}
        </div>
        <div className="mobile-menu-lang">
          <LanguageSwitcher />
        </div>
        <Link
          to={{ pathname: PATHS.home, hash: '#contact', search: langSearch }}
          className="mobile-cta"
          onClick={() => {
            onHomeHashClick('#contact')
            setMenuOpen(false)
          }}
        >
          {t('nav_cta')}
        </Link>
      </div>
    </>
  )
}
