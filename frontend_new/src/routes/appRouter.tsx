import { Suspense } from 'react'
import { createBrowserRouter, Outlet } from 'react-router-dom'
import { RevealScanBridge } from '../components/RevealScanBridge'
import { APP_ROUTE_ENTRIES } from './registry'
import { NotFoundRedirect } from './NotFoundRedirect'
import { RouteFallback } from './RouteFallback'

function RootLayout() {
  return (
    <>
      <RevealScanBridge />
      <Suspense fallback={<RouteFallback />}>
        <Outlet />
      </Suspense>
    </>
  )
}

function entryToRoute(path: string, Page: (typeof APP_ROUTE_ENTRIES)[number]['Page']) {
  const trimmed = path.replace(/^\//, '').replace(/\/$/, '')
  const element = <Page />
  if (path === '/' || trimmed === '') {
    return { index: true as const, element }
  }
  return { path: trimmed, element }
}

/**
 * 資料路由樹：`createBrowserRouter` + pathless layout（Reveal + Suspense）+ 子路由懶載入頁面。
 */
export function createAppRouter(basename: string) {
  const children = [
    ...APP_ROUTE_ENTRIES.map(({ path, Page }) => entryToRoute(path, Page)),
    { path: '*' as const, element: <NotFoundRedirect /> },
  ]

  return createBrowserRouter(
    [
      {
        element: <RootLayout />,
        children,
      },
    ],
    { basename },
  )
}
