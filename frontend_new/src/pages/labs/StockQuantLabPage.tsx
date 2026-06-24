import { Link } from 'react-router-dom'
import { DocBundleLoadingShell } from '../../components/docs/DocBundleLoadingShell'
import { DocLayout } from '../../components/docs/DocLayout'
import { DocNavbar } from '../../components/docs/DocNavbar'
import { DocFooter } from '../../components/docs/DocFooter'
import { useDocBundle } from '../../hooks/useDocBundle'
import { PATHS } from '../../routes/paths'
import { toLangSearch } from '../../routes/langQuery'

export function StockQuantLabPage() {
  const { t, ready, loadError, lang } = useDocBundle('stockquant')

  if (!ready) {
    return <DocBundleLoadingShell variant="quant" loadError={loadError} tone="lab" />
  }

  return (
    <DocLayout variant="quant">
      <DocNavbar t={t} lang={lang} moduleNav={{ mode: 'labs', current: 'stockquant' }} />
      <main className="doc-main">
        <div className="doc-main-inner doc-sim-lab">
          <Link className="doc-lab-back" to={{ pathname: PATHS.docs.stockquant, search: toLangSearch(lang) }}>
            ← 返回 StockQuant 文件
          </Link>
          <header className="doc-lab-hero">
            <h1>StockQuant 儀表板（大螢幕示範）</h1>
            <p>以下為加密的假資料，用於展示A股回測結果、實時盯盤預警與策略對比；不連線實際後端。</p>
          </header>
          <div className="lab-panel-placeholder">
            <div className="lab-kpi-row">
              <div className="lab-kpi-card">
                <div className="lab-kpi-val">30+</div>
                <div className="lab-kpi-label">回測策略</div>
              </div>
              <div className="lab-kpi-card">
                <div className="lab-kpi-val">52%</div>
                <div className="lab-kpi-label">緩存命中率</div>
              </div>
              <div className="lab-kpi-card">
                <div className="lab-kpi-val">1.2s</div>
                <div className="lab-kpi-label">首屏加載</div>
              </div>
              <div className="lab-kpi-card">
                <div className="lab-kpi-val">95ms</div>
                <div className="lab-kpi-label">API延遲</div>
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
