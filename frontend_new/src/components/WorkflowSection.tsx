import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { prefersReducedMotion } from '../lib/motionPreference'

const STEP_TOTAL = 4

export function WorkflowSection() {
  const { t } = useTranslation()
  const [activeStep, setActiveStep] = useState(1)
  const sectionRef = useRef<HTMLElement | null>(null)
  const scrollSyncSuppressUntil = useRef(0)

  const goStep = useCallback((n: number, options?: { suppressScrollSync?: boolean }) => {
    const clamped = Math.max(1, Math.min(STEP_TOTAL, n))
    setActiveStep(clamped)
    if (options?.suppressScrollSync) {
      scrollSyncSuppressUntil.current = Date.now() + 850
    }
    queueMicrotask(() => {
      document.getElementById(`workflow-card-${clamped}`)?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'nearest',
      })
    })
  }, [])

  const steps = [1, 2, 3, 4].map((n) => ({
    n,
    titleKey: `workflow_s${n}_title` as const,
    bodyKey: `workflow_s${n}_body` as const,
    bulletKeys: [1, 2, 3].map((i) => `workflow_s${n}_b${i}` as const),
    deliverKey: `workflow_s${n}_deliver` as const,
    expandKey: `workflow_s${n}_expand` as const,
  }))

  useEffect(() => {
    const root = sectionRef.current
    if (!root) return

    const onKeyDown = (e: KeyboardEvent) => {
      const ae = document.activeElement
      if (!ae || !root.contains(ae)) return
      if (ae instanceof HTMLInputElement || ae instanceof HTMLTextAreaElement) return
      if (ae.closest('.workflow-step-details-body')) return

      let next: number | null = null
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = activeStep + 1
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = activeStep - 1
      else if (e.key === 'Home') next = 1
      else if (e.key === 'End') next = STEP_TOTAL

      if (next === null) return
      const clamped = Math.max(1, Math.min(STEP_TOTAL, next))
      if (clamped === activeStep) return
      e.preventDefault()
      goStep(clamped, { suppressScrollSync: true })
    }

    root.addEventListener('keydown', onKeyDown)
    return () => root.removeEventListener('keydown', onKeyDown)
  }, [activeStep, goStep])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    const cardIds = [1, 2, 3, 4].map((n) => `workflow-card-${n}`)
    let observer: IntersectionObserver | null = null
    const ratios = new Map<number, number>()

    const attach = () => {
      if (!mq.matches) return
      const cards = cardIds
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => !!el)
      if (!cards.length) return

      observer = new IntersectionObserver(
        (entries) => {
          if (Date.now() < scrollSyncSuppressUntil.current) return
          for (const entry of entries) {
            const m = entry.target.id.match(/workflow-card-(\d)/)
            if (!m) continue
            ratios.set(Number(m[1]), entry.intersectionRatio)
          }
          let best = 1
          let bestRatio = 0
          for (const [n, r] of ratios) {
            if (r > bestRatio) {
              bestRatio = r
              best = n
            }
          }
          if (bestRatio >= 0.28) setActiveStep(best)
        },
        { threshold: [0, 0.15, 0.28, 0.45, 0.65, 0.85, 1], rootMargin: '-14% 0px -14% 0px' },
      )
      cards.forEach((c) => observer!.observe(c))
    }

    const onMq = () => {
      observer?.disconnect()
      observer = null
      ratios.clear()
      if (mq.matches) attach()
    }

    onMq()
    mq.addEventListener('change', onMq)
    return () => {
      mq.removeEventListener('change', onMq)
      observer?.disconnect()
    }
  }, [])

  return (
    <section ref={sectionRef} id="workflow" className="section workflow-section" aria-labelledby="workflow-heading">
      <div className="container">
        <div className="section-heading">
          <div className="section-label reveal">{t('workflow_label')}</div>
          <h2 id="workflow-heading" className="section-title reveal">
            {t('workflow_title')}
          </h2>
          <p className="section-desc reveal">{t('workflow_desc')}</p>
        </div>
        <p className="workflow-live-region" aria-live="polite" aria-atomic="true">
          {t('workflow_announcer', {
            step: activeStep,
            total: STEP_TOTAL,
            title: t(`workflow_s${activeStep}_title` as const),
          })}
        </p>
        <div className="workflow-subnav reveal" role="region" aria-label={t('workflow_rail_label')}>
          <p className="workflow-hint">{t('workflow_interactive_hint')}</p>
          <div className="workflow-rail-track">
            <div className="workflow-rail">
              {steps.map((step) => (
                <button
                  key={step.n}
                  type="button"
                  className={[
                    'workflow-rail-seg',
                    step.n <= activeStep ? 'is-filled' : '',
                    step.n === activeStep ? 'is-current' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-current={step.n === activeStep ? 'step' : undefined}
                  aria-label={t(step.titleKey)}
                  onClick={() => goStep(step.n, { suppressScrollSync: true })}
                >
                  <span aria-hidden="true">{step.n}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="workflow-rail-nav">
            <button
              type="button"
              className="workflow-nav-btn"
              onClick={() => goStep(activeStep - 1, { suppressScrollSync: true })}
              disabled={activeStep <= 1}
              aria-label={t('workflow_prev_step')}
            >
              ‹
            </button>
            <button
              type="button"
              className="workflow-nav-btn"
              onClick={() => goStep(activeStep + 1, { suppressScrollSync: true })}
              disabled={activeStep >= STEP_TOTAL}
              aria-label={t('workflow_next_step')}
            >
              ›
            </button>
          </div>
        </div>
        <ol className="workflow-steps reveal" aria-label={t('workflow_title')}>
          {steps.map((step, i) => {
            const bodyText = t(step.bodyKey, { defaultValue: '' }).trim()
            const bullets = step.bulletKeys
              .map((k) => t(k, { defaultValue: '' }).trim())
              .filter(Boolean)
            const deliverText = t(step.deliverKey, { defaultValue: '' }).trim()
            const expandText = t(step.expandKey, { defaultValue: '' }).trim()
            return (
            <li
              key={step.n}
              id={`workflow-card-${step.n}`}
              data-workflow-step={step.n}
              className={['workflow-step', step.n === activeStep ? 'workflow-step--active' : '']
                .filter(Boolean)
                .join(' ')}
              tabIndex={0}
              aria-label={
                step.n === activeStep
                  ? t('workflow_card_aria_current', {
                      step: step.n,
                      total: STEP_TOTAL,
                      title: t(step.titleKey),
                    })
                  : t('workflow_card_aria', {
                      step: step.n,
                      total: STEP_TOTAL,
                      title: t(step.titleKey),
                    })
              }
              onClick={() => goStep(step.n, { suppressScrollSync: true })}
              onKeyDown={(e) => {
                if (e.key !== 'Enter' && e.key !== ' ') return
                e.preventDefault()
                goStep(step.n, { suppressScrollSync: true })
              }}
            >
              <div className="workflow-step-index" aria-hidden="true">
                <span>{step.n}</span>
              </div>
              <div className="workflow-step-body">
                <h3>{t(step.titleKey)}</h3>
                {bodyText ? <p>{bodyText}</p> : null}
                {bullets.length ? (
                    <ul className="workflow-step-bullets workflow-step-bullets--minimal">
                      {bullets.map((text, idx) => (
                        <li key={idx}>{text}</li>
                      ))}
                    </ul>
                ) : null}
                {expandText ? (
                  <details
                    className="workflow-step-details"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <summary className="workflow-step-details-summary">{t('workflow_expand_summary')}</summary>
                    <p className="workflow-step-details-body">{expandText}</p>
                  </details>
                ) : null}
              </div>
              {deliverText ? <div className="workflow-step-deliver">{deliverText}</div> : null}
              {i < steps.length - 1 ? <div className="workflow-connector" aria-hidden="true" /> : null}
            </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
