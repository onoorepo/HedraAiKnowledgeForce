# HAK (HedraAiKnowledge) Architecture & Documentation

## 1. Overview
**HAK (Second Brain)** is a Next.js (App Router) based full-stack application designed to act as an external "Second Brain" for the user. It leverages AI models (such as Gemini) seamlessly integrated with a vector database (Pinecone) and a relational database (MySQL via Prisma) to ingest, process, connect, and retrieve vast amounts of knowledge dynamically.

## 2. Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, Framer Motion, Shadcn/UI (Radix primitives).
- **Backend**: Next.js API Routes (Serverless architecture).
- **Relational Database**: MySQL controlled via Prisma ORM.
- **Vector Database**: Pinecone (for semantic text search and RAG - Retrieval-Augmented Generation).
- **AI Integration**: `@ai-sdk/google` (Vercel AI SDK), Gemini Models.
- **Visualization**: `react-force-graph-2d` for neural node networking.
- **Security**: AES-256-CBC End-to-End Encryption for API Keys stored in vault.

---

## 3. Core Capabilities

### A. The "Boss Agent" Interface (`/` - Dashboard)
A conversational interface acting as the primary orchestrator. Users interact with the AI to recall information, brainstorm, or generate insights based on their ingested knowledge.

### B. Smart Editor & Ingestion (`/write` & `/import`)
- Features for users to write thoughts directly into the system.
- Calls `/api/ingest` which:
  1. Takes the raw text.
  2. Calls an Embedding Model (e.g., `text-embedding-004`) to vectorize the text into numbers.
  3. Saves the structural metadata in MySQL.
  4. Saves the vector data in Pinecone, linked by a `pineconeId`.

### C. Neural Graph (`/graph`)
A visual representation of knowledge nodes and their relations. Displays how ideas, tags, and conversational markers attach to one another using physical force simulation.

### D. Hybrid Search (`/search`)
Cross-references exact keywords (MySQL) with semantic meaning (Pinecone) to deliver exactly what the user is looking for, even if they type an abstract concept.

### E. E2EE Settings Vault (`/settings`)
To remain fully decentralized and secure, API keys (Gemini, Pinecone, OpenAI, etc.) are encrypted locally and stored in the database. When the backend makes a call, it decrypts them securely on the server-side, protecting against unauthorized access.

---

## 4. Prisma Schema Overview

The MySQL database schema is structured for extreme flexibility:
- **`Node`**: The fundamental unit of knowledge. Contains `title`, `content` (Markdown), `type` (NOTE, DOCUMENT, CODE), and a one-to-one mapping with Pinecone via `pineconeId`.
- **`NodeRelation`**: Mapping connections between nodes to form the Knowledge Graph.
- **`Conversation` & `Message`**: Allows importing Facebook/WhatsApp histories as raw datasets.
- **`Agent`**: Swarm mechanics. Custom bots with specialized `systemPrompt`s.
- **`VaultSecret`**: Encrypted E2EE secrets for maximum safety.
- **`Tag`**: Taxonomical grouping.

---

## 5. Directory Structure Map

```text
/
├── app/                  # Next.js App Router (Frontend + API Backend)
│   ├── api/              # Backend endpoints
│   │   ├── agents/       # Agent management (GET, POST)
│   │   ├── ingest/       # Content to Vector process (POST)
│   │   └── vault/        # Encrypted Secrets Engine (GET, POST)
│   ├── agents/           # UI: Swarm logic management
│   ├── graph/            # UI: react-force-graph-2d Canvas
│   ├── import/           # UI: File uploader and data parser
│   ├── search/           # UI: Hybrid Vector Search
│   ├── settings/         # UI: Configurations and E2EE saving
│   ├── write/            # UI: The Smart Editor
│   └── page.tsx          # UI: The Boss Agent dashboard
│
├── components/           # Reusable UI React Components
│   ├── ui/               # Generic elements (Shadcn/UI setup)
│   ├── sidebar.tsx       # Desktop navigation
│   └── mobile-toolbar.tsx# App-like mobile navigation
│
├── lib/                  # Utilities and singletons
│   ├── pinecone.ts       # Pinecone connection singleton
│   ├── prisma.ts         # Prisma global instance
│   └── utils.ts          # Tailwind merge utilities
│
└── prisma/
    └── schema.prisma     # Relational blueprints
```

## 6. End-to-End Encryption Flow (Vault)
When a user inputs a sensitive external API Key in `/settings`:
1. The plaintext is sent securely via TLS (`https`) to `/api/vault` (Can be updated to Encrypt on client before send in future phase).
2. The server uses `crypto.createCipheriv` with `aes-256-cbc` and a symmetric `.env` master password (`ENCRYPTION_KEY`).
3. It creates a randomized 16-byte IV.
4. Saved in MySQL as: `iv_hex:encrypted_buffer_hex`.

## 7. Future Scalability
- The API routes are separated so they can easily be deployed across edge functions if Prisma supports edge proxies. 
- Mobile interface is built to be a PWA (Progressive Web App). By adding a `manifest.json` and a service worker, it operates natively on phones.
