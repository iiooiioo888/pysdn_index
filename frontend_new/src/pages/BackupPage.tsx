import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useI18nRerender } from '../hooks/useI18nRerender'
import { useLangQuery } from '../hooks/useLangQuery'
import { PATHS } from '../routes/paths'
import { RealmsPageShell } from './realms/RealmsPageShell'

/* ─── Architecture node types ─── */
type ArchNode = {
  id: string
  icon: string
  titleKey: string
  descKey: string
  accent: 'cyan' | 'violet' | 'emerald' | 'amber'
}

const ARCH_NODES: ArchNode[] = [
  { id: 'collect', icon: '📥', titleKey: 'backup_arch_collect_title', descKey: 'backup_arch_collect_desc', accent: 'cyan' },
  { id: 'process', icon: '⚙️', titleKey: 'backup_arch_process_title', descKey: 'backup_arch_process_desc', accent: 'violet' },
  { id: 'store', icon: '💾', titleKey: 'backup_arch_store_title', descKey: 'backup_arch_store_desc', accent: 'emerald' },
  { id: 'verify', icon: '✅', titleKey: 'backup_arch_verify_title', descKey: 'backup_arch_verify_desc', accent: 'amber' },
]

/* ─── Feature cards ─── */
type FeatureCard = {
  id: string
  icon: string
  titleKey: string
  descKey: string
  tags: string[]
}

const FEATURES: FeatureCard[] = [
  {
    id: 'auto-backup',
    icon: '🔄',
    titleKey: 'backup_feat_auto_title',
    descKey: 'backup_feat_auto_desc',
    tags: ['backup_tag_auto', 'backup_tag_zero_touch'],
  },
  {
    id: 'multi-platform',
    icon: '🌐',
    titleKey: 'backup_feat_platform_title',
    descKey: 'backup_feat_platform_desc',
    tags: ['backup_tag_multi', 'backup_tag_sync'],
  },
  {
    id: 'versioning',
    icon: '📜',
    titleKey: 'backup_feat_version_title',
    descKey: 'backup_feat_version_desc',
    tags: ['backup_tag_version', 'backup_tag_rollback'],
  },
  {
    id: 'encryption',
    icon: '🔒',
    titleKey: 'backup_feat_encrypt_title',
    descKey: 'backup_feat_encrypt_desc',
    tags: ['backup_tag_security', 'backup_tag_e2e'],
  },
  {
    id: 'dedup',
    icon: '🧹',
    titleKey: 'backup_feat_dedup_title',
    descKey: 'backup_feat_dedup_desc',
    tags: ['backup_tag_efficiency', 'backup_tag_smart'],
  },
  {
    id: 'monitoring',
    icon: '📊',
    titleKey: 'backup_feat_monitor_title',
    descKey: 'backup_feat_monitor_desc',
    tags: ['backup_tag_alert', 'backup_tag_dashboard'],
  },
]

/* ─── Stats ─── */
type StatItem = {
  value: string
  labelKey: string
}

const STATS: StatItem[] = [
  { value: '0', labelKey: 'backup_stat_maintenance' },
  { value: '99.99%', labelKey: 'backup_stat_uptime' },
  { value: 'AES-256', labelKey: 'backup_stat_encryption' },
  { value: '∞', labelKey: 'backup_stat_versions' },
]

/* ─── Tech stack ─── */
type TechItem = {
  name: string
  descKey: string
  category: 'storage' | 'compute' | 'security' | 'monitor'
}

const TECH_STACK: TechItem[] = [
  { name: 'PostgreSQL', descKey: 'backup_tech_pg', category: 'storage' },
  { name: 'Redis', descKey: 'backup_tech_redis', category: 'compute' },
  { name: 'S3 / MinIO', descKey: 'backup_tech_s3', category: 'storage' },
  { name: 'NATS', descKey: 'backup_tech_nats', category: 'compute' },
  { name: 'AES-256-GCM', descKey: 'backup_tech_aes', category: 'security' },
  { name: 'Prometheus', descKey: 'backup_tech_prom', category: 'monitor' },
  { name: 'Grafana', descKey: 'backup_tech_grafana', category: 'monitor' },
  { name: 'Docker', descKey: 'backup_tech_docker', category: 'compute' },
]

