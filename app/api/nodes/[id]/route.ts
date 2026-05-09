import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { pinecone, indexName } from '@/lib/pinecone';
import { logSystem, LogLevel } from '@/lib/logger';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const node = await prisma.node.findUnique({
      where: { id: params.id },
      include: { tags: true, sourceRelations: true, targetRelations: true }
    });
    if (!node) return NextResponse.json({ error: "Node not found" }, { status: 404 });
    return NextResponse.json(node);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const node = await prisma.node.update({
      where: { id: params.id },
      data: {
        title: body.title,
        content: body.content,
        type: body.type
      }
    });
    
    await logSystem(LogLevel.INFO, `Updated node: ${node.title}`, "CRUD", { nodeId: node.id });
    
    return NextResponse.json(node);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const node = await prisma.node.findUnique({ where: { id: params.id } });
    if (!node) return NextResponse.json({ error: "Node not found" }, { status: 404 });

    // 1. Delete from Pinecone
    if (process.env.PINECONE_API_KEY && node.pineconeId) {
      try {
        const index = pinecone.Index(indexName);
        await index.deleteOne(node.pineconeId);
      } catch (e) {
        console.error("Failed to delete from Pinecone", e);
      }
    }

    // 2. Delete relations first (Prisma should handle if set to cascade, but safe for now)
    await prisma.nodeRelation.deleteMany({
      where: {
        OR: [{ sourceNodeId: node.id }, { targetNodeId: node.id }]
      }
    });

    // 3. Delete from MySQL
    await prisma.node.delete({ where: { id: params.id } });

    await logSystem(LogLevel.WARN, `Deleted node: ${node.title}`, "CRUD", { nodeId: node.id });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
