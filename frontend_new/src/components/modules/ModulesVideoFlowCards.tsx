import { useEffect, useMemo, useRef, useState } from 'react'
import { prefersReducedMotion } from '../../lib/motionPreference'

type T = (key: string) => string

const STEPS = [
  { id: 'in', n: 0, titleKey: 'mod_vidflow_cards_in_title', descKey: 'mod_vidflow_cards_in_desc' },
  { id: 'script', n: 1, titleKey: 'mod_vidflow_cards_script_title', descKey: 'mod_vidflow_cards_s1_desc' },
  { id: 'forge', n: 2, titleKey: 'mod_vidflow_cards_forge_title', descKey: 'mod_vidflow_cards_s2_desc' },
  { id: 'tune', n: 3, titleKey: 'mod_vidflow_cards_tune_title', descKey: 'mod_vidflow_cards_s3_desc' },
  { id: 'core', n: 4, titleKey: 'mod_vidflow_cards_core_title', descKey: 'mod_vidflow_cards_core_desc' },
  { id: 'track', n: 5, titleKey: 'mod_vidflow_cards_track_title', descKey: 'mod_vidflow_cards_s4_desc' },
] as const

export function ModulesVideoFlowCards({ tm }: { tm: T }) {
  const reduced = prefersReducedMotion()
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const suppressUntil = useRef(0)

  const steps = useMemo(
    () => STEPS.map((s) => ({ ...s, title: tm(s.titleKey), desc: tm(s.descKey) })),
    [tm],
  )

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % steps.length)
    }, 2600)
    return () => window.clearInterval(id)
  }, [reduced, steps.length])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const onKeyDown = (e: KeyboardEvent) => {
      const ae = document.activeElement
      if (!ae || !root.contains(ae)) return
      if (ae instanceof HTMLInputElement || ae instanceof HTMLTextAreaElement) return
      let next: number | null = null
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = active + 1
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = active - 1
      else if (e.key === 'Home') next = 0
      else if (e.key === 'End') next = steps.length - 1
      if (next === null) return
      e.preventDefault()
      const clamped = Math.max(0, Math.min(steps.length - 1, next))
      suppressUntil.current = Date.now() + 900
      setActive(clamped)
    }
    root.addEventListener('keydown', onKeyDown)
    return () => root.removeEventListener('keydown', onKeyDown)
  }, [active, steps.length])

  return (
    <div
      ref={rootRef}
      className="mod-videoflow-cards"
      data-active={active}
      role="region"
      aria-label={tm('mod_vidflow_chart_title')}
      onMouseEnter={() => (suppressUntil.current = Date.now() + 999999)}
      onMouseLeave={() => (suppressUntil.current = Date.now() + 0)}
    >
      <ol className="mod-videoflow-cards-grid">
        {steps.map((s, idx) => (
          <li
            key={s.id}
            className={['mod-videoflow-card', idx === active ? 'is-active' : ''].filter(Boolean).join(' ')}
            tabIndex={0}
            onClick={() => {
              suppressUntil.current = Date.now() + 900
              setActive(idx)
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' && e.key !== ' ') return
              e.preventDefault()
              suppressUntil.current = Date.now() + 900
              setActive(idx)
            }}
          >
            <div className="mod-videoflow-card-head">
              <h4 className="mod-videoflow-card-title">{s.title}</h4>
            </div>
            <p className="mod-videoflow-card-desc">{s.desc}</p>
          </li>
        ))}
      </ol>
      <div className="mod-videoflow-flowline" aria-hidden="true" />
    </div>
  )
}

