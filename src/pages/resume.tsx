import { PageIntro } from '../components/page-intro'
import { Seo } from '../components/seo'
import { resumes } from '../data/resume'
import { site } from '../data/site'
import { publicAsset } from '../lib/utils'

export function ResumePage() {
  return (
    <>
      <Seo
        title="Resume — Hasibur Rahman"
        path="/resume"
        description="Two resumes: AI Systems (LLM, RAG, speech, agentic systems) and Backend (Golang microservices, databases, observability)."
      />

      <PageIntro
        eyebrow="RESUME"
        title="Resume"
        dek="Two versions, same work. Pick the one that fits the role."
        aside={
          <p className="max-w-[22ch] text-[13px] leading-6 text-muted">
            PDF · 2 pages · Updated {site.lastUpdated}. Every resume link on
            this site starts here.
          </p>
        }
      />

      <section className="mx-auto max-w-container px-6 py-14 md:px-10 md:py-20">
        <div className="grid gap-5 md:grid-cols-2">
          {resumes.map((resume) => (
            <article
              key={resume.id}
              className="flex flex-col rounded-card border border-line bg-surface p-6 md:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-orange-text">
                  {resume.label}
                </p>
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                  PDF · 2 pages
                </span>
              </div>

              <h2 className="mt-4 text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink">
                {resume.title}
              </h2>

              <p className="mt-4 text-[15px] leading-[1.7] text-ink-2">
                {resume.summary}
              </p>

              <div className="mt-5 border-t border-line pt-4">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-muted">
                  Focus
                </p>
                <p className="mt-2 text-[13px] leading-5 text-ink-2">{resume.focus}</p>
              </div>

              <dl className="mt-4 space-y-2">
                {resume.skills.slice(0, 3).map((skill) => (
                  <div
                    key={skill.label}
                    className="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-line pb-2 text-[12px] leading-5 last:border-0"
                  >
                    <dt className="font-mono text-[9px] uppercase tracking-[0.08em] text-muted">
                      {skill.label}
                    </dt>
                    <dd className="text-ink-2">{skill.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-auto pt-6">
                <a
                  href={publicAsset(resume.file)}
                  download
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-button border border-orange bg-orange px-5 text-[15px] font-semibold text-ink transition-colors hover:border-orange-hover hover:bg-orange-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                >
                  Download PDF
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-150 group-hover:translate-y-0.5"
                  >
                    ↓
                  </span>
                </a>
                <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.08em] text-muted">
                  {resume.file.split('/').pop()}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-6 border-t border-line pt-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
              Before you download
            </p>
            <h2 className="mt-3 text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] text-ink">
              The site has more detail than a one-pager.
            </h2>
          </div>
          <div className="space-y-3 text-[14px] leading-[1.7] text-ink-2 md:col-span-7">
            <p>
              If you want the production evidence, start with the call-center
              analytics case study. If you want the backend story, start with
              Chaldal. If you want to see how I think, the writing is the honest
              version.
            </p>
            <p>
              Both PDFs use the same facts as this site. If a number differs
              anywhere, the site is the more current source.
            </p>
            <p className="font-mono text-[10px] leading-5 tracking-[0.02em] text-muted">
              Prefer a conversation? {site.email} · Dhaka, Bangladesh · UTC+6
            </p>
          </div>
        </div>
      </section>
    </>
  )
}


