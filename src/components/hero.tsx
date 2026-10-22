import { Link } from 'react-router-dom'
import { currently, hero, site } from '../data/site'
import { AvailabilityBadge } from './availability-badge'
import { Portrait } from './portrait'
import { ButtonLink, MonoLabel } from './ui'

function SocialLinks() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
      {site.socials.map((social, index) => (
        <span key={social.label} className="inline-flex items-center gap-3">
          {index > 0 && (
            <span aria-hidden="true" className="h-3 w-px bg-line-strong" />
          )}
          <a
            href={social.href}
            target={social.external ? '_blank' : undefined}
            rel={social.external ? 'noreferrer' : undefined}
            className="inline-flex min-h-11 items-center text-ink-2 underline decoration-line underline-offset-4 transition-colors hover:text-orange-text hover:decoration-orange-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
          >
            {social.label}
            {social.external && (
              <span aria-hidden="true" className="ml-0.5">
                ↗
              </span>
            )}
          </a>
        </span>
      ))}
    </div>
  )
}

export function Hero() {
  return (
    <section className="dot-field relative" aria-labelledby="hero-heading">
      <div className="relative z-10 mx-auto max-w-container px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="mb-5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-orange-text">
              {hero.eyebrow}
            </p>
            <h1
              id="hero-heading"
              className="text-[clamp(44px,7vw,76px)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink"
            >
              Hasibur Rahman
            </h1>
            <h2 className="mt-5 max-w-[20ch] text-[clamp(30px,4vw,44px)] font-semibold leading-[1.1] tracking-[-0.025em] text-ink">
              {hero.claim}
            </h2>
            <p className="mt-6 max-w-[58ch] text-[17px] leading-[1.7] text-ink-2">
              {hero.body}
            </p>

            <div className="mt-7">
              <AvailabilityBadge />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink to="/work">See selected work</ButtonLink>
              <ButtonLink to="/writing" variant="secondary">
                Read the writing
              </ButtonLink>
              <Link
                to="/resume"
                className="inline-flex min-h-12 items-center px-1 text-[15px] font-semibold text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:text-orange-text hover:decoration-orange-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
              >
                Resume <span aria-hidden="true">&nbsp;↓</span>
              </Link>
            </div>

            <div className="mt-2">
              <SocialLinks />
            </div>
          </div>

          <aside className="lg:col-span-5 lg:pl-4">
            <div className="rounded-card border border-line bg-surface p-6 md:p-8">
              <Portrait className="max-w-[240px]" loading="eager" />
              <div className="mt-6 border-t border-line pt-5">
                <MonoLabel>CURRENTLY</MonoLabel>
                <p className="mt-3 text-[15px] font-semibold leading-6 text-ink">
                  {currently.role}
                </p>
                <p className="mt-1 text-[14px] leading-6 text-ink-2">
                  {currently.project}
                </p>
                <p className="mt-1 text-[13px] leading-5 text-muted">
                  {currently.location}
                </p>
              </div>

              <div className="mt-5 border-t border-line pt-5">
                <MonoLabel>FOCUS</MonoLabel>
                <p className="mt-3 text-[14px] leading-6 text-ink-2">
                  {currently.focus}
                </p>
              </div>

              <div className="mt-5 border-t border-line pt-5">
                <MonoLabel>STATUS</MonoLabel>
                <p className="mt-3 flex items-start gap-2 text-[14px] leading-6 text-ink-2">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange"
                  />
                  {currently.status}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
