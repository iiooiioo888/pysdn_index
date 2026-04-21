/**
 * One-off merge: 優化模組總覽與各模組 public/i18n/*.json 文案（閱讀導覽、摘要、首屏描述）。
 * Run: node scripts/patch-doc-bundles.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const I18N = path.join(process.cwd(), 'public', 'i18n')

function mergeJson(file, perLang) {
  const p = path.join(I18N, file)
  const j = JSON.parse(fs.readFileSync(p, 'utf8'))
  for (const [lang, patch] of Object.entries(perLang)) {
    if (!j[lang]) j[lang] = {}
    Object.assign(j[lang], patch)
  }
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n')
  console.log('updated', file)
}

/* ── modules 總覽 ── */
mergeJson('modules.json', {
  'zh-TW': {
    title: 'SuperCool 擴展模組總覽｜SuperForge、SuperTune、SuperTrack、SuperScript | Pysdn',
    description:
      'SuperForge 提示詞知識庫、SuperTune 內容優化、SuperTrack 全網訊號追蹤、SuperScript 結構化劇本——四大模組與 SuperCool 生成核心串成可營運的內容管線。',
    mod_hero_desc:
      '四個獨立模組擴充生成核心：知識沉澱、智能優化、全網追蹤、結構化劇本。可單獨使用或互相串接，讓從靈感到上線的每一步都有 AI 協作。',
    mod_sec_main_desc:
      '每個模組可獨立運作，也能依資料流串接：趨勢餵給劇本、場景轉成畫面提示詞、歷史資料校準 A/B、優化結果再回饋追蹤——形成完整創作循環。',
    mod_doc_guide_title: '本頁怎麼讀',
    mod_doc_guide_p:
      '建議順序：① 總覽定位 → ② 影片管線與 SuperCool Core → ③ 四大模組能力 → ④ 模組串接 → ⑤ 左欄「技術文件」深入各模組 API 與環境設定。',
    mod_doc_guide_li1: '總覽與流程：先建立整體地圖，再對照管線圖理解核心與模組邊界。',
    mod_doc_guide_li2: '四大模組：依角色分工（劇本／知識庫／優化／追蹤）閱讀卡片與延伸文件。',
    mod_doc_guide_li3: '技術文件：安裝、環境變數、API、資料結構；各模組獨立頁面維護。',
    mod_doc_guide_li4: '跨模組串接：見「模組串接」了解訊號與資產如何回流。',
  },
  'zh-CN': {
    title: 'SuperCool 扩展模块总览｜SuperForge、SuperTune、SuperTrack、SuperScript | Pysdn',
    description:
      'SuperForge 提示词知识库、SuperTune 内容优化、SuperTrack 全网信号追踪、SuperScript 结构化剧本——四大模块与 SuperCool 生成核心串成可运营的内容管线。',
    mod_hero_desc:
      '四个独立模块扩充生成核心：知识沉淀、智能优化、全网追踪、结构化剧本。可单独使用或互相串接，让从灵感到上线的每一步都有 AI 协作。',
    mod_sec_main_desc:
      '每个模块可独立运作，也能按数据流串接：趋势注入剧本、场景转成画面提示词、历史数据校准 A/B、优化结果再反馈追踪——形成完整创作循环。',
    mod_doc_guide_title: '本页怎么读',
    mod_doc_guide_p:
      '建议顺序：① 总览定位 → ② 影片管线与 SuperCool Core → ③ 四大模块能力 → ④ 模块衔接 → ⑤ 左侧「技术文档」深入各模块 API 与环境配置。',
    mod_doc_guide_li1: '总览与流程：先建立整体地图，再对照管线图理解核心与模块边界。',
    mod_doc_guide_li2: '四大模块：按角色分工（剧本／知识库／优化／追踪）阅读卡片与延伸文档。',
    mod_doc_guide_li3: '技术文档：安装、环境变量、API、数据结构；各模块独立页面维护。',
    mod_doc_guide_li4: '跨模块衔接：见「模块衔接」了解信号与资产如何回流。',
  },
  en: {
    title: 'SuperCool extension modules — SuperForge, SuperTune, SuperTrack, SuperScript | Pysdn',
    description:
      'SuperForge (prompt library), SuperTune (optimization), SuperTrack (signals), SuperScript (structured scripts)—four modules that extend the SuperCool core into an operational content pipeline.',
    mod_hero_desc:
      'Four modules extend the core: knowledge, tuning, tracking, and scripts—use standalone or chained so every step from idea to launch stays AI-assisted.',
    mod_sec_main_desc:
      'Each module runs alone or links in a loop: trends feed scripts, scenes become prompts, history calibrates A/B tests, tuning feeds tracking—one continuous creative cycle.',
    mod_doc_guide_title: 'How to read this page',
    mod_doc_guide_p:
      'Suggested order: ① Overview → ② Video pipeline & SuperCool Core → ③ The four modules → ④ Cross-module handoffs → ⑤ Technical docs in the sidebar (APIs & environment).',
    mod_doc_guide_li1: 'Overview & pipeline: get the map first, then the pipeline diagram.',
    mod_doc_guide_li2: 'Four modules: read cards by role—script, forge, tune, track.',
    mod_doc_guide_li3: 'Technical docs: install, env, API, data models—one page per module.',
    mod_doc_guide_li4: 'Cross-module: see “How modules connect” for signal and asset flow.',
  },
  ja: {
    title: 'SuperCool 拡張モジュール概要｜SuperForge、SuperTune、SuperTrack、SuperScript | Pysdn',
    description:
      'SuperForge（プロンプト知識庫）、SuperTune（最適化）、SuperTrack（シグナル追跡）、SuperScript（構造化脚本）—4モジュールで SuperCool コアを運用可能なパイプラインへ拡張。',
    mod_hero_desc:
      '知識・最適化・追跡・脚本の4モジュール。単独でも連携でも、着想からリリースまで AI が伴走します。',
    mod_sec_main_desc:
      '各モジュールは単独運用も、データの流れで連携も可能。トレンド→脚本→プロンプト→A/B 校正→追跡へフィードバック、創作の循環を形成します。',
    mod_doc_guide_title: 'このページの読み方',
    mod_doc_guide_p:
      '推奨順：① 概要 → ② 動画パイプラインと SuperCool Core → ③ 4モジュール → ④ 連携 → ⑤ サイドバーの技術文書（API・環境）。',
    mod_doc_guide_li1: '概要とフロー：全体像を押さえてからパイプライン図へ。',
    mod_doc_guide_li2: '4モジュール：役割（脚本／知識庫／最適化／追跡）でカードと資料を読む。',
    mod_doc_guide_li3: '技術文書：インストール、環境変数、API、データ構造はモジュールごと。',
    mod_doc_guide_li4: 'モジュール間連携：「連携」でシグナルと資産の流れを確認。',
  },
  ko: {
    title: 'SuperCool 확장 모듈 개요｜SuperForge, SuperTune, SuperTrack, SuperScript | Pysdn',
    description:
      'SuperForge(프롬프트 지식), SuperTune(최적화), SuperTrack(시그널), SuperScript(구조화 각본)—네 모듈이 SuperCool 코어를 운영 가능한 콘텐츠 파이프라인으로 확장합니다.',
    mod_hero_desc:
      '지식·최적화·추적·각본 네 모듈. 단독 또는 연계로 아이디어에서 출시까지 AI가 동행합니다.',
    mod_sec_main_desc:
      '모듈은 단독 운용 또는 데이터 흐름으로 연결: 트렌드→각본→프롬프트→A/B 보정→추적 피드백으로 창작 순환을 완성합니다.',
    mod_doc_guide_title: '이 페이지 읽는 법',
    mod_doc_guide_p:
      '권장 순서: ① 개요 → ② 영상 파이프라인·SuperCool Core → ③ 네 모듈 → ④ 모듈 연동 → ⑤ 사이드바 기술 문서(API·환경).',
    mod_doc_guide_li1: '개요·흐름: 전체 지도를 본 뒤 파이프라인 다이어그램 대조.',
    mod_doc_guide_li2: '네 모듈: 역할(각본/지식/최적화/추적)별로 카드·문서 확인.',
    mod_doc_guide_li3: '기술 문서: 설치, 환경 변수, API, 데이터 구조는 모듈별 페이지.',
    mod_doc_guide_li4: '모듈 연동: 「연동」에서 시그널·자산 흐름 확인.',
  },
})

