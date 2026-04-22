import type { ReactNode } from 'react'

/**
 * 第三方開源／社群工具與訊號來源對照（技術調研用）。
 * 與 SuperTrack 文件「主流分享與社群平台」標籤範圍對齊；非產品整合清單。
 */

function ToolLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}

const CN_ROWS: {
  platform: string
  primary: ReactNode
  alt: ReactNode
  status: string
}[] = [
  {
    platform: '小紅書',
    primary: <ToolLink href="https://github.com/cv-cat/Spider_XHS">Spider_XHS</ToolLink>,
    alt: (
      <>
        <ToolLink href="https://github.com/NanmiCoder/MediaCrawler">MediaCrawler</ToolLink>、
        <ToolLink href="https://github.com/JoeanAmier/XHS-Downloader">XHS-Downloader</ToolLink>、
        <ToolLink href="https://github.com/xpzouying/xiaohongshu-mcp">xiaohongshu-mcp</ToolLink>
      </>
    ),
    status: '✅ 成熟',
  },
  {
    platform: '抖音',
    primary: <ToolLink href="https://github.com/NanmiCoder/MediaCrawler">MediaCrawler</ToolLink>,
    alt: (
      <ToolLink href="https://github.com/Evil0ctal/Douyin_TikTok_Download_API">Douyin_TikTok_Download_API</ToolLink>
    ),
    status: '✅ 成熟',
  },
  {
    platform: '快手',
    primary: <ToolLink href="https://github.com/NanmiCoder/MediaCrawler">MediaCrawler</ToolLink>,
    alt: (
      <ToolLink href="https://github.com/Evil0ctal/Douyin_TikTok_Download_API">Douyin_TikTok_Download_API</ToolLink>
    ),
    status: '✅ 成熟',
  },
  {
    platform: 'Bilibili',
    primary: <ToolLink href="https://github.com/NanmiCoder/MediaCrawler">MediaCrawler</ToolLink>,
    alt: (
      <ToolLink href="https://github.com/Evil0ctal/Douyin_TikTok_Download_API">Douyin_TikTok_Download_API</ToolLink>
    ),
    status: '✅ 成熟',
  },
  {
    platform: '微博',
    primary: <ToolLink href="https://github.com/NanmiCoder/MediaCrawler">MediaCrawler</ToolLink>,
    alt: (
      <>
        <ToolLink href="https://github.com/JustAnotherArchivist/snscrape">snscrape</ToolLink>（僅使用者主頁）
      </>
    ),
    status: '✅ 成熟',
  },
  {
    platform: '微信影片號',
    primary: <ToolLink href="https://github.com/ltaoo/wx_channels_download">wx_channels_download</ToolLink>,
    alt: <>—</>,
    status: '⚠️ 僅下載；需 PC 微信 + Fiddler 擷包，無正式 API',
  },
  {
    platform: '微信公眾號',
    primary: <ToolLink href="https://github.com/hzhu212/wechat-mp-crawler">wechat-mp-crawler</ToolLink>,
    alt: (
      <>
        <ToolLink href="https://github.com/unclecode/crawl4ai">Crawl4AI</ToolLink>（通用擷取）
      </>
    ),
    status: '⚠️ 需 Fiddler 擷包，Cookie 快速過期，難完全自動化',
  },
]

const INTL_ROWS: {
  platform: string
  primary: ReactNode
  alt: ReactNode
  status: string
}[] = [
  {
    platform: 'Instagram',
    primary: <ToolLink href="https://github.com/instaloader/instaloader">instaloader</ToolLink>,
    alt: (
      <>
        <ToolLink href="https://github.com/mikf/gallery-dl">gallery-dl</ToolLink>、
        <ToolLink href="https://github.com/JustAnotherArchivist/snscrape">snscrape</ToolLink>
      </>
    ),
    status: '✅ 成熟',
  },
  {
    platform: 'TikTok',
    primary: (
      <ToolLink href="https://github.com/Evil0ctal/Douyin_TikTok_Download_API">Douyin_TikTok_Download_API</ToolLink>
    ),
    alt: <ToolLink href="https://github.com/mikf/gallery-dl">gallery-dl</ToolLink>,
    status: '✅ 成熟',
  },
  {
    platform: 'YouTube',
    primary: <ToolLink href="https://github.com/yt-dlp/yt-dlp">yt-dlp</ToolLink>,
    alt: <ToolLink href="https://github.com/unclecode/crawl4ai">Crawl4AI</ToolLink>,
    status: '✅ 成熟',
  },
  {
    platform: 'X（Twitter）',
    primary: <ToolLink href="https://github.com/JustAnotherArchivist/snscrape">snscrape</ToolLink>,
    alt: <ToolLink href="https://github.com/mikf/gallery-dl">gallery-dl</ToolLink>,
    status: '✅ 成熟',
  },
  {
    platform: 'Facebook',
    primary: <ToolLink href="https://github.com/JustAnotherArchivist/snscrape">snscrape</ToolLink>,
    alt: <ToolLink href="https://github.com/unclecode/crawl4ai">Crawl4AI</ToolLink>,
    status: '⚠️ 僅公開內容',
  },
  {
    platform: 'Threads',
    primary: <>無成熟開源專用工具</>,
    alt: (
      <>
        <ToolLink href="https://github.com/unclecode/crawl4ai">Crawl4AI</ToolLink>（通用）
      </>
    ),
    status: '🔴 缺口',
  },
  {
    platform: 'LinkedIn',
    primary: <>無成熟開源專用工具</>,
    alt: (
      <>
        <ToolLink href="https://github.com/unclecode/crawl4ai">Crawl4AI</ToolLink>（通用）
      </>
    ),
    status: '🔴 缺口',
  },
  {
    platform: 'Reddit',
    primary: <ToolLink href="https://github.com/JustAnotherArchivist/snscrape">snscrape</ToolLink>,
    alt: <ToolLink href="https://github.com/mikf/gallery-dl">gallery-dl</ToolLink>,
    status: '✅ 成熟',
  },
  {
    platform: 'Telegram 公開頻道',
    primary: <ToolLink href="https://github.com/JustAnotherArchivist/snscrape">snscrape</ToolLink>,
    alt: <>Telethon／Pyrogram（API 方式）</>,
    status: '✅ 成熟',
  },
]

