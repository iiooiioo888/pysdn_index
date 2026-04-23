/**
 * 將 `src/locales/doc/*.json` 複製到 `public/i18n/`，供靜態 HTML（superforge.html 等）與舊路徑對齊。
 * 單一真相來源：`src/locales/doc/`；React 透過 Vite 直接 import，不依賴此目錄。
 * 會由 `predev` 與 `postbuild` 自動執行。
 */
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const src = join(root, 'src', 'locales', 'doc')
const dest = join(root, 'public', 'i18n')

mkdirSync(dest, { recursive: true })
let n = 0
for (const f of readdirSync(src)) {
  if (!f.endsWith('.json')) continue
  copyFileSync(join(src, f), join(dest, f))
  n++
}
console.log(`sync-doc-i18n: copied ${n} file(s) → public/i18n/`)
