<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 19.2" />
  <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 8.0" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 5.9" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind 3.4" />
  <img src="https://img.shields.io/badge/License-ISC-blue?style=flat-square" alt="License: ISC" />
  <img src="https://img.shields.io/badge/Node-%3E%3D20-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js ≥ 20" />
  <a href="https://iiooiioo888.github.io/pysdn_index/">
    <img src="https://img.shields.io/badge/Live_Demo-⚡_SuperCool-06B6D4?style=flat-square" alt="Live Demo" />
  </a>
</p>

<h1 align="center">⚡ PySDN SuperCool</h1>
<p align="center"><strong>AI 影片生成 × 社群信號追蹤平台</strong></p>
<p align="center">
  React 19 + Vite 8 前端 · 四大 AI 擴展模組<br/>
  <code>SuperForge</code> · <code>SuperTune</code> · <code>SuperTrack</code> · <code>SuperScript</code>
</p>

<p align="center">
  <a href="https://iiooiioo888.github.io/pysdn_index/">🔗 Live Demo</a> ·
  <a href="https://iiooiioo888.github.io/pysdn_index/realms">📚 三界資訊</a> ·
  <a href="#-快速開始">🚀 Quick Start</a> ·
  <a href="#-路由一覽">🗺 Routes</a> ·
  <a href="#-api-端點">📡 API</a>
</p>

---

