/** 共用 Mermaid runtime：避免同一頁多張圖各自 initialize + 重複動態載入開銷 */
let initialized = false

export async function renderDocMermaidSvg(chartTrimmed: string, graphId: string): Promise<string> {
  const mermaidMod = await import('mermaid')
  const mermaid = mermaidMod.default
  if (!initialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'strict',
      themeVariables: {
        darkMode: true,
        background: '#0c0c14',
        primaryColor: '#1e293b',
        primaryTextColor: '#e8edf5',
        secondaryColor: '#334155',
        tertiaryColor: '#0f172a',
        lineColor: '#64748b',
        fontFamily: "'Plus Jakarta Sans', 'Noto Sans SC', 'Noto Sans TC', 'Microsoft YaHei', system-ui, sans-serif",
      },
    })
    initialized = true
  }
  const { svg } = await mermaid.render(graphId, chartTrimmed)
  return svg
}
