import axios from 'axios'
import { useApiStore } from './store'

export const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add base URL
api.interceptors.request.use((config) => {
  const baseUrl = useApiStore.getState().baseUrl
  if (!config.url?.startsWith('http')) {
    config.baseURL = baseUrl
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// API Service functions
export const apiService = {
  // Health check
  health: () => api.get('/api/health'),
  
  // Video generation
  generateVideo: (data: any) => api.post('/api/video/generate', data),
  getVideoStatus: (taskId: string) => api.get(`/api/video/status/${taskId}`),
  listVideos: (params?: { limit?: number; offset?: number }) =>
    api.get('/api/video/list', { params }),
  
  // Drama production
  createDrama: (data: any) => api.post('/api/drama/create', data),
  listDramaSeries: (params?: { limit?: number; offset?: number }) =>
    api.get('/api/drama/list', { params }),
  
  // Image workshop
  generateImage: (data: any) => api.post('/api/image/generate', data),
  listImages: (params?: { limit?: number; offset?: number; style?: string }) =>
    api.get('/api/image/list', { params }),
  
  // Extensions (maps to backend modules)
  optimizePrompt: (data: any) => api.post('/api/modules/supertune', data),
  getTrends: (data: any) => api.post('/api/modules/supertrack', data),

  // Modules
  superforgeList: () => api.post('/api/modules/superforge', { action: 'list' }),
  supertrackTrends: (data: any) => api.post('/api/modules/supertrack', data),
  
  // Contact
  submitContact: (data: any) => api.post('/api/contact', data),
}
