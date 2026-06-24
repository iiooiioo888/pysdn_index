import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { DocLang } from '../../hooks/useDocBundle'
import { useNavBarCompact } from '../../hooks/useNavBarCompact'
import { PATHS } from '../../routes/paths'
import { prefetchDocRoute, prefetchLabRoute } from '../../routes/routePrefetch'
import { toLangSearch } from '../../routes/langQuery'
import { DocLangPills } from './DocLangPills'

export type DocNavbarModule = 'superforge' | 'superscript' | 'supertrack' | 'supertune' | 'supernova' | 'supersight' | 'stocksx' | 'stockquant'

const MOD_ORDER: readonly DocNavbarModule[] = [
  'superforge',
  'superscript',
  'supertrack',
  'supertune',
  'supernova',
  'supersight',
  'stocksx',
  'stockquant',
] as const

const MOD_I18N: Record<DocNavbarModule, string> = {
  superforge: 'doc_nav_mod_superforge',
  superscript: 'doc_nav_mod_superscript',
  supertrack: 'doc_nav_mod_supertrack',
  supertune: 'doc_nav_mod_supertune',
  supernova: 'doc_nav_mod_supernova',
  supersight: 'doc_nav_mod_supersight',
  stocksx: 'doc_nav_mod_stocksx',
  stockquant: 'doc_nav_mod_stockquant',
}

const pathForMod = (mod: DocNavbarModule, mode: 'docs' | 'labs') =>
  (mode === 'docs' ? PATHS.docs[mod] : PATHS.labs[mod]) as string

export function DocNavbar({
  t,
  lang,
  moduleNav,
}: {
  t: (key: string) => string
  lang: DocLang
  /** 本頁所屬模組與連結目標：文件互跳或實驗室儀表板互跳 */
  moduleNav: { mode: 'docs' | 'labs'; current: DocNavbarModule }
}) {
  const { t: tUi } = useTranslation()
  const langSearch = toLangSearch(lang)
  const modulesTo = { pathname: PATHS.modules, search: langSearch }
  const homeTo = { pathname: PATHS.home, search: langSearch }
  const { navInnerRef, compact } = useNavBarCompact('.doc-nav-cluster')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
          <div className="doc-nav-cluster" role="group" aria-label={tUi('doc_nav_mods_aria')}>
            <div className="doc-nav-mods">
              {MOD_ORDER.map((mod) => {
                const to = { pathname: pathForMod(mod, moduleNav.mode), search: langSearch }
                const active = mod === moduleNav.current
                return (
                  <Link
                    key={mod}
                    className={active ? 'doc-nav-link doc-nav-link--active' : 'doc-nav-link'}
                    to={to}
                    aria-current={active ? 'page' : undefined}
                    title={tUi(MOD_I18N[mod])}
                    onMouseEnter={() =>
                      moduleNav.mode === 'docs' ? prefetchDocRoute(mod) : prefetchLabRoute(mod)
                    }
                  >
                    {tUi(MOD_I18N[mod])}
                  </Link>
                )
              })}
            </div>
            <div className="doc-nav-links">
              <Link className="doc-nav-link" to={modulesTo}>
                {t('nav_modules')}
              </Link>
              <Link className="doc-nav-link" to={homeTo}>
                {t('nav_home')}
              </Link>
            </div>
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
          {MOD_ORDER.map((mod) => {
            const to = { pathname: pathForMod(mod, moduleNav.mode), search: langSearch }
            const active = mod === moduleNav.current
            return (
              <li key={mod}>
                <Link
                  className={active ? 'doc-nav-link doc-nav-link--active' : 'doc-nav-link'}
                  to={to}
                  onMouseEnter={() =>
                    moduleNav.mode === 'docs' ? prefetchDocRoute(mod) : prefetchLabRoute(mod)
                  }
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? 'page' : undefined}
                >
                  {tUi(MOD_I18N[mod])}
                </Link>
              </li>
            )
          })}
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
