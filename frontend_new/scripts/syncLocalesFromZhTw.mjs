/**
 * 以 zh-TW.json 的 key 集合為基準，重寫 zh-CN / ja / ko：
 * 既有譯文保留，缺漏以 en → zh-TW 回填；移除基準中不存在的多餘 key。
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const localesDir = path.join(__dirname, '..', 'src', 'locales')

const base = JSON.parse(fs.readFileSync(path.join(localesDir, 'zh-TW.json'), 'utf8'))
const en = JSON.parse(fs.readFileSync(path.join(localesDir, 'en.json'), 'utf8'))
const baseKeys = Object.keys(base)

function pickFallback(k) {
  if (en[k] !== undefined) return en[k]
  return base[k]
}

for (const name of ['zh-CN', 'ja', 'ko']) {
  const file = path.join(localesDir, `${name}.json`)
  const cur = JSON.parse(fs.readFileSync(file, 'utf8'))
  const out = {}
  for (const k of baseKeys) {
    const v = cur[k]
    out[k] = v !== undefined && v !== null ? v : pickFallback(k)
  }
  fs.writeFileSync(file, JSON.stringify(out, null, 2) + '\n', 'utf8')
  console.log(`synced ${name}: ${baseKeys.length} keys`)
}
