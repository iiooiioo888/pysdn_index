#!/usr/bin/env node
/**
 * sync-three-realms.mjs
 *
 * Generates static Three Realms feature-card data from the Note repository.
 *
 * Sources, in priority order:
 * 1. NOTE_REALMS_SOURCE_DIR=/path/to/Note local clone
 * 2. GitHub API with GITHUB_TOKEN or NOTE_GITHUB_TOKEN
 *
 * Output: src/data/threeRealmsFeatures.ts
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = join(ROOT, 'src', 'data', 'threeRealmsFeatures.ts')

const TOKEN = process.env.GITHUB_TOKEN || process.env.NOTE_GITHUB_TOKEN
const LOCAL_SOURCE = process.env.NOTE_REALMS_SOURCE_DIR

const REPO = 'iiooiioo888/Note'
const API = 'https://api.github.com/repos'
const REALM_FOLDERS = {
  tianyu: '天域',
  shenyu: '神域',
  jingjie: '鏡界',
}
const HEADERS = TOKEN ? {
  Authorization: `Bearer ${TOKEN}`,
  Accept: 'application/vnd.github.v3+json',
  'User-Agent': 'pysdn-sync',
} : undefined

/* helpers */

function encodeRepoPath(path) {
  return path.split('/').map((segment) => encodeURIComponent(segment)).join('/')
}

function sourceUrl(path) {
  return `https://github.com/${REPO}/blob/main/${encodeRepoPath(path)}`
}

function sourceTreeUrl(path) {
  return `https://github.com/${REPO}/tree/main/${encodeRepoPath(path)}`
}

function hashString(input) {
  let hash = 5381
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 33) ^ input.charCodeAt(i)
  }
  return (hash >>> 0).toString(36)
}

function slugFromSourcePath(sourcePath) {
  const withoutExt = sourcePath.replace(/\.[^.]+$/, '')
  const ascii = withoutExt
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72)

  return `${ascii || 'feature'}-${hashString(sourcePath).slice(0, 6)}`
}

function localPath(path) {
  return join(LOCAL_SOURCE, ...path.split('/'))
}

