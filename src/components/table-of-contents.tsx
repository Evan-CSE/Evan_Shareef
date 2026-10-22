import type { Heading } from '../lib/markdown'

export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length < 3) return null

  return (
    <aside aria-label="On this page" className="hidden xl:block">
      <div className="sticky top-24">
        <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          On this page
        </p>
        <nav className="border-l border-line">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={`block border-l border-transparent py-1.5 text-[12px] leading-5 text-muted transition-colors hover:border-orange hover:text-ink ${
                heading.depth === 3 ? 'pl-7' : 'pl-4'
              }`}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export function MobileContents({ headings }: { headings: Heading[] }) {
  if (headings.length < 3) return null

  return (
    <details className="mb-8 rounded-card border border-line bg-surface p-4 xl:hidden">
      <summary className="cursor-pointer font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-ink-2">
        Contents
      </summary>
      <nav className="mt-4 border-t border-line pt-3">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className="flex min-h-11 items-center text-[13px] text-ink-2 hover:text-orange-text"
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </details>
  )
}

