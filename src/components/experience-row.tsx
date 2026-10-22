import type { Experience } from '../data/experience'

export function ExperienceRow({ experience }: { experience: Experience }) {
  return (
    <article className="grid gap-5 border-t border-line py-8 md:grid-cols-12 md:gap-6 md:py-10">
      <div className="md:col-span-3">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          {experience.period}
        </p>
        <p className="mt-2 text-[13px] leading-5 text-muted">{experience.location}</p>
      </div>

      <div className="md:col-span-9">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <h3 className="text-[22px] font-semibold leading-tight tracking-[-0.015em] text-ink">
            {experience.role}
          </h3>
          <span className="text-[15px] text-muted">·</span>
          <p className="flex items-center gap-2 text-[15px] font-medium text-ink-2">
            {experience.current && (
              <>
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 rounded-full bg-orange"
                />
                <span className="sr-only">Current role</span>
              </>
            )}
            {experience.company}
          </p>
        </div>
        <p className="mt-2 max-w-[60ch] text-[15px] leading-6 text-ink-2">
          {experience.scope}
        </p>
        <ul className="mt-4 max-w-[70ch] space-y-2">
          {experience.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex gap-3 text-[14px] leading-[1.65] text-ink-2"
            >
              <span
                aria-hidden="true"
                className="mt-[9px] h-px w-3 shrink-0 bg-line-strong"
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-mono text-[10px] leading-5 tracking-[0.02em] text-muted">
          {experience.stack}
        </p>
      </div>
    </article>
  )
}
