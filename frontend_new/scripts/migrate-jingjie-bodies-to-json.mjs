#!/usr/bin/env node
/**
 * One-off / maintenance: split jingjie bodyMarkdown into public JSON + lite TS cards.
 * Re-run after manual edits to bodies if sync has not regenerated yet.
 * Normal workflow: npm run sync:realms (writes lite + JSON automatically).
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { sliceRealmFeaturesArray } from './_parseRealmExportArray.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const REALM_TS = join(ROOT, 'src', 'data', 'threeRealmsFeatures.jingjie.ts')
const OUT_JSON = join(ROOT, 'public', 'data', 'three-realms-jingjie-bodies.json')

function main() {
  const src = readFileSync(REALM_TS, 'utf8')
  const slice = sliceRealmFeaturesArray(src, 'REALM_FEATURES_JINGJIE')
  const cards = JSON.parse(slice)

  const bodies = {}
  const lite = cards.map((c) => {
    const slug = c.slug
    if (!slug) throw new Error('Card missing slug')
    bodies[slug] = c.bodyMarkdown ?? ''
    const { bodyMarkdown: _b, ...rest } = c
    return { ...rest, bodyMarkdown: '' }
  })

  mkdirSync(dirname(OUT_JSON), { recursive: true })
  writeFileSync(OUT_JSON, `${JSON.stringify(bodies)}\n`, 'utf8')

  const preExport = src.slice(0, src.indexOf('export const REALM_FEATURES_JINGJIE'))
  writeFileSync(
    REALM_TS,
    `${preExport}export const REALM_FEATURES_JINGJIE: RealmFeatureCard[] = ${JSON.stringify(lite, null, 2)}\n`,
    'utf8',
  )

  console.log(`Wrote ${Object.keys(bodies).length} bodies -> ${OUT_JSON}`)
  console.log(`Updated lite cards -> ${REALM_TS}`)
}

main()
