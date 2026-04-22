/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** SuperTrack 面板是否允許編輯（正式建置；本頁不顯示解鎖 UI） */
  readonly VITE_SUPERTRACK_PANEL_EDIT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.css' {}
