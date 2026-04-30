import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { apiService } from '../lib/api'

export function Contact() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; message?: string }>({})

  const validate = (): boolean => {
    const errs: typeof fieldErrors = {}
    if (!formData.name.trim()) errs.name = t('form_err_name', '請填寫姓名')
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = t('form_err_email', '請填寫有效的電子信箱')
    if (!formData.message.trim()) errs.message = t('form_err_message', '請填寫需求內容')
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
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
      setFieldErrors({})
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
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                  value={formData.name}
                  onChange={(e) => { setFormData((p) => ({ ...p, name: e.target.value })); setFieldErrors((p) => ({ ...p, name: undefined })) }}
                />
                {fieldErrors.name && <p id="name-error" className="form-field-error" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{fieldErrors.name}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="email">{t('form_email')}</label>
                <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  placeholder={t('form_email_ph')}
                  required
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  value={formData.email}
                  onChange={(e) => { setFormData((p) => ({ ...p, email: e.target.value })); setFieldErrors((p) => ({ ...p, email: undefined })) }}
                />
                {fieldErrors.email && <p id="email-error" className="form-field-error" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{fieldErrors.email}</p>}
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
                aria-invalid={!!fieldErrors.message}
                aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                value={formData.message}
                onChange={(e) => { setFormData((p) => ({ ...p, message: e.target.value })); setFieldErrors((p) => ({ ...p, message: undefined })) }}
              />
              {fieldErrors.message && <p id="message-error" className="form-field-error" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{fieldErrors.message}</p>}
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
