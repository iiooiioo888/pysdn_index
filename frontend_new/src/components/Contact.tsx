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
        name: formData.name, email: formData.email,
        company: formData.company, message: formData.message,
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

  const inputClass = 'w-full px-4 py-3 bg-white/[0.03] border border-border rounded-[10px] text-[1.0625rem] text-text outline-none transition-colors duration-200 focus:border-primary-500/40 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.08)] placeholder:text-text-muted'

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="section-heading">
          <div className="section-label reveal">{t('contact_label')}</div>
          <h2 className="section-title reveal">{t('contact_title')}</h2>
          <p className="section-desc reveal">{t('contact_desc')}</p>
        </div>
        <div className="max-w-[720px] mx-auto">
          <form
            className="reveal relative p-8 bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-border rounded-[var(--radius-lg)] shadow-[0_20px_48px_rgba(0,0,0,0.3)] before:content-[''] before:absolute before:top-0 before:left-6 before:right-6 before:h-[3px] before:rounded-b-lg before:bg-gradient-to-r before:from-primary-500 before:to-accent-500 before:opacity-85"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-ui font-medium text-text-dim mb-2">{t('form_name')}</label>
                <input type="text" id="name" autoComplete="name" placeholder={t('form_name_ph')} required
                  aria-invalid={!!fieldErrors.name} aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                  className={inputClass}
                  value={formData.name}
                  onChange={(e) => { setFormData((p) => ({ ...p, name: e.target.value })); setFieldErrors((p) => ({ ...p, name: undefined })) }}
                />
                {fieldErrors.name && <p id="name-error" className="text-red-500 text-[0.8rem] mt-1">{fieldErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-ui font-medium text-text-dim mb-2">{t('form_email')}</label>
                <input type="email" id="email" autoComplete="email" placeholder={t('form_email_ph')} required
                  aria-invalid={!!fieldErrors.email} aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  className={inputClass}
                  value={formData.email}
                  onChange={(e) => { setFormData((p) => ({ ...p, email: e.target.value })); setFieldErrors((p) => ({ ...p, email: undefined })) }}
                />
                {fieldErrors.email && <p id="email-error" className="text-red-500 text-[0.8rem] mt-1">{fieldErrors.email}</p>}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="company" className="block text-ui font-medium text-text-dim mb-2">{t('form_company')}</label>
              <input type="text" id="company" autoComplete="organization" placeholder={t('form_company_ph')}
                className={inputClass}
                value={formData.company}
                onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-ui font-medium text-text-dim mb-2">{t('form_message')}</label>
              <textarea id="message" rows={4} placeholder={t('form_message_ph')} required
                aria-invalid={!!fieldErrors.message} aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                className={`${inputClass} resize-none`}
                value={formData.message}
                onChange={(e) => { setFormData((p) => ({ ...p, message: e.target.value })); setFieldErrors((p) => ({ ...p, message: undefined })) }}
              />
              {fieldErrors.message && <p id="message-error" className="text-red-500 text-[0.8rem] mt-1">{fieldErrors.message}</p>}
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className={[
                'w-full mt-4 px-8 py-4 text-[1.0625rem] font-semibold rounded-full transition-all duration-250',
                submitted
                  ? 'bg-emerald/15 border border-emerald/30 text-emerald-light'
                  : 'bg-gradient-to-br from-primary-600 to-accent-600 text-white shadow-[0_4px_24px_rgba(6,182,212,0.22)] hover:-translate-y-0.5 hover:shadow-[0_10px_36px_rgba(6,182,212,0.32)]',
              ].join(' ')}
            >
              {submitted ? t('form_success') : loading ? 'Sending...' : t('form_submit')}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
