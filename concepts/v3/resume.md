# Aakash Senthilnathan

aakash.senthilnathan@gmail.com · [LinkedIn](https://linkedin.com/in/aakashsenthilnathan) · [GitHub](https://github.com/aakashksen)

## Education

### University of California, Santa Barbara
*Expected Grad: June 2028*

Double Major in B.S. Computer Science & B.S. Statistics and Data Science | GPA: 3.69

**Relevant Coursework:** Data Structures & Algorithms, Linear Algebra, Artificial Intelligence, Computer Networks, Regression Analysis, Statistical Machine Learning, Optimization for Machine Learning


## Experience

### AI & Data Science Infrastructure Engineer Intern — UCSB Information Technology Services
*May 2026 - Present*

- Architected Hephaestus, a multi-tenant FastAPI/LiteLLM platform for UCSB's 26,000+ students, deployed in a Harvester-managed Linux (Ubuntu) environment and connecting an OpenAI-compatible API to Blackwell-hosted vLLM inference, with student API-key provisioning, model access policies, usage quotas, and usage monitoring.
- Built an LLM evaluation and deployment pipeline that compares new models on coding and research tasks, tests vLLM serving performance (p95 latency, token throughput, concurrency, GPU utilization), and updates UCSB's student-facing model lineup with stronger models that fit Blackwell GPU capacity.
- Contributed to the JupyterHub/BinderHub migration from GKE to a bare-metal RKE2 Kubernetes cluster, configuring Helm deployments and Jenkins CI/CD for parallel ARM64/AMD64 container builds and delivery.

### Data & AI Engineering Intern — Kaiser Permanente
*June 2026 - Sep 2026*

- Engineered a scheduled Python ETL pipeline with Polars and Pandas, reconciling 600+ Epic Clarity (Oracle) and HR source tables through canonical cost-center mappings and replacing duplicated DAX/Power Query transformations with validated DuckDB models spanning 8+ years and 90+ departments at a medical center reporting $500M+ in annual net patient revenue.
- Built an LLM-powered finance chatbot backed by a FastAPI semantic query engine, using Pydantic schemas to validate model-generated JSON and apply predefined metrics, joins, and column rules before compiling requests to SQL.
- Developed an agentic workflow with MCP servers and a custom Python library to parse Tableau workbooks and generate PBIP projects with PBIR report definitions, TMDL semantic models, DAX measures, and Deneb/Vega-Lite visuals, cutting dashboard migration from two weeks to 2-3 hours and LLM token use by approximately 80%.

### Software Engineer Intern — HopeKCC
*June 2025 - Sep 2025*

- Architected an end-to-end overhaul of the platform's RESTful endpoints using FastAPI on GCP, migrating the data persistence layer to a production-grade PostgreSQL instance and slashing mean API latency by 86% (from 720ms to 96ms).
- Took full ownership of a CI/CD pipeline built from scratch with GitHub Actions to automate unit testing and zero-downtime deployments, cutting manual release processes by 75% and saving 250+ engineering hours annually.
- Developed a backend service to automate the platform's ChordPro to PDF/PNG conversion workflow, implementing a job queueing system in PostgreSQL with asynchronous batch processing and error logging to manage 1,500+ concurrent requests.

### Vice President — Data Science UCSB
*Oct 2024 - Present*

- Directed day-to-day operations and programming for Data Science UCSB's 500+ members, leading the officer team behind weekly technical seminars, career fairs, a student project showcase program, and the flagship Datathon while building relationships with industry teams including Google Quantum, Amazon, PyTorch, and Groq.


## Projects

### SPROUT — Plant Disease Detection Model and RAG Chatbot
*Oct 2024 - May 2025*

- Fine-tuned and optimized an ImageNet-pretrained ConvNeXt convolutional neural network (CNN) in PyTorch for plant disease identification, achieving 98.5% validation accuracy across 38 disease categories on a dataset of 110,000+ images.
- Implemented a Retrieval-Augmented Generation (RAG) chatbot using the DeepSeek API and a ChromaDB vector database to enrich user prompts with semantically relevant context, boosting care plan accuracy by 80% over base LLM responses.
- Containerized the full-stack application with Docker and deployed the ML pipeline to Google Cloud, eliminating 100% of environment-related errors and saving the team 10+ hours in manual deployment tasks weekly.

### ContextLens — Real-Time Multimodal Conversation Assistant
*Jan 2026*

- Built to support introverted and neurodivergent users, engineered a real-time multimodal inference pipeline combining Deepgram transcription, Gemini Vision, and Gemini reasoning to deliver contextual guidance within a Unity AR interface.
- Implemented a sliding-window transcript engine with stateful context compression, applying prompt engineering through structured prompt templates and Gemini-based summarization to sustain coherent low-latency NLP inference across multi-turn dialogue.
- Engineered a fault-tolerant multi-modal data fusion layer processing concurrent asynchronous speech and vision streams, normalizing signals into a unified JSON schema with graceful degradation for delayed or missing modalities pre-inference.


## Technical Skills

- **Certifications:** Microsoft Azure AI Fundamentals (AI-900), IBM AI Engineering Certification (IP)
- **Languages:** Python, SQL, Java, C++, JavaScript, R, HTML/CSS
- **Frameworks & Libraries:** PyTorch, TensorFlow, LangChain, LangGraph, Scikit-Learn, Pandas, NumPy, OpenCV, FastAPI, Flask, React, Node.js, Express
- **Databases & Tools:** Docker, Kubernetes, Helm, PostgreSQL, ChromaDB, MongoDB, Google Cloud Platform (GCP), AWS, Azure, Jenkins, GitHub Actions, Git, AI coding assistants, Tableau, MS Excel
- **Proficiencies:** Artificial Intelligence (AI), Agentic AI, Large Language Models (LLMs), NLP, ETL Pipelines, Backend Development, Cloud Infrastructure, REST API Design, CI/CD, Agile/Scrum, Statistical Analysis, Data Analysis, Data Cleaning, OOP
