/**
 * 首頁模型庫：內建 Seedance / Seedream 與 [Qwen Cloud Model Marketplace](https://www.qwencloud.com/models) 對齊的精選摘要。
 * 官網列表屬產品行銷精選，實際可調用的模型 ID／配額以主控台與 API 文件為準；本站條目會隨官方主打型號補齊。
 *
 * 條目內容見 {@link ./catalogModels.json}，便於與程式碼分離、單獨編輯與校對。
 */

import catalogModelsJson from './catalogModels.json'

export type ModelProduct = 'seedance' | 'seedream' | 'qwencloud' | 'openrouter' | 'bedrock'

/** 功能維度（對應側欄篩選） */
export type ModelCapability = 'video' | 'image' | 'text' | 'audio' | 'multimodal'

/** 開發商／雲服務提供方 */
export type ModelDeveloper = 'bytedance' | 'alibaba' | 'qwencloud' | 'openrouter' | 'aws'

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
  /** OpenRouter 官方 id（如 org/model），僅 `product === 'openrouter'` 時有值 */
  openRouterApiId?: string
  /** 實際模型供應商／開發商顯示名（如 Anthropic）；OpenRouter 由 id 推導，Bedrock 來自資料表 */
  providerName?: string
  contextLength?: number
  modalitiesLine?: string
}

export const CATALOG_MODELS: CatalogModel[] = catalogModelsJson as CatalogModel[]

/** 僅精選靜態目錄（不含 OpenRouter 動態載入列） */
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
