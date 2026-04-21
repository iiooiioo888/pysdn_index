import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(__dirname, '..', 'dist')
const indexHtml = path.join(dist, 'index.html')
const out404 = path.join(dist, '404.html')

if (fs.existsSync(indexHtml)) {
  fs.copyFileSync(indexHtml, out404)
  console.log('copied dist/index.html -> dist/404.html (GitHub Pages SPA fallback)')
}
