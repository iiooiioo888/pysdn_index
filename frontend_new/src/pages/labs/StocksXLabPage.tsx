import { Link } from 'react-router-dom'
import { DocBundleLoadingShell } from '../../components/docs/DocBundleLoadingShell'
import { DocLayout } from '../../components/docs/DocLayout'
import { DocNavbar } from '../../components/docs/DocNavbar'
import { DocFooter } from '../../components/docs/DocFooter'
import { useDocBundle } from '../../hooks/useDocBundle'
import { PATHS } from '../../routes/paths'
import { toLangSearch } from '../../routes/langQuery'

export function StocksXLabPage() {
  const { t, ready, loadError, lang } = useDocBundle('stocksx')

  if (!ready) {
    return <DocBundleLoadingShell variant="stocks" loadError={loadError} tone="lab" />
  }

  return (
    <DocLayout variant="stocks">
      <DocNavbar t={t} lang={lang} moduleNav={{ mode: 'labs', current: 'stocksx' }} />
      <main className="doc-main">
        <div className="doc-main-inner doc-sim-lab">
          <Link className="doc-lab-back" to={{ pathname: PATHS.docs.stocksx, search: toLangSearch(lang) }}>
            ← 返回 StocksX 文件
          </Link>
          <header className="doc-lab-hero">
            <h1>StocksX 儀表板（大螢幕示範）</h1>
            <p>以下為加密的假資料，用於展示量化策略回測、投資組合優化與即時監控面板；不連線實際後端。</p>
          </header>
          <div className="lab-panel-placeholder">
            <div className="lab-kpi-row">
              <div className="lab-kpi-card">
                <div className="lab-kpi-val">130+</div>
                <div className="lab-kpi-label">量化策略</div>
              </div>
              <div className="lab-kpi-card">
                <div className="lab-kpi-val">23.5%</div>
                <div className="lab-kpi-label">年化收益</div>
              </div>
              <div className="lab-kpi-card">
                <div className="lab-kpi-val">1.85</div>
                <div className="lab-kpi-label">夏普比率</div>
              </div>
              <div className="lab-kpi-card">
                <div className="lab-kpi-val">-8.2%</div>
                <div className="lab-kpi-label">最大回撤</div>
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
