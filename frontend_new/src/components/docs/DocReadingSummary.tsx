import type { DocBundleName } from '../../hooks/useDocBundle'

export type DocPageBundleName = Exclude<DocBundleName, 'modules'>

type TDoc = (key: string) => string

function looksLikeMissingKey(t: TDoc, key: string): boolean {
  const v = t(key)
  return !v || v === key
}

/**
 * 模組技術文件頁頂部「閱讀摘要」：內容來自 `src/locales/doc/{bundle}.json` 的 doc_summary_*。
 */
export function DocReadingSummary({ t, variant }: { t: TDoc; variant: DocPageBundleName }) {
  if (looksLikeMissingKey(t, 'doc_summary_title') || looksLikeMissingKey(t, 'doc_summary_p')) {
    return null
  }

  return (
    <aside className={`doc-reading-summary doc-reading-summary--${variant}`} aria-label={t('doc_summary_title')}>
      <p className="doc-reading-summary__label">{t('doc_summary_title')}</p>
      <p className="doc-reading-summary__text">{t('doc_summary_p')}</p>
    </aside>
  )
}
