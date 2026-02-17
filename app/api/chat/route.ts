import { streamText, convertToModelMessages, stepCountIs } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { tools } from '@/chat.config';
import { DEFAULT_MODEL_ID, getModelById } from '@/lib/llm-models';

const openrouter = createOpenRouter({
  apiKey: process.env.FRONTEND_API_KEY!,
  baseURL: 'https://cloud.frontend.co/api/v1',
});

export async function POST(request: Request) {
  try {
    const { messages, modelId } = await request.json();

    const selectedModel = getModelById(modelId) ? modelId : DEFAULT_MODEL_ID;
    const model = openrouter(selectedModel);

    const systemMessage = {
      role: 'system',
      parts: [{ type: 'text', text: 'You are an AI assistant.' }],
    };
    const allMessages = [systemMessage, ...messages];
    const convertedMessages = await convertToModelMessages(allMessages);

    const result = await streamText({
      model,
      messages: convertedMessages,
      tools,
      stopWhen: stepCountIs(20),
      providerOptions: {
        openrouter: {
          reasoning: {
            enabled: true
          }
        }
      }
    });

    return result.toUIMessageStreamResponse({
      sendReasoning: true
    })
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
