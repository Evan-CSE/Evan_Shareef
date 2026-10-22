import type { DiagramColumn } from '../data/projects'

export function ArchitectureDiagram({
  columns,
  caption,
}: {
  columns: DiagramColumn[]
  caption: string
}) {
  return (
    <figure className="my-10 overflow-hidden rounded-card border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-ink-2">
          Architecture
        </span>
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          Simplified
        </span>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-5">
        {columns.map((column, index) => (
          <div
            key={column.label}
            className="relative border-b border-line p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
          >
            <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-orange-text">
              {column.label}
            </p>
            <div className="space-y-2">
              {column.items.map((item) => (
                <div
                  key={item}
                  className="rounded-button border border-line bg-paper px-3 py-2 text-[12px] leading-5 text-ink-2"
                >
                  {item}
                </div>
              ))}
            </div>

            {index < columns.length - 1 && (
              <>
                <span
                  aria-hidden="true"
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-surface px-1 text-[14px] text-muted md:hidden"
                >
                  ↓
                </span>
                <span
                  aria-hidden="true"
                  className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 bg-surface px-1 text-[14px] text-muted md:block"
                >
                  →
                </span>
              </>
            )}
          </div>
        ))}
      </div>

      <figcaption className="border-t border-line bg-paper px-5 py-4 font-mono text-[10px] leading-5 tracking-[0.02em] text-muted">
        {caption}
      </figcaption>
    </figure>
  )
}
