/**
 * 節錄整理自社群開源專案 Spider_XHS README（https://github.com/cv-cat/Spider_XHS），
 * 僅供技術調研；與 Pysdn／SuperTrack 無官方整合或背書。
 */
const REPO_HREF = 'https://github.com/cv-cat/Spider_XHS'

const FEATURE_ROWS: { mod: string; feat: string }[] = [
  { mod: '小紅書 PC 端', feat: '二維碼登入／手機驗證碼登入' },
  { mod: '小紅書 PC 端', feat: '取得主頁所有頻道與推薦筆記' },
  { mod: '小紅書 PC 端', feat: '取得使用者主頁資訊／自己的帳號資訊' },
  { mod: '小紅書 PC 端', feat: '取得使用者發布／喜歡／收藏的所有筆記' },
  { mod: '小紅書 PC 端', feat: '取得筆記詳細內容（無浮水印圖片與影片）' },
  { mod: '小紅書 PC 端', feat: '搜尋筆記與搜尋使用者' },
  { mod: '小紅書 PC 端', feat: '取得筆記評論' },
  { mod: '小紅書 PC 端', feat: '取得未讀訊息／評論 @ 提醒／按讚收藏／新增關注' },
  { mod: '創作者平台', feat: '二維碼登入／手機驗證碼登入' },
  { mod: '創作者平台', feat: '上傳圖集作品' },
  { mod: '創作者平台', feat: '上傳影片作品' },
  { mod: '創作者平台', feat: '檢視已發布作品列表' },
  { mod: '蒲公英平台', feat: '取得 KOL 博主列表與詳細資料' },
  { mod: '蒲公英平台', feat: '取得博主粉絲畫像與歷史趨勢' },
  { mod: '蒲公英平台', feat: '發起合作邀請' },
  { mod: '千帆平台', feat: '取得分銷商列表與詳細資料' },
  { mod: '千帆平台', feat: '取得分銷商合作品類／店鋪／商品資訊' },
]

const CHANGELOG_ROWS: { date: string; note: string }[] = [
  { date: '23/08/09', note: '首次提交' },
  { date: '23/09/13', note: 'API 更改 params 增加兩個欄位，修復圖片無法下載，修復部分頁面無法存取報錯' },
  { date: '23/09/16', note: '修復較大影片編碼問題，加入例外處理' },
  { date: '23/09/18', note: '程式碼重構，加入失敗重試' },
  { date: '23/09/19', note: '新增下載搜尋結果功能' },
  { date: '23/10/05', note: '新增跳過已下載功能，取得更詳細的筆記與使用者資訊' },
  { date: '23/10/08', note: '上傳至 PyPI，可透過 pip install 安裝' },
  { date: '23/10/17', note: '搜尋下載新增排序方式（綜合／熱門／最新）' },
  { date: '23/10/21', note: '新增圖形化介面，上傳至 release v2.1.0' },
  { date: '23/10/28', note: 'Fix Bug：修復搜尋功能隱藏問題' },
  { date: '25/03/18', note: '更新 API，修復部分問題' },
  { date: '25/06/07', note: '更新 search 介面，區分影片與圖集下載，新增創作者平台 API' },
  { date: '25/07/15', note: '更新 xs version56 與小紅書創作者介面' },
  {
    date: '26/04/11',
    note: '重構創作者平台 API（圖集／影片上傳），新增蒲公英 KOL 資料 API，新增千帆分銷商 API，簽名演算法升級至最新版',
  },
]

const CODE_SCENARIO1 = `from apis.xhs_pc_apis import XHS_Apis
from apis.xhs_creator_apis import XHS_Creator_Apis

pc_api = XHS_Apis()
creator_api = XHS_Creator_Apis()

# 1. 採集競品筆記
success, msg, note = pc_api.get_note_info(note_url, cookies_str)

# 2. 交給 AI 改寫（接入任意大模型）
rewritten = your_ai_agent(note['content'])   # GPT / Claude / Qwen / 本地模型

# 3. 自動上傳到創作者平台
creator_api.post_note({
    "title": rewritten['title'],
    "desc": rewritten['desc'],
    "media_type": "image",
    "images": [...],
    ...
}, creator_cookies_str)`

