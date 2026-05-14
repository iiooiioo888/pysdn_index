import { useTranslation } from 'react-i18next'

const CARDS = [
  { accent: 'cyan', accentGrad: 'from-primary-500/10 to-primary-500/[0.02]', icon: '📱', titleKey: 'sc1_title', descKey: 'sc1_desc', tagKey: 'sc1_tag', time: '45 sec' },
  { accent: 'violet', accentGrad: 'from-accent-500/10 to-accent-500/[0.02]', icon: '🛍️', titleKey: 'sc2_title', descKey: 'sc2_desc', tagKey: 'sc2_tag', time: '8 min' },
  { accent: 'emerald', accentGrad: 'from-emerald/10 to-emerald/[0.02]', icon: '📲', titleKey: 'sc3_title', descKey: 'sc3_desc', tagKey: 'sc3_tag', time: '6 min' },
] as const

export function Showcase() {
  const { t } = useTranslation()

  return (
    <section id="showcase" className="section showcase">
      <div className="container">
        <div className="section-heading">
          <div className="section-label reveal">{t('showcase_label')}</div>
          <h2 className="section-title reveal">{t('showcase_title')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {CARDS.map((card, i) => (
            <div
              className="reveal group bg-gradient-to-b from-white/[0.045] to-white/[0.02] border border-white/[0.09] rounded-panel overflow-hidden transition-all duration-300 hover:border-primary-500/25 hover:-translate-y-1 hover:shadow-card shadow-glow"
              key={i}
            >
              <div className={`relative aspect-[16/10] flex items-center justify-center overflow-hidden bg-gradient-to-br ${card.accentGrad}`}>
                {i === 0 ? (
                  <>
                    <div className="flex flex-col items-center justify-center gap-2 z-[1]">
                      <span className="text-[2.5rem]" aria-hidden="true">{card.icon}</span>
                      <span className="absolute top-3 right-3 px-2.5 py-0.5 text-meta font-bold tracking-wider text-red-500 bg-black/50 rounded-md">REAL GEN VIDEO</span>
                    </div>
                    <video
                      className="absolute inset-0 w-full h-full object-cover"
                      muted loop autoPlay playsInline preload="none"
                      poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230a0a1a'/%3E%3Cstop offset='.5' stop-color='%23111827'/%3E%3Cstop offset='1' stop-color='%230a0a1a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='640' height='360'/%3E%3Ctext x='320' y='180' text-anchor='middle' dominant-baseline='central' fill='%23374151' font-family='sans-serif' font-size='18'%3E▶ Loading%3C/text%3E%3C/svg%3E"
                      aria-label="Real generated showcase video"
                    >
                      <source src="assets/319.webm" type="video/webm" />
                      <source src="assets/319.mp4" type="video/mp4" />
                    </video>
                  </>
                ) : (
                  <>
                    <span className="text-[2.5rem] relative z-[1]" aria-hidden="true">{card.icon}</span>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </>
                )}
              </div>
              <div className="p-[clamp(18px,3.5vw,24px)]">
                <h4 className="text-[clamp(1.05rem,1.5vw,1.15rem)] font-bold text-white mb-2">{t(card.titleKey)}</h4>
                <p className="text-ui text-text-dim leading-relaxed mb-4">{t(card.descKey)}</p>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 text-caption font-semibold text-primary-500 bg-primary-500/[0.08] rounded-md">{t(card.tagKey)}</span>
                  <span className="text-caption text-text-muted">{card.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