const SUMMARY_TITLE = {
  'zh-TW': '閱讀摘要',
  'zh-CN': '阅读摘要',
  en: 'Reading summary',
  ja: '読む前に',
  ko: '읽기 요약',
}

function sfSummary(lang) {
  const p = {
    'zh-TW':
      '本頁為 SuperForge 技術說明：提示詞與生成結果如何配對儲存、語意／全文搜尋、Webhook 同步與版本樹，並附安裝條件與 API 總覽。建議先瀏覽「關鍵能力」再依流程操作。',
    'zh-CN':
      '本页为 SuperForge 技术说明：提示词与生成结果如何配对存储、语义/全文搜索、Webhook 同步与版本树，并附安装条件与 API 总览。建议先浏览「关键能力」再按流程操作。',
    en: 'Technical guide to SuperForge: how prompts pair with outputs, semantic/full-text search, webhooks, version trees, plus install prerequisites and API overview—start with capabilities, then follow the flow.',
    ja: 'SuperForge の技術文書：プロンプトと生成結果の紐付け、意味/全文検索、Webhook、バージョン管理、インストール要件と API 概要。「できること」→「流れ」の順がおすすめです。',
    ko: 'SuperForge 기술 문서: 프롬프트·결과 매칭, 의미/전문 검색, Webhook, 버전 트리, 설치 요건 및 API 개요.「기능」→「흐름」 순으로 읽기를 권장합니다.',
  }
  return { doc_summary_title: SUMMARY_TITLE[lang], doc_summary_p: p[lang] }
}

