import { useCallback, useEffect, useMemo, useState } from 'react'

export type SocialCrawlerHealth = 'loading' | 'ok' | 'error'

function viteBaseRoot(): string {
  const b = import.meta.env.BASE_URL
  return b.endsWith('/') ? b.slice(0, -1) : b
}

export function useSocialCrawlerApi() {
  const root = useMemo(() => viteBaseRoot(), [])
  const [health, setHealth] = useState<SocialCrawlerHealth>('loading')
  const [healthBody, setHealthBody] = useState<Record<string, string> | null>(null)
  const [platforms, setPlatforms] = useState<string[]>([])
  const [lastError, setLastError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setHealth('loading')
    setLastError(null)
    try {
      const r = await fetch(`${root}/api/health`)
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      const j = (await r.json()) as Record<string, string>
      setHealthBody(j)
      setHealth('ok')
      try {
        const rp = await fetch(`${root}/api/platforms`)
        if (rp.ok) {
          const pj = (await rp.json()) as { platforms?: string[] }
          setPlatforms(pj.platforms ?? [])
        } else {
          setPlatforms([])
        }
      } catch {
        setPlatforms([])
      }
    } catch (e) {
      setHealth('error')
      setHealthBody(null)
      setLastError(e instanceof Error ? e.message : String(e))
      setPlatforms(['demo', 'xhs', 'youtube', 'douyin'])
    }
  }, [root])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const runCrawl = useCallback(
    async (platform: string, query: string) => {
      const r = await fetch(`${root}/api/crawl`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, query, append_jsonl: false }),
      })
      const text = await r.text()
      let data: unknown
      try {
        data = JSON.parse(text) as unknown
      } catch {
        data = { raw: text }
      }
      if (!r.ok) {
        const msg = typeof data === 'object' && data && 'detail' in data ? String((data as { detail: unknown }).detail) : text
        throw new Error(msg || `HTTP ${r.status}`)
      }
      return data
    },
    [root],
  )

  const fetchItems = useCallback(
    async (limit = 20) => {
      const r = await fetch(`${root}/api/items?limit=${limit}`)
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      return (await r.json()) as { items?: unknown[] }
    },
    [root],
  )

  return {
    root,
    health,
    healthBody,
    platforms,
    lastError,
    refresh,
    runCrawl,
    fetchItems,
  }
}
