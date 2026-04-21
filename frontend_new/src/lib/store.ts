import { create } from 'zustand'

interface ApiState {
  baseUrl: string
  isLoading: boolean
  error: string | null
  setBaseUrl: (url: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useApiStore = create<ApiState>((set) => ({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  isLoading: false,
  error: null,
  setBaseUrl: (url) => set({ baseUrl: url }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))

interface UIState {
  isMenuOpen: boolean
  activeSection: string
  theme: 'dark' | 'light'
  toggleMenu: () => void
  setActiveSection: (section: string) => void
  setTheme: (theme: 'dark' | 'light') => void
}

export const useUIStore = create<UIState>((set) => ({
  isMenuOpen: false,
  activeSection: 'home',
  theme: 'dark',
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  setActiveSection: (section) => set({ activeSection: section }),
  setTheme: (theme) => set({ theme }),
}))
