import { useTranslation } from 'react-i18next'
import { DocLayout, type DocVariant } from './DocLayout'

type LoadingTone = 'default' | 'lab'

type DocBundleLoadingShellProps = {
  variant: DocVariant
  loadError: boolean
  /** 與實驗室／面板頁主內區一致（`doc-sim-lab`） */
  tone?: LoadingTone
}

/**
 * 文件／實驗室／面板在 `useDocBundle` 尚未 ready 時的共用載入畫面，避免各頁重複排版。
 */
export function DocBundleLoadingShell({ variant, loadError, tone = 'default' }: DocBundleLoadingShellProps) {
  const { t } = useTranslation()
  const innerClass = tone === 'lab' ? 'doc-main-inner doc-sim-lab' : 'doc-main-inner'

  return (
    <DocLayout variant={variant}>
      <main className="doc-main">
        <div
          className={`${innerClass} doc-bundle-loading-inner${loadError ? ' doc-bundle-loading-inner--error' : ''}`}
        >
          <p className="doc-hero-lead doc-bundle-loading-lead">
            {loadError ? t('doc_page_load_error') : t('doc_page_loading')}
          </p>
        </div>
      </main>
    </DocLayout>
  )
}
