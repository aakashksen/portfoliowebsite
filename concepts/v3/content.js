// v3 content. Projects take `live` and `source` URLs: set them and the cards grow Live site / Source buttons.
// Every fact comes from Aakash's resumes (Oct 2026, plus older versions for the CubeSat win,
// the research lab and the Data Science UCSB budget). Rewritten to explain, not just list.
// lens: which major each piece of work draws on. cs = Computer Science, st = Statistics & Data Science.
(function () {
  const PERSON = {
    name: 'Aakash Senthilnathan',
    photo: 'portrait.jpg',
    email: 'aakash.senthilnathan@gmail.com',
    school: 'UC Santa Barbara',
    grad: 'June 2028',
    gpa: '3.69',
    majors: { cs: 'B.S. Computer Science', st: 'B.S. Statistics & Data Science' },
    thesis: 'I build the systems that put machine learning in front of real users, and I measure whether it works.',
    seeking: 'Open to ML & SWE internships',
    season: 'Summer 2027',
    links: [
      { label: 'LinkedIn', url: 'https://linkedin.com/in/aakashsenthilnathan' },
      { label: 'GitHub', url: 'https://github.com/aakashksen' },
    ],
  }

  const SECTIONS = [
    { id: 'experience', title: 'Experience', path: '/experience' },
    { id: 'projects', title: 'Projects', path: '/projects' },
    { id: 'resume', title: 'Resume', path: '/resume' },
    { id: 'live', title: 'Live projects', path: '/live' },
    { id: 'about', title: 'About', path: '/about' },
  ]

  const ITEMS = {
    experience: [
      { title: 'UCSB ITS', short: 'AI infrastructure', role: 'AI & Data Science Infrastructure Engineer Intern', alias: 'Information Technology Services', dates: 'May 2026 – now', yr: 'now', now: true,
        summary: 'I built and run the campus platform that gives UCSB’s 26,000+ students API access to language models hosted on UCSB’s own GPUs, plus the pipeline that decides which models go on it.',
        numbers: [['26,000+', 'students with access to the platform'], ['Blackwell', 'NVIDIA GPUs serving the models through vLLM'], ['p95', 'tail latency, plus throughput, concurrency and GPU use, benchmarked per model']],
        built: [
          ['Hephaestus, the platform', 'A multi-tenant FastAPI + LiteLLM service with an OpenAI-compatible API, in front of vLLM inference on NVIDIA Blackwell GPUs. It handles per-student API keys, which models each user can reach, usage quotas and usage monitoring, and runs in a Harvester-managed Ubuntu environment.'],
          ['Model evaluation pipeline', 'Benchmarks candidate models on coding and research tasks, then load-tests them under vLLM for p95 latency, token throughput, concurrency and GPU utilization. Stronger models that fit the Blackwell capacity replace weaker ones in the student lineup.'],
          ['JupyterHub migration', 'Helped move JupyterHub/BinderHub from Google Kubernetes Engine to a bare-metal RKE2 Kubernetes cluster: Helm deployments, and Jenkins CI/CD building ARM64 and AMD64 containers in parallel.'],
        ],
        lens: { cs: 'Multi-tenant API design, Kubernetes, CI/CD', st: 'Model evaluation, latency and throughput benchmarking' },
        tags: ['Python', 'FastAPI', 'LiteLLM', 'vLLM', 'LLMs', 'Model evaluation', 'Kubernetes', 'Helm', 'Jenkins', 'CI/CD'] },

      { title: 'Kaiser Permanente', short: 'Data & AI engineering', role: 'Data & AI Engineering Intern', dates: 'Jun – Sep 2026', yr: '2026',
        summary: 'Rebuilt the finance data layer for a medical center reporting $500M+ in annual net patient revenue, then built two LLM tools on it: a finance chatbot and an agent that migrates Tableau dashboards to Power BI.',
        numbers: [['2 wks → 3 hrs', 'per dashboard migration, using the agent'], ['600+', 'Epic Clarity and HR source tables reconciled'], ['~80%', 'fewer LLM tokens per migration']],
        built: [
          ['ETL pipeline', 'A scheduled Python pipeline (Polars, Pandas) that reconciles 600+ Epic Clarity (Oracle) and HR tables through canonical cost-center mappings. Validated DuckDB models replaced duplicated DAX and Power Query logic across 8+ years and 90+ departments.'],
          ['Finance chatbot', 'The LLM’s output is JSON, checked against Pydantic schemas. A FastAPI semantic query engine then applies predefined metrics, joins and column rules before compiling the request to SQL.'],
          ['Dashboard migration agent', 'MCP servers and a custom Python library parse Tableau workbooks and generate complete Power BI projects: PBIR report definitions, TMDL semantic models, DAX measures and Deneb/Vega-Lite visuals.'],
        ],
        lens: { cs: 'ETL pipelines, API design, agent tooling (MCP)', st: 'Data reconciliation and validation, metric definitions' },
        tags: ['Python', 'Polars', 'Pandas', 'DuckDB', 'SQL', 'FastAPI', 'Pydantic', 'MCP', 'LLMs', 'Agentic AI'] },

      { title: 'HopeKCC', short: 'Backend SWE', role: 'Software Engineer Intern, Backend', dates: 'Jun – Sep 2025', yr: '2025',
        summary: 'Rebuilt the platform’s backend and the way it ships: a faster API on a production database, automated releases, and a queue for heavy file-conversion jobs.',
        numbers: [['720 → 96 ms', 'mean API latency (−86%)'], ['250+ hrs', 'engineering time saved per year by CI/CD'], ['1,500+', 'concurrent conversion requests handled']],
        built: [
          ['API rebuild', 'Overhauled the RESTful endpoints with FastAPI on GCP and moved the data layer to a production-grade PostgreSQL instance, cutting mean latency from 720 ms to 96 ms.'],
          ['CI/CD from scratch', 'Owned a GitHub Actions pipeline for unit tests and zero-downtime deploys, cutting manual release work by 75%.'],
          ['Conversion service', 'A backend service that turns ChordPro files into PDF/PNG, with a PostgreSQL job queue, asynchronous batch processing and error logging.'],
        ],
        lens: { cs: 'REST APIs, databases, CI/CD, async job queues' },
        tags: ['Python', 'FastAPI', 'PostgreSQL', 'GCP', 'GitHub Actions', 'CI/CD'] },

      { title: 'Data Science UCSB', short: 'Vice President', role: 'Vice President (previously External VP)', dates: 'Oct 2024 – now', yr: 'now', now: true,
        summary: 'Run day-to-day operations for UCSB’s data science club: 500+ members, weekly technical seminars, career fairs, a student project showcase and the flagship Datathon.',
        numbers: [['600+', 'Datathon participants'], ['500+', 'members'], ['+45%', 'year-over-year operating budget, on $20K+']],
        built: [
          ['The Datathon', 'Took the 600+ participant Datathon from concept to execution: secured funding from PyTorch and Groq, managed relationships with Google, Oracle and Anthropic, and oversaw 50+ final project submissions.'],
          ['Operations', 'Lead the officer team behind weekly technical seminars, career fairs and the project showcase, and build relationships with industry teams including Google Quantum and Amazon.'],
          ['Budget', 'As External VP, set financial strategy for a $20,000+ budget and grew the operating budget 45% year over year.'],
        ],
        lens: { st: 'Built around the data science community, its seminars and its Datathon' },
        tags: ['Leadership', 'Partnerships', 'Events'] },

      { title: 'Spatial Pattern Analysis & Research Lab', label: 'Spatial Analysis Lab', short: 'Research', role: 'Undergraduate Research Assistant, UCSB', dates: 'From May 2025', yr: '2025',
        summary: 'Showed, with a meta-analysis of 150+ papers, that geospatial models built for their local context beat general-purpose ones by 5–6% IoU. That result became the starting principle for the lab’s new model.',
        numbers: [['+5–6%', 'IoU for context-aware over generalized models'], ['150+', 'peer-reviewed papers analysed'], ['100+ hrs', 'of manual research work removed']],
        built: [
          ['Meta-analysis', 'Compared reported results across 150+ papers and several regions, including India, China and Africa. IoU (intersection over union) scores how well a predicted area overlaps the true one.'],
          ['Research database', 'A PostgreSQL database that automates ingesting, standardizing and analysing findings from those papers.'],
        ],
        lens: { st: 'Meta-analysis, comparing effect sizes across studies', cs: 'Relational database design' },
        tags: ['Meta-analysis', 'Statistical analysis', 'PostgreSQL', 'SQL'] },
    ],

    projects: [
      { title: 'Hephaestus', short: 'Campus LLM platform', role: 'Multi-tenant LLM platform, built at UCSB ITS', dates: '2026 · in production', yr: 'live', now: true,
        summary: 'A single, metered gateway to the language models UCSB hosts on its own GPUs, open to all 26,000+ students.',
        numbers: [['26,000+', 'students with API access'], ['Blackwell', 'NVIDIA GPUs serving the models through vLLM']],
        built: [
          ['Gateway', 'FastAPI + LiteLLM in front of vLLM on NVIDIA Blackwell GPUs, deployed in a Harvester-managed Ubuntu environment.'],
          ['Tenancy', 'Per-student API keys, per-model access policies, usage quotas and usage monitoring.'],
          ['Model lineup', 'Chosen by an evaluation pipeline that scores models on coding and research tasks and on serving performance before students see them.'],
        ],
        lens: { cs: 'Distributed serving, API gateway design', st: 'Benchmark design for choosing models' },
        live: null, source: null,
        tags: ['Python', 'FastAPI', 'LiteLLM', 'vLLM', 'LLMs', 'Model evaluation', 'Kubernetes'] },

      { title: 'SPROUT', short: 'Plant-disease CNN + RAG', role: 'Plant-disease detection and care assistant', dates: 'Oct 2024 – May 2025', yr: '2025',
        summary: 'Identifies plant diseases from leaf images, then answers care questions with a chatbot grounded in plant-care documents.',
        numbers: [['98.5%', 'validation accuracy, 38 disease classes'], ['110,000+', 'training images'], ['+80%', 'care-plan accuracy over a base LLM']],
        built: [
          ['Classifier', 'Fine-tuned an ImageNet-pretrained ConvNeXt CNN in PyTorch on 110,000+ images across 38 disease categories.'],
          ['RAG chatbot', 'Retrieves relevant plant-care context from a ChromaDB vector database and adds it to DeepSeek prompts, which made care plans 80% more accurate than the base model’s answers.'],
          ['Deployment', 'Containerized the full stack with Docker and deployed the ML pipeline to Google Cloud, ending environment-related errors and saving the team 10+ hours of manual deployment a week.'],
        ],
        lens: { st: 'Model training and validation, measuring answer accuracy', cs: 'Full-stack app, containers, cloud deployment' },
        live: 'https://sprout.aakashsenthilnathan.com', source: null,
        // How the live tile looks: SPROUT's own photo, palette and pitch (from sprout.aakashsenthilnathan.com)
        preview: { img: 'sprout-preview.jpg', alt: 'Tomato leaves with brown ringed spots and yellowing edges', cta: 'Visit SPROUT',
          pitch: 'Photograph a sick leaf. SPROUT names the likely disease and asks a few questions to confirm.',
          bg: '#f6efdc', fg: '#14361f', accent: '#2f7d22', accentFg: '#f7f3e6' },
        tags: ['Python', 'PyTorch', 'CNN', 'RAG', 'LLMs', 'ChromaDB', 'Model evaluation', 'Docker', 'GCP'] },

      { title: 'ContextLens', short: 'Meeting copilot, desktop + glasses', role: 'Real-time meeting copilot for desktop and smart glasses', dates: 'Jan – Nov 2026', yr: '2026',
        summary: 'Listens to a live meeting on your own computer. Press once and a short card shows what was said, who said it and what changed, every line quoted from the conversation.',
        numbers: [['87%', 'contradictions caught, 20 to 60 turns apart'], ['65%', 'answers graded correct, up from 35%'], ['2.3 s', 'median time to a card on a local 4B model']],
        built: [
          ['Pipeline', 'Streaming whisper.cpp speech (C++, gRPC), speaker labels and a meeting memory, served over one WebSocket by FastAPI.'],
          ['Evidence first', 'Hybrid BM25 and vector search plus a bge cross-encoder pick the turns; a local 4B model through Ollama only words the answer, and code quotes the real turns.'],
          ['Contradiction check', 'A fine-tuned DeBERTa and a ModernBERT NLI model compare statements pair by pair to flag updates and contradictions.'],
          ['Clients', 'An Electron tray app with a global hotkey and an always-on-top card, and a Unity client that puts the card in a headset or glasses view.'],
        ],
        lens: { cs: 'Real-time systems, retrieval, desktop and XR clients', st: 'Model evaluation, NLI, graded A/B tests' },
        live: 'https://contextlens.aakashsenthilnathan.com', source: null,
        // How the live tile looks: ContextLens's own screenshot, palette and pitch (from contextlens.aakashsenthilnathan.com)
        preview: { img: 'contextlens-preview.jpg', alt: 'A ContextLens card floating over a video call: the beta moved from Friday to Monday, with who said it', cta: 'Visit ContextLens',
          pitch: 'Lost the thread? Press one key. A card shows what was said, who said it and what changed.',
          bg: '#101216', fg: '#eef0f4', accent: '#f2b441', accentFg: '#1d1608', icon: 'glasses' },
        tags: ['Python', 'FastAPI', 'whisper.cpp', 'C++', 'RAG', 'NLI', 'Ollama', 'Electron', 'Unity', 'Model evaluation'] },

      { title: 'CubeSat Challenge', short: 'National 1st place', role: 'AIAA × MIT Beaver Works (BWSI)', dates: 'Oct 2021 – May 2022', yr: '2022',
        summary: 'Won the national Build a CubeSat Challenge with a low-cost satellite that spots ocean plastic in imagery.',
        numbers: [['1st', 'national Build a CubeSat Challenge'], ['+65%', 'plastic detection rate over baseline'], ['−30%', 'cost compared with pre-built kits']],
        built: [
          ['Hardware', 'A custom acrylic and metal chassis with a Raspberry Pi and a calibration system, 30% cheaper than pre-built kits.'],
          ['Vision', 'Python, OpenCV and NumPy code that isolates ocean plastics in satellite imagery with HSV segmentation.'],
        ],
        lens: { cs: 'Embedded systems, computer vision' },
        live: null, source: null,
        tags: ['Python', 'OpenCV', 'NumPy', 'Raspberry Pi'] },
    ]
  }

  Object.assign(window.Kit, { PERSON, SECTIONS, SECTION: Object.fromEntries(SECTIONS.map(s => [s.id, s])), ITEMS })
})()
