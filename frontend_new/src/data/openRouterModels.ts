import type { CatalogModel, ModelCapability, UiLang } from './modelsCatalog'
import { openRouterProviderName } from './openRouterProvider'
import openRouterSnapshot from './openRouterModelsSnapshot.json'

/** 與 `openRouterModelsSnapshot.json` 內單筆 `data[]` 對齊（由 OpenRouter API 匯出） */
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

/** 官方 API 為 USD／token；轉成「每百萬 token 美元」字串，供 `ModelCardPrice` IN/OUT 雙欄。 */
function usdTokenToDollarM(tok?: string | null): string {
  if (tok == null || tok === '') return ''
  const n = Number(String(tok).trim().replace(/,/g, ''))
  if (!Number.isFinite(n) || n === 0) return ''
  const perM = n * 1_000_000
  if (perM < 0.000_001) return '$0'
  if (perM < 0.01) {
    const t = perM.toFixed(4)
    return `$${t.replace(/\.?0+$/, '')}`
  }
  if (perM < 1) {
    const t = perM.toFixed(3)
    return `$${t.replace(/\.?0+$/, '')}`
  }
  if (perM < 100) {
    const t = perM.toFixed(2)
    return `$${t.replace(/\.?0+$/, '')}`
  }
  return `$${Math.round(perM)}`
}

/**
 * 與 Bedrock 產生器字首一致（`輸入 …／百萬 tokens` 或舊式 `In: …/M tok`），列表卡片可共用雙欄版式。
 * 若僅有 request / image 等，以簡要片段銜接。
 */
function formatOpenRouterPricing(p?: OpenRouterApiRow['pricing']): string {
  if (!p) return ''
  const pr = usdTokenToDollarM(p.prompt)
  const co = usdTokenToDollarM(p.completion)
  if (pr && co) {
    return `In: ${pr}/M tok · Out: ${co}/M tok (per 1M tokens · OpenRouter)`
  }
  if (pr) {
    return `In: ${pr}/M tok (per 1M tokens · OpenRouter)`
  }
  const rest: string[] = []
  if (p.request != null && p.request !== '') {
    const r = usdTokenToDollarM(p.request)
    rest.push(r ? `request ${r}/M` : `request ${p.request}`)
  }
  if (p.image != null && p.image !== '') {
    const im = usdTokenToDollarM(p.image)
    rest.push(im ? `image ${im}/M` : `image ${p.image}`)
  }
  if (p.completion != null && p.completion !== '' && !pr) {
    const c2 = usdTokenToDollarM(p.completion)
    rest.push(c2 ? `out ${c2}/M` : `completion ${p.completion}`)
  }
  return rest.join(' · ')
}

const RE_VID = /\b(t2v|i2v|text-to-video|image-to-video|sora|veo|kling|runway|wan[- ]?2)/i
const RE_T2I = /(flux|dall-?e|sdxl|stable-?diffusion|imagen|z-image|playground-?v2|midjourney)/i
const RE_VLM = /(llava|qwen.*vl|omni-?flash|gemini-2|gemini-1\.5|gpt-4o|4o-2024|claude-3|claude-sonnet-4|vision|idefics|minicpm|moondream|multimodal|phi-3\.5-vision)/i
const RE_EMB = /(embedd|bge-|-embed|text-embedding)/i

function isTextMod(t: string): boolean {
  const x = t.toLowerCase()
  return x === 'text' || x.includes('text') || x === 'file' || x === 'citation'
}

