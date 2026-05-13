import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLangQuery } from '../hooks/useLangQuery'
import { PATHS } from '../routes/paths'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Footer() {
  const { t } = useTranslation()
  const langSearch = useLangQuery()
  return (
    <footer className="footer">
      <div className="footer-gradient" aria-hidden="true" />
      <div className="footer-grid-bg" aria-hidden="true" />
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link
              to={{ pathname: PATHS.home, hash: '#home', search: langSearch }}
              className="nav-logo"
              aria-label="Pysdn home"
            >
              <span className="logo-mark" aria-hidden="true">⚡</span>
              <span className="logo-text">Pysdn</span>
            </Link>
            <p>{t('footer_tagline')}</p>
          </div>
          <div className="footer-nav-block">
            <nav className="footer-links" aria-label="Footer navigation">
              <Link to={{ pathname: PATHS.home, hash: '#home', search: langSearch }}>{t('nav_home')}</Link>
              <Link to={{ pathname: PATHS.home, hash: '#about', search: langSearch }}>{t('nav_about')}</Link>
              <Link to={{ pathname: PATHS.home, hash: '#products', search: langSearch }}>{t('nav_products')}</Link>
              <Link to={{ pathname: PATHS.home, hash: '#showcase', search: langSearch }}>{t('nav_showcase')}</Link>
              <Link to={{ pathname: PATHS.home, hash: '#workflow', search: langSearch }}>{t('nav_workflow')}</Link>
              <Link to={{ pathname: PATHS.faq, search: langSearch }}>{t('nav_faq')}</Link>
              <Link to={{ pathname: PATHS.realms, search: langSearch }}>{t('nav_realms')}</Link>
              <Link to={{ pathname: PATHS.home, hash: '#contact', search: langSearch }}>{t('nav_contact')}</Link>
            </nav>
            <nav className="footer-docs" aria-label="Modules and documentation">
              <span className="footer-docs-label">{t('hero_module_entry')}</span>
              <div className="footer-docs-links">
                <Link to={{ pathname: PATHS.modules, search: langSearch }}>{t('hero_link_modules_overview')}</Link>
                <Link to={{ pathname: PATHS.docs.superforge, search: langSearch }}>SuperForge</Link>
                <Link to={{ pathname: PATHS.docs.superscript, search: langSearch }}>SuperScript</Link>
                <Link to={{ pathname: PATHS.docs.supertrack, search: langSearch }}>SuperTrack</Link>
                <Link to={{ pathname: PATHS.docs.supertune, search: langSearch }}>SuperTune</Link>
              </div>
            </nav>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t('footer_copy', { year: new Date().getFullYear() })}</span>
          <div className="footer-bottom-right">
            <LanguageSwitcher />
            <span className="footer-badge" aria-hidden="true">SYS READY</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
