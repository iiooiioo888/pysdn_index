import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { apiService } from '../lib/api'

export function Contact() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await apiService.submitContact({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        message: formData.message,
      })
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ name: '', email: '', company: '', message: '' })
      }, 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="section-heading">
          <div className="section-label reveal">{t('contact_label')}</div>
          <h2 className="section-title reveal">{t('contact_title')}</h2>
          <p className="section-desc reveal">{t('contact_desc')}</p>
        </div>
        <div className="contact-grid">
          <div className="contact-info reveal">
            <div className="info-card">
              <span className="info-icon" aria-hidden="true">✉️</span>
              <div>
                <div className="info-label">{t('contact_email_label')}</div>
                <a href={`mailto:${t('contact_email_value')}`}>{t('contact_email_value')}</a>
              </div>
            </div>
            <div className="info-card">
              <span className="info-icon" aria-hidden="true">📍</span>
              <div>
                <div className="info-label">{t('contact_addr_label')}</div>
                <span>{t('contact_addr_value')}</span>
              </div>
            </div>
            <div className="info-card">
              <span className="info-icon" aria-hidden="true">⏱️</span>
              <div>
                <div className="info-label">{t('contact_response_label')}</div>
                <span>{t('contact_response_value')}</span>
              </div>
            </div>
            <div className="info-card">
              <span className="info-icon" aria-hidden="true">🌐</span>
              <div>
                <div className="info-label">{t('contact_social_label')}</div>
                <span>{t('contact_social_value')}</span>
              </div>
            </div>
            <p className="contact-side-note reveal">{t('contact_side_note')}</p>
          </div>
          <form className="contact-form-card reveal" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">{t('form_name')}</label>
                <input
                  type="text"
                  id="name"
                  autoComplete="name"
                  placeholder={t('form_name_ph')}
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">{t('form_email')}</label>
                <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  placeholder={t('form_email_ph')}
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="company">{t('form_company')}</label>
              <input
                type="text"
                id="company"
                autoComplete="organization"
                placeholder={t('form_company_ph')}
                value={formData.company}
                onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">{t('form_message')}</label>
              <textarea
                id="message"
                rows={4}
                placeholder={t('form_message_ph')}
                required
                value={formData.message}
                onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
              />
            </div>
            {error && <p className="form-error" style={{ color: '#ef4444', marginTop: '0.5rem' }}>{error}</p>}
            <button
              type="submit"
              className="btn btn-primary btn-lg btn-full"
              disabled={loading}
              style={submitted ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' } : {}}
            >
              <span className="btn-label" style={submitted || loading ? { display: 'none' } : {}}>{t('form_submit')}</span>
              <span className="btn-success" style={submitted ? { display: 'inline' } : { display: 'none' }}>{t('form_success')}</span>
              {loading && <span style={{ display: 'inline' }}>Sending...</span>}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
