/**
 * Merges doc HTML fragments + sim UI keys into src/locales/doc/superforge.json
 * Run: node scripts/merge-superforge-doc-html.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const jsonPath = path.join(root, 'src/locales/doc/superforge.json')
const bodyDir = path.join(root, 'scripts/doc-bodies/superforge')

const bundle = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
const langs = ['zh-TW', 'zh-CN', 'en', 'ja', 'ko']

for (const lang of langs) {
  const bodyFile = path.join(bodyDir, `${lang}.html`)
  const advFile = path.join(bodyDir, `adv-${lang}.html`)
  if (fs.existsSync(bodyFile)) {
    bundle[lang].doc_sf_body_html = fs.readFileSync(bodyFile, 'utf8').trim()
  }
  if (fs.existsSync(advFile)) {
    bundle[lang].doc_sf_adv_html = fs.readFileSync(advFile, 'utf8').trim()
  }
}

const simPath = path.join(bodyDir, 'sim-keys.json')
if (fs.existsSync(simPath)) {
  const sim = JSON.parse(fs.readFileSync(simPath, 'utf8'))
  for (const lang of langs) {
    if (sim[lang] && typeof sim[lang] === 'object') {
      Object.assign(bundle[lang], sim[lang])
    }
  }
}

fs.writeFileSync(jsonPath, JSON.stringify(bundle, null, 2) + '\n')
console.log('OK: merged doc_sf_body_html, doc_sf_adv_html, sim keys →', path.relative(root, jsonPath))
