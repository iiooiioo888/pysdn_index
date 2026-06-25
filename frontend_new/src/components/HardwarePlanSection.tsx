import { useEffect, useRef, useState } from 'react'

const KPI = [
  { val: '¥71,670', label: '建設期投入', color: 'var(--accent, #e8a830)' },
  { val: '¥3,200', label: '月均負擔', color: 'var(--color-primary-400, #60a5fa)' },
  { val: '¥360,000', label: '十年總存入', color: '#34d399' },
  { val: '96 GB', label: 'NVLink 顯存', color: '#a78bfa' },
  { val: '5 Nodes', label: 'K3s 集群', color: '#fbbf24' },
  { val: '≈¥235k', label: '結束餘額', color: '#4ae88a' },
]

const PHASES = [
  { name: '建設期', range: 'M0-20', color: 'var(--accent, #e8a830)', desc: '採購主伺服器 + 5 節點集群 + 12U 機櫃' },
  { name: '維護 I', range: 'M21-60', color: 'var(--color-primary-400, #60a5fa)', desc: '水冷 M36 · 風扇 M40 · 電源+UPS M48 · SSD M56' },
  { name: '★ 刷新 I', range: 'M60-72', color: '#e85454', desc: 'DDR5 / EPYC 9004+ / MI350?' },
  { name: '維護 II', range: 'M73-108', color: 'var(--color-primary-400, #60a5fa)', desc: '水冷 M84 · 電源 M96 · SSD M102' },
  { name: '★ 刷新 II', range: 'M108-120', color: '#e85454', desc: '第三代平台 · 基金充足' },
]

const COST_ROWS = [
  { cat: '計算', items: 'EPYC×2 + H12DSi + 512GB', amount: '¥15,700' },
  { cat: 'GPU', items: 'A40×2 + NVLink', amount: '¥17,800' },
  { cat: '存儲', items: 'SATA + U.2 RAID5 + HDD×2', amount: '¥19,600' },
  { cat: '電源', items: '1600W 鉑金 + UPS', amount: '¥4,900' },
  { cat: '散熱', items: '水冷×2 + 風扇×6 + 硅脂', amount: '¥2,460' },
  { cat: '集群', items: 'CP×2 + Worker×3 + 網絡 + 機櫃', amount: '¥9,930' },
]

const ARCH_LAYERS = [
  {
    label: '主伺服器',
    highlight: true,
    items: [
      { tag: 'CP', name: 'EPYC 7K62×2', detail: '96C/192T' },
      { tag: 'GPU', name: 'A40×2 NVLink', detail: '96GB · 112.5GB/s' },
      { tag: 'RAM', name: '512GB DDR4 ECC', detail: '16 DIMM' },
      { tag: 'STORE', name: 'U.2 RAID5 + SATA', detail: '熱+冷分層' },
    ],
  },
  {
    label: 'K3s 集群 · 5 Nodes',
    items: [
      { tag: 'CP-1', name: 'N100 · Traefik+Grafana', detail: '10W', color: '#60a5fa' },
      { tag: 'CP-2', name: 'N100 · Pi-hole+Uptime', detail: 'HA', color: '#60a5fa' },
      { tag: 'W-1', name: 'R7 · Gitea+Redis', detail: '16GB', color: '#34d399' },
      { tag: 'W-2', name: 'R7 · Drone CI', detail: '32GB', color: '#a78bfa' },
      { tag: 'W-3', name: 'R7 · PG+MinIO', detail: '+2TB', color: '#a78bfa' },
    ],
  },
]

export function HardwarePlanSection() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.1 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} id="hardware-plan" className="section hw-plan-section">
      <div className="container">
        {/* Header */}
        <div className={`hw-plan-head reveal${visible ? ' visible' : ''}`}>
          <span className="hw-plan-label">HARDWARE 10-YEAR PLAN</span>
          <h2 className="hw-plan-title">硬件全生命周期 · 十年計劃</h2>
          <p className="hw-plan-sub">
            雙路 EPYC + A40×2 NVLink，5 節點 K3s 集群。月均 ≈¥3,200，十年結束餘額 ≈¥235k。
          </p>
        </div>

        {/* KPI Strip */}
        <div className={`hw-plan-kpi reveal${visible ? ' visible' : ''}`}>
          {KPI.map((k) => (
            <div className="hw-plan-kpi-item" key={k.label}>
              <span className="hw-plan-kpi-val" style={{ color: k.color }}>{k.val}</span>
              <span className="hw-plan-kpi-label">{k.label}</span>
            </div>
          ))}
        </div>

        {/* Architecture */}
        <div className={`hw-plan-arch reveal${visible ? ' visible' : ''}`}>
          <h3 className="hw-plan-arch-title">系統架構</h3>
          {ARCH_LAYERS.map((layer, li) => (
            <div className="hw-plan-arch-layer" key={li}>
              <span className={`hw-plan-arch-layer-label${layer.highlight ? ' hl' : ''}`}>
                {layer.label}
              </span>
              <div className="hw-plan-arch-nodes">
                {layer.items.map((item, ii) => (
                  <div
                    className={`hw-plan-arch-node${layer.highlight ? ' hl' : ''}`}
                    key={ii}
                    style={item.color ? { borderColor: item.color, background: `${item.color}12` } : undefined}
                  >
                    <span className="hw-plan-arch-node-tag">{item.tag}</span>
                    <span className="hw-plan-arch-node-name">{item.name}</span>
                    <span className="hw-plan-arch-node-detail">{item.detail}</span>
                  </div>
                ))}
              </div>
              {li < ARCH_LAYERS.length - 1 && (
                <div className="hw-plan-arch-connector">
                  <span>↕ vLLM / Ollama API · 10GbE ↕</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Timeline Phases */}
        <div className={`hw-plan-phases reveal${visible ? ' visible' : ''}`}>
          <h3 className="hw-plan-arch-title">十年路線圖</h3>
          <div className="hw-plan-phase-grid">
            {PHASES.map((p, i) => (
              <div className="hw-plan-phase-card" key={i}>
                <div className="hw-plan-phase-head">
                  <span className="hw-plan-phase-name" style={{ color: p.color }}>{p.name}</span>
                  <span className="hw-plan-phase-range">{p.range}</span>
                </div>
                <p className="hw-plan-phase-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className={`hw-plan-cost reveal${visible ? ' visible' : ''}`}>
          <h3 className="hw-plan-arch-title">建設期成本明細</h3>
          <div className="hw-plan-cost-table">
            {COST_ROWS.map((r, i) => (
              <div className="hw-plan-cost-row" key={i}>
                <span className="hw-plan-cost-cat">{r.cat}</span>
                <span className="hw-plan-cost-items">{r.items}</span>
                <span className="hw-plan-cost-amount">{r.amount}</span>
              </div>
            ))}
            <div className="hw-plan-cost-row total">
              <span className="hw-plan-cost-cat">總計</span>
              <span className="hw-plan-cost-items" />
              <span className="hw-plan-cost-amount">¥71,670</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="hw-plan-cta">
          <a
            href="https://github.com/iiooiioo888/SuperSight/blob/main/plan3.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hw-plan-cta-btn"
          >
            查看完整 Dashboard →
          </a>
        </div>
      </div>
    </section>
  )
}
