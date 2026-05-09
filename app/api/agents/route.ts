import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(agents);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const agent = await prisma.agent.create({
      data: {
        name: json.name,
        role: json.role,
        systemPrompt: json.systemPrompt,
        isActive: json.isActive ?? true,
      }
    });
    return NextResponse.json(agent);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 });
  }
}
