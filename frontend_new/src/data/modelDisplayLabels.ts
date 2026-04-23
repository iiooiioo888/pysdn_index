import type { CatalogModel, ModelCapability, ModelProduct } from './modelsCatalog'

/** 列表卡片：能力短標（一眼用途） */
export function cardUseShortLabel(cap: ModelCapability, t: (k: string) => string): string {
  const key =
    cap === 'video'
      ? 'models_use_short_video'
      : cap === 'image'
        ? 'models_use_short_image'
        : cap === 'text'
          ? 'models_use_short_text'
          : cap === 'audio'
            ? 'models_use_short_audio'
            : 'models_use_short_multimodal'
  return t(key)
}

/** 列表卡片／詳情：收錄管道（與篩選「資料來源」對齊的短寫法） */
export function cardPipelineLabel(product: ModelProduct, t: (k: string) => string): string {
  if (product === 'seedance' || product === 'seedream') return t('models_pipeline_volcano')
  if (product === 'qwencloud') return t('models_pipeline_qwen')
  if (product === 'openrouter') return t('models_pipeline_openrouter')
  return t('models_pipeline_bedrock')
}

/** 詳情頁「產品／收欄」一行：依靜態 id 盡量具體，其餘回退產品線。 */
export function detailProductLineLabel(m: CatalogModel, t: (k: string) => string): string {
  switch (m.id) {
    case 'seedance-2':
      return t('models_product_line_seedance')
    case 'seedream-5-lite':
      return t('models_product_line_seedream')
    case 'qwen-wan-t2v':
      return t('models_product_line_qwen_t2v')
    case 'qwen-3-6-plus':
      return t('models_product_line_qwen_36')
    case 'qwen-3-5-open':
      return t('models_product_line_qwen_35o')
    case 'qwen-cosyvoice':
      return t('models_product_line_qwen_cosy')
    case 'qwen-3-omni-flash':
      return t('models_product_line_qwen_omni')
    case 'qwen-3-5-plus':
      return t('models_product_line_qwen_35p')
    case 'qwen-wan-image-edit':
      return t('models_product_line_qwen_wan_img')
    case 'qwen-image-2':
      return t('models_product_line_qwen_img2')
    default:
      if (m.product === 'qwencloud') return t('models_product_line_qwen_default')
      if (m.product === 'seedance' || m.product === 'seedream') return t('models_pipeline_volcano')
      if (m.product === 'openrouter') return t('models_product_line_or_dynamic')
      if (m.product === 'bedrock') return t('models_product_line_bedrock_row')
      return t('models_product_line_generic')
  }
}

/** 與模型庫篩選一致的能力名（詳情、表格用） */
export function detailCapabilityLabel(cap: ModelCapability, t: (k: string) => string): string {
  const key =
    cap === 'video'
      ? 'models_tab_video'
      : cap === 'image'
        ? 'models_tab_image'
        : cap === 'text'
          ? 'models_tab_text'
          : cap === 'audio'
            ? 'models_tab_audio'
            : 'models_tab_multimodal'
  return t(key)
}

export function listingSourceLabel(m: CatalogModel, t: (k: string) => string): string {
  if (m.product === 'openrouter') return t('models_card_source_openrouter')
  if (m.product === 'bedrock') return t('models_card_source_bedrock')
  return t('models_listing_source_curated')
}

/** 靜態精選目錄（火山／Qwen），用於「精選」pill；OpenRouter／Bedrock 另用綠色來源 pill。 */
export function isCuratedCatalogModel(m: CatalogModel): boolean {
  return m.product === 'seedance' || m.product === 'seedream' || m.product === 'qwencloud'
}

/**
 * 卡片：簡寫上下文長度；無則 null。
 * @param t 用於單位片段（如「上下文」簡寫）
 */
export function contextLengthPill(
  ctx: number | undefined,
  t: (k: string) => string,
): string | null {
  if (ctx == null || !Number.isFinite(ctx) || ctx <= 0) return null
  let abbrev: string
  if (ctx >= 1_000_000) {
    const m = ctx / 1_000_000
    abbrev = m >= 10 ? `${Math.round(m)}M` : `${(Math.round(m * 10) / 10).toString().replace(/\.0$/, '')}M`
  } else if (ctx >= 1000) {
    abbrev = `${Math.round(ctx / 1000)}k`
  } else {
    abbrev = String(Math.round(ctx))
  }
  const suf = t('models_ctx_suffix_short').trim()
  return suf ? `${abbrev} ${suf}` : abbrev
}
