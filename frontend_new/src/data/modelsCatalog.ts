/** 首頁模型庫：僅展示 Seedance 2.0（影片）與 Seedream 5.0 Lite（圖像），不含第三方外連。 */

export type ModelProduct = 'seedance' | 'seedream'

/** 功能維度：影片生成 / 圖像生成 */
export type ModelCapability = 'video' | 'image'

/** 開發商／雲服務提供方 */
export type ModelDeveloper = 'bytedance' | 'alibaba'

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
    developer: 'alibaba',
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
]

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
