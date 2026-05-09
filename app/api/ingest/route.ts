import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { pinecone, indexName } from '@/lib/pinecone';
import { GoogleGenAI } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const { title, content, type = 'NOTE' } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Missing title or content" }, { status: 400 });
    }

    // 1. Generate Embeddings using Gemini (768 dimensions for text-embedding-004)
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy" });
    let embeddingVals: number[] = Array(768).fill(0); // fallback if no key
    
    if (process.env.GEMINI_API_KEY) {
      try {
          const response = await ai.models.embedContent({
              model: 'text-embedding-004',
              contents: content,
          });
          if (response.embeddings?.[0]?.values) {
              embeddingVals = response.embeddings[0].values;
          }
      } catch (e) {
          console.error("Embedding generation failed, continuing with fallback 0s:", e);
      }
    }

    const pineconeId = uuidv4();

    // 2. Save to MySQL
    const node = await prisma.node.create({
      data: {
        title,
        content,
        type,
        pineconeId,
      }
    });

    // 3. Save to Pinecone
    if (process.env.PINECONE_API_KEY) {
      try {
          const index = pinecone.Index(indexName);
          await index.upsert([{
              id: pineconeId,
              values: embeddingVals,
              metadata: {
                  nodeId: node.id,
                  title: node.title,
                  type: node.type
              }
          }]);
      } catch (e) {
          console.error("Pinecone upsert failed:", e);
      }
    }

    return NextResponse.json({ success: true, node });

  } catch (error: any) {
    console.error("Ingest Error:", error);
    return NextResponse.json({ error: error.message || "Failed to ingest data" }, { status: 500 });
  }
}
