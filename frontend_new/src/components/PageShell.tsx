import { type ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
type PageShellProps = {
  children: ReactNode
  /** 主內容區的額外 className */
  mainClassName?: string
  /** 外層 className */
  className?: string
}

/**
 * 統一頁面佈局：Navbar + main + Footer。
 * 消除 ModelsPage / FaqPage 等重複的 canvas+Navbar+Footer 模式。
 */
export function PageShell({
  children,
  mainClassName = '',
  className = '',
}: PageShellProps) {

  return (
    <div className={`site-shell relative z-[1] min-h-dvh ${className}`}>
      <Navbar />
      <main className={mainClassName}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
