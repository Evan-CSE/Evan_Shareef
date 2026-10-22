import type { ReactNode } from 'react'

export function PageIntro({
  eyebrow,
  title,
  dek,
  children,
  aside,
}: {
  eyebrow: string
  title: string
  dek?: ReactNode
  children?: ReactNode
  aside?: ReactNode
}) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto max-w-container px-6 pb-12 pt-14 md:px-10 md:pb-16 md:pt-20">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="mb-5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-orange-text">
              {eyebrow}
            </p>
            <h1 className="text-[clamp(44px,6vw,68px)] font-semibold leading-[1.03] tracking-[-0.035em] text-ink">
              {title}
            </h1>
            {dek && (
              <p className="mt-6 max-w-[54ch] text-[18px] leading-[1.6] text-ink-2">
                {dek}
              </p>
            )}
          </div>
          {aside && <div className="md:col-span-4 md:justify-self-end">{aside}</div>}
        </div>
        {children}
      </div>
    </header>
  )
}
