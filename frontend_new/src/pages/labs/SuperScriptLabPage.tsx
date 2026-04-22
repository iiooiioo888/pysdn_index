import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DocLayout } from '../../components/docs/DocLayout'
import { DocNavbar } from '../../components/docs/DocNavbar'
import { DocFooter } from '../../components/docs/DocFooter'
import { SuperScriptLabPanel } from '../../components/labs/SuperScriptLabPanel'
import { useDocBundle } from '../../hooks/useDocBundle'
import { PATHS } from '../../routes/paths'
import { toLangSearch } from '../../routes/langQuery'
import '../../components/labs/labPanelStyles.css'

export function SuperScriptLabPage() {
  const { t: tUi } = useTranslation()
  const { t, ready, loadError, lang } = useDocBundle('superscript')

  if (!ready) {
    return (
      <DocLayout variant="script">
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

  return (
    <DocLayout variant="script">
      <DocNavbar t={t} lang={lang} moduleNav={{ mode: 'labs', current: 'superscript' }} />
      <main className="doc-main">
        <div className="doc-main-inner doc-sim-lab">
          <Link className="doc-lab-back" to={{ pathname: PATHS.docs.superscript, search: toLangSearch(lang) }}>
            ← 返回 SuperScript 文件
          </Link>
          <header className="doc-lab-hero">
            <h1>SuperScript 儀表板（大螢幕示範）</h1>
            <p>四 Agent 流水線、分幕佇列、Writer 摘錄、一致性與建議清單；皆為靜態示範資料。</p>
          </header>
          <SuperScriptLabPanel />
          <DocFooter t={t} lang={lang} />
        </div>
      </main>
    </DocLayout>
  )
}
