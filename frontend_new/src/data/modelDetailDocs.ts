import type { UiLang } from './modelsCatalog'
import modelDetailDocsJson from './modelDetailDocs.json'

export type ModelDetailDoc = {
  /** 對外官網（若有） */
  officialUrl?: string
  highlights: Record<UiLang, string[]>
  specs: Record<UiLang, { label: string; value: string }[]>
  sections: Record<UiLang, { heading: string; body: string }[]>
}

export const MODEL_DETAIL_DOCS = modelDetailDocsJson as Record<string, ModelDetailDoc>

export function getModelDetailDoc(modelId: string): ModelDetailDoc | undefined {
  return MODEL_DETAIL_DOCS[modelId]
}
