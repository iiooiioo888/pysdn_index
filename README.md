# PySDN Frontend - AI 影片生成平台

現代化的 React 19 + TypeScript + Vite + Tailwind CSS 前端應用，提供流暢的動畫效果和響應式設計。

## 🚀 技術棧

- **React 19** - 最新版本，使用 Hooks 和函數組件
- **TypeScript** - 類型安全的 JavaScript 超集
- **Vite** - 快速的開發服務器和構建工具
- **Tailwind CSS** - 實用優先的 CSS 框架
- **i18next** - 國際化支持（中文/英文）
- **Axios** - HTTP 請求庫
- **React Router** - 單頁應用路由、程式碼分割（`React.lazy` + `Suspense`）
- **Zustand** - 輕量全域狀態（API 基底 URL 等）

前端 **React 實作要點**（入口層次、`useDocBundle` 文件 i18n、StrictMode 與 ErrorBoundary、新增頁面流程）已寫在 [`frontend_new/DEVELOPER_HANDOFF.md`](frontend_new/DEVELOPER_HANDOFF.md) **§2.1**。

## 📦 安裝

需 **Node.js 20+**（見 `frontend_new/package.json` 的 `engines` 與 `frontend_new/.nvmrc`）。

```bash
cd frontend_new
npm install
```

## 🛠️ 開發

啟動開發服務器：

```bash
cd frontend_new
npm run dev
```

訪問 http://localhost:3000（見 `frontend_new/vite.config.ts` 的 `server.port`）

## 🏗️ 構建

生產環境構建：

```bash
cd frontend_new
npm run build
```

構建輸出在 `frontend_new/dist/` 目錄

## 🔍 預覽

預覽生產構建：

```bash
cd frontend_new
npm run preview
```

## 🎨 主要功能

### 頁面組件
- **Header** - 導航欄，支持語言切換
- **HeroSection** - 主視覺區域，帶有漸層文字和動畫按鈕
- **FeatureCard** - 功能卡片，展示六大核心功能
- **Footer** - 頁腳資訊

### 動畫效果
- 頁面載入時的淡入效果
- 卡片懸停時的縮放和位移
- 按鈕的 hover 和 click 動畫
- 背景裝飾元素的旋轉動畫
- 滾動觸發的進入動畫

### 響應式設計
- 移動端優先的設計
- 自適應網格佈局
- 流暢的斷點過渡

## 🌐 API 整合

前端已配置代理指向後端 API：

```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
  },
}
```

## 📁 項目結構

```text
pysdn_index/
├── frontend_new/          # React + TypeScript + Vite 前端
│   ├── src/
│   │   ├── components/    # UI 組件
│   │   ├── hooks/         # 自定義 Hooks
│   │   ├── lib/           # 工具函數、API 客戶端、狀態管理
│   │   ├── locales/       # 國際化資源
│   │   ├── App.tsx        # 主應用組件
│   │   └── main.tsx       # 應用入口
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.cjs
│   └── package.json
├── backend/               # FastAPI 後端服務
│   ├── main.py            # API 主應用程式
│   ├── requirements.txt   # Python 依賴
│   └── API.md             # API 文檔
├── frontend/              # 舊版靜態前端（保留參考）
└── README.md
```

## 🎯 可用指令

| 指令 | 說明 |
|------|------|
| `npm run dev` | 啟動開發服務器 |
| `npm run build` | 生產環境構建 |
| `npm run preview` | 預覽生產構建 |

## 🤝 與後端整合

確保後端服務運行在 `http://localhost:8000`，前端會通過代理自動轉發 API 請求。

主要 API 端點：
- `GET /api/health` - 健康檢查
- `POST /api/generate/video` - 生成影片
- `POST /api/generate/drama` - 創作短劇
- `POST /api/generate/image` - 圖片生成

## 📝 注意事項

- 確保 Node.js 版本 >= 18
- 首次運行需執行 `npm install`
- 開發模式下熱重載自動生效
- 生產構建會自動優化代碼和資源

## 📄 License

[ISC License](LICENSE)（倉庫根目錄 `LICENSE`）

