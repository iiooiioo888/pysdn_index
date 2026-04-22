/**
 * 節錄整理自社群開源專案 MediaCrawler README（https://github.com/NanmiCoder/MediaCrawler），
 * 僅供技術調研；與 Pysdn／SuperTrack 無官方整合或背書。
 */
const REPO_HREF = 'https://github.com/NanmiCoder/MediaCrawler'

const PLATFORM_FEATURES: { platform: string }[] = [
  { platform: '小紅書' },
  { platform: '抖音' },
  { platform: '快手' },
  { platform: 'B 站' },
  { platform: '微博' },
  { platform: '百度貼吧' },
  { platform: '知乎' },
]

/** README 功能矩陣欄位（各列皆為 ✅，狀態以原專案為準） */
const FEATURE_COLUMNS = [
  '關鍵字搜尋',
  '指定貼文 ID 擷取',
  '二級留言',
  '指定創作者主頁',
  '登入態快取',
  'IP 代理池',
  '產生留言文字雲',
] as const

const CODE_UV_SEARCH = `cd MediaCrawler
uv sync
uv run main.py --platform xhs --lt qrcode --type search`

const CODE_UV_DETAIL = `uv run main.py --platform xhs --lt qrcode --type detail`

const CODE_WEBUI = `uv run uvicorn api.main:app --port 8080 --reload`

const CODE_VENV = `python -m venv venv
# Windows: venv\\Scripts\\activate
pip install -r requirements.txt
playwright install
python main.py --platform xhs --lt qrcode --type search`

export function MediaCrawlerReferenceSection() {
  return (
    <section className="doc-mediacrawler" id="mediacrawler-readme" aria-labelledby="mediacrawler-title">
      <div className="doc-excerpt-disclaimer" role="note">
        <p>
          <strong>重要</strong>：以下內容節錄整理自開源專案 README，僅供<strong>技術調研</strong>。Pysdn／SuperTrack
          <strong>未整合、未背書</strong>該專案；使用須遵守法律、各平台服務條款與 robots，並自行承擔帳號、法遵與資料合規風險。
        </p>
        <p>
          官方倉庫：
          <a href={REPO_HREF} target="_blank" rel="noopener noreferrer">
            github.com/NanmiCoder/MediaCrawler
          </a>
        </p>
      </div>

      <h2 id="mediacrawler-title">第三方參考：MediaCrawler（多平台自媒體採集）</h2>

      <p>
        <strong>MediaCrawler</strong> 為社群開源之<strong>多平台自媒體資料採集工具</strong>，README 自述支援小紅書、抖音、快手、B
        站、微博、百度貼吧、知乎等主流平台之<strong>公開資訊</strong>擷取（含筆記／影片／貼文與留言等情境，以原專案實作為準）。
      </p>

      <h3>技術原理（README 自述）</h3>
      <ul>
        <li>
          <strong>核心</strong>：以 <strong>Playwright</strong> 瀏覽器自動化登入並保留登入態
        </li>
        <li>
          <strong>無需 JS 逆向</strong>：在保留登入態的瀏覽器上下文中，透過 JS 表達式取得簽名相關參數（降低部分演算法逆向門檻，仍屬自動化採集）
        </li>
        <li>
          <strong>CDP 模式（建議）</strong>：可連接本機既有 Chrome（遠端偵錯），複用 Cookie／擴充套件等；README 稱有助降低風控感知（實際效果因平台與帳號而異）
        </li>
      </ul>

      <h3>功能矩陣（README 宣稱 · 以原專案為準）</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>平台</th>
              {FEATURE_COLUMNS.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PLATFORM_FEATURES.map((row) => (
              <tr key={row.platform}>
                <td>{row.platform}</td>
                {FEATURE_COLUMNS.map((col) => (
                  <td key={col}>✅</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="doc-diagram-lead">
        README 另提及付費 <strong>MediaCrawlerPro</strong>（斷點續傳、多帳號等），與本開源版不同；是否採用請自行評估授權與維護。
      </p>

      <h3>快速開始（節錄）</h3>
      <h4>前置</h4>
      <ul>
        <li>
          <strong>Python</strong>：README 建議以 <strong>uv</strong> 管理（<code>uv sync</code>）；亦支援 <code>venv</code> +{' '}
          <code>pip install -r requirements.txt</code>
        </li>
        <li>
          <strong>Node.js</strong>：README 要求 <strong>≥ 16</strong>（部分平台腳本依賴）
        </li>
        <li>
          <strong>Playwright 瀏覽器</strong>：標準 Playwright 模式下需 <code>playwright install</code>；純 CDP 連線既有 Chrome 時可視 README 說明省略
        </li>
        <li>
          <strong>Chrome CDP（建議）</strong>：於 <code>chrome://inspect/#remote-debugging</code> 啟用遠端偵錯；細節與版本要求請以專案 README 為準
        </li>
      </ul>

      <h4>指令範例（uv）</h4>
      <p>關鍵字搜尋並擷取貼文與留言（設定見 <code>config/base_config.py</code>）：</p>
      <pre>
        <code>{CODE_UV_SEARCH}</code>
      </pre>
      <p>依貼文 ID 列表擷取詳情與留言：</p>
      <pre>
        <code>{CODE_UV_DETAIL}</code>
      </pre>
      <p>其他平台與參數：</p>
      <pre>
        <code>uv run main.py --help</code>
      </pre>

      <h4>WebUI（README）</h4>
      <p>啟動後可開啟 <code>http://localhost:8080</code> 以圖形介面設定與檢視日誌（實際埠號以啟動參數為準）：</p>
      <pre>
        <code>{CODE_WEBUI}</code>
      </pre>

      <h4>原生 venv 節錄（README 列為可選）</h4>
      <pre>
        <code>{CODE_VENV}</code>
      </pre>

      <h3>資料儲存</h3>
      <p>
        README 稱支援 <strong>CSV、JSON、JSONL、Excel、SQLite、MySQL</strong> 等；細部欄位與匯出方式請見專案內「資料儲存」文件連結。
      </p>

      <h3>免責與合規（節錄意旨）</h3>
      <p>
        原專案 README 強調<strong>僅供學習研究</strong>、禁止違法與大規模不當爬取，並請使用者自負法律責任；完整條款請以 GitHub 倉庫內免責聲明為準。
      </p>
    </section>
  )
}
