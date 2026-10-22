import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCaseStudy, getNextCaseStudy } from '../data/projects'
import { Seo } from '../components/seo'
import { breadcrumbJsonLd } from '../lib/seo-data'
import { ArchitectureDiagram } from '../components/architecture-diagram'
import { NotFoundPage } from './not-found'
import { absoluteUrl } from '../lib/utils'

function Paragraphs({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {text.split('\n\n').map((paragraph) => (
        <p key={paragraph} className="text-[16px] leading-[1.75] text-ink-2">
          {paragraph}
        </p>
      ))}
    </div>
  )
}

function SectionBlock({
  index,
  title,
  children,
}: {
  index: string
  title: string
  children: ReactNode
}) {
  return (
    <section className="mt-14 border-t border-line pt-8">
      <div className="mb-5 flex items-baseline gap-3">
        <span className="font-mono text-[10px] font-medium tracking-[0.12em] text-orange-text">
          {index}
        </span>
        <h2 className="text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-[30px]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

export function CaseStudyPage() {
  const { slug = '' } = useParams()
  const project = getCaseStudy(slug)

  if (!project) {
    return <NotFoundPage />
  }

  const next = getNextCaseStudy(project.slug)
  const path = `/work/${project.slug}`

  return (
    <>
      <Seo
        title={`${project.title} — Hasibur Rahman`}
        path={path}
        description={project.metaDescription}
        type="article"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: project.title,
            description: project.metaDescription,
            author: {
              '@type': 'Person',
              name: 'Hasibur Rahman',
              url: absoluteUrl('/'),
            },
            mainEntityOfPage: absoluteUrl(path),
            about: project.category,
          },
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
            { name: project.name, path },
          ]),
        ]}
      />

      <article>
        <header className="border-b border-line">
          <div className="mx-auto max-w-container px-6 pb-12 pt-8 md:px-10 md:pb-16 md:pt-10">
            <nav aria-label="Breadcrumb" className="mb-10">
              <ol className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                <li>
                  <Link to="/work" className="inline-flex min-h-11 items-center hover:text-orange-text">
                    Work
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-ink-2">
                  {project.name}
                </li>
              </ol>
            </nav>

            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <p className="mb-5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-orange-text">
                  {project.category} · {project.year}
                </p>
                <h1 className="max-w-[18ch] text-[clamp(38px,5.7vw,64px)] font-semibold leading-[1.04] tracking-[-0.035em] text-ink">
                  {project.title}
                </h1>
                <p className="mt-6 max-w-[52ch] text-[18px] leading-[1.65] text-ink-2">
                  {project.dek}
                </p>
              </div>

              <aside className="lg:col-span-4 lg:pl-6">
                <div className="rounded-card border border-line bg-surface p-6">
                  <dl className="space-y-4">
                    {[
                      ['Role', project.role],
                      ['Team', project.team],
                      ['Timeline', project.timeline],
                      ['Status', project.status],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-line pb-3 last:border-0 last:pb-0"
                      >
                        <dt className="font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-muted">
                          {label}
                        </dt>
                        <dd className="text-[13px] leading-5 text-ink-2">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-5 border-t border-line pt-4">
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-muted">
                      Stack
                    </p>
                    <p className="mt-2 font-mono text-[10px] leading-5 tracking-[0.02em] text-ink-2">
                      {project.stack.join(' · ')}
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-container px-6 py-12 md:px-10 md:py-16">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-8">
              <SectionBlock index="01" title="Context">
                <Paragraphs text={project.context} />
              </SectionBlock>

              <SectionBlock index="02" title="The problem">
                <Paragraphs text={project.problem} />
              </SectionBlock>

              <SectionBlock index="03" title="Constraints">
                <ul className="border-t border-line">
                  {project.constraints.map((constraint) => (
                    <li
                      key={constraint}
                      className="flex gap-4 border-b border-line py-3 text-[15px] leading-[1.65] text-ink-2"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[9px] h-px w-4 shrink-0 bg-orange"
                      />
                      {constraint}
                    </li>
                  ))}
                </ul>
              </SectionBlock>

              <SectionBlock index="04" title="What I built">
                <div className="space-y-8">
                  {project.decisions.map((decision, index) => (
                    <div
                      key={decision.title}
                      className="grid gap-3 border-l-2 border-line pl-5 md:grid-cols-[2rem_1fr] md:gap-4 md:border-l-0 md:pl-0"
                    >
                      <span className="hidden font-mono text-[10px] font-medium leading-6 tracking-[0.1em] text-orange-text md:block">
                        0{index + 1}
                      </span>
                      <div>
                        <h3 className="text-[20px] font-semibold leading-[1.25] tracking-[-0.015em] text-ink md:text-[22px]">
                          {decision.title}
                        </h3>
                        <Paragraphs text={decision.body} className="mt-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionBlock>

              <SectionBlock index="05" title="Architecture">
                <ArchitectureDiagram
                  columns={project.architecture.columns}
                  caption={project.architecture.caption}
                />
                <p className="font-mono text-[10px] leading-5 tracking-[0.02em] text-muted">
                  Diagrams are redrawn with generic labels. No client screenshots
                  or recordings are shown.
                </p>
              </SectionBlock>

              <SectionBlock index="06" title="Results">
                <div className="grid gap-4 sm:grid-cols-2">
                  {project.results.map((result) => (
                    <div
                      key={result.title}
                      className="rounded-card border border-line bg-surface p-5"
                    >
                      <p className="text-[22px] font-semibold leading-[1.15] tracking-[-0.025em] text-orange-text">
                        {result.title}
                      </p>
                      <p className="mt-2 text-[14px] leading-[1.65] text-ink-2">
                        {result.body}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-5 border-l-2 border-orange-line bg-orange-soft px-4 py-3 text-[13px] leading-6 text-ink-2">
                  {project.resultNote}
                </p>
              </SectionBlock>

              <SectionBlock index="07" title="What I'd do differently">
                <ol className="space-y-4">
                  {project.lessons.map((lesson, index) => (
                    <li
                      key={lesson}
                      className="grid grid-cols-[2rem_1fr] gap-3 text-[15px] leading-[1.7] text-ink-2"
                    >
                      <span className="font-mono text-[10px] font-medium leading-6 text-muted">
                        0{index + 1}
                      </span>
                      <span>{lesson}</span>
                    </li>
                  ))}
                </ol>
              </SectionBlock>

              <SectionBlock index="08" title="Links">
                <ul className="border-t border-line">
                  {project.links.map((link) => (
                    <li
                      key={link.label}
                      className="border-b border-line py-3 text-[14px] leading-6 text-ink-2"
                    >
                      {link.href ? (
                        <Link
                          to={link.href}
                          className="inline-flex min-h-11 items-center text-ink underline decoration-line-strong underline-offset-4 hover:text-orange-text"
                        >
                          {link.label} <span aria-hidden="true">&nbsp;→</span>
                        </Link>
                      ) : (
                        <span>
                          {link.label}
                          {link.note && (
                            <span className="ml-2 font-mono text-[10px] text-muted">
                              {link.note}
                            </span>
                          )}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </SectionBlock>
            </div>

            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-card border border-line bg-paper-2 p-6">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                    At a glance
                  </p>
                  <ul className="mt-4 space-y-3">
                    {project.metrics.map((metric) => (
                      <li
                        key={metric}
                        className="border-b border-line pb-3 text-[15px] font-medium leading-6 text-ink last:border-0 last:pb-0"
                      >
                        {metric}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-card border border-line bg-surface p-6">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                    Contact
                  </p>
                  <p className="mt-3 text-[14px] leading-6 text-ink-2">
                    Happy to walk through the constraints, the tradeoffs, or the
                    parts that broke.
                  </p>
                  <a
                    href="mailto:evanshareef@gmail.com?subject=Case%20study%20question"
                    className="mt-3 inline-flex min-h-11 items-center text-[14px] font-semibold text-orange-text underline decoration-orange-line underline-offset-4"
                  >
                    Email me <span aria-hidden="true">&nbsp;→</span>
                  </a>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-16 border-t border-line pt-8">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
              Next case study
            </p>
            <Link
              to={`/work/${next.slug}`}
              className="group mt-3 flex flex-col justify-between gap-4 rounded-card border border-line bg-surface p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-line-strong md:flex-row md:items-center md:p-8"
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                  {next.category}
                </p>
                <p className="mt-2 max-w-[46ch] text-[22px] font-semibold leading-[1.2] tracking-[-0.02em] text-ink group-hover:text-orange-text md:text-[26px]">
                  {next.title}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="text-[24px] text-orange-text transition-transform duration-150 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}



