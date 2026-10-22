export type Experience = {
  company: string
  role: string
  period: string
  location: string
  current?: boolean
  scope: string
  bullets: string[]
  stack: string
}

export const experience: Experience[] = [
  {
    company: 'Vivasoft Limited',
    role: 'AI Engineer L-II',
    period: 'MAR 2025 — PRESENT',
    location: 'Dhaka, BD',
    current: true,
    scope: 'Team lead and AI backend owner on a call-center analytics platform.',
    bullets: [
      'Lead a 4-engineer team on a call-center analytics platform that transcribes and generates insights from 125+ hours of calls daily.',
      'Fine-tuned Bangla ASR for low-bitrate telephony; 13 days of call audio now processes in 1 day. A custom tokenizer cut token count by 64%.',
      'Architected 6 Golang microservices on GCP with RabbitMQ DLX/DLQ, Redis integrity safeguards, Terraform, and Prometheus/Grafana.',
      'Built an OAuth 2.0-secured MCP server interoperable with OpenCode, Cline, and other MCP clients.',
    ],
    stack:
      'Go, Python, FastAPI, Gemini, LangChain, RabbitMQ, Redis, GCP, Terraform, MCP',
  },
  {
    company: 'Vivasoft Limited',
    role: 'Software Engineer',
    period: 'JUN 2024 — MAR 2025',
    location: 'Dhaka, BD',
    scope: 'Legacy desktop modernization and secure hybrid deployment.',
    bullets: [
      'Modernized a legacy VBScript desktop application with a middleware API layer and Railway Oriented Programming, reducing code size by 85%.',
      'Built secure license validation and isolated storage for a hybrid online/offline desktop product.',
    ],
    stack: 'C#, .NET, WPF, Spring.NET, LINQ, AutoMapper, REST APIs',
  },
  {
    company: 'Chaldal',
    role: 'Software Engineer',
    period: 'MAR 2023 — JUN 2024',
    location: 'Dhaka, BD',
    scope: 'Backend systems for a YC-backed e-commerce platform serving 1.2M+ users.',
    bullets: [
      'Cut per-order fraud loss by 40 BDT using sargable queries and background processing.',
      'Rebuilt the address-change flow used by 1M+ users in React (MobX + TypeScript), reducing friction.',
      'Designed an Observer-pattern behavioral logging system powering personalized catalog recommendations.',
    ],
    stack: 'ASP.NET Core, C#, TypeScript, React, React Native, Entity Framework, Hangfire, Azure',
  },
  {
    company: 'Innovative Skills LTD',
    role: 'Mentor',
    period: 'MAR 2026 — OCT 2026',
    location: 'Dhaka, BD · Part-time',
    scope: 'Mentoring early-career engineers.',
    bullets: [
      'Mentored early-career engineers on Python, problem solving, and backend fundamentals.',
    ],
    stack: 'Python, coaching, technical interview preparation',
  },
]

export const education = {
  institution: 'Jatiya Kabi Kazi Nazrul Islam University',
  degree: 'BSc in Computer Science & Engineering',
  // TODO: confirm the exact graduation date; the resume and LinkedIn differ.
  period: 'JAN 2018 — APR 2023',
  location: 'Mymensingh, BD',
  detail:
    'CGPA 3.53. Coursework and community work in algorithms, systems, and machine learning.',
}

