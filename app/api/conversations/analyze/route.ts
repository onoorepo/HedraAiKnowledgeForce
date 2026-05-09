import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { conversationId, action } = await req.json();
    
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { messages: { orderBy: { timestamp: 'asc' } } }
    });

    if (!conversation) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

    const chatHistory = conversation.messages.map(m => `${m.sender}: ${m.text}`).join("\n");

    const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = "";
    if (action === "SUMMARY") {
        prompt = `Analyze this conversation and provide a concise summary, key topics, and any implicit emotional tone:\n\n${chatHistory}`;
    } else if (action === "EXTRACT_TASKS") {
        prompt = `Identify any actionable tasks, deadlines, or commitments made in this conversation. Output as a bulleted list:\n\n${chatHistory}`;
    } else if (action === "PSYCHOLOGY") {
        prompt = `Analyze the personality traits and social dynamics of the participants based on their communication style in this chat:\n\n${chatHistory}`;
    } else {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ result: responseText });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
