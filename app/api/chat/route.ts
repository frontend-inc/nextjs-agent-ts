import { streamText, convertToModelMessages } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { getWeather } from './tools/get-weather';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const model = openai('gpt-5.2');

    const systemMessage = {
      role: 'system',
      parts: [{ type: 'text', text: 'You are an AI assistant.' }],
    };
    const allMessages = [systemMessage, ...messages];
    const convertedMessages = await convertToModelMessages(allMessages);

    const result = await streamText({
      model,
      messages: convertedMessages,
      tools: { getWeather },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
