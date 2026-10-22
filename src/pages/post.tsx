import { Link, useParams } from 'react-router-dom'
import {
  getAdjacentPosts,
  getPost,
  getRelatedPosts,
} from '../content/posts'
import { Seo } from '../components/seo'
import { breadcrumbJsonLd } from '../lib/seo-data'
import { Markdown } from '../components/markdown'
import {
  MobileContents,
  TableOfContents,
} from '../components/table-of-contents'
import { PostCard } from '../components/post-card'
import { NotFoundPage } from './not-found'
import { extractHeadings } from '../lib/markdown'
import { formatDate } from '../lib/reading-time'
import { absoluteUrl, publicAsset } from '../lib/utils'

export function PostPage() {
  const { slug = '' } = useParams()
  const post = getPost(slug)

  if (!post) {
    return <NotFoundPage />
  }

  const headings = extractHeadings(post.body)
  const { previous, next } = getAdjacentPosts(post.slug)
  const related = getRelatedPosts(post, 2)
  const path = `/writing/${post.slug}`

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    ...(post.date ? { datePublished: post.date } : {}),
    author: {
      '@type': 'Person',
      name: 'Hasibur Rahman',
      url: absoluteUrl('/'),
    },
    mainEntityOfPage: absoluteUrl(path),
    keywords: post.tags.join(', '),
    articleSection: post.category,
  }

  return (
    <>
      <Seo
        title={`${post.title} — Hasibur Rahman`}
        path={path}
        description={post.description}
        type="article"
        jsonLd={[
          articleJsonLd,
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Writing', path: '/writing' },
            { name: post.title, path },
          ]),
        ]}
      />

      <article>
        <header className="border-b border-line">
          <div className="mx-auto max-w-container px-6 pb-12 pt-8 md:px-10 md:pb-14 md:pt-10">
            <nav aria-label="Breadcrumb" className="mb-10">
              <ol className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                <li>
                  <Link to="/writing" className="inline-flex min-h-11 items-center hover:text-orange-text">
                    Writing
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-orange-text">{post.category}</li>
              </ol>
            </nav>

            <div className="mx-auto max-w-[820px]">
              <p className="mb-5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-orange-text">
                {post.category}
              </p>
              <h1 className="text-[clamp(38px,5.6vw,54px)] font-semibold leading-[1.06] tracking-[-0.035em] text-ink">
                {post.title}
              </h1>
              <p className="mt-6 max-w-[60ch] text-[19px] leading-[1.6] text-ink-2">
                {post.description}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-muted">
                {post.date && (
                  <>
                    <span>{formatDate(post.date)}</span>
                    <span aria-hidden="true">·</span>
                  </>
                )}
                <span>{post.readingTime} min read</span>
                {post.tags.length > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{post.tags.join(' / ')}</span>
                  </>
                )}
              </div>

              <div className="mt-8 flex items-center gap-3 border-t border-orange-line pt-6">
                <img
                  src={publicAsset('/portrait-320.webp')}
                  alt="Hasibur Rahman"
                  width="44"
                  height="44"
                  loading="lazy"
                  decoding="async"
                  className="h-11 w-11 shrink-0 rounded-full border border-line object-cover object-[50%_24%] grayscale"
                />
                <div>
                  <p className="text-[13px] font-semibold text-ink">Hasibur Rahman</p>
                  <p className="text-[12px] text-muted">AI Systems Engineer</p>
                </div>
                <a
                  href="https://www.linkedin.com/in/evan-shareef/"
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto inline-flex min-h-11 items-center text-[12px] font-medium text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-orange-text"
                >
                  LinkedIn <span aria-hidden="true">&nbsp;↗</span>
                </a>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-container px-6 py-12 md:px-10 md:py-16">
          <div className="mx-auto grid max-w-[1040px] gap-12 xl:grid-cols-[minmax(0,720px)_240px] xl:justify-center xl:gap-16">
            <div className="mx-auto w-full max-w-[720px]">
              <MobileContents headings={headings} />
              <Markdown>{post.body}</Markdown>

              {post.origin === 'linkedin' && (
                <p className="mt-10 border-l-2 border-orange-line bg-orange-soft px-4 py-3 text-[13px] leading-6 text-ink-2">
                  This began as a note on LinkedIn. It has been edited for this
                  site.
                </p>
              )}

              <div className="mt-12 border-t border-line pt-8">
                <p className="text-[17px] leading-[1.7] text-ink-2">
                  If this was useful, the best place to argue with me is
                  LinkedIn.
                </p>
                <a
                  href="https://www.linkedin.com/in/evan-shareef/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex min-h-11 items-center text-[14px] font-semibold text-orange-text underline decoration-orange-line underline-offset-4"
                >
                  Continue the conversation
                  <span aria-hidden="true">&nbsp;↗</span>
                </a>
              </div>

              <nav
                aria-label="Post navigation"
                className="mt-10 grid gap-4 border-t border-line pt-8 sm:grid-cols-2"
              >
                {previous ? (
                  <Link
                    to={`/writing/${previous.slug}`}
                    className="group rounded-card border border-line bg-surface p-5 transition-colors hover:border-line-strong"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                      Previous
                    </span>
                    <span className="mt-2 block text-[15px] font-semibold leading-6 text-ink group-hover:text-orange-text">
                      {previous.title}
                    </span>
                  </Link>
                ) : (
                  <span aria-hidden="true" />
                )}
                {next && (
                  <Link
                    to={`/writing/${next.slug}`}
                    className="group rounded-card border border-line bg-surface p-5 text-right transition-colors hover:border-line-strong"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                      Next
                    </span>
                    <span className="mt-2 block text-[15px] font-semibold leading-6 text-ink group-hover:text-orange-text">
                      {next.title}
                    </span>
                  </Link>
                )}
              </nav>
            </div>

            <TableOfContents headings={headings} />
          </div>

          {related.length > 0 && (
            <div className="mx-auto mt-16 max-w-[1040px] border-t border-line pt-8">
              <h2 className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                Related
              </h2>
              <div className="grid gap-0 md:grid-cols-2 md:gap-8">
                {related.map((relatedPost) => (
                  <PostCard key={relatedPost.slug} post={relatedPost} />
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  )
}


