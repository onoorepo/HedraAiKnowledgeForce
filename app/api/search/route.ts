import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { pinecone, indexName } from '@/lib/pinecone';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { query, limit = 5 } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    let embeddingVals: number[] = Array(768).fill(0);

    if (process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      try {
          const response = await ai.models.embedContent({
              model: 'text-embedding-004',
              contents: query,
          });
          if (response.embeddings?.[0]?.values) {
              embeddingVals = response.embeddings[0].values;
          }
      } catch (e) {
          console.error("Embedding query failed:", e);
      }
    }

    let pineconeIds: string[] = [];

    if (process.env.PINECONE_API_KEY) {
      try {
        const index = pinecone.Index(indexName);
        const queryResponse = await index.query({
            vector: embeddingVals,
            topK: limit,
            includeMetadata: true
        });
        pineconeIds = queryResponse.matches.map(match => match.id);
      } catch(e) {
        console.error("Pinecone query failed:", e);
      }
    }

    // Fetch full data from MySQL based on Vector Search
    let nodes = [];
    if (pineconeIds.length > 0) {
        nodes = await prisma.node.findMany({
            where: {
                pineconeId: { in: pineconeIds }
            }
        });
    }

    // Hybrid fallback: text match if vector returned nothing or failed
    const exactMatches = await prisma.node.findMany({
        where: {
            OR: [
                { title: { contains: query } },
                { content: { contains: query } }
            ],
            NOT: {
                pineconeId: { in: pineconeIds }
            }
        },
        take: 3
    });

    const combined = [...nodes, ...exactMatches];

    return NextResponse.json({ success: true, results: combined });
  } catch (error: any) {
    console.error("Search Error:", error);
    return NextResponse.json({ error: error.message || "Search failed" }, { status: 500 });
  }
}
