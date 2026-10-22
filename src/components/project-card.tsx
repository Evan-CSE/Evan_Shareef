import { Link } from 'react-router-dom'
import type { CaseStudy } from '../data/projects'
import { cn } from '../lib/utils'
import { TypographicCover } from './typographic-cover'

export function ProjectCard({
  project,
  index,
  wide = false,
  compact = false,
  className,
}: {
  project: CaseStudy
  index: number
  wide?: boolean
  compact?: boolean
  className?: string
}) {
  return (
    <Link
      to={`/work/${project.slug}`}
      className={cn(
        'group flex flex-col overflow-hidden rounded-card border border-line bg-surface transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-line-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange',
        wide && 'md:flex-row',
        className,
      )}
    >
      <TypographicCover
        index={String(index).padStart(2, '0')}
        category={project.category}
        status={project.status}
        compact={compact}
        className={cn(
          'border-b border-line',
          wide && 'md:w-[34%] md:shrink-0 md:border-b-0 md:border-r',
        )}
      />

      <div
        className={cn(
          'flex flex-1 flex-col p-6 md:p-8',
          compact && 'md:p-6',
          wide && 'md:justify-center md:p-10',
        )}
      >
        <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          {project.name} · {project.year}
        </p>
        <h3
          className={cn(
            'max-w-[24ch] font-semibold leading-[1.15] tracking-[-0.02em] text-ink transition-colors duration-150 group-hover:text-orange-text',
            compact ? 'text-[22px]' : 'text-[26px] md:text-[30px]',
          )}
        >
          {project.title}
        </h3>
        <p
          className={cn(
            'mt-3 max-w-[56ch] leading-[1.6] text-ink-2',
            compact ? 'text-[14px]' : 'text-[15px]',
            wide && 'max-w-[58ch] text-[16px]',
          )}
        >
          {project.dek}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.metrics.slice(0, 3).map((metric) => (
            <span
              key={metric}
              className="rounded-button border border-line bg-paper px-2.5 py-1.5 font-mono text-[10px] font-medium tracking-[0.02em] text-ink-2"
            >
              {metric}
            </span>
          ))}
        </div>

        <span
          className={cn(
            'mt-7 inline-flex items-center gap-2 text-[14px] font-semibold text-orange-text',
            wide && 'md:mt-8',
          )}
        >
          Read the case study
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-150 ease-out group-hover:translate-x-0.5"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  )
}
