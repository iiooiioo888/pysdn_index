import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { prefersReducedMotion } from '../lib/motionPreference'

export function WorkflowSection() {
  const { t } = useTranslation()
  const [activeStep, setActiveStep] = useState(1)

  const goStep = useCallback((n: number) => {
    const clamped = Math.max(1, Math.min(4, n))
    setActiveStep(clamped)
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

  return (
    <section id="workflow" className="section workflow-section">
      <div className="container">
        <div className="section-heading">
          <div className="section-label reveal">{t('workflow_label')}</div>
          <h2 className="section-title reveal">{t('workflow_title')}</h2>
          <p className="section-desc reveal">{t('workflow_desc')}</p>
        </div>
        <div className="workflow-subnav reveal" role="region" aria-label={t('workflow_rail_label')}>
          <p className="workflow-hint">{t('workflow_interactive_hint')}</p>
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
                onClick={() => goStep(step.n)}
              >
                <span aria-hidden="true">{step.n}</span>
              </button>
            ))}
          </div>
          <div className="workflow-rail-nav">
            <button
              type="button"
              className="workflow-nav-btn"
              onClick={() => goStep(activeStep - 1)}
              disabled={activeStep <= 1}
              aria-label={t('workflow_prev_step')}
            >
              ‹
            </button>
            <button
              type="button"
              className="workflow-nav-btn"
              onClick={() => goStep(activeStep + 1)}
              disabled={activeStep >= 4}
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
              onClick={() => goStep(step.n)}
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
