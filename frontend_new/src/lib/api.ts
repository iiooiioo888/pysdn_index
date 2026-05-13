import axios from 'axios'
import { useApiStore } from './store'
import type {
  ApiTaskPayload,
  ContactSubmitRequest,
  DramaCreateRequest,
  DramaListItem,
  HealthResponse,
  JingjieCrawlStartRequest,
  JingjieCrawlStartResponse,
  JingjieCrawlStatusResponse,
  JingjieDataResultResponse,
  ImageGenerateRequest,
  ImageListItem,
  ImageListQuery,
  PaginatedQuery,
  PaginatedResponse,
  SuperForgeListItem,
  SuperTrackTrendsRequest,
  SuperTuneOptimizeRequest,
  TianyuTaskCreateRequest,
  TianyuTaskCreateResponse,
  TianyuTaskFinalizeRequest,
  TianyuTaskFinalizeResponse,
  VideoGenerateRequest,
  VideoListItem,
} from './apiTypes'

export const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const baseUrl = useApiStore.getState().baseUrl
  if (!config.url?.startsWith('http')) {
    config.baseURL = baseUrl
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  },
)

export const apiService = {
  health: () => api.get<HealthResponse>('/api/health'),

  generateVideo: (data: VideoGenerateRequest) =>
    api.post<ApiTaskPayload>('/api/video/generate', data),
  getVideoStatus: (taskId: string) => api.get<ApiTaskPayload>(`/api/video/status/${taskId}`),
  listVideos: (params?: PaginatedQuery) =>
    api.get<PaginatedResponse<VideoListItem>>('/api/video/list', { params }),

  createDrama: (data: DramaCreateRequest) => api.post<ApiTaskPayload>('/api/drama/create', data),
  listDramaSeries: (params?: PaginatedQuery) =>
    api.get<PaginatedResponse<DramaListItem>>('/api/drama/list', { params }),

  generateImage: (data: ImageGenerateRequest) =>
    api.post<ApiTaskPayload>('/api/image/generate', data),
  listImages: (params?: ImageListQuery) =>
    api.get<PaginatedResponse<ImageListItem>>('/api/image/list', { params }),

  optimizePrompt: (data: SuperTuneOptimizeRequest) =>
    api.post<unknown>('/api/modules/supertune', data),

  superforgeList: () =>
    api.post<PaginatedResponse<SuperForgeListItem>>('/api/modules/superforge', { action: 'list' }),
  /** SuperTrack 趨勢／模組 API（與後端 `/api/modules/supertrack` 對應） */
  supertrackTrends: (data: SuperTrackTrendsRequest) =>
    api.post<unknown>('/api/modules/supertrack', data),

  /** 天域 ↔ 鏡界最小整合流程（任務建立 → 爬取 → 回填） */
  tianyuCreateTask: (data: TianyuTaskCreateRequest) =>
    api.post<TianyuTaskCreateResponse>('/api/realms/tianyu/tasks', data),
  jingjieStartCrawl: (data: JingjieCrawlStartRequest) =>
    api.post<JingjieCrawlStartResponse>('/api/realms/jingjie/crawls', data),
  jingjieCrawlStatus: (crawlId: string) =>
    api.get<JingjieCrawlStatusResponse>(`/api/realms/jingjie/crawls/${crawlId}`),
  jingjieDataResult: (resultId: string) =>
    api.get<JingjieDataResultResponse>(`/api/realms/jingjie/results/${resultId}`),
  tianyuFinalizeTask: (data: TianyuTaskFinalizeRequest) =>
    api.post<TianyuTaskFinalizeResponse>('/api/realms/tianyu/tasks/finalize', data),

  submitContact: (data: ContactSubmitRequest) => api.post<unknown>('/api/contact', data),
}
