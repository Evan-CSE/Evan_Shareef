import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const publicDir = path.resolve('public')

const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#FBFAF7"/>
  <text x="742" y="610" font-family="Arial, Helvetica, sans-serif" font-size="440" font-weight="700" fill="#141414" opacity="0.045">01</text>
  <rect x="64" y="62" width="72" height="4" fill="#FF6600"/>
  <text x="64" y="118" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="700" fill="#141414">hasibur<tspan fill="#FF6600">.</tspan></text>
  <text x="64" y="285" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="700" letter-spacing="-2" fill="#141414">AI Systems Engineer</text>
  <text x="64" y="355" font-family="Arial, Helvetica, sans-serif" font-size="36" fill="#45413C">I build the plumbing that makes AI</text>
  <text x="64" y="404" font-family="Arial, Helvetica, sans-serif" font-size="36" fill="#45413C">work in production.</text>
  <line x1="64" y1="480" x2="1136" y2="480" stroke="#E5E0D6" stroke-width="1"/>
  <text x="64" y="531" font-family="Courier New, monospace" font-size="16" letter-spacing="2" fill="#6F6A63">PRODUCTION LLM / RAG / SPEECH / GO BACKEND</text>
  <text x="1136" y="531" text-anchor="end" font-family="Courier New, monospace" font-size="16" letter-spacing="2" fill="#6F6A63">DHAKA / OPEN TO APAC + EUROPE</text>
  <text x="64" y="580" font-family="Courier New, monospace" font-size="14" letter-spacing="2" fill="#B23A00">EVAN-CSE.GITHUB.IO/EVAN_SHAREEF</text>
</svg>
`

const faviconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="56" fill="#FF6600"/>
  <text x="256" y="354" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="300" font-weight="700" fill="#141414">H</text>
</svg>
`

async function main() {
  await mkdir(publicDir, { recursive: true })

  const portrait = sharp(path.join(publicDir, 'portrait.jpg')).resize({
    width: 640,
    height: 800,
    fit: 'cover',
    position: 'top',
  })
  await portrait.clone().webp({ quality: 78 }).toFile(path.join(publicDir, 'portrait-640.webp'))
  await portrait
    .clone()
    .resize({ width: 320, height: 400, fit: 'cover', position: 'top' })
    .webp({ quality: 78 })
    .toFile(path.join(publicDir, 'portrait-320.webp'))

  await sharp(Buffer.from(ogSvg)).png().toFile(path.join(publicDir, 'og-image.png'))
  await sharp(Buffer.from(faviconSvg)).png().resize(32, 32).toFile(path.join(publicDir, 'favicon-32.png'))
  await sharp(Buffer.from(faviconSvg)).png().resize(180, 180).toFile(path.join(publicDir, 'favicon-180.png'))
  await sharp(Buffer.from(faviconSvg)).png().resize(512, 512).toFile(path.join(publicDir, 'favicon-512.png'))
  await writeFile(path.join(publicDir, 'favicon.svg'), faviconSvg.trim())
  await writeFile(
    path.join(publicDir, 'site.webmanifest'),
    JSON.stringify(
      {
        name: 'Hasibur Rahman — AI Systems Engineer',
        short_name: 'Hasibur',
        description:
          'AI Systems Engineer building production LLM, RAG, speech, and Go backend systems.',
        start_url: './',
        display: 'standalone',
        background_color: '#FBFAF7',
        theme_color: '#FBFAF7',
        icons: [
          {
            src: 'favicon-180.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'favicon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },
      null,
      2,
    ),
  )

  console.log('Generated OG image, favicons, and web manifest.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

