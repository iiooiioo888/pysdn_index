import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DocLayout } from '../../components/docs/DocLayout'
import { DocNavbar } from '../../components/docs/DocNavbar'
import { DocFooter } from '../../components/docs/DocFooter'
import { DocReadingSummary } from '../../components/docs/DocReadingSummary'
import { DocGithubSection } from '../../components/docs/DocGithubSection'
import { SuperTrackEngineeringSection } from '../../components/docs/SuperTrackEngineeringSection'
import { DocMermaid } from '../../components/docs/DocMermaid'
import { SUPERTRACK_MINDMAP } from '../../components/docs/mermaidCharts'
import { useDocBundle } from '../../hooks/useDocBundle'
import { PATHS } from '../../routes/paths'
import { toLangSearch } from '../../routes/langQuery'

function splitPlatformChips(raw: string): string[] {
  if (!raw || !raw.includes('|')) return []
  return raw
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function SuperTrackDocPage() {
  const { t: tUi } = useTranslation()
  const { t, ready, loadError, lang } = useDocBundle('supertrack')

  if (!ready) {
    return (
      <DocLayout variant="track">
        <main className="doc-main">
          <div className="doc-main-inner" style={{ paddingTop: 100 }}>
            <p className="doc-hero-lead" style={{ opacity: loadError ? 1 : 0.5 }}>
              {loadError ? tUi('doc_page_load_error') : tUi('doc_page_loading')}
            </p>
          </div>
        </main>
      </DocLayout>
    )
  }

  return (
    <DocLayout variant="track">
      <DocNavbar t={t} lang={lang} moduleNav={{ mode: 'docs', current: 'supertrack' }} />
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
                <span className="doc-hero-badge">SIGNAL TRACKING</span>
                <h1 id="doc-hero-title">{t('hero_title')}</h1>
                <p className="doc-hero-lead">{t('hero_lead')}</p>
              </div>
            </div>
          </section>

          <article className="doc">
            <DocReadingSummary t={t} variant="supertrack" />

            <div className="doc-diagram-block">
              <h3>能力一覽（示意）</h3>
              <p className="doc-diagram-lead">從設定追蹤目標、取得公開內容，到整理與通知，再到餵給其他模組的大致分工。</p>
              <DocMermaid chart={SUPERTRACK_MINDMAP} />
            </div>

            <h2>{t('h_overview')}</h2>
            <p>
              SuperTrack 是 Pysdn SuperCool 的擴充模組，幫你在<strong>公開網路</strong>上持續留意特定人物、品牌或話題，把分散在各平台的內容整理成<strong>結構化、可搜尋、可再利用</strong>的素材，方便餵給 SuperForge、SuperScript、SuperTune 使用。
            </p>
            <p>
              它想減少「手動刷動態、靠記憶存靈感」的負擔，改成由系統代勞彙整，讓你專心在創作與決策。
            </p>

            <section className="doc-platform-scope" id="supported-platforms" aria-labelledby="platforms-heading">
              <h3 id="platforms-heading">{t('h_platforms')}</h3>
              <p>{t('platforms_lead')}</p>
              <p className="doc-platform-scope__subhead">{t('platforms_group_cn')}</p>
              <div className="doc-platform-chips" role="list">
                {splitPlatformChips(t('platforms_chips_cn')).map((label) => (
                  <span key={label} className="doc-tag doc-tag--track" role="listitem">
                    {label}
                  </span>
                ))}
              </div>
              <p className="doc-platform-scope__subhead">{t('platforms_group_intl')}</p>
              <div className="doc-platform-chips" role="list">
                {splitPlatformChips(t('platforms_chips_intl')).map((label) => (
                  <span key={label} className="doc-tag doc-tag--track" role="listitem">
                    {label}
                  </span>
                ))}
              </div>
              <p className="doc-platform-scope__note">{t('platforms_note')}</p>
            </section>

            <p className="doc-diagram-lead" style={{ marginTop: '1rem' }}>
              上文為精簡產品說明；<strong>統一調度層</strong>、<strong>開源工具選型</strong>與 <strong>SocialCrawler 後端</strong>等工程內容於本頁下方〈工程架構與調研參考〉維護（錨點 <code>#engineering</code>）；靜態頁 <code>supertrack.html</code> 亦載有對應段落。
            </p>

            <h2>{t('h_components')}</h2>

            <h3>跨平台辨識與整合</h3>
            <p>
              同一人物或品牌在不同平台可能有不同帳號名稱。SuperTrack 會依公開資訊協助<strong>對齊與彙整</strong>，讓你在同一個追蹤對象下看到多平台的動態，而不是散落的多個清單。
            </p>

            <h3>持續追蹤與節奏</h3>
            <p>
              可依你的設定定期檢查公開更新，並以<strong>合適頻率、貼近真人使用習慣</strong>的方式取得資料，降低對平台造成負擔或觸發不當使用疑慮。實際可行範圍仍須遵守各平台規則。
            </p>

            <h3>時間軸與警報</h3>
            <p>內容依時間整理，方便回溯；當出現明顯異常（例如互動或話題熱度異常變化）時，可透過你設定的管道收到提醒。</p>

            <h3>精華與後續利用</h3>
            <p>
              高價值內容可標記或自動篩入靈感／提示詞庫，與 <strong>SuperForge</strong> 等模組銜接，減少重複手動複製整理。
            </p>

            <h2>{t('h_dims')}</h2>
            <p>可依需求組合不同追蹤焦點：</p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{t('th_dim_type')}</th>
                    <th>{t('th_dim_focus')}</th>
                    <th>{t('th_dim_out')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>{t('d1a')}</strong>
                    </td>
                    <td>{t('d1b')}</td>
                    <td>{t('d1c')}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{t('d2a')}</strong>
                    </td>
                    <td>{t('d2b')}</td>
                    <td>{t('d2c')}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{t('d3a')}</strong>
                    </td>
                    <td>{t('d3b')}</td>
                    <td>{t('d3c')}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{t('d4a')}</strong>
                    </td>
                    <td>{t('d4b')}</td>
                    <td>{t('d4c')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>🚀 快速上手</h2>
            <ol>
              <li>
                <strong>選擇追蹤對象</strong>：帳號、話題或品牌等，依介面新增（可批量）。
              </li>
              <li>
                <strong>調整頻率與深度</strong>：多久檢查一次、要摘要或較完整內容；不確定時可用預設。
              </li>
              <li>
                <strong>查看時間軸與警報</strong>：在面板掌握動態；值得追的內容可再送入其他模組。
              </li>
            </ol>

            <h2>🎯 適用情境（舉例）</h2>
            <ul>
              <li>品牌／競品聲量與公開輿情觀察</li>
              <li>KOL 或創作者長期表現與靈感蒐集</li>
              <li>話題熱度與內容企劃時機</li>
              <li>市場／類型趨勢的定性參考</li>
            </ul>

            <h2>🔗 與其他模組</h2>
            <ul>
              <li>
                <strong>SuperScript</strong>：熱點或話題可輔助劇本／企劃方向。
              </li>
              <li>
                <strong>SuperForge</strong>：視覺與風格素材可進入提示詞與知識庫。
              </li>
              <li>
                <strong>SuperTune</strong>：追蹤結果可搭配後續 A/B 與優化決策（依你的工作流）。
              </li>
            </ul>

            <h2>🖥️ 試用示範</h2>
            <p>以下為前端示範儀表板（數字為示意，非真實平台資料）：</p>
            <p>
              <Link className="doc-lab-cta" to={{ pathname: PATHS.panel.supertrack, search: toLangSearch(lang) }}>
                開啟 SuperTrack 示範面板 →
              </Link>
            </p>
            <p>
              <Link className="doc-lab-cta" to={{ pathname: PATHS.labs.supertrack, search: toLangSearch(lang) }}>
                開啟 SuperTrack 實驗室儀表板（大螢幕）→
              </Link>
            </p>

            <h2>{t('h_compliance')}</h2>
            <ul>
              <li>
                <strong>僅使用公開可得資訊</strong>，不規避隱私或權限設定。
              </li>
              <li>
                <strong>遵守各平台使用條款與爬蟲相關規範</strong>，合理頻率、不濫用自動化。
              </li>
              <li>
                <strong>敏感資訊依設計脫敏或排除</strong>，避免不當儲存或外流。
              </li>
              <li>
                <strong>使用者對自身用途負責</strong>；產出僅供合法之創作、研究或營運參考。
              </li>
            </ul>

            <DocGithubSection />

            <SuperTrackEngineeringSection />
          </article>

          <DocFooter t={t} lang={lang} />
        </div>
      </main>
    </DocLayout>
  )
}
