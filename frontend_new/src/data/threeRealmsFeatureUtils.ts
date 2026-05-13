import type { RealmFeatureCard, RealmId } from './threeRealmsFeatures'

export type ResolvedRealmFeatureCard = RealmFeatureCard & {
  realmId: RealmId
  slug: string
  bodyMarkdown: string
}

function hashString(input: string): string {
  let hash = 5381
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 33) ^ input.charCodeAt(i)
  }
  return (hash >>> 0).toString(36)
}

export function slugFromSourcePath(sourcePath: string): string {
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

function fallbackMarkdown(card: RealmFeatureCard): string {
  const bullets = card.bullets.length > 0 ? `\n\n## 重點\n\n${card.bullets.map((item) => `- ${item}`).join('\n')}` : ''
  const tags = card.tags.length > 0 ? `\n\n## 標籤\n\n${card.tags.map((tag) => `- ${tag}`).join('\n')}` : ''
  return `# ${card.title}\n\n${card.summary}${bullets}${tags}\n\n## 來源\n\n[${card.sourcePath}](${card.sourceUrl})`
}

export function resolveRealmFeatureCards(realmId: RealmId, cards: RealmFeatureCard[]): ResolvedRealmFeatureCard[] {
  const seen = new Map<string, number>()

  return cards.map((card) => {
    const baseSlug = card.slug || slugFromSourcePath(card.sourcePath)
    const count = seen.get(baseSlug) ?? 0
    seen.set(baseSlug, count + 1)
    const slug = count === 0 ? baseSlug : `${baseSlug}-${count + 1}`

    return {
      ...card,
      realmId: card.realmId ?? realmId,
      slug,
      bodyMarkdown: card.bodyMarkdown || fallbackMarkdown(card),
    }
  })
}

export function findRealmFeatureInCards(
  realmId: RealmId,
  cards: RealmFeatureCard[],
  featureSlug: string,
): ResolvedRealmFeatureCard | undefined {
  return resolveRealmFeatureCards(realmId, cards).find((card) => card.slug === featureSlug)
}
