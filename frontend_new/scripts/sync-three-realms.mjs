#!/usr/bin/env node
/**
 * sync-three-realms.mjs
 *
 * Fetches directory listings + README content from iiooiioo888/Note (天域/神域/鏡界)
 * and generates a static TypeScript data file for the Three Realms feature cards.
 *
 * Token: process.env.GITHUB_TOKEN or process.env.NOTE_GITHUB_TOKEN
 * Output: src/data/threeRealmsFeatures.ts
 *
 * Usage:
 *   GITHUB_TOKEN=ghp_xxx node scripts/sync-three-realms.mjs
 *   # or: npm run sync:realms
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = join(ROOT, 'src', 'data', 'threeRealmsFeatures.ts')

const TOKEN = process.env.GITHUB_TOKEN || process.env.NOTE_GITHUB_TOKEN
if (!TOKEN) {
  console.error('❌  Set GITHUB_TOKEN or NOTE_GITHUB_TOKEN to read the Note repo.')
  console.error('   Example: GITHUB_TOKEN=ghp_xxx node scripts/sync-three-realms.mjs')
  process.exit(1)
}

const REPO = 'iiooiioo888/Note'
const API = 'https://api.github.com/repos'
const HEADERS = {
  Authorization: `token ${TOKEN}`,
  Accept: 'application/vnd.github.v3+json',
  'User-Agent': 'pysdn-sync',
}

/* ── helpers ───────────────────────────────────────────── */

async function ghJson(path) {
  const url = `${API}/${REPO}/contents/${path}`
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`GitHub API ${res.status} for ${path}: ${body.slice(0, 200)}`)
  }
  return res.json()
}

async function fetchText(path) {
  const data = await ghJson(path)
  if (data.encoding === 'base64') {
    return Buffer.from(data.content, 'base64').toString('utf-8')
  }
  return data.content ?? ''
}

/** Extract first meaningful paragraph (skip heading & blank lines) */
function firstParagraph(md) {
  const lines = md.split('\n')
  let started = false
  const buf = []
  for (const line of lines) {
    const trimmed = line.trim()
    // skip front-matter, headings, badges, hr
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('---') || trimmed.startsWith('![') || trimmed.startsWith('> **'))
      { if (started) break; else continue }
    started = true
    // stop at next heading or blank-after-content
    if (buf.length > 0 && !trimmed) break
    buf.push(trimmed)
    if (buf.join('').length > 280) break
  }
  return buf.join(' ').slice(0, 320)
}

/** Extract bullet items from markdown (first N) */
function extractBullets(md, max = 4) {
  const bullets = []
  for (const line of md.split('\n')) {
    const m = line.match(/^\s*[-*]\s+\*?\*?(.+?)\*?\*?\s*$/)
    if (m) {
      // strip markdown bold/links
      let text = m[1].replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim()
      if (text.length > 120) text = text.slice(0, 117) + '…'
      bullets.push(text)
      if (bullets.length >= max) break
    }
  }
  return bullets
}

