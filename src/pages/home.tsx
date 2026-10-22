import { Link } from 'react-router-dom'
import { caseStudies } from '../data/projects'
import { education, experience } from '../data/experience'
import { posts, sortedPosts } from '../content/posts'
import { site } from '../data/site'
import { Hero } from '../components/hero'
import { ProofBar } from '../components/proof-bar'
import { SectionHeading } from '../components/section-heading'
import { ProjectCard } from '../components/project-card'
import { ExperienceRow } from '../components/experience-row'
import { PostCard } from '../components/post-card'
import { PostCover } from '../components/typographic-cover'
import { CuriosityTabs } from '../components/curiosity-tabs'
import { StackList } from '../components/stack-list'
import { CommunitySection } from '../components/community-section'
import { ContactSection } from '../components/contact-section'
import { ArrowLink } from '../components/ui'
import { Seo } from '../components/seo'
import { personJsonLd } from '../lib/seo-data'
import { formatShortDate } from '../lib/reading-time'

function SelectedWork() {
  const [first, second, third, fourth, fifth] = caseStudies

  return (
    <section aria-labelledby="work-heading" className="border-t border-line">
      <div className="mx-auto max-w-container px-6 py-20 md:px-10 md:py-28">
        <SectionHeading
          id="work-heading"
          index="01"
          label="SELECTED WORK"
          title="Systems, not demos."
          intro="Three systems, three different kinds of hard. Each case study covers the constraint, the design, and what changed in production."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-12">
          <ProjectCard
            project={first}
            index={1}
            className="md:col-span-7"
          />
          <ProjectCard
            project={second}
            index={2}
            className="md:col-span-5"
          />
          <ProjectCard
            project={third}
            index={3}
            wide
            className="md:col-span-12"
          />
          <ProjectCard
            project={fourth}
            index={4}
            compact
            className="md:col-span-6"
          />
          <ProjectCard
            project={fifth}
            index={5}
            compact
            className="md:col-span-6"
          />
        </div>

        <div className="mt-8">
          <ArrowLink to="/work">View all work</ArrowLink>
        </div>
      </div>
    </section>
  )
}

