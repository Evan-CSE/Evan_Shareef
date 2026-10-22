import { Link } from 'react-router-dom'
import { Seo } from '../components/seo'

export function NotFoundPage() {
  return (
    <>
      <Seo
        title="Not found — Hasibur Rahman"
        path="/404"
        description="That page does not exist."
        noindex
      />
      <section className="mx-auto flex min-h-[62vh] max-w-container flex-col justify-center px-6 py-20 md:px-10">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-orange-text">
          404
        </p>
        <h1 className="mt-4 max-w-[14ch] text-[clamp(52px,9vw,104px)] font-semibold leading-[0.98] tracking-[-0.04em] text-ink">
          Wrong turn.
        </h1>
        <p className="mt-6 max-w-[46ch] text-[17px] leading-[1.65] text-ink-2">
          The page is not here. The work, the writing, and the resume are.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex min-h-12 items-center rounded-button border border-orange bg-orange px-5 text-[15px] font-semibold text-ink hover:bg-orange-hover"
          >
            Home
          </Link>
          <Link
            to="/work"
            className="inline-flex min-h-12 items-center rounded-button border border-ink px-5 text-[15px] font-semibold text-ink hover:bg-orange-soft"
          >
            Selected work
          </Link>
          <Link
            to="/writing"
            className="inline-flex min-h-12 items-center rounded-button border border-ink px-5 text-[15px] font-semibold text-ink hover:bg-orange-soft"
          >
            Writing
          </Link>
        </div>
      </section>
    </>
  )
}
