export type DiagramColumn = {
  label: string
  items: string[]
}

export type CaseStudy = {
  slug: string
  name: string
  title: string
  category: string
  year: string
  status: 'Production' | 'Prototype' | 'Ongoing'
  dek: string
  metaDescription: string
  role: string
  team: string
  timeline: string
  stack: string[]
  metrics: string[]
  context: string
  problem: string
  constraints: string[]
  decisions: { title: string; body: string }[]
  architecture: {
    caption: string
    columns: DiagramColumn[]
  }
  results: { title: string; body: string }[]
  resultNote: string
  lessons: string[]
  links: { label: string; href?: string; note?: string }[]
  relatedPosts: string[]
  featured: boolean
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'call-center-analytics',
    name: 'Call Center Analytics Platform',
    title: 'Making call-center audio answer business questions',
    category: 'Call-center analytics · Audio intelligence',
    year: '2024 — PRESENT',
    status: 'Production',
    dek: 'A call-center analytics platform that transcribes 125+ hours of daily calls and generates insights: customer profiles, escalations, and owner-level reports. The hard part was not the model. It was the data model, the tokenizer, and the queue.',
    metaDescription:
      'A call-center analytics platform that transcribes audio and generates insights: Bangla ASR, six Go services, 13 days of audio in one day.',
    role: 'AI Engineer L-II · Team lead',
    team: '4 engineers',
    timeline: '2024 — present',
    stack: ['Go', 'Python', 'Gemini', 'RabbitMQ', 'Redis', 'GCP', 'Terraform'],
    metrics: ['13 days → 1 day', '64% fewer tokens', '1M+ agent steps'],
    context:
      'This is a call-center analytics platform that transcribes call audio and generates insights. A mid-sized operation records more than 125 hours of conversation every day. The people running it do not need another transcript viewer. They need to know which customers are at risk, which calls escalated, what agents miss, and what the owner should fix next week. The platform turns raw calls into customer profiles, issue signals, escalation flags, and owner-level reporting.\\n\\nI led a four-engineer team and owned the AI backend: the speech pipeline, the Bengali tokenizer, the six Go services underneath it, the retrieval and evaluation layer, and the MCP surface that exposes analytics to agents.',
    problem:
      'The naive version looks obvious: send each recording to a hosted ASR API, push the transcript into a long-context model, and ask for a summary. It breaks in four places.\n\nBangla telephony audio is low-bitrate and noisy. A generic model returns plausible text with the wrong names and numbers. Long transcripts burn tokens and cost. A single failed step loses a call. And a generated summary cannot be audited against the source. We were not building a demo. We were building a system that had to be right enough to change how a business operates.',
    constraints: [
      '125+ hours of new audio every day, with a cost ceiling per call.',
      'Low-bitrate Bangla, code-switching, and inconsistent telephony channels.',
      'A four-engineer team and a production deadline, not a research budget.',
      'Multi-tenant customer data that could not leak between accounts.',
      'Outputs that had to be traceable enough for a business owner to act on.',
    ],
    decisions: [
      {
        title: 'Fine-tune the ASR for the telephone channel',
        body:
          'I treated the speech model as a product component, not a vendor call. We started with generic Bangla models and measured them against real call audio. The failures were consistent: dropped word endings, hallucinated names, and confusion around numbers. We curated domain audio, segmented it for training, and fine-tuned a CTC-based Bangla ASR stack for the channel.\n\nThe tradeoff was operational: another model to version, evaluate, and deploy. The payoff was a pipeline that could process 13 days of call audio in one day instead of thirteen. We kept the evaluation set frozen so tuning did not turn into a hunt for a better-looking number.',
      },
      {
        title: 'Treat Bangla tokenization as an engineering problem',
        body:
          'Bangla text is full of visually similar character sequences and zero-width joiners. Byte-level tokenizers split the same word into different token sequences depending on how it was typed. That inflates cost and quietly changes retrieval results.\n\nI normalized text before tokenization and built a custom Bengali tokenizer around the vocabulary the calls actually used. Token count dropped by 64 percent. That is a cost number and a latency number, but the more important result was consistency: the same sentence stopped becoming three different inputs.\n\nIt also added a maintenance burden. A custom tokenizer needs versioned vocabulary, migration notes, and regression tests. I would rather own that than pretend the preprocessing step is free.',
      },
      {
        title: 'Make ingestion event-sourced before it is smart',
        body:
          'The first version of the pipeline was a chain of synchronous calls. When one step failed, the call disappeared. There was no clean way to replay it. We rebuilt ingestion around six Golang microservices, an event store, and RabbitMQ.\n\nEvents are written before processing. Consumers are idempotent. A dead-letter exchange catches failures instead of dropping them. Redis holds integrity safeguards so repeated delivery does not create duplicate profiles. The tradeoff is complexity: more moving parts, more dashboards, more reasons for an on-call engineer to be awake.\n\nIt was still the right trade. A voice platform that silently loses calls is not a voice platform. It is a demo with a billing page.',
      },
      {
        title: 'Model analytics as a star schema, not a pile of summaries',
        body:
          'LLM summaries are useful for reading. They are a poor storage format for a business. We modeled call facts and dimensions separately so owner-level reports could be queried and audited. The LLM wrote narrative, but the numbers came from SQL over a schema we controlled.\n\nThat choice made the MCP layer possible. Instead of exposing an opaque \'ask the transcript\' endpoint, we exposed bounded tools over the analytics model: customer history, escalation trends, issue counts, call outcomes. Other agents could call the same tools and get the same answer.\n\nThe hard part was not the schema. It was deciding what a \'customer\' and an \'issue\' meant across tenants and channels. That is data modeling, not prompt engineering.',
      },
      {
        title: 'Gate agentic workflows with validation',
        body:
          'We used MAKER-based agentic workflows to generate and verify multi-step analysis. A planner proposes work, executors call tools, and a validation layer checks the result against the evidence before it is accepted. We have validated more than one million execution steps through that loop.\n\nThe obvious cost is latency. The less obvious benefit is that failures become visible. A workflow that cannot find evidence does not produce a confident answer; it stops or marks the output as incomplete.\n\nI would not present this as autonomous intelligence. It is a controlled pipeline with an agent-shaped interface. The validation is the product.',
      },
    ],
    architecture: {
      caption:
        'A simplified production path. Client names and dashboard internals are withheld; the architecture is redrawn with generic labels.',
      columns: [
        { label: 'Ingest', items: ['Call recordings', 'Call metadata'] },
        { label: 'Stream', items: ['Go ingestion API', 'Event store', 'RabbitMQ + DLX'] },
        { label: 'Speech', items: ['ASR workers', 'Bangla normalizer', 'Tokenizer'] },
        {
          label: 'Intelligence',
          items: ['Star schema', 'Vector index', 'RAG + evals'],
        },
        {
          label: 'Surface',
          items: ['Owner reports', 'Customer profiles', 'MCP tools'],
        },
      ],
    },
    results: [
      {
        title: '13 days → 1 day',
        body:
          'The speech pipeline processes roughly thirteen days of call audio in a single day, which changed what the business could ask for and when it could ask.',
      },
      {
        title: '64% fewer tokens',
        body:
          'The Bengali tokenizer reduced token count by 64 percent, lowering inference cost and making the downstream retrieval layer more predictable.',
      },
      {
        title: '1M+ validated steps',
        body:
          'Agentic workflows have passed more than one million validated execution steps, backed by explicit evidence checks and fallback paths.',
      },
      {
        title: '7/8 DeepEval dimensions',
        body:
          'The retrieval layer reached 100% faithfulness, 100% conversation completeness, 93% knowledge retention, and 7 of 8 DeepEval dimensions. A separate security evaluation scored 100% on GEval.',
      },
    ],
    resultNote:
      'These are platform outcomes. I led the four-engineer team and owned the AI backend, Go service architecture, retrieval design, and MCP layer. The remaining product surface was built by the team. Client data, recordings, and dashboards are not shown.',
    lessons: [
      'Build the evaluation harness before tuning the first model. Retrofitting evals makes every later decision harder to defend.',
      'Make Unicode normalization a shared library, not a task inside one service. The bug will reappear everywhere text is stored.',
      'Instrument queue depth and process memory before launch. The most dangerous incident is the one where the dashboard looks healthy.',
    ],
    links: [
      { label: 'Internal system. Code not public.', note: 'Client and recording data withheld.' },
      { label: 'Related note: 13 days of call audio in 1 day', href: '/writing/13-days-of-call-audio-in-1-day' },
      { label: 'Related note: The RabbitMQ bug in a Go channel', href: '/writing/rabbitmq-bug-go-channel' },
    ],
    relatedPosts: ['13-days-of-call-audio-in-1-day', 'rabbitmq-bug-go-channel'],
    featured: true,
  },
  {
    slug: 'chaldal',
    name: 'Chaldal',
    title: 'Cutting fraud loss 40 BDT at a time',
    category: 'Backend · E-commerce',
    year: '2023 — 2024',
    status: 'Production',
    dek: 'At Bangladesh\'s largest e-commerce platform, small backend decisions compounded at the scale of a million users. This is the work behind a fraud rule, an address flow, and a savings engine.',
    metaDescription:
      'At Chaldal, I cut fraud loss by 40 BDT per order, rebuilt an address flow used by 1M+ users, and improved a savings engine by 72%.',
    role: 'Software Engineer',
    team: 'Platform team',
    timeline: 'Mar 2023 — Jun 2024',
    stack: ['ASP.NET Core', 'C#', 'TypeScript', 'React', 'React Native', 'Entity Framework', 'Hangfire', 'Azure'],
    metrics: ['1.2M+ users', '40 BDT/order', '72% flow improvement'],
    context:
      'Chaldal is a YC-backed e-commerce platform in Bangladesh serving more than 1.2 million users. The company was already large enough that a small inefficiency in a checkout path became a real number every day. My work sat in the unglamorous middle: order fraud checks, address changes, background processing, and the behavioral signals behind catalog recommendations.\n\nThe platform team owned shared infrastructure and customer-facing backend work. Most of my projects started as a metric that looked wrong, not as a new feature request. That is a useful operating principle at this scale: a single slow query or a confusing form step is not an abstract quality issue. It is a cost, a support ticket, or a customer who leaves.',
    problem:
      'The fraud check was running functions against indexed columns, which made the query slower than it needed to be and tied up requests that did not need to be synchronous. The address-change flow had grown into a sequence of partial updates with inconsistent validation across web and mobile clients. And behavioral logging for recommendations was coupled to rendering logic, so adding a new event meant touching more than one surface.\n\nThe naive fix was to add more workers. That would have hidden the query problem, increased cost, and preserved the inconsistency. The better fix was to make each path cheaper before making it busier.',
    constraints: [
      'A live platform with more than a million users and no maintenance window.',
      'A shared .NET codebase and multiple clients consuming the same order APIs.',
      'Fraud decisions that could not simply be moved out of the critical path.',
      'Existing analytics and recommendation consumers that still needed the old event stream.',
      'Small, reviewable changes rather than a platform rewrite.',
    ],
    decisions: [
      {
        title: 'Rewrite the fraud query so the index survives',
        body:
          'The original query wrapped indexed columns in functions, which prevented the database from using those indexes. I rewrote the predicate to be sargable: compare the column directly, move the transformation to the parameter or to a precomputed value, and verify the plan before and after. The result was a cheaper query and a 40 BDT reduction in fraud loss per order.\n\nThe important part was the verification. I compared the actual execution plan, not just the elapsed time on one machine. A query can look faster because the cache is warm or the test data is small. The plan tells you whether the index is doing the work. The lesson is boring and correct: read the plan before adding infrastructure.',
      },
      {
        title: 'Move non-critical work to background jobs',
        body:
          'Not every part of the fraud response needs to block a customer. I split the path into a synchronous decision and asynchronous follow-up work using Hangfire. The customer gets a fast answer; the audit trail, secondary checks, and downstream notifications happen after the request.\n\nThe tradeoff is eventual consistency. We had to make the background jobs idempotent and visible to support. A hidden retry is worse than a visible failure.',
      },
      {
        title: 'Rebuild the address-change flow as a product flow',
        body:
          'The address flow was used by more than a million people and had accumulated accidental complexity. I rebuilt it in React with MobX and TypeScript, tightened validation across clients, and made the state transitions explicit. The API contract stayed compatible while the front end became easier to reason about.\n\nThis was not only a UI change. Better validation reduced bad writes, and the shared state model removed duplicate logic between web and mobile. The difficult part was keeping the transition reversible. Users were still on old clients, so the backend had to accept both shapes while the new flow shipped. We added server-side normalization and kept the old response path alive until the clients caught up.\n\nThe result was fewer failed address changes and a flow the support team could reason about without opening three repositories.',
      },
      {
        title: 'Decouple behavioral logging with an Observer pattern',
        body:
          'Recommendations need behavioral signals, but catalog rendering should not know how those signals are stored. I introduced an Observer-pattern logging layer so product events could be published without coupling the UI to analytics consumers. That made it safer to add events and easier to change how recommendations consumed them.\n\nThe tradeoff was another abstraction. It earned its place because the alternative was a growing set of side effects inside request handlers.',
      },
      {
        title: 'Measure the savings engine by completed flows',
        body:
          'The savings-engine work was not a single endpoint. It was a sequence of changes across pricing, eligibility, and post-order behavior. We measured completion and savings outcomes instead of counting deployed commits. The flow improved by 72 percent.\n\nThat number is a business outcome, not a personal benchmark. The useful part was learning which step in the flow people abandoned and fixing that step rather than adding another banner. We traced the funnel, compared cohorts, and looked at where the client and server disagreed about eligibility. Those disagreements were invisible in aggregate conversion and obvious once we split the flow into steps.\n\nThe same discipline applied to the fraud work: find the specific point where the system loses value, then remove the cause. It is slower than shipping a new feature and much more durable.',
      },
    ],
    architecture: {
      caption:
        'The order path, simplified. Fraud checks run synchronously; secondary work and behavioral events leave the request path.',
      columns: [
        { label: 'Client', items: ['Web', 'React Native'] },
        { label: 'API', items: ['ASP.NET Core', 'Validation', 'Order service'] },
        { label: 'Decision', items: ['Sargable fraud query', 'Rules engine'] },
        { label: 'Async', items: ['Hangfire jobs', 'Event logging', 'Recommendations'] },
        { label: 'Data', items: ['SQL Server', 'Redis', 'Azure services'] },
      ],
    },
    results: [
      {
        title: '40 BDT per order',
        body:
          'The fraud query and processing changes reduced fraud loss by 40 BDT per order, with a cleaner request path and fewer unnecessary synchronous checks.',
      },
      {
        title: '1M+ users',
        body:
          'The rebuilt address-change flow served more than a million users across web and mobile clients, with clearer validation and fewer partial writes.',
      },
      {
        title: '72% flow improvement',
        body:
          'The savings-engine work improved the measured flow by 72 percent. The metric that mattered was completed flows, not the number of features shipped.',
      },
    ],
    resultNote:
      'Chaldal is YC-backed. The platform served more than 1.2 million users. The fraud reduction, address flow, and savings-engine results are from the resume and are stated as team outcomes; my contribution was within the platform team.',
    lessons: [
      'Look at the query plan before adding workers. Infrastructure is a more expensive way to avoid reading an index.',
      'Make background work observable. A retry with no trace is an incident waiting to be discovered by a customer.',
      'When a flow is used by a million people, the most useful work is usually removing a step, not adding one.',
    ],
    links: [
      { label: 'Internal system. Code not public.', note: 'Customer and order data withheld.' },
      {
        label: 'Related note: From rows to vectors',
        href: '/writing/from-rows-to-vectors',
      },
    ],
    relatedPosts: ['from-rows-to-vectors', 'rabbitmq-bug-go-channel'],
    featured: true,
  },
  {
    slug: 'legal-rag',
    name: 'Intelligent Legal Multi-Agent RAG',
    title: 'A legal RAG system that cites the clause, not the cosine score',
    category: 'RAG · Multi-agent systems',
    year: '2026 — PRESENT',
    status: 'Ongoing',
    dek: 'Four agents, hybrid vector and graph retrieval, and a query decomposer that turns a legal question into verifiable sub-tasks. Built so every answer can be traced back to a source clause.',
    metaDescription:
      'A legal RAG system with four agents, hybrid vector and graph retrieval, query decomposition, and citations that trace to source clauses.',
    role: 'Architect + builder',
    team: 'Solo',
    timeline: '2026 — present',
    stack: ['FastAPI', 'Gemini', 'Qdrant', 'Neo4j', 'Redis', 'Docker', 'RQ', 'Pydantic'],
    metrics: ['4 specialized agents', 'Qdrant + Neo4j', 'Traceable citations'],
    context:
      'Legal research is a retrieval problem with a low tolerance for plausible nonsense. A generic RAG system can return a passage that sounds relevant while missing the clause that actually decides the question. The project explores a more explicit retrieval architecture: decompose the question, retrieve from multiple representations, and assemble an answer that points to its sources.\n\nThe work is also an exercise in restraint. Legal text rewards precision and punishes confident paraphrase. I was less interested in building an agent that could write a legal memo than in building a system that could show its work, mark what it could not support, and let a person make the final judgment.',
    problem:
      'One embedding similarity search is a poor model of a legal question. A contract question may depend on an entity relationship, a date, and a definition that sits in another document. Cosine similarity does not understand any of those distinctions.\n\nThe naive fix is to retrieve more chunks and let the model sort it out. That increases prompt size, hides the retrieval failure inside a confident answer, and makes evaluation nearly impossible. I wanted the system to fail visibly when it could not support a claim.\n\nThere is also an evaluation trap. A legal answer can cite the right document and still misread the clause, or quote the right clause while ignoring an exception. Retrieval metrics alone will not catch that. The system needs evidence at the sub-question level, and the reviewer needs to see which sub-question is weak.',
    constraints: [
      'Every answer must point to a source clause.',
      'Questions can be multi-part and depend on relationships across documents.',
      'The retrieval layer must be replaceable without rewriting the application.',
      'This is an ongoing project, so the design has to be honest about what is measured.',
      'No client data or invented legal benchmarks.',
    ],
    decisions: [
      {
        title: 'Split retrieval into four specialized agents',
        body:
          'The system uses four agents: semantic retrieval, entity retrieval, temporal retrieval, and fusion. Each has a narrow job and returns evidence rather than prose. Fusion decides what is strong enough to pass to the answer step.\n\nThe tradeoff is orchestration overhead. Four agents can be slower than one query. But the separation makes failures legible: an entity question that returns nothing looks different from a semantic miss, and the evaluator can route them differently.',
      },
      {
        title: 'Decompose before you retrieve',
        body:
          'A query decomposer and rewriter break multi-part legal questions into verifiable sub-tasks. Instead of embedding a paragraph and hoping one chunk covers it, the system asks for the definition, the obligation, the date, and the exception separately. The fusion layer then checks whether every sub-task has evidence.\n\nThis is the most useful idea in the project. It turns \'answer the question\' into \'prove these smaller claims\'. It also produces a better failure mode: a missing sub-answer is visible in the output, not buried in a paragraph.\n\nDecomposition is not free. The rewriter can narrow a question incorrectly, and the fusion layer can overrule a valid retrieval with a weak rule. I kept the sub-questions visible in the trace so those errors could be inspected instead of hidden inside a final answer. The architecture is designed to make a bad retrieval look bad.',
      },
      {
        title: 'Use the right store for the right relationship',
        body:
          'Qdrant handles vector search. Neo4j handles entity relationships. Redis caches vectors and expensive lookups. The point is not to collect databases; it is to stop forcing every relationship through an embedding.\n\nThat distinction matters for legal text. A clause can be semantically similar to a question while being legally unrelated. An entity edge can connect the clause to the party or obligation that makes it relevant. Hybrid retrieval is not a marketing term here; it is a correction to a known failure mode.',
      },
      {
        title: 'Assemble citations before prose',
        body:
          'The answer step receives evidence with identifiers first, then writes the response with mandatory citation slots. If a slot cannot be filled, the system says so. This is slower than free-form generation and less pleasant to demo, but it matches the job: a legal answer without a source is not an answer.\n\nThe evaluation question is still open. I can verify that citations point to retrieved evidence, but I cannot claim a legal correctness benchmark without a labeled set. I have not invented one. What I can test is narrower: does every claim have a citation, does every citation resolve to a retrieved passage, and does the answer acknowledge unsupported sub-questions? Those are useful checks even without a lawyer-graded benchmark.',
      },
      {
        title: 'Keep retrieval behind clean boundaries',
        body:
          'FastAPI, Pydantic models, a service layer, and explicit interfaces keep retrieval replaceable. The application does not know whether evidence came from Qdrant or Neo4j. That makes it possible to test the answer layer with fixtures and to swap a retriever without rewriting the domain logic.\n\nThis is ordinary backend discipline applied to an AI system. The model is not the architecture.',
      },
    ],
    architecture: {
      caption:
        'Query flow. Sub-questions fan out to specialized retrievers, then fuse into a citation-checked answer.',
      columns: [
        { label: 'Input', items: ['Legal question', 'Document set'] },
        { label: 'Plan', items: ['Decomposer', 'Rewriter', 'Sub-tasks'] },
        {
          label: 'Retrieve',
          items: ['Semantic agent', 'Entity agent', 'Temporal agent'],
        },
        { label: 'Fuse', items: ['Evidence merge', 'Conflict checks', 'Citation slots'] },
        { label: 'Answer', items: ['Grounded prose', 'Source clauses', 'Unsupported flags'] },
      ],
    },
    results: [
      {
        title: 'Traceable citations',
        body:
          'Every generated answer carries source evidence identifiers. If a required sub-task has no supporting clause, the system exposes that gap instead of filling it with plausible text.',
      },
      {
        title: 'Decomposition instead of one-shot search',
        body:
          'The query decomposer improves retrieval precision by turning one broad question into several specific evidence requests. This is a design goal observed during development, not a published benchmark.',
      },
      {
        title: 'Swappable retrieval',
        body:
          'Clean Architecture boundaries keep vector and graph retrieval behind interfaces. The application can be tested with fixtures and changed without rewriting the answer layer.',
      },
    ],
    resultNote:
      'Ongoing project. There is no formal public benchmark yet. Design goals are labeled as design goals; no adoption or accuracy numbers are claimed.',
    lessons: [
      'Decomposition is a better lever than a larger prompt. More context cannot fix a missing sub-question.',
      'A citation architecture is an evaluation strategy as much as a product choice. It makes unsupported claims visible.',
      'Do not call something a result until there is a labeled set. The honest status of this project is ongoing.',
    ],
    links: [
      { label: 'Related note: RAG is not a new engineering discipline', href: '/writing/rag-is-not-a-new-engineering-discipline' },
      {
        label: 'Related note: From rows to vectors',
        href: '/writing/from-rows-to-vectors',
      },
    ],
    relatedPosts: ['rag-is-not-a-new-engineering-discipline', 'from-rows-to-vectors'],
    featured: true,
  },
  {
    slug: 'voice-calendar',
    name: 'AI Voice Calendar Scheduler',
    title: 'A voice agent that never sends your audio to the cloud',
    category: 'Agentic AI · Voice',
    year: '2025 — 2026',
    status: 'Prototype',
    dek: 'A self-hosted voice agent that books meetings end to end: WebRTC conversations, calendar conflict checks, confirmation emails, and an MCP server that exposes the tools to other AI clients.',
    metaDescription:
      'A self-hosted voice agent with WebRTC interruptions, calendar conflict checks, MCP tools, and no cloud audio dependency.',
    role: 'Builder',
    team: 'Solo',
    timeline: '2025 — 2026',
    stack: ['Python', 'LiveKit', 'Gemini', 'Faster-Whisper', 'Piper', 'Google Calendar API', 'MCP', 'Docker'],
    metrics: ['Self-hosted STT/TTS', 'MCP tools', 'WebRTC interruptions'],
    context:
      'Most voice-agent demos send microphone audio to a cloud speech API, wait for a transcript, and speak the response. That is acceptable for a demo and questionable for a calendar conversation that may include names, availability, and internal context. This prototype asks a narrower question: can a private voice agent still feel immediate?\n\nI built it to understand the shape of a real-time agent loop, not to ship a receptionist. The useful output is a set of boundaries: what runs locally, what needs a model, which tool calls require confirmation, and where the latency budget goes.',
    problem:
      'The hard parts are not the model calls. They are interruption handling, turn boundaries, tool latency, and the unglamorous work of checking a calendar before creating an event. A voice agent that talks over the user or double-books a meeting is worse than a form.\n\nThe naive architecture runs every step sequentially: record, transcribe, reason, respond, speak. That adds latency at every turn and makes interruptions feel broken. It also hides state. If the user starts speaking while the agent is mid-sentence, a sequential pipeline has no clean place to cancel the current response or preserve the partial turn.\n\nVoice makes state management visible. A text chat can hide a slow tool behind a typing indicator. A phone call cannot.',
    constraints: [
      'Audio should stay on the machine running the agent.',
      'The conversation must support interruptions, not just push-to-talk.',
      'Calendar writes require conflict checks and confirmation.',
      'The tools should be reusable by other MCP-compatible clients.',
      'A prototype budget, not a production SLO.',
    ],
    decisions: [
      {
        title: 'Self-host STT and TTS',
        body:
          'I used Faster-Whisper for speech recognition and Piper for synthesis, both running locally. That removes the cloud audio dependency and gives direct control over latency and voices. The tradeoff is hardware: the machine has to carry the models, and quality is not identical to the best hosted option.\n\nFor this prototype, privacy was the point. A voice scheduler that leaks the entire conversation to three vendors is not a privacy-preserving agent.\n\nThe local stack also makes the cost model legible. There is no per-minute speech bill hiding in the dashboard. The tradeoff moves to CPU, memory, startup time, and model quality. Those are easier to reason about when the machine is yours.',
      },
      {
        title: 'Handle interruptions over WebRTC',
        body:
          'LiveKit handles the real-time transport. The agent listens for speech while it is speaking and cancels the current response when the user interrupts. Getting this right required explicit turn state, not just a stream of tokens.\n\nThe useful lesson is that voice UX is state management. The model is one participant in a loop that also includes audio capture, playback, and cancellation. Every state transition has a latency budget. If transcription finishes after the user has already repeated themselves, the system has failed even if the transcript is correct.\n\nI also had to separate acoustic events from semantic ones. Speech detection says a human is talking. It does not say whether that is a new request, a correction, or a backchannel. Treating every sound as an interruption makes the agent jumpy.',
      },
      {
        title: 'Check the calendar before creating the event',
        body:
          'The scheduler fetches availability, checks conflicts, proposes a slot, and only then creates the event. Confirmation emails are a separate tool. This is ordinary defensive backend work applied to an agent.\n\nTool boundaries matter. Giving the model a single \'schedule meeting\' function that writes directly to the calendar makes a confident mistake expensive. Smaller tools with explicit preconditions are easier to validate and easier to retry. The model can propose a slot; the backend still checks it.\n\nThat separation is also a security boundary. The agent should not be able to write outside the calendar scope it was granted, even if the prompt is compromised. The tool should enforce the rule, not the prompt.',
      },
      {
        title: 'Expose the scheduler through MCP',
        body:
          'The project includes an MCP server and client so other AI clients can call the calendar tools. That turns the voice agent from a closed demo into one surface over a reusable tool layer.\n\nThe tradeoff is another protocol to maintain. The benefit is interoperability: the scheduler is not trapped inside a single prompt or vendor SDK.',
      },
      {
        title: 'Containerize the messy parts',
        body:
          'Docker Compose ties together the voice services, API, and supporting components. Clean Architecture boundaries keep speech, calendar, and MCP concerns separate. This is not glamorous, but it is what makes the prototype runnable on another machine.',
      },
    ],
    architecture: {
      caption:
        'The voice loop stays local; calendar and email tools are explicit calls with validation.',
      columns: [
        { label: 'Audio', items: ['WebRTC', 'LiveKit', 'Interruption state'] },
        { label: 'Speech', items: ['Faster-Whisper', 'Piper', 'Turn manager'] },
        { label: 'Reason', items: ['Gemini', 'Tool selection', 'Confirmation'] },
        { label: 'Tools', items: ['Calendar check', 'Event create', 'Email send'] },
        { label: 'Surface', items: ['MCP server', 'MCP client', 'Docker'] },
      ],
    },
    results: [
      {
        title: 'End-to-end prototype',
        body:
          'The agent can hold a spoken conversation, check availability, create a meeting after confirmation, and send a confirmation email.',
      },
      {
        title: 'No cloud audio dependency',
        body:
          'Speech recognition and synthesis run locally. The only external calls are the reasoning model and calendar/email APIs.',
      },
      {
        title: 'Tool interoperability',
        body:
          'The MCP server exposes the scheduling tools to other MCP clients, not just the voice interface.',
      },
    ],
    resultNote:
      'Prototype. No adoption or reliability metrics are claimed. The useful output is the architecture and the interruption-handling pattern.',
    lessons: [
      'Voice agents are real-time systems first and language models second. Latency and cancellation are product requirements.',
      'Small tools with explicit preconditions beat one large action. The model should not be the only validation layer.',
      'Privacy claims need an architecture diagram, not a badge.',
    ],
    links: [
      { label: 'Repository', note: 'Public code pending cleanup.' },
      {
        label: 'Related note: Build the knowledge graph, not the tech stack',
        href: '/writing/build-the-knowledge-graph',
      },
    ],
    relatedPosts: ['build-the-knowledge-graph', 'rag-is-not-a-new-engineering-discipline'],
    featured: false,
  },
  {
    slug: 'whatsapp-bi',
    name: 'WhatsApp Multi-Agent BI',
    title: 'Four agents, one WhatsApp thread',
    category: 'Agentic AI · Business Intelligence',
    year: '2026',
    status: 'Prototype',
    dek: 'A modular multi-agent system that delegates strategic questions through WhatsApp, cross-references 10+ endpoints, and writes executive reports from thousands of data points.',
    metaDescription:
      'A four-agent WhatsApp BI system that investigates 10+ endpoints, flags evidence gaps, and writes phone-sized executive reports.',
    role: 'Architect + builder',
    team: 'Solo',
    timeline: '2026',
    stack: ['FastAPI', 'Google GenAI', 'WhatsApp Business API', 'PostgreSQL', 'Docker', 'Pydantic'],
    metrics: ['4 specialized agents', '10+ endpoints', 'Automated reports'],
    context:
      'Business owners do not want another dashboard tab. They want an answer in the place they already read messages. This prototype routes a WhatsApp question through a small multi-agent system that can inspect live business data, cross-reference endpoints, and produce a report with the evidence behind it.\n\nThe design constraint is the channel. A desktop BI tool can show a chart, a filter, and a caveat. A WhatsApp message has to be short enough to read on a phone and specific enough to act on. That changes the output contract before it changes the model.',
    problem:
      'A single agent with a long tool list tends to pick the wrong source or stop at the first plausible number. A business question such as \'why did revenue drop in the last two weeks?\' needs several passes: find the metric, compare periods, check the pipeline, inspect exceptions, then write a narrative.\n\nThe naive design stuffs all endpoints into one prompt. It is hard to debug, harder to secure, and impossible to evaluate. It also makes the output sound equally confident whether or not the data exists. The goal here was not to make the agent more autonomous. It was to make the investigation inspectable.',
    constraints: [
      'Questions arrive as WhatsApp messages, so responses must be short enough to read on a phone.',
      'The agent must distinguish correlation from a plausible story.',
      'Access to live business data requires explicit tool boundaries.',
      'No invented adoption metrics; this is a prototype.',
      'The system must degrade to a useful answer when a tool fails.',
    ],
    decisions: [
      {
        title: 'Use four agents with explicit delegation',
        body:
          'The system has four specialized agents: a router, an investigator, an analyst, and a reporter. The router classifies the question. The investigator decides which data endpoints to query. The analyst checks the result for inconsistencies. The reporter writes the final response.\n\nThe tradeoff is more latency and more coordination code. The benefit is that each step can be inspected. When the answer is wrong, I can see whether the question was routed badly, the wrong data was fetched, or the narrative ignored the evidence.\n\nThe router is deliberately simple. Most business questions map to a small number of intents, and a fast, legible classifier is better than a general planner that improvises. The interesting work starts after routing, when the investigator has to decide what evidence would change the answer.',
      },
      {
        title: 'Build an investigative discovery loop',
        body:
          'The investigator can call more than ten API endpoints, but it follows a loop: form a hypothesis, fetch evidence, check whether the evidence changes the hypothesis, then continue or stop. It does not dump every endpoint into a prompt.\n\nThis mimics how a person checks a dashboard. The important constraint is a stop condition. Without one, an agent will keep looking for a story that is not there.\n\nI also capped the number of probes and wrote down why each one was made. That makes the trace useful. A failed investigation should tell me which hypothesis was tested and what evidence was missing, not just produce a shorter answer.',
      },
      {
        title: 'Require a no-excuses reporting protocol',
        body:
          'The reporting agent must include the evidence it used and state what it could not verify. If an endpoint is down or a metric is missing, the report says so instead of smoothing it over.\n\nThis is a small feature with a large effect on trust. Executive summaries are dangerous when they sound equally confident whether or not the data exists. The report format also forces the writer to separate observation from interpretation. \'Orders fell 12 percent\' and \'the promotion underperformed\' are different claims, even when they appear in the same paragraph.\n\nThe phone-sized constraint helps here. There is not enough room to hide a weak evidence chain behind a long narrative.',
      },
      {
        title: 'Ground the narrative in live data, not memory',
        body:
          'Context-aware retrieval pulls the relevant business context for the question: dimensions, definitions, recent events, and prior reports. The model writes from retrieved evidence, not from a static prompt that slowly goes stale.\n\nThe design question is not \'how do we add RAG?\' It is \'what does the agent need to know to answer this specific question, and where does that knowledge live?\'',
      },
    ],
    architecture: {
      caption:
        'A WhatsApp message becomes a routed investigation, then a cited executive report.',
      columns: [
        { label: 'Channel', items: ['WhatsApp Business API', 'Message queue'] },
        { label: 'Orchestrate', items: ['Router agent', 'Delegation', 'State'] },
        { label: 'Investigate', items: ['10+ endpoints', 'Hypothesis loop', 'Evidence store'] },
        { label: 'Validate', items: ['Analyst agent', 'Gap flags', 'Definitions'] },
        { label: 'Report', items: ['Reporter agent', 'Executive summary', 'Sources'] },
      ],
    },
    results: [
      {
        title: 'Working prototype',
        body:
          'The system can receive a business question over WhatsApp, investigate multiple endpoints, and return a concise report with its evidence.',
      },
      {
        title: 'Explicit delegation',
        body:
          'Each agent has a narrow responsibility. Routing, investigation, analysis, and reporting can be tested independently.',
      },
      {
        title: 'Visible gaps',
        body:
          'The reporting protocol surfaces missing data rather than hiding it. A failed endpoint produces a qualified answer, not a fabricated one.',
      },
    ],
    resultNote:
      'Prototype. No adoption, accuracy, or cost metrics are claimed. The value is in the agent boundaries and the evidence-first reporting protocol.',
    lessons: [
      'A stop condition is a feature. Investigation loops need a reason to end.',
      'Put the uncertainty in the report, not in a hidden log. Decision-makers need to see what is missing.',
      'More endpoints is not more intelligence. The hard part is choosing which evidence matters.',
    ],
    links: [
      { label: 'Repository', note: 'Public code pending cleanup.' },
      {
        label: 'Related note: RAG is not a new engineering discipline',
        href: '/writing/rag-is-not-a-new-engineering-discipline',
      },
    ],
    relatedPosts: ['rag-is-not-a-new-engineering-discipline', 'build-the-knowledge-graph'],
    featured: false,
  },
]

