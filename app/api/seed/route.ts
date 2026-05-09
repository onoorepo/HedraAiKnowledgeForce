import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST() {
  try {
    // 1. Seed Agents heavily involved in the swarm
    await prisma.agent.createMany({
       data: [
         { name: "Task Extractor", role: "Extraction", systemPrompt: "You are the Task Extractor. Read the text and return ONLY actionable tasks with a checkbox [ ].", isActive: true },
         { name: "Summarizer", role: "Summarization", systemPrompt: "You are the Summarizer. Produce a highly condensed bullet-point summary of the text provided. Do not include tasks.", isActive: true },
         { name: "Code Reviewer", role: "Code", systemPrompt: "Review code snippets for security flaws.", isActive: true }
       ],
       skipDuplicates: true,
    });

    // Clean up existing mocked nodes (just to avoid huge clutter, but typically not safe in prod)
    // await prisma.node.deleteMany();

    // 2. Seed Rich Fake Nodes
    const reactNodeId = uuidv4();
    const aiNodeId = uuidv4();
    const pineconeNodeId = uuidv4();
    
    // Create explicitly linked nodes to test Graph and Retrieval
    const n1 = await prisma.node.create({
         data: { title: "React Basics", content: "React helps build modern UIs faster.", type: "NOTE", pineconeId: reactNodeId }
    });
    
    const n2 = await prisma.node.create({
         data: { title: "AI Basics", content: "AI uses neural networks to simulate intelligence.", type: "DOCUMENT", pineconeId: aiNodeId }
    });

    const n3 = await prisma.node.create({
         data: { title: "Pinecone Setup", content: "Pinecone stores our vector embeddings for quick RAG queries.", type: "DOCUMENT", pineconeId: pineconeNodeId }
    });

    // 3. Manually Seed Relations so the Graph looks amazing automatically
    await prisma.nodeRelation.createMany({
        data: [
            { sourceNodeId: n2.id, targetNodeId: n3.id, relationType: 'USES' },
            { sourceNodeId: n1.id, targetNodeId: n2.id, relationType: 'FUTURE_INTEGRATION' }
        ]
    });

    // 4. Seed a Sample Conversation
    await prisma.conversation.create({
        data: {
            platform: "whatsapp",
            type: "PERSONAL",
            participants: ["Hedra", "Suli"],
            messages: {
                create: [
                    { sender: "Suli", text: "Hey Hedra, remember to update the RAG system today.", timestamp: new Date() },
                    { sender: "Hedra", text: "On it! Working on the External Cortex right now.", timestamp: new Date() }
                ]
            }
        }
    });

    return NextResponse.json({ success: true, message: "Database seeded beautifully with Mock Data, Relations, and Conversations." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
