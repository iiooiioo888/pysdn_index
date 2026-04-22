/** 四份模組文件頁共用的 Mermaid 定義（思維導圖 + 流程／資料流） */

export const SUPERFORGE_MINDMAP = `mindmap
  root((SuperForge))
    知識儲存
      pgvector 語意
      全文檢索
      版本與標籤
    角色與權利
      情緒·性格·方言·外觀
      真人授權／OC·版權
    擷取管線
      匯入清洗
      結構化欄位
      同步備援
    檢索與應用
      混合搜尋
      命中率優化
      對接生成工作流`

export const SUPERFORGE_FLOW = `flowchart LR
  A[創作者 / API] --> B[匯入與驗證]
  B --> C[Embedding]
  C --> D[(pgvector)]
  B --> E[(全文索引)]
  D --> F[混合檢索]
  E --> F
  F --> G[提示詞建議]
  G --> H[影像生成工作流]`

export const SUPERSCRIPT_MINDMAP = `mindmap
  root((SuperScript))
    Architect
      集幕骨架
      角色弧線
    Continuity
      人設一致
      時間線檢查
    角色控制
      情緒·性格·方言·外觀
      真人審校／OC·版權
    Writer
      對白場景
      Voice Profile
    Format
      場頭 INT/EXT
      匯出格式`

export const SUPERSCRIPT_FLOW = `flowchart LR
  U[使用者設定] --> A[Architect 骨架]
  A --> C[Continuity]
  C -->|通過| W[Writer]
  C -->|退回| A
  W --> F[Format]
  F --> OUT[標準劇本]
  W -.->|場景提示詞| SF[SuperForge]
  ST[SuperTrack] -.->|熱點注入| A
  W -.->|對白 A/B| TU[SuperTune]`

export const SUPERTRACK_MINDMAP = `mindmap
  root((SuperTrack))
    目標層
      帳號
      話題
      品牌
    擷取層
      真人行為模擬
      頻率與深度
      反爬適應
    分析層
      跨平台合併
      時間軸
      異常偵測
    輸出層
      精華入 SuperForge
      熱點送 SuperScript
      指標給 SuperTune`

export const SUPERTRACK_FLOW = `flowchart TB
  P[多平台來源] --> B[行為化爬蟲]
  B --> R[原始內容]
  R --> I[身份合併]
  R --> T[時間軸索引]
  I --> X[分析與 KPI]
  T --> X
  X --> L{異常閾值}
  L -->|觸發| N[通知 Webhook/Email]
  X --> Q[品質篩選]
  Q --> SF[(SuperForge)]
  X --> SC[SuperScript 建議]
  X --> STU[SuperTune 基準]`

export const SUPERTUNE_MINDMAP = `mindmap
  root((SuperTune))
    實驗
      A/B 平行宇宙
      顯著性檢定
    成本
      Prompt 壓縮
      Context 裁剪
      Batch 合併
      Model Tier
    品質
      節奏指數
      張力曲線
      新鮮度 Trope
    風格
      導演特徵遷移
      Voice 保留`

export const SUPERTUNE_FLOW = `flowchart LR
  IN[Forge / Script / Track] --> IM[匯入內容]
  IM --> M{模式}
  M -->|A/B| AB[雙變體推論]
  M -->|成本| CO[四策略優化]
  M -->|品質| QA[節奏張力新鮮度]
  AB --> STAT[effect size / p-value]
  STAT -->|信心足夠| AP[套用勝出版本]
  CO --> SV[節省報表]
  QA --> SG[修改建議]
  AP --> RW[回寫來源模組]
  SV --> RW
  SG --> RW`

/** SuperForge：Webhook 回寫與可選角色歸戶 */
export const SUPERFORGE_WEBHOOK = `flowchart TB
  T[生圖工具] --> W[Webhook 回拋完成]
  W --> M[與當下 prompt+參數+輸出網址 配對]
  M --> C{帶 character_id?}
  C -->|是| R[(角色+版本樹一併掛)]
  C -->|否| V[(一般入庫)]`

/** SuperForge：混合檢索兩路合流 */
export const SUPERFORGE_HYBRID = `flowchart LR
  Q[查詢文字] --> A[語意向量/Embedding]
  Q --> B[全文與模糊]
  A --> M[分數合併排序]
  B --> M
  M --> H[歷史提示詞與生成]`

/** SuperScript：敘事弧位置 */
export const SUPERSCRIPT_NARRATIVE_ARC = `flowchart LR
  H[Hook] --> R[Rising]
  R --> C[Climax]
  C --> S[Resolution]`

/** SuperScript：實體關聯與外溢 SuperForge */
export const SUPERSCRIPT_ENTITY = `flowchart TB
  PR[專案/劇本] --> SC[場景]
  SC --> BE[節拍]
  CH[角色+Voice] --> BE
  BE --> D[台詞/舞台提示]
  D -.->|character_id| SF[SuperForge]
  SC -.->|場面描寫| SF`

/** SuperTrack：跨平台身份合併概念 */
export const SUPERTRACK_IDENTITY = `flowchart LR
  P1[平台A帳] --> M[合併引擎/置信度]
  P2[平台B帳] --> M
  P3[平台C帳] --> M
  M --> U[統一追蹤實體+時間軸]`

/** SuperTrack：擷取狀態簡圖（反爬+重試意涵） */
export const SUPERTRACK_CRAWL = `stateDiagram-v2
  [*] --> Wait
  Wait --> Fetch: interval
  Fetch --> Parse: ok
  Parse --> Wait: store
  Fetch --> Wait: fail_or_throttle`

/** SuperTune：A/B 統計決策 */
export const SUPERTUNE_AB_DECISION = `flowchart TB
  A[變體A] --> T[同條件推論]
  B[變體B] --> T
  T --> S[E 與 R 分數]
  S --> P[p值/信心度]
  P --> D{"高於門檻?"}
  D -->|是| OK[建議採用勝出]
  D -->|否| N1[不建議/加樣本]`

/** SuperTune：四類成本節流匯總 */
export const SUPERTUNE_COST = `flowchart TB
  subgraph s1[四策略]
    K1[Prompt 壓縮]
    K2[Context 裁剪]
    K3[Batch 合併]
    K4[Model Tier]
  end
  K1 --> S[彙總節省]
  K2 --> S
  K3 --> S
  K4 --> S
  S --> R[日報/可回寫]`
