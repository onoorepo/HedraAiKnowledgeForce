import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { status, progress, errorMessage } = await req.json();
    const task = await prisma.processingTask.update({
      where: { id: params.id },
      data: { status, progress, errorMessage }
    });
    return NextResponse.json(task);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
