export type ResumeContent = {
  id: 'ai-systems' | 'backend'
  label: string
  file: string
  title: string
  summary: string
  focus: string
  skills: { label: string; value: string }[]
  experience: {
    company: string
    role: string
    period: string
    location: string
    bullets: string[]
  }[]
  projects: { title: string; detail: string }[]
  education: string
  recognition: string[]
}

const sharedExperience = [
  {
    company: 'Vivasoft Limited',
    role: 'AI Engineer L-II',
    period: 'Mar 2025 - Present',
    location: 'Dhaka, BD',
    bullets: [
      'Lead a 4-engineer team on a call-center analytics platform that transcribes and generates insights from 125+ hours of calls daily.',
      'Fine-tuned Bangla ASR for low-bitrate telephony; 13 days of call audio now processes in 1 day. Custom tokenizer cut tokens by 64%.',
      'Architected 6 Golang microservices on GCP with RabbitMQ DLX/DLQ, Redis integrity safeguards, Terraform, and Prometheus/Grafana.',
      'Built an OAuth 2.0-secured MCP server interoperable with OpenCode, Cline, and other MCP clients.',
    ],
  },
  {
    company: 'Vivasoft Limited',
    role: 'Software Engineer',
    period: 'Jun 2024 - Mar 2025',
    location: 'Dhaka, BD',
    bullets: [
      'Modernized a legacy VBScript desktop application with a middleware API layer, reducing code size by 85%.',
      'Built secure license validation and isolated storage for a hybrid online/offline desktop product.',
    ],
  },
  {
    company: 'Chaldal',
    role: 'Software Engineer',
    period: 'Mar 2023 - Jun 2024',
    location: 'Dhaka, BD',
    bullets: [
      'Cut per-order fraud loss by 40 BDT using sargable queries and background processing on a platform with 1.2M+ users.',
      'Rebuilt the address-change flow used by 1M+ users in React with MobX and TypeScript.',
      'Designed an Observer-pattern behavioral logging system for personalized catalog recommendations.',
    ],
  },
]

const aiSkills = [
  { label: 'Languages', value: 'Python, Go, C#, TypeScript, C++' },
  {
    label: 'AI / ML',
    value:
      'PyTorch, TensorFlow, Hugging Face, LangChain, DeepEval, NeMo, FairSeq, Gemini, LiveKit',
  },
  {
    label: 'Backend',
    value:
      'FastAPI, ASP.NET Core, Gin, PostgreSQL, Redis, Qdrant, Neo4j, RabbitMQ, Hangfire',
  },
  {
    label: 'Infra',
    value:
      'GCP, AWS, Azure, Docker, Terraform, Prometheus, Grafana, event-driven systems',
  },
]

const backendSkills = [
  { label: 'Languages', value: 'Go, C#, Python, TypeScript, SQL' },
  {
    label: 'Backend',
    value:
      'Golang microservices, ASP.NET Core, FastAPI, REST APIs, RabbitMQ, Hangfire',
  },
  {
    label: 'Data',
    value:
      'PostgreSQL, SQL Server, MySQL, Redis, Entity Framework, Qdrant, Neo4j',
  },
  {
    label: 'Infra',
    value:
      'GCP, Azure, AWS, Docker, Terraform, Prometheus, Grafana, CI/CD',
  },
]

export const resumes: ResumeContent[] = [
  {
    id: 'ai-systems',
    label: 'AI Systems',
    file: '/resume/hasibur-rahman-ai-systems.pdf',
    title: 'AI Systems Engineer',
    summary:
      'AI Systems Engineer who builds the backend that makes AI hold up in production. 3+ years across voice AI, retrieval, agentic workflows, and Go services. Led a 4-engineer team on a platform processing 125+ hours of calls per day.',
    focus:
      'LLM orchestration, RAG, speech, agentic systems, Go backend, evaluation.',
    skills: aiSkills,
    experience: sharedExperience,
    projects: [
      {
        title: 'Call Center Analytics Platform',
        detail:
          'Bangla ASR, 64% token reduction, 6 Go microservices, event-sourced ingestion, star-schema analytics, MCP tools, 1M+ validated agent steps. 13 days of audio processed in 1 day.',
      },
      {
        title: 'Intelligent Legal Multi-Agent RAG',
        detail:
          'Four specialized agents, Qdrant + Neo4j hybrid retrieval, query decomposition, citation-first answers, Clean Architecture.',
      },
      {
        title: 'AI Voice Calendar Scheduler',
        detail:
          'Self-hosted Faster-Whisper and Piper, LiveKit interruptions, calendar conflict checks, MCP server/client.',
      },
    ],
    education:
      'BSc in Computer Science & Engineering, Jatiya Kabi Kazi Nazrul Islam University. CGPA 3.53. 2018 - 2023.',
    recognition: [
      'ICPC Asia Dhaka Regional 2021 - Divisional Champion.',
      'HackerEarth ML Challenge 2025 - Top 6% (42/1,244).',
      '1,200+ DSA problems solved. GDG Dhaka speaker, 2026.',
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    file: '/resume/hasibur-rahman-backend.pdf',
    title: 'Backend Engineer',
    summary:
      'Backend engineer with 3+ years building production services for 1.2M+ users. Golang microservices, event-driven ingestion, relational and vector data, observability, and legacy modernization. Comfortable owning a system from schema to on-call.',
    focus:
      'Go services, event-driven architecture, databases, reliability, observability.',
    skills: backendSkills,
    experience: sharedExperience,
    projects: [
      {
        title: 'Call Center Analytics backend',
        detail:
          '6 Golang microservices on GCP, RabbitMQ DLX/DLQ, Redis integrity safeguards, idempotent event ingestion, Terraform, Prometheus/Grafana.',
      },
      {
        title: 'Chaldal platform',
        detail:
          'Sargable fraud query reduced loss by 40 BDT/order. Address flow for 1M+ users. Observer-pattern behavioral logging. 72% savings-flow improvement.',
      },
      {
        title: 'InspectorPC / Wigersma & Sikkema',
        detail:
          'Legacy VBScript modernization with a middleware API layer and Railway Oriented Programming; 85% code-size reduction, secure licensing.',
      },
    ],
    education:
      'BSc in Computer Science & Engineering, Jatiya Kabi Kazi Nazrul Islam University. CGPA 3.53. 2018 - 2023.',
    recognition: [
      'ICPC Asia Dhaka Regional 2021 - Divisional Champion.',
      'ICPC Dhaka Online Preliminary 2021 - Top 10% (185/1,747).',
      '1,200+ DSA problems solved. GDG Dhaka speaker, 2026.',
    ],
  },
]

