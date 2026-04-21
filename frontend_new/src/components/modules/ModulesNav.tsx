import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLangQuery } from '../../hooks/useLangQuery'
import { useNavBarCompact } from '../../hooks/useNavBarCompact'
import { PATHS } from '../../routes/paths'
import { LanguageSwitcher } from '../LanguageSwitcher'

type NavItem = {
  to: { pathname: string; search: string; hash?: string }
  labelKey:
    | 'nav_home'
    | 'nav_about'
    | 'nav_products'
    | 'nav_showcase'
    | 'nav_workflow'
    | 'nav_faq'
    | 'nav_module_docs'
    | 'nav_contact'
  active?: boolean
}

export function ModulesNav() {
  const { t } = useTranslation()
  const langSearch = useLangQuery()
  const { navInnerRef, compact } = useNavBarCompact('.nav-links')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!compact) setMenuOpen(false)
  }, [compact])

  const home = (hash: string) => ({
    pathname: PATHS.home,
    search: langSearch,
    hash,
  })

  const items: NavItem[] = [
    { to: home('#home'), labelKey: 'nav_home' },
    { to: home('#about'), labelKey: 'nav_about' },
    { to: home('#products'), labelKey: 'nav_products' },
    { to: home('#showcase'), labelKey: 'nav_showcase' },
    { to: home('#workflow'), labelKey: 'nav_workflow' },
    { to: { pathname: PATHS.faq, search: langSearch }, labelKey: 'nav_faq' },
    { to: { pathname: PATHS.modules, search: langSearch }, labelKey: 'nav_module_docs', active: true },
    { to: home('#contact'), labelKey: 'nav_contact' },
  ]

  return (
    <>
      <nav
        className={`nav ${scrolled ? 'scrolled' : ''} ${compact ? 'nav--compact' : ''}`}
        aria-label="Main navigation"
      >
        <div className="nav-inner" ref={navInnerRef}>
          <Link to={home('#home')} className="nav-logo" aria-label="Pysdn home">
            <span className="logo-mark" aria-hidden="true">⚡</span>
            <span className="logo-text">Pysdn</span>
          </Link>
          <ul className="nav-links">
            {items.map((item) => (
              <li key={item.labelKey}>
                <Link
                  to={item.to}
                  className={item.active ? 'active' : undefined}
                  aria-current={item.active ? 'page' : undefined}
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
          <LanguageSwitcher />
          <Link to={home('#contact')} className="nav-cta">
            {t('nav_cta')}
          </Link>
          <button
            type="button"
            className={`nav-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <ul>
          {items.map((item) => (
            <li key={item.labelKey}>
              <Link
                to={item.to}
                className={item.active ? 'active' : undefined}
                aria-current={item.active ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {t(item.labelKey)}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mobile-menu-lang">
          <LanguageSwitcher />
        </div>
        <Link to={home('#contact')} className="mobile-cta" onClick={() => setMenuOpen(false)}>
          {t('nav_cta')}
        </Link>
      </div>
    </>
  )
}
