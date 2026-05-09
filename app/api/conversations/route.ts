import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const convs = await prisma.conversation.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
          messages: {
              take: 1,
              orderBy: { timestamp: 'desc' }
          }
      }
    });
    return NextResponse.json(convs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
