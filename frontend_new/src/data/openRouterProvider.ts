/**
 * OpenRouter `org/model` 的 org 段 → 人類可讀供應商名。
 * org 清單與內建快照 `openRouterModelsSnapshot.json` 之 id 前綴對齊；新增模型時若顯示不準可在此補鍵。
 * 前綴若以 `~` 開頭（路由別名），比對時會先去除再查表。
 */

const ORG_LABELS: Record<string, string> = {
  ai21: 'AI21 Labs',
  'aion-labs': 'Aion Labs',
  alfredpros: 'AlfredPros',
  alibaba: 'Alibaba',
  allenai: 'Allen AI',
  alpindale: 'Alpindale',
  amazon: 'Amazon',
  'anthracite-org': 'Anthracite',
  anthropic: 'Anthropic',
  'arcee-ai': 'Arcee',
  baidu: 'Baidu',
  bytedance: 'ByteDance',
  'bytedance-seed': 'ByteDance',
  cognitivecomputations: 'Cognitive Computations',
  cohere: 'Cohere',
  deepcogito: 'Deep Cogito',
  deepseek: 'DeepSeek',
  essentialai: 'Essential AI',
  google: 'Google',
  gryphe: 'Gryphe',
  'ibm-granite': 'IBM',
  inception: 'Inception',
  inclusionai: 'Inclusion AI',
  inflection: 'Inflection',
  kwaipilot: 'Kwaipilot',
  liquid: 'Liquid AI',
  mancer: 'Mancer',
  'meta-llama': 'Meta',
  microsoft: 'Microsoft',
  minimax: 'MiniMax',
  mistralai: 'Mistral',
  moonshotai: 'Moonshot AI',
  morph: 'Morph',
  'nex-agi': 'Nex AGI',
  nousresearch: 'Nous Research',
  nvidia: 'NVIDIA',
  openai: 'OpenAI',
  openrouter: 'OpenRouter',
  perplexity: 'Perplexity',
  'prime-intellect': 'Prime Intellect',
  qwen: 'Qwen',
  rekaai: 'Reka',
  relace: 'Relace',
  sao10k: 'SAO10K',
  stepfun: 'StepFun',
  switchpoint: 'Switchpoint',
  tencent: 'Tencent',
  thedrummer: 'The Drummer',
  tngtech: 'TNG Technology',
  undi95: 'Undi95',
  upstage: 'Upstage',
  writer: 'Writer',
  'x-ai': 'xAI',
  xiaomi: 'Xiaomi',
  'z-ai': 'Z.AI',
}

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
