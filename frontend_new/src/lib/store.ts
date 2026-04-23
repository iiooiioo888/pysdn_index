import { create } from 'zustand'

/** 僅供 Axios baseURL；loading／error 請在各呼叫處或用 UI 元件處理，避免未消费的殭屍狀態 */
interface ApiState {
  baseUrl: string
  setBaseUrl: (url: string) => void
}

export const useApiStore = create<ApiState>((set) => ({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  setBaseUrl: (url) => set({ baseUrl: url }),
}))
