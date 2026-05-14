#!/usr/bin/env node
/**
 * sync-three-realms.mjs
 *
 * 從本專案目錄讀取 Markdown，產生三界靜態資料（不需 GitHub API / token）。
 *
 * 預設來源：frontend_new/content/note-realms/{天域|神域|鏡界}/
 *
 * 選用環境變數：
 * - THREE_REALMS_LOCAL_ROOT — 覆寫來源根目錄（相對於 frontend_new 之子路徑，或絕對路徑）
 * - REALMS_SOURCE_LINK_REPO — 卡片「原始檔」連結用的 GitHub repo（slug 如 owner/name），預設本倉庫
 *
 * 輸出：src/data/threeRealmsFeatures*.ts、public/data/three-realms-jingjie-bodies.json
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = join(ROOT, 'src', 'data', 'threeRealmsFeatures.ts')
const OUT_REALM = {
  tianyu: join(ROOT, 'src', 'data', 'threeRealmsFeatures.tianyu.ts'),
  shenyu: join(ROOT, 'src', 'data', 'threeRealmsFeatures.shenyu.ts'),
  jingjie: join(ROOT, 'src', 'data', 'threeRealmsFeatures.jingjie.ts'),
}
/** 鏡界 Markdown 正文（避免塞進 JS chunk）；由前端於詳情頁載入 */
const OUT_JINGJIE_BODIES_JSON = join(ROOT, 'public', 'data', 'three-realms-jingjie-bodies.json')

/** 用於卡片 sourceUrl →「在 GitHub 上開啟對應檔案」 */
const SOURCE_LINK_REPO = process.env.REALMS_SOURCE_LINK_REPO ?? 'iiooiioo888/pysdn_index'
/** 在該 repo 內相對於 main 分枝的路徑前綴 */
const SOURCE_LINK_PREFIX = 'frontend_new/content/note-realms'

function resolveLocalSourceRoot() {
  const raw = process.env.THREE_REALMS_LOCAL_ROOT?.trim()
  if (!raw) return join(ROOT, 'content', 'note-realms')
  if (isAbsolute(raw)) return resolve(raw)
  return resolve(ROOT, raw)
}

const REALM_FOLDERS = {
  tianyu: '天域',
  shenyu: '神域',
  jingjie: '鏡界',
}

/* helpers */

function encodeRepoPath(path) {
  return path.split('/').map((segment) => encodeURIComponent(segment)).join('/')
}

