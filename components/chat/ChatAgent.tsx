'use client';

import { useState, useMemo, useCallback } from 'react';
import type { ChatStatus } from 'ai';
import { ChatInput, type PromptInputMessage } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { ChatPrompt, PromptSuggestion } from './ChatPrompt';
import { useChat, UIMessage } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { DEFAULT_MODEL_ID } from '@/lib/llm-models';

interface ChatAgentProps {
  suggestions?: PromptSuggestion[];
}

export function ChatAgent({ suggestions }: ChatAgentProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL_ID);
  const {
    status,
    messages: chatMessages,
    setMessages: setChatMessages,
    sendMessage,
    stop,
    error: aiError,
    addToolApprovalResponse,
  } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: { model: selectedModel },
    }),
    onFinish: async () => {
      // Handle message completion if needed
    },
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

  const chatStatus: ChatStatus =
    status === 'submitted' || status === 'streaming' ? status : 'ready';

  const handleSendMessage = useCallback(
    async (message: PromptInputMessage) => {

      const trimmedValue = message.text?.trim();
      if (!trimmedValue && !message.files?.length) return;
      if (status === 'submitted' || status === 'streaming') return;

      const userMessage = {
        role: 'user',
        parts: [{ type: 'text', text: trimmedValue || '' }],
      };

      setInputValue('');
      await sendMessage(userMessage);
    },
    [status, sendMessage, chatMessages]
  );

  const handleStop = useCallback(() => {
    stop();
  }, [stop]);

  const hasMessages = chatMessages.length > 0;

  if (!hasMessages) {
    return (
      <ChatPrompt
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSendMessage}
        status={chatStatus}
        suggestions={suggestions}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />
    );
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <div className="flex-1 overflow-hidden pb-32">
        <ChatMessages
          messages={chatMessages}
          isLoading={status === 'submitted' || status === 'streaming'}
        />
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-background p-4">
        <div className="mx-auto max-w-3xl">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSendMessage}
            status={chatStatus}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </div>
      </div>
    </div>
  );
}

export type { UIMessage as Message };
