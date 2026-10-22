import { skills } from '../data/skills'

export function StackList() {
  return (
    <dl className="border-t border-line">
      {skills.map((group) => (
        <div
          key={group.group}
          className="grid gap-2 border-b border-line py-5 md:grid-cols-12 md:gap-6"
        >
          <dt className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted md:col-span-3 md:pt-1">
            {group.group}
          </dt>
          <dd className="text-[15px] leading-[1.7] text-ink-2 md:col-span-9">
            {group.items}
          </dd>
        </div>
      ))}
    </dl>
  )
}
