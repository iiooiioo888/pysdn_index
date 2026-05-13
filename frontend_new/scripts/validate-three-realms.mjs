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
}

const REPO_PREFIX = 'https://github.com/iiooiioo888/Note/blob/main/'

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
  return `${REPO_PREFIX}${encodeRepoPath(sourcePath)}`
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
    if (!card?.bodyMarkdown || typeof card.bodyMarkdown !== 'string') errors.push(`${cardRef} missing bodyMarkdown`)
    if (!card?.sourcePath || typeof card.sourcePath !== 'string') {
      errors.push(`${cardRef} missing sourcePath`)
    }
    if (!card?.sourceUrl || typeof card.sourceUrl !== 'string') {
      errors.push(`${cardRef} missing sourceUrl`)
    } else if (card.sourcePath && card.sourceUrl !== expectedSourceUrl(card.sourcePath)) {
      errors.push(`${cardRef} sourceUrl mismatch`)
    }
    if (!Array.isArray(card?.bullets)) errors.push(`${cardRef} bullets must be array`)
    if (!Array.isArray(card?.tags)) errors.push(`${cardRef} tags must be array`)
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

  if (errors.length > 0) {
    console.error(`Three Realms data validation failed with ${errors.length} issue(s):`)
    for (const line of errors) console.error(`- ${line}`)
    process.exit(1)
  }

  const total = tianyuCards.length + shenyuCards.length + jingjieCards.length
  console.log(`Three Realms data validation passed. total=${total}`)
}

main()