---

## 🎨 前端功能特點

### 核心頁面
- **Hero 區塊**：品牌主視覺與核心价值展示
- **產品展示**：影片/短劇/圖片三大核心能力分頁切換
- **獨立模組**：SuperForge/SuperTune/SuperTrack 擴展功能卡片
- **案例展示**：真實作品案例輪播
- **聯絡表單**：需求蒐集與反饋提交

### 技術特色
- ✅ 響應式設計（桌面/平板/手機）
- ✅ 多語言支持（繁中/簡中/英文/日文/韓文）
- ✅ 暗色科技風格主題
- ✅ 組件化架構，易於維護擴展
- ✅ API 整合與錯誤處理
- ✅ 全局狀態管理
- ✅ 路由導航與頁面切換動畫
- ✅ 模組區塊提供「控制面板式」快速數據匯總（從後端 `/api/*/list` 取得 total；未啟動後端則顯示 `—`）

### 版面與設計系統（全視窗 × 多裝置）

- **主內容貼齊視窗寬度**：於 `frontend_new/src/index.css` 使用 `--layout-pad-x`、`--layout-pad-y`、`--layout-prose-max`；`.container`、首頁導覽 `.nav-inner`、文件導覽 `.doc-nav-inner` 採相同水平留白，並以 `max(..., env(safe-area-inset-*))` 適配瀏海／手勢條。
- **可讀寬度與全寬外殼**：文件／實驗室 `.doc-main-inner` 改為全寬；`article.doc`、頁尾（一般文件頁）與 FAQ 清單以約 **56rem** 置中，避免長行難讀；圖表與寬表仍可在欄內橫向捲動。
- **視窗高度**：`.doc-main` 使用 `min-height: calc(100dvh - 72px)`；首頁 `.site-shell` 使用 `min-height: 100dvh`。
- **卡片表面統一**：文件區塊（摘要、Mermaid、範例、GitHub、模擬儀表 `.sim-panel`）、模組首頁卡片／cheat 列、FAQ 摺疊列、產品 mockup 等，對齊 **邊框、`var(--radius)`、`--bg-card`、輕陰影**；模組卡片 hover 上浮僅在精細指標裝置啟用，減少觸控誤觸。
- **模組總覽**：`modules-shell` 改為全寬；實驗室 `doc-sim-lab` 不再限制 1180px，與全站規則一致。
- **路由**：SPA 路由見 `frontend_new/src/routes/appRouter.tsx`（`createBrowserRouter`）。

### SuperTrack 示範面板（`/panel/supertrack`）

- **版面**：`SuperTrackPanel` 使用 `st-panel--fullscreen`，搭配 `doc-main--st-panel`／`doc-main-inner--st-panel`，工作區吃滿剩餘視窗高度；「追蹤目標」表單固定、卡片矩陣區獨立捲動。
- **追蹤目標**：建立後欄位唯讀；在編輯模式下可**暫停／恢復**、**刪除**並釋出探針。卡片含探針節點狀態、平台、**爬蟲入庫**（連線時自 `GET /api/items` 依 API `platform` 彙總；並解析 `payload` 之內容型態、互動加總、含媒體比例等）、以及**任務／排程示範欄位**（待真實任務 API）。
- **編輯模式**：`frontend_new/src/hooks/useSuperTrackPanelEditMode.ts` — 開發環境或設定 **`VITE_SUPERTRACK_PANEL_EDIT=true`** 時可編輯；型別見 `frontend_new/src/vite-env.d.ts`。
- **文件導流**：`/docs/supertrack`「試用示範」僅保留**示範面板**連結（已移除實驗室大螢幕儀表板入口）。SocialCrawler 本地開發可參考倉內 `social-crawler` 與 `useSocialCrawlerApi`。

---

## 🔧 開發指南

### 環境要求
- Node.js 18+ 
- Python 3.9+
- npm 或 pnpm

### 前端開發流程

1. **安裝依賴**
   ```bash
   cd frontend_new
   npm install
   ```

2. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

