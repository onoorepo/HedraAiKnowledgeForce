import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: "Missing text" }, { status: 400 });

    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: "GEMINI_API_KEY is not configured." }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Step 1: Fetch the "Summarizer" and "Task Extractor" agents
    const summarizer = await prisma.agent.findFirst({ where: { role: 'Summarization', isActive: true } });
    const extractor = await prisma.agent.findFirst({ where: { role: 'Extraction', isActive: true } });

    if (!summarizer || !extractor) {
        return NextResponse.json({ error: "Required Swarm Agents missing. Please seed DB." }, { status: 500 });
    }

    // Step 2: Agent #1 Summarizer parses the data
    const res1 = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${summarizer.systemPrompt}\n\nHere is the raw data:\n${text}`
    });
    const summaryText = res1.text || "";

    // Step 3: Agent #2 Task Extractor reads the Summary to extract To-Dos
    const res2 = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${extractor.systemPrompt}\n\nHere is a summary of a conversation/data to extract tasks from:\n${summaryText}`
    });
    const taskText = res2.text || "";

    return NextResponse.json({
        success: true,
        originalSnippet: text.substring(0, 50) + "...",
        summaryData: summaryText,
        extractedTasks: taskText
    });

  } catch (error: any) {
    console.error("Swarm Action Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
