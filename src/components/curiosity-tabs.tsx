import { useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { curiosity } from '../data/curiosity'
import { cn } from '../lib/utils'

export function CuriosityTabs() {
  const [active, setActive] = useState(0)
  const baseId = useId()
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const focusTab = (index: number) => {
    const next = (index + curiosity.length) % curiosity.length
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      focusTab(index + 1)
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault()
      focusTab(index - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusTab(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusTab(curiosity.length - 1)
    }
  }

  const current = curiosity[active]

  return (
    <div className="grid gap-8 border-t border-line pt-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-4">
        <p className="mb-5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          How I think
        </p>
        <div
          role="tablist"
          aria-label="Curiosity questions"
          aria-orientation="vertical"
          className="flex flex-col"
        >
          {curiosity.map((item, index) => {
            const selected = index === active
            return (
              <button
                key={item.label}
                ref={(node) => {
                  tabRefs.current[index] = node
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${index}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${index}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className={cn(
                  'flex min-h-12 items-center gap-3 border-l-2 py-3 pl-4 pr-2 text-left transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange',
                  selected
                    ? 'border-orange text-ink'
                    : 'border-transparent text-muted hover:text-ink-2',
                )}
              >
                <span className="font-mono text-[10px] font-medium tracking-[0.12em]">
                  0{index + 1}
                </span>
                <span className="text-[14px] font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="lg:col-span-8">
        {curiosity.map((item, index) => (
          <div
            key={item.label}
            role="tabpanel"
            id={`${baseId}-panel-${index}`}
            aria-labelledby={`${baseId}-tab-${index}`}
            hidden={index !== active}
            tabIndex={0}
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
          >
            <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-orange-text">
              {item.label}
            </p>
            <h3 className="max-w-[30ch] text-[24px] font-semibold leading-[1.25] tracking-[-0.02em] text-ink md:text-[30px]">
              {item.question}
            </h3>
            <p className="mt-5 max-w-[58ch] text-[16px] leading-[1.7] text-ink-2">
              {item.answer}
            </p>
          </div>
        ))}
        <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
          {String(active + 1).padStart(2, '0')} / {String(curiosity.length).padStart(2, '0')}
          <span className="sr-only">: {current.label}</span>
        </p>
      </div>
    </div>
  )
}

