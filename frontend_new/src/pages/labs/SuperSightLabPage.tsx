import { Link } from 'react-router-dom'
import { DocBundleLoadingShell } from '../../components/docs/DocBundleLoadingShell'
import { DocLayout } from '../../components/docs/DocLayout'
import { DocNavbar } from '../../components/docs/DocNavbar'
import { DocFooter } from '../../components/docs/DocFooter'
import { useDocBundle } from '../../hooks/useDocBundle'
import { PATHS } from '../../routes/paths'
import { toLangSearch } from '../../routes/langQuery'

export function SuperSightLabPage() {
  const { t, ready, loadError, lang } = useDocBundle('supersight')

  if (!ready) {
    return <DocBundleLoadingShell variant="sight" loadError={loadError} tone="lab" />
  }

  return (
    <DocLayout variant="sight">
      <DocNavbar t={t} lang={lang} moduleNav={{ mode: 'labs', current: 'supersight' }} />
      <main className="doc-main">
        <div className="doc-main-inner doc-sim-lab">
          <Link className="doc-lab-back" to={{ pathname: PATHS.docs.supersight, search: toLangSearch(lang) }}>
            ← 返回 SuperSight 文件
          </Link>
          <header className="doc-lab-hero">
            <h1>SuperSight 儀表板（大螢幕示範）</h1>
            <p>以下為加密的假資料，用於展示記憶檢索、人臉分析與用戶畫像統計；不連線實際後端。</p>
          </header>
          <div className="lab-panel-placeholder">
            <div className="lab-kpi-row">
              <div className="lab-kpi-card">
                <div className="lab-kpi-val">8.2K</div>
                <div className="lab-kpi-label">記憶條目</div>
              </div>
              <div className="lab-kpi-card">
                <div className="lab-kpi-val">1.2K</div>
                <div className="lab-kpi-label">識別人臉</div>
              </div>
              <div className="lab-kpi-card">
                <div className="lab-kpi-val">96.3%</div>
                <div className="lab-kpi-label">檢索準確率</div>
              </div>
              <div className="lab-kpi-card">
                <div className="lab-kpi-val">156ms</div>
                <div className="lab-kpi-label">平均查詢</div>
              </div>
            </div>
            <p className="lab-placeholder-note">（此處為示範數據佔位，實際儀表板組件待開發）</p>
          </div>
          <DocFooter t={t} lang={lang} />
        </div>
      </main>
    </DocLayout>
  )
}
