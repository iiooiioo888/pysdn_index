import { useEffect, useMemo, useState } from 'react'
import { resolveRealmFeatureCards, type ResolvedRealmFeatureCard } from '../data/threeRealmsFeatureUtils'
import type { RealmFeatureCard, RealmId } from '../data/threeRealmsFeatures'

const loaders: Record<RealmId, () => Promise<RealmFeatureCard[]>> = {
  tianyu: () => import('../data/threeRealmsFeatures.tianyu').then((m) => m.REALM_FEATURES_TIANYU),
  shenyu: () => import('../data/threeRealmsFeatures.shenyu').then((m) => m.REALM_FEATURES_SHENYU),
  jingjie: () => import('../data/threeRealmsFeatures.jingjie').then((m) => m.REALM_FEATURES_JINGJIE),
}

export function useRealmFeatures(realmId: RealmId): {
  features: ResolvedRealmFeatureCard[]
  loading: boolean
} {
  const [cards, setCards] = useState<RealmFeatureCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    loaders[realmId]().then((nextCards) => {
      if (cancelled) return
      setCards(nextCards)
      setLoading(false)
    }).catch(() => {
      if (cancelled) return
      setCards([])
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [realmId])

  return {
    features: useMemo(() => resolveRealmFeatureCards(realmId, cards), [cards, realmId]),
    loading,
  }
}