const CODE_SCENARIO2 = `# 搜尋指定關鍵字的最新筆記，交給 AI 分析趨勢
success, msg, notes = pc_api.search_some_note(query, require_num, cookies_str, ...)
analysis = your_ai_agent(notes)`

const CODE_SCENARIO3 = `from apis.xhs_pugongying_apis import PuGongYingAPI

pgy = PuGongYingAPI()
# 取得目標類目的 KOL 資料，交給 AI 評估匹配度
kol_list = pgy.get_some_user(num=50, cookies=cookies)
best_kols = your_ai_agent(kol_list, brand_profile)`

const TREE_STRUCTURE = `Spider_XHS/
├── main.py                          # 主入口：爬蟲呼叫範例
├── apis/
│   ├── xhs_pc_apis.py               # 小紅書 PC 端完整 API（採集）
│   ├── xhs_creator_apis.py         # 創作者平台 API（上傳發布）
│   ├── xhs_pc_login_apis.py        # PC 端登入（二維碼／手機驗證碼）
│   ├── xhs_creator_login_apis.py   # 創作者平台登入
│   ├── xhs_pugongying_apis.py      # 蒲公英平台 API（KOL 資料）
│   └── xhs_qianfan_apis.py         # 千帆平台 API（分銷商資料）
├── xhs_utils/
│   ├── common_util.py              # 初始化工具（讀取 .env 設定）
│   ├── cookie_util.py              # Cookie 解析
│   ├── data_util.py                # 資料處理（Excel 儲存、媒體下載）
│   ├── xhs_util.py                 # PC 端簽名演算法封裝
│   ├── xhs_creator_util.py         # 創作者平台簽名演算法封裝
│   ├── xhs_pugongying_util.py      # 蒲公英平台工具
│   └── xhs_qianfan_util.py         # 千帆平台工具
├── static/
│   ├── xhs_main_260411.js          # PC 端簽名核心 JS（範例檔名）
│   ├── xhs_creator_260411.js       # 創作者平台簽名核心 JS（範例檔名）
│   └── ...
├── .env                            # Cookie 設定（勿提交至 git）
├── requirements.txt
├── Dockerfile
└── package.json`

