import { Link } from 'react-router-dom'
import { DocBundleLoadingShell } from '../../components/docs/DocBundleLoadingShell'
import { DocLayout } from '../../components/docs/DocLayout'
import { DocNavbar } from '../../components/docs/DocNavbar'
import { DocFooter } from '../../components/docs/DocFooter'
import { SuperTrackLabPanel } from '../../components/labs/SuperTrackLabPanel'
import { useDocBundle } from '../../hooks/useDocBundle'
import { PATHS } from '../../routes/paths'
import { toLangSearch } from '../../routes/langQuery'
import '../../components/labs/labPanelStyles.css'

export function SuperTrackLabPage() {
  const { t, ready, loadError, lang } = useDocBundle('supertrack')

  if (!ready) {
    return <DocBundleLoadingShell variant="track" loadError={loadError} tone="lab" />
  }

  return (
    <DocLayout variant="track">
      <DocNavbar t={t} lang={lang} moduleNav={{ mode: 'labs', current: 'supertrack' }} />
      <main className="doc-main">
        <div className="doc-main-inner doc-sim-lab">
          <Link className="doc-lab-back" to={{ pathname: PATHS.docs.supertrack, search: toLangSearch(lang) }}>
            ← 返回 SuperTrack 文件
          </Link>
          <header className="doc-lab-hero">
            <h1>SuperTrack 實驗室儀表板（大螢幕示範）</h1>
            <p>與「示範面板」為同一模組；此處版面較大。警報表、帳號清單、觀眾分群、熱詞趨勢與 ROI 指標；數值為隨機示範，不代表真實平台。</p>
          </header>

          <p className="doc-hero-lead">
            工程架構、開源工具與 SuperTrack 後端說明請見{' '}
            <Link to={{ pathname: PATHS.docs.supertrack, search: toLangSearch(lang), hash: '#engineering' }}>
              SuperTrack 文件 → 工程章節
            </Link>
            。
          </p>

          <SuperTrackLabPanel />
          <DocFooter t={t} lang={lang} />
        </div>
      </main>
    </DocLayout>
  )
}
