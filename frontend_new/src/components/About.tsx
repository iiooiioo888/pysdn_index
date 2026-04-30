import { useTranslation } from 'react-i18next'

export function About() {
  const { t } = useTranslation()

  const features = [
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
  ]

  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="section-heading">
          <div className="section-label reveal">{t('about_label')}</div>
          <h2 className="section-title reveal">{t('about_title')}</h2>
          <p className="section-desc reveal">{t('about_desc')}</p>
        </div>

        {/* Stats Strip */}
        <div className="about-stats reveal">
          <div className="about-stat">
            <span className="about-stat-num">{t('about_stat_models_num')}</span>
            <span className="about-stat-label">{t('about_stat_models')}</span>
          </div>
          <div className="about-stat-divider" aria-hidden="true" />
          <div className="about-stat">
            <span className="about-stat-num">{t('about_stat_pipeline_num')}</span>
            <span className="about-stat-label">{t('about_stat_pipeline')}</span>
          </div>
          <div className="about-stat-divider" aria-hidden="true" />
          <div className="about-stat">
            <span className="about-stat-num">{t('about_stat_export_num')}</span>
            <span className="about-stat-label">{t('about_stat_export')}</span>
          </div>
          <div className="about-stat-divider" aria-hidden="true" />
          <div className="about-stat">
            <span className="about-stat-num">{t('about_stat_modules_num')}</span>
            <span className="about-stat-label">{t('about_stat_modules')}</span>
          </div>
        </div>

        {/* Pain vs Gain */}
        <div className="about-compare reveal">
          <div className="about-compare-col about-compare-pain">
            <h4>❌ {t('about_pain_title', '傳統痛點')}</h4>
            <ul>
              <li>{t('about_pain_1', '來回切換 5+ 工具，流程碎片化')}</li>
              <li>{t('about_pain_2', '每次重來，版本無法追溯')}</li>
              <li>{t('about_pain_3', '生成品質不穩，交付靠運氣')}</li>
              <li>{t('about_pain_4', '角色、風格跨項目就跑掉')}</li>
            </ul>
          </div>
          <div className="about-compare-arrow" aria-hidden="true" />
          <div className="about-compare-col about-compare-gain">
            <h4>✅ {t('about_gain_title', 'SuperCool 方案')}</h4>
            <ul>
              <li>{t('about_gain_1', '一個介面串起生成、優化、追蹤全流程')}</li>
              <li>{t('about_gain_2', 'Git-like 版本樹，每次迭代可回溯')}</li>
              <li>{t('about_gain_3', '商業級品質＋一致性演算法雙保險')}</li>
              <li>{t('about_gain_4', '角色聲線鎖定＋風格知識庫跨項目複用')}</li>
            </ul>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="features-grid">
          {features.map((feat) => (
            <div className="feature-card reveal" key={feat.num}>
              <span className="feature-num" aria-hidden="true">{feat.num}</span>
              <div className="feature-icon" aria-hidden="true">{feat.icon}</div>
              <h3>{t(feat.titleKey)}</h3>
              <p>{t(feat.descKey)}</p>
              <div className="feature-tag">{t(feat.tagKey)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
