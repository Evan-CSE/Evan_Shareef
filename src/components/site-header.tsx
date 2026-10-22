import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { site } from '../data/site'
import { cn } from '../lib/utils'

function navClass({ isActive }: { isActive: boolean }) {
  return cn(
    'relative inline-flex min-h-11 items-center text-[15px] font-medium transition-colors duration-150 hover:text-orange-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange',
    isActive ? 'text-ink' : 'text-ink-2',
    isActive &&
      'after:absolute after:-bottom-[6px] after:left-0 after:h-[2px] after:w-full after:bg-orange',
  )
}

export function SiteHeader() {
  const [openAt, setOpenAt] = useState<string | null>(null)
  const location = useLocation()
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const open = openAt === location.pathname

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const menu = menuRef.current
    const focusable = menu?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    )
    focusable?.[0]?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenAt(null)
        window.setTimeout(() => buttonRef.current?.focus(), 0)
        return
      }

      if (event.key !== 'Tab' || !focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const close = () => {
    setOpenAt(null)
    window.setTimeout(() => buttonRef.current?.focus(), 0)
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line header-surface backdrop-blur-[8px]">
        <div className="mx-auto flex h-14 max-w-container md:h-16 items-center justify-between px-6 md:px-10">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center text-[20px] font-semibold tracking-[-0.03em] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
            aria-label="Hasibur Rahman, home"
          >
            hasibur<span className="text-orange-text">.</span>
          </Link>

          <div className="flex items-center gap-8">
            <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
              {site.nav.map((item) => (
                <NavLink key={item.href} to={item.href} className={navClass}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <a
              href={`mailto:${site.email}`}
              className="hidden h-10 items-center rounded-button border border-orange bg-orange px-4 text-[14px] font-semibold text-ink transition-colors duration-150 hover:border-orange-hover hover:bg-orange-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange sm:inline-flex"
            >
              Email me
            </a>

            <button
              ref={buttonRef}
              type="button"
              onClick={() => setOpenAt(location.pathname)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-button text-ink hover:bg-orange-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Open menu"
            >
              <Menu size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className="fixed inset-0 z-50 flex flex-col bg-paper px-6 pb-8 pt-6 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="flex items-center justify-between">
            <Link
              to="/"
              onClick={close}
              className="inline-flex min-h-11 items-center text-[20px] font-semibold tracking-[-0.03em] text-ink"
            >
              hasibur<span className="text-orange-text">.</span>
            </Link>
            <button
              type="button"
              onClick={close}
              className="inline-flex h-11 w-11 items-center justify-center rounded-button text-ink hover:bg-orange-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
              aria-label="Close menu"
            >
              <X size={22} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>

          <nav
            aria-label="Mobile primary"
            className="mt-14 flex flex-col border-t border-line"
          >
            {site.nav.map((item, index) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={close}
                className="flex items-center justify-between border-b border-line py-5 text-[32px] font-semibold tracking-[-0.03em] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
              >
                {item.label}
                <span className="font-mono text-[11px] font-medium tracking-[0.12em] text-muted">
                  0{index + 1}
                </span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto border-t border-line pt-6">
            <p className="mb-5 max-w-[34ch] text-[13px] leading-6 text-ink-2">
              {site.availability}
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[14px] text-ink-2">
              <a className="min-h-11 py-2" href={`mailto:${site.email}`}>
                Email
              </a>
              {site.socials.slice(0, 3).map((social) => (
                <a
                  key={social.label}
                  className="min-h-11 py-2"
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {social.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}