function sourceUrl(relPath) {
  const norm = relPath.replace(/\\/g, '/')
  const inRepo = `${SOURCE_LINK_PREFIX}/${norm}`
  return `https://github.com/${SOURCE_LINK_REPO}/blob/main/${encodeRepoPath(inRepo)}`
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

function isSkippableMdFileName(fileName) {
  const lower = fileName.toLowerCase()
  return lower === 'readme.md' || lower === 'readme_old.md'
}

/**
 * @param {string} realmTopFolder — e.g. 天域
 * @returns {Promise<string[]>} — relative paths under note-realms, e.g. 天域/foo.md
 */
async function listMarkdownFiles(realmTopFolder) {
  const LOCAL_SOURCE_ROOT = resolveLocalSourceRoot()
  const absRoot = join(LOCAL_SOURCE_ROOT, realmTopFolder)

  if (!existsSync(absRoot)) {
    throw new Error(
      `找不到三界原始資料夾：${absRoot}\n`
        + `請在專案中建立並放入 Markdown：${LOCAL_SOURCE_ROOT}/{天域|神域|鏡界}/\n`
        + `（可將原 Note 倉庫同名目錄複製過來）`,
    )
  }

  const out = []

  function walk(dirAbs, suffixRel) {
    for (const ent of readdirSync(dirAbs, { withFileTypes: true })) {
      if (ent.name.startsWith('.')) continue
      const piece = suffixRel ? `${suffixRel}/${ent.name}` : ent.name
      const full = join(dirAbs, ent.name)
      if (ent.isDirectory()) {
        walk(full, piece)
      } else if (ent.isFile() && ent.name.endsWith('.md') && !isSkippableMdFileName(ent.name)) {
        out.push(`${realmTopFolder}/${piece}`.replace(/\\/g, '/'))
      }
    }
  }

  walk(absRoot, '')
  return out.sort((a, b) => a.localeCompare(b, 'zh-Hant'))
}

async function readSourceText(relPath) {
  const LOCAL_SOURCE_ROOT = resolveLocalSourceRoot()
  const norm = relPath.replace(/\\/g, '/')
  const full = resolve(LOCAL_SOURCE_ROOT, norm)
  const rootResolved = resolve(LOCAL_SOURCE_ROOT)
  const relCheck = relative(rootResolved, full)
  if (!relCheck || relCheck.startsWith('..') || isAbsolute(relCheck)) {
    throw new Error(`非法來源路徑：${relPath}`)
  }
  return readFileSync(full, 'utf8')
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

function inferPathTags(path) {
  const parts = path.split('/')
  const name = parts.at(-1) ?? path
  const tags = new Set(inferDocTags(name))

  for (const part of parts.slice(1, -1)) {
    const match = part.match(/^ch(\d+)/i)
    if (match) tags.add(`ch${match[1]}`)
    if (part === 'data') tags.add('data')
    if (part === 'tasks') tags.add('task')
    if (part === 'knowledge') tags.add('knowledge')
  }

  if (parts.length > 2) tags.add('module')
  return Array.from(tags).slice(0, 4)
}

function featureCard(realmId, card) {
  return {
    realmId,
    slug: card.slug || slugFromSourcePath(card.sourcePath),
    bodyMarkdown: card.bodyMarkdown,
    ...card,
  }
}

function validateCardsOrThrow(realmId, cards) {
  const seenSlug = new Set()
  const errors = []

  for (const card of cards) {
    if (!card.slug || typeof card.slug !== 'string') {
      errors.push(`[${realmId}] missing slug at ${card.sourcePath ?? '(unknown path)'}`)
    } else if (seenSlug.has(card.slug)) {
      errors.push(`[${realmId}] duplicate slug: ${card.slug}`)
    } else {
      seenSlug.add(card.slug)
    }

    if (!card.title || typeof card.title !== 'string') {
      errors.push(`[${realmId}] missing title at slug=${card.slug ?? '(unknown slug)'}`)
    }
    if (!card.summary || typeof card.summary !== 'string') {
      errors.push(`[${realmId}] missing summary at slug=${card.slug ?? '(unknown slug)'}`)
    }
    if (!card.sourcePath || typeof card.sourcePath !== 'string') {
      errors.push(`[${realmId}] missing sourcePath at slug=${card.slug ?? '(unknown slug)'}`)
    }
    if (!card.sourceUrl || typeof card.sourceUrl !== 'string') {
      errors.push(`[${realmId}] missing sourceUrl at slug=${card.slug ?? '(unknown slug)'}`)
    }
    if (!Array.isArray(card.bullets)) {
      errors.push(`[${realmId}] bullets must be array at slug=${card.slug ?? '(unknown slug)'}`)
    }
    if (!Array.isArray(card.tags)) {
      errors.push(`[${realmId}] tags must be array at slug=${card.slug ?? '(unknown slug)'}`)
    }
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed for ${realmId} (${errors.length} issue(s)):\n- ${errors.join('\n- ')}`)
  }
}

/* ----- Tianyu: summaries, thematic tags, grouped interaction logs ----- */

function normalizeForDedupe(text) {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 4000)
}

function interactionUserInputDedupeKey(text) {
  return normalizeForDedupe(text).replace(/^【.*?】/, '').trim()
}

function extractFirstYamlFence(md) {
  const m = md.match(/```yaml\s*\n([\s\S]*?)```/)
  return m ? m[1].trimStart() : ''
}

/** @param {string} yamlFenceBody */
function extractUserInputFromYamlFence(yamlFenceBody) {
  if (!yamlFenceBody) return ''
  let m = yamlFenceBody.match(/user_input:\s*'([\s\S]*?)'\r?\nsolver_output:/)
  if (!m) m = yamlFenceBody.match(/user_input:\s*'([\s\S]*?)'\r?\nverifier_output:/)
  return m ? m[1].replace(/\s+/g, ' ').trim() : ''
}

/** @param {string} yamlFenceBody */
function extractYamlQuotedField(yamlFenceBody, key) {
  const re = new RegExp(`^${key}:\\s*'([^']*)'`, 'm')
  const m = yamlFenceBody.match(re)
  return m ? m[1] : ''
}

/** @param {string} yamlFenceBody */
function extractYamlBareField(yamlFenceBody, key) {
  const m = yamlFenceBody.match(new RegExp(`^${key}:\\s*(.+)$`, 'mi'))
  if (!m) return ''
  return m[1].trim().replace(/^['"]|['"]$/g, '')
}

function inferTianyuTopic(text, sourcePath = '') {
  const combined = `${text}\n${sourcePath}`
  if (/鋁型材|全屋家具|書架|桌子|置物架|型材組裝|DIY製作|組裝示意/.test(combined)) return 'furniture_diy'
  if (/MRP|物料需求|庫存策略|異常處理|分階段實施|監控機制/.test(combined)) return 'mrp_system'
  if (/供應鏈|採購數據|供應商|運輸|EQQ|運輸優化|採購批次/.test(combined)) return 'supply_chain'
  if (/KPI|績效|指標體系/.test(combined)) return 'kpi_metrics'
  if (/風險|合規|衝突|緊急|質量檢查|安全操作/.test(combined)) return 'risk_compliance'
  if (/數據質量|標準化|ABC分類|邊界處理|收集.*計劃/.test(combined)) return 'data_quality'
  return 'general'
}

function extractConclusionQuote(md) {
  const blk = md.match(/##\s*👤\s*用戶需求\s*\n+(>[\s\S]*?)(?=\n##\s+)/u)
  if (!blk) return ''
  return blk[1]
    .split(/\n/)
    .map(line => cleanInlineMarkdown(line.replace(/^>\s?/, '').trim()))
    .filter(Boolean)
    .join(' ')
    .slice(0, 560)
}

function extractManagementSummary(md) {
  const m = md.match(/\*\*摘要:\*\*\s*([^\n]+)/)
  return m ? cleanInlineMarkdown(m[1]).trim() : ''
}

function extractConclusionRequestId(md) {
  const m = md.match(/request_\d+_[a-f0-9]+/i)
  return m ? m[0] : ''
}

function extractWorstPriorityAndStatus(md) {
  /** @type {Set<string>} */
  const statuses = new Set()

  let maxPrio = null
  for (const mm of md.matchAll(/優先級[:：]\s*(\d+)\/(\d+)/g)) {
    const n = Number(mm[1])
    if (maxPrio === null || n > maxPrio) maxPrio = n
  }

  const stHits = [...md.matchAll(/狀態[:：]\s*`?([A-Z_]+)`?/g)].map(x => x[1])
  for (const s of stHits) statuses.add(s)

  /** @type {'high' | 'medium' | 'low' | undefined} */
  let priorityRank
  if (maxPrio != null) {
    if (maxPrio >= 4) priorityRank = 'high'
    else if (maxPrio >= 3) priorityRank = 'medium'
    else priorityRank = 'low'
  }

  /** @type {'pending'|'done'|'mixed'|'unknown'} */
  let statusRank = 'unknown'
  const hasPending = statuses.has('PENDING') || statuses.has('WAITING')
  const hasDone =
    statuses.has('DONE')
    || statuses.has('COMPLETE')
    || statuses.has('COMPLETED')
    || statuses.has('RESOLVED')

  if (hasPending && hasDone) statusRank = 'mixed'
  else if (hasPending) statusRank = 'pending'
  else if (hasDone) statusRank = 'done'

  return { priorityRank, statusRank, maxNumericPriority: maxPrio }
}

function titleFromUserWish(text, max = 76) {
  if (!text) return ''
  const flat = normalizeForDedupe(text)
  const sansPatch = flat.split(/【修正要求】/)[0]?.trim() || flat
  const clause = sansPatch.split(/。|！|[.!?]\s+/)[0]?.trim() || sansPatch
  let t = clause.trim()
    .replace(/^我想/, '')
    .replace(/^請/, '')
    .replace(/^幫我/, '')
  if (t.length > max) t = `${t.slice(0, max - 1)}…`
  if (t.length < 10) {
    let u = normalizeForDedupe(text)
    if (u.length > max) u = `${u.slice(0, max - 1)}…`
    return u
  }
  return t
}

function looksLikeGarbageSummary(text) {
  if (!text || text.trim().length < 8) return true
  const compact = text.replace(/\s+/g, ' ')
  if (/\\\"|,\s*"due"|"due":|'due':|"assignee"|\\{/.test(compact)) return true
  if (/^\s*[`[{]/.test(text)) return true
  return false
}

function buildCardSummary(primary, fallbackMd) {
  let s = normalizeForDedupe(primary)
  if (looksLikeGarbageSummary(s)) {
    const para = cleanInlineMarkdown(firstParagraph(fallbackMd) || '').trim()
    s = normalizeForDedupe(para)
  }
  const guard = /\{|"due"|'due'/.exec(s)
  if (guard && guard.index !== undefined && guard.index > 42) {
    s = s.slice(0, guard.index).trim()
  }
  if (s.length > 320) s = `${s.slice(0, 317)}…`
  return s || '—'
}

/**
 * Interaction logs: collapse entries that share equivalent user prompts.
 */
async function processTianyu() {
  const folder = REALM_FOLDERS.tianyu
  const mdFiles = await listMarkdownFiles(folder)
  /** @type Record<string, { path: string, raw: string, name: string, createdAt: string, istatus: string, slug: string, userResolved: string }[]> */
  const interactionBuckets = {}
  /** @type ReturnType<typeof featureCard>[] */
  const outCards = []

  for (const path of mdFiles) {
    const kind = classifyTianyuPath(path)
    const raw = await readSourceText(path)
    const name = path.split('/').at(-1) ?? path

    if (kind === 'interaction') {
      const yamlBody = extractFirstYamlFence(raw)
      let utext = extractUserInputFromYamlFence(yamlBody)
      if (!utext) {
        const uh = raw.match(/###\s*👤\s*用戶輸入\s*\n+>([\s\S]*?)(?=\n#{2,5}\s|\n###\s|$)/u)
        utext = uh?.[1] ? uh[1].replace(/^>\s?/gm, '').replace(/\s+/g, ' ').trim() : ''
      }
      const userResolvedNorm = interactionUserInputDedupeKey(utext || '')
      const createdAt =
        extractYamlQuotedField(yamlBody, 'created_at')
        || extractYamlBareField(yamlBody, 'created_at')
      const istatus = extractYamlBareField(yamlBody, 'status')
      const groupKey =
        `${hashString(userResolvedNorm.slice(2000))}-u${Math.min(userResolvedNorm.length, 999)}`
      interactionBuckets[groupKey] ??= []
      interactionBuckets[groupKey].push({
        path,
        raw,
        name,
        createdAt,
        istatus,
        slug: slugFromSourcePath(path),
        userResolved: utext ? normalizeForDedupe(utext) : '',
      })
      continue
    }

    const topic = inferTianyuTopic(raw, path)
    let title = extractTitle(raw) || mdTitleFromName(name)
    let summarySeed = ''

    const meta = {}

    if (kind === 'conclusion') {
      const quote = extractConclusionQuote(raw)
      const mgmt = extractManagementSummary(raw)
      const wishTitle = titleFromUserWish(quote || mgmt || '')
      title =
        wishTitle || (mgmt ? mgmt.slice(0, 48) : '').trim() || title.replace(/^📋\s*/, '')
      summarySeed = quote || mgmt || firstParagraph(raw)
      meta.requestCanonicalId = extractConclusionRequestId(raw) || ''
      meta.tianyuKind = 'conclusion'
      const pr = extractWorstPriorityAndStatus(raw)
      meta.priorityRank = pr.priorityRank
      meta.statusRank = pr.statusRank
      meta.maxNumericPriority = pr.maxNumericPriority ?? undefined
    }
    else if (kind === 'task') {
      summarySeed = firstParagraph(raw)
      meta.tianyuKind = 'task'
      meta.priorityRank = 'medium'
      meta.statusRank = 'pending'
    }
    else if (kind === 'knowledge') {
      summarySeed = firstParagraph(raw)
      meta.tianyuKind = 'knowledge'
    }
    else {
      meta.tianyuKind = 'doc'
      summarySeed = firstParagraph(raw)
    }

    const summary = buildCardSummary(summarySeed, raw)
    const bullets = extractBullets(raw)
    meta.topicCluster = topic
    const semanticTags = semanticTianyuTags(topic, raw)
    meta.tags = semanticTags

    const cardPayload = {
      title,
      summary,
      bullets,
      bodyMarkdown: raw,
      sourcePath: path,
      sourceUrl: sourceUrl(path),
      tags: semanticTags,
      ...meta,
    }

    outCards.push(featureCard('tianyu', cardPayload))
  }

  for (const group of Object.values(interactionBuckets)) {
    const sorted = [...group].sort((a, b) =>
      `${a.createdAt}`.localeCompare(`${b.createdAt}`, 'en'),
    )

    /** De-dupe same file path accidental double add */
    const seenPath = new Set()
    const unique = sorted.filter((g) =>
      seenPath.has(g.path) ? false : (seenPath.add(g.path), true),
    )

    const repLast = unique[unique.length - 1]
    const userWishText = normalizeForDedupe(unique[0].userResolved || repLast.userResolved)
    const slugEntropy = `${userWishText}\n${unique.map((x) => x.path).sort().join('\n')}`
    const slug = `interaction-group-${hashString(slugEntropy)}`

    const iterationItems = unique.map((g, i) => ({
      ordinal: i + 1,
      sourceSlug: g.slug,
      sourcePath: g.path,
      sourceUrl: sourceUrl(g.path),
      createdAt: g.createdAt || undefined,
      statusHint: g.istatus || undefined,
    }))

    const topic = inferTianyuTopic(repLast.raw, repLast.path)
    const title =
      titleFromUserWish(userWishText.slice(0, 1200))
      || `交互紀錄 ${repLast.name.replace(/\.md$/i, '').slice(0, 56)}`

    const combinedMd = `# 💬 交互紀錄（已合併 ${unique.length} 輪）

${formatMergedInteractionGroup(unique, userWishText)}`

    const summary = buildCardSummary(normalizeForDedupe(userWishText.split('【')[0] || userWishText), repLast.raw)

    const latestStatusRaw = [...unique].reverse().find((x) => x.istatus)?.istatus ?? ''
    /** @type {'pending'|'done'|'mixed'|'unknown'} */
    let statusRank = 'unknown'
    const ls = `${latestStatusRaw}`.toLowerCase()
    if (ls.includes('complete') || ls.includes('done') || ls === 'resolved') statusRank = 'done'
    else if (ls.includes('pending')) statusRank = 'pending'

    outCards.push(
      featureCard('tianyu', {
        slug,
        title,
        summary,
        bullets: extractBullets(repLast.raw).length
          ? extractBullets(repLast.raw)
          : [userWishText.slice(0, 180)],
        bodyMarkdown: combinedMd,
        sourcePath: repLast.path,
        sourceUrl: sourceUrl(repLast.path),
        tags: semanticTianyuTags(topic, repLast.raw),
        topicCluster: topic,
        requestCanonicalId: extractConclusionRequestId(repLast.raw) || '',
        interactionIterations:
          iterationItems.length > 0 ? iterationItems : undefined,
        iterationCount: unique.length,
        tianyuKind: 'interaction',
        priorityRank: inferPriorityFromInteractions(unique),
        statusRank,
        maxNumericPriority: inferMaxPriorityFromInteractions(repLast.raw),
      }),
    )
  }

  const kindOrder = { conclusion: 0, interaction: 1, task: 2, knowledge: 3, doc: 4 }
  outCards.sort((a, b) => {
    const ka = kindOrder[a.tianyuKind] ?? 9
    const kb = kindOrder[b.tianyuKind] ?? 9
    if (ka !== kb) return ka - kb
    return `${a.sourcePath}`.localeCompare(`${b.sourcePath}`, 'zh-Hant')
  })

  return outCards
}

/** @returns {'conclusion'|'interaction'|'task'|'knowledge'|'doc'} */
function classifyTianyuPath(path) {
  if (path.includes('/data/conclusions/')) return 'conclusion'
  if (path.includes('/data/interactions/')) return 'interaction'
  if (path.includes('/data/tasks/')) return 'task'
  if (path.includes('/data/knowledge/')) return 'knowledge'
  return 'doc'
}

/** @returns {string[]} */
function semanticTianyuTags(topicId, md) {
  const tags = new Set()
  const labelMap = {
    furniture_diy: '家具',
    supply_chain: '供應鏈',
    mrp_system: 'MRP',
    kpi_metrics: 'KPI',
    risk_compliance: '風險管控',
    data_quality: '數據品質',
    general: '綜合',
  }
  tags.add(labelMap[topicId] ?? '綜合')

  /** extra detectors */
  const t = `${md}`
  if (/ABC|分類/.test(t)) tags.add('ABC分類')
  if (/缓冲|緩衝/.test(t)) tags.add('緩衝期')
  if (/採購/.test(t)) tags.add('採購')
  return [...tags].slice(0, 5)
}

function inferPriorityFromInteractions(iterGroup) {
  let maxFound = null
  for (const g of iterGroup) {
    const pr = extractWorstPriorityAndStatus(g.raw)
    const n = pr.maxNumericPriority
    if (n != null && (maxFound === null || n > maxFound)) maxFound = n
  }
  if (maxFound == null) return 'medium'
  if (maxFound >= 4) return 'high'
  if (maxFound >= 3) return 'medium'
  return 'low'
}

/**
 * Parse a JSON string safely, returning null on failure.
 */
function safeParseJson(str) {
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}

/**
 * Extract JSON blocks from markdown (fenced or bare).
 */
function extractJsonBlocks(md) {
  const blocks = []
  // fenced JSON blocks
  for (const m of md.matchAll(/```json\s*\n([\s\S]*?)```/g)) {
    const parsed = safeParseJson(m[1].trim())
    if (parsed) blocks.push(parsed)
  }
  // bare JSON objects/arrays at line start
  for (const m of md.matchAll(/^(?:\{[\s\S]*?\}|\[[\s\S]*?\])\s*$/gm)) {
    const parsed = safeParseJson(m[0].trim())
    if (parsed) blocks.push(parsed)
  }
  return blocks
}

/**
 * Format a single interaction round as clean markdown.
 * Extracts human-readable content from YAML fences and JSON blobs.
 */
function formatInteractionAsCleanMarkdown(interactionRaw, roundLabel) {
  const lines = []
  const yamlBody = extractFirstYamlFence(interactionRaw)

  // 1. Extract user_input from YAML
  const userInput = extractUserInputFromYamlFence(yamlBody)
  if (userInput) {
    lines.push(`> ${userInput}`)
    lines.push('')
  }

  // 2. Extract status from YAML
  const status = extractYamlBareField(yamlBody, 'status')
  if (status) {
    lines.push(`**狀態：** \`${status}\``)
    lines.push('')
  }

  // 3. Extract and format JSON blocks
  const jsonBlocks = extractJsonBlocks(interactionRaw)

  for (const block of jsonBlocks) {
    // Solver plan
    if (block && typeof block === 'object') {
      const plan = block.plan || block.solver_plan || block.plan_text
      if (plan && typeof plan === 'string') {
        lines.push('### 求解方案')
        lines.push('')
        lines.push(plan.trim())
        lines.push('')
      }

      // Solver actions
      const actions = block.actions || block.solver_actions
      if (Array.isArray(actions) && actions.length > 0) {
        lines.push('### 執行動作')
        lines.push('')
        for (const action of actions) {
          if (typeof action === 'string') {
            lines.push(`- ${action}`)
          } else if (action && typeof action === 'object') {
            const desc = action.description || action.desc || action.action || action.name || ''
            const status = action.status || action.result || ''
            if (desc) {
              lines.push(`- ${desc}${status ? `（${status}）` : ''}`)
            }
          }
        }
        lines.push('')
      }

      // Verifier issues
      const issues = block.issues || block.verifier_issues || block.problems
      if (Array.isArray(issues) && issues.length > 0) {
        lines.push('### 驗證問題')
        lines.push('')
        for (const issue of issues) {
          if (typeof issue === 'string') {
            lines.push(`- ${issue}`)
          } else if (issue && typeof issue === 'object') {
            const desc = issue.description || issue.desc || issue.message || issue.issue || ''
            const sev = issue.severity || issue.level || ''
            const sevIcon = sev === 'high' || sev === 'critical' ? '🔴' : sev === 'medium' || sev === 'warning' ? '🟡' : '🔵'
            if (desc) {
              lines.push(`- ${sevIcon} ${desc}`)
            }
          }
        }
        lines.push('')
      }

      // New knowledge items
      const knowledge = block.new_knowledge || block.knowledge || block.knowledge_items
      if (Array.isArray(knowledge) && knowledge.length > 0) {
        lines.push('### 新增知識')
        lines.push('')
        for (const item of knowledge) {
          if (typeof item === 'string') {
            lines.push(`- ${item}`)
          } else if (item && typeof item === 'object') {
            const topic = item.topic || item.title || item.name || ''
            const content = item.content || item.summary || item.description || ''
            if (topic || content) {
              lines.push(`- **${topic}**${content ? `：${content}` : ''}`)
            }
          }
        }
        lines.push('')
      }

      // Verification result / summary
      const result = block.result || block.verification_result || block.summary || block.verdict
      if (result && typeof result === 'string') {
        lines.push('### 驗證結果')
        lines.push('')
        lines.push(result.trim())
        lines.push('')
      }
    }
  }

  // 4. Extract any remaining meaningful headings from the raw markdown
  // (skip YAML/JSON, look for ### headings with real content)
  const headingMatches = interactionRaw.matchAll(/^###\s+(.+)$/gm)
  for (const hm of headingMatches) {
    const headingText = hm[1].trim()
    // Skip headings we already processed
    if (/求解方案|執行動作|驗證問題|新增知識|驗證結果/.test(headingText)) continue
    // Find content after this heading until next heading or end
    const headingIdx = interactionRaw.indexOf(hm[0])
    const afterHeading = interactionRaw.slice(headingIdx + hm[0].length)
    const nextHeadingMatch = afterHeading.match(/\n#{1,4}\s/)
    const sectionContent = nextHeadingMatch
      ? afterHeading.slice(0, nextHeadingMatch.index)
      : afterHeading.slice(0, 500)

    const cleanContent = sectionContent
      .replace(/```[\s\S]*?```/g, '') // remove code blocks
      .replace(/^\s*[-*]\s+/gm, '- ') // normalize bullets
      .split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('{') && !l.startsWith('[') && !l.startsWith('```'))
      .join('\n')
      .trim()

    if (cleanContent && cleanContent.length > 10) {
      lines.push(`### ${headingText}`)
      lines.push('')
      lines.push(cleanContent.slice(0, 600))
      lines.push('')
    }
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

/**
 * Format a merged interaction group as clean markdown.
 */
function formatMergedInteractionGroup(unique, userWishText) {
  const parts = []

  parts.push(`> ${userWishText}`)
  parts.push('')

  for (let i = 0; i < unique.length; i++) {
    const g = unique[i]
    parts.push(`## 輪次 ${i + 1}/${unique.length}`)
    parts.push('')
    parts.push(`_${g.path}_ · ${g.createdAt || '—'}_`)
    parts.push('')

    const cleanMd = formatInteractionAsCleanMarkdown(g.raw, `輪次 ${i + 1}`)
    if (cleanMd) {
      parts.push(cleanMd)
    } else {
      parts.push('（無內容摘要）')
    }

    if (i < unique.length - 1) {
      parts.push('')
      parts.push('---')
      parts.push('')
    }
  }

  return parts.join('\n')
}

function inferMaxPriorityFromInteractions(md) {
  const pr = extractWorstPriorityAndStatus(md)
  return pr.maxNumericPriority ?? undefined
}

/* realm processors */

async function processRealmMarkdownFiles(realmId, folder, fallbackLabel) {
  const mdFiles = await listMarkdownFiles(folder)
  const cards = []

  for (const path of mdFiles) {
    const raw = await readSourceText(path)
    const name = path.split('/').at(-1) ?? path
    const title = extractTitle(raw) || mdTitleFromName(name)
    const summary = firstParagraph(raw)
    const bullets = extractBullets(raw)

    cards.push(featureCard(realmId, {
      title,
      summary: summary || `${fallbackLabel}文檔：${title}`,
      bullets,
      bodyMarkdown: raw,
      sourcePath: path,
      sourceUrl: sourceUrl(path),
      tags: inferPathTags(path),
    }))
  }

  return cards
}

async function processShenyu() {
  return processRealmMarkdownFiles('shenyu', REALM_FOLDERS.shenyu, '神域')
}

async function processJingjie() {
  return processRealmMarkdownFiles('jingjie', REALM_FOLDERS.jingjie, '鏡界')
}

/* main */

async function main() {
  const srcRoot = resolveLocalSourceRoot()
  console.log(`Using local Markdown source: ${srcRoot}`)
  console.log(`  Source URLs: github.com/${SOURCE_LINK_REPO}/blob/main/${SOURCE_LINK_PREFIX}/…`)

  console.log('Scanning 天域...')
  const tianyu = await processTianyu()
  validateCardsOrThrow('tianyu', tianyu)
  console.log(`   ${tianyu.length} cards`)

  console.log('Scanning 神域...')
  const shenyu = await processShenyu()
  validateCardsOrThrow('shenyu', shenyu)
  console.log(`   ${shenyu.length} cards`)

  console.log('Scanning 鏡界...')
  const jingjie = await processJingjie()
  validateCardsOrThrow('jingjie', jingjie)
  console.log(`   ${jingjie.length} cards`)

  const total = tianyu.length + shenyu.length + jingjie.length

  const typeHeader = `// Auto-generated by scripts/sync-three-realms.mjs — DO NOT EDIT
// Generated: ${new Date().toISOString()}

export type TianyuCardKind =
  | 'conclusion'
  | 'interaction'
  | 'task'
  | 'knowledge'
  | 'doc'

export type TianyuPriorityRank = 'high' | 'medium' | 'low'

export type TianyuStatusRank = 'pending' | 'done' | 'mixed' | 'unknown'

export type TianyuTopicClusterId =
  | 'furniture_diy'
  | 'supply_chain'
  | 'mrp_system'
  | 'kpi_metrics'
  | 'risk_compliance'
  | 'data_quality'
  | 'general'

export interface RealmInteractionIteration {
  ordinal: number
  sourceSlug: string
  sourcePath: string
  sourceUrl: string
  createdAt?: string
  statusHint?: string
}

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
  tianyuKind?: TianyuCardKind
  topicCluster?: TianyuTopicClusterId
  requestCanonicalId?: string
  interactionIterations?: RealmInteractionIteration[]
  iterationCount?: number
  priorityRank?: TianyuPriorityRank
  statusRank?: TianyuStatusRank
  maxNumericPriority?: number
}

export type RealmId = 'tianyu' | 'shenyu' | 'jingjie'
`
  const indexTs = `${typeHeader}
export const REALMS_FEATURE_COUNTS: Record<RealmId, number> = {
  tianyu: ${tianyu.length},
  shenyu: ${shenyu.length},
  jingjie: ${jingjie.length},
}
`

  mkdirSync(dirname(OUT), { recursive: true })
  writeFileSync(OUT, indexTs)

  const realmOutputs = [
    ['tianyu', tianyu],
    ['shenyu', shenyu],
    ['jingjie', jingjie],
  ]

  for (const [realmId, cards] of realmOutputs) {
    const constName = `REALM_FEATURES_${realmId.toUpperCase()}`
    let persistCards = cards

    if (realmId === 'jingjie') {
      const bodies = {}
      for (const c of cards) {
        bodies[c.slug] = c.bodyMarkdown ?? ''
      }
      mkdirSync(dirname(OUT_JINGJIE_BODIES_JSON), { recursive: true })
      writeFileSync(OUT_JINGJIE_BODIES_JSON, `${JSON.stringify(bodies)}\n`)

      persistCards = cards.map(({ bodyMarkdown: _body, ...rest }) => ({
        ...rest,
        bodyMarkdown: '',
      }))
    }

    const moduleTs = `// Auto-generated by scripts/sync-three-realms.mjs — DO NOT EDIT
// Generated: ${new Date().toISOString()}

import type { RealmFeatureCard } from './threeRealmsFeatures'

export const ${constName}: RealmFeatureCard[] = ${JSON.stringify(persistCards, null, 2)}
`
    writeFileSync(OUT_REALM[realmId], moduleTs)
  }

  console.log(`\nWrote ${total} cards -> ${OUT.replace(`${process.cwd()}/`, '')} + realm data modules`)
  console.log(`Jingjie bodies JSON -> ${OUT_JINGJIE_BODIES_JSON.replace(`${process.cwd()}/`, '')}`)
}

main().catch((err) => {
  console.error('Sync failed:', err.message)
  console.error(`Local source root hint: ${join(ROOT, 'content', 'note-realms')}`)
  process.exit(1)
})
