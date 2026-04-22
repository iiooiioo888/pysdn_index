import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DocLayout } from '../../components/docs/DocLayout'
import { DocNavbar } from '../../components/docs/DocNavbar'
import { DocFooter } from '../../components/docs/DocFooter'
import { DocReadingSummary } from '../../components/docs/DocReadingSummary'
import { DocMermaid } from '../../components/docs/DocMermaid'
import { SUPERTRACK_FLOW, SUPERTRACK_MINDMAP } from '../../components/docs/mermaidCharts'
import { useDocBundle } from '../../hooks/useDocBundle'
import { PATHS } from '../../routes/paths'
import { toLangSearch } from '../../routes/langQuery'

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
              <h3>系統分層（思維導圖）</h3>
              <p className="doc-diagram-lead">
                從追蹤目標、擷取、分析到對其他模組輸出，對照下文各小節與資料流圖。
              </p>
              <DocMermaid chart={SUPERTRACK_MINDMAP} />
            </div>

            <h2>{t('h_overview')}</h2>
            <p>SuperTrack 是 Pysdn SuperCool 生態系中的獨立擴展模組，專門為 SuperForge 提示詞引擎提供外部資訊採集能力。它的核心定位很明確：<strong>在公開網路中持續監測特定目標（人、品牌、話題），把散落在各平台的碎片化資訊匯聚、清洗、結構化，最終轉化為可直接使用的創作素材。</strong></p>
            <p>它解決的問題是：創作者和行銷人員每天花大量時間刷各個社群平台找靈感、盯競品、追熱點，但這些資訊既分散又稍縱即逝。SuperTrack 把這個「手動刷→人腦記→下次找不到」的低效循環，變成「系統刷→結構化存→隨時搜到」。</p>

            <h2>{t('h_components')}</h2>

            <h3>跨平台身份合併：散落的碎片拼成完整畫像</h3>
            <p>同一個人可能在小紅書叫「@設計日常」、在 Instagram 叫「@design.daily」、在 Twitter 叫「@designer_daily」。SuperTrack 會自動比對帳號資訊（頭像相似度、Bio 交叉引用、內容風格匹配），把不同平台的帳號合併成同一個追蹤對象。你看到的不是三個散落的碎片，而是一個人物/品牌的完整跨平台畫像。</p>
            <p>合併判定基於四維比對演算法：<strong>頭像相似度</strong>（圖像特徵向量比對）、<strong>Bio 交叉引用</strong>（檢查簡介中是否有其他平台連結）、<strong>內容風格匹配</strong>（AI 分析語氣、用詞、視覺風格）、<strong>發文時間關聯</strong>（同步運營模式識別）。系統為每次合併計算置信度分數：90%+ 自動合併，70-89% 建議合併，50-69% 待確認。</p>
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
            <p>你可以設定抓取頻率（最快每 5 分鐘，最慢每 24 小時）、抓取深度（只抓標題和摘要，還是抓全文和圖片描述）、以及觸發條件（有新帖才抓、有高互動才抓、或定時全量抓取）。平均抓取成功率 98.2%。</p>
            <div className="doc-example">
              <div className="doc-example-label">💡 實際場景</div>
              <p>設定追蹤「@design_daily」的小紅書帳號。每 30 分鐘自動檢查一次，有新帖就抓回來，沒新帖就安靜等著。抓取的內容包括：帖子標題、全文、圖片描述（AI 自動生成）、互動數據（讚、收藏、評論數）、發文時間。平均抓取成功率 98.2%。</p>
            </div>

            <h3>模擬真人行為：不觸發反爬機制</h3>
            <p>這是 SuperTrack 跟傳統爬蟲最大的差別。傳統爬蟲用固定間隔發 HTTP 請求，很容易被平台識別為機器人而封鎖。SuperTrack 的行為引擎會模擬真人的滑手機節奏：</p>
            <ul>
              <li><strong>滾動節奏模擬</strong>：不是均速滾動，而是快滑幾下→停下來看一會兒→再慢滑。每段持續時間帶有隨機變異（泊松分布），符合真人滑手機的統計特徵</li>
              <li><strong>隨機停留策略</strong>：在影片內容上停留更久、在不感興趣的內容上快速划過，偶爾在不感興趣的內容上也停一下（模擬「看了一下才發現不感興趣」）</li>
              <li><strong>間隔變異</strong>：每次抓取之間的時間間隔在設定範圍內隨機波動（基礎間隔 ± 30%），偶爾有長間隔（模擬睡覺）和短間隔連發（模擬空閒刷手機），符合 Weibull 分布</li>
              <li><strong>行為指紋</strong>：每次訪問攜帶不同的瀏覽器指紋特徵（User-Agent 變體、螢幕解析度、時區、字體列表、WebGL/Canvas 指紋），避免被平台通過指紋關聯識別</li>
            </ul>
            <p>如果某個平台更新了反爬策略，SuperTrack 有三層自適應機制：第一層監控成功率，跌破閾值時進入調整模式；第二層自動切換行為模式（調整滾動速度、更換指紋、增加隨機互動）；第三層降頻告警，通知用戶「這個平台最近抓取不太順」。你不需要手動維護任何爬蟲規則。</p>

            <h3>時間軸回溯：任何時間點的內容都能查</h3>
            <p>所有抓到的內容按時間排好，形成一條完整的時間軸。每條記錄包含：原始內容（文字、圖片 URL）、AI 生成的圖片描述和內容摘要、互動數據快照（按時間點記錄）、平台來源和帳號標識、自動提取的標籤和分類。</p>
            <p>你可以回溯「上個月這位 KOL 發了什麼」、「品牌 X 最近三個月的行銷節奏」、「某個話題是從哪天開始升溫的」。時間軸支援按平台、按帳號、按話題、按內容類型（圖文/短影片/直播回放）交叉篩選，以及多帳號/多話題的趨勢對比分析。</p>

            <h3>異常警報：第一時間知道發生什麼事</h3>
            <p>SuperTrack 會持續分析追蹤對象的數據模式，建立動態基線（取最近 7-30 天的滑動窗口計算平均值和標準差）。當偵測到異常，系統會立刻發送通知：</p>
            <ul>
              <li><strong>流量異常</strong>：曝光量突然暴增（可能是被推薦算法選中）。按偏離程度分為 🟡 注意（1.5-3x）、🟠 關注（3-5x）、🔴 緊急（5x+）</li>
              <li><strong>互動率異常</strong>：單篇內容的互動率超過歷史均值 N 個標準差（可能是內容觸發了情緒共鳴）</li>
              <li><strong>話題升溫</strong>：某個關鍵詞的提及量在短時間內快速上升（過去 1 小時 vs 24 小時均值）</li>
              <li><strong>情感轉折</strong>：對某品牌/人物的整體情感分數急劇偏移（危機信號或公關成功）</li>
            </ul>
            <p>通知方式支援 <strong>Webhook 推送</strong>（接到你自己的系統）、<strong>Email</strong>（每日摘要 + 緊急即時）、以及<strong>平台內通知面板</strong>。你可以自訂警報閾值——絕對值（「讚數超過 10,000」）、相對值（「超過平時 3 倍」）、變化率（「24 小時增長超過 5%」）或組合條件。</p>
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
            <p>SuperTrack 不只是「抓」內容，還會「篩」內容。系統會用 AI 分析每篇帖子的品質分數，基於三個維度：</p>
            <ul>
              <li><strong>原創度</strong>：比對該內容與之前採集到的其他內容的相似度，判斷是原創還是搬運</li>
              <li><strong>互動潛力</strong>：根據標題吸引力、視覺品質、話題性，預估可能獲得的互動量</li>
              <li><strong>內容深度</strong>：表面資訊還是有深度觀點？深度內容對創作靈感的參考價值更大</li>
            </ul>
            <p>三個維度加權後得到綜合品質分數。高分內容被 AI 結構化整理後，自動推送進 SuperForge 提示詞庫。每條提示詞附帶元數據：來源帳號、原始互動數據、採集時間、品質分數。你也可以手動標記「這篇很好，存進 SuperForge」，系統會學習你的偏好，未來的自動篩選會更精準。</p>

            <div className="doc-diagram-block">
              <h3>端到端資料流</h3>
              <p className="doc-diagram-lead">
                爬蟲→正規化→合併與時間軸→異常與品質分支→對 SuperForge／SuperScript／SuperTune
                的輸出。
              </p>
              <DocMermaid chart={SUPERTRACK_FLOW} />
            </div>

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
            <p>打開 SuperTrack，在「新增追蹤」頁面中選擇你要追蹤的類型：<strong>帳號</strong>（輸入目標帳號的 URL 或用戶名，系統自動識別平台並搜尋同名帳號）、<strong>話題</strong>（輸入關鍵字或 hashtag，支援多個同義詞）、或<strong>品牌</strong>（輸入品牌名稱，系統自動搜尋多平台帳號 + UGC 提及）。可以一次新增多個目標，也支援從 CSV 匯入追蹤列表。</p>

            <h3>第二步：設定抓取參數</h3>
            <p>為每個追蹤目標設定抓取頻率（每 5 分鐘到每 24 小時）、抓取深度（摘要模式：只抓標題和互動數；完整模式：抓全文、圖片描述、評論）、以及警報閾值（什麼程度的異常要通知你）。如果你不確定怎麼設定，用預設值就好——SuperTrack 的預設參數已經經過大量實測驗證，適合大多數場景。</p>

            <h3>第三步：等待第一個訊號</h3>
            <p>設定完成後，SuperTrack 開始在背景運作。第一輪抓取通常在 5-15 分鐘內完成（取決於目標數量和平台）。你可以在面板上即時看到抓取進度和初步數據。</p>

            <h3>第四步：接收警報與分析</h3>
            <p>當系統偵測到值得關注的訊號（異常流量、話題升溫、高品質內容），它會主動推送通知。你也可以在面板上主動查看「熱詞趨勢」、「觀眾畫像」、「商業潛力預測」等分析報告，或使用時間軸回溯查詢任意時間範圍的內容。</p>

            {/* ── 適用場景 ── */}
            <h2>🎯 適用場景</h2>

            <h3>場景一：品牌聲量監測</h3>
            <p>你是品牌行銷人員，需要每天追蹤自家品牌和競爭對手在各社群平台的表現。以前你要花兩小時手動刷五個平台，現在每天早上打開面板就什麼都知道了——互動率對比、用戶評價情感、競品做了什麼活動，全部一目了然。系統還會自動生成週報/月報，省去手動整理數據的時間。</p>

            <h3>場景二：KOL 合作篩選</h3>
            <p>你在找適合合作的 KOL，但不知道誰的互動數據是真實的。SuperTrack 長期追蹤 KOL 的數據模式，能幫你判斷哪些帳號的互動率穩定（真實影響力）、哪些有刷量嫌疑（數據突然暴增暴跌、評論內容高度重複等異常模式）。你還可以看到 KOL 的跨平台表現和受眾畫像匹配度，選出真正有影響力且受眾契合的合作對象。</p>

            <h3>場景三：熱點即時追蹤</h3>
            <p>你是內容創作者，需要快速回應社群熱點。SuperTrack 的異常警報讓你在熱點爆發的黃金 1-2 小時內就收到通知，而不是等到第二天從新聞裡才知道。商業潛力預測（3.2× 的 ROI？追！0.5×？算了）幫你判斷哪個熱點值得投入精力，一鍵注入 SuperScript 可以直接在劇本中加入熱點元素。</p>

            <h3>場景四：市場趨勢分析</h3>
            <p>你在做市場研究，需要了解某個領域的內容趨勢。SuperTrack 的時間軸和熱詞分析功能，讓你清楚看到「過去三個月 AI 繪圖相關內容的成長曲線」、「哪些子話題正在升溫」、「觀眾群體的畫像變化」。這些數據直接支援你的策略決策，做報告時有真實數據支撐。</p>

            {/* ── 與其他模組的搭配 ── */}
            <h2>🔗 與其他模組的搭配</h2>

            <h3>SuperTrack → SuperScript：熱點自動注入劇本</h3>
            <p>SuperTrack 偵測到跟你劇本類型相關的社群熱點時，會主動推送給 SuperScript。系統根據語意匹配度（{'>'}70%）和熱度評級（🔥🔥🔥 以上）判斷是否相關，並提供 AI 建議的融入方式（「可以在第 3 集加入 XX 元素」）和預估的時效性窗口。你可以一鍵接受建議，SuperScript 會自動調整大綱。</p>

            <h3>SuperTrack → SuperForge：高品質素材自動入庫</h3>
            <p>SuperTrack 在追蹤中發現的高品質視覺內容（爆款圖片、熱門設計風格），會自動推送進 SuperForge 知識庫。流程：原始圖片 → AI 生成風格描述（構圖、色調、元素、情緒）→ 轉換成提示詞格式 → 附帶來源帳號和互動數據 → 存入 SuperForge「SuperTrack 採集」分類。系統會自動去重和品質過濾，避免知識庫被低品質內容污染。</p>

            <h3>SuperTrack → SuperTune：數據驅動的優化決策</h3>
            <p>SuperTrack 收集到的互動數據（哪種類型的內容互動率高、什麼時間發文效果最好、觀眾偏好什麼風格），會作為 SuperTune A/B 測試的基準數據。SuperTune 可以根據 SuperTrack 的實際數據來設計更精準的測試方案（「帶有人臉的縮圖互動率比純產品圖高 47%」→ 設計對應的 A/B 測試），而不是盲目猜測。測試結果也會反饋給 SuperTrack，用於校準預測模型。</p>

            <h2>🖥️ 操作面板預覽</h2>
            <p>KPI、帳號、觀眾、熱詞、ROI 等模組的完整佈局已放於獨立實驗室頁，含警報表與加長趨勢清單（示範用）。</p>
            <p>
              <Link className="doc-lab-cta" to={{ pathname: PATHS.labs.supertrack, search: toLangSearch(lang) }}>
                開啟 SuperTrack 儀表板（示範資料）→
              </Link>
            </p>

            {/* ── 合規聲明 ── */}
            <h2>{t('h_compliance')}</h2>
            <p>SuperTrack 的設計從一開始就以合規為前提。以下是四條不可逾越的紅線：</p>
            <ul>
              <li><strong>只追蹤公開資訊</strong> — 不碰私密帳號、不繞過權限。如果目標帳號設為私密，系統會跳過並標註「私密帳號，無法追蹤」。不涉及私訊、封閉群組、付費牆後的內容</li>
              <li><strong>遵守網站爬蟲規範</strong> — 嚴格遵守 robots.txt（Disallow 的路徑不觸碰、尊重 Crawl-delay）。抓取頻率控制在合理範圍（最低 5 分鐘間隔且帶隨機波動），不對目標伺服器造成負擔。平台明確禁止自動化採集時，SuperTrack 會禁用該平台並告知用戶</li>
              <li><strong>敏感資料自動脫敏</strong> — 個人聯絡方式（電話、Email、地址）、身份識別資訊（身分證號、護照號）、未成年人相關資訊等敏感欄位自動遮蔽為 [REDACTED]。涉及未成年人的內容標記為高敏感，不推送進公開分類</li>
              <li><strong>使用條款明確標註</strong> — 用戶需自行遵守各平台使用條款。本服務產出僅供個人創作參考和合法商業用途，不得用於不得用於騷擾、誹謗、侵犯隱私或任何違法用途。用戶對自身使用方式負全部責任</li>
            </ul>

            {/* ── 技術背景 ── */}
            <h2>{t('h_stack')}</h2>
            <ul>
              <li><strong>儲存</strong>：PostgreSQL（帳號元數據、追蹤配置、警報記錄）+ 時間序列資料庫（互動數據的時間序列，支援高效時間範圍查詢和聚合）+ 向量搜尋引擎（內容語意向量化，支援「找類似風格」的語意搜尋和重複內容檢測）</li>
              <li><strong>採集</strong>：模擬真人瀏覽器引擎（Python + Playwright/Selenium）+ 行為模式庫（預定義的多種真人瀏覽模式）+ 自適應調度器（三層自適應：成功率監控→行為調整→降頻告警）+ Redis/RabbitMQ 任務佇列（支援優先級排程）</li>
              <li><strong>分析</strong>：NLP 引擎（情感分析、關鍵詞提取、主題分類）+ 圖像理解（AI 自動生成圖片描述、風格分類）+ 異常偵測（Z-score / IQR 動態基線）+ 品質評分模型（原創度 + 互動潛力 + 內容深度）</li>
              <li><strong>部署</strong>：Windows 服務（開機自動啟動、後台持續運作）+ 本地儲存（AES-256 加密，確保隱私和資料主權）+ 雲端同步（可選，端到端加密）</li>
            </ul>

          </article>

          <DocFooter t={t} lang={lang} />
        </div>
      </main>
    </DocLayout>
  )
}
