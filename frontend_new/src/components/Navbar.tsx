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
    | { type: 'hash'; href: string; key: string }
    | { type: 'modules'; key: string }
  )[] = [
    { type: 'hash', href: '#home', key: 'nav_home' },
    { type: 'hash', href: '#about', key: 'nav_about' },
    { type: 'hash', href: '#products', key: 'nav_products' },
    { type: 'hash', href: '#showcase', key: 'nav_showcase' },
    { type: 'hash', href: '#workflow', key: 'nav_workflow' },
    { type: 'hash', href: '#faq', key: 'nav_faq' },
    { type: 'modules', key: 'nav_module_docs' },
    { type: 'hash', href: '#contact', key: 'nav_contact' },
  ]

  return (
    <>
      <nav
        className={`nav ${scrolled ? 'scrolled' : ''} ${compact ? 'nav--compact' : ''}`}
        aria-label="Main navigation"
      >
        <div className="nav-inner" ref={navInnerRef}>
          <a href="#home" className="nav-logo" aria-label="Pysdn home">
            <span className="logo-mark" aria-hidden="true">⚡</span>
            <span className="logo-text">Pysdn</span>
          </a>
          <ul className="nav-links">
            {links.map((link) => (
              <li key={link.key}>
                {link.type === 'modules' ? (
                  <Link to={{ pathname: PATHS.modules, search: langSearch }}>{t(link.key)}</Link>
                ) : (
                  <a href={link.href}>{t(link.key)}</a>
                )}
              </li>
            ))}
          </ul>
          <LanguageSwitcher />
          <a href="#contact" className="nav-cta">{t('nav_cta')}</a>
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
              ) : (
                <a href={link.href} onClick={() => setMenuOpen(false)}>
                  {t(link.key)}
                </a>
              )}
            </li>
          ))}
        </ul>
        <div className="mobile-menu-lang">
          <LanguageSwitcher />
        </div>
        <a href="#contact" className="mobile-cta" onClick={() => setMenuOpen(false)}>
          {t('nav_cta')}
        </a>
      </div>
    </>
  )
}