> **注意**：社群爬蟲後端（SocialCrawler）已遷移至獨立倉庫 👉 [iiooiioo888/SuperTrack](https://github.com/iiooiioo888/SuperTrack)

## 📖 目錄

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
├── frontend_new/                  # React 19 + Vite 8 前端（首頁、模組、模型、FAQ、三界、文件、實驗室、面板）
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

> 後端（SuperTrack）已獨立為 **SuperTrack** 專案 → [GitHub](https://github.com/iiooiioo888/SuperTrack)

---

## ⚡ 快速開始

**環境需求**：Node.js ≥ 20 · npm

```bash
# 1. 克隆倉庫
git clone https://github.com/iiooiioo888/pysdn_index.git
cd pysdn_index/frontend_new

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器
npm run dev
# → http://localhost:3000/pysdn_index/
```

---

## 🛠️ 可用指令

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
| `/realms` | **Note 三界**互動式資訊頁（天域／神域／鏡界；支援 `?realm=tianyu` / `shenyu` / `jingjie`） | 核心 |
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

對應 `frontend_new/src/lib/api.ts`：

| 方法 | 路徑 | 說明 |
|------|------|------|
| `GET` | `/api/health` | 健康檢查 |
| `POST` | `/api/video/generate` | 生成影片 |
| `GET` | `/api/video/status/:taskId` | 影片任務狀態 |
| `GET` | `/api/video/list` | 影片列表（分頁） |
| `POST` | `/api/drama/create` | 建立短劇 |
| `GET` | `/api/drama/list` | 短劇列表（分頁） |
| `POST` | `/api/image/generate` | 圖片生成 |
| `GET` | `/api/image/list` | 圖片列表（分頁） |
| `POST` | `/api/modules/supertune` | SuperTune 優化 |
| `POST` | `/api/modules/supertrack` | SuperTrack 趨勢 |
| `POST` | `/api/modules/superforge` | SuperForge 操作 |
| `POST` | `/api/contact` | 聯絡表單 |

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
| 核心頁（Home, Modules, Models, FAQ, Realms） | `eagerPage()` 同步匯出 | 避免 dev 模式下 `base` 非 `/` 時的動態 import 問題 |
| 文件頁（docs/*） | `React.lazy()` | 按需載入 |
| 實驗室（labs/*） | `React.lazy()` | 按需載入 |
| 面板（panel/*） | `React.lazy()` | 按需載入 |

### 首頁區塊

| 組件 | 說明 |
|------|------|
| `Hero` | 品牌主視覺、打字機動畫、計數器動效 |
| `About` | 關於區塊（痛點 vs 方案對比 + 特性卡片） |
| `ThreeRealmsSection` | **Note 三界**（`#three-realms`）：嵌入 `ThreeRealmsInteractive`，可切換天域／神域／鏡界並連結 [Note 倉庫](https://github.com/iiooiioo888/Note) |
| `Products` | 影片 / 短劇 / 圖片分頁切換，含自動播放影片 mockup |
| `ModulesPanel` | 四大模組卡片 + MiniCards |
| `Showcase` | 案例展示輪播 |
| `WorkflowSection` | 四步驟工作流程說明（定錨 → 快打 → 沉澱 → 上架） |
| `Contact` | 聯絡表單（含前端驗證） |
| `Footer` | 頁腳 |

首頁使用 `HomeLazySection`（IntersectionObserver）延遲載入各區塊，觸發 React.lazy 分塊。

### Note 三界互動頁

| 項目 | 說明 |
|------|------|
| 首頁錨點 | `#three-realms`，與導覽／頁腳連結一致 |
| 獨立路由 | `/realms`（`ThreeRealmsPage`），版面含標題與導讀 |
| 互動元件 | `ThreeRealmsInteractive`：`role="tablist"` 切換境界、鍵盤 ←/→／Home／End、兩側箭頭循環；完整頁會將選取狀態同步至 **`?realm=`**（`tianyu` / `shenyu` / `jingjie`）便於分享 |
| 內容來源 | 對應開源 Obsidian 筆記 [iiooiioo888/Note](https://github.com/iiooiioo888/Note) 頂層資料夾 **天域、神域、鏡界** 的敘事主軸（網站為精簡導覽，詳見倉庫內 Markdown） |
| 翻譯鍵 | `realms_*`、`realms_ix_*`、`nav_realms`（五語系 JSON） |

### 設計系統

- **主題**：暗色科技風格，CSS 變數驅動
- **響應式**：移動端優先，`env(safe-area-inset-*)` 適配瀏海 / 手勢條
- **動畫**：`IntersectionObserver` 共用單例 + `MutationObserver` 掃描
- **減動效**：`prefers-reduced-motion: reduce` 時自動跳過
- **安全**：所有 `dangerouslySetInnerHTML` 經 DOMPurify 消毒

---

## 🚀 部署

### GitHub Pages（自動）

推送到 `main` 時，`.github/workflows/deploy.yml` 自動執行：

1. `npm ci` → `npm run build`（`frontend_new/`）
2. 上傳 `dist/` 為 Pages artifact
3. 部署到 GitHub Pages

### 手動部署

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
4. `src/routes/lazyPages.tsx` — 加入匯出：屬**核心頁**且需避開 dev 下動態 import 問題者，可仿 `FaqPage` / `ThreeRealmsPage` 使用 `eagerPage()`；其餘用 `lazy()`

若為公開導覽頁，可同步更新 `public/sitemap.xml` 與首頁／頁腳導覽（如 `Navbar.tsx`、`Footer.tsx`）。

### 國際化

**主站翻譯**（5 語系）：`src/locales/{zh-TW,zh-CN,en,ja,ko}.json`
- 使用 `useTranslation()` → `t('key')`

**文件翻譯**（按需載入）：`src/locales/doc/{superforge,superscript,supertrack,supertune,modules}.json`
- 使用 `useDocBundle('supertrack')` → `t('key')`

新增語系：在 `src/locales/` 建立 JSON → 在 `src/lib/i18n.ts` 的 `loaders` 註冊 → 在 `src/routes/langQuery.ts` 的 `APP_LANG_CODES` 加入代碼。

### 添加新組件

```tsx
// src/components/NewComponent.tsx
export function NewComponent() {
  return <div>Content</div>
}
```

---

## 🆘 常見問題

<details>
<summary><strong>前端無法連接後端 API？</strong></summary>

確保 SuperTrack 後端已啟動。檢查：
- `frontend_new/.env` 的 `VITE_SUPERTRACK_API_URL` 是否指向正確的後端位址
- `vite.config.ts` 的 proxy 設定是否正確（預設 `http://localhost:8000`）
- Zustand `useApiStore` 的 `baseUrl` 是否被覆寫
- 後端詳見 [SuperTrack 倉庫](https://github.com/iiooiioo888/SuperTrack)
</details>

<details>
<summary><strong>Vite 端口被佔用？</strong></summary>

Vite 會自動嘗試下一個可用端口。也可在 `vite.config.ts` 指定：
```ts
server: { port: 3000 }
```
</details>

<details>
<summary><strong>如何新增語言？</strong></summary>

1. 在 `src/locales/` 建立 `{lang-code}.json`
2. 在 `src/lib/i18n.ts` 的 `loaders` 加入對應匯入
3. 在 `src/routes/langQuery.ts` 的 `APP_LANG_CODES` 加入代碼
</details>

<details>
<summary><strong>Tailwind 樣式不生效？</strong></summary>

確認 `tailwind.config.cjs` 的 `content` 包含你的檔案路徑：
```js
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
```
</details>

<details>
<summary><strong>npm audit 有漏洞？</strong></summary>

`mermaid` 的傳遞依賴 `uuid` &lt; 14.0.0 有 2 個中等漏洞。`npm audit fix --force` 會降級 mermaid 到 9.x（破壞性變更），建議等待上游更新。
</details>

---

## 📝 注意事項

- Node.js **≥ 20**（`package.json` engines + `.nvmrc`）
- 前端 `base` 為 `/pysdn_index/`（GitHub Pages 子路徑部署）
- `dangerouslySetInnerHTML` 均經 DOMPurify 消毒
- Mermaid 使用 `securityLevel: 'strict'`

---

## 📄 授權

[ISC License](LICENSE) · © 2026 PySDN / project contributors