export const additionalWork = [
  {
    title: 'InspectorPC / Wigersma & Sikkema',
    description:
      'Legacy desktop modernization with Railway Oriented Programming, an 85% code-size reduction, and secure license validation.',
    stack: 'C#, .NET, WPF, Spring.NET',
  },
  {
    title: 'RepoManager',
    description:
      'Codebase knowledge trees and an onboarding assistant for six microservices, built with a teammate.',
    stack: 'TypeScript, Python, LLMs',
  },
  {
    title: 'Job Crawler with LLM Integration',
    description:
      'Crawls career sites, matches roles, and drafts cover letters.',
    stack: 'FastAPI, LangChain, Gemini, Selenium',
  },
  {
    title: 'ASR-Based Ticket Generation',
    description:
      'Transcribes voice messages and creates validated HR tickets.',
    stack: 'Whisper Tiny, Gemini',
  },
  {
    title: 'GST Online Admission System',
    description:
      'Handled roughly 2 lakh applications with merit generation for about 29,000 students and PDF generation.',
    stack: 'PHP 7, MySQL, Bootstrap',
  },
]

export function getCaseStudy(slug: string) {
  return caseStudies.find((project) => project.slug === slug)
}

export function getNextCaseStudy(slug: string) {
  const index = caseStudies.findIndex((project) => project.slug === slug)
  return caseStudies[(index + 1) % caseStudies.length]
}



