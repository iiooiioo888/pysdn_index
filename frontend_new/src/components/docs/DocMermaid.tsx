import { useEffect, useId, useRef, useState } from 'react'

type DocMermaidProps = {
  chart: string
  className?: string
}

/** 以 Mermaid 渲染思維導圖／流程圖（動態載入，避免拖慢首屏） */
export function DocMermaid({ chart, className = '' }: DocMermaidProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const reactId = useId().replace(/:/g, '')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(null)
    const el = hostRef.current
    if (!el) return

    const run = async () => {
      try {
        const mermaid = (await import('mermaid')).default
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
        const graphId = `doc-mmd-${reactId}-${Math.random().toString(36).slice(2, 10)}`
        const { svg } = await mermaid.render(graphId, chart.trim())
        if (cancelled || !hostRef.current) return
        hostRef.current.innerHTML = svg
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e))
      }
    }

    el.innerHTML = ''
    void run()
    return () => {
      cancelled = true
      el.innerHTML = ''
    }
  }, [chart, reactId])

  if (error) {
    return (
      <div className={`doc-mermaid-wrap doc-mermaid-wrap--error ${className}`} role="alert">
        <p className="doc-mermaid-error">圖表無法顯示：{error}</p>
      </div>
    )
  }

  return <div ref={hostRef} className={`doc-mermaid-wrap ${className}`} aria-busy="true" />
}
