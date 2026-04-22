import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DocLayout } from '../../components/docs/DocLayout'
import { DocNavbar } from '../../components/docs/DocNavbar'
import { DocFooter } from '../../components/docs/DocFooter'
import { SuperTuneLabPanel } from '../../components/labs/SuperTuneLabPanel'
import { useDocBundle } from '../../hooks/useDocBundle'
import { PATHS } from '../../routes/paths'
import { toLangSearch } from '../../routes/langQuery'
import '../../components/labs/labPanelStyles.css'

export function SuperTuneLabPage() {
  const { t: tUi } = useTranslation()
  const { t, ready, loadError, lang } = useDocBundle('supertune')

  if (!ready) {
    return (
      <DocLayout variant="tune">
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
    <DocLayout variant="tune">
      <DocNavbar t={t} lang={lang} moduleNav={{ mode: 'labs', current: 'supertune' }} />
      <main className="doc-main">
        <div className="doc-main-inner doc-sim-lab">
          <Link className="doc-lab-back" to={{ pathname: PATHS.docs.supertune, search: toLangSearch(lang) }}>
            ← 返回 SuperTune 文件
          </Link>
          <header className="doc-lab-hero">
            <h1>SuperTune 儀表板（大螢幕示範）</h1>
            <p>雙 A/B 區塊、成本策略、品質三卡、風格遷移與套用紀錄表；純示範，無實際推論。</p>
          </header>
          <SuperTuneLabPanel />
          <DocFooter t={t} lang={lang} />
        </div>
      </main>
    </DocLayout>
  )
}
