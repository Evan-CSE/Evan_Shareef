import { proof } from '../data/site'

export function ProofBar() {
  return (
    <section
      aria-label="Proof points"
      className="border-y border-line bg-paper-2"
    >
      <div className="mx-auto max-w-container px-6 md:px-10">
        <dl className="grid grid-cols-2 md:grid-cols-5">
          {proof.map((item, index) => (
            <div
              key={item.label}
              className={[
                'flex flex-col border-line py-6 md:border-l md:px-6 md:py-8',
                index === 0 ? 'md:border-l-0 md:pl-0' : '',
                index % 2 === 1 ? 'border-l pl-5 md:pl-6' : '',
                index < 4 ? 'border-b md:border-b-0' : '',
                index < 2 ? 'border-b' : '',
              ].join(' ')}
            >
              <dt className="order-2 mt-1 font-mono text-[10px] font-medium uppercase leading-4 tracking-[0.1em] text-muted">
                {item.label}
              </dt>
              <dd className="order-1 text-[clamp(23px,2.3vw,29px)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
                {item.value.includes('→') ? (
                  <>
                    <span className="whitespace-nowrap">
                      {item.value.split('→')[0].trim()} →
                    </span>{' '}
                    <span className="whitespace-nowrap">
                      {item.value.split('→')[1].trim()}
                    </span>
                  </>
                ) : (
                  item.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
