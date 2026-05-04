# PySDN

**AI 影片生成 × 社群信號追蹤平台**

React 19 + Vite 8 前端 · 四大 AI 模組（SuperForge / SuperTune / SuperTrack / SuperScript）

> **注意**：社群爬蟲後端（SocialCrawler）已遷移至獨立倉庫 👉 [iiooiioo888/SuperTrack](https://github.com/iiooiioo888/SuperTrack)

---

## 目錄

- [倉庫結構](#-倉庫結構)
- [技術棧](#-技術棧)
- [快速開始](#-快速開始)
- [可用指令](#-可用指令)
- [路由一覽](#-路由一覽)
- [API 端點](#-api-端點)
- [前端架構](#-前端架構)
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
├── .github/workflows/             # GitHub Actions → GitHub Pages
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

### 後端（SuperTrack）

社群爬蟲後端已獨立為 **SuperTrack** 專案，詳見 [SuperTrack 倉庫](https://github.com/iiooiioo888/SuperTrack)。

---

## ⚡ 快速開始

### 環境需求

- **Node.js ≥ 20**（`frontend_new/.nvmrc`）
- npm

### 前端開發

```bash
cd frontend_new
npm install
npm run dev
# → http://localhost:3000/pysdn_index/
```

---

## 🛠️ 可用指令

### 前端

| 指令 | 說明 |
|------|------|
| `npm run dev` | 開發伺服器（port 3000，含 CSS 合併 + doc i18n 同步） |
| `npm run build` | 生產構建：`tsc` → CSS 合併 → Vite build → 404 複製 → postbuild |
| `npm run preview` | 預覽生產構建 |
| `npm run merge:sections-css` | 手動合併區塊 CSS |

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

---

## 🆘 常見問題

### 前端無法連接後端 API？

確保 SuperTrack 後端已啟動。檢查：
- `frontend_new/.env` 的 `VITE_SUPERTRACK_API_URL` 是否指向正確的後端位址
- `vite.config.ts` 的 proxy 設定是否正確（預設 `http://localhost:8000`）
- Zustand `useApiStore` 的 `baseUrl` 是否被覆寫
- 後端詳見 [SuperTrack 倉庫](https://github.com/iiooiioo888/SuperTrack)

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

---

## 📄 授權

[ISC License](LICENSE)

© 2026 PySDN / project contributors
