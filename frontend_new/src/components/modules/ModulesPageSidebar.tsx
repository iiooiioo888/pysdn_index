import { Link } from 'react-router-dom'
import { PATHS, type DocSlug } from '../../routes/paths'

type T = (key: string) => string

const MODULE_ANCHORS: { id: string; label: string }[] = [
  { id: 'module-forge', label: 'SuperForge' },
  { id: 'module-tune', label: 'SuperTune' },
  { id: 'module-track', label: 'SuperTrack' },
  { id: 'module-script', label: 'SuperScript' },
]

const DOC_LINKS: { slug: DocSlug; label: string }[] = [
  { slug: 'superforge', label: 'SuperForge' },
  { slug: 'supertune', label: 'SuperTune' },
  { slug: 'supertrack', label: 'SuperTrack' },
  { slug: 'superscript', label: 'SuperScript' },
]

export function ModulesPageSidebar({ tm, langSearch }: { tm: T; langSearch: string }) {
  return (
    <aside className="modules-sidebar" aria-label={tm('mod_side_title')}>
      <p className="modules-sidebar-title">{tm('mod_side_title')}</p>
      <nav className="modules-sidebar-nav">
        <a href="#mod-overview" className="modules-sidebar-link">
          {tm('mod_side_overview')}
        </a>
        <a href="#mod-doc-guide" className="modules-sidebar-link">
          {tm('mod_doc_guide_title')}
        </a>
        <a href="#mod-pipeline" className="modules-sidebar-link">
          {tm('mod_side_pipeline')}
        </a>
        <a href="#mod-videoflow" className="modules-sidebar-link">
          {tm('mod_side_videoflow')}
        </a>
        <a href="#mod-core" className="modules-sidebar-link">
          {tm('mod_side_core')}
        </a>
        {MODULE_ANCHORS.map((m) => (
          <a key={m.id} href={`#${m.id}`} className="modules-sidebar-link modules-sidebar-link--sub">
            {m.label}
          </a>
        ))}
        <a href="#mod-cross" className="modules-sidebar-link">
          {tm('mod_side_cross')}
        </a>

        <p className="modules-sidebar-group">{tm('mod_side_docs')}</p>
        {DOC_LINKS.map((d) => (
          <Link
            key={d.slug}
            to={{ pathname: PATHS.docs[d.slug], search: langSearch }}
            className="modules-sidebar-link modules-sidebar-link--doc"
          >
            {d.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
