import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PageIntro } from '../components/page-intro'
import { Portrait } from '../components/portrait'
import { Seo } from '../components/seo'
import { personJsonLd } from '../lib/seo-data'
import { site } from '../data/site'
import { ContactSection } from '../components/contact-section'

function Heading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-[30px]"
    >
      {children}
    </h2>
  )
}

const timeline = [
  {
    period: '2023 — 2024',
    title: 'Chaldal · Software Engineer',
    body: 'Order fraud, address flows, background jobs, and recommendation signals on a platform with 1.2M+ users.',
  },
  {
    period: '2024 — 2025',
    title: 'Vivasoft · Software Engineer',
    body: 'Legacy desktop modernization, .NET middleware, and secure license validation for a hybrid product.',
  },
  {
    period: '2025 — present',
    title: 'Vivasoft · AI Engineer L-II',
    body: 'Leading a four-engineer team on a call-center analytics platform. Bangla ASR, six Go microservices, retrieval, evals, MCP.',
  },
]

export function AboutPage() {
  return (
    <>
      <Seo
        title="About — Hasibur Rahman"
        path="/about"
        description="AI Systems Engineer in Dhaka. The longer story: voice AI, Go services, retrieval design, competitive programming, and production systems."
        jsonLd={[
          personJsonLd,
          {
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            mainEntity: absoluteProfile(),
          },
        ]}
      />

      <PageIntro
        eyebrow="ABOUT"
        title="I like the part after the model works."
        dek="The demo ends when the model answers. The job starts when the answer has to be right, cheap, traceable, and still working on Monday."
        aside={<Portrait className="max-w-[190px]" />}
      />

      <div className="mx-auto max-w-container px-6 py-14 md:px-10 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-14 lg:col-span-7">
            <section aria-labelledby="about-opening">
              <Heading id="about-opening">The short story</Heading>
              <div className="mt-5 space-y-4 text-[16px] leading-[1.75] text-ink-2">
                <p>
                  I'm an AI Systems Engineer in Dhaka. I lead a four-engineer
                  team on a call-center analytics platform that transcribes call
                  audio and generates insights. My part is the backend that makes
                  the AI useful: Bangla speech recognition, a custom tokenizer,
                  six Go services, retrieval and evaluation, and an MCP layer
                  that exposes analytics as agent-callable tools.
                </p>
                <p>
                  The work is a sequence of constraints. A call recording is not
                  a clean dataset. A transcript is not a reliable fact. A
                  summary is not evidence. Most of the engineering is making
                  those gaps visible and deciding which one matters for the
                  decision at hand.
                </p>
                <p>
                  Before this, I worked on e-commerce at Chaldal, where a
                  platform serving more than a million users made small backend
                  decisions expensive. I learned to read query plans, move work
                  off the request path, and measure a flow instead of a feature.
                  Before that, I was the person who thought the framework was
                  the server.
                </p>
              </div>
            </section>

            <section aria-labelledby="about-now">
              <Heading id="about-now">What I do now</Heading>
              <div className="mt-5 space-y-4 text-[16px] leading-[1.75] text-ink-2">
                <p>
                  At Vivasoft, I own the AI backend for the call-center analytics
                  platform. It processes more than 125 hours of calls per day. We
                  fine-tuned Bangla ASR for low-bitrate telephony, built a
                  tokenizer that cut token count by 64%, and moved ingestion to
                  an event-sourced pipeline with RabbitMQ dead-letter recovery.
                </p>
                <p>
                  The analytics layer is a star schema. The language model writes
                  narrative around evidence it can query; it does not invent the
                  numbers. That distinction is the difference between a report
                  an owner can act on and a paragraph that sounds confident.
                </p>
                <p>
                  I also build the agent-facing surface. The MCP server exposes
                  bounded analytics tools with OAuth 2.0, so an agent can ask a
                  question without being handed the database. Agentic workflows
                  are gated by validation; we have passed more than a million
                  execution steps through that loop.
                </p>
              </div>
            </section>

            <section aria-labelledby="about-timeline">
              <Heading id="about-timeline">How I got here</Heading>
              <ol className="mt-6 border-t border-line">
                {timeline.map((item) => (
                  <li
                    key={item.title}
                    className="grid gap-2 border-b border-line py-5 md:grid-cols-[7rem_1fr] md:gap-6"
                  >
                    <span className="font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-muted">
                      {item.period}
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold text-ink">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[14px] leading-[1.65] text-ink-2">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-4 font-mono text-[10px] leading-5 tracking-[0.02em] text-muted">
                BSc in Computer Science & Engineering, Jatiya Kabi Kazi Nazrul
                Islam University. CGPA 3.53.
              </p>
            </section>

            <section aria-labelledby="about-care">
              <Heading id="about-care">What I care about</Heading>
              <div className="mt-5 space-y-4 text-[16px] leading-[1.75] text-ink-2">
                <p>
                  Reliability over novelty. A system that fails visibly is easier
                  to trust than one that hides its uncertainty in fluent prose.
                </p>
                <p>
                  Data quality over model choice. I have never seen a better
                  embedding fix a schema that split a clause from its exception.
                </p>
                <p>
                  Honest evaluation over a good demo. If I cannot describe the
                  input distribution and the failure cases, I do not publish the
                  percentage.
                </p>
                <p>
                  Teaching over gatekeeping. The best way to find out whether I
                  understand a thing is to explain it to someone who does not
                  share my assumptions.
                </p>
              </div>
            </section>

            <section aria-labelledby="about-scars">
              <Heading id="about-scars">Selected scars</Heading>
              <div className="mt-6 space-y-4">
                <Link
                  to="/writing/rabbitmq-bug-go-channel"
                  className="group block rounded-card border border-line bg-surface p-5 transition-colors hover:border-line-strong"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-orange-text">
                    The queue that was not the problem
                  </p>
                  <p className="mt-2 text-[15px] leading-[1.65] text-ink-2">
                    Messages looked lost. They were acknowledged, then parked in
                    a buffered Go channel. The broker dashboard was healthy the
                    whole time.
                  </p>
                  <span className="mt-3 inline-flex min-h-8 items-center text-[13px] font-medium text-ink group-hover:text-orange-text">
                    Read the story <span aria-hidden="true">&nbsp;→</span>
                  </span>
                </Link>
                <Link
                  to="/writing/invisible-characters-bangla-nlp"
                  className="group block rounded-card border border-line bg-surface p-5 transition-colors hover:border-line-strong"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-orange-text">
                    The invisible token
                  </p>
                  <p className="mt-2 text-[15px] leading-[1.65] text-ink-2">
                    Two identical-looking Bangla words can become different
                    token sequences. Normalization is a production ML concern.
                  </p>
                  <span className="mt-3 inline-flex min-h-8 items-center text-[13px] font-medium text-ink group-hover:text-orange-text">
                    Read the story <span aria-hidden="true">&nbsp;→</span>
                  </span>
                </Link>
                <Link
                  to="/work/call-center-analytics"
                  className="group block rounded-card border border-line bg-surface p-5 transition-colors hover:border-line-strong"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-orange-text">
                    The million-step loop
                  </p>
                  <p className="mt-2 text-[15px] leading-[1.65] text-ink-2">
                    Agentic workflows are easy to demo and hard to trust. The
                    validation gate is the product, not the autonomy.
                  </p>
                  <span className="mt-3 inline-flex min-h-8 items-center text-[13px] font-medium text-ink group-hover:text-orange-text">
                    Read the case study <span aria-hidden="true">&nbsp;→</span>
                  </span>
                </Link>
              </div>
            </section>

            <section aria-labelledby="about-outside">
              <Heading id="about-outside">Outside work</Heading>
              <div className="mt-5 space-y-4 text-[16px] leading-[1.75] text-ink-2">
                <p>
                  I still solve algorithm problems. More than 1,200 of them, and
                  I competed through ICPC Dhaka Regionals, where our team was
                  Divisional Champion in 2021. I mentor early-career engineers,
                  train ICPC teams, and speak about Gemini and GCP when I have
                  something concrete to show.
                </p>
                <p>
                  I maintain a Bangla ASR model and dataset on Hugging Face. It
                  is not a flagship. It is a useful artifact that people
                  download, which is enough.
                </p>
              </div>
            </section>

            <section aria-labelledby="about-now-section">
              <Heading id="about-now-section">Now</Heading>
              <div className="mt-5 rounded-card border border-line bg-paper-2 p-6">
                <p className="text-[15px] leading-[1.7] text-ink-2">
                  Currently focused on reliable retrieval, agent tooling, and
                  speech pipelines that hold up under real traffic. Learning more
                  about evaluation design and distributed systems failure modes.
                  Open to AI Systems, LLM, Agentic AI, Platform, and Backend roles
                  in APAC or Europe, with relocation and visa sponsorship.
                </p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                  Last updated {site.lastUpdated}
                </p>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-card border border-line bg-surface p-6">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                  Quick facts
                </p>
                <dl className="mt-4 space-y-3">
                  {[
                    ['Based', 'Dhaka, Bangladesh · UTC+6'],
                    ['Role', 'AI Engineer L-II · Vivasoft'],
                    ['Team', '4 engineers on the platform'],
                    ['Education', 'BSc CSE · CGPA 3.53'],
                    ['Recognition', 'ICPC Dhaka Divisional Champion'],
                    ['Contact', site.email],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-[5rem_1fr] gap-3 border-b border-line pb-3 last:border-0 last:pb-0"
                    >
                      <dt className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
                        {label}
                      </dt>
                      <dd className="text-[13px] leading-5 text-ink-2">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-card border border-line bg-paper-2 p-6">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                  Elsewhere
                </p>
                <div className="mt-3 grid grid-cols-2 gap-x-4">
                  {site.socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target={social.external ? '_blank' : undefined}
                      rel={social.external ? 'noreferrer' : undefined}
                      className="inline-flex min-h-11 items-center text-[13px] text-ink-2 hover:text-orange-text"
                    >
                      {social.label}
                      {social.external && <span aria-hidden="true">&nbsp;↗</span>}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <ContactSection />
    </>
  )
}

function absoluteProfile() {
  return {
    '@type': 'Person',
    name: site.name,
    jobTitle: site.role,
    url: `${site.siteUrl}/about`,
    sameAs: [site.links.linkedin, site.links.github, site.links.huggingface],
  }
}



