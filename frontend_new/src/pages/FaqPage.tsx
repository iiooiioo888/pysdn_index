import { lazy, Suspense } from 'react'
import { PageShell } from '../components/PageShell'

const FaqSection = lazy(() => import('../components/FaqSection').then((m) => ({ default: m.FaqSection })))

export function FaqPage() {
  return (
    <PageShell>
      <Suspense fallback={null}>
        <FaqSection />
      </Suspense>
    </PageShell>
  )
}
