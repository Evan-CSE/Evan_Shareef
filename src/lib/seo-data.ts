import { site } from '../data/site'
import { absoluteUrl } from './utils'

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  alternateName: site.formalName,
  jobTitle: site.role,
  url: absoluteUrl('/'),
  email: `mailto:${site.email}`,
  sameAs: [site.links.linkedin, site.links.github, site.links.huggingface],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dhaka',
    addressCountry: 'BD',
  },
  knowsAbout: [
    'AI systems',
    'Retrieval-augmented generation',
    'Speech recognition',
    'Go backend services',
    'Agentic workflows',
    'Model Context Protocol',
  ],
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
