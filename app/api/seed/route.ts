import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST() {
  try {
    // 1. Seed Agents
    await prisma.agent.createMany({
       data: [
         { name: "Task Extractor", role: "Extraction", systemPrompt: "Extract tasks from text.", isActive: true },
         { name: "Summarizer", role: "Summarization", systemPrompt: "Summarize the text.", isActive: true }
       ],
       skipDuplicates: true,
    });

    // 2. Seed Fake Nodes
    await prisma.node.createMany({
       data: [
         { title: "React Basics", content: "React is a great UI library.", type: "NOTE", pineconeId: uuidv4() },
         { title: "AI Basics", content: "AI uses neural networks to simulate intelligence.", type: "DOCUMENT", pineconeId: uuidv4() }
       ],
       skipDuplicates: true
    });

    return NextResponse.json({ success: true, message: "Database seeded correctly with Mock Data." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
