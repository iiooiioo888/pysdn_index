import { useTranslation } from 'react-i18next'

const FEATURES = [
  { num: '01', titleKey: 'feat1_title', descKey: 'feat1_desc', tagKey: 'feat1_tag', icon: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" role="img" aria-label="Layers">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  )},
  { num: '02', titleKey: 'feat2_title', descKey: 'feat2_desc', tagKey: 'feat2_tag', icon: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" role="img" aria-label="Globe">
      <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  )},
  { num: '03', titleKey: 'feat3_title', descKey: 'feat3_desc', tagKey: 'feat3_tag', icon: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" role="img" aria-label="Lightning">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  )},
  { num: '04', titleKey: 'feat4_title', descKey: 'feat4_desc', tagKey: 'feat4_tag', icon: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" role="img" aria-label="Layout">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
    </svg>
  )},
] as const

const STATS = [
  { numKey: 'about_stat_models_num', labelKey: 'about_stat_models' },
  { numKey: 'about_stat_pipeline_num', labelKey: 'about_stat_pipeline' },
  { numKey: 'about_stat_export_num', labelKey: 'about_stat_export' },
  { numKey: 'about_stat_modules_num', labelKey: 'about_stat_modules' },
] as const

export function About() {
  const { t } = useTranslation()

  return (
    <section id="about" className="section about">
      <div className="container">
        {/* Heading */}
        <div className="section-heading">
          <div className="section-label reveal">{t('about_label')}</div>
          <h2 className="section-title reveal">{t('about_title')}</h2>
          <p className="section-desc reveal">{t('about_desc')}</p>
        </div>

        {/* Stats Strip */}
        <div className="reveal flex items-center justify-center gap-5 sm:gap-8 flex-wrap mb-10 sm:mb-16 p-5 sm:p-8 bg-gradient-to-br from-primary-500/[0.06] to-accent-500/[0.04] border border-white/[0.09] rounded-panel shadow-glow">
          {STATS.map((s, i) => (
            <div key={s.numKey} className="contents">
              {i > 0 && <div className="w-px h-10 bg-border" aria-hidden="true" />}
              <div className="text-center">
                <span className="block text-[1.6rem] font-extrabold bg-gradient-to-br from-primary-500 to-accent-500 bg-clip-text text-transparent">{t(s.numKey)}</span>
                <span className="block text-ui text-text-muted mt-1">{t(s.labelKey)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pain vs Gain */}
        <div className="reveal grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 mb-16 items-stretch">
          <div className="p-5 sm:p-8 rounded-panel border border-red-500/10 bg-red-500/[0.03] shadow-[0_8px_28px_rgba(0,0,0,0.14)]">
            <h4 className="text-base font-bold text-white mb-4">❌ {t('about_pain_title', '傳統痛點')}</h4>
            <ul className="flex flex-col gap-2.5">
              {[1,2,3,4].map((n) => (
                <li key={n} className="text-body-lg text-text-dim pl-2 border-l-2 border-white/[0.06]">
                  {t(`about_pain_${n}`)}
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden lg:flex items-center justify-center w-10 shrink-0 text-text-muted">
            <span className="block w-3.5 h-3.5 border-r-2 border-b-2 border-current -rotate-45" aria-hidden="true" />
          </div>
          <div className="p-5 sm:p-8 rounded-panel border border-emerald/10 bg-emerald/[0.03] shadow-[0_8px_28px_rgba(0,0,0,0.14)]">
            <h4 className="text-base font-bold text-white mb-4">✅ {t('about_gain_title', 'SuperCool 方案')}</h4>
            <ul className="flex flex-col gap-2.5">
              {[1,2,3,4].map((n) => (
                <li key={n} className="text-body-lg text-text-dim pl-2 border-l-2 border-white/[0.06]">
                  {t(`about_gain_${n}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {FEATURES.map((feat) => (
            <div
              className="reveal relative overflow-hidden p-5 sm:p-8 bg-gradient-to-br from-white/[0.04] to-white/[0.015] border border-white/[0.09] rounded-panel transition-all duration-300 hover:border-primary-500/[0.28] hover:bg-white/[0.06] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.28)] shadow-glow"
              key={feat.num}
            >
              <span className="block font-mono text-caption text-text-muted opacity-50 mb-4" aria-hidden="true">{feat.num}</span>
              <div className="w-12 h-12 flex items-center justify-center bg-primary-500/[0.08] rounded-panel mb-4 text-primary-500" aria-hidden="true">
                {feat.icon}
              </div>
              <h3 className="text-[1.05rem] font-bold text-white mb-2.5">{t(feat.titleKey)}</h3>
              <p className="text-ui text-text-dim leading-relaxed mb-4">{t(feat.descKey)}</p>
              <div className="inline-block px-3 py-1 text-caption font-semibold text-primary-500 bg-primary-500/[0.08] rounded-full tracking-wide">
                {t(feat.tagKey)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
