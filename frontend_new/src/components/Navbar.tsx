import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLangQuery } from '../hooks/useLangQuery'
import { useNavBarCompact } from '../hooks/useNavBarCompact'
import { PATHS } from '../routes/paths'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Navbar() {
  const { t } = useTranslation()
  const langSearch = useLangQuery()
  const { navInnerRef, compact } = useNavBarCompact('.nav-links')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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
          >
            <span className="logo-mark" aria-hidden="true">⚡</span>
            <span className="logo-text">Pysdn</span>
          </Link>
          <ul className="nav-links">
            {links.map((link) => (
              <li key={link.key}>
                {link.type === 'modules' ? (
                  <Link to={{ pathname: PATHS.modules, search: langSearch }}>{t(link.key)}</Link>
                ) : link.type === 'models' ? (
                  <Link to={{ pathname: PATHS.models, search: langSearch }}>{t(link.key)}</Link>
                ) : link.type === 'faq' ? (
                  <Link to={{ pathname: PATHS.faq, search: langSearch }}>{t(link.key)}</Link>
                ) : (
                  <Link to={{ pathname: PATHS.home, hash: link.hash, search: langSearch }}>{t(link.key)}</Link>
                )}
              </li>
            ))}
          </ul>
          <LanguageSwitcher />
          <Link to={{ pathname: PATHS.home, hash: '#contact', search: langSearch }} className="nav-cta">
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
        <ul>
          {links.map((link) => (
            <li key={link.key}>
              {link.type === 'modules' ? (
                <Link to={{ pathname: PATHS.modules, search: langSearch }} onClick={() => setMenuOpen(false)}>
                  {t(link.key)}
                </Link>
              ) : link.type === 'models' ? (
                <Link to={{ pathname: PATHS.models, search: langSearch }} onClick={() => setMenuOpen(false)}>
                  {t(link.key)}
                </Link>
              ) : link.type === 'faq' ? (
                <Link to={{ pathname: PATHS.faq, search: langSearch }} onClick={() => setMenuOpen(false)}>
                  {t(link.key)}
                </Link>
              ) : (
                <Link
                  to={{ pathname: PATHS.home, hash: link.hash, search: langSearch }}
                  onClick={() => setMenuOpen(false)}
                >
                  {t(link.key)}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className="mobile-menu-lang">
          <LanguageSwitcher />
        </div>
        <Link
          to={{ pathname: PATHS.home, hash: '#contact', search: langSearch }}
          className="mobile-cta"
          onClick={() => setMenuOpen(false)}
        >
          {t('nav_cta')}
        </Link>
      </div>
    </>
  )
}
