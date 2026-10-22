import { certifications, openSource, recognition, speaking } from '../data/awards'
import type { Recognition } from '../data/awards'
import { site } from '../data/site'

function RecognitionList({
  label,
  items,
}: {
  label: string
  items: Recognition[]
}) {
  return (
    <div>
      <p className="mb-5 border-b border-line pb-3 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={`${item.title}-${item.year}`} className="grid grid-cols-[3.25rem_1fr] gap-3">
            <span className="font-mono text-[10px] font-medium leading-5 tracking-[0.08em] text-muted">
              {item.year}
            </span>
            <div>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center text-[14px] font-medium text-ink transition-colors hover:text-orange-text"
                >
                  {item.title}
                  <span aria-hidden="true">&nbsp;↗</span>
                </a>
              ) : (
                <p className="text-[14px] font-medium leading-6 text-ink">
                  {item.title}
                </p>
              )}
              <p className="mt-0.5 text-[13px] leading-[1.6] text-ink-2">
                {item.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {label === 'Open source' && (
        <a
          href={site.links.github}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex min-h-11 items-center text-[13px] font-medium text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:text-orange-text"
        >
          View GitHub <span aria-hidden="true">&nbsp;↗</span>
        </a>
      )}
    </div>
  )
}

export function CommunitySection() {
  return (
    <section className="border-t border-line" aria-labelledby="community-heading">
      <div className="mx-auto max-w-container px-6 py-20 md:px-10 md:py-28">
        <div className="grid gap-6 border-b border-line pb-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="mb-5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              BEYOND THE DAY JOB
            </p>
            <h2
              id="community-heading"
              className="text-[clamp(30px,4vw,44px)] font-semibold leading-[1.1] tracking-[-0.025em] text-ink"
            >
              Proof of the long game.
            </h2>
          </div>
          <p className="max-w-[40ch] text-[16px] leading-[1.65] text-ink-2 md:col-span-5 md:justify-self-end">
            Teaching, competing, shipping open models, and mentoring. The work
            that keeps the fundamentals sharp.
          </p>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          <RecognitionList label="Speaking & community" items={speaking} />
          <RecognitionList label="Open source" items={openSource} />
          <RecognitionList label="Recognition" items={recognition} />
        </div>

        <div className="mt-12 border-t border-line pt-8">
          <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
            Certifications
          </p>
          <ul className="grid gap-x-8 gap-y-2 md:grid-cols-2">
            {certifications.map((certification) => (
              <li
                key={certification.title}
                className="flex flex-col gap-1 border-b border-line py-2 text-[13px] leading-5 md:flex-row md:items-baseline md:justify-between md:gap-4"
              >
                <span className="text-ink-2">{certification.title}</span>
                <span className="font-mono text-[10px] tracking-[0.04em] text-muted md:shrink-0">
                  {certification.issuer} · {certification.year}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

