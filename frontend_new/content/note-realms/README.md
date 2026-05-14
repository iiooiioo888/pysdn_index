# 三界原始 Markdown（本倉庫）

`npm run sync:realms` 會掃描此目錄，產生 `src/data/threeRealmsFeatures*.ts` 與鏡界 `public/data/three-realms-jingjie-bodies.json`。

## 目錄結構

請維持與原 [Note](https://github.com/iiooiioo888/Note) 相同的中文頂層資料夾名稱：

| 資料夾 | 對應 |
|--------|------|
| `天域/` | 天域；建議保留 `data/conclusions/`、`data/interactions/`、`data/tasks/`、`data/knowledge/` 等結構以利分類與 slug 規則 |
| `神域/` | 神域 |
| `鏡界/` | 鏡界 |

會收錄副檔名為 `.md` 的檔案；會略過檔名為 `readme.md` / `README_old.md` 的檔案。

## 更新流程

1. 編輯或同步此目錄下的 Markdown。
2. 於 `frontend_new` 執行：`npm run sync:realms`
3. 執行：`npm run validate:realms`
4. 將**此目錄**與**產生的** `threeRealmsFeatures*.ts`、`three-realms-jingjie-bodies.json` 一併提交。

## 選用環境變數

- `THREE_REALMS_LOCAL_ROOT` — 改用其他資料夾作為來源（相對 `frontend_new` 或絕對路徑）。
- `REALMS_SOURCE_LINK_REPO` — UI「原始檔」GitHub 連結的 repo（預設本專案 `iiooiioo888/pysdn_index`，路徑前綴固定為 `frontend_new/content/note-realms/`）。

## 一次性從 Note 複製來源（本機）

```bash
git clone https://github.com/iiooiioo888/Note.git /tmp/Note-copy
mkdir -p content/note-realms
cp -R /tmp/Note-copy/天域 content/note-realms/
cp -R /tmp/Note-copy/神域 content/note-realms/
cp -R /tmp/Note-copy/鏡界 content/note-realms/
```

Windows PowerShell 可改用 `robocopy` 或檔總管複製。
