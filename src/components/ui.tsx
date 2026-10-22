import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = {
  children: ReactNode
  to?: string
  href?: string
  variant?: ButtonVariant
  className?: string
  download?: boolean
  ariaLabel?: string
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'border-orange bg-orange text-ink hover:bg-orange-hover hover:border-orange-hover',
  secondary:
    'border-ink bg-transparent text-ink hover:bg-orange-soft hover:border-ink',
  ghost:
    'border-transparent bg-transparent text-ink hover:border-b-orange-text hover:text-orange-text',
}

const base =
  'group inline-flex min-h-12 items-center justify-center gap-2 rounded-button border px-5 text-[15px] font-semibold transition-all duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange'

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="inline-block transition-transform duration-150 ease-out group-hover:translate-x-0.5"
    >
      →
    </span>
  )
}

export function ButtonLink({
  children,
  to,
  href,
  variant = 'primary',
  className,
  download,
  ariaLabel,
}: ButtonProps) {
  const classes = cn(base, variants[variant], variant === 'ghost' && 'px-0', className)

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={ariaLabel}>
        {children}
        {variant !== 'ghost' && <Arrow />}
      </Link>
    )
  }

  return (
    <a
      href={href}
      className={classes}
      aria-label={ariaLabel}
      download={download}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
    >
      {children}
      {variant !== 'ghost' && <Arrow />}
    </a>
  )
}

export function ArrowLink({
  to,
  href,
  children,
  className,
  onClick,
}: {
  to?: string
  href?: string
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  const classes = cn(
    'group inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-ink transition-colors duration-150 hover:text-orange-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange',
    className,
  )

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {children}
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-150 ease-out group-hover:translate-x-0.5"
        >
          →
        </span>
      </Link>
    )
  }

  return (
    <a
      href={href}
      className={classes}
      onClick={onClick}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
    >
      {children}
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-150 ease-out group-hover:translate-x-0.5"
      >
        {href?.startsWith('http') ? '↗' : '→'}
      </span>
    </a>
  )
}

export function MonoLabel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function NonBreaking({ children }: { children: ReactNode }) {
  return <span className="whitespace-nowrap">{children}</span>
}
