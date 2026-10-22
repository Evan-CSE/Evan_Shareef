import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

type SectionHeadingProps = {
  id?: string
  index?: string
  label: string
  title: ReactNode
  intro?: ReactNode
  className?: string
}

export function SectionHeading({
  id,
  index,
  label,
  title,
  intro,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'grid gap-6 border-b border-line pb-10 md:grid-cols-12 md:items-end md:gap-6',
        className,
      )}
    >
      <div className="md:col-span-7">
        <p className="mb-5 font-mono text-[11px] font-medium uppercase tracking-[0.12em]">
          {index && <span className="text-orange-text">{index}</span>}
          {index && <span className="text-muted"> — </span>}
          <span className="text-muted">{label}</span>
        </p>
        <h2
          id={id}
          className="text-[clamp(30px,4vw,44px)] font-semibold leading-[1.1] tracking-[-0.025em] text-ink"
        >
          {title}
        </h2>
      </div>
      {intro && (
        <p className="max-w-[42ch] text-[16px] leading-[1.65] text-ink-2 md:col-span-5 md:justify-self-end">
          {intro}
        </p>
      )}
    </div>
  )
}
