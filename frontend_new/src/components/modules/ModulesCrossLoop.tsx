import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { prefersReducedMotion } from '../../lib/motionPreference'

type T = (key: string) => string

const STEP_KEYS = [1, 2, 3, 4] as const
const MODULE_LABELS: Record<(typeof STEP_KEYS)[number], string> = {
  1: 'SuperTrack',
  2: 'SuperScript',
  3: 'SuperForge',
  4: 'SuperTune',
}

export function ModulesCrossLoop({ tm }: { tm: T }) {
  const reduced = prefersReducedMotion()
  const [active, setActive] = useState<(typeof STEP_KEYS)[number]>(1)
  const [paused, setPaused] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  const steps = useMemo(
    () =>
      STEP_KEYS.map((n) => ({
        n,
        title: MODULE_LABELS[n],
        desc: tm(`mod_x${n}_desc`),
      })),
    [tm],
  )

  const go = useCallback((n: number) => {
    const clamped = Math.max(1, Math.min(4, n)) as (typeof STEP_KEYS)[number]
    setActive(clamped)
  }, [])

  useEffect(() => {
    if (reduced || paused) return
    const id = window.setInterval(() => {
      setActive((prev) => ((prev % 4) + 1) as (typeof STEP_KEYS)[number])
    }, 2500)
    return () => window.clearInterval(id)
  }, [paused, reduced])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const onKeyDown = (e: KeyboardEvent) => {
      const ae = document.activeElement
      if (!ae || !root.contains(ae)) return
      if (ae instanceof HTMLInputElement || ae instanceof HTMLTextAreaElement) return

      const next =
        e.key === 'ArrowRight' || e.key === 'ArrowDown'
          ? active + 1
          : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
            ? active - 1
            : e.key === 'Home'
              ? 1
              : e.key === 'End'
                ? 4
                : null
      if (next === null) return
      e.preventDefault()
      go(next)
    }

    root.addEventListener('keydown', onKeyDown)
    return () => root.removeEventListener('keydown', onKeyDown)
  }, [active, go])

  return (
    <div
      ref={rootRef}
      className="mod-cross-mesh"
      data-active-step={active}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="region"
      aria-label={tm('mod_cross_title')}
    >
      <svg className="mod-cross-mesh-lines" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <marker
            id="mod-cross-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="4"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="currentColor" />
          </marker>
        </defs>

        {/* 2×2 nodes: (25,25) (75,25) (25,75) (75,75) */}
        <g className="mod-cross-mesh-line-group">
          <line x1="25" y1="25" x2="75" y2="25" className="mod-cross-mesh-line mod-cross-mesh-line--12" />
          <line x1="25" y1="25" x2="25" y2="75" className="mod-cross-mesh-line mod-cross-mesh-line--13" />
          <line x1="75" y1="25" x2="75" y2="75" className="mod-cross-mesh-line mod-cross-mesh-line--24" />
          <line x1="25" y1="75" x2="75" y2="75" className="mod-cross-mesh-line mod-cross-mesh-line--34" />
          <line x1="25" y1="25" x2="75" y2="75" className="mod-cross-mesh-line mod-cross-mesh-line--14" />
          <line x1="75" y1="25" x2="25" y2="75" className="mod-cross-mesh-line mod-cross-mesh-line--23" />
        </g>
      </svg>

      <ol className="mod-cross-mesh-grid" aria-label={tm('mod_cross_title')}>
        {steps.map((s) => (
          <li
            key={s.n}
            className={[
              'mod-cross-node',
              `mod-cross-node--s${s.n}`,
              s.n === active ? 'is-active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            tabIndex={0}
            onClick={() => go(s.n)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' && e.key !== ' ') return
              e.preventDefault()
              go(s.n)
            }}
          >
            <h3 className="mod-cross-node-title">{s.title}</h3>
            <p className="mod-cross-node-desc">{s.desc}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

