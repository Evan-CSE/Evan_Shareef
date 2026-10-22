import { cn, publicAsset } from '../lib/utils'

export function Portrait({
  className,
  loading = 'lazy',
}: {
  className?: string
  loading?: 'eager' | 'lazy'
}) {
  return (
    <img
      src={publicAsset('/portrait-640.webp')}
      srcSet={`${publicAsset('/portrait-320.webp')} 320w, ${publicAsset('/portrait-640.webp')} 640w`}
      sizes="(min-width: 1024px) 240px, 60vw"
      alt="Hasibur Rahman"
      width="640"
      height="800"
      loading={loading}
      decoding="async"
      className={cn(
        'aspect-[4/5] w-full rounded-image border border-line object-cover object-[50%_24%] grayscale-[0.9] contrast-[1.02]',
        className,
      )}
    />
  )
}