function ExperienceSection() {
  return (
    <section aria-labelledby="experience-heading" className="border-t border-line bg-paper-2">
      <div className="mx-auto max-w-container px-6 py-20 md:px-10 md:py-28">
        <SectionHeading
          id="experience-heading"
          index="02"
          label="EXPERIENCE"
          title="Where I've done the work."
          intro="Production systems, real users, and the occasional 2 a.m. debugging session."
        />

        <div className="mt-4">
          {experience.map((role) => (
            <ExperienceRow key={`${role.company}-${role.role}`} experience={role} />
          ))}

          <article className="grid gap-5 border-t border-line py-8 md:grid-cols-12 md:gap-6 md:py-10">
            <div className="md:col-span-3">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                {education.period}
              </p>
              <p className="mt-2 text-[13px] leading-5 text-muted">
                {education.location}
              </p>
            </div>
            <div className="md:col-span-9">
              <h3 className="text-[22px] font-semibold leading-tight tracking-[-0.015em] text-ink">
                {education.degree}
              </h3>
              <p className="mt-1 text-[15px] font-medium text-ink-2">
                {education.institution}
              </p>
              <p className="mt-2 max-w-[60ch] text-[14px] leading-6 text-ink-2">
                {education.detail}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

function WritingSection() {
  const featured = posts.find((post) => post.featured) ?? sortedPosts()[0]
  const recent = sortedPosts()
    .filter((post) => post.slug !== featured.slug)
    .slice(0, 3)

  return (
    <section aria-labelledby="writing-heading" className="border-t border-line">
      <div className="mx-auto max-w-container px-6 py-20 md:px-10 md:py-28">
        <SectionHeading
          id="writing-heading"
          index="03"
          label="WRITING"
          title="I write to understand."
          intro="Mostly AI systems, data modeling, and the parts of production nobody puts in the demo."
        />

        <Link
          to={`/writing/${featured.slug}`}
          className="group mt-10 grid overflow-hidden rounded-card border border-line bg-surface transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-line-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange md:grid-cols-12"
        >
          <PostCover
            index="01"
            category={featured.category}
            readingTime={featured.readingTime}
            className="border-b border-line md:col-span-5 md:border-b-0 md:border-r"
          />
          <div className="flex flex-col justify-center p-6 md:col-span-7 md:p-10">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
              Featured · {formatShortDate(featured.date)}
            </p>
            <h3 className="mt-3 max-w-[22ch] text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink transition-colors group-hover:text-orange-text md:text-[38px]">
              {featured.title}
            </h3>
            <p className="mt-4 max-w-[54ch] text-[15px] leading-[1.65] text-ink-2">
              {featured.description}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-orange-text">
              Read the post
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-150 group-hover:translate-x-0.5"
              >
                →
              </span>
            </span>
          </div>
        </Link>

        <div className="mt-8 grid gap-0 md:grid-cols-3 md:gap-8">
          {recent.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <div className="mt-8">
          <ArrowLink to="/writing">All writing</ArrowLink>
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section aria-labelledby="about-heading" className="border-t border-line bg-paper-2">
      <div className="mx-auto max-w-container px-6 py-20 md:px-10 md:py-28">
        <SectionHeading
          id="about-heading"
          index="04"
          label="ABOUT"
          title="The short version: I like the part after the model works."
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-5 text-[16px] leading-[1.75] text-ink-2 lg:col-span-7">
            <p>
              I'm an AI Systems Engineer at Vivasoft Limited in Dhaka. I lead a
              four-engineer team on a call-center analytics platform that
              transcribes call audio and generates insights: customer profiles,
              issue detection, escalation signals, and owner-level reporting.
            </p>
            <p>
              The work is less glamorous than the demo: a Bengali tokenizer that
              cut token count by 64%, an ASR stack that processes 13 days of audio
              in a day, an event-sourced ingestion pipeline with RabbitMQ
              dead-letter recovery, and an MCP server that exposes internal
              analytics as agent-callable tools.
            </p>
            <p>
              Before AI, I worked on e-commerce at Chaldal (YC-backed, 1.2M+
              users), where I cut fraud loss by 40 BDT per order and rebuilt an
              address flow used by a million people. I started in TypeScript and
              .NET, moved into Python and ML, and now I care less about the stack
              and more about whether the system survives Monday morning.
            </p>
            <p>
              Outside work: 1,200+ DSA problems, ICPC Dhaka Regional Divisional
              Champion, GDG Dhaka speaker, and a Bangla ASR model on Hugging Face
              that people actually download.
            </p>
            <div>
              <ArrowLink to="/about">More about me</ArrowLink>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-card border border-line bg-surface p-6 md:p-8">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                The short list
              </p>
              <div className="mt-5 space-y-4 text-[14px] leading-6">
                <div className="border-b border-line pb-4">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                    Based
                  </span>
                  <span className="mt-1 block text-ink-2">
                    Dhaka, Bangladesh · UTC+6
                  </span>
                </div>
                <div className="border-b border-line pb-4">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                    Open to
                  </span>
                  <span className="mt-1 block text-ink-2">
                    APAC + Europe · relocation + visa sponsorship
                  </span>
                </div>
                <div className="border-b border-line pb-4">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                    Best at
                  </span>
                  <span className="mt-1 block text-ink-2">
                    Retrieval design, speech pipelines, Go services, honest evals
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                    Not for
                  </span>
                  <span className="mt-1 block text-ink-2">
                    A demo that needs to look impressive on stage
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <CuriosityTabs />
        </div>
      </div>
    </section>
  )
}

function StackSection() {
  return (
    <section aria-labelledby="stack-heading" className="border-t border-line">
      <div className="mx-auto max-w-container px-6 py-20 md:px-10 md:py-28">
        <SectionHeading
          id="stack-heading"
          index="05"
          label="STACK"
          title="Tools change. The constraints don't."
          intro="I care about the problem first. This is what I reach for most often."
        />
        <div className="mt-8">
          <StackList />
        </div>
      </div>
    </section>
  )
}

export function HomePage() {
  return (
    <>
      <Seo
        title="Hasibur Rahman — AI Systems Engineer"
        path="/"
        description={site.defaultDescription}
        jsonLd={personJsonLd}
      />
      <Hero />
      <ProofBar />
      <SelectedWork />
      <ExperienceSection />
      <WritingSection />
      <AboutSection />
      <StackSection />
      <CommunitySection />
      <ContactSection />
    </>
  )
}


