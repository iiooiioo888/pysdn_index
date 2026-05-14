import { lazy, Suspense } from 'react'
import { PageShell } from '../components/PageShell'

const ModelsSection = lazy(() =>
  import('../components/ModelsSection').then((m) => ({ default: m.ModelsSection })),
)

function ModelsSkeletonFallback() {
  return (
    <section className="section models-section">
      <div className="container models-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" aria-label="Loading models…">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="rounded-panel border border-white/[0.06] bg-white/[0.02] overflow-hidden animate-pulse">
              <div className="aspect-video bg-white/[0.04]" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-white/[0.06] rounded" />
                <div className="h-3 w-full bg-white/[0.04] rounded" />
                <div className="h-3 w-5/6 bg-white/[0.04] rounded" />
                <div className="h-3 w-1/3 bg-white/[0.06] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ModelsPage() {
  return (
    <PageShell>
      <Suspense fallback={<ModelsSkeletonFallback />}>
        <ModelsSection />
      </Suspense>
    </PageShell>
  )
}
