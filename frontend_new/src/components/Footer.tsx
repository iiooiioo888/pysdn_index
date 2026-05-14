import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLangQuery } from '../hooks/useLangQuery'
import { PATHS } from '../routes/paths'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Footer() {
  const { t } = useTranslation()
  const langSearch = useLangQuery()

  return (
    <footer className="relative pt-[72px] pb-9 border-t border-white/[0.06] bg-gradient-to-b from-[rgba(6,8,14,0.9)] to-dark-950 overflow-hidden">
      {/* Decorative backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(900px,100%)] h-[220px] bg-[radial-gradient(ellipse,rgba(6,182,212,0.09),transparent_65%)] pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 opacity-35 bg-grid-fine bg-grid-48 pointer-events-none [mask-image:linear-gradient(180deg,rgba(0,0,0,0.5),transparent_70%)]" aria-hidden="true" />

      <div className="container">
        {/* Top: brand + nav */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(200px,1fr)_minmax(280px,1.4fr)] gap-8 sm:gap-14 mb-11 items-start">
          <div className="max-w-[340px]">
            <Link
              to={{ pathname: PATHS.home, hash: '#home', search: langSearch }}
              className="flex items-center gap-2.5 font-bold text-[1.3rem] tracking-tight"
              aria-label="Pysdn home"
            >
              <span className="logo-mark text-[1.5rem] leading-none inline-block align-middle drop-shadow-[0_0_10px_rgba(6,182,212,0.36)]" aria-hidden="true">⚡</span>
              <span className="bg-gradient-to-br from-primary-500 to-accent-500 bg-clip-text text-transparent brightness-115">Pysdn</span>
            </Link>
            <p className="mt-3.5 text-[clamp(0.9rem,0.3vw+0.85rem,0.98rem)] text-text-muted leading-[1.65]">
              {t('footer_tagline')}
            </p>
          </div>

          <div className="flex flex-col gap-7 items-end text-right max-lg:items-start max-lg:text-left">
            <nav className="flex flex-wrap gap-2 sm:gap-3 justify-end max-lg:justify-start" aria-label="Footer navigation">
              {[
                { hash: '#home', key: 'nav_home' },
                { hash: '#about', key: 'nav_about' },
                { hash: '#products', key: 'nav_products' },
                { hash: '#showcase', key: 'nav_showcase' },
                { hash: '#workflow', key: 'nav_workflow' },
              ].map((l) => (
                <Link
                  key={l.key}
                  to={{ pathname: PATHS.home, hash: l.hash, search: langSearch }}
                  className="px-3 py-1.5 text-ui font-medium text-text-muted rounded-full border border-transparent hover:text-white hover:border-white/10 hover:bg-white/[0.04] transition-colors duration-200"
                >
                  {t(l.key)}
                </Link>
              ))}
              <Link to={{ pathname: PATHS.faq, search: langSearch }} className="px-3 py-1.5 text-ui font-medium text-text-muted rounded-full border border-transparent hover:text-white hover:border-white/10 hover:bg-white/[0.04] transition-colors duration-200">{t('nav_faq')}</Link>
              <Link to={{ pathname: PATHS.realms, search: langSearch }} className="px-3 py-1.5 text-ui font-medium text-text-muted rounded-full border border-transparent hover:text-white hover:border-white/10 hover:bg-white/[0.04] transition-colors duration-200">{t('nav_realms')}</Link>
              <Link to={{ pathname: PATHS.home, hash: '#contact', search: langSearch }} className="px-3 py-1.5 text-ui font-medium text-text-muted rounded-full border border-transparent hover:text-white hover:border-white/10 hover:bg-white/[0.04] transition-colors duration-200">{t('nav_contact')}</Link>
            </nav>
            <nav className="flex flex-col items-end gap-2.5 max-lg:items-start" aria-label="Modules and documentation">
              <span className="font-mono text-meta font-semibold tracking-[0.14em] uppercase text-text-muted">
                {t('hero_module_entry')}
              </span>
              <div className="flex flex-wrap gap-2 justify-end max-lg:justify-start">
                <Link to={{ pathname: PATHS.modules, search: langSearch }} className="px-3 py-1.5 text-ui font-semibold text-primary-300 border border-primary-500/[0.22] bg-primary-500/[0.06] rounded-full hover:text-white hover:border-primary-500/45 hover:bg-primary-500/[0.12] transition-colors duration-200">
                  {t('hero_link_modules_overview')}
                </Link>
                {(['superforge', 'superscript', 'supertrack', 'supertune'] as const).map((m) => (
                  <Link key={m} to={{ pathname: PATHS.docs[m], search: langSearch }} className="px-3 py-1.5 text-ui font-semibold text-primary-300 border border-primary-500/[0.22] bg-primary-500/[0.06] rounded-full hover:text-white hover:border-primary-500/45 hover:bg-primary-500/[0.12] transition-colors duration-200">
                    {m === 'superforge' ? 'SuperForge' : m === 'superscript' ? 'SuperScript' : m === 'supertrack' ? 'SuperTrack' : 'SuperTune'}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex justify-between items-center flex-wrap gap-3 pt-7 border-t border-white/[0.06] text-ui text-text-muted">
          <span>{t('footer_copy', { year: new Date().getFullYear() })}</span>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <span className="px-3 py-1.5 font-mono text-meta font-bold tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg" aria-hidden="true">
              SYS READY
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
