import { Link } from 'react-router-dom'
import { DocBundleLoadingShell } from '../../components/docs/DocBundleLoadingShell'
import { DocLayout } from '../../components/docs/DocLayout'
import { DocNavbar } from '../../components/docs/DocNavbar'
import { DocFooter } from '../../components/docs/DocFooter'
import { SuperTrackPanel } from '../../components/panel/SuperTrackPanel'
import { useDocBundle } from '../../hooks/useDocBundle'
import { PATHS } from '../../routes/paths'
import { toLangSearch } from '../../routes/langQuery'
import '../../components/labs/labPanelStyles.css'

export function SuperTrackPanelPage() {
  const { t, ready, loadError, lang } = useDocBundle('supertrack')

  if (!ready) {
    return <DocBundleLoadingShell variant="track" loadError={loadError} tone="lab" />
  }

  const langSearch = toLangSearch(lang)

  return (
    <DocLayout variant="track">
      <DocNavbar t={t} lang={lang} moduleNav={{ mode: 'docs', current: 'supertrack' }} />
      <main className="doc-main doc-main--st-panel">
        <div className="doc-main-inner doc-main-inner--st-panel doc-sim-lab">
          <nav className="doc-panel-topnav" aria-label="頁面導覽">
            <Link className="doc-lab-back" to={{ pathname: PATHS.docs.supertrack, search: langSearch }}>
              ← SuperTrack 文件
            </Link>
            <span className="doc-panel-topnav-sep" aria-hidden="true">
              |
            </span>
            <Link className="doc-lab-back" to={{ pathname: PATHS.labs.supertrack, search: langSearch }}>
              SuperTrack 實驗室大螢幕（同模組）→
            </Link>
          </nav>

          <SuperTrackPanel lang={lang} />
          <DocFooter t={t} lang={lang} />
        </div>
      </main>
    </DocLayout>
  )
}
