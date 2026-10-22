export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ')
}

export function publicAsset(path: string): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  return `${base}/${path.replace(/^\//, '')}`
}

export function absoluteUrl(path: string): string {
  const base = (
    (import.meta.env.VITE_SITE_URL as string | undefined) ??
    'https://evan-cse.github.io/Evan_Shareef'
  ).replace(/\/$/, '')
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[`*_~]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

export function mailto(subject: string): string {
  return `mailto:evanshareef@gmail.com?subject=${encodeURIComponent(subject)}`
}
