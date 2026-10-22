import { Link } from 'react-router-dom'
import type { Post } from '../content/posts'
import { formatShortDate } from '../lib/reading-time'
import { cn } from '../lib/utils'

export function PostCard({ post, className }: { post: Post; className?: string }) {
  return (
    <Link
      to={`/writing/${post.slug}`}
      className={cn(
        'group flex flex-col border-t border-line py-6 transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange',
        className,
      )}
    >
      <div className="flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
        <span className="text-orange-text">{post.category}</span>
        <span aria-hidden="true">·</span>
        <span>{formatShortDate(post.date) || 'LinkedIn note'}</span>
        <span aria-hidden="true">·</span>
        <span>{post.readingTime} min</span>
      </div>
      <h3 className="mt-4 text-[22px] font-semibold leading-[1.2] tracking-[-0.02em] text-ink transition-colors duration-150 group-hover:text-orange-text">
        {post.title}
      </h3>
      <p className="mt-3 max-w-[48ch] text-[14px] leading-[1.65] text-ink-2">
        {post.description}
      </p>
      <span className="mt-auto pt-5 text-[13px] font-medium text-ink-2">
        Read{' '}
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-150 ease-out group-hover:translate-x-0.5"
        >
          →
        </span>
      </span>
    </Link>
  )
}

export function PostRow({ post }: { post: Post }) {
  return (
    <Link
      to={`/writing/${post.slug}`}
      className="group grid gap-2 border-t border-line py-6 transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange md:grid-cols-12 md:gap-6 md:py-7"
    >
      <div className="md:col-span-3">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          <span className="text-orange-text">{post.category}</span>
          <span className="mx-2">·</span>
          {formatShortDate(post.date) || 'LinkedIn note'}
        </p>
      </div>
      <div className="md:col-span-7">
        <h2 className="text-[20px] font-semibold leading-[1.25] tracking-[-0.015em] text-ink transition-colors duration-150 group-hover:text-orange-text md:text-[23px]">
          {post.title}
        </h2>
        <p className="mt-2 max-w-[62ch] text-[14px] leading-[1.65] text-ink-2">
          {post.description}
        </p>
      </div>
      <div className="flex items-center justify-between md:col-span-2 md:justify-end md:gap-3">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          {post.readingTime} min
        </span>
        <span
          aria-hidden="true"
          className="text-[15px] text-ink-2 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
        >
          →
        </span>
      </div>
    </Link>
  )
}
