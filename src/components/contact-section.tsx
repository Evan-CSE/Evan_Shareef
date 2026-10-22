import { site } from '../data/site'
import { mailto } from '../lib/utils'
import { AvailabilityBadge } from './availability-badge'
import { SectionHeading } from './section-heading'

const actions = [
  {
    title: 'Discuss a role',
    body: 'Looking for an AI Systems or Backend Engineer?',
    subject: 'Role discussion',
  },
  {
    title: 'Talk about a system',
    body: 'Have a retrieval, speech, or backend problem worth unpacking?',
    subject: 'System discussion',
  },
  {
    title: 'Invite me to speak',
    body: 'Gemini, GCP, RAG, or production AI.',
    subject: 'Speaking invitation',
  },
]

const contactRows = [
  { label: 'Email', value: site.email, href: `mailto:${site.email}` },
  { label: 'LinkedIn', value: '/in/evan-shareef', href: site.links.linkedin },
  { label: 'GitHub', value: '@Evan-CSE', href: site.links.github },
  { label: 'Hugging Face', value: '@Noobbbbb', href: site.links.huggingface },
  { label: 'WhatsApp', value: '+880 1821 484988', href: site.links.whatsapp },
  { label: 'Location', value: 'Dhaka, Bangladesh · UTC+6' },
]

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-24 border-t border-line bg-paper-2"
    >
      <div className="mx-auto max-w-container px-6 py-20 md:px-10 md:py-28">
        <SectionHeading
          id="contact-heading"
          index="06"
          label="CONTACT"
          title="Let's talk about the plumbing."
          intro="I'm open to AI Systems, LLM, Agentic AI, Platform, and Backend roles in APAC or Europe, with relocation and visa sponsorship. If you're building something where the plumbing matters, I'd like to hear about it."
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <dl className="border-t border-line">
              {contactRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-6 border-b border-line py-4"
                >
                  <dt className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                    {row.label}
                  </dt>
                  <dd className="text-right text-[14px] text-ink-2">
                    {row.href ? (
                      <a
                        href={row.href}
                        target={row.href.startsWith('http') ? '_blank' : undefined}
                        rel={row.href.startsWith('http') ? 'noreferrer' : undefined}
                        className="inline-flex min-h-11 items-center underline decoration-line underline-offset-4 transition-colors hover:text-orange-text hover:decoration-orange-line"
                      >
                        {row.value}
                        {row.href.startsWith('http') && (
                          <span aria-hidden="true"> ↗</span>
                        )}
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8">
              <AvailabilityBadge />
              <p className="mt-4 text-[13px] text-muted">
                Usually replies within 24 hours.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-4">
              {actions.map((action, index) => (
                <a
                  key={action.title}
                  href={mailto(action.subject)}
                  className="group grid gap-2 rounded-card border border-line bg-surface p-6 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-line-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange md:grid-cols-12 md:items-center md:gap-6 md:p-7"
                >
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted md:col-span-1">
                    0{index + 1}
                  </span>
                  <span className="md:col-span-8">
                    <span className="block text-[19px] font-semibold tracking-[-0.015em] text-ink group-hover:text-orange-text">
                      {action.title}
                    </span>
                    <span className="mt-1 block text-[14px] leading-6 text-ink-2">
                      {action.body}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="hidden text-right text-[18px] text-orange-text transition-transform duration-150 group-hover:translate-x-0.5 md:col-span-3 md:block"
                  >
                    →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

