# frontend_new — 開發／LLM 交接說明

本文整理 `frontend_new/` 的架構、路由、國際化、建置與 API，方便接手開發或餵給 LLM 做改動時快速對齊上下文。

---

## 1. 專案定位

- **產品**：Pysdn SuperCool 行銷／說明站 — 首頁區塊（Hero、產品、模組、案例、工作流、聯絡）、獨立 **模組總覽**、**模型目錄**、**FAQ**，以及四套 **文件頁**（SuperForge / SuperScript / SuperTrack / SuperTune）。
- **技術棧**：React 19、TypeScript、Vite 8、`react-router-dom` 7、`i18next` + `react-i18next`、Zustand、Axios、Tailwind CSS 3（與大量自訂 `src/styles/*.css`）。
- **套件名**：`pysdn-frontend`（見 `package.json`）。

---

## 2. 指令與環境

| 指令 | 說明 |
|------|------|
| `npm run dev` | Vite 開發伺服器，預設 port **3000** |
| `npm run build` | `tsc` → `vite build` → `scripts/copy-404.mjs` → `scripts/postbuild.mjs` |
| `npm run preview` | 預覽 production build |

- **環境變數**：複製 `.env.example`；`VITE_API_URL` 為後端 base URL（預設見 `src/lib/store.ts`）。
- **Dev proxy**：`vite.config.ts` 將 `/api` 轉到 `http://localhost:8000`。

---

## 3. 部署與 Base Path（極重要）

- **生產 base**：`vite.config.ts` 內 `base: '/pysdn_index/'`（GitHub Pages 路徑）。
- **React Router**：`src/main.tsx` 使用 `BrowserRouter basename={import.meta.env.BASE_URL 去尾斜線}`，所有 **in-app 路徑** 必須相對於此 basename（見 `src/routes/paths.ts`）。
- **Dev 行為**：自訂 plugin `devRewriteRootToBase` 把 `/` 與 `/pysdn_index` 改寫到帶 base 的 URL，避免多餘 redirect。
- **GitHub Pages SPA**：`scripts/copy-404.mjs` 把 `dist/index.html` 複製為 `dist/404.html`，讓子路徑重新整理仍可回 SPA。
- **Postbuild**：`scripts/postbuild.mjs` 將 hashed CSS 複製為 `dist/assets/styles.css` 與 `dist/styles.css`，供 `public/*.html` 等靜態頁引用。

改部署網址或子路徑時，需同步：`vite.config.ts` 的 `base`、`index.html` 內 canonical／OG／JSON-LD 網址（若仍用該站）。

---

## 4. 目錄結構（精簡）

```
frontend_new/
├── index.html              # SPA 入口 + SEO meta / JSON-LD
├── vite.config.ts
├── tailwind.config.cjs
├── postcss.config.cjs
├── tsconfig.json
├── public/                 # 靜態資源（build 時拷貝到 dist）
│   ├── i18n/*.json         # 文件／模組頁用「分 bundle」翻譯（非 src/locales）
│   ├── *.html              # 部分舊式／獨立 HTML（如 superforge.html）
│   ├── css/, js/           # 文件頁輔助樣式與腳本
│   └── sitemap.xml, robots.txt
├── scripts/                # 建置後處理、文件 HTML 合併、語系同步等 *.mjs
└── src/
    ├── main.tsx            # initI18n → ErrorBoundary → BrowserRouter → App
    ├── App.tsx             # RevealScanBridge + AppRoutes
    ├── index.css           # @import 各元件 CSS + Tailwind + :root tokens
    ├── routes/
    │   ├── AppRoutes.tsx   # 所有 Route 定義
    │   ├── paths.ts        # PATHS 單一真相來源
    │   ├── lazyPages.tsx   # React.lazy 頁面
    │   ├── langQuery.ts    # APP_LANG_CODES、?lang= 輔助
    │   ├── NotFoundRedirect.tsx  # * → 首頁並保留 query
    │   └── RouteFallback.tsx
    ├── pages/              # 頁面元件
    ├── components/         # 共用與 docs/modules 子目錄
    ├── hooks/
    ├── lib/                # i18n.ts, store.ts, api.ts, motionPreference.ts
    ├── services/api.ts     # re-export lib/api
    ├── locales/*.json      # 主站 UI 翻譯（i18next）
    ├── data/modelsCatalog.ts
    └── styles/*.css
```

---

## 5. 路由對照表

定義於 `src/routes/paths.ts`（相對 basename）：

| 路徑 | 頁面元件 | 備註 |
|------|-----------|------|
| `/` | `HomePage` | 區塊懶載入；canvas 背景；hash 捲動 |
| `/modules` | `ModulesPage` | `useDocBundle('modules')` |
| `/models` | `ModelsPage` | 模型目錄，資料 `modelsCatalog.ts` |
| `/faq` | `FaqPage` | |
| `/docs/superforge` | `SuperForgeDocPage` | 等 |
| `/docs/superscript` | `SuperScriptDocPage` | |
| `/docs/supertrack` | `SuperTrackDocPage` | |
| `/docs/supertune` | `SuperTuneDocPage` | |
| `*` | `NotFoundRedirect` | 導向 `PATHS.home`，保留 `search`（含 `?lang=`） |

