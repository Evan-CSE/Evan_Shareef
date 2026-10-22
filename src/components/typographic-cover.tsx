import { cn } from '../lib/utils'

export function TypographicCover({
  index,
  category,
  status,
  compact = false,
  className,
}: {
  index: string
  category: string
  status?: string
  compact?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-paper-2',
        compact ? 'min-h-[176px] p-6' : 'min-h-[226px] p-6 md:p-8',
        className,
      )}
    >
      <div className="relative z-10 flex items-start justify-between gap-4">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-ink-2">
          {category}
        </span>
        {status && (
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
            {status}
          </span>
        )}
      </div>

      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 220 220"
        className={cn(
          'pointer-events-none absolute -bottom-8 right-3 select-none text-ink',
          compact ? 'h-[138px] w-[138px]' : 'h-[184px] w-[184px]',
        )}
      >
        <text
          x="220"
          y="200"
          textAnchor="end"
          fontFamily="Inter, Arial, sans-serif"
          fontSize="210"
          fontWeight="600"
          letterSpacing="-14"
          fill="currentColor"
          opacity="0.055"
        >
          {index}
        </text>
      </svg>

      <div className="absolute bottom-6 left-6 z-10 flex items-center gap-3 md:bottom-8 md:left-8">
        <span aria-hidden="true" className="h-px w-10 bg-orange" />
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          Case study {index}
        </span>
      </div>
    </div>
  )
}

export function PostCover({
  index,
  category,
  readingTime,
  className,
}: {
  index: string
  category: string
  readingTime: number
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative min-h-[190px] overflow-hidden bg-paper-2 p-6 md:p-8',
        className,
      )}
    >
      <div className="relative z-10 flex items-start justify-between gap-4">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-ink-2">
          {category}
        </span>
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          {readingTime} min read
        </span>
      </div>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 220 220"
        className="pointer-events-none absolute -bottom-8 right-3 h-[170px] w-[170px] select-none text-ink"
      >
        <text
          x="220"
          y="200"
          textAnchor="end"
          fontFamily="Inter, Arial, sans-serif"
          fontSize="210"
          fontWeight="600"
          letterSpacing="-14"
          fill="currentColor"
          opacity="0.055"
        >
          {index}
        </text>
      </svg>
      <div className="absolute bottom-6 left-6 z-10 flex items-center gap-3 md:bottom-8 md:left-8">
        <span aria-hidden="true" className="h-px w-10 bg-orange" />
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          Writing
        </span>
      </div>
    </div>
  )
}

