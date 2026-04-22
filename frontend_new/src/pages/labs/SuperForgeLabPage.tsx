import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DocLayout } from '../../components/docs/DocLayout'
import { DocNavbar } from '../../components/docs/DocNavbar'
import { DocFooter } from '../../components/docs/DocFooter'
import { SuperForgeLabPanel } from '../../components/labs/SuperForgeLabPanel'
import { useDocBundle } from '../../hooks/useDocBundle'
import { PATHS } from '../../routes/paths'
import { toLangSearch } from '../../routes/langQuery'
import '../../components/labs/labPanelStyles.css'

export function SuperForgeLabPage() {
  const { t: tUi } = useTranslation()
  const { t, ready, loadError, lang } = useDocBundle('superforge')

  if (!ready) {
    return (
      <DocLayout variant="forge">
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
    <DocLayout variant="forge">
      <DocNavbar t={t} lang={lang} moduleNav={{ mode: 'labs', current: 'superforge' }} />
      <main className="doc-main">
        <div className="doc-main-inner doc-sim-lab">
          <Link className="doc-lab-back" to={{ pathname: PATHS.docs.superforge, search: toLangSearch(lang) }}>
            ← 返回 SuperForge 文件
          </Link>
          <header className="doc-lab-hero">
            <h1>SuperForge 儀表板（大螢幕示範）</h1>
            <p>以下為加密的假資料，用於展示 KPI、健康度、API 日誌與熱門提示詞列表；不連線實際後端。</p>
          </header>
          <SuperForgeLabPanel t={t} />
          <DocFooter t={t} lang={lang} />
        </div>
      </main>
    </DocLayout>
  )
}
