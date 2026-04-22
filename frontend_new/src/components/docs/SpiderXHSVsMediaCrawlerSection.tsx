/**
 * Spider_XHS 與 MediaCrawler 功能對照與整合建議（技術調研用，非產品規格）。
 */
export function SpiderXHSVsMediaCrawlerSection() {
  return (
    <section className="doc-tool-compare" id="spider-xhs-vs-mediacrawler" aria-labelledby="tool-compare-title">
      <div className="doc-excerpt-disclaimer" role="note">
        <p>
          <strong>說明</strong>：以下為兩個<strong>第三方開源專案</strong>之對照整理，僅供選型與架構討論；功能以各倉庫 README／程式為準，Pysdn／SuperTrack 不保證其正確性或持續維護。
        </p>
      </div>

      <h2 id="tool-compare-title">Spider_XHS 與 MediaCrawler：功能對照</h2>

      <h3>定位差異</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th />
              <th scope="col">Spider_XHS</th>
              <th scope="col">MediaCrawler</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">定位</th>
              <td>小紅書<strong>專精</strong>全端工具（採集 + 發布 + 商業後台場景）</td>
              <td>多平台<strong>通用</strong>爬蟲框架</td>
            </tr>
            <tr>
              <th scope="row">覆蓋平台</th>
              <td>僅小紅書（含創作者／蒲公英／千帆等 README 宣稱場景）</td>
              <td>小紅書、抖音、快手、B 站、微博、貼吧、知乎（7 個平台）</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Spider_XHS 獨有（或顯著偏重）</h3>
      <ul>
        <li>
          <strong>內容發布</strong>：經創作者平台上傳圖集／影片（<strong>寫入</strong>操作）
        </li>
        <li>
          <strong>蒲公英</strong>：KOL 列表、粉絲畫像、歷史趨勢、發起合作邀請
        </li>
        <li>
          <strong>千帆</strong>：分銷商列表、合作品類／店鋪／商品資訊
        </li>
        <li>
          <strong>簽名逆向</strong>：README 宣稱還原 <code>x-s</code>／<code>x-t</code>／<code>x-s-common</code> 等，以{' '}
          <strong>HTTP 直連</strong>為主、不依賴瀏覽器執行頁面
        </li>
        <li>
          <strong>訊息中心</strong>：未讀、留言 @ 提醒、按讚收藏、新增關注等
        </li>
        <li>
          <strong>AI Agent Skills</strong>：<strong>XhsSkills</strong> 等倉庫，聲稱可被 Clawbot／Claude Code／Codex 等引入（以原專案為準）
        </li>
      </ul>

      <h3>MediaCrawler 獨有（或顯著偏重）</h3>
      <ul>
        <li>
          <strong>多平台</strong>：同一套框架覆蓋 7 個主流平台
        </li>
        <li>
          <strong>Playwright／CDP</strong>：瀏覽器自動化；README 強調<strong>無需自行逆向簽名演算法</strong>，技術門檻相對低
        </li>
        <li>
          <strong>IP 代理池</strong>：內建代理輪換（以 README 為準）
        </li>
        <li>
          <strong>WebUI</strong>：瀏覽器內操作，降低純指令列門檻
        </li>
        <li>
          <strong>留言文字雲</strong>：自動產生視覺化
        </li>
        <li>
          <strong>多種儲存</strong>：CSV／JSON／JSONL／Excel／SQLite／MySQL 等
        </li>
        <li>
          <strong>登入態快取</strong>：二維碼／手機驗證碼登入後保存、重複使用（以原專案為準）
        </li>
      </ul>

      <h3>兩者在小紅書場景的重疊（README 常見能力）</h3>
      <ul>
        <li>關鍵字搜尋／指定貼文／筆記詳情（含無浮水印圖片／影片等表述）</li>
        <li>使用者主頁資訊</li>
        <li>留言擷取（含二級留言）</li>
        <li>二維碼登入</li>
        <li>
          <strong>Python + Node.js</strong> 技術棧
        </li>
      </ul>

      <h3>選型建議</h3>
      <ul>
        <li>
          <strong>只要小紅書</strong>，且需要<strong>發布</strong>或<strong>商業資料</strong>（蒲公英、千帆）→ 傾向 <strong>Spider_XHS</strong>（深度與寫入能力較完整）
        </li>
        <li>
          <strong>要多平台</strong>，且不想維護簽名逆向 → 傾向 <strong>MediaCrawler</strong>（覆蓋面廣、Playwright 路線上手較直覺）
        </li>
        <li>
          <strong>接 AI Agent 做自動化營運</strong> → Spider_XHS 有公開的 Skills 敘事；MediaCrawler README 提及 <strong>Pro 版</strong>亦支援 Agent
          Skill（與開源版不同，需自行判斷）
        </li>
      </ul>

      <h3>兩者可以整合嗎？</h3>
      <p>
        <strong>技術上可以</strong>，但<strong>不是簡單合併程式碼</strong>，需做架構取捨。核心原因：兩者對小紅書的<strong>技術路線不同</strong>，底層實作<strong>無法直接互換</strong>。
      </p>

      <h4>核心矛盾</h4>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th />
              <th scope="col">Spider_XHS</th>
              <th scope="col">MediaCrawler</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">擷取方式</th>
              <td>HTTP 直連 + 簽名參數計算</td>
              <td>Playwright 瀏覽器自動化</td>
            </tr>
            <tr>
              <th scope="row">簽名處理</th>
              <td>
                Python／Node 計算 <code>x-s</code>／<code>x-t</code> 等
              </td>
              <td>於瀏覽器上下文以 JS 注入等方式取得（README 表述）</td>
            </tr>
            <tr>
              <th scope="row">依賴</th>
              <td>相對輕量，不需常駐 Chromium</td>
              <td>依賴瀏覽器環境，資源與維運成本較高</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>可行整合方向</h3>

      <h4>方案一：依模組引用（建議）</h4>
      <p>將兩者視為<strong>元件庫</strong>，上層自寫薄適配層，統一資料格式與呼叫方式：</p>
      <pre>
        <code>{`你的專案
├── 多平台採集 → MediaCrawler（抖音／B 站／微博／知乎…）
├── 小紅書採集 → Spider_XHS（HTTP 較輕、與其 API 對齊）
├── 小紅書發布 → Spider_XHS（README 獨有寫入能力）
├── 蒲公英／千帆 → Spider_XHS
└── 統一層 → 自訂 adapter（DTO、錯誤碼、重試策略）`}</code>
      </pre>
      <p>實務上常是：<strong>小紅書相關優先 Spider_XHS</strong>，<strong>其他平台走 MediaCrawler</strong>。</p>

      <h4>方案二：Fork 後統一架構</h4>
      <p>若目標是<strong>單一倉庫長期維護</strong>：</p>
      <ol>
        <li>採集層保留兩套實作（HTTP 簽名 + Playwright），以設定切換</li>
        <li>儲存層可沿用 MediaCrawler 多後端方案</li>
        <li>發布／商業平台以 Spider_XHS 模組併入</li>
        <li>排程／WebUI 可複用 MediaCrawler 的介面思路</li>
      </ol>
      <p>工作量高，但可換取統一設定、日誌與營運介面。</p>

      <h4>方案三：Agent 層整合</h4>
      <p>
        若目標是 <strong>AI 自動化</strong>：在 Agent 將兩者註冊為<strong>兩個工具</strong>分別呼叫即可，未必需要合併原始碼。Spider_XHS 有 Skills 敘事；MediaCrawler Pro 亦提及
        Agent Skill（與開源版需區分）。
      </p>

      <h4>難度與適用場景（摘要）</h4>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>方案</th>
              <th>難度</th>
              <th>較適合</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>方案一（模組引用）</td>
              <td>低</td>
              <td>快速驗證、不想維護巨型單體</td>
            </tr>
            <tr>
              <td>方案二（Fork 合併）</td>
              <td>高</td>
              <td>長期產品化、團隊有資源維護統一架構</td>
            </tr>
            <tr>
              <td>方案三（Agent 整合）</td>
              <td>低</td>
              <td>以智慧體編排為中心，接受多後端並存</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="doc-diagram-lead">
        若僅個人使用，<strong>方案一</strong>通常最務實：兩邊分別安裝，小紅書走 Spider_XHS、其他平台走 MediaCrawler，再以腳本或佇列統一排程；不必強行把架構迥異的專案硬合成一個 binary。
      </p>
    </section>
  )
}