3. **配置 API 端點**
   
   修改 `src/lib/api.ts` 中的 `API_BASE_URL`：
   ```typescript
   const API_BASE_URL = 'http://localhost:8000';
   ```

4. **添加新組件**
   
   在 `src/components/` 下創建新組件文件：
   ```tsx
   // src/components/NewComponent.tsx
   import React from 'react';
   
   export const NewComponent: React.FC = () => {
     return <div>New Component</div>;
   };
   ```

5. **國際化配置**
   
   在 `src/locales/` 下添加翻譯文件，使用 `useTranslation` hook：
   ```tsx
   import { useTranslation } from 'react-i18next';
   
   const { t } = useTranslation();
   <h1>{t('hero.title')}</h1>
   ```

### 後端開發流程

1. **設置虛擬環境（推薦）**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

2. **安裝依賴**
   ```bash
   pip install -r requirements.txt
   ```

3. **啟動開發伺服器**
   ```bash
   python main.py
   ```

4. **添加新 API 端點**
   
   在 `backend/main.py` 中添加路由：
   ```python
   @app.post("/api/new-endpoint")
   async def new_endpoint(data: Schema):
       return {"result": "success"}
   ```

---

## 📦 生產部署

### 前端部署

```bash
# 構建生產版本
cd frontend_new
npm run build

# 輸出目錄：dist/
# 可部署至任何靜態託管服務（Vercel, Netlify, GitHub Pages 等）
```

### 後端部署

```bash
# 使用 Gunicorn + Uvicorn workers
pip install gunicorn
gunicorn backend.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Docker 部署（可選）

創建 `Dockerfile`：
```dockerfile
FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY frontend_new/package*.json ./
RUN npm ci
COPY frontend_new/ .
RUN npm run build

FROM python:3.11-slim
WORKDIR /app
COPY --from=frontend-build /app/dist ./static
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 🧪 測試

```bash
# 前端測試（待添加）
cd frontend_new
npm test

# 後端測試（待添加）
cd backend
pytest
```

---

## 📝 舊版前端說明

`frontend/` 目錄保留原始 Vanilla JS 版本供參考：
- 純 HTML/CSS/JavaScript 實現
- 包含 `modules.html` 控制面板
- 使用 PurgeCSS 優化樣式
- 自研 i18n 系統

如需使用舊版，請在 `frontend/` 目錄下執行：
```bash
python serve.py
# 訪問 http://localhost:8080
```

---

## 🤝 貢獻指南

1. Fork 本專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

---

## 📄 授權

© 2026 Pysdn. All rights reserved.

---

## 🆘 常見問題

### Q: 前端無法連接後端 API？

A: 確保後端伺服器已啟動，並檢查 `src/lib/api.ts` 中的 `API_BASE_URL` 配置是否正確。

### Q: 開發伺服器端口被佔用？

A: Vite 會自動嘗試下一個可用端口，或在 `vite.config.ts` 中指定端口：

```typescript
server: { port: 3000 }
```

### Q: Windows 上執行 `npm run dev/build` 顯示 `'vite' 不是內部或外部命令`？

A: 這通常代表 `node_modules/.bin` 的 Windows shim（`vite.cmd` / `vite.ps1`）沒有正確生成或被破壞。請在 `frontend_new/` 依序執行：

```powershell
npm rebuild
npm run build
```

若仍失敗，直接用「乾淨重裝」（見下一題）。

### Q: `Cannot find native binding` / `@rolldown/binding-win32-x64-msvc` 找不到？

A: 這是 Windows 上 optional 原生依賴漏裝的常見狀況（安裝快取或 lockfile/目錄狀態不一致時容易發生）。在 `frontend_new/` 執行乾淨重裝：

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
npm run build
```

### Q: 如何添加新語言？

A: 在 `src/locales/` 下創建新的 JSON 文件，並在 `src/lib/i18n.ts` 中註冊。

### Q: Tailwind 樣式不生效？

A: 確保 class 名稱正確，並檢查 `tailwind.config.cjs` 的 content 配置是否包含所有文件路徑。

---
