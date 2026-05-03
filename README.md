# PySDN — AI 影片生成 × 社群信號追蹤平台

React 19 + TypeScript + Vite 前端，搭配 FastAPI 社群爬蟲後端（`social-crawler`）。提供影片／短劇／圖片生成展示、四大 AI 模組（SuperForge / SuperTune / SuperTrack / SuperScript）文件與互動實驗室、以及 SuperTrack 示範面板。

---

## 📦 倉庫結構

```text
pysdn_index/
├── frontend_new/                  # React 19 + TypeScript + Vite 前端
│   ├── src/
│   │   ├── components/            # UI 組件
│   │   │   ├── docs/              # 文件頁共用組件（DocLayout、DocMermaid、DocFooter…）
│   │   │   ├── labs/              # 四大模組實驗室面板
│   │   │   ├── modules/           # 模組總覽頁子組件
│   │   │   └── panel/             # SuperTrack 示範面板
│   │   ├── hooks/                 # 自定義 Hooks（動畫、文件 i18n、爬蟲 API…）
│   │   ├── lib/                   # API 客戶端、Zustand store、i18n、DOMPurify…
│   │   ├── locales/               # 主站翻譯（zh-TW/zh-CN/en/ja/ko）
│   │   │   └── doc/               # 文件頁翻譯（superforge/supertrack/supertune/superscript/modules）
│   │   ├── pages/                 # 頁面組件
│   │   │   ├── docs/              # 四大模組技術文件頁
│   │   │   ├── labs/              # 四大模組互動實驗室
│   │   │   └── panel/             # SuperTrack 示範面板頁
│   │   ├── routes/                # 路由定義（appRouter、registry、paths、langQuery）
│   │   ├── styles/                # 各區塊 CSS（含 Tailwind + 自定義樣式）
│   │   ├── data/                  # 模型目錄 JSON（OpenRouter / Bedrock）
│   │   ├── utils/                 # 工具函數（scrollToHash）
│   │   └── main.tsx               # 應用入口
│   ├── scripts/                   # 構建輔助腳本（CSS 合併、404 複製、doc i18n 同步）
│   ├── public/                    # 靜態資源（影片 mp4、i18n JSON）
│   ├── index.html
│   ├── vite.config.ts             # Vite 設定（base、proxy、chunk 分割）
│   ├── tailwind.config.cjs
│   ├── tsconfig.json
│   ├── .nvmrc                     # Node.js 20
│   └── package.json
├── social-crawler/                # SuperTrack 社群爬蟲後端（FastAPI）
│   ├── social_crawler/
│   │   ├── adapters/              # 可插拔平台適配器
│   │   │   ├── base.py            # BaseAdapter 抽象介面
│   │   │   ├── demo.py            # 示範適配器（無需外網）
│   │   │   ├── xhs.py             # 小紅書
│   │   │   ├── douyin.py          # 抖音 / TikTok
│   │   │   ├── bilibili.py        # B 站
│   │   │   ├── kuaishou.py        # 快手
│   │   │   ├── youtube.py         # YouTube
│   │   │   ├── instagram.py       # Instagram
│   │   │   ├── international.py   # X/Twitter、Reddit、Telegram、Facebook、Weibo
│   │   │   ├── platform_gaps.py   # 缺口平台骨架（微信影片號/公眾號、Threads、LinkedIn、RSS）
│   │   │   └── registry.py        # 適配器註冊表
│   │   ├── api/
│   │   │   └── app.py             # FastAPI 應用（/api/health、/api/crawl、/api/items、/api/platforms）
│   │   ├── config/
│   │   │   └── settings.py        # Pydantic Settings + YAML 載入
│   │   ├── models/
│   │   │   └── schema.py          # 統一資料模型（Platform、ContentItem、CrawlTask、CrawlResult）
│   │   ├── scheduler/
│   │   │   └── scheduler.py       # 優先級佇列 + 令牌桶限速 + 指數退避重試
│   │   ├── storage/
│   │   │   ├── sqlite_store.py    # SQLite 去重儲存
│   │   │   └── jsonl_store.py     # JSONL 匯出
│   │   └── __main__.py            # CLI（init / crawl / list / serve）
│   └── requirements.txt
├── legacy_old_frontend/           # 舊版靜態前端（Vanilla JS，保留參考）
├── .github/workflows/             # GitHub Actions（自動部署 GitHub Pages）
├── SuperTrack_Documentation.md    # SuperTrack 完整技術文件
├── LICENSE                        # ISC License
└── README.md
```

