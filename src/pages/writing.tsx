import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  categories,
  posts,
  sortedPosts,
  type PostCategory,
} from '../content/posts'
import { PageIntro } from '../components/page-intro'
import { PostCover } from '../components/typographic-cover'
import { PostRow } from '../components/post-card'
import { Seo } from '../components/seo'
import { formatShortDate } from '../lib/reading-time'
import { cn, publicAsset } from '../lib/utils'

type Filter = 'All' | PostCategory

export function WritingPage() {
  const [filter, setFilter] = useState<Filter>('All')
  const featured = posts.find((post) => post.featured) ?? sortedPosts()[0]
  const ordered = sortedPosts()
  const visible = ordered.filter(
    (post) => filter === 'All' || post.category === filter,
  )

  return (
    <>
      <Seo
        title="Writing — Hasibur Rahman"
        path="/writing"
        description="Essays on AI systems, data modeling, Bangla NLP, ASR, backend engineering, and the parts of production nobody puts in the demo."
      />

      <PageIntro
        eyebrow="03 — WRITING"
        title="I write to understand."
        dek="Mostly AI systems, data modeling, and the parts of production nobody puts in the demo."
        aside={
          <div className="flex flex-col gap-2 text-[13px]">
            <a
              href="https://www.linkedin.com/in/evan-shareef/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-orange-text"
            >
              Follow on LinkedIn <span aria-hidden="true">&nbsp;↗</span>
            </a>
            <a
              href={publicAsset('/rss.xml')}
              className="inline-flex min-h-11 items-center text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-orange-text"
            >
              RSS <span aria-hidden="true">&nbsp;↗</span>
            </a>
          </div>
        }
      />

      <section className="mx-auto max-w-container px-6 py-12 md:px-10 md:py-16">
        {filter === 'All' && (
          <Link
            to={`/writing/${featured.slug}`}
            className="group grid overflow-hidden rounded-card border border-line bg-surface transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-line-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange md:grid-cols-12"
          >
            <PostCover
              index="01"
              category={featured.category}
              readingTime={featured.readingTime}
              className="border-b border-line md:col-span-4 md:border-b-0 md:border-r"
            />
            <div className="flex flex-col justify-center p-6 md:col-span-8 md:p-10">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                Featured · {formatShortDate(featured.date)}
              </p>
              <h2 className="mt-3 max-w-[24ch] text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-ink transition-colors group-hover:text-orange-text md:text-[42px]">
                {featured.title}
              </h2>
              <p className="mt-4 max-w-[58ch] text-[15px] leading-[1.7] text-ink-2">
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
        )}

        <div className="mt-12 flex flex-wrap items-center gap-1 border-y border-line py-2">
          <span className="mr-3 hidden font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted sm:inline">
            Filter
          </span>
          {categories.map((category) => {
            const active = filter === category
            return (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                aria-pressed={active}
                className={cn(
                  'inline-flex min-h-11 items-center border-b-2 px-3 text-[13px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange',
                  active
                    ? 'border-orange text-ink'
                    : 'border-transparent text-muted hover:text-ink-2',
                )}
              >
                {category}
              </button>
            )
          })}
          <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-[0.1em] text-muted sm:inline">
            {visible.length} posts
          </span>
        </div>

        <div className="mt-2">
          {visible.map((post) => (
            <PostRow key={post.slug} post={post} />
          ))}
        </div>

        {visible.length === 0 && (
          <p className="py-16 text-center text-[14px] text-muted">
            Nothing in this category yet.
          </p>
        )}

        <div className="mt-14 grid gap-6 rounded-card border border-line bg-paper-2 p-6 md:grid-cols-12 md:items-center md:p-8">
          <div className="md:col-span-8">
            <p className="text-[18px] font-semibold tracking-[-0.015em] text-ink">
              No newsletter. No comment section.
            </p>
            <p className="mt-1 max-w-[56ch] text-[14px] leading-6 text-ink-2">
              I publish when I have something specific to say. If a post was
              useful, the best place to argue with me is LinkedIn.
            </p>
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <a
              href="https://www.linkedin.com/in/evan-shareef/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center text-[14px] font-semibold text-orange-text underline decoration-orange-line underline-offset-4"
            >
              LinkedIn <span aria-hidden="true">&nbsp;↗</span>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}



