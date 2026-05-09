# HAK API Documentation

This document outlines the internal API routes used in the project, handling the interactions between the Next.js Frontend UI and the databases (MySQL & Pinecone).

---

## 1. `POST /api/ingest`
**Description:** Takes raw user text, generates vector embeddings using a Language Model, and saves the data simultaneously into MySQL (for relational text data) and Pinecone (for semantic vector search).

**Payload (JSON):**
```json
{
  "title": "String - The title of the node.",
  "content": "String - The main chunk of knowledge.",
  "type": "String - (Optional) NOTE | DOCUMENT | CODE | AGENT_THOUGHT. Default is NOTE.",
  "tags": ["String (Optional)", "Tags for categorization"],
  "sourceId": "String (Optional) - References another ID like a message ID."
}
```

**Response (JSON):**
```json
{
  "success": true,
  "node": {
    "id": "uuid",
    "title": "...",
    "content": "...",
    "type": "NOTE",
    "pineconeId": "node_uuid",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

**Under The Hood:**
1. Checks for required fields.
2. Automatically detects the current Gemini API Key to use `@ai-sdk/google` (`embed` function) for generating vector embeddings of 768 dimensions. If it falls back, it uses a mock embedding.
3. Saves to Prisma `Node` table.
4. Generates a `pineconeId` mapped to `node_uuid`.
5. Updates Prisma.
6. Calls `PineconeClient().Index('hak-brain')` and Upserts the exact vector array and metadata matching that node.

---

## 2. `GET /api/agents`
**Description:** Fetches all custom agents/bots created by the user from the MySQL database.

**Response (JSON):**
```json
[
  {
    "id": "uuid",
    "name": "The Boss",
    "role": "Core Orchestrator",
    "systemPrompt": "You are the primary manager...",
    "isActive": true,
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

## 3. `POST /api/agents`
**Description:** Generates a new internal AI agent/persona tailored for specific processing tasks (e.g., Code Reviewer, Summarizer).

**Payload (JSON):**
```json
{
  "name": "String - Agent Name",
  "role": "String - Sub-title or specialized domain",
  "systemPrompt": "String - The instructions the agent must abide by.",
  "isActive": "Boolean (Optional) - Default true"
}
```

---

## 4. `GET /api/vault`
**Description:** Gets a list of saved Keys (without their decrypted values to prevent visual leakage).

**Response (JSON):**
```json
[
  {
    "id": "uuid",
    "keyName": "GEMINI_API_KEY",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

## 5. `POST /api/vault`
**Description:** Encrypts and securely stores an API key or password into the system's MySQL Vault using symmetric E2EE encryption (AES-256-CBC).

**Payload (JSON):**
```json
{
  "keyName": "String - Name of the key (e.g. OPENAI_API_KEY)",
  "value": "String - The raw secret string"
}
```

**Response (JSON):**
```json
{
  "success": true,
  "keyName": "GEMINI_API_KEY"
}
```

**Security Context:**
Only the Node.js backend processes the raw key. It translates it using the `ENCRYPTION_KEY` located in `.env`. An IV is dynamically created on every upsert to prevent deterministic collision patterns.
