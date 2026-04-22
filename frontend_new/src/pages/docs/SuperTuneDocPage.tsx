import { Link } from 'react-router-dom'
import { DocBundleLoadingShell } from '../../components/docs/DocBundleLoadingShell'
import { DocLayout } from '../../components/docs/DocLayout'
import { DocNavbar } from '../../components/docs/DocNavbar'
import { DocFooter } from '../../components/docs/DocFooter'
import { DocReadingSummary } from '../../components/docs/DocReadingSummary'
import { DocMermaid } from '../../components/docs/DocMermaid'
import { SUPERTUNE_MINDMAP } from '../../components/docs/mermaidCharts'
import { useDocBundle } from '../../hooks/useDocBundle'
import { PATHS } from '../../routes/paths'
import { toLangSearch } from '../../routes/langQuery'

export function SuperTuneDocPage() {
  const { t, ready, loadError, lang } = useDocBundle('supertune')

  if (!ready) {
    return <DocBundleLoadingShell variant="tune" loadError={loadError} />
  }

  return (
    <DocLayout variant="tune">
      <DocNavbar t={t} lang={lang} moduleNav={{ mode: 'docs', current: 'supertune' }} />
      <main className="doc-main">
        <div className="doc-main-inner">
          <section className="doc-hero" aria-labelledby="doc-hero-title">
            <div className="doc-hero-card">
              <div className="doc-hero-fx" aria-hidden="true">
                <span className="doc-hero-grid" />
                <span className="doc-hero-orb doc-hero-orb--1" />
                <span className="doc-hero-orb doc-hero-orb--2" />
              </div>
              <div className="doc-hero-body">
                <span className="doc-hero-badge">OPTIMIZATION</span>
                <h1 id="doc-hero-title">SuperTune</h1>
                <p className="doc-hero-sub">{t('hero_sub')}</p>
                <p className="doc-hero-lead">{t('intro_p')}</p>
              </div>
            </div>
          </section>

          <article className="doc">
            <DocReadingSummary t={t} variant="supertune" />
            {/* ── 快速上手 ── */}
            <h2>🚀 快速上手</h2>
            <p>SuperTune 不需要複雜設定。只要把你的內容丟進來，它就會自動分析、優化、給你建議。</p>
            <ol>
              <li><strong>匯入內容</strong>：把你的提示詞、劇本片段、行銷文案貼進 SuperTune，或直接從 SuperForge / SuperScript 匯入。</li>
              <li><strong>選擇優化模式</strong>：A/B 測試（比較兩個版本）、成本優化（省 token）、品質分析（節奏 / 張力 / 新鮮度）。</li>
              <li><strong>查看結果</strong>：系統自動跑分析，幾秒內出結果。左邊是原始版本，右邊是優化建議。</li>
              <li><strong>一鍵套用</strong>：覺得 B 版本比較好？按一下就套用，自動回寫到 SuperForge 或 SuperScript。</li>
            </ol>

            <div className="doc-diagram-block">
              <h3>優化能力全景（示意）</h3>
              <p className="doc-diagram-lead">A／B、成本、品質與風格等支線的大致關係。</p>
              <DocMermaid chart={SUPERTUNE_MINDMAP} />
            </div>

            {/* ── A/B 測試 ── */}
            <h2>🔬 A／B 測試</h2>
            <p>
              同一則 prompt 或同一場戲，可並行產出兩種寫法／設定，由 SuperTune 協助<strong>比較成效與品質</strong>，減少「憑感覺選版本」的不確定性。
            </p>
            <div className="doc-example">
              <div className="doc-example-label">💡 範例</div>
              <p>
                兩版行銷標語、兩版對白或兩組圖像提示詞並排檢視後，選擇較符合目標的一版；必要時可一鍵套用至 SuperForge／SuperScript 工作流。
              </p>
            </div>

            {/* ── 成本與品質 ── */}
            <h2>💸 成本與品質</h2>
            <p>
              透過<strong>精簡冗餘描述、控制上下文長度、合併請求、依任務難度選用合適模型</strong>等方式，在維持可接受品質的前提下降低呼叫成本。實際節省幅度依你的內容與模型而定。
            </p>
            <p>
              另提供<strong>節奏、張力、新鮮度與風格參考</strong>等品質面向的提示，協助劇本與文案在「好讀、好拍、不膩」之間取得平衡；細部指標可在實驗室面板試玩示範。
            </p>

            {/* ── 適用場景 ── */}
            <h2>📋 適用場景</h2>
            <ul>
              <li><strong>行銷團隊</strong>：同一則廣告文案跑 A/B 測試，用數據決定哪個版本上線，避免「我覺得這個比較好」的爭論。</li>
              <li><strong>劇本創作者</strong>：寫完初稿後用張力曲線和新鮮度偵測檢查品質，找出需要加強的場景和需要替換的老梗。</li>
              <li><strong>AI 繪圖重度用戶</strong>：同一個概念跑兩個提示詞版本，看哪個出圖穩定度更高，然後自動優化參數。</li>
              <li><strong>企業工作流</strong>：大量內容需要生成時，用成本優化把 API 費用壓到最低，同時用品質監控確保輸出品質不掉。</li>
            </ul>

            {/* ── 與其他模組的搭配 ── */}
            <h2>🔗 與其他模組的搭配</h2>
            <p>SuperTune 不是獨立運作的——它是整個 SuperCool 生態系的「優化中樞」：</p>
            <ul>
              <li><strong>SuperForge → SuperTune</strong>：從知識庫取出歷史提示詞，跑 A/B 測試找出最佳參數組合，結果回寫到版本樹。</li>
              <li><strong>SuperScript → SuperTune</strong>：劇本寫完後自動跑節奏分析、張力曲線和新鮮度偵測，給出具體修改建議。</li>
              <li><strong>SuperTrack → SuperTune</strong>：把追蹤到的熱門內容注入測試，看哪個 trend 方向最適合你的受眾。</li>
              <li><strong>SuperTune → 全部</strong>：成本優化的省錢效果回饋到整個平台，讓你在不增加預算的情況下產出更多內容。</li>
            </ul>

            <h2>🖥️ 操作面板預覽</h2>
            <p>雙 A/B 區塊、成本、節奏／張力／新鮮度、導演風格與「套用紀錄」表已放於實驗室大螢幕版。</p>
            <p>
              <Link className="doc-lab-cta" to={{ pathname: PATHS.labs.supertune, search: toLangSearch(lang) }}>
                開啟 SuperTune 儀表板（示範資料）→
              </Link>
            </p>

            <p style={{ marginTop: '2rem', opacity: 0.6 }}>© Pysdn SuperCool · MIT License</p>
          </article>

          <DocFooter t={t} lang={lang} />
        </div>
      </main>
    </DocLayout>
  )
}
