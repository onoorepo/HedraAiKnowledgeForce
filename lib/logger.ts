import prisma from './prisma';

export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS"
}

export async function logSystem(level: LogLevel, message: string, module?: string, metadata?: any) {
  try {
    await prisma.systemLog.create({
      data: {
        level,
        message,
        module: module || "SYSTEM",
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined
      }
    });
  } catch (e) {
    console.error("Critical: Logging failed", e);
  }
}
