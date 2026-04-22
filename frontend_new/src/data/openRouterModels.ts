import type { CatalogModel, ModelCapability, UiLang } from './modelsCatalog'

const OPENROUTER_MODELS_URL = 'https://openrouter.ai/api/v1/models'

type OpenRouterApiRow = {
  id: string
  name?: string
  description?: string
  context_length?: number
  architecture?: {
    modality?: string
    input_modalities?: string[]
    output_modalities?: string[]
  }
  pricing?: {
    prompt?: string
    completion?: string
    request?: string
    image?: string
  }
}

function monoLocale(text: string): Record<UiLang, string> {
  const s = text.trim() || '—'
  return { en: s, 'zh-TW': s, 'zh-CN': s, ja: s, ko: s }
}

function inferCapability(row: OpenRouterApiRow): ModelCapability {
  const ins = (row.architecture?.input_modalities ?? []).map((x) => x.toLowerCase())
  const outs = (row.architecture?.output_modalities ?? []).map((x) => x.toLowerCase())
  const mod = String(row.architecture?.modality ?? '').toLowerCase()
  const bag = `${mod} ${ins.join(' ')} ${outs.join(' ')}`

  if (bag.includes('video')) return 'video'
  if (bag.includes('audio')) return 'audio'

  const outImage = outs.some((o) => o.includes('image'))
  const inImage = ins.some((o) => o.includes('image'))

  if (outImage && !outs.some((o) => o.includes('video'))) {
    if (!inImage || (ins.length === 1 && ins[0] === 'text')) return 'image'
  }

  if (inImage || outImage) return 'multimodal'
  if (ins.length + outs.length > 2) return 'multimodal'
  if (bag.includes('text') && !bag.includes('image')) return 'text'
  return 'multimodal'
}

function formatPricing(p?: OpenRouterApiRow['pricing']): string {
  if (!p) return ''
  const parts: string[] = []
  if (p.prompt != null && p.prompt !== '') parts.push(`prompt ${p.prompt}`)
  if (p.completion != null && p.completion !== '') parts.push(`completion ${p.completion}`)
  if (p.request != null && p.request !== '') parts.push(`request ${p.request}`)
  if (p.image != null && p.image !== '') parts.push(`image ${p.image}`)
  return parts.join(' · ')
}

function buildModalitiesLine(row: OpenRouterApiRow): string {
  const ins = row.architecture?.input_modalities?.join(', ') ?? '—'
  const outs = row.architecture?.output_modalities?.join(', ') ?? '—'
  return `${ins} → ${outs}`
}

export function mapOpenRouterRow(row: OpenRouterApiRow): CatalogModel {
  const id = `or--${row.id.replace(/\//g, '__')}`
  const title = row.name?.trim() || row.id.replace(/\//g, ' / ')
  const desc = row.description?.trim() || row.id
  return {
    id,
    product: 'openrouter',
    capability: inferCapability(row),
    developer: 'openrouter',
    badges: [],
    price: formatPricing(row.pricing),
    title: monoLocale(title),
    desc: monoLocale(desc),
    openRouterApiId: row.id,
    contextLength: row.context_length,
    modalitiesLine: buildModalitiesLine(row),
  }
}

let cache: CatalogModel[] | null = null
let inflight: Promise<CatalogModel[]> | null = null

async function loadOpenRouterCatalog(): Promise<CatalogModel[]> {
  const res = await fetch(OPENROUTER_MODELS_URL)
  if (!res.ok) throw new Error(`OpenRouter HTTP ${res.status}`)
  const json = (await res.json()) as { data?: OpenRouterApiRow[] }
  const rows = json.data ?? []
  const mapped = rows.map(mapOpenRouterRow)
  mapped.sort((a, b) => a.title.en.localeCompare(b.title.en, undefined, { sensitivity: 'base' }))
  return mapped
}

/** 取得 OpenRouter 全量模型（含快取）；失敗時由呼叫端 catch。 */
export function ensureOpenRouterModels(): Promise<CatalogModel[]> {
  if (cache) return Promise.resolve(cache)
  if (!inflight) {
    inflight = loadOpenRouterCatalog()
      .then((mapped) => {
        cache = mapped
        return mapped
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

/** 測試或強制重新整理時可呼叫 */
export function clearOpenRouterModelCache(): void {
  cache = null
}
