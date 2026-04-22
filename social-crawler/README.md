# SocialCrawler（SuperTrack 參考後端）

Python **FastAPI** 後端：統一調度、SQLite／JSONL 儲存、可插拔 **Platform Adapter**。預設提供 **`demo`** 適配器（不需外網），用於驗證管線。

## 需求

- Python 3.10+

## 安裝

```bash
cd social-crawler
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

## 指令

```bash
# 產生 config.yaml、建立 data/ 與資料表
python -m social_crawler init

# 示範擷取（platform=demo）
python -m social_crawler crawl --platform demo --query "測試"

# 列出最近寫入 SQLite 的列
python -m social_crawler list

# HTTP 服務（預設 http://127.0.0.1:8000）
python -m social_crawler serve
```

## API（與前端代理對齊）

`frontend_new` 的 Vite 已將 **`/api` 代理到 `http://localhost:8000`**。啟動 `serve` 後可呼叫：

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | `/api/health` | 健康檢查 |
| GET | `/api/platforms` | 已註冊平台 |
| GET | `/api/items` | 最近內容 |
| POST | `/api/crawl` | JSON：`{"platform":"demo","query":"x"}` |

## 設定

- 環境變數前綴：`SC_`（例如 `SC_DB_PATH`）
- `python -m social_crawler init` 會產生 `config.yaml`（已列入 `.gitignore`）；亦可複製 `config.example.yaml`
- Windows 終端機若中文亂碼，可設定 `PYTHONUTF8=1` 後再執行 CLI

## 模組一覽

- **`adapters/`**：`demo` 可跑；`xhs`、`youtube`、`douyin`（含 TikTok）、`international`（X／Reddit 等）、`kuaishou`、`bilibili`、`instagram`、`platform_gaps`（影片號／公眾號／Threads／LinkedIn／RSS）— 均已註冊，多數為 `NotImplementedError` 骨架，待填業務邏輯。
- **`storage/`**：`base.ContentStore` 協定、`SQLiteStore`、`JsonlStore`。
- **`scheduler/`**：令牌桶、優先級佇列、**指數退避重試**（骨架錯誤不重試）。

## 擴充

1. 在對應 `adapters/*.py` 實作 `search`（及可選 `fetch_user_posts`）。
2. 若新增平台：擴充 `models/schema.Platform` 並在 `registry.py` 註冊。
3. 詳見 `SuperTrack_Documentation.md` §10.0、§10.5。