/* ─── SVG Icons ─── */
function ShieldIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

function CloudIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  )
}

function DatabaseIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
    </svg>
  )
}

function ZapIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function ArrowRightIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  )
}

const CATEGORY_ICONS: Record<string, string> = {
  storage: '💾',
  compute: '⚡',
  security: '🔒',
  monitor: '📊',
}

/* ─── Component ─── */
export function BackupPage() {
  const { t } = useTranslation()
  useI18nRerender()
  const langSearch = useLangQuery()
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'features' | 'tech'>('overview')

  const tabs = useMemo(() => [
    { id: 'overview' as const, labelKey: 'backup_tab_overview' },
    { id: 'architecture' as const, labelKey: 'backup_tab_arch' },
    { id: 'features' as const, labelKey: 'backup_tab_features' },
    { id: 'tech' as const, labelKey: 'backup_tab_tech' },
  ], [])

  return (
    <RealmsPageShell>
      <main className="realms-page-main" id="backup-page">
        {/* ─── Hero ─── */}
        <div className="container realms-page-hero realms-page-hero--cyan">
          <nav className="realms-breadcrumb" aria-label={t('realms_breadcrumb_aria')}>
            <Link className="realms-bc-link" to={{ pathname: PATHS.home, search: langSearch }}>{t('nav_home')}</Link>
            <span className="realms-bc-sep" aria-hidden="true">/</span>
            <span className="realms-bc-current">{t('backup_breadcrumb')}</span>
          </nav>

          <div className="backup-hero-icon-row">
            <span className="backup-hero-icon backup-hero-icon--cyan"><CloudIcon size={32} /></span>
            <span className="backup-hero-icon backup-hero-icon--violet"><DatabaseIcon size={32} /></span>
            <span className="backup-hero-icon backup-hero-icon--emerald"><ShieldIcon size={32} /></span>
          </div>

          <h1 className="realms-page-title">{t('backup_hero_title')}</h1>
          <p className="realms-page-lead">{t('backup_hero_lead')}</p>
          <p className="realms-page-flow">{t('backup_hero_sub')}</p>

          {/* Stats row */}
          <div className="backup-stats-row">
            {STATS.map((s) => (
              <div key={s.labelKey} className="backup-stat-card">
                <span className="backup-stat-value">{s.value}</span>
                <span className="backup-stat-label">{t(s.labelKey)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Tab navigation ─── */}
        <div className="container backup-tab-nav-wrap">
          <div className="backup-tab-nav" role="tablist" aria-label={t('backup_tabs_aria')}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`backup-tab ${activeTab === tab.id ? 'backup-tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {t(tab.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Tab content ─── */}
        <div className="container backup-content">

          {/* Overview */}
          {activeTab === 'overview' && (
            <section className="backup-section" aria-label={t('backup_tab_overview')}>
              <div className="backup-overview-grid">
                <div className="backup-overview-card backup-overview-card--hero">
                  <div className="backup-overview-icon"><ZapIcon size={28} /></div>
                  <h2>{t('backup_overview_hero_title')}</h2>
                  <p>{t('backup_overview_hero_desc')}</p>
                </div>
                <div className="backup-overview-card">
                  <div className="backup-overview-icon">🎯</div>
                  <h3>{t('backup_overview_pain_title')}</h3>
                  <p>{t('backup_overview_pain_desc')}</p>
                </div>
                <div className="backup-overview-card">
                  <div className="backup-overview-icon">💡</div>
                  <h3>{t('backup_overview_solution_title')}</h3>
                  <p>{t('backup_overview_solution_desc')}</p>
                </div>
                <div className="backup-overview-card">
                  <div className="backup-overview-icon">🚀</div>
                  <h3>{t('backup_overview_benefit_title')}</h3>
                  <p>{t('backup_overview_benefit_desc')}</p>
                </div>
              </div>

              {/* Key selling points */}
              <div className="backup-selling-points">
                <h2 className="backup-section-title">{t('backup_selling_title')}</h2>
                <div className="backup-sp-grid">
                  {[
                    { icon: '🔄', titleKey: 'backup_sp_auto_title', descKey: 'backup_sp_auto_desc' },
                    { icon: '🛡️', titleKey: 'backup_sp_secure_title', descKey: 'backup_sp_secure_desc' },
                    { icon: '📈', titleKey: 'backup_sp_scale_title', descKey: 'backup_sp_scale_desc' },
                    { icon: '🧩', titleKey: 'backup_sp_integrate_title', descKey: 'backup_sp_integrate_desc' },
                  ].map((sp) => (
                    <div key={sp.titleKey} className="backup-sp-card">
                      <span className="backup-sp-icon">{sp.icon}</span>
                      <h4>{t(sp.titleKey)}</h4>
                      <p>{t(sp.descKey)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Architecture */}
          {activeTab === 'architecture' && (
            <section className="backup-section" aria-label={t('backup_tab_arch')}>
              <h2 className="backup-section-title">{t('backup_arch_title')}</h2>
              <p className="backup-section-desc">{t('backup_arch_desc')}</p>

              {/* Flow diagram */}
              <div className="backup-arch-flow">
                {ARCH_NODES.map((node, i) => (
                  <div key={node.id} className="backup-arch-flow-step">
                    {i > 0 && <div className="backup-arch-flow-arrow">→</div>}
                    <div className={`backup-arch-node backup-arch-node--${node.accent}`}>
                      <span className="backup-arch-node-icon">{node.icon}</span>
                      <h4>{t(node.titleKey)}</h4>
                      <p>{t(node.descKey)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Architecture layers */}
              <div className="backup-arch-layers">
                <h3 className="backup-section-subtitle">{t('backup_arch_layers_title')}</h3>
                <div className="backup-layer-stack">
                  {[
                    { name: 'backup_layer_app', accent: 'cyan', items: ['backup_layer_app_1', 'backup_layer_app_2', 'backup_layer_app_3'] },
                    { name: 'backup_layer_service', accent: 'violet', items: ['backup_layer_svc_1', 'backup_layer_svc_2', 'backup_layer_svc_3'] },
                    { name: 'backup_layer_data', accent: 'emerald', items: ['backup_layer_data_1', 'backup_layer_data_2', 'backup_layer_data_3'] },
                    { name: 'backup_layer_infra', accent: 'amber', items: ['backup_layer_infra_1', 'backup_layer_infra_2', 'backup_layer_infra_3'] },
                  ].map((layer) => (
                    <div key={layer.name} className={`backup-layer backup-layer--${layer.accent}`}>
                      <div className="backup-layer-header">
                        <span className="backup-layer-name">{t(layer.name)}</span>
                      </div>
                      <div className="backup-layer-items">
                        {layer.items.map((item) => (
                          <span key={item} className="backup-layer-item">{t(item)}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zero maintenance highlights */}
              <div className="backup-zero-maint">
                <h3 className="backup-section-subtitle">{t('backup_zero_maint_title')}</h3>
                <div className="backup-zero-grid">
                  {[
                    { icon: '🔁', titleKey: 'backup_zero_auto_heal_title', descKey: 'backup_zero_auto_heal_desc' },
                    { icon: '📊', titleKey: 'backup_zero_smart_alert_title', descKey: 'backup_zero_smart_alert_desc' },
                    { icon: '📦', titleKey: 'backup_zero_auto_scale_title', descKey: 'backup_zero_auto_scale_desc' },
                    { icon: '🔧', titleKey: 'backup_zero_self_config_title', descKey: 'backup_zero_self_config_desc' },
                  ].map((item) => (
                    <div key={item.titleKey} className="backup-zero-card">
                      <span className="backup-zero-icon">{item.icon}</span>
                      <h4>{t(item.titleKey)}</h4>
                      <p>{t(item.descKey)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Features */}
          {activeTab === 'features' && (
            <section className="backup-section" aria-label={t('backup_tab_features')}>
              <h2 className="backup-section-title">{t('backup_features_title')}</h2>
              <p className="backup-section-desc">{t('backup_features_desc')}</p>

              <div className="backup-features-grid">
                {FEATURES.map((feat) => (
                  <article key={feat.id} className="backup-feature-card">
                    <div className="backup-feature-header">
                      <span className="backup-feature-icon">{feat.icon}</span>
                      <h3>{t(feat.titleKey)}</h3>
                    </div>
                    <p className="backup-feature-desc">{t(feat.descKey)}</p>
                    <div className="backup-feature-tags">
                      {feat.tags.map((tagKey) => (
                        <span key={tagKey} className="backup-feature-tag">{t(tagKey)}</span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              {/* Workflow */}
              <div className="backup-workflow">
                <h3 className="backup-section-subtitle">{t('backup_workflow_title')}</h3>
                <div className="backup-workflow-steps">
                  {[
                    { step: '1', titleKey: 'backup_wf_step1_title', descKey: 'backup_wf_step1_desc', accent: 'cyan' },
                    { step: '2', titleKey: 'backup_wf_step2_title', descKey: 'backup_wf_step2_desc', accent: 'violet' },
                    { step: '3', titleKey: 'backup_wf_step3_title', descKey: 'backup_wf_step3_desc', accent: 'emerald' },
                    { step: '4', titleKey: 'backup_wf_step4_title', descKey: 'backup_wf_step4_desc', accent: 'amber' },
                  ].map((wf, i) => (
                    <div key={wf.step} className="backup-wf-step">
                      {i > 0 && <div className="backup-wf-arrow">→</div>}
                      <div className={`backup-wf-dot backup-wf-dot--${wf.accent}`}>{wf.step}</div>
                      <div className="backup-wf-content">
                        <h4>{t(wf.titleKey)}</h4>
                        <p>{t(wf.descKey)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Tech Stack */}
          {activeTab === 'tech' && (
            <section className="backup-section" aria-label={t('backup_tab_tech')}>
              <h2 className="backup-section-title">{t('backup_tech_title')}</h2>
              <p className="backup-section-desc">{t('backup_tech_desc')}</p>

              <div className="backup-tech-grid">
                {TECH_STACK.map((tech) => (
                  <div key={tech.name} className={`backup-tech-card backup-tech-card--${tech.category}`}>
                    <div className="backup-tech-header">
                      <span className="backup-tech-cat-icon">{CATEGORY_ICONS[tech.category]}</span>
                      <span className="backup-tech-name">{tech.name}</span>
                    </div>
                    <p className="backup-tech-desc">{t(tech.descKey)}</p>
                    <span className="backup-tech-category">{t(`backup_tech_cat_${tech.category}`)}</span>
                  </div>
                ))}
              </div>

              {/* Deployment options */}
              <div className="backup-deploy">
                <h3 className="backup-section-subtitle">{t('backup_deploy_title')}</h3>
                <div className="backup-deploy-grid">
                  {[
                    { titleKey: 'backup_deploy_local_title', descKey: 'backup_deploy_local_desc', icon: '💻', accent: 'cyan' },
                    { titleKey: 'backup_deploy_docker_title', descKey: 'backup_deploy_docker_desc', icon: '🐳', accent: 'violet' },
                    { titleKey: 'backup_deploy_cloud_title', descKey: 'backup_deploy_cloud_desc', icon: '☁️', accent: 'emerald' },
                  ].map((d) => (
                    <div key={d.titleKey} className={`backup-deploy-card backup-deploy-card--${d.accent}`}>
                      <span className="backup-deploy-icon">{d.icon}</span>
                      <h4>{t(d.titleKey)}</h4>
                      <p>{t(d.descKey)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* ─── CTA ─── */}
        <div className="container backup-cta-section">
          <div className="backup-cta-box">
            <h2>{t('backup_cta_title')}</h2>
            <p>{t('backup_cta_desc')}</p>
            <div className="backup-cta-actions">
              <Link className="realms-ix-link realms-ix-link--primary" to={{ pathname: PATHS.home, hash: '#contact', search: langSearch }}>
                {t('backup_cta_contact')}
                <ArrowRightIcon size={16} />
              </Link>
              <a className="realms-ix-link realms-ix-link--ghost" href="https://github.com/iiooiioo888" target="_blank" rel="noopener noreferrer">
                {t('backup_cta_github')}
                <span className="ui-chevron-right" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </RealmsPageShell>
  )
}
