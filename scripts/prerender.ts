import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ReactMarkdown from 'react-markdown'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { posts } from '../src/content/posts'
import { caseStudies } from '../src/data/projects'

const SITE_URL = (
  process.env.VITE_SITE_URL ?? 'https://evan-cse.github.io/Evan_Shareef'
).replace(/\/$/, '')

type Page = {
  // GitHub Pages serves /a/b from a/b.html with a 200 and no redirect. A route
  // that shares its name with a directory has to be a/b/index.html instead.
  file: string
  path: string
  title: string
  description: string
  type: 'website' | 'article'
  html?: string
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function jsonForScript(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

const staticPages: Page[] = [
  {
    file: 'work/index.html',
    path: '/work',
    title: 'Selected Work — Hasibur Rahman',
    description:
      'Case studies in production call-center analytics, backend systems, retrieval, and agentic workflows: Chaldal, legal RAG, voice scheduling, and WhatsApp BI.',
    type: 'website',
  },
  {
    file: 'writing/index.html',
    path: '/writing',
    title: 'Writing — Hasibur Rahman',
    description:
      'Essays on AI systems, data modeling, Bangla NLP, ASR, backend engineering, and the parts of production nobody puts in the demo.',
    type: 'website',
  },
  {
    file: 'about.html',
    path: '/about',
    title: 'About — Hasibur Rahman',
    description:
      'AI Systems Engineer in Dhaka. The longer story: voice AI, Go services, retrieval design, competitive programming, and production systems.',
    type: 'website',
  },
  {
    file: 'resume/index.html',
    path: '/resume',
    title: 'Resume — Hasibur Rahman',
    description:
      'Two resumes: AI Systems (LLM, RAG, speech, agentic systems) and Backend (Golang microservices, databases, observability).',
    type: 'website',
  },
]

const postPages: Page[] = posts.map((post) => ({
  file: `writing/${post.slug}.html`,
  path: `/writing/${post.slug}`,
  title: `${post.title} — Hasibur Rahman`,
  description: post.description,
  type: 'article',
  html: `<article class="mx-auto max-w-[720px] px-6 py-12"><h1>${escapeHtml(post.title)}</h1><p>${escapeHtml(post.description)}</p><div class="prose-editorial">${renderToStaticMarkup(
    createElement(ReactMarkdown, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug],
      children: post.body,
    }),
  )}</div></article>`,
}))

const caseStudyPages: Page[] = caseStudies.map((project) => ({
  file: `work/${project.slug}.html`,
  path: `/work/${project.slug}`,
  title: `${project.title} — Hasibur Rahman`,
  description: project.metaDescription,
  type: 'article',
}))

function renderPage(shell: string, page: Page) {
  const url = `${SITE_URL}${page.path}`
  const image = `${SITE_URL}/og-image.png`
  const title = escapeHtml(page.title)
  const description = escapeHtml(page.description)
  const article = posts.find((post) => `/writing/${post.slug}` === page.path)

  const head = [
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${page.type}" />`,
    `<meta property="og:site_name" content="Hasibur Rahman" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    ...(article
      ? [
          `<script type="application/ld+json">${jsonForScript({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: article.title,
            description: article.description,
            ...(article.date ? { datePublished: article.date } : {}),
            author: {
              '@type': 'Person',
              name: 'Hasibur Rahman',
              url: `${SITE_URL}/`,
            },
            mainEntityOfPage: url,
            keywords: article.tags.join(', '),
            articleSection: article.category,
          })}</script>`,
        ]
      : []),
  ].join('\n    ')

  return shell
    .replace(/<title>.*?<\/title>/, () => `<title>${title}</title>`)
    .replace('</head>', () => `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', () => `<div id="root">${page.html ?? ''}</div>`)
}

async function main() {
  const dist = path.resolve('dist')
  const shell = await readFile(path.join(dist, 'index.html'), 'utf8')
  const pages = [...staticPages, ...postPages, ...caseStudyPages]

  for (const page of pages) {
    const target = path.join(dist, page.file)
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, renderPage(shell, page))
  }

  console.log(`Prerendered ${pages.length} pages.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
