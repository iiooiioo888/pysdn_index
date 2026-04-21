import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useReveal } from '../hooks/useAnimations'

export function FaqSection() {
  const { t } = useTranslation()
  const observe = useReveal()

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll('#faq .reveal:not(.visible)').forEach((el) => observe(el))
    }, 60)
    return () => clearTimeout(timer)
  }, [observe])
  const items = Array.from({ length: 16 }, (_, i) => i + 1).map((n) => ({
    n,
    qKey: `faq_${n}_q` as const,
    aKey: `faq_${n}_a` as const,
  }))

  return (
    <section id="faq" className="section faq-section">
      <div className="container">
        <div className="section-heading">
          <div className="section-label reveal">{t('faq_label')}</div>
          <h2 className="section-title reveal">{t('faq_title')}</h2>
          <p className="section-desc reveal">{t('faq_desc')}</p>
        </div>
        <div className="faq-list reveal">
          {items.map((item) => (
            <details key={item.n} className="faq-item">
              <summary className="faq-summary">{t(item.qKey)}</summary>
              <div className="faq-answer">
                <p>{t(item.aKey)}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
