export const site = {
  name: 'Hasibur Rahman',
  formalName: 'Md Hasibur Rahman',
  wordmark: 'hasibur.',
  role: 'AI Systems Engineer',
  secondaryRole: 'Backend & AI Infrastructure',
  location: 'Dhaka, Bangladesh',
  timezone: 'UTC+6',
  email: 'evanshareef@gmail.com',
  availability:
    'Open to AI Systems, LLM, Agentic AI, Platform, and Backend roles · APAC + Europe · relocation and visa sponsorship',
  shortAvailability: 'Open to roles · APAC + Europe · relocation + sponsorship',
  // TODO: confirm the resume revision date before publishing the PDFs.
  lastUpdated: 'October 2026',
  // TODO: replace with a custom domain if Hasibur owns one.
  siteUrl:
    (import.meta.env.VITE_SITE_URL as string | undefined) ??
    'https://evan-cse.github.io/Evan_Shareef',
  defaultDescription:
    'AI Systems Engineer in Dhaka building production LLM, RAG, speech, and Go backend systems. Open to APAC and Europe roles with relocation and visa sponsorship.',
  links: {
    linkedin: 'https://www.linkedin.com/in/evan-shareef/',
    github: 'https://github.com/Evan-CSE',
    huggingface: 'https://huggingface.co/Noobbbbb',
    whatsapp: 'https://wa.me/8801821484988',
    email: 'mailto:evanshareef@gmail.com',
    rss: '/rss.xml',
  },
  nav: [
    { label: 'Work', href: '/work' },
    { label: 'Writing', href: '/writing' },
    { label: 'About', href: '/about' },
    { label: 'Resume', href: '/resume' },
  ],
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/evan-shareef/', external: true },
    { label: 'GitHub', href: 'https://github.com/Evan-CSE', external: true },
    { label: 'Hugging Face', href: 'https://huggingface.co/Noobbbbb', external: true },
    { label: 'Email', href: 'mailto:evanshareef@gmail.com', external: false },
  ],
} as const

export const hero = {
  eyebrow: 'AI SYSTEMS ENGINEER · DHAKA, BANGLADESH',
  claim: 'I build the plumbing that makes AI work in production.',
  body:
    "Most AI teams don't fail at the model. They fail at the backend around it: retrieval design, data quality, inference cost, concurrency, and observability. I've spent the last three years building that layer — Bangla ASR, six Go microservices, and RAG pipelines that hold up under real call-center traffic.",
}

export const proof = [
  { value: '3+ yrs', label: 'Production engineering' },
  { value: '1.2M+', label: 'Users served at Chaldal' },
  { value: '13 days → 1 day', label: 'Bangla call audio processed' },
  { value: '6', label: 'Golang microservices led' },
  { value: '1M+', label: 'Agent steps validated' },
]

export const currently = {
  role: 'AI Engineer L-II at Vivasoft Limited',
  project: 'Call center analytics — transcribes audio and generates insights',
  location: 'Dhaka, Bangladesh · UTC+6',
  focus: 'LLM orchestration · RAG · ASR · Go services',
  status: 'Open to roles · relocation + sponsorship',
}


