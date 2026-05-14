#!/usr/bin/env node
/**
 * validate-three-realms.mjs
 *
 * Validates generated Three Realms data modules:
 * - Required fields
 * - Slug uniqueness (per realm + global)
 * - Count consistency with threeRealmsFeatures.ts
 * - Source URL/path consistency
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DATA_DIR = join(ROOT, 'src', 'data')

const FILES = {
  index: join(DATA_DIR, 'threeRealmsFeatures.ts'),
  tianyu: join(DATA_DIR, 'threeRealmsFeatures.tianyu.ts'),
  shenyu: join(DATA_DIR, 'threeRealmsFeatures.shenyu.ts'),
  jingjie: join(DATA_DIR, 'threeRealmsFeatures.jingjie.ts'),
  jingjieBodies: join(ROOT, 'public', 'data', 'three-realms-jingjie-bodies.json'),
}

const SOURCE_LINK_REPO = process.env.REALMS_SOURCE_LINK_REPO ?? 'iiooiioo888/pysdn_index'
/** 須與 sync-three-realms.mjs 內 SOURCE_LINK_PREFIX 一致 */
const SOURCE_LINK_PREFIX = 'frontend_new/content/note-realms'

function parseCounts(indexSource) {
  const block = indexSource.match(/REALMS_FEATURE_COUNTS:[\s\S]*?=\s*\{([\s\S]*?)\}/)
  if (!block) {
    throw new Error('Cannot parse REALMS_FEATURE_COUNTS from threeRealmsFeatures.ts')
  }

  const parseOne = (realmId) => {
    const m = block[1].match(new RegExp(`${realmId}:\\s*(\\d+)`))
    if (!m) throw new Error(`Missing count for realm: ${realmId}`)
    return Number(m[1])
  }

  return {
    tianyu: parseOne('tianyu'),
    shenyu: parseOne('shenyu'),
    jingjie: parseOne('jingjie'),
  }
}

function parseCards(tsSource, constName) {
  const m = tsSource.match(new RegExp(`export const ${constName}: RealmFeatureCard\\[] = ([\\s\\S]*)$`))
  if (!m) {
    throw new Error(`Cannot parse cards array from ${constName}`)
  }
  const json = m[1].trim()
  return JSON.parse(json)
}

function encodeRepoPath(path) {
  return path.split('/').map((segment) => encodeURIComponent(segment)).join('/')
}

function expectedSourceUrl(sourcePath) {
  const norm = `${sourcePath}`.replace(/\\/g, '/')
  const inRepo = `${SOURCE_LINK_PREFIX}/${norm}`
  return `https://github.com/${SOURCE_LINK_REPO}/blob/main/${encodeRepoPath(inRepo)}`
}

/** 舊版由遠端 Note 倉庫產生之連結；未重跑同步前資料檔仍可通過驗證 */
function matchesLegacyUpstreamSourceUrl(sourcePath, sourceUrl) {
  const legacyRepo = process.env.THREE_REALMS_LEGACY_LINK_REPO ?? 'iiooiioo888/Note'
  const legacyPrefix = `https://github.com/${legacyRepo}/blob/main/`
  return sourceUrl === `${legacyPrefix}${encodeRepoPath(`${sourcePath}`.replace(/\\/g, '/'))}`
}

