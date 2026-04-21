import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLangQuery } from '../hooks/useLangQuery'
import { PATHS } from '../routes/paths'

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
            <a href="#home" className="nav-logo" aria-label="Pysdn home">
              <span className="logo-mark" aria-hidden="true">⚡</span>
              <span className="logo-text">Pysdn</span>
            </a>
            <p>{t('footer_tagline')}</p>
          </div>
          <div className="footer-nav-block">
            <nav className="footer-links" aria-label="Footer navigation">
              <a href="#home">{t('nav_home')}</a>
              <a href="#about">{t('nav_about')}</a>
              <a href="#products">{t('nav_products')}</a>
              <a href="#showcase">{t('nav_showcase')}</a>
              <a href="#workflow">{t('nav_workflow')}</a>
              <a href="#faq">{t('nav_faq')}</a>
              <a href="#contact">{t('nav_contact')}</a>
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
          <span className="footer-badge" aria-hidden="true">SYS READY</span>
        </div>
      </div>
    </footer>
  )
}