export function SpiderXHSReferenceSection() {
  return (
    <section className="doc-spider-xhs" id="spider-xhs-readme" aria-labelledby="spider-xhs-title">
      <div className="doc-excerpt-disclaimer" role="note">
        <p>
          <strong>重要</strong>：以下內容節錄整理自開源專案 README，僅供<strong>技術調研</strong>。Pysdn／SuperTrack
          <strong>未整合、未背書</strong>該專案；使用第三方工具須自行遵守法律、平台服務條款與 robots，並承擔帳號與法遵風險。
        </p>
        <p>
          官方倉庫：
          <a href={REPO_HREF} target="_blank" rel="noopener noreferrer">
            github.com/cv-cat/Spider_XHS
          </a>
        </p>
      </div>

      <h2 id="spider-xhs-title">第三方參考：Spider_XHS（小紅書資料採集）</h2>

      <p>
        小紅書<strong>未開放完整</strong>的內容營運介面。若要接入 AI 大模型以實現內容<strong>批量採集</strong>、智慧改寫、一鍵發布，首先須能<strong>穩定讀寫</strong>平台資料；依
        README 自述，<strong>Spider_XHS</strong>處理的即是此前置環節：
      </p>
      <ul>
        <li>
          逆向還原小紅書 PC 端與創作者平台的簽名演算法（<code>x-s</code>／<code>x-t</code>／
          <code>x-s-common</code>／<code>x_b3_traceid</code>／<code>sign</code>／<code>q-signature</code> 等參數）
        </li>
        <li>封裝核心 HTTP 介面，簽名參數由專案內處理</li>
        <li>涵蓋<strong>資料採集（PC 端）</strong>、<strong>內容發布（創作者平台）</strong>、<strong>KOL 資料（蒲公英）</strong>等場景</li>
      </ul>
      <p>README 標語意涵：你負責接 AI 大腦，專案聲稱負責打通小紅書端的請求鏈路（僅為原作者表述，不代表本站立場）。</p>

      <h3>已實現功能（README 宣稱 · 狀態以原專案為準）</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>模組</th>
              <th>功能</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            {FEATURE_ROWS.map((row) => (
              <tr key={`${row.mod}-${row.feat}`}>
                <td>{row.mod}</td>
                <td>{row.feat}</td>
                <td>✅</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>接入 AI 智慧體（README 範例）</h3>
      <p>Spider_XHS 自述適合作為 AI 營運 Agent 的資料底層，常見用法包括：</p>

      <h4>場景一：競品筆記採集 + AI 改寫 + 自動發布</h4>
      <pre>
        <code>{CODE_SCENARIO1}</code>
      </pre>

      <h4>場景二：關鍵字監控 + AI 情資分析</h4>
      <pre>
        <code>{CODE_SCENARIO2}</code>
      </pre>

      <h4>場景三：KOL 篩選 + 智慧匹配</h4>
      <pre>
        <code>{CODE_SCENARIO3}</code>
      </pre>

      <h3>Skills 支援</h3>
      <p>
        原專案聲稱可透過標準化 <strong>skills</strong> 被上層 Agent 工具鏈引入；若需現成套件，可於 GitHub 搜尋與{' '}
        <strong>Spider_XHS</strong> 搭配之 <strong>XhsSkills</strong> 類倉庫，並自行驗證授權與維護狀態（README 提及可與
        Clawbot、Claude Code、Codex 等工具整合，以原專案說明為準）。
      </p>

      <h3>爬蟲效果圖</h3>
      <p className="doc-diagram-lead">
        README 含多張操作／結果截圖（使用者列表、筆記列表、筆記詳情、匯出 Excel 等）。請至 GitHub 專案頁檢視，本站不重製圖檔。
      </p>

      <h3>快速開始（節錄）</h3>
      <h4>環境需求</h4>
      <ul>
        <li>Python 3.10+</li>
        <li>Node.js 20+</li>
      </ul>

      <h4>安裝依賴</h4>
      <pre>
        <code>{`pip install -r requirements.txt
npm install`}</code>
      </pre>

      <h4>設定 Cookie</h4>
      <p>
        於專案根目錄 <code>.env</code> 填入登入後 Cookie，例如 <code>COOKIES=&apos;your_cookie_here&apos;</code>。
      </p>
      <p>
        <strong>取得方式（README）</strong>：瀏覽器登入小紅書後，F12 → 網路 → Fetch/XHR → 任請求 → 複製請求標頭中的{' '}
        <code>cookie</code>。<strong>須為已登入狀態</strong>，未登入無效。
      </p>

      <h4>執行</h4>
      <pre>
        <code>python main.py</code>
      </pre>

      <h4>Docker（可選）</h4>
      <pre>
        <code>{`docker build -t spider_xhs .
docker run -e COOKIES='your_cookie_here' spider_xhs`}</code>
      </pre>

      <h3>專案結構（目錄樹節錄）</h3>
      <pre>
        <code>{TREE_STRUCTURE}</code>
      </pre>

      <h3>注意事項（README）</h3>
      <ul>
        <li>
          <code>main.py</code> 為入口，可依需求修改呼叫邏輯
        </li>
        <li>
          <code>apis/xhs_pc_apis.py</code>：PC 端資料介面
        </li>
        <li>
          <code>apis/xhs_creator_apis.py</code>：創作者平台發布介面
        </li>
        <li>Cookie 有時效，失效後須重新取得</li>
        <li>建議搭配代理（<code>proxies</code> 參數）以降低封號風險</li>
      </ul>

      <h3>更新日誌（節錄）</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>日期</th>
              <th>說明</th>
            </tr>
          </thead>
          <tbody>
            {CHANGELOG_ROWS.map((row) => (
              <tr key={row.date + row.note}>
                <td className="sim-mono">{row.date}</td>
                <td>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
