# PySDN

**AI 影片生成 × 社群信號追蹤平台**

React 19 + Vite 8 前端 · FastAPI 社群爬蟲後端 · 四大 AI 模組（SuperForge / SuperTune / SuperTrack / SuperScript）

---

## 目錄

- [倉庫結構](#-倉庫結構)
- [技術棧](#-技術棧)
- [快速開始](#-快速開始)
- [可用指令](#-可用指令)
- [路由一覽](#-路由一覽)
- [API 端點](#-api-端點)
- [前端架構](#-前端架構)
- [SocialCrawler 架構](#-socialcrawler-架構)
- [部署](#-部署)
- [開發指南](#-開發指南)
- [常見問題](#-常見問題)
- [授權](#-授權)

---

## 📦 倉庫結構

```
pysdn_index/
├── frontend_new/                  # React 19 + Vite 8 前端（42 組件 / 8 Hooks / 14 頁面）
│   ├── src/
│   │   ├── components/            # UI 組件
│   │   │   ├── docs/              # 文件頁共用（DocLayout, DocMermaid, DocFooter…）
│   │   │   ├── labs/              # 四大模組實驗室面板
│   │   │   ├── modules/           # 模組總覽頁子組件
│   │   │   └── panel/             # SuperTrack 示範面板
│   │   ├── hooks/                 # 自定義 Hooks
│   │   ├── lib/                   # API 客戶端、Store、i18n、Sanitize
│   │   ├── locales/               # 主站翻譯（5 語系）
│   │   │   └── doc/               # 文件頁翻譯（5 套）
│   │   ├── pages/                 # 頁面（core / docs / labs / panel）
│   │   ├── routes/                # 路由定義
│   │   ├── styles/                # 區塊 CSS
│   │   ├── data/                  # 模型目錄 JSON（OpenRouter + Bedrock + 精選）
│   │   └── main.tsx               # 入口
│   ├── scripts/                   # 構建輔助腳本
│   ├── public/                    # 靜態資源（影片、i18n JSON）
│   ├── vite.config.ts
│   ├── tailwind.config.cjs
│   ├── tsconfig.json
│   ├── .nvmrc                     # Node.js 20
│   └── package.json
├── social-crawler/                # FastAPI 社群爬蟲後端
│   └── social_crawler/
│       ├── adapters/              # 18 個平台適配器（可插拔）
│       ├── api/                   # FastAPI 應用
│       ├── config/                # 設定（YAML + 環境變數）
│       ├── models/                # 資料模型
│       ├── scheduler/             # 任務調度（優先級佇列 + 令牌桶）
│       ├── storage/               # SQLite + JSONL 儲存
│       └── __main__.py            # CLI
├── legacy_old_frontend/           # 舊版靜態前端（Vanilla JS，保留參考）
├── .github/workflows/             # GitHub Actions → GitHub Pages
├── SuperTrack_Documentation.md
└── LICENSE                        # ISC
```

---

## 🚀 技術棧

### 前端

| 類別 | 技術 | 版本 |
|------|------|------|
| 框架 | React + TypeScript | 19.2 / 5.9 |
| 構建 | Vite（ES2022、esbuild 壓縮） | 8.0 |
| 樣式 | Tailwind CSS + 自定義 CSS 變數 | 3.4 |
| 路由 | React Router（`createBrowserRouter` + lazy） | 7.14 |
| 狀態 | Zustand | 5.0 |
| 國際化 | i18next + react-i18next（5 語系） | 26.0 / 17.0 |
| HTTP | Axios | 1.15 |
| 安全 | DOMPurify（XSS 消毒） | 3.x |
| 圖表 | Mermaid（動態 import） | 11.14 |

### 後端（social-crawler）

| 類別 | 技術 |
|------|------|
| 框架 | FastAPI + Uvicorn |
| 資料模型 | Pydantic 2 + dataclasses |
| 設定 | Pydantic-Settings + YAML + 環境變數（`SC_` 前綴） |
| 儲存 | SQLite（去重）+ JSONL（匯出） |
| 調度 | 非同步優先級佇列 + 令牌桶限速 + 指數退避重試 |
| 適配器 | 18 個平台，可插拔架構 |

---

## ⚡ 快速開始

### 環境需求

- **Node.js ≥ 20**（`frontend_new/.nvmrc`）
- **Python ≥ 3.9**
- npm

### 前端開發

```bash
cd frontend_new
npm install
npm run dev
# → http://localhost:3000/pysdn_index/
```

### 後端開發

```bash
cd social-crawler
python -m venv venv
source venv/bin/activate              # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m social_crawler init         # 產生 config.yaml + 初始化 SQLite
python -m social_crawler serve        # → http://localhost:8000
```

前端 `vite.config.ts` 已配置 `/api` 代理到 `http://localhost:8000`，開發時自動轉發。

---

## 🛠️ 可用指令

### 前端

| 指令 | 說明 |
|------|------|
| `npm run dev` | 開發伺服器（port 3000，含 CSS 合併 + doc i18n 同步） |
| `npm run build` | 生產構建：`tsc` → CSS 合併 → Vite build → 404 複製 → postbuild |
| `npm run preview` | 預覽生產構建 |
| `npm run merge:sections-css` | 手動合併區塊 CSS |

### 後端（social-crawler CLI）

| 指令 | 說明 |
|------|------|
| `python -m social_crawler init` | 產生 `config.yaml` 範本 + 初始化 SQLite |
| `python -m social_crawler crawl --platform demo --query "test"` | 單次擷取 |
| `python -m social_crawler list --limit 20` | 列出 SQLite 內容 |
| `python -m social_crawler serve --host 0.0.0.0 --port 8000` | 啟動 FastAPI |

---

## 🗺️ 路由一覽

SPA 路由定義於 `frontend_new/src/routes/registry.ts`，使用 `createBrowserRouter`：

| 路徑 | 頁面 | 分組 |
|------|------|------|
| `/` | 首頁（Hero + 產品 + 模組 + 案例 + 聯絡） | 核心 |
| `/modules` | 模組總覽（SuperForge / SuperTune / SuperTrack / SuperScript） | 核心 |
| `/models` | AI 模型目錄（OpenRouter + Bedrock + 精選） | 核心 |
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

所有路由支援 `?lang=` 參數切換語系：`zh-TW` / `zh-CN` / `en` / `ja` / `ko`。

---

## 🌐 API 端點

### 前端代理的後端 API

對應 `frontend_new/src/lib/api.ts`：

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
| GET | `/api/items` | 內容列表（SQLite，limit 200） |
| POST | `/api/crawl` | 執行爬取任務（body: `platform`, `query`, `priority`） |

---

## 🎨 前端架構

### 入口流程

```
main.tsx
  → syncPathnameWithViteBase()     # 對齊 GitHub Pages base 路徑
  → createAppRouter(basename)      # 建立路由樹
  → <StrictMode>
      <ErrorBoundary>
        <RouterProvider />          # Suspense fallback → RouteFallback
      </ErrorBoundary>
    </StrictMode>
  → initI18n()                     # 不阻塞掛載，翻譯到位後自動 re-render
```

### 頁面載入策略

| 分組 | 載入方式 | 說明 |
|------|----------|------|
| 核心頁（Home, Modules, Models, FAQ） | `eagerPage()` 同步匯出 | 避免 dev 模式下 `base` 非 `/` 時的動態 import 問題 |
| 文件頁（docs/*） | `React.lazy()` | 按需載入 |
| 實驗室（labs/*） | `React.lazy()` | 按需載入 |
| 面板（panel/*） | `React.lazy()` | 按需載入 |

### 首頁區塊

| 組件 | 說明 |
|------|------|
| `Hero` | 品牌主視覺、打字機動畫、計數器動效 |
| `About` | 關於區塊 |
| `Products` | 影片 / 短劇 / 圖片分頁切換，含自動播放影片 mockup |
| `ModulesPanel` | 四大模組卡片 + MiniCards |
| `Showcase` | 案例展示輪播 |
| `WorkflowSection` | 工作流程說明 |
| `Contact` | 聯絡表單（含前端驗證） |
| `Footer` | 頁腳 |

首頁使用 `HomeLazySection`（IntersectionObserver）延遲載入各區塊，觸發 React.lazy 分塊。

### 文件系統

- 每個模組獨立文件頁，使用 `useDocBundle(name)` 按需載入翻譯 JSON
- 翻譯資源：`src/locales/doc/{superforge,superscript,supertrack,supertune,modules}.json`
- Mermaid 圖表：動態 import，`securityLevel: 'strict'`
- 文件導覽列 + 語言切換藥丸 + GitHub 連結區塊

### 設計系統

- **主題**：暗色科技風格，CSS 變數驅動（`--bg-card`、`--radius`、`--text-muted`…）
- **響應式**：移動端優先，`env(safe-area-inset-*)` 適配瀏海 / 手勢條
- **動畫**：`IntersectionObserver` 共用單例 + `MutationObserver` 掃描
- **減動效**：`prefers-reduced-motion: reduce` 時自動跳過
- **安全**：所有 `dangerouslySetInnerHTML` 經 DOMPurify 消毒

### 狀態管理

- `useApiStore`（Zustand）：全域 API base URL
- `useDocBundle`：文件頁 i18n 狀態
- `useSuperTrackPanelEditMode`：面板編輯模式（`VITE_SUPERTRACK_PANEL_EDIT=true` 或 dev 環境）

---

## 🕷️ SocialCrawler 架構

```
POST /api/crawl { platform, query }
        ↓
   CrawlScheduler
   ├── 令牌桶限速（每平台獨立）
   ├── 優先級佇列
   └── 指數退避重試（max 3 次）
        ↓
   get_adapter(platform) → BaseAdapter.search()
        ↓
   ContentItem[]
   ├── SQLiteStore.upsert_items()   # (platform, source_id) 去重
   └── JsonlStore.append()          # 可選匯出
```

### 已註冊平台（18 個）

| 平台 | 狀態 | 備註 |
|------|------|------|
| `demo` | ✅ 完整 | 無需外網，管線測試用 |
| `xhs` 小紅書 | 骨架 | 需實作 |
| `douyin` / `tiktok` | 骨架 | 需實作 |
| `bilibili` | 骨架 | 需實作 |
| `kuaishou` | 骨架 | 需實作 |
| `youtube` | 骨架 | 需實作 |
| `instagram` | 骨架 | 需實作 |
| `x_twitter` / `reddit` / `telegram` / `facebook` / `weibo` | 骨架 | snscrape 或對應方案 |
| `wechat_channels` / `wechat_mp` / `threads` / `linkedin` / `rss` | 缺口 | NotImplementedError，需自行評估合規 |

### 新增適配器

```python
# social_crawler/adapters/my_platform.py
from social_crawler.adapters.base import BaseAdapter
from social_crawler.models.schema import ContentItem, CrawlTask, Platform

class MyPlatformAdapter(BaseAdapter):
    platform = Platform.MY_PLATFORM  # 需先在 schema.py 加入枚舉值

    async def search(self, task: CrawlTask) -> list[ContentItem]:
        # 實作擷取邏輯
        return [ContentItem(...)]
```

然後在 `registry.py` 的 `_REGISTRY` 註冊。

---

## 🚀 部署

### GitHub Pages（自動）

推送到 `main` 時，`.github/workflows/deploy.yml` 自動執行：

1. `npm ci` → `npm run build`（`frontend_new/`）
2. 上傳 `dist/` 為 Pages artifact
3. 部署到 GitHub Pages

### 手動部署前端

```bash
cd frontend_new
npm run build
# 產出在 dist/，部署至 Vercel / Netlify / Cloudflare Pages 等
```

### 部署後端

```bash
cd social-crawler
pip install -r requirements.txt
uvicorn social_crawler.api.app:create_app --factory --host 0.0.0.0 --port 8000
```

### Docker

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

### 添加新頁面

1. `src/pages/NewPage.tsx` — 建立頁面組件
2. `src/routes/paths.ts` — 加入路徑常量
3. `src/routes/registry.ts` — 加入路由條目（`group` 決定分組）
4. `src/routes/lazyPages.tsx` — 加入 `lazy()` 匯出

### 國際化

**主站翻譯**（5 語系）：
- `src/locales/zh-TW.json`、`zh-CN.json`、`en.json`、`ja.json`、`ko.json`
- 使用 `useTranslation()` → `t('key')`

**文件翻譯**（按需載入）：
- `src/locales/doc/{superforge,superscript,supertrack,supertune,modules}.json`
- 使用 `useDocBundle('supertrack')` → `t('key')`

新增語系：在 `src/locales/` 建立 JSON，在 `src/lib/i18n.ts` 的 `loaders` 註冊。

### 添加新組件

```tsx
// src/components/NewComponent.tsx
export function NewComponent() {
  return <div>Content</div>
}
```

### 後端配置

SocialCrawler 支援三層配置（優先序由高到低）：

1. **環境變數** — 前綴 `SC_`（如 `SC_DB_PATH=data/custom.db`）
2. **YAML** — `config.yaml`（由 `init` 指令產生）
3. **預設值** — 見 `social_crawler/config/settings.py`

| 設定 | 預設值 | 說明 |
|------|--------|------|
| `db_path` | `data/social_crawler.db` | SQLite 資料庫路徑 |
| `jsonl_path` | `data/export.jsonl` | JSONL 匯出路徑 |
| `cors_origins` | `localhost:3000/5173` | CORS 允許來源 |
| `max_concurrent` | `4` | 最大並行爬取數 |
| `max_retries` | `3` | 失敗重試次數 |

---

## 🆘 常見問題

### 前端無法連接後端 API？

確保後端已啟動。檢查：
- `frontend_new/.env` 的 `VITE_API_URL` 是否正確
- `vite.config.ts` 的 proxy 設定是否指向後端
- Zustand `useApiStore` 的 `baseUrl` 是否被覆寫

### Vite 端口被佔用？

Vite 會自動嘗試下一個可用端口。也可在 `vite.config.ts` 指定：

```ts
server: { port: 3000 }
```

### 如何新增語言？

1. 在 `src/locales/` 建立 `{lang-code}.json`
2. 在 `src/lib/i18n.ts` 的 `loaders` 加入對應匯入
3. 在 `src/routes/langQuery.ts` 的 `APP_LANG_CODES` 加入代碼

### Tailwind 樣式不生效？

確認 `tailwind.config.cjs` 的 `content` 包含你的檔案路徑：

```js
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
```

### npm audit 有漏洞？

`mermaid` 的傳遞依賴 `uuid` < 14.0.0 有 2 個中等漏洞。`npm audit fix --force` 會降級 mermaid 到 9.x（破壞性變更），建議等待上游更新。

---

## 📝 注意事項

- Node.js **≥ 20**（`package.json` engines + `.nvmrc`）
- 前端 `base` 為 `/pysdn_index/`（GitHub Pages 子路徑部署）
- `dangerouslySetInnerHTML` 均經 DOMPurify 消毒
- Mermaid 使用 `securityLevel: 'strict'`
- SocialCrawler 適配器多為骨架，需依平台實作 `search` 方法

---

## 📄 授權

[ISC License](LICENSE)

© 2026 PySDN / project contributors
