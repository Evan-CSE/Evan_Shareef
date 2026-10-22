export type Recognition = {
  year: string
  title: string
  detail: string
  href?: string
}

export const speaking: Recognition[] = [
  {
    year: '2026',
    title: 'GDG Dhaka — Build with AI Dhaka',
    detail:
      'Speaker on combining Gemini and GCP for scalable AI. University of Asia Pacific.',
  },
  {
    year: '2026',
    title: 'ICPC trainer',
    detail: 'Midday Programming Club, JKKNIU.',
  },
  {
    year: '2026',
    title: 'Mentor, Innovative Skills LTD',
    detail: 'Python, problem solving, and backend fundamentals.',
  },
  {
    year: '2019',
    title: 'JKKNIU Research Presentation',
    detail: '1st runner-up.',
  },
  {
    year: '2019',
    title: 'JKKNIU SDC Public Speaking Competition',
    detail: '4th place.',
  },
]

export const openSource: Recognition[] = [
  {
    year: 'HF',
    title: 'Bangla ASR model + dataset',
    detail:
      'Fine-tuned CTC-based model and curated dataset for Bengali speech.',
    href: 'https://huggingface.co/Noobbbbb',
  },
  {
    year: 'CP',
    title: 'LightOJ 1041 editorial',
    detail: 'Competitive programming community.',
  },
  {
    year: 'WEB',
    title: 'Technical articles',
    detail: 'NoSQL, object wrappers in JS, garbage collection in JS.',
  },
]

export const recognition: Recognition[] = [
  {
    year: '2025',
    title: 'HackerEarth ML Challenge: World Water Day',
    detail: 'Top 6% (42/1,244).',
  },
  {
    year: '2025',
    title: 'Kaggle: Predicting Road Accident Risk',
    detail: 'Top 34.5%.',
  },
  {
    year: '2021',
    title: 'ICPC Asia Dhaka Regional',
    detail: 'Divisional Champion.',
  },
  {
    year: '2021',
    title: 'ICPC Dhaka Online Preliminary',
    detail: 'Top 10% (185/1,747).',
  },
  {
    year: '2022',
    title: 'ICPC Dhaka Online Preliminary',
    detail: 'Top 12% (206/1,648).',
  },
  {
    year: '—',
    title: 'Competitive programming',
    detail: '1,200+ DSA problems solved across platforms.',
  },
]

export const certifications = [
  {
    title: 'Supervised Machine Learning: Regression and Classification',
    issuer: 'Coursera',
    year: '2022',
  },
  { title: 'Problem Solving', issuer: 'HackerRank', year: '2022' },
  {
    title: 'International Youth Math Challenge',
    issuer: 'Qualification + pre-final',
    year: '2022',
  },
  {
    title: 'Programming for Everybody (Python)',
    issuer: 'Coursera',
    year: '2020',
  },
  { title: 'Python Data Structures', issuer: 'Coursera', year: '2020' },
  { title: 'Using Python to Access Web Data', issuer: 'Coursera', year: '2020' },
  {
    title: 'Web Application Technologies and Django',
    issuer: 'Coursera',
    year: '2020',
  },
]