function tuneSummary(lang) {
  const p = {
    'zh-TW':
      '本頁說明 SuperTune 的 A/B、成本、節奏／張力／新鮮度與風格遷移等能力與範例。實際參數與配額以您部署的環境與 API 版本為準。',
    'zh-CN':
      '本页说明 SuperTune 的 A/B、成本、节奏/张力/新鲜度与风格迁移等能力与示例。实际参数与配额以您部署的环境与 API 版本为准。',
    en: 'Covers SuperTune capabilities—A/B, cost, pacing/tension/freshness, style transfer—with examples. Live limits and parameters depend on your deployment and API version.',
    ja: 'SuperTune の機能（A/B、コスト、ペース/テンション/新鮮度、スタイル移植）と例を解説。実際の上限はデプロイと API バージョンに依存します。',
    ko: 'SuperTune 기능(A/B, 비용, 템포/텐션/신선도, 스타일 전환)과 예시. 실제 한도는 배포·API 버전을 따릅니다.',
  }
  return { doc_summary_title: SUMMARY_TITLE[lang], doc_summary_p: p[lang] }
}

function trackSummary(lang) {
  const p = {
    'zh-TW':
      '本頁說明 SuperTrack 的追蹤對象、採集與預警流程、與靈感庫／知識庫的銜接，以及合規與技術背景。僅處理公開可得之資料，請遵守各平台使用條款與 robots 規範。',
    'zh-CN':
      '本页说明 SuperTrack 的追踪对象、采集与预警流程、与灵感库/知识库的衔接，以及合规与技术背景。仅针对公开资料，请遵守各平台规则。',
    en: 'Explains SuperTrack targets, collection & alerts, handoff to your library, compliance, and stack notes—public data only; respect each platform’s terms.',
    ja: 'SuperTrack の追跡対象、取得・アラート、ライブラリ連携、コンプライアンスと技術背景。公開情報のみ、各プラットフォームの規約に従ってください。',
    ko: 'SuperTrack 추적 대상, 수집·알림, 라이브러리 연동, 컴플라이언스·스택. 공개 데이터만, 플랫폼 약관 준수.',
  }
  return { doc_summary_title: SUMMARY_TITLE[lang], doc_summary_p: p[lang] }
}

function scriptSummary(lang) {
  const p = {
    'zh-TW':
      '本頁說明 SuperScript 的多 Agent 協作、場景／節拍／角色與版本資料模型，以及常用 API 與跨模組串接。建議先讀「簡介」與「助手分工」再進入環境設定。',
    'zh-CN':
      '本页说明 SuperScript 的多 Agent 协作、场景/节拍/角色与版本数据模型，以及常用 API 与跨模块衔接。建议先读「简介」与「助手分工」再进入环境配置。',
    en: 'Describes SuperScript multi-agent roles, scene/beat/character/version models, APIs, and cross-module links—read Intro & agent split before env setup.',
    ja: 'SuperScript のマルチエージェント、シーン/ビート/キャラ/バージョンのデータモデル、API、モジュール連携。「概要」と役割分担を先に。',
    ko: 'SuperScript 멀티 에이전트, 장면/비트/캐릭터/버전 모델, API, 모듈 연동.「소개」·역할 분담을 먼저.',
  }
  return { doc_summary_title: SUMMARY_TITLE[lang], doc_summary_p: p[lang] }
}

