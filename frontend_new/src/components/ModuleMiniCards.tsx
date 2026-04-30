import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLangQuery } from '../hooks/useLangQuery'
import { PATHS } from '../routes/paths'

type Variant = 'products' | 'modules-panel'

const CARDS = [
  { id: 'forge', name: 'SuperForge', descKey: 'modules_split_cheat_forge', to: (s: string) => ({ pathname: PATHS.docs.superforge, search: s }) },
  { id: 'script', name: 'SuperScript', descKey: 'modules_split_cheat_script', to: (s: string) => ({ pathname: PATHS.docs.superscript, search: s }) },
  { id: 'track', name: 'SuperTrack', descKey: 'modules_split_cheat_track', to: (s: string) => ({ pathname: PATHS.docs.supertrack, search: s }) },
  { id: 'tune', name: 'SuperTune', descKey: 'modules_split_cheat_tune', to: (s: string) => ({ pathname: PATHS.docs.supertune, search: s }) },
] as const

export function ModuleMiniCards({ variant }: { variant: Variant }) {
  const { t } = useTranslation()
  const langSearch = useLangQuery()

  return (
    <ul className={`mod-mini-cards mod-mini-cards--${variant}`} aria-label={t('modules_mini_cards_label', 'Modules')}>
      {CARDS.map((c) => (
        <li key={c.id}>
          <Link className={`mod-mini-card mod-mini-card--${c.id}`} to={c.to(langSearch)}>
            <div className="mod-mini-card-head">
              <span className="mod-mini-card-title">{c.name}</span>
              <span className="mod-mini-card-cta" aria-hidden="true">
                {t('modules_mini_cards_cta', 'Docs')} →
              </span>
            </div>
            <p className="mod-mini-card-desc">{t(c.descKey, '')}</p>
          </Link>
        </li>
      ))}
    </ul>
  )
}