async function listEntries(path) {
  if (LOCAL_SOURCE) {
    const dir = localPath(path)
    if (!existsSync(dir)) {
      throw new Error(`Local source path not found: ${dir}`)
    }

    return readdirSync(dir, { withFileTypes: true })
      .map((entry) => ({
        name: entry.name,
        type: entry.isDirectory() ? 'dir' : 'file',
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'))
  }

  const data = await ghJson(path)
  if (!Array.isArray(data)) {
    throw new Error(`Expected directory listing for ${path}`)
  }
  return data
}

async function readSourceText(path) {
  if (LOCAL_SOURCE) {
    return readFileSync(localPath(path), 'utf8')
  }
  return fetchText(path)
}

async function ghJson(path) {
  if (!TOKEN) {
    throw new Error(
      'Set NOTE_REALMS_SOURCE_DIR to a local Note clone, or set GITHUB_TOKEN/NOTE_GITHUB_TOKEN for GitHub API access.',
    )
  }

  const url = `${API}/${REPO}/contents/${encodeRepoPath(path)}`
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

function cleanInlineMarkdown(text) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function isNoiseLine(line) {
  return (
    !line ||
    line.startsWith('#') ||
    line.startsWith('---') ||
    line.startsWith('```') ||
    line.startsWith('![') ||
    line.startsWith('|') ||
    line.startsWith('> **') ||
    line === '[返回](../README.md)'
  )
}

/** Extract first meaningful paragraph, skipping headings, tables, badges and code blocks. */
function firstParagraph(md) {
  const lines = md.split('\n')
  let started = false
  let inCode = false
  const buf = []

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith('```')) {
      inCode = !inCode
      if (started) break
      continue
    }
    if (inCode) continue
    if (isNoiseLine(trimmed)) {
      if (started) break
      continue
    }

    started = true
    buf.push(cleanInlineMarkdown(trimmed))
    if (buf.join(' ').length > 280) break
  }

  return buf.join(' ').slice(0, 320)
}

/** Extract bullet items from markdown (first N) */
function extractBullets(md, max = 4) {
  const bullets = []
  for (const line of md.split('\n')) {
    const m = line.match(/^\s*(?:[-*]|\d+\.)\s+(?:\[[ x]\]\s*)?(.+?)\s*$/i)
    if (m) {
      let text = cleanInlineMarkdown(m[1])
      if (!text || text.startsWith('http')) continue
      if (text.length > 120) text = `${text.slice(0, 117)}...`
      bullets.push(text)
      if (bullets.length >= max) break
    }
  }
  return bullets
}

/** Try to get a title from the first heading */
function extractTitle(md) {
  const m = md.match(/^#\s+(.+)/m)
  if (m) return cleanInlineMarkdown(m[1].replace(/#/g, ''))
  return null
}

function mdTitleFromName(name) {
  return name.replace(/\.md$/i, '').replace(/[-_]/g, ' ')
}

function inferDocTags(name) {
  const slug = name.replace(/\.md$/i, '').toLowerCase()
  if (slug === 'readme') return ['overview']
  if (slug.includes('task')) return ['task']
  if (slug.includes('road')) return ['roadmap']
  if (slug.includes('guide')) return ['guide']
  return ['doc']
}

function featureCard(realmId, card) {
  return {
    realmId,
    slug: slugFromSourcePath(card.sourcePath),
    bodyMarkdown: card.bodyMarkdown,
    ...card,
  }
}

/* realm processors */

/**
 * 天域: top-level .md files as features (README, guides, roadmap)
 * and Python source files grouped by purpose.
 */
async function processTianyu() {
  const folder = REALM_FOLDERS.tianyu
  const entries = await listEntries(folder)
  const mdFiles = entries.filter(e => e.type === 'file' && e.name.endsWith('.md') && e.name !== '.gitignore')
  const cards = []

  for (const f of mdFiles) {
    const path = `${folder}/${f.name}`
    const raw = await readSourceText(path)
    const title = extractTitle(raw) || mdTitleFromName(f.name)
    const summary = firstParagraph(raw)
    const bullets = extractBullets(raw)

    cards.push(featureCard('tianyu', {
      title,
      summary: summary || `天域文檔：${title}`,
      bullets,
      bodyMarkdown: raw,
      sourcePath: path,
      sourceUrl: sourceUrl(path),
      tags: inferDocTags(f.name),
    }))
  }
  return cards
}

/**
 * 神域: ch* directories are modules. Fetch their README or index.
 */
async function processShenyu() {
  const folder = REALM_FOLDERS.shenyu
  const entries = await listEntries(folder)
  const dirs = entries.filter(e => e.type === 'dir' && e.name.startsWith('ch'))
  // also include standalone .md files that aren't README
  const standalone = entries.filter(e => e.type === 'file' && e.name.endsWith('.md') && !['README.md', 'README_old.md'].includes(e.name))
  const cards = []

  for (const d of dirs) {
    const dirPath = `${folder}/${d.name}`
    const dirEntries = await listEntries(dirPath).catch(() => null)
    if (!dirEntries || !Array.isArray(dirEntries)) continue

    // find README or index
    const readme = dirEntries.find(e => e.name === 'README.md')
    const index = dirEntries.find(e => e.name.includes('index'))
    const target = readme || index
    if (!target) continue

    const path = `${dirPath}/${target.name}`
    const raw = await readSourceText(path)
    const title = extractTitle(raw) || d.name
    const summary = firstParagraph(raw)
    const bullets = extractBullets(raw)

    // extract chapter number for tag
    const chMatch = d.name.match(/^ch(\d+)/)
    const chNum = chMatch ? chMatch[1] : '?'

    cards.push(featureCard('shenyu', {
      title: title.replace(/^\s*\d+[\.\-]\s*/, ''),
      summary: summary || `神域模組：${title}`,
      bullets,
      bodyMarkdown: raw,
      sourcePath: path,
      sourceUrl: sourceUrl(path),
      tags: [`ch${chNum}`, 'module'],
    }))
  }

  // standalone docs
  for (const f of standalone) {
    const path = `${folder}/${f.name}`
    const raw = await readSourceText(path)
    const title = extractTitle(raw) || mdTitleFromName(f.name)
    const summary = firstParagraph(raw)
    cards.push(featureCard('shenyu', {
      title,
      summary: summary || `神域文檔：${title}`,
      bullets: extractBullets(raw),
      bodyMarkdown: raw,
      sourcePath: path,
      sourceUrl: sourceUrl(path),
      tags: inferDocTags(f.name),
    }))
  }

  return cards
}

/**
 * 鏡界: subdirectories are modules. Fetch their README.md.
 */
async function processJingjie() {
  const folder = REALM_FOLDERS.jingjie
  const entries = await listEntries(folder)
  const dirs = entries.filter(e => e.type === 'dir')
  const standalone = entries.filter(e => e.type === 'file' && e.name.endsWith('.md') && e.name !== 'README.md')
  const cards = []

  for (const d of dirs) {
    const dirPath = `${folder}/${d.name}`
    const dirEntries = await listEntries(dirPath).catch(() => null)
    if (!dirEntries || !Array.isArray(dirEntries)) continue

    const readme = dirEntries.find(e => e.name === 'README.md')
    const index = dirEntries.find(e => e.name.includes('index') || e.name.includes('概述'))
    const target = readme || index
    if (!target) continue

    const path = `${dirPath}/${target.name}`
    const raw = await readSourceText(path)
    const title = extractTitle(raw) || d.name
    const summary = firstParagraph(raw)
    const bullets = extractBullets(raw)

    cards.push(featureCard('jingjie', {
      title: title.replace(/^\s*[\d\.\-]+\s*/, ''),
      summary: summary || `鏡界模組：${title}`,
      bullets,
      bodyMarkdown: raw,
      sourcePath: path,
      sourceUrl: sourceUrl(path),
      tags: ['module'],
    }))
  }

  // standalone docs (top-level .md files)
  for (const f of standalone) {
    const path = `${folder}/${f.name}`
    const raw = await readSourceText(path)
    const title = extractTitle(raw) || mdTitleFromName(f.name)
    const summary = firstParagraph(raw)
    cards.push(featureCard('jingjie', {
      title,
      summary: summary || `鏡界文檔：${title}`,
      bullets: extractBullets(raw),
      bodyMarkdown: raw,
      sourcePath: path,
      sourceUrl: sourceUrl(path),
      tags: inferDocTags(f.name),
    }))
  }

  return cards
}

/* main */

async function main() {
  if (LOCAL_SOURCE) {
    console.log(`Using local Note source: ${LOCAL_SOURCE}`)
  } else if (TOKEN) {
    console.log(`Using GitHub API source: ${REPO}`)
  } else {
    throw new Error(
      'Set NOTE_REALMS_SOURCE_DIR to a local Note clone, or set GITHUB_TOKEN/NOTE_GITHUB_TOKEN for GitHub API access.',
    )
  }

  console.log('Fetching 天域...')
  const tianyu = await processTianyu()
  console.log(`   ${tianyu.length} cards`)

  console.log('Fetching 神域...')
  const shenyu = await processShenyu()
  console.log(`   ${shenyu.length} cards`)

  console.log('Fetching 鏡界...')
  const jingjie = await processJingjie()
  console.log(`   ${jingjie.length} cards`)

  const total = tianyu.length + shenyu.length + jingjie.length

  // build TS output
  const ts = `// Auto-generated by scripts/sync-three-realms.mjs — DO NOT EDIT
// Generated: ${new Date().toISOString()}

export interface RealmFeatureCard {
  realmId: RealmId
  slug: string
  title: string
  summary: string
  bullets: string[]
  bodyMarkdown: string
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
  console.log(`\nWrote ${total} cards -> ${OUT.replace(`${process.cwd()}/`, '')}`)
}

main().catch((err) => {
  console.error('Sync failed:', err.message)
  console.error(`GitHub source: ${sourceTreeUrl('天域')}`)
  process.exit(1)
})
