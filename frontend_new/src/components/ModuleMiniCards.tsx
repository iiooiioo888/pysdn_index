import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLangQuery } from '../hooks/useLangQuery'
import { PATHS } from '../routes/paths'

type Variant = 'products' | 'modules-panel'

const CARDS = [
  { id: 'forge', name: 'SuperForge', descKey: 'modules_split_cheat_forge', to: (s: string) => ({ pathname: PATHS.docs.superforge, search: s }), border: 'border-forge', bg: 'bg-forge/10' },
  { id: 'script', name: 'SuperScript', descKey: 'modules_split_cheat_script', to: (s: string) => ({ pathname: PATHS.docs.superscript, search: s }), border: 'border-script', bg: 'bg-script/10' },
  { id: 'track', name: 'SuperTrack', descKey: 'modules_split_cheat_track', to: (s: string) => ({ pathname: PATHS.docs.supertrack, search: s }), border: 'border-track', bg: 'bg-track/10' },
  { id: 'tune', name: 'SuperTune', descKey: 'modules_split_cheat_tune', to: (s: string) => ({ pathname: PATHS.docs.supertune, search: s }), border: 'border-tune', bg: 'bg-tune/10' },
] as const

const variantStyles: Record<Variant, string> = {
  'products': 'grid grid-cols-2 gap-3 sm:grid-cols-4',
  'modules-panel': 'flex flex-wrap gap-3',
}

export function ModuleMiniCards({ variant }: { variant: Variant }) {
  const { t } = useTranslation()
  const langSearch = useLangQuery()

  return (
    <ul className={variantStyles[variant]} aria-label={t('modules_mini_cards_label', 'Modules')}>
      {CARDS.map((c) => (
        <li key={c.id} className="min-w-0">
          <Link
            className={`group flex flex-col gap-1.5 rounded-xl border ${c.border} ${c.bg} p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20`}
            to={c.to(langSearch)}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-text-primary">{c.name}</span>
              <span className="whitespace-nowrap text-xs text-text-muted opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
                {t('modules_mini_cards_cta', 'Docs')} →
              </span>
            </div>
            <p className="text-xs leading-relaxed text-text-secondary line-clamp-3">{t(c.descKey, '')}</p>
          </Link>
        </li>
      ))}
    </ul>
  )
}

