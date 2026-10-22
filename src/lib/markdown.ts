import GithubSlugger from 'github-slugger'

export type Heading = {
  depth: 2 | 3
  text: string
  id: string
}

export function extractHeadings(markdown: string): Heading[] {
  const withoutCode = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '')

  const slugger = new GithubSlugger()
  const headings: Heading[] = []

  for (const line of withoutCode.split('\n')) {
    const match = /^(##|###)\s+(.+)$/.exec(line.trim())
    if (!match) continue
    const text = match[2]
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[*_~]/g, '')
      .trim()
    if (!text) continue
    headings.push({
      depth: match[1].length as 2 | 3,
      text,
      id: slugger.slug(text),
    })
  }

  return headings
}
