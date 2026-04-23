/**
 * 星空背景 Canvas — 與 `styles/visual-system.css` 的 `--app-scale` 一併調整（contentScale）。
 */
export const CANVAS_VISUAL = {
  contentScale: 1.2,

  stars: {
    distantMinMobile: 420,
    distantMinDesktop: 1150,
    areaDivMobile: 4000,
    areaDivDesktop: 980,
    distantCapMobile: 2000,
    distantCapDesktop: 4800,
    brightMobile: 32,
    brightDesktop: 90,
  },
} as const