---

## 🚀 技術棧

### 前端（frontend_new）

| 類別 | 技術 |
|------|------|
| 框架 | React 19 + TypeScript 5.9 |
| 構建 | Vite 8（ES2022 target、esbuild 壓縮） |
| 樣式 | Tailwind CSS 3.4 + 自定義 CSS 變數系統 |
| 路由 | React Router 7（`createBrowserRouter` + `React.lazy` 程式碼分割） |
| 狀態 | Zustand 5（API base URL 全域狀態） |
| 國際化 | i18next 26 + react-i18next 17（5 語系：繁中/簡中/英文/日文/韓文） |
| HTTP | Axios 1.x |
| 安全 | DOMPurify 3.x（`dangerouslySetInnerHTML` 消毒） |
| 圖表 | Mermaid 11（動態 import，文件頁專用） |
| 動畫 | 自研 Hooks（打字機、計數器、IntersectionObserver 淡入） |

### 後端（social-crawler）

| 類別 | 技術 |
|------|------|
| 框架 | FastAPI + Uvicorn |
| 資料模型 | Pydantic 2 + dataclasses |
| 設定 | Pydantic-Settings + YAML + 環境變數（`SC_` 前綴） |
| 儲存 | SQLite（去重）+ JSONL（匯出） |
| 調度 | 非同步優先級佇列 + 令牌桶限速 + 指數退避重試 |
| 適配器 | 18 個平台（含 demo），可插拔架構 |

---

## ⚡ 快速開始

### 環境需求

- **Node.js >= 20**（見 `frontend_new/.nvmrc`）
- **Python >= 3.9**（social-crawler 後端）
- npm

### 前端

```bash
cd frontend_new
npm install
npm run dev
# → http://localhost:3000/pysdn_index/
```

### 後端（social-crawler）

```bash
cd social-crawler
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m social_crawler init     # 產生 config.yaml + 初始化 SQLite
python -m social_crawler serve    # 啟動 FastAPI → http://localhost:8000
```

前端開發模式下，`vite.config.ts` 已配置 `/api` 代理到 `http://localhost:8000`。

---

## 🛠️ 可用指令

### 前端

| 指令 | 說明 |
|------|------|
| `npm run dev` | 啟動開發伺服器（含 CSS 合併 + doc i18n 同步） |
| `npm run build` | 生產構建（`tsc` → CSS 合併 → Vite build → 404 複製 → postbuild） |
| `npm run preview` | 預覽生產構建 |
| `npm run merge:sections-css` | 手動合併區塊 CSS |

### 後端（social-crawler CLI）

| 指令 | 說明 |
|------|------|
| `python -m social_crawler init` | 產生 `config.yaml` 範本 + 初始化 SQLite |
| `python -m social_crawler crawl --platform demo --query "test"` | 執行單次擷取 |
| `python -m social_crawler list --limit 20` | 列出 SQLite 中最近內容 |
| `python -m social_crawler serve --host 0.0.0.0 --port 8000` | 啟動 FastAPI 伺服器 |

---

## 🌐 API 端點

### 前端代理的後端 API（`/api/*`）

