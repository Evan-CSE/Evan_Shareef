import { Link } from 'react-router-dom'
import { publicAsset } from '../lib/utils'
import { site } from '../data/site'

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-2">
      <div className="mx-auto max-w-container px-6 py-14 md:px-10 md:py-18">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link
              to="/"
              className="inline-flex min-h-11 items-center text-[22px] font-semibold tracking-[-0.03em] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
            >
              hasibur<span className="text-orange-text">.</span>
            </Link>
            <p className="mt-3 max-w-[34ch] text-[14px] leading-6 text-ink-2">
              AI Systems Engineer · Dhaka, Bangladesh
            </p>
            <p className="mt-4 max-w-[38ch] text-[13px] leading-6 text-muted">
              {site.availability}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              Pages
            </p>
            <nav aria-label="Footer" className="flex flex-col">
              {site.nav.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="inline-flex min-h-11 items-center text-[14px] text-ink-2 transition-colors hover:text-orange-text"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="md:col-span-4">
            <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              Elsewhere
            </p>
            <div className="grid grid-cols-2 gap-x-6">
              {site.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.external ? '_blank' : undefined}
                  rel={social.external ? 'noreferrer' : undefined}
                  className="inline-flex min-h-11 items-center text-[14px] text-ink-2 transition-colors hover:text-orange-text"
                >
                  {social.label}
                  {social.external && <span aria-hidden="true">&nbsp;↗</span>}
                </a>
              ))}
              <a
                href={publicAsset('/rss.xml')}
                className="inline-flex min-h-11 items-center text-[14px] text-ink-2 transition-colors hover:text-orange-text"
              >
                RSS <span aria-hidden="true">&nbsp;↗</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-[12px] leading-5 text-muted md:flex-row md:items-center md:justify-between">
          <p>© 2026 Hasibur Rahman · Built with React, TypeScript, and Tailwind.</p>
          <p>Last updated {site.lastUpdated}.</p>
        </div>
      </div>
    </footer>
  )
}