const GAP_ROWS: { platform: string; difficulty: string; approach: ReactNode }[] = [
  {
    platform: '微信影片號',
    difficulty: '封閉生態、無開放 API，資料在微信用戶端內',
    approach: (
      <>
        <code>wx_channels_download</code> 做下載；批量採集需代理擷包＋人工配合，目前無純自動化方案
      </>
    ),
  },
  {
    platform: '微信公眾號',
    difficulty: 'Cookie 約數十分鐘過期，反爬嚴格',
    approach: (
      <>
        <code>wechat-mp-crawler</code> 搭配 Fiddler 半自動；或搜狗微信搜尋（約 10 篇上限）；或以 Crawl4AI 直接爬文章 URL
      </>
    ),
  },
  {
    platform: 'Threads',
    difficulty: 'Meta 無公開 API，平台較新',
    approach: (
      <>
        Crawl4AI 通用擷取；或商業 API（TikHub 等）
      </>
    ),
  },
  {
    platform: 'LinkedIn',
    difficulty: '反爬極嚴，法遵風險高',
    approach: (
      <>
        Crawl4AI 通用擷取；或官方 API（需申請）；或商業資料服務
      </>
    ),
  },
]

const ARCHITECTURE = `統一排程層（自研）
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

export function SignalSourcesToolsMatrixSection() {
  return (
    <section className="doc-signal-tools-matrix" id="signal-sources-tools" aria-labelledby="signal-tools-title">
      <div className="doc-excerpt-disclaimer" role="note">
        <p>
          <strong>說明</strong>：下表整理社群常見<strong>開源／第三方工具</strong>與各訊號來源的對照，僅供<strong>技術調研與架構規劃</strong>。SuperTrack
          產品<strong>未整合、未背書</strong>下列專案；實務須遵守各平台 ToS、robots、個資與著作權，並自行承擔法遵與帳號風險。
        </p>
      </div>

      <h2 id="signal-tools-title">訊號來源與開源工具對照</h2>
      <p className="doc-diagram-lead">
        與上方「主流分享與社群平台」標籤範圍對齊；狀態欄為調研時之概括（成熟／受限／缺口），仍以各倉庫與平台現況為準。
      </p>

      <h3>🇨🇳 大中華</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>平台</th>
              <th>推薦工具</th>
              <th>備選工具</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            {CN_ROWS.map((row) => (
              <tr key={row.platform}>
                <td>
                  <strong>{row.platform}</strong>
                </td>
                <td>{row.primary}</td>
                <td>{row.alt}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>🌍 國際</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>平台</th>
              <th>推薦工具</th>
              <th>備選工具</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            {INTL_ROWS.map((row) => (
              <tr key={row.platform}>
                <td>
                  <strong>{row.platform}</strong>
                </td>
                <td>{row.primary}</td>
                <td>{row.alt}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>📰 新聞 RSS</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>來源</th>
              <th>推薦工具</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>新聞 RSS</strong>
              </td>
              <td>
                <ToolLink href="https://github.com/unclecode/crawl4ai">Crawl4AI</ToolLink>（通用網頁）＋原生 RSS 閱讀／聚合
              </td>
              <td>✅ 成熟</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>🔴 缺口分析</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>缺口平台</th>
              <th>難點</th>
              <th>可行方案</th>
            </tr>
          </thead>
          <tbody>
            {GAP_ROWS.map((row) => (
              <tr key={row.platform}>
                <td>
                  <strong>{row.platform}</strong>
                </td>
                <td>{row.difficulty}</td>
                <td>{row.approach}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>🏗️ 推薦架構（多來源整合示意）</h3>
      <p>
        若將多來源收斂為單一系統，可採<strong>分層採集＋統一 DTO＋儲存分析</strong>；核心思路：MediaCrawler 覆蓋國內多平台、snscrape
        覆蓋部分海外文字／社群來源、Spider_XHS 深耕小紅書（含發布與商業後台場景）、Crawl4AI 作通用兜底（尤其 Threads、LinkedIn 等無專用成熟開源時）。
      </p>
      <pre>
        <code>{ARCHITECTURE}</code>
      </pre>
    </section>
  )
}
