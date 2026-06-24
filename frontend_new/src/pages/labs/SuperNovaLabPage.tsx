import { Link } from 'react-router-dom'
import { DocBundleLoadingShell } from '../../components/docs/DocBundleLoadingShell'
import { DocLayout } from '../../components/docs/DocLayout'
import { DocNavbar } from '../../components/docs/DocNavbar'
import { DocFooter } from '../../components/docs/DocFooter'
import { useDocBundle } from '../../hooks/useDocBundle'
import { PATHS } from '../../routes/paths'
import { toLangSearch } from '../../routes/langQuery'

export function SuperNovaLabPage() {
  const { t, ready, loadError, lang } = useDocBundle('supernova')

  if (!ready) {
    return <DocBundleLoadingShell variant="nova" loadError={loadError} tone="lab" />
  }

  return (
    <DocLayout variant="nova">
      <DocNavbar t={t} lang={lang} moduleNav={{ mode: 'labs', current: 'supernova' }} />
      <main className="doc-main">
        <div className="doc-main-inner doc-sim-lab">
          <Link className="doc-lab-back" to={{ pathname: PATHS.docs.supernova, search: toLangSearch(lang) }}>
            ← 返回 SuperNova 文件
          </Link>
          <header className="doc-lab-hero">
            <h1>SuperNova 儀表板（大螢幕示範）</h1>
            <p>以下為加密的假資料，用於展示多平台數據採集狀態、任務調度與資源監控；不連線實際後端。</p>
          </header>
          <div className="lab-panel-placeholder">
            <div className="lab-kpi-row">
              <div className="lab-kpi-card">
                <div className="lab-kpi-val">5</div>
                <div className="lab-kpi-label">接入平台</div>
              </div>
              <div className="lab-kpi-card">
                <div className="lab-kpi-val">12.8K</div>
                <div className="lab-kpi-label">今日採集量</div>
              </div>
              <div className="lab-kpi-card">
                <div className="lab-kpi-val">98.5%</div>
                <div className="lab-kpi-label">成功率</div>
              </div>
              <div className="lab-kpi-card">
                <div className="lab-kpi-val">23ms</div>
                <div className="lab-kpi-label">平均延遲</div>
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