function validateRealm(realmId, cards, expectedCount, errors, globalSlugSet) {
  const realmSlugSet = new Set()

  if (cards.length !== expectedCount) {
    errors.push(`[${realmId}] count mismatch: expected=${expectedCount}, actual=${cards.length}`)
  }

  for (const card of cards) {
    const cardRef = `[${realmId}] slug=${card?.slug ?? '(missing)'}, path=${card?.sourcePath ?? '(missing)'}`

    if (card?.realmId !== realmId) {
      errors.push(`${cardRef} realmId mismatch`)
    }
    if (!card?.slug || typeof card.slug !== 'string') {
      errors.push(`${cardRef} missing slug`)
    } else {
      if (realmSlugSet.has(card.slug)) errors.push(`${cardRef} duplicate slug in same realm`)
      if (globalSlugSet.has(card.slug)) errors.push(`${cardRef} duplicate slug globally`)
      realmSlugSet.add(card.slug)
      globalSlugSet.add(card.slug)
    }
    if (!card?.title || typeof card.title !== 'string') errors.push(`${cardRef} missing title`)
    if (!card?.summary || typeof card.summary !== 'string') errors.push(`${cardRef} missing summary`)

    if (realmId === 'jingjie') {
      if (typeof card.bodyMarkdown !== 'string') {
        errors.push(`${cardRef} bodyMarkdown must be string (lite module keeps empty bodies + JSON)`)
      }
    } else if (!card.bodyMarkdown || typeof card.bodyMarkdown !== 'string') {
      errors.push(`${cardRef} missing bodyMarkdown`)
    }
    if (!card?.sourcePath || typeof card.sourcePath !== 'string') {
      errors.push(`${cardRef} missing sourcePath`)
    }
    if (!card?.sourceUrl || typeof card.sourceUrl !== 'string') {
      errors.push(`${cardRef} missing sourceUrl`)
    } else if (
      card.sourcePath
      && card.sourceUrl !== expectedSourceUrl(card.sourcePath)
      && !matchesLegacyUpstreamSourceUrl(card.sourcePath, card.sourceUrl)
    ) {
      errors.push(`${cardRef} sourceUrl mismatch`)
    }
    if (!Array.isArray(card?.bullets)) errors.push(`${cardRef} bullets must be array`)
    if (!Array.isArray(card?.tags)) errors.push(`${cardRef} tags must be array`)
  }
}

function validateJingjieExternalBodies(cards, bodiesRaw, errors) {
  let parsed
  try {
    parsed = JSON.parse(bodiesRaw)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    errors.push(`[jingjie] three-realms-jingjie-bodies.json: invalid JSON (${msg})`)
    return
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    errors.push('[jingjie] bodies JSON must be a slug → markdown object')
    return
  }

  const extra = new Set(Object.keys(parsed))
  for (const card of cards) {
    if (!Object.prototype.hasOwnProperty.call(parsed, card.slug)) {
      errors.push(`[jingjie] missing body for slug=${card.slug}`)
    } else if (typeof parsed[card.slug] !== 'string') {
      errors.push(`[jingjie] body for slug=${card.slug} must be string`)
    } else if (parsed[card.slug].trim() === '') {
      errors.push(`[jingjie] empty body for slug=${card.slug}`)
    }
    extra.delete(card.slug)
  }

  for (const slug of extra) {
    errors.push(`[jingjie] bodies JSON has orphan slug=${slug} (not in REALM_FEATURES_JINGJIE)`)
  }
}

function main() {
  const indexSource = readFileSync(FILES.index, 'utf8')
  const counts = parseCounts(indexSource)

  const tianyuCards = parseCards(readFileSync(FILES.tianyu, 'utf8'), 'REALM_FEATURES_TIANYU')
  const shenyuCards = parseCards(readFileSync(FILES.shenyu, 'utf8'), 'REALM_FEATURES_SHENYU')
  const jingjieCards = parseCards(readFileSync(FILES.jingjie, 'utf8'), 'REALM_FEATURES_JINGJIE')

  const errors = []
  const globalSlugSet = new Set()

  validateRealm('tianyu', tianyuCards, counts.tianyu, errors, globalSlugSet)
  validateRealm('shenyu', shenyuCards, counts.shenyu, errors, globalSlugSet)
  validateRealm('jingjie', jingjieCards, counts.jingjie, errors, globalSlugSet)

  const bodiesRaw = readFileSync(FILES.jingjieBodies, 'utf8')
  validateJingjieExternalBodies(jingjieCards, bodiesRaw, errors)

  if (errors.length > 0) {
    console.error(`Three Realms data validation failed with ${errors.length} issue(s):`)
    for (const line of errors) console.error(`- ${line}`)
    process.exit(1)
  }

  const total = tianyuCards.length + shenyuCards.length + jingjieCards.length
  console.log(`Three Realms data validation passed. total=${total}`)
}

main()
