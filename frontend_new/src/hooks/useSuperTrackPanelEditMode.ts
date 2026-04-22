import { useMemo } from 'react'

/**
 * 是否允許在面板編輯追蹤目標／探針器（本頁不顯示任何解鎖表單）。
 * - `vite dev`：預設 true
 * - 正式建置：需 `VITE_SUPERTRACK_PANEL_EDIT=true`
 */
export function useSuperTrackPanelEditMode(): boolean {
  return useMemo(
    () => import.meta.env.DEV || import.meta.env.VITE_SUPERTRACK_PANEL_EDIT === 'true',
    [],
  )
}
