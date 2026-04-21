import { Link } from 'react-router-dom'
import type { DocLang } from '../../hooks/useDocBundle'
import { PATHS } from '../../routes/paths'
import { toLangSearch } from '../../routes/langQuery'

export function DocFooter({
  t,
  lang,
}: {
  t: (key: string) => string
  lang: DocLang
}) {
  const langSearch = toLangSearch(lang)
  const modulesTo = { pathname: PATHS.modules, search: langSearch }
  const homeTo = { pathname: PATHS.home, search: langSearch }

  return (
    <footer className="doc-footer">
      <p>
        <span>{t('footer_copy')}</span>{' '}
        <Link to={modulesTo}>
          <span>{t('footer_modules')}</span>
        </Link>
        {' · '}
        <Link to={homeTo}>
          <span>{t('footer_home')}</span>
        </Link>
      </p>
    </footer>
  )
}
