/**
 * 模型列表卡片的計價顯示：解析為等寬、對齊的版位；完整字串仍見於詳情頁 `model.price`。
 */

export type ModelCardPriceView =
  | { kind: 'in-out'; inPrice: string; outPrice: string }
  | { kind: 'in-only'; inPrice: string; embed?: boolean }
  | { kind: 'openrouter'; leftLabel: 'P'; rightLabel: 'C'; left: string; right: string }
  /** 火山圖像／影片等非 token 計價（單欄＋圖例，版型對齊 --io） */
  | { kind: 'per-unit'; unit: 'image' | 'video'; amount: string; legend: string }
  | { kind: 'plain'; text: string }

function cleanPlainSegments(price: string): string {
  let t = price
    .trim()
    .replace(/\s*\(per 1M tokens\)\s*/gi, ' · ')
    .split(' · ')
    .map((p) => p.trim())
    .filter((part) => {
      if (/\bCache read\b/i.test(part)) return false
      if (/^Batch\s+\d+%/i.test(part)) return false
      if (/\bGated /i.test(part) && part.length > 32) return false
      return true
    })
    .join(' · ')

  if (t.length > 56) {
    const p = t.split(' · ').filter(Boolean)
    t = p.slice(0, 2).join(' · ') + (p.length > 2 ? '…' : '')
  }
  return t
}

/**
 * 供卡片版面使用：能對齊的走雙欄，否則單行精簡字串。
 */
export function buildModelCardPriceView(price: string): ModelCardPriceView {
  const s = price.trim()
  if (!s) return { kind: 'plain', text: '—' }

  // Bedrock 產生器繁中：輸入 $x／百萬 tokens · 輸出 $y／百萬 tokens
  const inZh = s.match(/輸入\s+(\$[\d.]+)／\s*百萬\s+tokens/)
  const outZh = s.match(/輸出\s+(\$[\d.]+)／\s*百萬\s+tokens/)
  if (inZh && outZh) {
    return { kind: 'in-out', inPrice: inZh[1], outPrice: outZh[1] }
  }
  if (inZh) {
    const embed =
      /輸出[：:]\s*不適用[（(]嵌入|Output:\s*不適用|嵌入模型|embedding/i.test(s) ||
      /embed/i.test(s)
    return { kind: 'in-only', inPrice: inZh[1], embed: embed || undefined }
  }

  const inM = s.match(/In:\s*(\$[\d.]+)\/M tok/i)
  const outM = s.match(/Out:\s*(\$[\d.]+)\/M tok/i)
  if (inM && outM) {
    return { kind: 'in-out', inPrice: inM[1], outPrice: outM[1] }
  }
  if (inM) {
    const embed =
      /Output:\s*不適用|Output:\s*N\/A|嵌入模型|embedding/i.test(s) || /embed/i.test(s)
    return { kind: 'in-only', inPrice: inM[1], embed: embed || undefined }
  }

  if (/^prompt\s/i.test(s)) {
    const pMatch = s.match(/prompt\s+([^\s·]+)/i)
    const cMatch = s.match(/completion\s+([^\s·]+)/i)
    if (pMatch && cMatch) {
      return {
        kind: 'openrouter',
        leftLabel: 'P',
        rightLabel: 'C',
        left: pMatch[1],
        right: cMatch[1],
      }
    }
  }

  const perImage = s.match(/^每張\s+(\$[\d.]+)（([^）]+)）\s*$/)
  if (perImage) {
    return { kind: 'per-unit', unit: 'image', amount: perImage[1], legend: perImage[2] }
  }
  const perVideo = s.match(/^每影片秒\s+(\$[\d.]+)\s*$/)
  if (perVideo) {
    return { kind: 'per-unit', unit: 'video', amount: perVideo[1], legend: '每影片' }
  }

  // 短字串可原樣單行
  if (s.length <= 40 && !/\s*·\s*/.test(s)) {
    return { kind: 'plain', text: s }
  }
  return { kind: 'plain', text: cleanPlainSegments(s) }
}

/** 若僅要單行字串（測試／備用） */
export function shortenModelCardPriceLine(price: string): string {
  const v = buildModelCardPriceView(price)
  if (v.kind === 'in-out') return `In ${v.inPrice} · Out ${v.outPrice} / 1M`
  if (v.kind === 'in-only') return `In ${v.inPrice} / 1M`
  if (v.kind === 'openrouter') return `P ${v.left} · C ${v.right}`
  if (v.kind === 'per-unit') {
    return v.unit === 'image' ? `每張 ${v.amount}（${v.legend}）` : `每影片秒 ${v.amount}`
  }
  return v.text
}
