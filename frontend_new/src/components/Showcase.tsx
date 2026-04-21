import { useTranslation } from 'react-i18next'

export function Showcase() {
  const { t } = useTranslation()

  const cards = [
    {
      accent: 'cyan',
      icon: '📱',
      titleKey: 'sc1_title',
      descKey: 'sc1_desc',
      tagKey: 'sc1_tag',
      time: '45 sec',
    },
    {
      accent: 'violet',
      icon: '🛍️',
      titleKey: 'sc2_title',
      descKey: 'sc2_desc',
      tagKey: 'sc2_tag',
      time: '8 min',
    },
    {
      accent: 'emerald',
      icon: '📲',
      titleKey: 'sc3_title',
      descKey: 'sc3_desc',
      tagKey: 'sc3_tag',
      time: '6 min',
    },
  ]

  return (
    <section id="showcase" className="section showcase">
      <div className="container">
        <div className="section-heading">
          <div className="section-label reveal">{t('showcase_label')}</div>
          <h2 className="section-title reveal">{t('showcase_title')}</h2>
        </div>
        <div className="showcase-grid">
          {cards.map((card, i) => (
            <div className="showcase-card reveal" key={i}>
              <div className={`card-visual card-visual--accent-${card.accent} ${i === 0 ? 'media-card media-card-autoplay' : ''}`}>
                {i === 0 ? (
                  <>
                    <div className="showcase-video-placeholder media-image">
                      <div className="card-icon" aria-hidden="true">{card.icon}</div>
                      <span className="showcase-video-badge">REAL GEN VIDEO</span>
                    </div>
                    <video
                      className="media-preview media-video"
                      muted
                      loop
                      autoPlay
                      playsInline
                      preload="none"
                      poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230a0a1a'/%3E%3Cstop offset='.5' stop-color='%23111827'/%3E%3Cstop offset='1' stop-color='%230a0a1a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='640' height='360'/%3E%3Ctext x='320' y='180' text-anchor='middle' dominant-baseline='central' fill='%23374151' font-family='sans-serif' font-size='18'%3E▶ Loading%3C/text%3E%3C/svg%3E"
                      aria-label="Real generated showcase video"
                    >
                      <source src="assets/319.webm" type="video/webm" />
                      <source src="assets/319.mp4" type="video/mp4" />
                    </video>
                  </>
                ) : (
                  <div className="card-icon" aria-hidden="true">{card.icon}</div>
                )}
              </div>
              <div className="card-body">
                <h4>{t(card.titleKey)}</h4>
                <p>{t(card.descKey)}</p>
                <div className="card-meta">
                  <span className="meta-tag">{t(card.tagKey)}</span>
                  <span className="meta-time">{card.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
