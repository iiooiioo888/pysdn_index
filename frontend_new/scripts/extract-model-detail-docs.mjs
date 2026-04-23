/**
 * 遷移用：從「內含 export const MODEL_DETAIL_DOCS = …」的舊版 modelDetailDocs.ts 抽出 JSON。
 * 正式流程已改為直接編輯 `src/data/modelDetailDocs.json`；僅在從備份還原 TS 時需要執行。
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const tsPath = path.join(root, 'src', 'data', 'modelDetailDocs.ts')
const outPath = path.join(root, 'src', 'data', 'modelDetailDocs.json')

function L(en, zhTW, zhCN, ja, ko) {
  return { en, 'zh-TW': zhTW, 'zh-CN': zhCN, ja: ja ?? en, ko: ko ?? en }
}

const s = fs.readFileSync(tsPath, 'utf8')
const marker = 'export const MODEL_DETAIL_DOCS: Record<string, ModelDetailDoc> = '
const start = s.indexOf(marker)
if (start < 0) {
  console.error('Marker not found — modelDetailDocs.ts may already be refactored.')
  process.exit(1)
}
const brace0 = s.indexOf('{', start)
let depth = 0
let end = brace0
for (let i = brace0; i < s.length; i++) {
  const c = s[i]
  if (c === '{') depth++
  else if (c === '}') {
    depth--
    if (depth === 0) {
      end = i + 1
      break
    }
  }
}
const objSrc = s.slice(brace0, end)
// eslint-disable-next-line no-new-func
const MODEL_DETAIL_DOCS = new Function('L', `return ${objSrc}`)(L)
fs.writeFileSync(outPath, JSON.stringify(MODEL_DETAIL_DOCS, null, 2) + '\n', 'utf8')
console.log('Wrote', outPath)
