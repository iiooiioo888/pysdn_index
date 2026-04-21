import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { DocLang } from '../../hooks/useDocBundle'
import { useNavBarCompact } from '../../hooks/useNavBarCompact'
import { PATHS } from '../../routes/paths'
import { toLangSearch } from '../../routes/langQuery'
import { DocLangPills } from './DocLangPills'

export function DocNavbar({
  t,
  lang,
}: {
  t: (key: string) => string
  lang: DocLang
}) {
  const { t: tUi } = useTranslation()
  const langSearch = toLangSearch(lang)
  const modulesTo = { pathname: PATHS.modules, search: langSearch }
  const homeTo = { pathname: PATHS.home, search: langSearch }
  const { navInnerRef, compact } = useNavBarCompact('.doc-nav-links')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!compact) setMenuOpen(false)
  }, [compact])

  return (
    <>
      <nav
        className={`doc-nav ${compact ? 'doc-nav--compact' : ''}`}
        aria-label={tUi('nav_aria_main')}
      >
        <div className="doc-nav-inner" ref={navInnerRef}>
          <Link to={homeTo} className="doc-nav-logo">
            <span className="doc-logo-mark" aria-hidden="true">
              ⚡
            </span>
            <span className="doc-logo-text">Pysdn</span>
          </Link>
          <div className="doc-nav-links">
            <Link className="doc-nav-link" to={modulesTo}>
              {t('nav_modules')}
            </Link>
            <Link className="doc-nav-link" to={homeTo}>
              {t('nav_home')}
            </Link>
          </div>
          <div className="doc-nav-lang-inline">
            <DocLangPills lang={lang} />
          </div>
          <button
            type="button"
            className={`doc-nav-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div
        className={`doc-mobile-menu mobile-menu ${menuOpen ? 'open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <ul>
          <li>
            <Link className="doc-nav-link" to={modulesTo} onClick={() => setMenuOpen(false)}>
              {t('nav_modules')}
            </Link>
          </li>
          <li>
            <Link className="doc-nav-link" to={homeTo} onClick={() => setMenuOpen(false)}>
              {t('nav_home')}
            </Link>
          </li>
        </ul>
        <div className="mobile-menu-lang doc-mobile-menu-lang">
          <DocLangPills lang={lang} />
        </div>
      </div>
    </>
  )
}
