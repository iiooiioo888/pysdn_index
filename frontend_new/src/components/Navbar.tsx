import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLangQuery } from '../hooks/useLangQuery'
import { useNavBarCompact } from '../hooks/useNavBarCompact'
import { PATHS } from '../routes/paths'
import { LanguageSwitcher } from './LanguageSwitcher'

type NavLinkDef =
  | { type: 'homeHash'; hash: string; i18nKey: string }
  | { type: 'route'; path: string; i18nKey: string }

const NAV_LINKS: NavLinkDef[] = [
  { type: 'homeHash', hash: '#products', i18nKey: 'nav_products' },
  { type: 'route', path: PATHS.models, i18nKey: 'nav_models' },
  { type: 'route', path: PATHS.backup, i18nKey: 'nav_backup' },
  { type: 'route', path: PATHS.modules, i18nKey: 'nav_module_docs' },
  { type: 'route', path: PATHS.faq, i18nKey: 'nav_faq' },
  { type: 'route', path: PATHS.realms, i18nKey: 'nav_realms' },
]

export function Navbar() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const langSearch = useLangQuery()
  const { navInnerRef, compact } = useNavBarCompact('.nav-links')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const goHomeSection = useCallback(
    (hash: string) => {
      const isHome = location.pathname === PATHS.home
      if (isHome) {
        const id = hash.slice(1)
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          window.history.replaceState(null, '', `${location.pathname}${location.search}${hash}`)
        }
      } else {
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

  const renderLink = (def: NavLinkDef, key: string, onClick?: () => void) => {
    const label = t(def.i18nKey)
    const baseClass = 'px-3.5 py-[7px] text-ui font-medium text-text-dim rounded-full border border-transparent transition-colors duration-200 hover:text-white hover:bg-white/5 hover:border-white/[0.08]'
    if (def.type === 'homeHash') {
      return (
        <Link
          key={key}
          to={{ pathname: PATHS.home, hash: def.hash, search: langSearch }}
          className={baseClass}
          onClick={() => { goHomeSection(def.hash); onClick?.() }}
        >
          {label}
        </Link>
      )
    }
    return (
      <Link
        key={key}
        to={{ pathname: def.path, search: langSearch }}
        className={baseClass}
        onClick={onClick}
      >
        {label}
      </Link>
    )
  }

  return (
    <>
      <nav
        className={[
          'fixed top-0 left-0 right-0 z-[120] pt-[var(--nav-safe-top)] pl-[var(--nav-safe-left)] pr-[var(--nav-safe-right)]',
          'border-b border-white/5 transition-all duration-200',
          'bg-gradient-to-b from-[rgba(6,6,10,0.78)] via-[rgba(6,6,10,0.42)] to-[rgba(6,6,10,0.12)]',
          'glass-blur shadow-[0_1px_0_rgba(255,255,255,0.04)]',
          scrolled && 'bg-[rgba(6,6,10,0.88)] glass-blur-strong border-b-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.28)]',
          compact && 'nav--compact',
        ].filter(Boolean).join(' ')}
        aria-label="Main navigation"
      >
        <div
          ref={navInnerRef}
          className="w-full mx-auto flex items-center min-h-[var(--nav-row-min-h)] gap-4 flex-nowrap overflow-visible box-border pl-[max(var(--layout-pad-x),env(safe-area-inset-left,0px))] pr-[max(var(--layout-pad-x),env(safe-area-inset-right,0px))]"
        >
          <Link
            to={{ pathname: PATHS.home, hash: '#home', search: langSearch }}
            className="flex items-center gap-2.5 font-bold text-[1.3rem] tracking-tight whitespace-nowrap shrink-0"
            aria-label="Pysdn home"
            onClick={() => goHomeSection('#home')}
          >
            <span className="logo-mark text-[1.5rem] leading-none inline-block align-middle drop-shadow-[0_0_10px_rgba(6,182,212,0.36)]" aria-hidden="true">⚡</span>
            <span className="bg-gradient-to-br from-primary-500 to-accent-500 bg-clip-text text-transparent brightness-115">Pysdn</span>
          </Link>

          <div className="nav-links flex flex-nowrap gap-1 ml-auto flex-1 min-w-0 overflow-x-auto scrollbar-hide">
            {NAV_LINKS.map((def) => renderLink(def, def.i18nKey))}
          </div>

          <LanguageSwitcher />

          <Link
            to={{ pathname: PATHS.home, hash: '#contact', search: langSearch }}
            className="inline-flex items-center px-5 py-[9px] text-ui font-semibold text-white bg-gradient-to-br from-primary-600 to-accent-600 rounded-full whitespace-nowrap shadow-[0_4px_20px_rgba(6,182,212,0.2)] hover:-translate-y-px hover:shadow-[0_6px_28px_rgba(6,182,212,0.28)] transition-all duration-200"
            onClick={() => goHomeSection('#contact')}
          >
            {t('nav_cta')}
          </Link>

          <button
            className={`nav-toggle hidden flex-col gap-[5px] p-1 ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="block w-[22px] h-[2px] bg-text rounded-sm transition-all duration-200" />
            <span className="block w-[22px] h-[2px] bg-text rounded-sm transition-all duration-200" />
            <span className="block w-[22px] h-[2px] bg-text rounded-sm transition-all duration-200" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={[
          'fixed inset-0 z-[110] flex flex-col items-center justify-start gap-5 overflow-y-auto',
          'pt-[calc(var(--nav-safe-top)+var(--nav-row-min-h)+12px)]',
          'pl-[var(--nav-safe-left)] pr-[var(--nav-safe-right)] pb-[max(24px,env(safe-area-inset-bottom,0px))]',
          'bg-[rgba(10,10,15,0.98)] glass-blur-strong',
          'transition-all duration-200',
          menuOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none',
        ].join(' ')}
        aria-hidden={!menuOpen}
      >
        <div className="flex flex-col items-center gap-4 w-full max-w-[360px] px-5">
          {NAV_LINKS.map((def) =>
            renderLink(def, `m-${def.i18nKey}`, () => setMenuOpen(false)),
          )}
        </div>
        <div className="flex justify-center w-full px-6">
          <LanguageSwitcher />
        </div>
        <Link
          to={{ pathname: PATHS.home, hash: '#contact', search: langSearch }}
          className="mt-4 px-8 py-3 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full font-semibold shadow-[0_4px_24px_rgba(6,182,212,0.22)]"
          onClick={() => { goHomeSection('#contact'); setMenuOpen(false) }}
        >
          {t('nav_cta')}
        </Link>
      </div>
    </>
  )
}
