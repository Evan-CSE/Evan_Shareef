import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SiteHeader } from './site-header'
import { SiteFooter } from './site-footer'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

export function Layout() {
  return (
    <>
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-button focus:border focus:border-orange focus:bg-orange focus:px-4 focus:py-3 focus:text-[14px] focus:font-semibold focus:text-ink focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-ink"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Suspense
          fallback={
            <div
              className="mx-auto flex min-h-[50vh] max-w-container items-center px-6 md:px-10"
              role="status"
              aria-label="Loading page"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                Loading
              </span>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  )
}
