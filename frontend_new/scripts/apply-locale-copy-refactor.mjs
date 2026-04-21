/**
 * One-off merge: refactor homepage / nav / module narrative copy across locales.
 * Run: node scripts/apply-locale-copy-refactor.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const localesDir = path.join(__dirname, '..', 'src', 'locales')

const patches = {
  'zh-TW': {
    nav_home: '首頁',
    nav_about: '為什麼是我們',
    nav_products: '產品與能力',
    nav_showcase: '案例與示範',
    nav_contact: '聯絡與合作',
    nav_models: '模型選型',
    nav_module_docs: '模組與文件',
    nav_cta: '預約諮詢',
    hero_intro_label: '✨ SuperCool 1.0｜生成核心 × 擴展模組',
    hero_intro_headline: '從一個念頭，接到可上線的一整條內容管線',
    hero_intro_desc:
      '影片、短劇、圖像在 SuperCool 先成形；要把提示詞變可搜尋資產、把訊號變營運線索、把故事變結構化劇本，就交給獨立模組接力——靈感不再停在畫布裡。',
    hero_intro_cta: '先看我們做什麼',
    hero_desc:
      '排期與工具選項，不該掐住想像。SuperCool 把腳本、分鏡、畫面與成片收斂在同一條工作流；需要知識庫、訊號追蹤或多代理劇本時，再依序銜接下方模組與文件。',
    hero_cta1: '進入產品能力',
    hero_cta2: '看案例示範',
    hero_module_entry: '接著走：擴展模組與開發者文件',
    hero_link_modules_overview: '模組地圖（總覽）',
    products_label: '產品與模組',
    products_title: 'SuperCool 1.0：先生成、再擴充——一條走完的內容閉環',
    products_desc:
      '影片、短劇、圖像是 SuperCool 的生成核心。當你要沉澱提示詞與結果、優化參數與成本、追蹤全網訊號或編排多代理劇本，SuperForge、SuperTune、SuperTrack、SuperScript 可各自獨立接上，不必綁死在單一畫布。',
    modules_split_title: '擴展模組怎麼接？',
    modules_split_desc:
      'Forge 管知識與版本，Tune 管參數與批次，Track 管實體與時序，Script 管結構化劇本——依任務掛載；介面與 API 說明集中在模組中心。',
    about_label: '我們相信什麼',
    about_title: '創作應該是「一路延伸」，不是「卡在某個工具」就結束。',
    about_desc:
      '多數團隊卡在工具切換與移交成本。Pysdn 把生成與模組拆清楚：畫布上先動起來，知識、訊號與劇本在另一層累積成資產。你的靈感因此能分裂成版本、路徑與作品，而不是停在腦中。',
    contact_label: '下一步',
    contact_title: '要把靈感推到「可交付」了嗎？',
    contact_desc:
      '獨立創作者、新創或企業品牌都好——告訴我們你的場景與節點，我們一起把工作流、模組掛載與落地節奏對齊。',
    footer_tagline: '先生成，再沉澱；先上線，再迭代。SuperCool 與擴展模組，讓一句話走得更遠。',
  },
  'zh-CN': {
    nav_home: '首页',
    nav_about: '为什么选择我们',
    nav_products: '产品与能力',
    nav_showcase: '案例与演示',
    nav_contact: '联络与合作',
    nav_models: '模型选型',
    nav_module_docs: '模块与文档',
    nav_cta: '预约咨询',
    hero_intro_label: '✨ SuperCool 1.0｜生成核心 × 扩展模块',
    hero_intro_headline: '从一个念头，接到可上线的一整条内容管线',
    hero_intro_desc:
      '影片、短剧、图像在 SuperCool 先成形；要把提示词变成可检索资产、把信号变成运营线索、把故事变成结构化剧本，就交给独立模块接力——灵感不再停在画布上。',
    hero_intro_cta: '先看我们做什么',
    hero_desc:
      '排期与工具选项不该掐住想象。SuperCool 把脚本、分镜、画面与成片收敛在同一条工作流；需要知识库、信号追踪或多代理剧本时，再依次衔接下方模块与文档。',
    hero_cta1: '进入产品能力',
    hero_cta2: '看案例演示',
    hero_module_entry: '接着走：扩展模块与开发者文档',
    hero_link_modules_overview: '模块地图（总览）',
    products_label: '产品与模块',
    products_title: 'SuperCool 1.0：先生成、再扩充——一条走完的内容闭环',
    products_desc:
      '影片、短剧、图像是 SuperCool 的生成核心。当你要沉淀提示词与结果、优化参数与成本、追踪全网信号或编排多代理剧本，SuperForge、SuperTune、SuperTrack、SuperScript 可各自独立接入，不必绑死在单一画布。',
    modules_split_title: '扩展模块怎么接？',
    modules_split_desc:
      'Forge 管知识与版本，Tune 管参数与批次，Track 管实体与时序，Script 管结构化剧本——按任务挂载；界面与 API 说明集中在模块中心。',
    about_label: '我们相信什么',
    about_title: '创作应该「一路延伸」，而不是「卡在某个工具」就结束。',
    about_desc:
      '多数团队卡在工具切换与移交成本。Pysdn 把生成与模块拆开：画布上先动起来，知识、信号与剧本在另一层沉淀成资产。灵感因此能分裂成版本、路径与作品，而不是停在脑中。',
    contact_label: '下一步',
    contact_title: '要把灵感推到「可交付」了吗？',
    contact_desc:
      '独立创作者、初创或企业品牌都可以——告诉我们你的场景与节点，我们一起对齐工作流、模块挂载与落地节奏。',
    footer_tagline: '先生成，再沉淀；先上线，再迭代。SuperCool 与扩展模块，让一句话走得更远。',
  },
  en: {
    nav_home: 'Home',
    nav_about: 'Why us',
    nav_products: 'Capabilities',
    nav_showcase: 'Stories',
    nav_contact: 'Contact',
    nav_models: 'Model map',
    nav_module_docs: 'Modules & docs',
    nav_cta: 'Talk to us',
    hero_intro_label: '✨ SuperCool 1.0 — creation core × extension modules',
    hero_intro_headline: 'From one idea to a shippable content pipeline',
    hero_intro_desc:
      'Video, drama, and image take shape in SuperCool first. When prompts must become searchable assets, signals need to feed operations, or stories need structure—extension modules pick up the handoff without locking you to a single canvas.',
    hero_intro_cta: 'See what ships first',
    hero_desc:
      'Schedules and tooling choices shouldn’t choke imagination. SuperCool threads script, boards, frames, and finals in one workflow—then connects knowledge bases, signal tracking, or multi-agent scripts when you are ready.',
    hero_cta1: 'Explore capabilities',
    hero_cta2: 'See live examples',
    hero_module_entry: 'Next: extension modules & technical docs',
    hero_link_modules_overview: 'Module map (overview)',
    products_label: 'Products & modules',
    products_title: 'SuperCool 1.0 — generate first, extend second, close the loop',
    products_desc:
      'Video, drama, and image are the creation core. SuperForge, SuperTune, SuperTrack, and SuperScript attach independently for prompt libraries, tuning, signal tracking, and structured scripts—without trapping you in one canvas.',
    modules_split_title: 'How modules attach',
    modules_split_desc:
      'Forge covers knowledge and versions, Tune covers parameters and batches, Track covers entities and time series, Script covers structured drafts—mount what you need; UIs and API notes live in one module hub.',
    about_label: 'What we believe',
    about_title: 'Creation should extend—not end at a single tool.',
    about_desc:
      'Teams stall on handoffs. Pysdn separates generation from asset layers: motion on the canvas; knowledge, signals, and scripts compounding underneath. Ideas become versions, paths, and deliverables—not meeting notes.',
    contact_label: 'What’s next',
    contact_title: 'Ready to push ideas into something shippable?',
    contact_desc:
      'Creators, startups, or enterprises—share your scenario and checkpoints. We align workflow, module mounting, and rollout rhythm together.',
    footer_tagline: 'Generate first, compound later. SuperCool and extensions take a sentence further.',
  },
  ja: {
    nav_home: 'ホーム',
    nav_about: '選ぶ理由',
    nav_products: '機能',
    nav_showcase: '事例',
    nav_contact: 'お問い合わせ',
    nav_models: 'モデルマップ',
    nav_module_docs: 'モジュール・資料',
    nav_cta: '相談する',
    hero_intro_label: '✨ SuperCool 1.0｜生成コア × 拡張モジュール',
    hero_intro_headline: 'ひとつの着想から、リリースまでつながるコンテンツパイプラインへ',
    hero_intro_desc:
      '映像・短編ドラマ・画像はまず SuperCool で形になります。プロンプトを検索可能な資産にしたい、シグナルを運用に接続したい、物語を構造化したい——拡張モジュールが受け渡しし、単一キャンバスに縛られません。',
    hero_intro_cta: 'まず提供内容を見る',
    hero_desc:
      'スケジュールやツール選びが想像を止めないで。SuperCool は脚本・絵コンテ・画面・本編をひとつのワークフローに収め、知識基盤・シグナル追跡・マルチエージェント脚本が必要になったら、下のモジュールとドキュメントへ順につなぎます。',
    hero_cta1: '機能を見る',
    hero_cta2: '事例を見る',
    hero_module_entry: '次へ：拡張モジュールと開発者向け資料',
    hero_link_modules_overview: 'モジュールマップ（一覧）',
    products_label: 'プロダクトとモジュール',
    products_title: 'SuperCool 1.0：まず生成、次に拡張——ひと続きのコンテンツループ',
    products_desc:
      '映像・短編ドラマ・画像は SuperCool の生成コアです。プロンプトと結果の蓄積、パラメータとコスト最適化、ウェブ全体のシグナル追跡、マルチエージェント脚本——SuperForge、SuperTune、SuperTrack、SuperScript を必要に応じて独立接続でき、単一キャンバスに固定されません。',
    modules_split_title: '拡張モジュールの繋ぎ方',
    modules_split_desc:
      'Forge は知識とバージョン、Tune はパラメータとバッチ、Track は実体と時系列、Script は構造化脚本——タスクに合わせてマウント。UI と API の説明はモジュールハブに集約します。',
    about_label: '私たちの考え',
    about_title: '創作は「どこかのツールで終わり」ではなく、「どこまでも伸びる」ものであるべきです。',
    about_desc:
      '多くのチームがツール切替と引き継ぎで止まります。Pysdn は生成と資産層を分けます。キャンバス上でまず動かし、知識・シグナル・脚本は別層で積み上げます。着想はバージョン・経路・成果物へ分岐し、頭の中で終わりません。',
    contact_label: '次の一歩',
    contact_title: '着想を「届けられる成果」まで押し上げますか？',
    contact_desc:
      '個人・スタートアップ・企業ブランド問わず、シナリオと節目を教えてください。ワークフロー、モジュールの載せ方、ロールアウトのリズムを一緒に揃えます。',
    footer_tagline:
      'まず生成し、次に蓄積。まず出して、次に反復。SuperCool と拡張モジュールが、ひと言をもっと遠くへ。',
  },
  ko: {
    nav_home: '홈',
    nav_about: '선택 이유',
    nav_products: '기능',
    nav_showcase: '사례',
    nav_contact: '문의',
    nav_models: '모델 맵',
    nav_module_docs: '모듈·문서',
    nav_cta: '상담하기',
    hero_intro_label: '✨ SuperCool 1.0｜생성 코어 × 확장 모듈',
    hero_intro_headline: '하나의 아이디어에서 배포 가능한 콘텐츠 파이프라인까지',
    hero_intro_desc:
      '영상·단편·이미지는 먼저 SuperCool 안에서 형태를 갖춥니다. 프롬프트를 검색 가능한 자산으로, 신호를 운영 단서로, 이야기를 구조화된 각본으로 만들 때는 확장 모듈이 이어받으며 단일 캔버스에 묶이지 않습니다.',
    hero_intro_cta: '먼저 무엇을 제공하는지 보기',
    hero_desc:
      '일정과 툴 선택이 상상을 막아서는 안 됩니다. SuperCool은 각본·스토리보드·화면·완성본을 한 워크플로에 모으고, 지식 베이스·신호 추적·멀티 에이전트 각본이 필요할 때 아래 모듈과 문서로 순차 연결합니다.',
    hero_cta1: '기능 둘러보기',
    hero_cta2: '사례 보기',
    hero_module_entry: '다음: 확장 모듈과 개발자 문서',
    hero_link_modules_overview: '모듈 맵(개요)',
    products_label: '제품과 모듈',
    products_title: 'SuperCool 1.0: 먼저 생성, 다음 확장——한 번에 이어지는 콘텐츠 루프',
    products_desc:
      '영상·단편·이미지는 SuperCool의 생성 코어입니다. 프롬프트와 결과를 쌓고, 파라미터와 비용을 다듬고, 웹 전역 신호를 추적하고, 멀티 에이전트 각본을 짤 때 SuperForge·SuperTune·SuperTrack·SuperScript를 필요에 따라 독립적으로 연결할 수 있어 단일 캔버스에 갇히지 않습니다.',
    modules_split_title: '확장 모듈은 어떻게 붙나요?',
    modules_split_desc:
      'Forge는 지식과 버전, Tune은 파라미터와 배치, Track은 엔티티와 시계열, Script는 구조화된 각본——작업에 맞게 탑재합니다. UI와 API 안내는 모듈 허브에 모읍니다.',
    about_label: '우리가 믿는 것',
    about_title: '창작은 ‘어떤 툴에서 끝’이 아니라 ‘끝없이 뻗어야’ 합니다.',
    about_desc:
      '많은 팀이 툴 전환과 인수인계에서 멈춥니다. Pysdn은 생성과 자산 층을 나눕니다. 캔버스에서 먼저 움직이고, 지식·신호·각본은 다른 층에서 쌓입니다. 아이디어는 버전·경로·결과물로 갈라지고 머릿속에만 남지 않습니다.',
    contact_label: '다음 단계',
    contact_title: '영감을 ‘전달 가능한 결과’까지 밀어올릴 준비가 되었나요?',
    contact_desc:
      '1인·스타트업·엔터프라이즈 모두 환영합니다. 시나리오와 체크포인트를 알려 주세요. 워크플로, 모듈 탑재, 롤아웃 리듬을 함께 맞춥니다.',
    footer_tagline:
      '먼저 생성하고, 다음에 축적. 먼저 출시하고, 다음에 반복. SuperCool과 확장 모듈이 한 문장을 더 멀리 데려갑니다.',
  },
}

for (const [file, merge] of Object.entries(patches)) {
  const fp = path.join(localesDir, `${file}.json`)
  const raw = fs.readFileSync(fp, 'utf8')
  const data = JSON.parse(raw)
  Object.assign(data, merge)
  fs.writeFileSync(fp, JSON.stringify(data), 'utf8')
  console.log('updated', file)
}
