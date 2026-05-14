import { useEffect, useId, useRef, useState } from 'react'
import { renderDocMermaidSvg } from '../../lib/docMermaidRuntime'

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
        const graphId = `doc-mmd-${reactId}-${Math.random().toString(36).slice(2, 10)}`
        const svg = await renderDocMermaidSvg(chart.trim(), graphId)
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
