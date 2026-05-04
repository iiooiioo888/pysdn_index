import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../lib/api'

export type SuperTrackBackendHealth = 'loading' | 'ok' | 'error'

/**
 * SuperTrack 後端 API hook。
 *
 * 後端已遷移至獨立倉庫：https://github.com/iiooiioo888/SuperTrack
 * 透過環境變數 `VITE_SUPERTRACK_API_URL` 指向後端位址（預設為同源 `/`）。
 */
export function useSuperTrackApi() {
  const root = useMemo(() => {
    const envUrl = import.meta.env.VITE_SUPERTRACK_API_URL as string | undefined
    if (envUrl) return envUrl.replace(/\/$/, '')
    const b = import.meta.env.BASE_URL
    return b.endsWith('/') ? b.slice(0, -1) : b
  }, [])

  const [health, setHealth] = useState<SuperTrackBackendHealth>('loading')
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
      const { data } = await api.post(`${root}/api/crawl`, {
        platform,
        query,
        append_jsonl: false,
      })
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
