/**
 * SuperTrack 工程／調研內容（維護於本元件與 public/supertrack.html，不再依賴 SuperTrack_Documentation.md）。
 */
const ARCHITECTURE_TREE = `統一排程層（自研）
│
├── 國內平台採集層
│   ├── Spider_XHS ──── 小紅書（採集＋發布）
│   ├── MediaCrawler ── 抖音／快手／B 站／微博
│   ├── wx_channels ─── 微信影片號（半自動）
│   └── wechat-mp ──── 微信公眾號（半自動）
│
├── 國際平台採集層
│   ├── Douyin_TikTok_API ─ TikTok
│   ├── instaloader ──── Instagram
│   ├── yt-dlp ───────── YouTube
│   ├── snscrape ─────── X／Facebook／Reddit／Telegram
│   └── Crawl4AI ─────── Threads／LinkedIn／通用兜底
│
├── 資料標準化層
│   └── 統一 JSON Schema（平台／類型／作者／時間／內容／互動資料）
│
└── 儲存與分析層
    └── SQLite／PostgreSQL＋可選 Elasticsearch`

export function SuperTrackEngineeringSection() {
  return (
    <section className="doc-engineering" id="engineering" aria-labelledby="engineering-title">
      <h2 id="engineering-title">工程架構與調研參考</h2>
      <p className="doc-diagram-lead">
        以下為產品工程視角之<strong>統一調度層</strong>、<strong>開源工具選型</strong>與倉庫內 <strong>SocialCrawler</strong> 後端說明（僅供技術規劃，不代表已整合第三方專案）。
      </p>

      <h3>統一調度層與資料架構（概念）</h3>
      <ul>
        <li>
          <strong>任務產生</strong>：依追蹤目標與頻率產生抓取任務。
        </li>
        <li>
          <strong>佇列與分發</strong>：優先級佇列（如 Redis／RabbitMQ）；工作節點拉取。
        </li>
        <li>
          <strong>執行與節流</strong>：行為模式、瀏覽器或 HTTP adapter；令牌桶／自適應頻率。
        </li>
        <li>
          <strong>Adapter 層</strong>：各平台可替換實作，調度層只處理統一任務描述與 DTO。
        </li>
        <li>
          <strong>資料流</strong>：原始資料 → 結構化（實體／時序／向量）→ 分析、警報、下游模組。
        </li>
      </ul>
      <p className="doc-diagram-lead">調研用整合架構樹狀示意：</p>
      <pre>{ARCHITECTURE_TREE}</pre>

      <h3>完整社群媒體採集工具清單（調研彙整）</h3>
      <p className="doc-diagram-lead">
        共列具代表專案（約 14 項），涵蓋國內外主流社媒；連結以各倉庫 README 為準，使用前請自行法遵評估。
      </p>

      <h4>一、小紅書專用</h4>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>專案</th>
              <th>說明</th>
              <th>特色</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a href="https://github.com/cv-cat/Spider_XHS" target="_blank" rel="noopener noreferrer">
                  Spider_XHS
                </a>
              </td>
              <td>小紅書全棧方案</td>
              <td>採集＋發布＋蒲公英／千帆等（以倉庫為準）</td>
            </tr>
            <tr>
              <td>
                <a href="https://github.com/JoeanAmier/XHS-Downloader" target="_blank" rel="noopener noreferrer">
                  XHS-Downloader
                </a>
              </td>
              <td>下載／採集工具</td>
              <td>無浮水印、MCP／API、Docker、剪貼簿監聽等</td>
            </tr>
            <tr>
              <td>
                <a href="https://github.com/ReaJason/xhs" target="_blank" rel="noopener noreferrer">
                  xhs
                </a>
              </td>
              <td>輕量 Python 庫</td>
              <td>
                <code>pip install xhs</code>
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://github.com/Cloxl/xhshow" target="_blank" rel="noopener noreferrer">
                  xhshow
                </a>
              </td>
              <td>簽名純算</td>
              <td>
                <code>pip install xhshow</code>，產生 x-s 等
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://github.com/xpzouying/xiaohongshu-mcp" target="_blank" rel="noopener noreferrer">
                  xiaohongshu-mcp
                </a>
              </td>
              <td>MCP Server</td>
              <td>AI 助手操作搜尋、發布、評論等</td>
            </tr>
            <tr>
              <td>
                <a href="https://github.com/xpzouying/x-mcp" target="_blank" rel="noopener noreferrer">
                  x-mcp
                </a>
              </td>
              <td>瀏覽器外掛 MCP</td>
              <td>零環境、裝外掛即用</td>
            </tr>
            <tr>
              <td>
                <a href="https://github.com/leeguooooo/xhs-skill" target="_blank" rel="noopener noreferrer">
                  XhsSkills／xhs-skill
                </a>
              </td>
              <td>Agent Skills</td>
              <td>Clawbot／Claude Code 等生態</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4>二、抖音／TikTok</h4>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>專案</th>
              <th>說明</th>
              <th>特色</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a href="https://github.com/Evil0ctal/Douyin_TikTok_Download_API" target="_blank" rel="noopener noreferrer">
                  Douyin_TikTok_Download_API
                </a>
              </td>
              <td>抖音＋TikTok＋快手＋B 站等</td>
              <td>非同步、API、批次解析、X-Bogus 等</td>
            </tr>
            <tr>
              <td>
                <a href="https://github.com/NanmiCoder/MediaCrawler" target="_blank" rel="noopener noreferrer">
                  MediaCrawler
                </a>
              </td>
              <td>多平台（含抖音）</td>
              <td>Playwright 自動化</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4>三、海外平台</h4>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>專案</th>
              <th>涵蓋</th>
              <th>說明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a href="https://github.com/JustAnotherArchivist/snscrape" target="_blank" rel="noopener noreferrer">
                  snscrape
                </a>
              </td>
              <td>X、IG、Reddit、TG、FB、VK、微博等</td>
              <td>
                <code>pip install snscrape</code>
              </td>
            </tr>
            <tr>
              <td>
                <a href="https://github.com/mikf/gallery-dl" target="_blank" rel="noopener noreferrer">
                  gallery-dl
                </a>
              </td>
              <td>300+ 圖站</td>
              <td>批次下載</td>
            </tr>
            <tr>
              <td>
                <a href="https://github.com/instaloader/instaloader" target="_blank" rel="noopener noreferrer">
                  instaloader
                </a>
              </td>
              <td>Instagram</td>
              <td>profile／hashtag／story 等</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4>四、多平台綜合／輔助</h4>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>專案</th>
              <th>涵蓋／用途</th>
              <th>特色</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>MediaCrawler</td>
              <td>小紅書／抖音／快手／B 站／微博／貼吧／知乎</td>
              <td>WebUI、代理池、多儲存</td>
            </tr>
            <tr>
              <td>
                <a href="https://github.com/666ghj/MindSpider" target="_blank" rel="noopener noreferrer">
                  MindSpider
                </a>
              </td>
              <td>多平台＋新聞源</td>
              <td>AI 熱點→深度擷取（維護狀態以倉庫為準）</td>
            </tr>
            <tr>
              <td>
                <a href="https://github.com/iszhouhua/social-media-copilot" target="_blank" rel="noopener noreferrer">
                  social-media-copilot
                </a>
              </td>
              <td>小紅書／抖音／快手等</td>
              <td>Chrome 外掛、API</td>
            </tr>
            <tr>
              <td>
                <a href="https://tikhub.io/" target="_blank" rel="noopener noreferrer">
                  TikHub.io
                </a>
              </td>
              <td>商業 API（14+ 平台）</td>
              <td>付費、免自建爬蟲</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4>依需求速查（調研）</h4>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>需求</th>
              <th>建議參考</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>小紅書全棧</td>
              <td>Spider_XHS</td>
            </tr>
            <tr>
              <td>小紅書批次下載無浮水印</td>
              <td>XHS-Downloader</td>
            </tr>
            <tr>
              <td>小紅書接 AI Agent</td>
              <td>xiaohongshu-mcp、x-mcp 或 XhsSkills（xhs-skill）</td>
            </tr>
            <tr>
              <td>抖音／TikTok 採集＋下載</td>
              <td>Douyin_TikTok_Download_API</td>
            </tr>
            <tr>
              <td>國內多平台批次</td>
              <td>MediaCrawler</td>
            </tr>
            <tr>
              <td>AI 輿情</td>
              <td>MindSpider</td>
            </tr>
            <tr>
              <td>零程式取數</td>
              <td>social-media-copilot 或 XHS-Downloader</td>
            </tr>
            <tr>
              <td>IG 圖片</td>
              <td>instaloader 或 gallery-dl</td>
            </tr>
            <tr>
              <td>X／Reddit／TG</td>
              <td>snscrape</td>
            </tr>
            <tr>
              <td>不想自建海外爬蟲</td>
              <td>TikHub（付費）</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="social-crawler-backend">SocialCrawler 參考後端（倉庫內）</h3>
      <p>
        路徑：<code>social-crawler/</code> — Python 套件 <code>social_crawler</code>，提供 CLI（<code>init</code>／<code>crawl</code>／<code>list</code>／
        <code>serve</code>）、FastAPI（預設 <code>:8000</code>，與前端 Vite <code>/api</code> 代理對齊）、SQLite／JSONL、調度器（令牌桶、優先級佇列、指數退避）。
      </p>
      <p>
        <strong>demo</strong> 適配器可無外網驗證管線；其餘平台已註冊骨架類別，待填入 <code>search</code> 實作。詳見該目錄 <code>README.md</code>。
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>項目</th>
              <th>狀態（快照）</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>FastAPI <code>/api/health</code>、<code>/api/crawl</code> 等</td>
              <td>已提供</td>
            </tr>
            <tr>
              <td>調度器重試</td>
              <td>已提供（骨架錯誤不重試）</td>
            </tr>
            <tr>
              <td>各平台擷取邏輯</td>
              <td>多數為骨架，待實作</td>
            </tr>
            <tr>
              <td>WebUI</td>
              <td>未提供</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