與 `frontend_new/src/lib/api.ts` 對齊：

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | `/api/health` | 健康檢查 |
| POST | `/api/video/generate` | 生成影片 |
| GET | `/api/video/status/:taskId` | 影片任務狀態 |
| GET | `/api/video/list` | 影片列表（分頁） |
| POST | `/api/drama/create` | 建立短劇 |
| GET | `/api/drama/list` | 短劇列表（分頁） |
| POST | `/api/image/generate` | 圖片生成 |
| GET | `/api/image/list` | 圖片列表（分頁） |
| POST | `/api/modules/supertune` | SuperTune 優化 |
| POST | `/api/modules/supertrack` | SuperTrack 趨勢 |
| POST | `/api/modules/superforge` | SuperForge 操作 |
| POST | `/api/contact` | 聯絡表單 |

### SocialCrawler 內建 API

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | `/api/health` | 爬蟲服務健康檢查 |
| GET | `/api/platforms` | 已註冊平台列表 |
| GET | `/api/items` | 內容列表（SQLite） |
| POST | `/api/crawl` | 執行爬取任務 |

---

## 🗺️ 路由一覽

SPA 路由由 `frontend_new/src/routes/appRouter.tsx` 定義，使用 `createBrowserRouter`：

| 路徑 | 頁面 | 分組 |
|------|------|------|
| `/` | 首頁（Hero + 產品 + 模組 + 案例 + 聯絡） | 核心 |
| `/modules` | 模組總覽 | 核心 |
| `/models` | AI 模型目錄 | 核心 |
| `/models/:modelId` | 模型詳情 | 核心 |
| `/faq` | 常見問題 | 核心 |
| `/docs/superforge` | SuperForge 技術文件 | 文件 |
| `/docs/superscript` | SuperScript 技術文件 | 文件 |
| `/docs/supertrack` | SuperTrack 技術文件 | 文件 |
| `/docs/supertune` | SuperTune 技術文件 | 文件 |
| `/labs/superforge` | SuperForge 實驗室 | 實驗室 |
| `/labs/superscript` | SuperScript 實驗室 | 實驗室 |
| `/labs/supertrack` | SuperTrack 實驗室 | 實驗室 |
| `/labs/supertune` | SuperTune 實驗室 | 實驗室 |
| `/panel/supertrack` | SuperTrack 示範面板 | 面板 |

所有路由支援 `?lang=` 參數切換語系（`zh-TW` / `zh-CN` / `en` / `ja` / `ko`）。

---

## 🎨 前端功能特點

### 核心頁面

- **Hero 區塊**：品牌主視覺、打字機動畫、計數器動效
- **產品展示**：影片 / 短劇 / 圖片三大核心能力分頁切換，含自動播放影片 mockup
- **模組總覽**：SuperForge / SuperTune / SuperTrack / SuperScript 四大模組卡片 + 側邊導覽
- **AI 模型目錄**：整合 OpenRouter + Bedrock 模型資料，支援詳情頁
- **案例展示**：真實作品案例輪播
- **聯絡表單**：含前端驗證的需求蒐集

### 技術文件系統

- 每個模組獨立文件頁（`useDocBundle` 按需載入翻譯 JSON）
- Mermaid 圖表渲染（動態 import，`securityLevel: 'strict'`）
- 文件導覽列 + 語言切換藥丸 + GitHub 連結區塊

### 互動實驗室

- 四大模組各一個 Lab Panel（`SuperForgeLabPanel` / `SuperTuneLabPanel` / `SuperTrackLabPanel` / `SuperScriptLabPanel`）
- SuperTrack 示範面板（`/panel/supertrack`）：追蹤目標表單 + 卡片矩陣 + 編輯模式

### 設計系統

- 暗色科技風格主題，CSS 變數驅動（`--bg-card`、`--radius`、`--text-muted`…）
- 響應式：移動端優先，瀏海 / 手勢條 safe-area 適配
- 區塊淡入：`IntersectionObserver` 共用單例 + `MutationObserver` 掃描
- 減動效：`prefers-reduced-motion: reduce` 時跳過動畫

---

## 🕷️ SocialCrawler 架構

