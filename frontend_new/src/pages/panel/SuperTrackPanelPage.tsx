import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DocLayout } from '../../components/docs/DocLayout'
import { DocNavbar } from '../../components/docs/DocNavbar'
import { DocFooter } from '../../components/docs/DocFooter'
import { SuperTrackLabPanel } from '../../components/labs/SuperTrackLabPanel'
import { useDocBundle } from '../../hooks/useDocBundle'
import { PATHS } from '../../routes/paths'
import { toLangSearch } from '../../routes/langQuery'
import '../../components/labs/labPanelStyles.css'

export function SuperTrackPanelPage() {
  const { t: tUi } = useTranslation()
  const { t, ready, loadError, lang } = useDocBundle('supertrack')

  if (!ready) {
    return (
      <DocLayout variant="track">
        <main className="doc-main">
          <div className="doc-main-inner doc-sim-lab" style={{ paddingTop: 100 }}>
            <p className="doc-hero-lead" style={{ opacity: loadError ? 1 : 0.5 }}>
              {loadError ? tUi('doc_page_load_error') : tUi('doc_page_loading')}
            </p>
          </div>
        </main>
      </DocLayout>
    )
  }

  const langSearch = toLangSearch(lang)

  return (
    <DocLayout variant="track">
      <DocNavbar t={t} lang={lang} moduleNav={{ mode: 'docs', current: 'supertrack' }} />
      <main className="doc-main">
        <div className="doc-main-inner doc-sim-lab">
          <nav className="doc-panel-topnav" aria-label="頁面導覽">
            <Link className="doc-lab-back" to={{ pathname: PATHS.docs.supertrack, search: langSearch }}>
              ← SuperTrack 文件
            </Link>
            <span className="doc-panel-topnav-sep" aria-hidden="true">
              |
            </span>
            <Link className="doc-lab-back" to={{ pathname: PATHS.labs.supertrack, search: langSearch }}>
              實驗室完整儀表板 →
            </Link>
          </nav>
          <SuperTrackLabPanel context="assistant" />
          <DocFooter t={t} lang={lang} />
        </div>
      </main>
    </DocLayout>
  )
}
