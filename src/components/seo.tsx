import { Helmet } from 'react-helmet-async'
import { site } from '../data/site'
import { absoluteUrl } from '../lib/utils'

type SeoProps = {
  title: string
  description?: string
  path: string
  type?: 'website' | 'article'
  image?: string
  noindex?: boolean
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

export function Seo({
  title,
  description = site.defaultDescription,
  path,
  type = 'website',
  image = '/og-image.png',
  noindex = false,
  jsonLd,
}: SeoProps) {
  const canonical = absoluteUrl(path)
  const imageUrl = absoluteUrl(image)

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex,follow" />}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Hasibur Rahman" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])}
        </script>
      )}
    </Helmet>
  )
}

