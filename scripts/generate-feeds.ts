import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { posts, sortedPosts } from '../src/content/posts'
import { caseStudies } from '../src/data/projects'

const SITE_URL = (
  process.env.VITE_SITE_URL ?? 'https://evan-cse.github.io/Evan_Shareef'
).replace(/\/$/, '')

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function url(pathname: string) {
  return `${SITE_URL}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
}

async function main() {
  const ordered = sortedPosts()
  const now = new Date()
  const lastBuildDate = now.toUTCString()

  const items = ordered
    .map((post) => {
      const link = url(`/writing/${post.slug}`)
      const pubDate = post.date
        ? `\n      <pubDate>${new Date(`${post.date}T12:00:00Z`).toUTCString()}</pubDate>`
        : ''
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(post.description)}</description>
      <category>${escapeXml(post.category)}</category>${pubDate}
    </item>`
    })
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Writing — Hasibur Rahman</title>
    <link>${url('/writing')}</link>
    <description>Essays on AI systems, data modeling, Bangla NLP, ASR, backend engineering, and production.</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${url('/rss.xml')}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

  const today = now.toISOString().slice(0, 10)
  const routes = [
    { path: '/', priority: '1.0' },
    { path: '/work', priority: '0.9' },
    { path: '/writing', priority: '0.9' },
    { path: '/about', priority: '0.7' },
    { path: '/resume', priority: '0.8' },
    ...caseStudies.map((item) => ({
      path: `/work/${item.slug}`,
      priority: '0.8',
    })),
    ...posts.map((post) => ({
      path: `/writing/${post.slug}`,
      priority: '0.7',
    })),
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${url(route.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.path === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

  const robots = `User-agent: *
Allow: /

Sitemap: ${url('/sitemap.xml')}
`

  await writeFile(path.resolve('public/rss.xml'), rss)
  await writeFile(path.resolve('public/sitemap.xml'), sitemap)
  await writeFile(path.resolve('public/robots.txt'), robots)

  console.log('Generated RSS, sitemap, and robots.txt.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
