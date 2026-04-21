import { useTranslation } from 'react-i18next'
import { DocLayout } from '../../components/docs/DocLayout'
import { DocNavbar } from '../../components/docs/DocNavbar'
import { DocFooter } from '../../components/docs/DocFooter'
import { DocReadingSummary } from '../../components/docs/DocReadingSummary'
import { useDocBundle } from '../../hooks/useDocBundle'

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
      <DocNavbar t={t} lang={lang} />
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
            <h2>{t('h_overview')}</h2>
            <p>SuperTrack 是你的「網路上的眼睛」。它能同時追蹤多個社群平台（小紅書、Instagram、Twitter/X、抖音、YouTube 等）上特定帳號、話題或關鍵字的動態。當某個訊號異常（流量暴增、話題升溫、互動率飆升），系統會第一時間通知你，讓你搶在所有人之前掌握趨勢。</p>
            <p>不同於一般的爬蟲工具，SuperTrack 使用模擬真人瀏覽行為的方式進行抓取——模擬滾動速度、隨機停留時間、自然閱讀節奏——所以不會觸發平台的反爬機制。抓取成功率高達 98.2%。</p>

            {/* ── 核心功能 + 範例 ── */}
            <h2>{t('h_components')}</h2>

            <h3>跨平台身份合併：散落的碎片拼成完整畫像</h3>
            <p>同一個人可能在小紅書叫「@設計日常」、在 Instagram 叫「@design.daily」、在 Twitter 叫「@designer_daily」。SuperTrack 會自動比對帳號資訊（頭像相似度、Bio 交叉引用、內容風格匹配），把不同平台的帳號合併成同一個追蹤對象。你看到的不是三個散落的碎片，而是一個人物/品牌的完整跨平台畫像。</p>
            <p>這對品牌監測特別有用——你追蹤一個競爭對手，不需要分別去五個平台找他們的帳號，SuperTrack 已經幫你整合好了。</p>
            <div className="doc-example">
              <div className="doc-example-label">💡 實際場景</div>
              <p>你追蹤了一位 KOL「@ai_creative」，系統自動發現他在 Twitter、小紅書、抖音都有帳號，全部串在一起。你看到的數據面板顯示：<br/>
              ・小紅書：42.3K 粉絲，日均互動率 3.2%<br/>
              ・Twitter/X：18.7K followers，日均互動率 1.8%<br/>
              ・抖音：156K 粉絲，日均互動率 5.1%<br/>
              三個平台的數據合在一起分析，你能看到完整的影響力版圖。</p>
            </div>

            <h3>智能爬蟲：像真人一樣刷社群</h3>
            <p>SuperTrack 的爬蟲引擎不是暴力抓取，而是模擬真人的瀏覽行為。它會按照你設定的間隔（例如每 30 分鐘）自動檢查目標帳號，有新內容就抓回來分析，沒有就安靜等待。每次抓取都帶有隨機延遲和行為模式變異，跟真人用戶的行為統計特徵一致。</p>
            <p>你可以設定抓取頻率（最快每 5 分鐘，最慢每 24 小時）、抓取深度（只抓標題和摘要，還是抓全文和圖片描述）、以及觸發條件（有新帖才抓、有高互動才抓、或定時全量抓取）。</p>
            <div className="doc-example">
              <div className="doc-example-label">💡 實際場景</div>
              <p>設定追蹤「@design_daily」的小紅書帳號。每 30 分鐘自動檢查一次，有新帖就抓回來，沒新帖就安靜等著。抓取的內容包括：帖子標題、全文、圖片描述（AI 自動生成）、互動數據（讚、收藏、評論數）、發文時間。平均抓取成功率 98.2%。</p>
            </div>

            <h3>模擬真人行為：不觸發反爬機制</h3>
            <p>這是 SuperTrack 跟傳統爬蟲最大的差別。傳統爬蟲用固定間隔發 HTTP 請求，很容易被平台識別為機器人而封鎖。SuperTrack 的行為引擎會模擬真人的滑手機節奏：滾動、停頓、看一會兒、再往下滑，每個動作之間帶有隨機間隔。從平台的角度看，這跟一個真人用戶在瀏覽沒什麼兩樣。</p>
            <p>如果某個平台更新了反爬策略，SuperTrack 會自動調整行為模式，確保長期穩定運行。你不需要手動維護爬蟲規則。</p>

            <h3>時間軸回溯：任何時間點的內容都能查</h3>
            <p>所有抓到的內容按時間排好，形成一條完整的時間軸。你可以回溯「上個月這位 KOL 發了什麼」、「品牌 X 最近三個月的行銷節奏」、「某個話題是從哪天開始升溫的」。時間軸支援按平台、按帳號、按話題、按內容類型篩選。</p>
            <p>這不只是「存了一堆帖子」，而是結構化的時序資料庫，支援複雜的時間範圍查詢和趨勢分析。</p>

            <h3>異常警報：第一時間知道發生什麼事</h3>
            <p>SuperTrack 會持續分析追蹤對象的數據模式，當偵測到異常（流量突然暴增、互動率飆升、某個話題突然升溫），系統會立刻發送通知。通知方式支援 Webhook 推送、Email、以及平台內通知面板。</p>
            <p>你可以自訂警報閾值——例如「互動率超過平時 3 倍就通知我」或「新增粉絲數超過 1000 就警報」。</p>
            <div className="doc-example">
              <div className="doc-example-label">💡 實際場景</div>
              <p>凌晨 3 點，@design_daily 的一篇「AI 室內設計」帖子突然爆了——互動率從平時的 2% 飆到 18%。SuperTrack 偵測到異常，自動發通知：<br/>
              「🔥 異常警報：@design_daily 互動率暴增 800%<br/>
              ・帖子: AI 室內設計——用 Midjourney 重新定義你的家<br/>
              ・當前互動: 12.4K 讚 · 3.2K 收藏 · 847 評論<br/>
              ・互動率: 18.2%（平時: 2.1%）<br/>
              建議立即查看，把握時效性話題窗口。」</p>
            </div>

            <h3>精華萃取：好內容自動入庫</h3>
            <p>SuperTrack 不只是「抓」內容，還會「篩」內容。系統會用 AI 分析每篇帖子的品質分數（原創度、互動潛力、內容深度），篩出高品質的帖子，結構化整理後自動推送進 SuperForge 提示詞庫。下次你創作時，可以直接搜尋「上次那個爆款帖子的風格是什麼」。</p>
            <p>你也可以手動標記「這篇很好，存進 SuperForge」，系統會學習你的偏好，未來的自動篩選會更精準。</p>

            {/* ── 追蹤維度 ── */}
            <h2>{t('h_dims')}</h2>
            <p>SuperTrack 支援四種追蹤維度，你可以根據需求自由組合：</p>
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
                    <td><strong>{t('d1a')}</strong></td>
                    <td>{t('d1b')}</td>
                    <td>{t('d1c')}</td>
                  </tr>
                  <tr>
                    <td><strong>{t('d2a')}</strong></td>
                    <td>{t('d2b')}</td>
                    <td>{t('d2c')}</td>
                  </tr>
                  <tr>
                    <td><strong>{t('d3a')}</strong></td>
                    <td>{t('d3b')}</td>
                    <td>{t('d3c')}</td>
                  </tr>
                  <tr>
                    <td><strong>{t('d4a')}</strong></td>
                    <td>{t('d4b')}</td>
                    <td>{t('d4c')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── 快速上手 ── */}
            <h2>🚀 快速上手</h2>
            <p>從零到開始接收第一個訊號，只需要四個步驟：</p>

            <h3>第一步：選擇追蹤目標</h3>
            <p>打開 SuperTrack，在「新增追蹤」頁面中選擇你要追蹤的類型：帳號（輸入目標帳號的 URL 或用戶名）、話題（輸入關鍵字或 hashtag）、或品牌（輸入品牌名稱，系統自動搜尋多平台帳號）。可以一次新增多個目標，系統會同時追蹤。</p>

            <h3>第二步：設定抓取參數</h3>
            <p>為每個追蹤目標設定抓取頻率（每 5 分鐘到每 24 小時）、抓取深度（摘要模式或完整模式）、以及警報閾值（什麼程度的異常要通知你）。如果你不確定怎麼設定，用預設值就好——SuperTrack 的預設參數已經經過大量實測驗證，適合大多數場景。</p>

            <h3>第三步：等待第一個訊號</h3>
            <p>設定完成後，SuperTrack 開始在背景運作。第一輪抓取通常在 5-15 分鐘內完成（取決於目標數量和平台）。你可以在面板上即時看到抓取進度和初步數據。</p>

            <h3>第四步：接收警報與分析</h3>
            <p>當系統偵測到值得關注的訊號（異常流量、話題升溫、高品質內容），它會主動推送通知。你也可以在面板上主動查看「熱詞趨勢」、「觀眾畫像」、「商業潛力預測」等分析報告。</p>

            {/* ── 適用場景 ── */}
            <h2>🎯 適用場景</h2>

            <h3>場景一：品牌聲量監測</h3>
            <p>你是品牌行銷人員，需要每天追蹤自家品牌和競爭對手在各社群平台的表現。SuperTrack 自動幫你收集數據、生成報告，發現異常第一時間通知。以前你要花兩小時手動刷五個平台，現在每天早上打開面板就什麼都知道了。</p>

            <h3>場景二：KOL 合作篩選</h3>
            <p>你在找適合合作的 KOL，但不知道誰的互動數據是真實的。SuperTrack 長期追蹤 KOL 的數據模式，能幫你判斷哪些帳號的互動率穩定、哪些有刷量嫌疑。你還可以看到 KOL 的跨平台表現，選出真正有影響力的合作對象。</p>

            <h3>場景三：熱點即時追蹤</h3>
            <p>你是內容創作者，需要快速回應社群熱點。SuperTrack 的異常警報讓你在熱點爆發的黃金 1-2 小時內就收到通知，而不是等到第二天從新聞裡才知道。你可以第一時間創作相關內容，搶佔話題窗口。</p>

            <h3>場景四：市場趨勢分析</h3>
            <p>你在做市場研究，需要了解某個領域的內容趨勢。SuperTrack 的時間軸和熱詞分析功能，讓你清楚看到「過去三個月 AI 繪圖相關內容的成長曲線」、「哪些子話題正在升溫」、「觀眾群體的畫像變化」。這些數據直接支援你的策略決策。</p>

            {/* ── 與其他模組的搭配 ── */}
            <h2>🔗 與其他模組的搭配</h2>

            <h3>SuperTrack → SuperScript：熱點自動注入劇本</h3>
            <p>SuperTrack 偵測到跟你劇本類型相關的社群熱點時，會主動推送給 SuperScript。例如，「短劇」相關話題突然升溫，SuperTrack 會建議 SuperScript 在下一集中加入短劇元素，提升內容的時效性和話題性。你可以一鍵接受建議，SuperScript 會自動調整大綱。</p>

            <h3>SuperTrack → SuperForge：高品質素材自動入庫</h3>
            <p>SuperTrack 在追蹤中發現的高品質視覺內容（爆款圖片、熱門設計風格），會自動推送進 SuperForge 知識庫。系統會把內容轉換成提示詞格式儲存，方便你下次創作直接參考。你也可以用 SuperForge 的語意搜尋找到「上次追蹤到的那個爆款帖子是什麼風格」。</p>

            <h3>SuperTrack → SuperTune：數據驅動的優化決策</h3>
            <p>SuperTrack 收集到的互動數據（哪種類型的內容互動率高、什麼時間發文效果最好、觀眾偏好什麼風格），會作為 SuperTune A/B 測試的基準數據。SuperTune 可以根據 SuperTrack 的實際數據來設計更精準的測試方案，而不是盲目猜測。</p>

            {/* ── 模擬面板 ── */}
            <h2>🖥️ 操作面板預覽</h2>
            <p>打開 SuperTrack，即時追蹤訊號一目了然。頂部是關鍵 KPI（追蹤帳號數、異常警報數、熱門話題數、情緒指數、抓取成功率、每分鐘訊號量），中間是追蹤中的帳號列表，底部是觀眾畫像、熱詞趨勢和商業潛力預測：</p>

            <div className="sim-panel">
              {/* Module Header */}
              <div className="sim-header">
                <div className="sim-header-left">
                  <span className="sim-icon">🛰️</span>
                  <span className="sim-title">SuperTrack</span>
                  <span className="sim-badge sim-badge--green">SIGNAL TRACKING</span>
                  <span className="sim-live"><span className="sim-dot sim-dot--green"></span> LIVE</span>
                </div>
                <div className="sim-header-right">
                  <button className="sim-btn">🔄 重試全部</button>
                  <button className="sim-btn sim-btn--outline">📤 匯出報告</button>
                </div>
              </div>

              {/* KPIs */}
              <p style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.6)', margin: '8px 0 4px' }}>即時 KPI 面板：追蹤中的帳號總數、當前活躍警報數、偵測到的熱門話題數、整體情緒指數（0-1，越高越正面）、爬蟲成功率、每分鐘收到的訊號量。</p>
              <div className="sim-kpis">
                <div className="sim-kpi"><div className="sim-kpi-label">entities</div><div className="sim-kpi-val">24</div></div>
                <div className="sim-kpi"><div className="sim-kpi-label">alerts</div><div className="sim-kpi-val sim-kpi-val--highlight">7</div><div className="sim-bar"><div className="sim-bar-fill sim-bar-fill--green" style={{ width: '47%' }}></div></div></div>
                <div className="sim-kpi"><div className="sim-kpi-label">hot_topics</div><div className="sim-kpi-val sim-kpi-val--highlight">12</div></div>
                <div className="sim-kpi"><div className="sim-kpi-label">sentiment</div><div className="sim-kpi-val">0.78</div><div className="sim-bar"><div className="sim-bar-fill sim-bar-fill--green" style={{ width: '78%' }}></div></div></div>
                <div className="sim-kpi"><div className="sim-kpi-label">crawl_rate</div><div className="sim-kpi-val">98.2%</div></div>
                <div className="sim-kpi"><div className="sim-kpi-label">signals/min</div><div className="sim-kpi-val">142</div></div>
              </div>

              {/* Entities */}
              <p style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.6)', margin: '12px 0 4px' }}>正在追蹤的帳號列表，每個項目顯示帳號名稱、類型（👤 個人 / 🏰 品牌），以及近期表現變化（上升百分比或 🔥 熱詞標記表示該帳號正處於話題高峰期）。</p>
              <div className="sim-card" style={{ marginTop: 12 }}>
                <div className="sim-card-head">📡 追蹤中的帳號</div>
                <div className="sim-entity-list">
                  <div className="sim-entity"><span className="sim-entity-icon">👤</span><span className="sim-entity-name">@design_daily</span><span className="sim-entity-metric sim-entity-metric--up">+12.4%</span></div>
                  <div className="sim-entity"><span className="sim-entity-icon">🏢</span><span className="sim-entity-name">BrandX Studio</span><span className="sim-entity-metric sim-entity-metric--alert">🔥 熱詞</span></div>
                  <div className="sim-entity"><span className="sim-entity-icon">👤</span><span className="sim-entity-name">@ai_creative</span><span className="sim-entity-metric sim-entity-metric--up">+8.7%</span></div>
                  <div className="sim-entity"><span className="sim-entity-icon">👤</span><span className="sim-entity-name">@cyberpunk_art</span><span className="sim-entity-metric">穩定</span></div>
                </div>
              </div>

              {/* 2-col: Audience + Trends */}
              <p style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.6)', margin: '12px 0 4px' }}>左側是追蹤對象的觀眾畫像分析——系統根據互動數據自動歸類出主要觀眾群體的年齡層、興趣和匹配度。右側是即時熱詞趨勢排行，搭配「一鍵注入腳本」按鈕可以直接把熱點送進 SuperScript。</p>
              <div className="sim-grid-2">
                <div className="sim-card">
                  <div className="sim-card-head">👥 觀眾畫像</div>
                  <div className="sim-audience">
                    <div className="sim-audience-row"><span className="sim-audience-avatar">🧑‍💻</span><div className="sim-audience-info"><div className="sim-audience-name">Z 世代數位原住民</div><div className="sim-audience-meta">18-25 · 影迷</div></div><span className="sim-audience-score" style={{ color: '#22c55e' }}>87%</span></div>
                    <div className="sim-audience-row"><span className="sim-audience-avatar">👨‍👩‍👧</span><div className="sim-audience-info"><div className="sim-audience-name">家庭觀影族群</div><div className="sim-audience-meta">30-45 · 闔家</div></div><span className="sim-audience-score" style={{ color: '#f59e0b' }}>74%</span></div>
                    <div className="sim-audience-row"><span className="sim-audience-avatar">🎬</span><div className="sim-audience-info"><div className="sim-audience-name">影評 / 影迷</div><div className="sim-audience-meta">25-50 · 核心</div></div><span className="sim-audience-score" style={{ color: '#22c55e' }}>81%</span></div>
                  </div>
                </div>

                <div className="sim-card">
                  <div className="sim-card-head">📡 熱詞趨勢</div>
                  <div className="sim-trend">
                    <div className="sim-trend-row"><span className="sim-trend-rank">#1</span><span className="sim-trend-name">賽博龐克 AI</span><div className="sim-bar"><div className="sim-bar-fill sim-bar-fill--red" style={{ width: '94%' }}></div></div><span className="sim-trend-heat">🔥340%</span></div>
                    <div className="sim-trend-row"><span className="sim-trend-rank">#2</span><span className="sim-trend-name">數位孿生倫理</span><div className="sim-bar"><div className="sim-bar-fill sim-bar-fill--amber" style={{ width: '78%' }}></div></div><span className="sim-trend-heat">🔥210%</span></div>
                    <div className="sim-trend-row"><span className="sim-trend-rank">#3</span><span className="sim-trend-name">短劇爆發期</span><div className="sim-bar"><div className="sim-bar-fill sim-bar-fill--amber" style={{ width: '72%' }}></div></div><span className="sim-trend-heat">↑185%</span></div>
                    <div className="sim-trend-row"><span className="sim-trend-rank">#4</span><span className="sim-trend-name">虛擬偶像 IP</span><div className="sim-bar"><div className="sim-bar-fill sim-bar-fill--amber" style={{ width: '65%' }}></div></div><span className="sim-trend-heat">↑142%</span></div>
                  </div>
                  <button className="sim-btn sim-btn--primary" style={{ marginTop: 8, width: '100%', textAlign: 'center' }}>💉 一鍵注入腳本</button>
                </div>
              </div>

              {/* ROI */}
              <p style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.6)', margin: '12px 0 4px' }}>商業潛力預測：系統根據觀眾契合度、類型匹配度和趨勢對齊度三個維度，預估投入產出比。這個數值幫助你判斷「追這個熱點值不值得」。</p>
              <div className="sim-card" style={{ marginTop: 12 }}>
                <div className="sim-card-head">💰 商業潛力預測</div>
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(148,163,184,0.4)' }}>ROI PREDICT</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', fontFamily: "'JetBrains Mono', monospace" }}>3.2×</div>
                </div>
                <div className="sim-net-metrics">
                  <div className="sim-net-row"><span>audience_fit</span><div className="sim-bar"><div className="sim-bar-fill sim-bar-fill--green" style={{ width: '84%' }}></div></div><span>0.84</span></div>
                  <div className="sim-net-row"><span>genre_match</span><div className="sim-bar"><div className="sim-bar-fill sim-bar-fill--green" style={{ width: '91%' }}></div></div><span>0.91</span></div>
                  <div className="sim-net-row"><span>trend_align</span><div className="sim-bar"><div className="sim-bar-fill sim-bar-fill--green" style={{ width: '73%' }}></div></div><span>0.73</span></div>
                </div>
              </div>
            </div>

            {/* ── 合規聲明 ── */}
            <h2>{t('h_compliance')}</h2>
            <ul>
              <li>{t('co_1')}</li>
              <li>{t('co_2')}</li>
              <li>{t('co_3')}</li>
              <li>{t('co_4')}</li>
            </ul>

          </article>

          <DocFooter t={t} lang={lang} />
        </div>
      </main>
    </DocLayout>
  )
}
