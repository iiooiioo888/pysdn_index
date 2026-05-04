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

- **環境變數**：複製 `.env.example`；`VITE_API_URL` 為後端 base URL，`VITE_SUPERTRACK_API_URL` 為 SuperTrack 後端位址。
- **Dev proxy**：`vite.config.ts` 將 `/api` 轉到 `VITE_SUPERTRACK_API_URL`（預設 `http://localhost:8000`）。

---

## 2.1 React 應用架構（擴充說明）

本專案為 **全函式元件**（function components）+ **Hooks** 為主；唯 **`ErrorBoundary`** 使用 **class 元件**（因 React 18 仍無內建 error boundary hook，需 `getDerivedStateFromError` / `componentDidCatch`）。

### 2.1.1 掛載與根節點

- 入口檔 `src/main.tsx`：`initI18n()` 完成後，以 `createRoot` 掛在 `#root`。
- 層次（由外到內）：`StrictMode` → `ErrorBoundary` → `BrowserRouter`（`basename` 與生產 `base` 一致，見 §3）→ `App`。
- `App`（`App.tsx`）僅組合兩子樹：全域 **Reveal 掃描橋** `RevealScanBridge`、以及 **`AppRoutes`**。勿在 `App` 放業務邏輯，宜留在頁面或子元件。

### 2.1.2 路由與 `React.Suspense`

- 所有頁面元件在 `lazyPages.tsx` 以 `React.lazy(() => import(...))` 動態匯入，**降低首包體積**。
- `AppRoutes` 以單一 `<Suspense fallback={<RouteFallback />}>` 包住整棵 `<Routes>`，懶載入頁面切換時顯示統一載入 UI。
- 使用 React Router 7 的 **宣告式** `<Route path={...} element={...} />`；實際 URL 前綴仍受 `basename` 約束，路徑常數集中於 `paths.ts` 的 `PATHS`，**避免字串路徑散落**。
- 萬用路由 `path="*"` 使用 `NotFoundRedirect`，導回首頁並保留 `search`（含 `?lang=`），避免變更語系或分享連結丟參。

### 2.1.3 文件／模組頁與 `useDocBundle`

- 文件頁／模組總覽透過 `useDocBundle('superforge' | …)`：**Vite 動態 import** `src/locales/doc/<name>.json`，以 **i18next 命名空間 `doc_<name>`** 註冊（與主站同一 `i18n` 實例）。
- 仍以 **zh-TW 為底、當前語覆蓋** 合併後寫入各語 resource（行為與舊版 `dict` 合併一致）。
- 提供 `t(key)`（等同 `useTranslation('doc_*')`）、`ready`、`loadError`、`lang`、`dict`（相容舊呼叫）。
- 副作用：同步 `document.title`、`meta description`。
- 文件翻譯集中於 `src/locales/doc/*.json`，由 Vite 直接 import，不再需要同步至 `public/`。
- 頁面內以 `ready` 閘門顯示載入/錯誤；HTML 字串仍以 **`dangerouslySetInnerHTML`** 渲染，僅上可信內容。

### 2.1.4 主站 UI 的 `react-i18next`

- 首頁、Navbar 等用 **`useTranslation()`**（預設命名空間 `translation`）+ `src/locales/*.json`。
- 文件長文用 **`useTranslation('doc_<bundle>')`**（由 `useDocBundle` 封裝）。**資料路徑不同，但皆為同一套 i18next**，新字串仍須區分：短 UI 鍵放 `locales`，長篇 HTML 鍵放 `locales/doc`。

### 2.1.5 跨頁可重用邏輯

- 依需求可查 `src/hooks/`（例如捲動、Reveal、首頁雜湊、文件 bundle）與 `lib/` 的 store／API。
- **Zustand** 用於全站層級 API baseURL、UI 小狀態；頁內表單優先用 **React `useState` / `useReducer`**，避免過早全域化。

