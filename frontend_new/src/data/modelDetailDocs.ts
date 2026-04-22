import type { UiLang } from './modelsCatalog'

export type ModelDetailDoc = {
  /** 對外官網（若有） */
  officialUrl?: string
  highlights: Record<UiLang, string[]>
  specs: Record<UiLang, { label: string; value: string }[]>
  sections: Record<UiLang, { heading: string; body: string }[]>
}

function L<T>(en: T, zhTW: T, zhCN: T, ja?: T, ko?: T): Record<UiLang, T> {
  return { en, 'zh-TW': zhTW, 'zh-CN': zhCN, ja: ja ?? en, ko: ko ?? en }
}

export const MODEL_DETAIL_DOCS: Record<string, ModelDetailDoc> = {
  'seedance-2': {
    officialUrl: undefined,
    highlights: L(
      [
        'Director-style multimodal video: text, image, audio, and video references in one flow.',
        'Strong shot control, motion stability, and physics-aware movement.',
        'Native audio–video sync and editing-friendly timelines.',
      ],
      [
        '導演向多模態影片：文字、圖像、音訊與影片參考可納入同一工作流。',
        '運鏡與動作穩定度高，貼近物理直覺的運動表現。',
        '原生音畫同步，並利於後續剪輯與迭代。',
      ],
      [
        '导演向多模态视频：文本、图像、音频与视频参考可纳入同一工作流。',
        '运镜与动作稳定性高，贴近物理直觉的运动表现。',
        '原生音画同步，并利于后续剪辑与迭代。',
      ],
    ),
    specs: L(
      [
        { label: 'Capability', value: 'Video generation' },
        { label: 'Brand', value: 'Seedance 2.0' },
        { label: 'Developer', value: 'ByteDance' },
        { label: 'Typical inputs', value: 'Text · Image · Audio · Video reference' },
      ],
      [
        { label: '能力', value: '影片生成' },
        { label: '品牌', value: 'Seedance 2.0' },
        { label: '開發商', value: '字節跳動' },
        { label: '常見輸入', value: '文字 · 圖像 · 音訊 · 影片參考' },
      ],
      [
        { label: '能力', value: '视频生成' },
        { label: '品牌', value: 'Seedance 2.0' },
        { label: '开发商', value: '字节跳动' },
        { label: '常见输入', value: '文本 · 图像 · 音频 · 视频参考' },
      ],
    ),
    sections: L(
      [
        {
          heading: 'When to choose Seedance 2.0',
          body: 'Use it when you need controllable camera language, coherent motion across shots, and synchronized sound without rebuilding the whole pipeline in post.',
        },
        {
          heading: 'Integration note',
          body: 'Treat Seedance as the motion layer in SuperCool: prompts and references flow in; mastered clips feed SuperTrack / SuperForge when you need search, signals, or structured assets.',
        },
      ],
      [
        {
          heading: '何時選 Seedance 2.0',
          body: '當你需要可讀的鏡頭語言、跨鏡頭連貫的動作，以及不必在後期硬拼的音畫同步，Seedance 適合作為影片生成主幹。',
        },
        {
          heading: '與模組協作',
          body: '可把 Seedance 視為 SuperCool 的「影像動態層」：提示與參考入、成片出；若要可搜尋資產、訊號或結構化內容，再交給 SuperTrack、SuperForge 等延伸模組。',
        },
      ],
      [
        {
          heading: '何时选 Seedance 2.0',
          body: '当你需要可读的镜头语言、跨镜头连贯的动作，以及不必在后期硬拼的音画同步，Seedance 适合作为视频生成主干。',
        },
        {
          heading: '与模块协作',
          body: '可把 Seedance 视为 SuperCool 的「影像动态层」：提示与参考入、成片出；若要可检索资产、信号或结构化内容，再交给 SuperTrack、SuperForge 等扩展模块。',
        },
      ],
    ),
  },

  'seedream-5-lite': {
    officialUrl: undefined,
    highlights: L(
      [
        'High-reasoning image model with layout and instruction following.',
        'Strong for precise placement, style control, and iterative refinement.',
        'Works well with retrieval-augmented creative workflows.',
      ],
      [
        '高理解力圖像生成：版面落位、指令遵循表現突出。',
        '適合風格一致、反覆微調的創作節奏。',
        '可與檢索增強類流程搭配，補足題材與事實脈絡。',
      ],
      [
        '高理解力图像生成：版面落位、指令遵循表现突出。',
        '适合风格一致、反复微调的创作节奏。',
        '可与检索增强类流程搭配，补足题材与事实脉络。',
      ],
    ),
    specs: L(
      [
        { label: 'Capability', value: 'Image generation' },
        { label: 'Brand', value: 'Seedream 5.0 Lite' },
        { label: 'Developer', value: 'ByteDance' },
        { label: 'Sweet spot', value: 'Layouts, posters, storyboards, branded stills' },
      ],
      [
        { label: '能力', value: '圖像生成' },
        { label: '品牌', value: 'Seedream 5.0 Lite' },
        { label: '開發商', value: '字節跳動' },
        { label: '適用場景', value: '版面、海報、分鏡、品牌靜態素材' },
      ],
      [
        { label: '能力', value: '图像生成' },
        { label: '品牌', value: 'Seedream 5.0 Lite' },
        { label: '开发商', value: '字节跳动' },
        { label: '适用场景', value: '版面、海报、分镜、品牌静态素材' },
      ],
    ),
    sections: L(
      [
        {
          heading: 'When to choose Seedream 5.0 Lite',
          body: 'Pick it for still frames that must respect structure—grid systems, packaging mocks, UI-adjacent art—while keeping language alignment tight to the prompt.',
        },
        {
          heading: 'Pairing with video',
          body: 'Many teams storyboard in Seedream, then animate selected frames in Seedance for a consistent visual bible.',
        },
      ],
      [
        {
          heading: '何時選 Seedream 5.0 Lite',
          body: '當靜態畫面必須服從結構——柵格、包裝示意、接近 UI 的視覺——且要緊貼提示語意時，Seedream 特別合適。',
        },
        {
          heading: '與影片搭配',
          body: '常見流程是先用 Seedream 定調分鏡或關鍵幀，再挑選畫面交 Seedance 做成動態，維持同一套視覺聖經。',
        },
      ],
      [
        {
          heading: '何时选 Seedream 5.0 Lite',
          body: '当静态画面必须服从结构——栅格、包装示意、接近 UI 的视觉——且要紧贴提示语义时，Seedream 特别合适。',
        },
        {
          heading: '与视频搭配',
          body: '常见流程是先用 Seedream 定调分镜或关键帧，再挑选画面交 Seedance 做成动态，维持同一套视觉圣经。',
        },
      ],
    ),
  },

  'qwen-wan-t2v': {
    officialUrl: 'https://www.qwencloud.com/',
    highlights: L(
      [
        'Hosted text-to-video on Qwen Cloud with cinematic motion emphasis.',
        'Good for aspect-ratio and shot-level direction from natural language.',
        'Pricing and RPM appear on the Qwen Cloud models page—verify before production.',
      ],
      [
        'Qwen Cloud 託管文生影片，強調電影感與動作連貫。',
        '適合以自然語言描述畫幅、鏡頭與氛圍。',
        '計價與配額請以 Qwen Cloud 模型頁即時資訊為準。',
      ],
      [
        'Qwen Cloud 托管文生视频，强调电影感与动作连贯。',
        '适合以自然语言描述画幅、镜头与氛围。',
        '计价与配额请以 Qwen Cloud 模型页即时信息为准。',
      ],
    ),
    specs: L(
      [
        { label: 'Capability', value: 'Video (text-to-video)' },
        { label: 'Provider', value: 'Qwen Cloud' },
        { label: 'Model', value: 'Wan-T2V' },
        { label: 'Verify live', value: 'qwencloud.com models & pricing' },
      ],
      [
        { label: '能力', value: '影片（文生影片）' },
        { label: '供應方', value: 'Qwen Cloud' },
        { label: '模型', value: 'Wan-T2V' },
        { label: '即時規格', value: '以官網模型／定價頁為準' },
      ],
      [
        { label: '能力', value: '视频（文生视频）' },
        { label: '供应方', value: 'Qwen Cloud' },
        { label: '模型', value: 'Wan-T2V' },
        { label: '即时规格', value: '以官网模型／定价页为准' },
      ],
    ),
    sections: L(
      [
        {
          heading: 'Operational checklist',
          body: 'Confirm regional availability, concurrency, and per-second billing on Qwen Cloud before wiring Wan-T2V into automated jobs.',
        },
        {
          heading: 'Creative fit',
          body: 'Use Wan-T2V when you want cloud-managed inference with less ops overhead than self-hosting video diffusion stacks.',
        },
      ],
      [
        {
          heading: '上線前核對',
          body: '在把 Wan-T2V 接進自動化任務前，請於 Qwen Cloud 確認區域、併發與計費方式（例如按秒計價）是否滿足 SLA。',
        },
        {
          heading: '創作定位',
          body: '若希望以託管 API 取得影片、降低自建擴散推理叢集的成本，Wan-T2V 可作為雲端影片選項之一。',
        },
      ],
      [
        {
          heading: '上线前核对',
          body: '在把 Wan-T2V 接进自动化任务前，请于 Qwen Cloud 确认区域、并发与计费方式（例如按秒计价）是否满足 SLA。',
        },
        {
          heading: '创作定位',
          body: '若希望以托管 API 取得视频、降低自建扩散推理集群的成本，Wan-T2V 可作为云端视频选项之一。',
        },
      ],
    ),
  },

  'qwen-3-6-plus': {
    officialUrl: 'https://www.qwencloud.com/',
    highlights: L(
      [
        'Flagship Qwen3.6 native vision-language “Plus” line.',
        'Strong at long-context reasoning, coding/agentic tasks, and document-style OCR.',
        'Check token pricing tiers on Qwen Cloud for your region.',
      ],
      [
        'Qwen3.6 原生視覺語言 Plus 系列，定位旗艦級。',
        '長上下文、程式／Agentic 任務與文件型 OCR 場景表現突出。',
        '各區域輸入／輸出單價請以 Qwen Cloud 即時標示為準。',
      ],
      [
        'Qwen3.6 原生视觉语言 Plus 系列，定位旗舰级。',
        '长上下文、程序／Agentic 任务与文档型 OCR 场景表现突出。',
        '各区域输入／输出单价请以 Qwen Cloud 即时标价为准。',
      ],
    ),
    specs: L(
      [
        { label: 'Capability', value: 'Multimodal (VLM)' },
        { label: 'Provider', value: 'Qwen Cloud' },
        { label: 'Model', value: 'Qwen3.6-Plus' },
        { label: 'Context', value: 'See provider docs for max context & modalities' },
      ],
      [
        { label: '能力', value: '多模態（VLM）' },
        { label: '供應方', value: 'Qwen Cloud' },
        { label: '模型', value: 'Qwen3.6-Plus' },
        { label: '上下文', value: '依官方文件之最大上下文與模態為準' },
      ],
      [
        { label: '能力', value: '多模态（VLM）' },
        { label: '供应方', value: 'Qwen Cloud' },
        { label: '模型', value: 'Qwen3.6-Plus' },
        { label: '上下文', value: '以官方文档之最大上下文与模态为准' },
      ],
    ),
    sections: L(
      [
        {
          heading: 'Best workloads',
          body: 'Executive summaries over mixed PDFs/UI screenshots, multilingual desk research, and front-end/code co-piloting with vision grounding.',
        },
        {
          heading: 'Compliance',
          body: 'Data residency and enterprise VPC options are described on Qwen Cloud—validate against your infosec checklist.',
        },
      ],
      [
        {
          heading: '適合的工作負載',
          body: '混排 PDF／介面截圖的摘要、跨語系桌面研究，以及需要畫面對齊的前端／程式協作。',
        },
        {
          heading: '合規與部署',
          body: '資料落地與企業隔離等選項請以 Qwen Cloud 安全／部署說明為準，並與資安清單對照。',
        },
      ],
      [
        {
          heading: '适合的工作负载',
          body: '混排 PDF／界面截图的摘要、跨语系桌面研究，以及需要画面对齐的前端／程序协作。',
        },
        {
          heading: '合规与部署',
          body: '数据落地与企业隔离等选项请以 Qwen Cloud 安全／部署说明为准，并与安全清单对照。',
        },
      ],
    ),
  },

  'qwen-3-5-open': {
    officialUrl: 'https://www.qwencloud.com/',
    highlights: L(
      [
        'Open-weight Qwen3.5 vision-language stack with hybrid attention + sparse MoE.',
        'Balances multimodal breadth with inference efficiency.',
        'Ideal when you need on-prem or custom fine-tuning paths.',
      ],
      [
        '開源權重 Qwen3.5 視覺語言：線性注意力＋稀疏 MoE 混合架構。',
        '在維持多模態能力同時，偏向較高效率的推理路徑。',
        '適合需要私有化部署或自管微調的團隊評估。',
      ],
      [
        '开源权重 Qwen3.5 视觉语言：线性注意力＋稀疏 MoE 混合架构。',
        '在维持多模态能力同时，偏向较高效率的推理路径。',
        '适合需要私有化部署或自管微调的团队评估。',
      ],
    ),
    specs: L(
      [
        { label: 'Capability', value: 'Text / open VLM' },
        { label: 'Provider', value: 'Qwen Cloud (open series)' },
        { label: 'Model', value: 'Qwen3.5-Open-Source' },
        { label: 'Deployment', value: 'Cloud API and/or self-hosted weights' },
      ],
      [
        { label: '能力', value: '文字／開源 VLM' },
        { label: '供應方', value: 'Qwen Cloud（開源系列）' },
        { label: '模型', value: 'Qwen3.5-Open-Source' },
        { label: '部署', value: '雲端 API 與／或自建權重' },
      ],
      [
        { label: '能力', value: '文本／开源 VLM' },
        { label: '供应方', value: 'Qwen Cloud（开源系列）' },
        { label: '模型', value: 'Qwen3.5-Open-Source' },
        { label: '部署', value: '云端 API 与／或自建权重' },
      ],
    ),
    sections: L(
      [
        {
          heading: 'Why open weights matter',
          body: 'You can pin a revision, run offline evaluations, and pair the model with internal toolchains without depending solely on hosted prompts.',
        },
        {
          heading: 'Operational caveat',
          body: 'Self-hosting still needs GPU planning, batching policies, and safety filters—budget engineering time alongside license review.',
        },
      ],
      [
        {
          heading: '開源權重的意義',
          body: '可鎖定版本、離線評測，並與內部工具鏈整合，而不只依賴託管提示詞流程。',
        },
        {
          heading: '維運提醒',
          body: '自建仍需 GPU 規劃、批次策略與安全過濾——請同步編列工程與法遵審閱時間。',
        },
      ],
      [
        {
          heading: '开源权重的意义',
          body: '可锁定版本、离线评测，并与内部工具链整合，而不只依赖托管提示词流程。',
        },
        {
          heading: '运维提醒',
          body: '自建仍需 GPU 规划、批次策略与安全过滤——请同步编列工程与法遵审阅时间。',
        },
      ],
    ),
  },

  'qwen-cosyvoice': {
    officialUrl: 'https://www.qwencloud.com/',
    highlights: L(
      [
        'CosyVoice couples text understanding with neural TTS for natural delivery.',
        'Useful for assistants, dubbing scratch tracks, and accessibility voiceovers.',
        'Character-level billing appears on Qwen Cloud—validate locale coverage.',
      ],
      [
        'CosyVoice 將文本理解與神經 TTS 結合，語氣較接近真人說話節奏。',
        '適合助理語音、暫時對白軌與無障礙旁白等情境。',
        '字元／字級計價與語言覆蓋率請查 Qwen Cloud。',
      ],
      [
        'CosyVoice 将文本理解与神经 TTS 结合，语气较接近真人说话节奏。',
        '适合助理语音、临时对白轨与无障碍旁白等情境。',
        '字符／字级计价与语言覆盖率请查 Qwen Cloud。',
      ],
    ),
    specs: L(
      [
        { label: 'Capability', value: 'Speech / TTS' },
        { label: 'Provider', value: 'Qwen Cloud' },
        { label: 'Model', value: 'CosyVoice' },
        { label: 'Typical output', value: 'Natural speech audio from structured text' },
      ],
      [
        { label: '能力', value: '語音／TTS' },
        { label: '供應方', value: 'Qwen Cloud' },
        { label: '模型', value: 'CosyVoice' },
        { label: '輸出', value: '由結構化文本生成自然語音' },
      ],
      [
        { label: '能力', value: '语音／TTS' },
        { label: '供应方', value: 'Qwen Cloud' },
        { label: '模型', value: 'CosyVoice' },
        { label: '输出', value: '由结构化文本生成自然语音' },
      ],
    ),
    sections: L(
      [
        {
          heading: 'Audio pipeline tips',
          body: 'Normalize text (numbers, abbreviations) before synthesis, and keep a human QC loop for brand-sensitive reads.',
        },
        {
          heading: 'Latency',
          body: 'For real-time UX, test regional endpoints and streaming APIs exposed by Qwen Cloud rather than assuming batch defaults.',
        },
      ],
      [
        {
          heading: '音訊流程建議',
          body: '合成前正規化數字、縮寫與標點；品牌敏感讀稿仍建議保留人工抽檢。',
        },
        {
          heading: '延遲與即時性',
          body: '即時體驗請實測區域端點與串流 API，勿假設批次預設可沿用。',
        },
      ],
      [
        {
          heading: '音频流程建议',
          body: '合成前规范化数字、缩写与标点；品牌敏感读稿仍建议保留人工抽检。',
        },
        {
          heading: '延迟与即时性',
          body: '即时体验请实测区域端点与流式 API，勿假设批次默认可沿用。',
        },
      ],
    ),
  },

  'qwen-3-omni-flash': {
    officialUrl: 'https://www.qwencloud.com/',
    highlights: L(
      [
        'Thinker–Talker MoE omni model spanning text, image, audio, and video.',
        'Supports multilingual chat plus speech-centric interactions.',
        'Ideal for unified multimodal assistants on Qwen Cloud.',
      ],
      [
        'Thinker–Talker 混合專家架構，涵蓋文字、圖像、音訊與影片。',
        '支援多語文本與語音互動，適合「全模態助理」原型。',
        '在 Qwen Cloud 上以託管方式快速試作與擴展。',
      ],
      [
        'Thinker–Talker 混合专家架构，涵盖文本、图像、音频与视频。',
        '支持多语文本与语音互动，适合「全模态助理」原型。',
        '在 Qwen Cloud 上以托管方式快速试作与扩展。',
      ],
    ),
    specs: L(
      [
        { label: 'Capability', value: 'Multimodal omni' },
        { label: 'Provider', value: 'Qwen Cloud' },
        { label: 'Model', value: 'Qwen3-Omni-Flash' },
        { label: 'Architecture', value: 'Thinker–Talker MoE (per provider)' },
      ],
      [
        { label: '能力', value: '全模態' },
        { label: '供應方', value: 'Qwen Cloud' },
        { label: '模型', value: 'Qwen3-Omni-Flash' },
        { label: '架構', value: 'Thinker–Talker MoE（依官方）' },
      ],
      [
        { label: '能力', value: '全模态' },
        { label: '供应方', value: 'Qwen Cloud' },
        { label: '模型', value: 'Qwen3-Omni-Flash' },
        { label: '架构', value: 'Thinker–Talker MoE（依官方）' },
      ],
    ),
    sections: L(
      [
        {
          heading: 'Design pattern',
          body: 'Route user utterances to the omni endpoint when inputs may mix modalities in a single session—avoid chaining separate single-modal APIs unless you need fine control.',
        },
        {
          heading: 'Cost control',
          body: 'Omni models can be thirsty; log token/audio/video usage per workflow and set guardrails in SuperTune or your own policy layer.',
        },
      ],
      [
        {
          heading: '設計模式',
          body: '當單一工作階段可能交錯多模態輸入時，優先走 omni 端點；除非要極細控制，否則不必硬拆成多個單模態 API。',
        },
        {
          heading: '成本控管',
          body: '全模態模型耗用較高，請逐工作流記錄 token／音訊／影片用量，並在 SuperTune 或自有策略層設上限。',
        },
      ],
      [
        {
          heading: '设计模式',
          body: '当单一工作阶段可能交错多模态输入时，优先走 omni 端点；除非要极细控制，否则不必硬拆成多个单模态 API。',
        },
        {
          heading: '成本管控',
          body: '全模态模型耗用较高，请逐工作流记录 token／音频／视频用量，并在 SuperTune 或自有策略层设上限。',
        },
      ],
    ),
  },
}

export function getModelDetailDoc(modelId: string): ModelDetailDoc | undefined {
  return MODEL_DETAIL_DOCS[modelId]
}
