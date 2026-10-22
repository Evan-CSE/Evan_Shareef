import { additionalWork, caseStudies } from '../data/projects'
import { PageIntro } from '../components/page-intro'
import { ProjectCard } from '../components/project-card'
import { ContactSection } from '../components/contact-section'
import { Seo } from '../components/seo'
import { ButtonLink } from '../components/ui'

export function WorkPage() {
  return (
    <>
      <Seo
        title="Selected Work — Hasibur Rahman"
        path="/work"
        description="Case studies in production call-center analytics, backend systems, retrieval, and agentic workflows: Chaldal, legal RAG, voice scheduling, and WhatsApp BI."
      />
      <PageIntro
        eyebrow="01 — WORK"
        title="Systems, not demos."
        dek="Five systems, five different constraints. Each case study covers the problem, the design decisions, the architecture, and what changed in production."
        aside={
          <div className="max-w-[24ch] border-l-2 border-orange pl-4 text-[13px] leading-6 text-ink-2">
            <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              Filter by
            </span>
            Production, prototypes, and ongoing work. No invented benchmarks.
            <span className="mt-2 block text-muted">
              Internal systems are labeled.
            </span>
          </div>
        }
      />

      <section aria-label="Case studies" className="mx-auto max-w-container px-6 py-16 md:px-10 md:py-20">
        <h2 className="sr-only">Case studies</h2>
        <div className="grid gap-5 md:grid-cols-12">
          {caseStudies.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index + 1}
              wide={index === 2}
              className={index === 0 || index === 1 ? 'md:col-span-6' : 'md:col-span-12'}
            />
          ))}
        </div>

        <div className="mt-20 border-t border-line pt-10">
          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                Additional work
              </p>
              <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.025em] text-ink">
                Other things I've built.
              </h2>
            </div>
            <div className="md:col-span-8">
              <ul className="border-t border-line">
                {additionalWork.map((item) => (
                  <li
                    key={item.title}
                    className="grid gap-2 border-b border-line py-5 md:grid-cols-12 md:gap-5"
                  >
                    <div className="md:col-span-5">
                      <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-ink">
                        {item.title}
                      </h3>
                      <p className="mt-1 font-mono text-[10px] leading-5 tracking-[0.02em] text-muted">
                        {item.stack}
                      </p>
                    </div>
                    <p className="text-[14px] leading-[1.65] text-ink-2 md:col-span-7">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-mono text-[10px] leading-5 tracking-[0.02em] text-muted">
                Several internal projects are not public. Ask about them.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-4 rounded-card border border-line bg-paper-2 p-6 md:p-8">
          <div className="mr-auto">
            <p className="text-[18px] font-semibold tracking-[-0.015em] text-ink">
              Want the short version?
            </p>
            <p className="mt-1 text-[14px] text-ink-2">
              Two resumes, same work, depending on the role.
            </p>
          </div>
          <ButtonLink to="/resume" variant="secondary">
            Resume
          </ButtonLink>
        </div>
      </section>

      <ContactSection />
    </>
  )
}
