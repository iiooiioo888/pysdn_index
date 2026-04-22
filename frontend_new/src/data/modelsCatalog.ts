/**
 * 首頁模型庫：內建 Seedance / Seedream 與 [Qwen Cloud](https://www.qwencloud.com/) 精選模型摘要（能力說明以各官方頁面為準）。
 */

export type ModelProduct = 'seedance' | 'seedream' | 'qwencloud'

/** 功能維度（對應側欄篩選） */
export type ModelCapability = 'video' | 'image' | 'text' | 'audio' | 'multimodal'

/** 開發商／雲服務提供方 */
export type ModelDeveloper = 'bytedance' | 'alibaba' | 'qwencloud'

export type UiLang = 'zh-TW' | 'zh-CN' | 'en' | 'ja' | 'ko'

export interface CatalogModel {
  id: string
  product: ModelProduct
  capability: ModelCapability
  developer: ModelDeveloper
  badges: ('new' | 'hot')[]
  /** 單價／計價說明；空字串則不顯示價格列 */
  price: string
  title: Record<UiLang, string>
  desc: Record<UiLang, string>
}

export const CATALOG_MODELS: CatalogModel[] = [
  {
    id: 'seedance-2',
    product: 'seedance',
    capability: 'video',
    developer: 'bytedance',
    badges: ['new'],
    price: '',
    title: {
      'zh-TW': 'Seedance 2.0',
      'zh-CN': 'Seedance 2.0',
      en: 'Seedance 2.0',
      ja: 'Seedance 2.0',
      ko: 'Seedance 2.0',
    },
    desc: {
      'zh-TW':
        '導演級多模態影片生成：支援文生影片、圖生影片與原生音畫同步、參考控制與編輯友善流程。',
      'zh-CN':
        '导演级多模态视频生成：支持文生视频、图生视频与原生音画同步、参考控制与编辑友好流程。',
      en:
        'Director-grade multimodal video: text-to-video and image-to-video, native A/V sync, reference control, and editing-friendly workflows.',
      ja:
        '監督品質のマルチモーダル動画：テキスト／画像からの生成、ネイティブ音画同期、参照制御、編集向けワークフロー。',
      ko:
        '감독급 멀티모달 영상: 텍스트·이미지 기반 생성, 네이티브 음영 동기, 참조 제어, 편집 친화 워크플로.',
    },
  },
  {
    id: 'seedream-5-lite',
    product: 'seedream',
    capability: 'image',
    developer: 'bytedance',
    badges: ['new'],
    price: '',
    title: {
      'zh-TW': 'Seedream 5.0 Lite',
      'zh-CN': 'Seedream 5.0 Lite',
      en: 'Seedream 5.0 Lite',
      ja: 'Seedream 5.0 Lite',
      ko: 'Seedream 5.0 Lite',
    },
    desc: {
      'zh-TW':
        '高理解力圖像生成：強調版面落位、指令遵循、深度推理與即時檢索增強的創作體驗。',
      'zh-CN': '高理解力图像生成：强调版面落位、指令遵循、深度推理与实时检索增强的创作体验。',
      en:
        'High-reasoning image generation: layout placement, instruction following, deep reasoning, and retrieval-enhanced creativity.',
      ja:
        '高い理解力の画像生成：レイアウト配置、指示追従、深い推論、検索強化による創作。',
      ko:
        '고이해 이미지 생성: 레이아웃 배치, 지시 따르기, 심층 추론, 검색 강화 창작.',
    },
  },
  {
    id: 'qwen-wan-t2v',
    product: 'qwencloud',
    capability: 'video',
    developer: 'qwencloud',
    badges: ['hot'],
    price: '',
    title: {
      'zh-TW': 'Wan-T2V',
      'zh-CN': 'Wan-T2V',
      en: 'Wan-T2V',
      ja: 'Wan-T2V',
      ko: 'Wan-T2V',
    },
    desc: {
      'zh-TW':
        'Qwen Cloud 文生影片：依文字敘述生成連貫鏡頭，強調動作流暢、電影感美學與畫幅比例等導演向控制。',
      'zh-CN':
        'Qwen Cloud 文生视频：由文本生成连贯镜头，侧重运动流畅度、电影感美学与画幅等导演向控制。',
      en:
        'Qwen Cloud text-to-video: cinematic sequences from prompts with smooth motion, aesthetic control, and aspect-ratio options.',
      ja:
        'Qwen Cloud のテキスト動画生成：滑らかな動きとシネマティックな表現、画角などの制御に強み。',
      ko:
        'Qwen Cloud 텍스트-영상: 부드러운 모션과 시네마틱 미학, 화면비 등 연출형 제어.',
    },
  },
  {
    id: 'qwen-3-6-plus',
    product: 'qwencloud',
    capability: 'multimodal',
    developer: 'qwencloud',
    badges: ['hot'],
    price: '',
    title: {
      'zh-TW': 'Qwen3.6-Plus',
      'zh-CN': 'Qwen3.6-Plus',
      en: 'Qwen3.6-Plus',
      ja: 'Qwen3.6-Plus',
      ko: 'Qwen3.6-Plus',
    },
    desc: {
      'zh-TW':
        '原生視覺語言 Plus 系列：長上下文、強推理與 Agentic 編程／前端實作能力，並強化 OCR、物件辨識與定位等多模態理解。',
      'zh-CN':
        '原生视觉语言 Plus 系列：长上下文、强推理与智能体编程／前端能力，并强化 OCR、物体识别与定位等多模态理解。',
      en:
        'Native vision-language Plus: long context, strong reasoning, agentic coding and front-end tasks, plus OCR, recognition, and grounding.',
      ja:
        'ネイティブVLM Plus：長いコンテキスト、推論、エージェント的コーディング／フロント対応に加え、OCRや物体認識・位置付けを強化。',
      ko:
        '네이티브 VLM Plus: 긴 컨텍스트·추론·에이전트형 코딩·프런트 작업과 OCR·인식·그라운딩 강화.',
    },
  },
  {
    id: 'qwen-3-5-open',
    product: 'qwencloud',
    capability: 'text',
    developer: 'qwencloud',
    badges: ['new'],
    price: '',
    title: {
      'zh-TW': 'Qwen3.5-Open-Source',
      'zh-CN': 'Qwen3.5-Open-Source',
      en: 'Qwen3.5-Open-Source',
      ja: 'Qwen3.5-Open-Source',
      ko: 'Qwen3.5-Open-Source',
    },
    desc: {
      'zh-TW':
        '開源視覺語言系列：混合架構結合線性注意力與稀疏 MoE，在維持多模態能力的同時提升推論效率。',
      'zh-CN':
        '开源视觉语言系列：混合架构结合线性注意力与稀疏 MoE，在保持多模态能力的同时提升推理效率。',
      en:
        'Open vision-language weights: hybrid linear attention and sparse MoE for efficient multimodal inference.',
      ja:
        'オープンウェイトVLM：線形アテンションとスパースMoEのハイブリッドで、マルチモーダル推論の効率を向上。',
      ko:
        '오픈소스 VLM: 선형 어텐션·희소 MoE 하이브리드로 멀티모달 추론 효율 향상.',
    },
  },
  {
    id: 'qwen-cosyvoice',
    product: 'qwencloud',
    capability: 'audio',
    developer: 'qwencloud',
    badges: ['new'],
    price: '',
    title: {
      'zh-TW': 'CosyVoice',
      'zh-CN': 'CosyVoice',
      en: 'CosyVoice',
      ja: 'CosyVoice',
      ko: 'CosyVoice',
    },
    desc: {
      'zh-TW':
        '新一代語音生成：深度整合文本理解與聲學建模，將多種文本語意轉成自然、擬人的語音輸出。',
      'zh-CN':
        '新一代语音生成：深度整合文本理解与声学建模，将多样文本语义转为自然、拟人的语音输出。',
      en:
        'Next-gen TTS: pairs text understanding with speech synthesis for natural, human-like voice output.',
      ja:
        '次世代TTS：テキスト理解と音声生成を統合し、自然で人間らしい読み上げを実現。',
      ko:
        '차세대 TTS: 텍스트 이해와 음성 합성을 결합해 자연스러운 음성 출력.',
    },
  },
  {
    id: 'qwen-3-omni-flash',
    product: 'qwencloud',
    capability: 'multimodal',
    developer: 'qwencloud',
    badges: ['hot'],
    price: '',
    title: {
      'zh-TW': 'Qwen3-Omni-Flash',
      'zh-CN': 'Qwen3-Omni-Flash',
      en: 'Qwen3-Omni-Flash',
      ja: 'Qwen3-Omni-Flash',
      ko: 'Qwen3-Omni-Flash',
    },
    desc: {
      'zh-TW':
        'Thinker–Talker 混合專家架構的全模態模型：高效理解文字、圖像、音訊與影片，並支援多語言文本與語音互動。',
      'zh-CN':
        'Thinker–Talker 混合专家架构的全模态模型：高效理解文本、图像、音频与视频，并支持多语文本与语音交互。',
      en:
        'Thinker–Talker MoE omni model: efficient text, image, audio, and video understanding with multilingual chat and speech.',
      ja:
        'Thinker–Talker MoE オムニ：テキスト・画像・音声・動画の理解と多言語テキスト／音声対話に対応。',
      ko:
        'Thinker–Talker MoE 옴니: 텍스트·이미지·오디오·비디오 이해와 다국어 텍스트·음성 상호작용.',
    },
  },
]

export function getCatalogModelById(id: string): CatalogModel | undefined {
  return CATALOG_MODELS.find((m) => m.id === id)
}

export function resolveUiLang(i18nLang: string): UiLang {
  if (i18nLang === 'zh-CN') return 'zh-CN'
  if (i18nLang === 'ja') return 'ja'
  if (i18nLang === 'ko') return 'ko'
  if (i18nLang === 'zh-TW') return 'zh-TW'
  return 'en'
}

export function pickModelText(row: Record<UiLang, string>, lang: UiLang): string {
  return row[lang] ?? row.en
}
