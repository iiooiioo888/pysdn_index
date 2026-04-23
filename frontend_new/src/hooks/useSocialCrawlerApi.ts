import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../lib/api'

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
  const abortRef = useRef<AbortController | null>(null)

  const refresh = useCallback(async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setHealth('loading')
    setLastError(null)
    try {
      const { data: j } = await api.get<Record<string, string>>(`${root}/api/health`, {
        signal: controller.signal,
      })
      setHealthBody(j)
      setHealth('ok')
      try {
        const { data: pj } = await api.get<{ platforms?: string[] }>(`${root}/api/platforms`, {
          signal: controller.signal,
        })
        setPlatforms(pj.platforms ?? [])
      } catch {
        setPlatforms([])
      }
    } catch (e) {
      if ((e as Error).name === 'CanceledError' || (e as Error).name === 'AbortError') return
      setHealth('error')
      setHealthBody(null)
      setLastError(e instanceof Error ? e.message : String(e))
      setPlatforms(['demo', 'xhs', 'youtube', 'douyin'])
    }
  }, [root])

  useEffect(() => {
    void refresh()
    return () => {
      abortRef.current?.abort()
    }
  }, [refresh])

  const runCrawl = useCallback(
    async (platform: string, query: string) => {
      const { data } = await api.post(
        `${root}/api/crawl`,
        { platform, query, append_jsonl: false },
      )
      return data
    },
    [root],
  )

  const fetchItems = useCallback(
    async (limit = 20) => {
      const { data } = await api.get<{ items?: unknown[] }>(`${root}/api/items`, {
        params: { limit },
      })
      return data
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
