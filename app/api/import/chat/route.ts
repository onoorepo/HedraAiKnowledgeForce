import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const text = await file.text();
    
    // Simplistic mock parsing for WhatsApp-like / Facebook text blobs
    const lines = text.split('\n');
    const messages = [];
    const participants = new Set<string>();
    
    for (const line of lines) {
        // very basic parsing logic just to show capability
        if (line.includes(" - ") && line.includes(": ")) {
            const timePart = line.split(" - ")[0];
            const rest = line.substring(timePart.length + 3);
            const sender = rest.split(": ")[0];
            const content = rest.substring(sender.length + 2);
            
            if (sender && content) {
                participants.add(sender);
                try {
                  messages.push({
                     sender,
                     text: content,
                     timestamp: new Date() // mock date parsing
                  });
                } catch (e) {
                  // Ignore invalid dates
                }
            }
        } else if (line.includes(": ")) {
            // simpler fallback for generic exports
            const sender = line.split(": ")[0];
            const content = line.substring(sender.length + 2);
            if (sender.length < 30) {
              participants.add(sender);
              messages.push({
                 sender,
                 text: content,
                 timestamp: new Date()
              });
            }
        }
    }
    
    // If no messages parsed, generate a mock message to show that text was imported as a note
    if (messages.length === 0) {
       messages.push({
         sender: "System",
         text: "Data imported: " + text.substring(0, 200) + "...",
         timestamp: new Date()
       });
       participants.add("System");
    }

    // Create conversation in MySQL via Prisma
    const conversation = await prisma.conversation.create({
        data: {
            platform: file.name.toLowerCase().includes('whatsapp') ? 'whatsapp' : 'facebook',
            type: 'BUSINESS',
            participants: Array.from(participants),
            metadata: { fileName: file.name },
            messages: {
                create: messages.map(m => ({
                    sender: m.sender,
                    text: m.text,
                    timestamp: m.timestamp
                }))
            }
        }
    });

    return NextResponse.json({ success: true, conversationId: conversation.id });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed to parse and import chat" }, { status: 500 });
  }
}
