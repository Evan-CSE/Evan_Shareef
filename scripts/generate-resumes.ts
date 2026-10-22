import { access, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { resumes, type ResumeContent } from '../src/data/resume'

const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const MARGIN = 42
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

const colors = {
  ink: rgb(0.078, 0.078, 0.078),
  ink2: rgb(0.271, 0.255, 0.235),
  muted: rgb(0.435, 0.416, 0.388),
  line: rgb(0.898, 0.878, 0.839),
  orange: rgb(1, 0.4, 0),
  paper: rgb(0.984, 0.98, 0.969),
}

type Fonts = {
  regular: Awaited<ReturnType<PDFDocument['embedFont']>>
  bold: Awaited<ReturnType<PDFDocument['embedFont']>>
  mono: Awaited<ReturnType<PDFDocument['embedFont']>>
}

function wrapText(
  text: string,
  font: Awaited<ReturnType<PDFDocument['embedFont']>>,
  size: number,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      line = candidate
    } else {
      if (line) lines.push(line)
      line = word
    }
  }

  if (line) lines.push(line)
  return lines
}

async function buildPdf(resume: ResumeContent) {
  const doc = await PDFDocument.create()
  const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  const fonts: Fonts = {
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
    mono: await doc.embedFont(StandardFonts.Courier),
  }

  doc.setTitle(`Hasibur Rahman — ${resume.title}`)
  doc.setAuthor('Md Hasibur Rahman')
  doc.setSubject(resume.focus)
  doc.setKeywords(['AI systems', 'LLM', 'RAG', 'Go', 'backend'])
  doc.setCreator('Hasibur Rahman portfolio')
  doc.setProducer('pdf-lib')

  let y = PAGE_HEIGHT - MARGIN
  const write = (
    text: string,
    x: number,
    font = fonts.regular,
    size = 8.6,
    color = colors.ink2,
  ) => {
    page.drawText(text, { x, y, size, font, color })
  }

  page.drawRectangle({
    x: MARGIN,
    y: y - 1,
    width: 58,
    height: 3,
    color: colors.orange,
  })

  y -= 27
  write('Hasibur Rahman', MARGIN, fonts.bold, 22, colors.ink)
  y -= 14
  write(resume.title, MARGIN, fonts.mono, 9, colors.orange)
  y -= 14
  write(
    'Dhaka, Bangladesh  /  evanshareef@gmail.com  /  linkedin.com/in/evan-shareef  /  github.com/Evan-CSE',
    MARGIN,
    fonts.regular,
    7.8,
    colors.muted,
  )
  y -= 12
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 0.8,
    color: colors.line,
  })

  y -= 18
  write('SUMMARY', MARGIN, fonts.mono, 8.5, colors.orange)
  y -= 12
  for (const line of wrapText(resume.summary, fonts.regular, 8.6, CONTENT_WIDTH)) {
    write(line, MARGIN)
    y -= 10.2
  }

  y -= 8
  write('EXPERIENCE', MARGIN, fonts.mono, 8.5, colors.orange)
  y -= 13

  for (const role of resume.experience) {
    write(role.role, MARGIN, fonts.bold, 9.4, colors.ink)
    const periodWidth = fonts.regular.widthOfTextAtSize(role.period, 8)
    write(
      role.period,
      PAGE_WIDTH - MARGIN - periodWidth,
      fonts.regular,
      8,
      colors.muted,
    )
    y -= 11
    write(`${role.company}  /  ${role.location}`, MARGIN, fonts.regular, 8.4, colors.ink2)
    y -= 11
    for (const bullet of role.bullets) {
      const lines = wrapText(bullet, fonts.regular, 8.4, CONTENT_WIDTH - 12)
      lines.forEach((line, lineIndex) => {
        if (lineIndex === 0) {
          write('-', MARGIN + 2, fonts.regular, 8.4, colors.muted)
        }
        write(line, MARGIN + 12)
        y -= 9.9
      })
    }
    y -= 4
  }

  y -= 5
  write('SELECTED WORK', MARGIN, fonts.mono, 8.5, colors.orange)
  y -= 13
  for (const project of resume.projects) {
    write(project.title, MARGIN, fonts.bold, 8.8, colors.ink)
    y -= 10
    for (const line of wrapText(project.detail, fonts.regular, 8.2, CONTENT_WIDTH)) {
      write(line, MARGIN)
      y -= 9.5
    }
    y -= 3
  }

  y -= 5
  write('SKILLS', MARGIN, fonts.mono, 8.5, colors.orange)
  y -= 12
  for (const skill of resume.skills) {
    write(`${skill.label}:`, MARGIN, fonts.bold, 8.2, colors.ink2)
    const labelWidth = fonts.bold.widthOfTextAtSize(`${skill.label}: `, 8.2)
    const valueLines = wrapText(skill.value, fonts.regular, 8.2, CONTENT_WIDTH - labelWidth)
    valueLines.forEach((line, index) => {
      write(line, MARGIN + labelWidth, fonts.regular, 8.2, colors.ink2)
      if (index < valueLines.length - 1) y -= 9.4
    })
    y -= 10.4
  }

  y -= 4
  write('EDUCATION', MARGIN, fonts.mono, 8.5, colors.orange)
  y -= 12
  for (const line of wrapText(resume.education, fonts.regular, 8.3, CONTENT_WIDTH)) {
    write(line, MARGIN)
    y -= 9.8
  }

  y -= 8
  write('RECOGNITION', MARGIN, fonts.mono, 8.5, colors.orange)
  y -= 12
  for (const item of resume.recognition) {
    for (const line of wrapText(item, fonts.regular, 8.2, CONTENT_WIDTH - 12)) {
      write(line, MARGIN + 12)
      y -= 9.5
    }
  }

  const footerY = MARGIN - 10
  page.drawLine({
    start: { x: MARGIN, y: footerY + 8 },
    end: { x: PAGE_WIDTH - MARGIN, y: footerY + 8 },
    thickness: 0.8,
    color: colors.line,
  })
  const footer =
    'Portfolio: evan-cse.github.io/Evan_Shareef  /  Open to APAC + Europe  /  Relocation + visa sponsorship'
  write(footer, MARGIN, fonts.mono, 6.8, colors.muted)

  const bytes = await doc.save()
  return bytes
}

async function main() {
  const outputDir = path.resolve('public/resume')
  await mkdir(outputDir, { recursive: true })
  const force = process.argv.includes('--force')
  let generated = 0

  for (const resume of resumes) {
    const destination = path.join(outputDir, path.basename(resume.file))

    if (!force) {
      try {
        await access(destination)
        console.log(`Kept existing ${path.basename(resume.file)}.`)
        continue
      } catch {
        // No existing PDF, so generate the fallback below.
      }
    }

    const bytes = await buildPdf(resume)
    await writeFile(destination, bytes)
    generated += 1
  }

  console.log(
    generated > 0
      ? `Generated ${generated} fallback resume PDF${generated === 1 ? '' : 's'}.`
      : 'Using the resume PDFs already in public/resume.',
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
