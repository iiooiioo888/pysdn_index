import { useTranslation } from 'react-i18next'
import { ThreeRealmsInteractive } from './ThreeRealmsInteractive'

export function ThreeRealmsSection() {
  const { t } = useTranslation()

  return (
    <section id="three-realms" className="section three-realms-section" aria-labelledby="three-realms-heading">
      <div className="container">
        <div className="section-heading">
          <div className="section-label reveal">{t('realms_label')}</div>
          <h2 id="three-realms-heading" className="section-title reveal">
            {t('realms_title')}
          </h2>
          <p className="section-desc reveal">{t('realms_desc')}</p>
        </div>

        <p className="three-realms-flow reveal">{t('realms_flow')}</p>

        <ThreeRealmsInteractive layout="embedded" showFullPageLink />
      </div>
    </section>
  )
}
