import axios from 'axios'
import { useApiStore } from './store'
import type {
  ApiTaskPayload,
  ContactSubmitRequest,
  DramaCreateRequest,
  DramaListItem,
  HealthResponse,
  ImageGenerateRequest,
  ImageListItem,
  ImageListQuery,
  PaginatedQuery,
  PaginatedResponse,
  SuperForgeListItem,
  SuperTrackTrendsRequest,
  SuperTuneOptimizeRequest,
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

  submitContact: (data: ContactSubmitRequest) => api.post<unknown>('/api/contact', data),
}
