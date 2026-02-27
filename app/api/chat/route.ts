import { streamText, convertToModelMessages, stepCountIs } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { fetchDocuments } from './tools/fetch-documents';
import { DEFAULT_MODEL_ID, getModelById } from '@/lib/llm-models';
import { insertMessages } from '@/actions/supabase/messages';

const openrouter = createOpenRouter({
  apiKey: process.env.FRONTEND_API_KEY!,
  baseURL: 'https://cloud.frontend.co/api/v1',
});

export async function POST(request: Request) {
  try {
    const chatId = request.headers.get('x-chat-id');
    const { messages, modelId } = await request.json();

    const selectedModel = getModelById(modelId) ? modelId : DEFAULT_MODEL_ID;
    const model = openrouter(selectedModel);

    const systemMessage = {
      role: 'system',
      parts: [{ type: 'text', text: 'You are an AI assistant.' }],
    };
    const allMessages = [systemMessage, ...messages];
    const convertedMessages = await convertToModelMessages(allMessages);

    // Get the last user message for persistence
    const lastUserMessage = [...messages].reverse().find((m: { role: string }) => m.role === 'user');

    const result = await streamText({
      model,
      messages: convertedMessages,
      tools: { fetchDocuments },
      stopWhen: stepCountIs(20),
      providerOptions: {
        openrouter: {
          reasoning: {
            enabled: true
          }
        }
      },
      onFinish: async ({ text }) => {
        if (!chatId) return;

        const messagesToInsert = [];

        if (lastUserMessage) {
          messagesToInsert.push({
            chat_id: chatId,
            role: 'user',
            parts: lastUserMessage.parts,
          });
        }

        if (text) {
          messagesToInsert.push({
            chat_id: chatId,
            role: 'assistant',
            parts: [{ type: 'text', text }],
          });
        }

        if (messagesToInsert.length > 0) {
          try {
            await insertMessages(messagesToInsert);
          } catch (error) {
            console.error('Failed to persist messages:', error);
          }
        }
      },
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
