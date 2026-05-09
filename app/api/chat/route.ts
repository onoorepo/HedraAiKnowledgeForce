import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { pinecone, indexName } from '@/lib/pinecone';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
       return NextResponse.json({ error: "Invalid message array" }, { status: 400 });
    }

    const userQuery = lastMessage.content;
    let contextStr = "";

    // 1. Vector Search for RAG (Retrieval-Augmented Generation) Context
    if (process.env.GEMINI_API_KEY && process.env.PINECONE_API_KEY) {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            
            // Embed Query
            const embedRes = await ai.models.embedContent({
                model: 'text-embedding-004',
                contents: userQuery,
            });

            if (embedRes.embeddings?.[0]?.values) {
                // Search Pinecone
                const index = pinecone.Index(indexName);
                const queryResponse = await index.query({
                   vector: embedRes.embeddings[0].values,
                   topK: 5,
                   includeMetadata: true
                });

                const pineconeIds = queryResponse.matches.map(m => m.id);
                
                // Fetch Content from DB
                const nodes = await prisma.node.findMany({
                   where: { pineconeId: { in: pineconeIds } }
                });

                if (nodes.length > 0) {
                    contextStr = "Relevant context from my Second Brain:\n\n";
                    nodes.forEach(n => {
                        contextStr += `--- Title: ${n.title} ---\n${n.content}\n\n`;
                    });
                }
            }
        } catch (e) {
            console.error("RAG context fetching failed:", e);
        }
    }

    // 2. Format Messages for Gemini
    const systemPrompt = `You are "The Boss", the primary AI orchestrator of HAK (HedraAiKnowledge) Second Brain system. 
You act as my external cortex. 
When answering, ALWAYS base your answers primarily on the "Context" provided below if it is relevant.
If the context isn't sufficient, use your general knowledge, but state clearly that it's not from my Second Brain.
Keep your answers actionable, intelligent, and perfectly formatted using Markdown. If I ask you to extract tasks or summarize large new items, mention you can pass it to the Task Extractor or Summarizer agents.
`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy" });

    // Ensure we handle when there is no API key configured.
    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({
            role: "assistant",
            content: "You have not configured your GEMINI_API_KEY. Please set it in the `.env` file or E2EE Vault."
        });
    }

    // Construct prompt
    const prompt = `${systemPrompt}\n\n${contextStr}\n\nUser Question: ${userQuery}\n\nAnswer:`;

    // 3. Call AI
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return NextResponse.json({
        role: "assistant", 
        content: response.text
    });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process chat" }, { status: 500 });
  }
}
