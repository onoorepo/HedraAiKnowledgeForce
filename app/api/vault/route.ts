import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

// Simple crypto settings
const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012'; // Must be 32 bytes
const IV_LENGTH = 16;

function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export async function GET() {
  try {
    const secrets = await prisma.vaultSecret.findMany({
      select: { id: true, keyName: true, createdAt: true, updatedAt: true }
    });
    return NextResponse.json(secrets);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch secrets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { keyName, value } = await req.json();
    if (!keyName || !value) {
      return NextResponse.json({ error: "Missing keyName or value" }, { status: 400 });
    }

    const encryptedVal = encrypt(value);

    const secret = await prisma.vaultSecret.upsert({
      where: { keyName },
      update: { encryptedVal },
      create: { keyName, encryptedVal }
    });

    return NextResponse.json({ success: true, keyName: secret.keyName });
  } catch (error) {
    console.error("Vault Save Error:", error);
    return NextResponse.json({ error: "Failed to store secret" }, { status: 500 });
  }
}
