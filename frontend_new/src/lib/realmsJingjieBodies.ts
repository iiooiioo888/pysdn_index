/**
 * 鏡界 feature 正文存放在 public JSON（避免與列表 chunk 捆綁）；僅詳情頁需要時載入一次。
 */
let cache: Record<string, string> | null = null
let inflight: Promise<Record<string, string>> | null = null

export async function fetchJingjieBodies(): Promise<Record<string, string>> {
  if (cache) return cache
  if (!inflight) {
    inflight = (async () => {
      const url = `${import.meta.env.BASE_URL}data/three-realms-jingjie-bodies.json`
      const res = await fetch(url, { credentials: 'omit' })
      if (!res.ok) {
        throw new Error(`鏡界正文載入失敗：${res.status} ${res.statusText}`)
      }
      const data: unknown = await res.json()
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('鏡界正文格式錯誤')
      }
      const next = data as Record<string, string>
      cache = next
      return next
    })().catch((e) => {
      inflight = null
      throw e
    })
  }
  return inflight
}