/** Try to get a title from the first heading */
function extractTitle(md) {
  const m = md.match(/^#\s+(.+)/m)
  if (m) return m[1].replace(/[#*`]/g, '').trim()
  return null
}

/* ── realm processors ─────────────────────────────────── */

/**
 * 天域: top-level .md files as features (README, guides, roadmap)
 * and Python source files grouped by purpose.
 */
async function processTianyu() {
  const entries = await ghJson('天域')
  const mdFiles = entries.filter(e => e.type === 'file' && e.name.endsWith('.md') && e.name !== '.gitignore')
  const cards = []

  for (const f of mdFiles) {
    const raw = await fetchText(`天域/${f.name}`)
    const title = extractTitle(raw) || f.name.replace('.md', '').replace(/[-_]/g, ' ')
    const summary = firstParagraph(raw)
    const bullets = extractBullets(raw)
    const slug = f.name.replace('.md', '')

    cards.push({
      title,
      summary: summary || `天域文檔：${title}`,
      bullets,
      sourcePath: `天域/${f.name}`,
      sourceUrl: `https://github.com/${REPO}/blob/main/${encodeURIComponent('天域')}/${encodeURIComponent(f.name)}`,
      tags: slug === 'README' ? ['overview'] : slug.toLowerCase().includes('task') ? ['task'] : slug.toLowerCase().includes('road') ? ['roadmap'] : ['guide'],
    })
  }
  return cards
}

/**
 * 神域: ch* directories are modules. Fetch their README or index.
 */
async function processShenyu() {
  const entries = await ghJson('神域')
  const dirs = entries.filter(e => e.type === 'dir' && e.name.startsWith('ch'))
  // also include standalone .md files that aren't README
  const standalone = entries.filter(e => e.type === 'file' && e.name.endsWith('.md') && !['README.md', 'README_old.md'].includes(e.name))
  const cards = []

  for (const d of dirs) {
    const dirEntries = await ghJson(`神域/${encodeURIComponent(d.name)}`).catch(() => null)
    if (!dirEntries || !Array.isArray(dirEntries)) continue

    // find README or index
    const readme = dirEntries.find(e => e.name === 'README.md')
    const index = dirEntries.find(e => e.name.includes('index'))
    const target = readme || index
    if (!target) continue

    const raw = await fetchText(`神域/${encodeURIComponent(d.name)}/${target.name}`)
    const title = extractTitle(raw) || d.name
    const summary = firstParagraph(raw)
    const bullets = extractBullets(raw)

    // extract chapter number for tag
    const chMatch = d.name.match(/^ch(\d+)/)
    const chNum = chMatch ? chMatch[1] : '?'

    cards.push({
      title: title.replace(/^\s*\d+[\.\-]\s*/, ''),
      summary: summary || `神域模組：${title}`,
      bullets,
      sourcePath: `神域/${d.name}/${target.name}`,
      sourceUrl: `https://github.com/${REPO}/blob/main/${encodeURIComponent('神域')}/${encodeURIComponent(d.name)}/${encodeURIComponent(target.name)}`,
      tags: [`ch${chNum}`, 'module'],
    })
  }

  // standalone docs
  for (const f of standalone) {
    const raw = await fetchText(`神域/${encodeURIComponent(f.name)}`)
    const title = extractTitle(raw) || f.name.replace('.md', '')
    const summary = firstParagraph(raw)
    cards.push({
      title,
      summary: summary || `神域文檔：${title}`,
      bullets: extractBullets(raw),
      sourcePath: `神域/${f.name}`,
      sourceUrl: `https://github.com/${REPO}/blob/main/${encodeURIComponent('神域')}/${encodeURIComponent(f.name)}`,
      tags: ['doc'],
    })
  }

  return cards
}

/**
 * 鏡界: subdirectories are modules. Fetch their README.md.
 */
async function processJingjie() {
  const entries = await ghJson('鏡界')
  const dirs = entries.filter(e => e.type === 'dir')
  const standalone = entries.filter(e => e.type === 'file' && e.name.endsWith('.md') && e.name !== 'README.md')
  const cards = []

  for (const d of dirs) {
    const dirEntries = await ghJson(`鏡界/${encodeURIComponent(d.name)}`).catch(() => null)
    if (!dirEntries || !Array.isArray(dirEntries)) continue

    const readme = dirEntries.find(e => e.name === 'README.md')
    const index = dirEntries.find(e => e.name.includes('index') || e.name.includes('概述'))
    const target = readme || index
    if (!target) continue

    const raw = await fetchText(`鏡界/${encodeURIComponent(d.name)}/${target.name}`)
    const title = extractTitle(raw) || d.name
    const summary = firstParagraph(raw)
    const bullets = extractBullets(raw)

    cards.push({
      title: title.replace(/^\s*[\d\.\-]+\s*/, ''),
      summary: summary || `鏡界模組：${title}`,
      bullets,
      sourcePath: `鏡界/${d.name}/${target.name}`,
      sourceUrl: `https://github.com/${REPO}/blob/main/${encodeURIComponent('鏡界')}/${encodeURIComponent(d.name)}/${encodeURIComponent(target.name)}`,
      tags: ['module'],
    })
  }

  // standalone docs (top-level .md files)
  for (const f of standalone) {
    const raw = await fetchText(`鏡界/${encodeURIComponent(f.name)}`)
    const title = extractTitle(raw) || f.name.replace('.md', '')
    const summary = firstParagraph(raw)
    cards.push({
      title,
      summary: summary || `鏡界文檔：${title}`,
      bullets: extractBullets(raw),
      sourcePath: `鏡界/${f.name}`,
      sourceUrl: `https://github.com/${REPO}/blob/main/${encodeURIComponent('鏡界')}/${encodeURIComponent(f.name)}`,
      tags: ['doc'],
    })
  }

  return cards
}

/* ── main ──────────────────────────────────────────────── */

async function main() {
  console.log('⏳ Fetching 天域…')
  const tianyu = await processTianyu()
  console.log(`   ✓ ${tianyu.length} cards`)

  console.log('⏳ Fetching 神域…')
  const shenyu = await processShenyu()
  console.log(`   ✓ ${shenyu.length} cards`)

  console.log('⏳ Fetching 鏡界…')
  const jingjie = await processJingjie()
  console.log(`   ✓ ${jingjie.length} cards`)

  const total = tianyu.length + shenyu.length + jingjie.length

  // build TS output
  const ts = `// Auto-generated by scripts/sync-three-realms.mjs — DO NOT EDIT
// Generated: ${new Date().toISOString()}

export interface RealmFeatureCard {
  title: string
  summary: string
  bullets: string[]
  sourcePath: string
  sourceUrl: string
  tags: string[]
}

export type RealmId = 'tianyu' | 'shenyu' | 'jingjie'

export const REALMS_FEATURES: Record<RealmId, RealmFeatureCard[]> = {
  tianyu: ${JSON.stringify(tianyu, null, 2).replace(/^/gm, '  ').trimStart()},
  shenyu: ${JSON.stringify(shenyu, null, 2).replace(/^/gm, '  ').trimStart()},
  jingjie: ${JSON.stringify(jingjie, null, 2).replace(/^/gm, '  ').trimStart()},
}
`

  mkdirSync(dirname(OUT), { recursive: true })
  writeFileSync(OUT, ts)
  console.log(`\n✅ Wrote ${total} cards → ${OUT.replace(process.cwd() + '/', '')}`)
}

main().catch((err) => {
  console.error('❌ Sync failed:', err.message)
  process.exit(1)
})