function inferCapability(row: OpenRouterApiRow): ModelCapability {
  const idL = row.id.toLowerCase()
  const mod = String(row.architecture?.modality ?? '').toLowerCase()
  const ins0 = row.architecture?.input_modalities ?? []
  const outs0 = row.architecture?.output_modalities ?? []
  const ins = ins0.map((x) => x.toLowerCase())
  const outs = outs0.map((x) => x.toLowerCase())
  const bag = ` ${mod} ${ins.join(' ')} ${outs.join(' ')} `

  if (RE_VID.test(bag) || RE_VID.test(idL) || (bag.includes('video') && (outs.some((o) => o.includes('video')) || mod.includes('video')))) {
    return 'video'
  }
  if (bag.includes('audio') || /(whisper|tts|speech|stt|sonic|nova)/.test(bag) || /(whisper|tts-)/.test(idL)) {
    if (!bag.includes('image') && !/vision/.test(bag)) return 'audio'
  }

  if (RE_EMB.test(idL)) return 'text'

  if (ins.length === 0 && outs.length === 0) {
    if (RE_T2I.test(idL) && !RE_VLM.test(idL)) return 'image'
    if (RE_VID.test(idL)) return 'video'
    if (RE_VLM.test(idL)) return 'multimodal'
    return 'text'
  }

  const outImage = outs.some((o) => o.includes('image') && !o.includes('video'))
  const inImage = ins.some((o) => o.includes('image') || o === 'file')
  const outVideo = outs.some((o) => o.includes('video'))
  const outAudio = outs.some((o) => o.includes('audio') || o.includes('speech'))
  if (outVideo) return 'video'
  if (outAudio && !outImage) return 'audio'

  if (outImage && !outVideo) {
    const inOnlyText = ins.length > 0 && ins.every(isTextMod) && !inImage
    if (inOnlyText) return 'image'
    if (!inImage && !mod.includes('vision')) {
      if (ins.length === 0) return 'image'
    }
  }

  if (inImage || outImage) {
    if (RE_T2I.test(idL) && !RE_VLM.test(idL)) return 'image'
    if (RE_VLM.test(idL)) return 'multimodal'
    if (inImage && outs.some((o) => o.includes('text') || o.includes('json'))) {
      if (RE_VLM.test(idL) || (ins.length + outs.length > 2)) return 'multimodal'
    }
    if (ins.length + outs.length > 2) {
      const allT = [...ins, ...outs].every((m) => isTextMod(m) || m === 'json' || m === 'reasoning')
      if (allT && (inImage || outImage) && (ins.some((i) => i.includes('image') || i === 'file') || outImage)) {
        return 'multimodal'
      }
    }
    if (inImage && outImage) return 'multimodal'
    if (inImage && outs.some((o) => o.includes('text')) && !idL.match(RE_VLM) && outImage) {
      return 'multimodal'
    }
  }

  if (ins.length > 0 && outs.length > 0 && ins.every(isTextMod) && outs.every(isTextMod) && !inImage && !outImage) {
    return 'text'
  }
  if (!inImage && !outImage && (ins.length > 0 || outs.length > 0)) {
    if (ins.every(isTextMod) && outs.every((o) => isTextMod(o) || o === 'json' || o === 'reasoning')) {
      return 'text'
    }
  }

  return inImage || outImage ? 'multimodal' : 'text'
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
    price: formatOpenRouterPricing(row.pricing),
    title: monoLocale(title),
    desc: monoLocale(desc),
    openRouterApiId: row.id,
    providerName: openRouterProviderName(row.id),
    contextLength: row.context_length,
    modalitiesLine: buildModalitiesLine(row),
  }
}

function buildCatalogFromSnapshot(rows: OpenRouterApiRow[]): CatalogModel[] {
  const mapped = rows.map(mapOpenRouterRow)
  mapped.sort((a, b) => {
    const pa = a.providerName ?? ''
    const pb = b.providerName ?? ''
    if (pa !== pb) {
      return pa.localeCompare(pb, 'en', { sensitivity: 'base' })
    }
    return a.title.en.localeCompare(b.title.en, 'en', { sensitivity: 'base' })
  })
  return mapped
}

const snapshotData = (openRouterSnapshot as { data: OpenRouterApiRow[] }).data

/**
 * 內建 OpenRouter 模型清單（自 `openRouterModelsSnapshot.json`，含彙總前之 API 欄位與**價格**）。
 * 執行期**不**請求 `openrouter.ai`；更新列表與價位請以工具重新產生快照並覆寫該 JSON。
 */
export const OPENROUTER_MODELS: CatalogModel[] = buildCatalogFromSnapshot(snapshotData)

/** 與舊版相容：改為回傳內建靜態陣列（非遠端抓取）。 */
export function ensureOpenRouterModels(): Promise<CatalogModel[]> {
  return Promise.resolve(OPENROUTER_MODELS)
}

/** 舊快取邏輯已移除；保留 no-op 以免外部測試腳本崩潰。 */
export function clearOpenRouterModelCache(): void {}