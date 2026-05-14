import { useTranslation } from 'react-i18next'

const FAQ_COUNT = 16

export function FaqSection() {
  const { t } = useTranslation()

  return (
    <section id="faq" className="section faq-section scroll-mt-[88px]">
      <div className="container">
        <div className="section-heading">
          <div className="section-label reveal">{t('faq_label')}</div>
          <h2 className="section-title reveal">{t('faq_title')}</h2>
          <p className="section-desc reveal">{t('faq_desc')}</p>
        </div>
        <div className="reveal max-w-[var(--layout-prose-max,min(56rem,100%))] mx-auto flex flex-col gap-3">
          {Array.from({ length: FAQ_COUNT }, (_, i) => i + 1).map((n) => (
            <details
              key={n}
              className="group border border-white/[0.09] rounded-panel bg-white/[0.035] shadow-[0_6px_24px_rgba(0,0,0,0.12)] overflow-hidden"
            >
              <summary className="list-none cursor-pointer p-[clamp(14px,3vw,18px)] min-h-[48px] flex items-center justify-between gap-3 text-body font-semibold text-text leading-snug [&::-webkit-details-marker]:hidden">
                {t(`faq_${n}_q`)}
                <span className="shrink-0 text-primary-500 font-bold text-[1.1rem] leading-none group-open:hidden">+</span>
                <span className="shrink-0 text-primary-500 font-bold text-[1.1rem] leading-none hidden group-open:inline">−</span>
              </summary>
              <div className="px-5 pb-[18px] border-t border-white/[0.06]">
                <p className="mt-3.5 text-body-lg text-text-dim leading-[1.7]">
                  {t(`faq_${n}_a`)}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
