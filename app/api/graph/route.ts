import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const nodes = await prisma.node.findMany({ select: { id: true, title: true, type: true } });
    const relations = await prisma.nodeRelation.findMany();
    
    // Format for react-force-graph-2d
    const formattedNodes = nodes.map(n => ({
      id: n.id,
      name: n.title,
      val: 20,
      group: n.type === 'DOCUMENT' ? 1 : n.type === 'CODE' ? 2 : 3
    }));

    const formattedLinks = relations.map(r => ({
      source: r.sourceNodeId,
      target: r.targetNodeId,
      name: r.relationType
    }));

    return NextResponse.json({ nodes: formattedNodes, links: formattedLinks });
  } catch(e: any) {
    console.error("Graph API Error:", e);
    return NextResponse.json({error: "Failed to fetch neural graph"}, {status: 500});
  }
}
