/**
 * One-off generator for src/locales/doc/modules.json（模組總覽）；會由 predev/postbuild 同步至 public/i18n。
 * Run: node scripts/gen-modules-i18n.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const out = path.join(__dirname, '../src/locales/doc/modules.json')

const zhTW = {
  title: 'SuperCool 擴展模組 — SuperForge、SuperTune、SuperTrack、SuperScript | Pysdn',
  description:
    'SuperForge 知識庫、SuperTune 參數優化、SuperTrack 全網追蹤、SuperScript 劇本引擎：四大模組擴充 SuperCool 生成與營運能力。',
  mod_nav_home: '首頁',
  mod_nav_modules: '擴展模組',
  mod_hero_badge: 'EXTENSION MODULES',
  mod_hero_title_line: 'SuperCool',
  mod_hero_title_grad: '擴展模組',
  mod_hero_desc:
    '四個獨立模組擴充生成核心的能力——知識沉澱、智能優化、全網追蹤、結構化劇本，讓創作流程從頭到尾都有 AI 加持。',
  mod_pipe_label: 'MODULE PIPELINE',
  mod_pipe_n1: '🛰️ SuperTrack 訊號',
  mod_pipe_n2: '🎬 SuperScript 腳本',
  mod_pipe_n3: '🗂️ SuperForge 知識',
  mod_pipe_n4: '🧠 SuperTune 優化',
  mod_sec_main_label: 'CORE MODULES',
  mod_sec_main_title: '四大模組，各司其職',
  mod_sec_main_desc:
    '每個模組獨立運作，也能互相串接。追蹤到的趨勢注入腳本，腳本的場景變成畫面，畫面的參數反覆優化——形成一個完整的創作循環。',
  mod_forge_badge: 'KNOWLEDGE BASE',
  mod_forge_desc:
    '你的提示詞與結果知識庫。每次生圖的 prompt、參數、seed、模型版本自動配對儲存，語意搜尋讓你用「人話」找回任何創作記錄。',
  mod_forge_f1: 'Prompt 與結果自動配對（Webhook 即時同步）',
  mod_forge_f2: '語意向量搜尋——說描述就找得到',
  mod_forge_f3: '版本樹對比——五個版本一眼看出差異',
  mod_forge_f4: 'AI 自動標籤分類（風格 / 主題 / 光線）',
  mod_forge_tag1: 'pgvector',
  mod_forge_tag2: 'Prompt',
  mod_forge_tag3: 'Full-text',
  mod_tune_badge: 'OPTIMIZATION',
  mod_tune_desc:
    '內容優化引擎。A/B 平行宇宙測試、成本自動壓縮、節奏與張力量化分析，讓你用數據說話、用數字做創作決策。',
  mod_tune_f1: 'A/B 平行宇宙測試（最多 8 個變體）',
  mod_tune_f2: '四種成本優化策略（省 20-30% Token）',
  mod_tune_f3: '節奏指數 × 張力曲線 × 新鮮度評分',
  mod_tune_f4: '神經風格遷移——諾蘭、王家衛、是枝裕和',
  mod_tune_tag1: 'A/B',
  mod_tune_tag2: 'Batch',
  mod_tune_tag3: 'Cost',
  mod_track_badge: 'SIGNAL TRACKING',
  mod_track_desc:
    '全網訊號追蹤。同時監測多個社群平台的帳號、話題與關鍵字，異常警報讓你第一時間掌握趨勢、搶佔話題窗口。',
  mod_track_f1: '跨平台身份合併（自動比對多平台帳號）',
  mod_track_f2: '模擬真人行為爬蟲（成功率 98.2%）',
  mod_track_f3: '異常警報（流量暴增 / 話題升溫即時通知）',
  mod_track_f4: '高品質內容自動萃取 → 回流 SuperForge',
  mod_track_tag1: 'Crawl',
  mod_track_tag2: 'Time-series',
  mod_track_tag3: 'AlertEngine',
  mod_script_badge: 'SCRIPT ENGINE',
  mod_script_desc:
    'AI 劇本引擎。四個專業 Agent 分工協作——架構師畫骨架、一致性守護者查邏輯、寫手填對白、排版師收尾，從概念到成品劇本一氣呵成。',
  mod_script_f1: '結構化敘事引擎（Hook → Rising → Climax → Resolution）',
  mod_script_f2: '四 Agent 流水線（Architect → Continuity → Writer → Format）',
  mod_script_f3: '角色語音匹配（Voice Profile 96%+ 一致性）',
  mod_script_f4: 'Git-like 版本控制 + 一致性監控',
  mod_script_tag1: 'Multi-Agent',
  mod_script_tag2: 'Branching',
  mod_script_tag3: 'Consistency',
  mod_link_doc: '完整說明 →',
  mod_cross_label: 'CROSS-MODULE',
  mod_cross_title: '模組之間如何串接？',
  mod_cross_desc: '四個模組不是孤島。它們之間有明確的資料流和觸發關係，形成一個完整的創作循環。',
  mod_x1_title: '📡 SuperTrack → SuperScript',
  mod_x1_desc:
    'SuperTrack 追蹤到的社群熱點（短劇爆發期、賽博龐克 AI 升溫等），自動推送給 SuperScript 作為劇本元素建議。一鍵「注入腳本」，讓內容永遠走在趨勢前面。',
  mod_x2_title: '🎬 SuperScript → SuperForge',
  mod_x2_desc:
    '劇本中的場景描述（如「雨夜的東京街頭，霓虹燈映在積水上」），自動轉換成 Midjourney / SD 可用的畫面提示詞，存入 SuperForge 知識庫。',
  mod_x3_title: '🗂️ SuperForge → SuperTune',
  mod_x3_desc:
    'SuperForge 累積的歷史生成數據（哪種 prompt 互動率高、哪種參數效果好），為 SuperTune 的 A/B 測試提供校準基準，讓優化建議更精準。',
  mod_x4_title: '🧠 SuperTune → SuperTrack',
  mod_x4_desc:
    'SuperTune 的優化結論（哪種標題點擊率高、哪種風格互動好）反饋給 SuperTrack，幫助它更精準地篩選追蹤目標和判斷內容品質。',
  footer_copy: '© Pysdn SuperCool ·',
  footer_link: '返回主站',
}

const en = {
  title: 'SuperCool Extension Modules — Forge, Tune, Track, Script | Pysdn',
  description:
    'SuperForge knowledge base, SuperTune optimization, SuperTrack web signals, SuperScript script engine—four modules that extend SuperCool.',
  mod_nav_home: 'Home',
  mod_nav_modules: 'Modules',
  mod_hero_badge: 'EXTENSION MODULES',
  mod_hero_title_line: 'SuperCool',
  mod_hero_title_grad: 'Extension modules',
  mod_hero_desc:
    'Four independent modules that extend the creation core—knowledge, optimization, tracking, and structured scripts—so your workflow stays AI-assisted end to end.',
  mod_pipe_label: 'MODULE PIPELINE',
  mod_pipe_n1: '🛰️ SuperTrack signals',
  mod_pipe_n2: '🎬 SuperScript drafts',
  mod_pipe_n3: '🗂️ SuperForge knowledge',
  mod_pipe_n4: '🧠 SuperTune tuning',
  mod_sec_main_label: 'CORE MODULES',
  mod_sec_main_title: 'Four modules, four roles',
  mod_sec_main_desc:
    'Each module runs standalone or chains with the others—trends feed scripts, scenes become images, parameters iterate—forming a full creative loop.',
  mod_forge_badge: 'KNOWLEDGE BASE',
  mod_forge_desc:
    'Your prompt and result library. Every prompt, seed, parameters, and model version is paired and stored; semantic search lets you find any record in plain language.',
  mod_forge_f1: 'Prompt–result pairing (webhook sync)',
  mod_forge_f2: 'Vector search—describe it, find it',
  mod_forge_f3: 'Version tree diff—compare five variants at a glance',
  mod_forge_f4: 'AI tagging (style / subject / lighting)',
  mod_forge_tag1: 'pgvector',
  mod_forge_tag2: 'Prompt',
  mod_forge_tag3: 'Full-text',
  mod_tune_badge: 'OPTIMIZATION',
  mod_tune_desc:
    'Optimization engine. A/B parallel universes, cost compression, pacing and tension analytics—decide with data.',
  mod_tune_f1: 'A/B parallel tests (up to 8 variants)',
  mod_tune_f2: 'Four cost strategies (save ~20–30% tokens)',
  mod_tune_f3: 'Pacing index × tension curve × freshness',
  mod_tune_f4: 'Neural style transfer—Nolan, Wong Kar-wai, Kore-eda',
  mod_tune_tag1: 'A/B',
  mod_tune_tag2: 'Batch',
  mod_tune_tag3: 'Cost',
  mod_track_badge: 'SIGNAL TRACKING',
  mod_track_desc:
    'Cross-platform tracking. Monitor accounts, topics, and keywords; alerts surface trends before the window closes.',
  mod_track_f1: 'Cross-platform identity merge',
  mod_track_f2: 'Human-like crawling (~98.2% success)',
  mod_track_f3: 'Spike alerts (traffic / topic heat)',
  mod_track_f4: 'High-quality content extraction → SuperForge',
  mod_track_tag1: 'Crawl',
  mod_track_tag2: 'Time-series',
  mod_track_tag3: 'AlertEngine',
  mod_script_badge: 'SCRIPT ENGINE',
  mod_script_desc:
    'AI script engine. Four agents—architect, continuity, writer, format—from concept to finished script.',
  mod_script_f1: 'Structured arc (Hook → Rising → Climax → Resolution)',
  mod_script_f2: 'Four-agent pipeline (Architect → Continuity → Writer → Format)',
  mod_script_f3: 'Voice profiles (96%+ consistency)',
  mod_script_f4: 'Git-like versioning + continuity checks',
  mod_script_tag1: 'Multi-Agent',
  mod_script_tag2: 'Branching',
  mod_script_tag3: 'Consistency',
  mod_link_doc: 'Full documentation →',
  mod_cross_label: 'CROSS-MODULE',
  mod_cross_title: 'How modules connect',
  mod_cross_desc:
    'They are not islands—data flows and triggers form a closed creative loop.',
  mod_x1_title: '📡 SuperTrack → SuperScript',
  mod_x1_desc:
    'Trend signals (short-drama spikes, cyberpunk AI heat, etc.) feed SuperScript as story element suggestions—inject into drafts in one click.',
  mod_x2_title: '🎬 SuperScript → SuperForge',
  mod_x2_desc:
    'Scene prose becomes Midjourney / SD-ready prompts stored in SuperForge.',
  mod_x3_title: '🗂️ SuperForge → SuperTune',
  mod_x3_desc:
    'Historical generations calibrate SuperTune A/B baselines for sharper recommendations.',
  mod_x4_title: '🧠 SuperTune → SuperTrack',
  mod_x4_desc:
    'Optimization insights (titles, styles) refine what SuperTrack monitors and how it judges quality.',
  footer_copy: '© Pysdn SuperCool ·',
  footer_link: 'Back to site',
}

/** 简体中文：不以繁体为基底展开，避免混入繁体字段 */
const zhCN = {
  title: 'SuperCool 扩展模块 — SuperForge、SuperTune、SuperTrack、SuperScript | Pysdn',
  description:
    'SuperForge 知识库、SuperTune 参数优化、SuperTrack 全网追踪、SuperScript 剧本引擎：四大模块扩充 SuperCool 生成与运营能力。',
  mod_nav_home: '首页',
  mod_nav_modules: '扩展模块',
  mod_hero_badge: '扩展模块',
  mod_hero_title_line: 'SuperCool',
  mod_hero_title_grad: '扩展模块',
  mod_hero_desc:
    '四个独立模块扩充生成核心的能力——知识沉淀、智能优化、全网追踪、结构化剧本，让创作流程从头到尾都有 AI 加持。',
  mod_pipe_label: '模块流水线',
  mod_pipe_n1: '🛰️ SuperTrack 信号',
  mod_pipe_n2: '🎬 SuperScript 剧本',
  mod_pipe_n3: '🗂️ SuperForge 知识',
  mod_pipe_n4: '🧠 SuperTune 优化',
  mod_sec_main_label: '核心模块',
  mod_sec_main_title: '四大模块，各司其职',
  mod_sec_main_desc:
    '每个模块独立运作，也能互相串接。追踪到的趋势注入脚本，脚本的场景变成画面，画面的参数反复优化——形成一个完整的创作循环。',
  mod_forge_badge: '知识库',
  mod_forge_desc:
    '你的提示词与结果知识库。每次生图的 prompt、参数、seed、模型版本自动配对存储，语义搜索让你用「人话」找回任何创作记录。',
  mod_forge_f1: 'Prompt 与结果自动配对（Webhook 即时同步）',
  mod_forge_f2: '语义向量搜索——说描述就找得到',
  mod_forge_f3: '版本树对比——五个版本一眼看出差异',
  mod_forge_f4: 'AI 自动标签分类（风格 / 主题 / 光线）',
  mod_forge_tag1: 'pgvector',
  mod_forge_tag2: 'Prompt',
  mod_forge_tag3: '全文',
  mod_tune_badge: '优化',
  mod_tune_desc:
    '内容优化引擎。A/B 平行宇宙测试、成本自动压缩、节奏与张力量化分析，让你用数据说话、用数字做创作决策。',
  mod_tune_f1: 'A/B 平行宇宙测试（最多 8 个变体）',
  mod_tune_f2: '四种成本优化策略（省 20-30% Token）',
  mod_tune_f3: '节奏指数 × 张力曲线 × 新鲜度评分',
  mod_tune_f4: '神经风格迁移——诺兰、王家卫、是枝裕和',
  mod_tune_tag1: 'A/B',
  mod_tune_tag2: '批量',
  mod_tune_tag3: '成本',
  mod_track_badge: '信号追踪',
  mod_track_desc:
    '全网信号追踪。同时监测多个社交平台的账号、话题与关键字，异常警报让你第一时间掌握趋势、抢占话题窗口。',
  mod_track_f1: '跨平台身份合并（自动比对多平台账号）',
  mod_track_f2: '模拟真人行为爬虫（成功率 98.2%）',
  mod_track_f3: '异常警报（流量暴增 / 话题升温即时通知）',
  mod_track_f4: '高质量内容自动萃取 → 回流 SuperForge',
  mod_track_tag1: '爬取',
  mod_track_tag2: '时序',
  mod_track_tag3: '预警引擎',
  mod_script_badge: '剧本引擎',
  mod_script_desc:
    'AI 剧本引擎。四个专业 Agent 分工协作——架构师画骨架、一致性守护者查逻辑、写手填对白、排版师收尾，从概念到成品剧本一气呵成。',
  mod_script_f1: '结构化叙事引擎（Hook → Rising → Climax → Resolution）',
  mod_script_f2: '四智能体流水线（Architect → Continuity → Writer → Format）',
  mod_script_f3: '角色声线匹配（Voice Profile 96%+ 一致性）',
  mod_script_f4: 'Git-like 版本控制 + 一致性监控',
  mod_script_tag1: '多智能体',
  mod_script_tag2: '分支',
  mod_script_tag3: '一致性',
  mod_link_doc: '完整说明 →',
  mod_cross_label: '跨模块联动',
  mod_cross_title: '模块之间如何串接？',
  mod_cross_desc: '四个模块不是孤岛。它们之间有明确的数据流和触发关系，形成一个完整的创作循环。',
  mod_x1_title: '📡 SuperTrack → SuperScript',
  mod_x1_desc:
    'SuperTrack 追踪到的社群热点（短剧爆发期、赛博朋克 AI 升温等），自动推送给 SuperScript 作为剧本元素建议。一键「注入脚本」，让内容永远走在趋势前面。',
  mod_x2_title: '🎬 SuperScript → SuperForge',
  mod_x2_desc:
    '剧本中的场景描述（如「雨夜的东京街头，霓虹灯映在积水上」），自动转换成 Midjourney / SD 可用的画面提示词，存入 SuperForge 知识库。',
  mod_x3_title: '🗂️ SuperForge → SuperTune',
  mod_x3_desc:
    'SuperForge 累积的历史生成数据（哪种 prompt 互动率高、哪种参数效果好），为 SuperTune 的 A/B 测试提供校准基准，让优化建议更精准。',
  mod_x4_title: '🧠 SuperTune → SuperTrack',
  mod_x4_desc:
    'SuperTune 的优化结论（哪种标题点击率高、哪种风格互动好）反馈给 SuperTrack，帮助它更精准地筛选追踪目标和判断内容品质。',
  footer_copy: '© Pysdn SuperCool ·',
  footer_link: '返回主站',
}

