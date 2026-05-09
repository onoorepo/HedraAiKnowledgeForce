# HAK API Documentation

This document outlines the internal API routes used in the project, handling the interactions between the Next.js Frontend UI and the databases (MySQL & Pinecone).

---

## 1. `POST /api/ingest`
**Description:** Takes raw user text, generates vector embeddings using Gemini (`text-embedding-004`), saves data to MySQL and Pinecone. Automatically performs **Relation Extraction** to find semantic matches and link them together in the Graph.

**Payload:** `{ "title": "...", "content": "...", "type": "NOTE" }`

---

## 2. `POST /api/search`
**Description:** Performs a Hybrid Search. It uses Gemini to create an embedding of the user's query, searches Pinecone (for semantic vector matches), and falls back to string-matching in MySQL if Pinecone is empty.

**Payload:** `{ "query": "..." }`

---

## 3. `POST /api/chat` (The Boss RAG Endpoint)
**Description:** The core chat inference endpoint. It fetches the latest user message, embeds it, queries Pinecone for context (RAG - Retrieval-Augmented Generation), and streams/returns a complete response using Gemini 2.5 Flash as "The Boss".

**Payload:** `{ "messages": [{ "role": "user", "content": "Hello" }] }`

---

## 4. `POST /api/swarm`
**Description:** Simulates the continuous Agent loop. Takes a dense text body, passes it to the `Summarizer` agent, then passes that summary to the `Task Extractor` agent, simulating agent-to-agent continuous Swarm data digestion.

**Payload:** `{ "text": "Large unstructured text block" }`

---

## 5. `GET /api/graph`
**Description:** Fetches all Nodes and NodeRelations from MySQL and formats them perfectly for the physical neural visualization engine (`react-force-graph-2d`).

**Response:** `{ "nodes": [...], "links": [...] }`

---

*(The `/api/vault` and `/api/agents` routes remain as CRUD endpoints for managing internal bots and E2EE keys).*
