/**
 * Extract JSON array literal from sync-generated realm module ( REALM_FEATURES_* = [ ... ]; )
 */

export function sliceRealmFeaturesArray(source, constName) {
  const marker = `export const ${constName}`
  let i = source.indexOf(marker)
  if (i < 0) throw new Error(`Missing ${marker}`)
  const assignEq = source.indexOf('=', i)
  if (assignEq < 0) throw new Error('Missing = after realm export')
  /** Skip `RealmFeatureCard[]`-style brackets; anchor on the `[` after `=`. */
  i = source.indexOf('[', assignEq)
  if (i < 0) throw new Error('Missing opening [')
  let depth = 0
  let inString = false
  let escape = false

  const start = i
  for (; i < source.length; i++) {
    const c = source[i]

    if (inString) {
      if (escape) {
        escape = false
        continue
      }
      if (c === '\\') {
        escape = true
        continue
      }
      if (c === '"') inString = false
      continue
    }

    if (c === '"') {
      inString = true
      continue
    }

    if (c === '[') depth += 1
    else if (c === ']') {
      depth -= 1
      if (depth === 0) {
        return source.slice(start, i + 1)
      }
    }
  }
  throw new Error('Unbalanced bracket in realm export')
}