const ja = {
  ...en,
  title: 'SuperCool 拡張モジュール — Forge、Tune、Track、Script | Pysdn',
  description:
    'SuperForge、SuperTune、SuperTrack、SuperScript の4モジュールで SuperCool の生成と運用を拡張します。',
  mod_nav_home: 'ホーム',
  mod_nav_modules: '拡張モジュール',
  mod_hero_badge: '拡張モジュール',
  mod_hero_title_grad: '拡張モジュール',
  mod_hero_desc:
    'ナレッジの蓄積、最適化、トラッキング、構造化された脚本——制作フロー全体を AI で支援する4つの独立モジュール。',
  mod_pipe_label: 'モジュール・パイプライン',
  mod_pipe_n1: '🛰️ SuperTrack シグナル',
  mod_pipe_n2: '🎬 SuperScript 脚本',
  mod_pipe_n3: '🗂️ SuperForge ナレッジ',
  mod_pipe_n4: '🧠 SuperTune 最適化',
  mod_sec_main_label: 'コアモジュール',
  mod_sec_main_title: '四つのモジュール、それぞれの役割',
  mod_sec_main_desc:
    '単体でも連携でも。トレンドが脚本に、シーンが画像に、パラメータが磨かれていく——制作のループが完成します。',
  mod_forge_badge: 'ナレッジベース',
  mod_forge_desc:
    'プロンプトと生成結果のナレッジベース。プロンプト・パラメータ・seed・モデル版を自動でペアリング保存し、意味検索で記録を探せます。',
  mod_forge_f1: 'プロンプトと結果の自動ペアリング（Webhook 同期）',
  mod_forge_f2: 'ベクトル検索——説明すれば見つかる',
  mod_forge_f3: 'バージョン木の比較——5案を一目で比較',
  mod_forge_f4: 'AI 自動タグ（スタイル / 題材 / ライティング）',
  mod_forge_tag1: 'pgvector',
  mod_forge_tag2: 'Prompt',
  mod_forge_tag3: '全文検索',
  mod_tune_badge: '最適化',
  mod_tune_desc:
    'コンテンツ最適化エンジン。A/B 並行テスト、コスト圧縮、テンポと緊張の定量分析——データで意思決定。',
  mod_tune_f1: 'A/B 並行テスト（最大8バリエーション）',
  mod_tune_f2: '4種のコスト戦略（トークン約20〜30%削減）',
  mod_tune_f3: 'テンポ指数 × 緊張カーブ × 新鮮度スコア',
  mod_tune_f4: 'ニューラル・スタイル転移——ノーラン、ウォン・カーウァイ、是枝裕和',
  mod_tune_tag1: 'A/B',
  mod_tune_tag2: 'バッチ',
  mod_tune_tag3: 'コスト',
  mod_track_badge: 'シグナル追跡',
  mod_track_desc:
    'クロスプラットフォームでアカウント・話題・キーワードを監視。異常検知でトレンドを逃さない。',
  mod_track_f1: 'クロスプラットフォームID統合（多アカウント自動照合）',
  mod_track_f2: '人間らしいクロール（成功率約98.2%）',
  mod_track_f3: 'スパイクアラート（トラフィック / 話題の熱量）',
  mod_track_f4: '高品質コンテンツ抽出 → SuperForge へ',
  mod_track_tag1: 'クロール',
  mod_track_tag2: '時系列',
  mod_track_tag3: 'アラート',
  mod_script_badge: '脚本エンジン',
  mod_script_desc:
    'AI 脚本エンジン。4つのエージェントが分担——構成、一貫性、台本、整形——コンセプトから完成脚本まで。',
  mod_script_f1: '構造化ストーリー（Hook → Rising → Climax → Resolution）',
  mod_script_f2: '4エージェント・パイプライン（Architect → Continuity → Writer → Format）',
  mod_script_f3: 'ボイスプロファイル（一貫性96%以上）',
  mod_script_f4: 'Git風バージョン管理 + 一貫性チェック',
  mod_script_tag1: 'マルチエージェント',
  mod_script_tag2: 'ブランチ',
  mod_script_tag3: '一貫性',
  mod_link_doc: 'ドキュメント全文 →',
  mod_cross_label: 'クロスモジュール',
  mod_cross_title: 'モジュールはどう繋がる？',
  mod_cross_desc:
    '島ではありません。データフローとトリガーで、ひとつの制作ループを形成します。',
  mod_x1_desc:
    'トレンド信号が SuperScript に送られ、脚本要素の提案に。ワンクリックで注入。',
  mod_x2_desc: 'シーン記述が画像プロンプトになり SuperForge に保存。',
  mod_x3_desc: '生成履歴が SuperTune の A/B 基準を較正。',
  mod_x4_desc: '最適化の知見が SuperTrack の監視対象と品質判断を洗練。',
  footer_link: 'サイトへ戻る',
}

