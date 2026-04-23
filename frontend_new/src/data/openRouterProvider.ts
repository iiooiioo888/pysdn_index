/**
 * OpenRouter `org/model` 的 org 段 → 人類可讀供應商名。
 * org 清單見 `openRouterOrgLabels.json`，與內建快照 `openRouterModelsSnapshot.json` 之 id 前綴對齊；新增模型時若顯示不準可於 JSON 補鍵。
 * 前綴若以 `~` 開頭（路由別名），比對時會先去除再查表。
 */

import orgLabelsJson from './openRouterOrgLabels.json'

const ORG_LABELS: Record<string, string> = orgLabelsJson

function titleCaseSlug(slug: string): string {
  return slug
    .replace(/^~+/, '')
    .split(/[-_/]+/)
    .filter(Boolean)
    .map((w) => {
      const lower = w.toLowerCase()
      if (lower === 'ai') return 'AI'
      if (lower === 'llm') return 'LLM'
      if (lower === 'agi') return 'AGI'
      return w.slice(0, 1).toUpperCase() + w.slice(1).toLowerCase()
    })
    .join(' ')
}

/** 從 OpenRouter API 的 `id`（如 `anthropic/claude-3.5-sonnet`）取得供應商顯示名 */
export function openRouterProviderName(modelId: string): string {
  const id = modelId.trim()
  const slash = id.indexOf('/')
  const org = slash >= 0 ? id.slice(0, slash) : id
  let key = org.toLowerCase().replace(/^~+/, '')
  if (ORG_LABELS[key]) return ORG_LABELS[key]
  return titleCaseSlug(org)
}
