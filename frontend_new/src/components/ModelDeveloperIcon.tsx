import { siAlibabacloud, siAmazonaws, siBytedance } from 'simple-icons'
import type { ModelDeveloper } from '../data/modelsCatalog'

/** OpenRouter 無收錄於 simple-icons，以格點象徵多模型聚合 */
const PATH_OPENROUTER =
  'M4 4h2.5v2.5H4V4zm6.25 0h2.5v2.5h-2.5V4zm6.25 0H19v2.5h-2.5V4zM4 10.75h2.5v2.5H4v-2.5zm6.25 0h2.5v2.5h-2.5v-2.5zm6.25 0H19v2.5h-2.5v-2.5zM4 17.5h2.5V20H4v-2.5zm6.25 0h2.5V20h-2.5v-2.5zm6.25 0H19V20h-2.5v-2.5z'

/** Qwen Cloud：雲朵造型（與 Alibaba Cloud 的括弧標誌區隔） */
const PATH_QWEN_CLOUD =
  'M18.42 9.22a5.5 5.5 0 0 0-10.05-2.2A4.5 4.5 0 0 0 4.5 16.5h13.65a3.75 3.75 0 0 0 .27-7.28z'

type Props = {
  developer: ModelDeveloper
  /** 已翻譯的開發商名稱（tooltip / 無障礙） */
  title: string
  className?: string
}

function SiPath({ d }: { d: string }) {
  return <path fill="currentColor" d={d} />
}

export function ModelDeveloperIcon({ developer, title, className }: Props) {
  const icon = (() => {
    switch (developer) {
      case 'bytedance':
        return <SiPath d={siBytedance.path} />
      case 'alibaba':
        return <SiPath d={siAlibabacloud.path} />
      case 'qwencloud':
        return <SiPath d={PATH_QWEN_CLOUD} />
      case 'openrouter':
        return <SiPath d={PATH_OPENROUTER} />
      case 'aws':
        return <SiPath d={siAmazonaws.path} />
    }
  })()

  return (
    <span
      className={className ? `models-atlas-dev-icon ${className}` : 'models-atlas-dev-icon'}
      title={title}
      aria-hidden="true"
    >
      <svg className="models-atlas-dev-icon-svg" viewBox="0 0 24 24" focusable="false">
        {icon}
      </svg>
    </span>
  )
}
