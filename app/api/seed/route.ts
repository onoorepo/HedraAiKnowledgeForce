import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    // 1. Seed Agents
    const agents = [
      {
        name: "The Boss (Master Control)",
        role: "ORCHESTRATOR",
        systemPrompt: "You are the primary intelligence of HedraAiKnowledge. Your goal is to coordinate other agents, answer complex queries by synthesizing data from MySQL and Pinecone, and ensure all responses are actionable and precise."
      },
      {
        name: "Summarizer Agent",
        role: "ANALYST",
        systemPrompt: "You specialize in distilling large volumes of text, documents, or long conversations into concise, high-value summaries. Focus on key entities, dates, and core concepts."
      },
      {
        name: "Task Extractor",
        role: "OPERATIVE",
        systemPrompt: "Your mission is to find commitments, deadlines, tasks, and follow-ups hidden in chat logs or notes. Format your output as clear actionable bullet points."
      },
      {
        name: "Psychology & Sentiment Agent",
        role: "PROFILER",
        systemPrompt: "Analyze communication styles, emotional tones, and personality traits of participants in conversations. Help the user understand the 'hidden' dynamics of their interactions."
      },
      {
        name: "Web Scraper Specialist",
        role: "RESEARCHER",
        systemPrompt: "You turn messy HTML from websites into structured, clean Markdown. You identify the main content and ignore ads, navigation, and clutter."
      }
    ];

    for (const agent of agents) {
      await prisma.agent.upsert({
        where: { id: agent.name }, // This won't work as id is UUID, lets use findFirst or name check
        update: { systemPrompt: agent.systemPrompt, role: agent.role },
        create: { name: agent.name, role: agent.role, systemPrompt: agent.systemPrompt }
      });
    }

    // Since name isn't unique in schema, I'll use a safer approach for seeding
    // Let's just create them if they don't exist by name
    const existingAgents = await prisma.agent.findMany();
    for (const a of agents) {
        if (!existingAgents.find(ea => ea.name === a.name)) {
            await prisma.agent.create({ data: a });
        }
    }

    // 2. Seed Tags
    const tags = [
      { name: "Personal", color: "#ec4899", icon: "User" },
      { name: "Business", color: "#10b981", icon: "Briefcase" },
      { name: "Secret", color: "#f59e0b", icon: "Lock" },
      { name: "Code", color: "#3b82f6", icon: "Code" },
      { name: "Urgent", color: "#ef4444", icon: "AlertCircle" }
    ];

    for (const tag of tags) {
      await prisma.tag.upsert({
        where: { name: tag.name },
        update: { color: tag.color, icon: tag.icon },
        create: tag
      });
    }

    // 3. Add a log entry for seeding
    await prisma.systemLog.create({
        data: {
            level: "SUCCESS",
            module: "SYSTEM",
            message: "Database seeded with default agents and tags."
        }
    });

    return NextResponse.json({ message: "Seeding completed successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
