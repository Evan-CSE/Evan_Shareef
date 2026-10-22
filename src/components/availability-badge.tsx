import { site } from '../data/site'
import { cn } from '../lib/utils'

export function AvailabilityBadge({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        'inline-flex max-w-full items-start gap-2.5 rounded-full border border-line bg-surface px-3.5 py-2 text-[12px] leading-5 text-ink-2',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange"
      />
      <span>{site.availability}</span>
    </p>
  )
}