const LANGS = ['zh-TW', 'zh-CN', 'en', 'ja', 'ko']

function patchModuleDoc(file, summaryFn) {
  const perLang = {}
  for (const lang of LANGS) {
    perLang[lang] = summaryFn(lang)
  }
  mergeJson(file, perLang)
}

patchModuleDoc('superforge.json', sfSummary)
patchModuleDoc('supertune.json', tuneSummary)
patchModuleDoc('supertrack.json', trackSummary)
patchModuleDoc('superscript.json', scriptSummary)

/* SuperForge：首屏 meta 微調 */
mergeJson('superforge.json', {
  'zh-TW': {
    title: 'SuperForge — 提示詞與生成結果知識庫｜Pysdn SuperCool',
    description:
      'SuperForge：提示詞、參數與生成結果自動配對；語意搜尋、版本比對、Webhook 同步與輕量儲存。',
    hero_sub: '提示詞 → 作品，結構化記住、智慧找回',
    intro_p:
      '把你用過的提示詞與生成結果成對整理；支援語意搜尋、版本樹與自動標籤。外部工具生成完成後可經 Webhook 回寫，不必手動抄寫。',
  },
  en: {
    title: 'SuperForge — Prompt & generation knowledge base | Pysdn SuperCool',
    description:
      'SuperForge pairs prompts with outputs: semantic search, version diff, webhooks, and lightweight storage.',
    hero_sub: 'Prompt → artifact, structured memory & smart recall',
    intro_p:
      'Every prompt and result stays paired—semantic search, version trees, auto tags. Webhooks from external tools update the library without copy-paste.',
  },
  'zh-CN': {
    title: 'SuperForge — 提示词与生成结果知识库｜Pysdn SuperCool',
    description: 'SuperForge：提示词、参数与生成结果自动配对；语义搜索、版本对比、Webhook 同步与轻量存储。',
    hero_sub: '提示词 → 作品，结构化记住、智能找回',
    intro_p:
      '把你用过的提示词与生成结果成对整理；支持语义搜索、版本树与自动标签。外部工具生成完成后可经 Webhook 回写，不必手动抄写。',
  },
  ja: {
    title: 'SuperForge — プロンプト・生成ナレッジベース | Pysdn SuperCool',
    description:
      'SuperForge：プロンプトと生成結果をペアで保存。意味検索、バージョン比較、Webhook 同期、軽量ストレージ。',
    hero_sub: 'プロンプト → 成果物、構造化して賢く検索',
    intro_p:
      'プロンプトと結果をペアで整理。意味検索、バージョン、自動タグ。外部ツールは Webhook で自動更新。',
  },
  ko: {
    title: 'SuperForge — 프롬프트·생성 결과 지식 베이스 | Pysdn SuperCool',
    description:
      'SuperForge: 프롬프트와 결과를 쌍으로 저장. 의미 검색, 버전 비교, Webhook, 경량 저장.',
    hero_sub: '프롬프트 → 결과물, 구조화·스마트 검색',
    intro_p:
      '프롬프트와 생성 결과를 쌍으로 정리. 의미 검색, 버전 트리, 자동 태그. 외부 도구는 Webhook으로 갱신.',
  },
})

/* SuperTune：修正「更聪明」→「更聰明」並微調 intro */
mergeJson('supertune.json', {
  'zh-TW': {
    cost_p: 'SuperTune 自動幫你省 token，不是砍品質，是更聰明地用。',
    intro_p:
      'SuperTune 是內容優化引擎：劇本、生圖或行銷文案都能做 A/B、成本與品質分析，協助你用數據做取捨（實際節省幅度依模型與用量而異）。',
  },
  'zh-CN': {
    intro_p:
      'SuperTune 是内容优化引擎：剧本、生图或营销文案都能做 A/B、成本与质量分析，协助你用数据做取舍（实际节省幅度因模型与用量而异）。',
  },
})

console.log('done.')
