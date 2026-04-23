/**
 * 與 `apiService` 對應的請求／回應形狀。
 * 後端若提供 OpenAPI／契約檔，請以此檔為單一真相來源同步更新。
 */

/** 後端若回傳額外欄位仍屬合法 JSON，呼叫端可再斷言或收窄型別 */
export type ApiTaskPayload = {
  taskId?: string
  id?: string
  status?: string
  message?: string
}

export type VideoGenerateRequest = {
  prompt: string
  negativePrompt?: string
  durationSec?: number
  aspectRatio?: string
  seed?: number
  style?: string
  resolution?: string
}

export type DramaCreateRequest = {
  title: string
  synopsis?: string
  episodes?: number
  tone?: string
  locale?: string
}

export type ImageGenerateRequest = {
  prompt: string
  negativePrompt?: string
  width?: number
  height?: number
  style?: string
  seed?: number
}

export type SuperTuneOptimizeRequest = {
  prompt: string
  targetModel?: string
  locale?: string
  constraints?: string
}

export type SuperTrackTrendsRequest = {
  query: string
  region?: string
  window?: string
  limit?: number
}

export type ContactSubmitRequest = {
  name: string
  email: string
  message: string
  company?: string
  subject?: string
}

export type PaginatedQuery = {
  limit?: number
  offset?: number
}

export type ImageListQuery = PaginatedQuery & {
  style?: string
}

/**
 * 與後端列表 API 約定一致：`items` + `total`（可選分頁游標）。
 * 若後端使用 `data`/`results` 等欄位，應在後端或 BFF 對齊為此形狀，或在此型別加上 union。
 */
export type PaginatedResponse<T> = {
  items: T[]
  total: number
  limit?: number
  offset?: number
}

export type VideoListItem = {
  id: string
  taskId?: string
  status?: string
  prompt?: string
  url?: string
  thumbnailUrl?: string
  createdAt?: string
}

export type DramaListItem = {
  id: string
  title?: string
  episodeCount?: number
  status?: string
  synopsis?: string
  updatedAt?: string
}

export type ImageListItem = {
  id: string
  url?: string
  prompt?: string
  style?: string
  createdAt?: string
}

/** `/api/modules/superforge` + `{ action: 'list' }` 列表單筆；後端欄位若有增刪請同步此型別 */
export type SuperForgeListItem = {
  id: string
  prompt?: string
  title?: string
  tags?: string[]
  createdAt?: string
  updatedAt?: string
}

/** 健康檢查等簡單端點 */
export type HealthResponse = {
  status?: string
  ok?: boolean
}