```
CrawlRequest → FastAPI /api/crawl
                  ↓
            CrawlScheduler（令牌桶限速 + 指數退避）
                  ↓
            get_adapter(platform) → BaseAdapter.search()
                  ↓
            ContentItem[] → SQLiteStore.upsert_items()
                           → JsonlStore.append()（可選）
```

### 已註冊平台（18 個）

| 平台 | 適配器狀態 | 備註 |
|------|-----------|------|
| demo | ✅ 完整 | 無需外網，管線測試用 |
| xhs（小紅書） | 骨架 | 需實作 |
| douyin / tiktok | 骨架 | 需實作 |
| bilibili | 骨架 | 需實作 |
| kuaishou | 骨架 | 需實作 |
| youtube | 骨架 | 需實作 |
| instagram | 骨架 | 需實作 |
| x_twitter / reddit / telegram / facebook / weibo | 骨架 | `snscrape` 或對應方案 |
| wechat_channels / wechat_mp / threads / linkedin / rss | 缺口 | `NotImplementedError`，需自行評估合規 |

### 新增適配器

1. 在 `social_crawler/adapters/` 建立新檔，繼承 `BaseAdapter`
2. 實作 `async def search(self, task: CrawlTask) -> list[ContentItem]`
3. 在 `registry.py` 的 `_REGISTRY` 註冊對應 `Platform` 枚舉

---

## 🚀 部署

### GitHub Pages（自動）

推送到 `main` 分支時，GitHub Actions 自動構建 `frontend_new/` 並部署到 GitHub Pages。

配置見 `.github/workflows/deploy.yml`。

### 手動部署前端

```bash
cd frontend_new
npm run build
# 產出在 dist/，可部署至 Vercel / Netlify / 任何靜態託管
```

### 部署後端

```bash
cd social-crawler
pip install -r requirements.txt
uvicorn social_crawler.api.app:create_app --factory --host 0.0.0.0 --port 8000
```

### Docker（可選）

```dockerfile
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY frontend_new/package*.json ./
RUN npm ci
COPY frontend_new/ .
RUN npm run build

FROM python:3.11-slim
WORKDIR /app
COPY --from=frontend-build /app/dist ./static
COPY social-crawler/requirements.txt .
RUN pip install -r requirements.txt
COPY social-crawler/ .
CMD ["uvicorn", "social_crawler.api.app:create_app", "--factory", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 🔧 開發指南

### 前端：添加新頁面

1. 在 `src/pages/` 建立頁面組件
2. 在 `src/routes/paths.ts` 加入路徑常量
3. 在 `src/routes/registry.ts` 加入路由條目
4. 在 `src/routes/lazyPages.tsx` 加入 `lazy()` 匯出

### 前端：國際化

- 主站翻譯：`src/locales/{zh-TW,zh-CN,en,ja,ko}.json`
- 文件翻譯：`src/locales/doc/{superforge,superscript,supertrack,supertune,modules}.json`
- 使用 `useTranslation()` hook 取得 `t()` 函數
- 文件頁使用 `useDocBundle(name)` 載入對應命名空間

### 前端：添加新組件

```tsx
// src/components/NewComponent.tsx
export function NewComponent() {
  return <div>New Component</div>
}
```

### 後端：配置

SocialCrawler 支援三種配置來源（優先序：環境變數 > YAML > 預設值）：

- 環境變數前綴 `SC_`（如 `SC_DB_PATH`）
- `config.yaml`（由 `python -m social_crawler init` 產生）
- 預設值見 `social_crawler/config/settings.py`

---

## 📝 注意事項

- Node.js 版本 **>= 20**（`package.json` engines + `.nvmrc`）
- 前端 `base` 為 `/pysdn_index/`（GitHub Pages 子路徑部署）
- `dangerouslySetInnerHTML` 均透過 DOMPurify 消毒
- Mermaid 使用 `securityLevel: 'strict'` 模式
- SocialCrawler 適配器多為骨架，需依平台實作 `search` 方法

---

## 📄 授權

[ISC License](LICENSE)

© 2026 PySDN / project contributors