const ko = {
  ...en,
  title: 'SuperCool 확장 모듈 — Forge, Tune, Track, Script | Pysdn',
  description:
    'SuperForge, SuperTune, SuperTrack, SuperScript 네 모듈로 SuperCool 생성·운영을 확장합니다.',
  mod_nav_home: '홈',
  mod_nav_modules: '확장 모듈',
  mod_hero_badge: '확장 모듈',
  mod_hero_title_grad: '확장 모듈',
  mod_hero_desc:
    '지식 축적, 최적화, 추적, 구조화된 각본까지—창작 전 과정을 AI로 보강하는 네 모듈.',
  mod_pipe_label: '모듈 파이프라인',
  mod_pipe_n1: '🛰️ SuperTrack 신호',
  mod_pipe_n2: '🎬 SuperScript 각본',
  mod_pipe_n3: '🗂️ SuperForge 지식',
  mod_pipe_n4: '🧠 SuperTune 최적화',
  mod_sec_main_label: '핵심 모듈',
  mod_sec_main_title: '네 모듈, 각자의 역할',
  mod_sec_main_desc:
    '독립 실행도, 연결도 가능합니다. 트렌드가 각본으로, 장면이 이미지로, 파라미터가 다듬어지며 창작 루프가 완성됩니다.',
  mod_forge_badge: '지식 베이스',
  mod_forge_desc:
    '프롬프트와 결과 지식 베이스. 프롬프트·파라미터·시드·모델 버전을 자동 짝지어 저장하고 의미 검색으로 찾습니다.',
  mod_forge_f1: '프롬프트–결과 자동 짝맞춤(웹훅 동기화)',
  mod_forge_f2: '벡터 검색—설명만으로 검색',
  mod_forge_f3: '버전 트리 비교—다섯 변형을 한눈에',
  mod_forge_f4: 'AI 자동 태깅(스타일 / 주제 / 조명)',
  mod_forge_tag1: 'pgvector',
  mod_forge_tag2: 'Prompt',
  mod_forge_tag3: '전체 텍스트',
  mod_tune_badge: '최적화',
  mod_tune_desc:
    '콘텐츠 최적화 엔진. A/B 병렬 테스트, 비용 압축, 템포·긴장 분석—데이터로 결정합니다.',
  mod_tune_f1: 'A/B 병렬 테스트(최대 8변형)',
  mod_tune_f2: '네 가지 비용 전략(토큰 약 20~30% 절감)',
  mod_tune_f3: '템포 지수 × 긴장 곡선 × 신선도 점수',
  mod_tune_f4: '신경망 스타일 전이—놀란, 왕가위, 고레에다 히로카즈',
  mod_tune_tag1: 'A/B',
  mod_tune_tag2: '배치',
  mod_tune_tag3: '비용',
  mod_track_badge: '시그널 추적',
  mod_track_desc:
    '여러 플랫폼 계정·토픽·키워드를 모니터링하고 이상 징후로 트렌드를 포착합니다.',
  mod_track_f1: '크로스플랫폼 정체 병합',
  mod_track_f2: '인간 유사 크롤링(성공률 ~98.2%)',
  mod_track_f3: '스파이크 알림(트래픽 / 화제성)',
  mod_track_f4: '고품질 콘텐츠 추출 → SuperForge',
  mod_track_tag1: '크롤',
  mod_track_tag2: '시계열',
  mod_track_tag3: '알림',
  mod_script_badge: '각본 엔진',
  mod_script_desc:
    'AI 각본 엔진. 네 에이전트가 역할 분담—구조, 일관성, 대사, 포맷—기획부터 완성까지.',
  mod_script_f1: '구조적 서사(Hook → Rising → Climax → Resolution)',
  mod_script_f2: '4 에이전트 파이프라인(Architect → Continuity → Writer → Format)',
  mod_script_f3: '보이스 프로필(일관성 96%+)',
  mod_script_f4: 'Git 스타일 버전 관리 + 일관성 검사',
  mod_script_tag1: '멀티 에이전트',
  mod_script_tag2: '브랜치',
  mod_script_tag3: '일관성',
  mod_link_doc: '전체 문서 →',
  mod_cross_label: '크로스 모듈',
  mod_cross_title: '모듈은 어떻게 연결되나요?',
  mod_cross_desc:
    '섬이 아니라 데이터 흐름과 트리거로 창작 루프를 만듭니다.',
  mod_x1_desc: '트렌드 신호가 SuperScript에 전달되어 각본 요소 제안으로 이어집니다.',
  mod_x2_desc: '장면 묘사가 이미지 프롬프트로 변환되어 SuperForge에 저장됩니다.',
  mod_x3_desc: '생성 기록이 SuperTune A/B 기준선을 보정합니다.',
  mod_x4_desc: '최적화 인사이트가 SuperTrack의 모니터링과 품질 판단을 정교하게 합니다.',
  footer_link: '사이트로 돌아가기',
}

const bundle = {
  'zh-TW': zhTW,
  'zh-CN': zhCN,
  en,
  ja,
  ko,
}

fs.writeFileSync(out, JSON.stringify(bundle, null, 2), 'utf8')
console.log('Wrote', out)
