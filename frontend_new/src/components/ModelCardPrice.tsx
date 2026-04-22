import { buildModelCardPriceView } from '../data/modelCardPriceDisplay'

type Props = { price: string }

export function ModelCardPrice({ price }: Props) {
  const v = buildModelCardPriceView(price)
  if (v.kind === 'in-out') {
    return (
      <div className="models-atlas-price models-atlas-price--io" role="group" aria-label="Token pricing per 1M">
        <div className="models-atlas-price-row">
          <div className="models-atlas-price-seg">
            <span className="models-atlas-price-k">IN</span>
            <span className="models-atlas-price-n" translate="no">
              {v.inPrice}
            </span>
          </div>
          <div className="models-atlas-price-vrule" aria-hidden="true" />
          <div className="models-atlas-price-seg">
            <span className="models-atlas-price-k">OUT</span>
            <span className="models-atlas-price-n" translate="no">
              {v.outPrice}
            </span>
          </div>
        </div>
        <p className="models-atlas-price-legend" translate="no">
          每百萬 tok
        </p>
      </div>
    )
  }
  if (v.kind === 'in-only') {
    return (
      <div
        className="models-atlas-price models-atlas-price--in"
        role="group"
        aria-label="Input token pricing"
      >
        <div className="models-atlas-price-seg models-atlas-price-seg--single">
          <span className="models-atlas-price-k">IN</span>
          <span className="models-atlas-price-n" translate="no">
            {v.inPrice}
          </span>
        </div>
        <p className="models-atlas-price-legend" translate="no">
          {v.embed ? '入／百萬 · 嵌入' : '入／百萬'}
        </p>
      </div>
    )
  }
  if (v.kind === 'openrouter') {
    return (
      <div
        className="models-atlas-price models-atlas-price--io models-atlas-price--or"
        role="group"
        aria-label="OpenRouter rate"
      >
        <div className="models-atlas-price-row">
          <div className="models-atlas-price-seg">
            <span className="models-atlas-price-k">{v.leftLabel}</span>
            <span className="models-atlas-price-n models-atlas-price-n--or" translate="no">
              {v.left}
            </span>
          </div>
          <div className="models-atlas-price-vrule" aria-hidden="true" />
          <div className="models-atlas-price-seg">
            <span className="models-atlas-price-k">{v.rightLabel}</span>
            <span className="models-atlas-price-n models-atlas-price-n--or" translate="no">
              {v.right}
            </span>
          </div>
        </div>
        <p className="models-atlas-price-legend" translate="no">
          prompt · completion
        </p>
      </div>
    )
  }
  if (v.kind === 'per-unit') {
    const k = v.unit === 'image' ? '單張' : '秒'
    const aria = v.unit === 'image' ? 'Image per-frame pricing' : 'Video per-second pricing'
    return (
      <div
        className="models-atlas-price models-atlas-price--io models-atlas-price--unit"
        role="group"
        aria-label={aria}
      >
        <div className="models-atlas-price-row models-atlas-price-row--unit">
          <div className="models-atlas-price-seg models-atlas-price-seg--unit">
            <span className="models-atlas-price-k models-atlas-price-k--local">{k}</span>
            <span className="models-atlas-price-n" translate="no">
              {v.amount}
            </span>
          </div>
        </div>
        <p className="models-atlas-price-legend models-atlas-price-legend--unit" translate="no">
          {v.legend}
        </p>
      </div>
    )
  }
  return (
    <p className="models-atlas-price models-atlas-price--plain" title={price}>
      {v.text}
    </p>
  )
}