### 2.1.6 圖表與非 React 內容

- 模組文件中的 **Mermaid** 由 `components/docs/DocMermaid.tsx` 等封裝；圖定義集中於 `components/docs/mermaidCharts.ts`。

### 2.1.7 新開發者檢核（React 向）

1. 新頁面：`paths.ts` → `AppRoutes` → `lazyPages.tsx` 懶匯出（與 §10 同）。
2. 需要多語長文且含 HTML：放 `src/locales/doc/*.json` + `useDocBundle`；短 UI 字串用 `src/locales` + `t()`。
3. 不直接在元件內寫死 **絕對路徑** 去 fetch 靜態資源；用 `` `${import.meta.env.BASE_URL}...` ``。
4. 在 StrictMode 下，開發期 **useEffect 可能執行兩次**；若寫了訂閱或 fetch，務必帶 **cleanup**（`useDocBundle` 已用 `cancelled` 範式）。

---

## 3. 部署與 Base Path（極重要）

- **生產 base**：`vite.config.ts` 內 `base: '/pysdn_index/'`（GitHub Pages 路徑）。
- **React Router**：`src/main.tsx` 使用 `BrowserRouter basename={import.meta.env.BASE_URL 去尾斜線}`，所有 **in-app 路徑** 必須相對於此 basename（見 `src/routes/paths.ts`）。
- **Dev 行為**：自訂 plugin `devRewriteRootToBase` 把 `/` 與 `/pysdn_index` 改寫到帶 base 的 URL，避免多餘 redirect。
- **GitHub Pages SPA**：`scripts/copy-404.mjs` 把 `dist/index.html` 複製為 `dist/404.html`，讓子路徑重新整理仍可回 SPA。
- **Postbuild**：`scripts/postbuild.mjs` 將 hashed CSS 複製為 `dist/assets/styles.css` 與 `dist/styles.css`。

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
│   ├── i18n/*.json         # 由 src/locales/doc 同步而來（靜態 HTML fetch）；單一真相在 src
│   ├── 404.html            # GitHub Pages SPA fallback
│   ├── css/, js/           # 文件頁輔助樣式與腳本
│   └── sitemap.xml, robots.txt
├── scripts/                # 建置後處理、文件 HTML 合併、語系同步等 *.mjs
└── src/
    ├── main.tsx            # initI18n → ErrorBoundary → BrowserRouter → App
    ├── App.tsx             # RevealScanBridge + AppRoutes
    ├── index.css           # @import app-sections.css（合併後區塊樣式）+ Tailwind + :root tokens
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
    ├── locales/*.json      # 主站 UI 翻譯（translation）
    ├── locales/doc/*.json  # 文件／模組長文案（命名空間 doc_*）
    ├── data/modelsCatalog.ts
    └── styles/*.css        # 首頁區塊：分檔 nav/hero/… 為編輯來源；`merge-app-sections-css.mjs` 產出 app-sections.css（predev/build 自動執行）
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

## 6. 國際化（同一 i18next，兩類命名空間／檔案）

### 6.1 主站 UI — `src/locales/*.json` + `src/lib/i18n.ts`

- 語系：`zh-TW`（預設與 fallback）、`zh-CN`、`en`、`ja`、`ko`（`langQuery.ts` 與 `i18n.ts` 一致）。
- **首屏策略**：依 URL `?lang=` 只先載入當前語系 + 必要時 fallback；其餘語系在 `changeLanguage` 時動態 `addResourceBundle`。
- 元件內使用 `useTranslation()`（命名空間 `translation`）。

### 6.2 文件頁／模組總覽 — `src/locales/doc/{superforge,superscript,supertrack,supertune,modules}.json`

- `useDocBundle(name)`：動態 `import()` 對應 JSON，以命名空間 **`doc_<name>`** 註冊；合併規則仍為 zh-TW 底 + 當前語覆蓋。
- 會同步：補上 query `lang`、必要時觸發 `i18n.changeLanguage`、更新 `document.title` / `meta description`。
- **`src/locales/doc/*.json`** 為文件翻譯主檔，由 Vite 直接 import。
- 文件頁大量內容為 **HTML 字串** key，修改時同步五語 JSON。

---

## 7. 狀態與 API

- **Zustand**（`src/lib/store.ts`）：
  - `useApiStore`：僅 `baseUrl`（預設 `VITE_API_URL` 或 localhost）與 `setBaseUrl`。
- **Axios**（`src/lib/api.ts` + `apiTypes.ts`）：攔截器掛上 `useApiStore.getState().baseUrl`；`apiService` 以型別化請求／回應封裝 health、video、drama、image、modules、contact 等路徑（與後端 `/api/...` 約定一致）。
- **Vite proxy**：開發時 `/api` 走 `localhost:8000`，與 `api` 的 baseURL 搭配使用。

---

## 8. 主要 UX／技術細節

- **Reveal 動畫**：根層 `RevealScanBridge` 呼叫 `useRevealPageScan()`，統一掃描 `.reveal`，避免多處 `IntersectionObserver`。
- **首頁背景**：`useCanvasBackground` + `#bgCanvas`；`useHomeHashScroll` 處理錨點捲動。
- **模型展示**：`src/data/modelsCatalog.ts` 定義型別；條目內容在 `catalogModels.json`（多語 `Record<UiLang, string>`）。
- **樣式**：`index.css` → `app-sections.css`（首頁區塊合併檔，由 `scripts/merge-app-sections-css.mjs` 產生）+ `:root` token；Tailwind 工具類；文件頁另有 `src/styles/doc-page.css` 等。
- **錯誤**：`ErrorBoundary` 包住整個 app。

---

## 9. `scripts/` 工具鏈（維護文件／語系時會用到）

| 腳本 | 用途（依檔名與 repo 慣例） |
|------|---------------------------|
| `copy-404.mjs` | SPA 404 fallback |
| `postbuild.mjs` | 複製 hashed CSS 為 `styles.css` |

| `merge-app-sections-css.mjs` | 合併首頁 13 區塊 CSS → `app-sections.css` |
| `syncLocalesFromZhTw.mjs` | 語系同步 |
| `gen-modules-i18n.mjs` | 模組 i18n 生成 |
| `merge-superforge-doc-html.mjs` / `patch-doc-bundles.mjs` / `doc-bodies/` | SuperForge 文件 HTML 合併與 bundle 修補 |
| 其他 `apply-locale-copy-refactor.mjs` 等 | 批次重構文案 |

改文件內容時，先確認是否由這些腳本產生，避免手改後被覆蓋。

---

## 10. 給 LLM／新接手的修改指引

1. **新增頁面**：在 `paths.ts` 加常數 → `AppRoutes.tsx` 加 `Route` → 新增 page 元件並在 `lazyPages.tsx` lazy 匯出。
2. **導覽連結**：使用 `PATHS` + `Link`；若需語系，搭配 `toLangSearch` / `useLangQuery`（與現有 Navbar 一致）。
3. **新字串**：主站用 `src/locales/*.json`；文件長文用 `src/locales/doc/*.json` + `useDocBundle`。
4. **絕對 URL**：任何 `fetch` 靜態資源請用 `` `${import.meta.env.BASE_URL}...` ``，避免 base path 錯誤。
5. **後端契約**：只改 `lib/api.ts` 的 path／payload 時，需與 repo 內後端或 API 規格對齊。

---

## 11. 依賴一覽（production）

`react`、`react-dom`、`react-router-dom`、`i18next`、`react-i18next`、`zustand`、`axios`、`mermaid`（見 `package.json`；`vite`／`@vitejs/plugin-react` 在 devDependencies）。

---

*此文件由專案目錄盤點產生；若程式碼變更，請同步更新本檔對應章節。*
