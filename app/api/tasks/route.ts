import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, totalChunks } = await req.json();
    const task = await prisma.processingTask.create({
      data: {
        name,
        totalChunks,
        status: "PROCESSING"
      }
    });
    return NextResponse.json(task);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const tasks = await prisma.processingTask.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    return NextResponse.json(tasks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
