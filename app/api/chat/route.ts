import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = `You are "The Boss", the primary Orchestrator Agent for HedraAiKnowledge (HAK), a Second Brain and Knowledge Graph system.
Your job is to understand the user's intent and invoke the correct sub-agent or tool.
You have access to tools that can search the Pinecone Vector Database, query MySQL, and interact with the user's UI by returning special XML tags like <Widget type="CHART">.

Always be professional, highly intelligent, and consider yourself the core orchestrator of Souly's knowledge base.
If asked to explain something, you can simulate a whiteboard using <Widget type="WHITEBOARD" data="your_data_here"></Widget>.`;

  // We rely on GOOGLE_GENERATIVE_AI_API_KEY or use the injected API key
  // Normally the system handles GOOGLE_GENERATIVE_AI_API_KEY for @ai-sdk/google
  // We can pass process.env.GEMINI_API_KEY directly if needed by wrapping it?
  // Let's just use google('gemini-1.5-pro') and assume env var GOOGLE_GENERATIVE_AI_API_KEY is mapped.

  process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  const result = streamText({
    model: google('gemini-1.5-pro'),
    system: systemPrompt,
    messages,
    tools: {
      searchKnowledgeBase: tool({
        description: 'Search the Pinecone Vector Database for relevant knowledge.',
        parameters: z.object({
          query: z.string().describe('The search query to find relevant information.'),
        }),
        execute: async ({ query }) => {
          return { results: `[Simulated Pinecone Vector Search for: ${query}] \nHAK contains 1,248 nodes. Mocks state: The user is planning a massive AI migration.` };
        },
      }),
      createDocumentTask: tool({
        description: 'Trigger an update to documentation after fulfilling a user request.',
        parameters: z.object({
          taskName: z.string(),
          summary: z.string()
        }),
        execute: async ({ taskName, summary }) => {
          return { status: 'success', message: `Doc update scheduled for: ${taskName}` };
        }
      })
    },
  });

  return result.toDataStreamResponse();
}