頁面皆在 `lazyPages.tsx` 以 `React.lazy` 載入，外層 `Suspense` + `RouteFallback`。

---

## 6. 國際化（兩套系統）

### 6.1 主站 UI — `src/locales/*.json` + `src/lib/i18n.ts`

- 語系：`zh-TW`（預設與 fallback）、`zh-CN`、`en`、`ja`、`ko`（`langQuery.ts` 與 `i18n.ts` 一致）。
- **首屏策略**：依 URL `?lang=` 只先載入當前語系 + 必要時 fallback；其餘語系在 `changeLanguage` 時動態 `addResourceBundle`。
- 元件內使用 `useTranslation()`。

### 6.2 文件頁／模組總覽 — `public/i18n/{superforge,superscript,supertrack,supertune,modules}.json`

- `useDocBundle(name)`：`fetch(\`${import.meta.env.BASE_URL}i18n/${name}.json\`)`，依 `?lang=` 與 `i18n.language` 合併字串（zh-TW 底 + 當前語覆蓋）。
- 會同步：補上 query `lang`、必要時觸發 `i18n.changeLanguage`、更新 `document.title` / `meta description`、依語系調整 `body` 字族與 `html[lang]`。
- 文件頁大量內容透過翻譯 key 的 **HTML 字串**（如 `dangerouslySetInnerHTML`）插入，修改文案時需同步各語 JSON。

---

## 7. 狀態與 API

- **Zustand**（`src/lib/store.ts`）：
  - `useApiStore`：`baseUrl`（預設 `VITE_API_URL` 或 localhost）、loading / error。
  - `useUIStore`：選單、activeSection、theme。
- **Axios**（`src/lib/api.ts`）：攔截器掛上 `useApiStore.getState().baseUrl`；`apiService` 封裝 health、video、drama、image、modules、contact 等路徑（與後端 `/api/...` 約定一致）。
- **Vite proxy**：開發時 `/api` 走 `localhost:8000`，與 `api` 的 baseURL 搭配使用。

---

## 8. 主要 UX／技術細節

- **Reveal 動畫**：根層 `RevealScanBridge` 呼叫 `useRevealPageScan()`，統一掃描 `.reveal`，避免多處 `IntersectionObserver`。
- **首頁背景**：`useCanvasBackground` + `#bgCanvas`；`useHomeHashScroll` 處理錨點捲動。
- **模型展示**：`src/data/modelsCatalog.ts` 定義型別與 `CATALOG_MODELS`；文案為多語 `Record<UiLang, string>`。
- **樣式**：`index.css` 匯入各功能 CSS，並定義 `:root` 設計 token；Tailwind 用於工具類；文件頁另有 `src/styles/doc-page.css` 等。
- **錯誤**：`ErrorBoundary` 包住整個 app。

---

## 9. `scripts/` 工具鏈（維護文件／語系時會用到）

| 腳本 | 用途（依檔名與 repo 慣例） |
|------|---------------------------|
| `copy-404.mjs` | SPA 404 fallback |
| `postbuild.mjs` | 複製 hashed CSS 為 `styles.css` |
| `syncLocalesFromZhTw.mjs` | 語系同步 |
| `gen-modules-i18n.mjs` | 模組 i18n 生成 |
| `merge-superforge-doc-html.mjs` / `patch-doc-bundles.mjs` / `doc-bodies/` | SuperForge 文件 HTML 合併與 bundle 修補 |
| 其他 `apply-locale-copy-refactor.mjs` 等 | 批次重構文案 |

改文件內容時，先確認是否由這些腳本產生，避免手改後被覆蓋。

---

## 10. 給 LLM／新接手的修改指引

1. **新增頁面**：在 `paths.ts` 加常數 → `AppRoutes.tsx` 加 `Route` → 新增 page 元件並在 `lazyPages.tsx` lazy 匯出。
2. **導覽連結**：使用 `PATHS` + `Link`；若需語系，搭配 `toLangSearch` / `useLangQuery`（與現有 Navbar 一致）。
3. **新字串**：主站用 `locales/*.json`；文件或模組總覽用 `public/i18n/*.json` 並在頁面用 `useDocBundle` 或擴充該 hook。
4. **絕對 URL**：任何 `fetch` 靜態資源請用 `` `${import.meta.env.BASE_URL}...` ``，避免 base path 錯誤。
5. **後端契約**：只改 `lib/api.ts` 的 path／payload 時，需與 repo 內後端或 API 規格對齊。

---

## 11. 依賴一覽（production）

`react`、`react-dom`、`react-router-dom`、`i18next`、`react-i18next`、`zustand`、`axios`、`vite`、`@vitejs/plugin-react`（見 `package.json`；Vite 相關在開發建置時使用）。

---

*此文件由專案目錄盤點產生；若程式碼變更，請同步更新本檔對應章節。*
