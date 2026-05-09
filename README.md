# HedraAiKnowledge (HAK) - The External Cortex of Hedra

## 🧠 Project Vision & Goals
**HedraAiKnowledge (HAK)** is not just an app; it is a personalized digital extension of the human brain. Designed specifically for **Hedra**, its purpose is to aggregate, categorize, and synthesize every fragment of information encountered in life—from sensitive passwords and technical guides to deep conversational histories from WhatsApp, Facebook, and Messenger.

The system uses **Hybrid Neural Search** (Vector + Lexical) and a **Swarm of Specialized AI Agents** to transform raw data into an actionable knowledge graph.

## 🛠 Features & Capabilities

### 1. Multi-Dimensional Knowledge Ingestion
- **Smart Editor**: Markdown-ready editor for manual notes with AI-powered categorization.
- **Neural Mass Import**: Bulk processing of WhatsApp XML/JSON, Facebook backups, and raw logs. 
- **Swarm Digestion**: Automatically splits large files into chunks, passing them through a chain of Agents (Summarizer -> Task Extractor -> Knowledge Linker).
- **Web Scraper Agent**: Paste any URL to scrape web content, strip ads, and index it semantically.

### 2. Hybrid Brain Search & Retrieval
- **Vector Brain**: Uses Pinecone and Gemini Embeddings (`text-embedding-004`) for semantic understanding.
- **RAG Chat (The Boss)**: A central conversational interface that answers questions based strictly on your stored knowledge.
- **Relational MySQL**: Traditional search for exact matches and metadata.

### 3. AI Agent Swarm (The Digital Team)
- **The Boss**: Core orchestrator and decision-maker.
- **Task Extractor**: Finds actionable items in chaos.
- **Summarizer**: Condenses huge chats into bullet points.
- **Relation Extractor**: Automatically links new notes to similar existing ones in the neural graph.

### 4. Visual Neural Graph
- **Interactive 2D Graph**: Physical visualization of how your ideas and data connect using `react-force-graph-2d`.
- **Relationship Mapping**: Visualizes `REFERENCES`, `PARENT_OF`, and `SIMILAR_TO` links.

### 5. Security & Privacy
- **E2EE Vault**: Secure storage for sensitive API keys and passwords using AES-256-CBC encryption.
- **Total Ownership**: Designed as a private tool for a single user (Hedra).

## 📂 Documentation Guide
- `MainReport.md`: High-level progress and feature completion status.
- `API_DOCS.md`: Detailed documentation of all internal REST endpoints.
- `ARCHITECTURE.md`: Deep dive into the tech stack (Next.js, Prisma, MySQL, Pinecone, Gemini).
- `schema.prisma`: The source of truth for the project's data relations.

## 🚀 How to Run
1. **Prerequisites**: Node.js, MySQL Instance, Pinecone Account, Gemini API Key.
2. **Environment**: Copy `.env.example` to `.env` and fill in secrets.
3. **Setup Database**:
   ```bash
   npx prisma db push
   ```
4. **Seed Database**:
   Visit `/api-tester` and click "Seed Database" to populate initial Agents and Sample Nodes.
5. **Start Dev Server**:
   ```bash
   npm run dev
   ```

## 🔮 Future Roadmap (Phase 3)
- **WhatsApp Live Integration**: Direct API connection for real-time chat processing.
- **Entity memory graphs**: Detailed profiling of people, places, and events extracted from chats.
- **Mobile PWA Enhancements**: Offline-first storage with IndexedDB.
- **Background Worker**: Moving long-running imports to server-side jobs (Redis/BullMQ style).

---
**Ownership**: Created and Maintained by Hedra 🚀
