'use client';

import { useState, useCallback, useRef } from 'react';
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
  const selectedModelRef = useRef(selectedModel);
  selectedModelRef.current = selectedModel;

  const transportRef = useRef(
    new DefaultChatTransport({
      api: '/api/chat',
      headers: () => ({
        'X-Agent-Id': selectedModelRef.current,
      }),
    })
  );

  const {
    status,
    messages: chatMessages,
    setMessages: setChatMessages,
    sendMessage,
    stop,
    error: aiError,
    addToolApprovalResponse,
  } = useChat({
    transport: transportRef.current,
    onFinish: async () => {
      // Handle message completion if needed
    },
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

  const [isUploading, setIsUploading] = useState(false);

  const chatStatus: ChatStatus =
    isUploading
      ? 'submitted'
      : status === 'submitted' || status === 'streaming'
        ? status
        : 'ready';

  const handleSendMessage = useCallback(
    async (message: PromptInputMessage) => {
      const trimmedValue = message.text?.trim();
      if (!trimmedValue && !message.files?.length) return;
      if (status === 'submitted' || status === 'streaming' || isUploading) return;

      const parts: Array<
        | { type: 'text'; text: string }
        | { type: 'file'; url: string; mediaType: string; filename: string }
      > = [];

      if (trimmedValue) {
        parts.push({ type: 'text', text: trimmedValue });
      }

      // Upload files and add them as parts
      if (message.files?.length) {
        setIsUploading(true);
        for (const file of message.files) {
          try {
            // Convert data URL to File for upload
            const blob = await fetch(file.url).then((r) => r.blob());
            const uploadFile = new File(
              [blob],
              file.filename || 'file',
              { type: file.mediaType }
            );

            const formData = new FormData();
            formData.append('file', uploadFile);

            const res = await fetch('/api/storage', {
              method: 'POST',
              body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');
            const { url: fileUrl } = await res.json();

            const ext = (file.filename || '').split('.').pop()?.toLowerCase();
            const isImage = ['jpg', 'jpeg', 'png'].includes(ext || '');
            const isPdf = ext === 'pdf';

            if (isImage) {
              parts.push({
                type: 'file',
                url: fileUrl,
                mediaType: file.mediaType || `image/${ext === 'jpg' ? 'jpeg' : ext}`,
                filename: fileUrl.split('/').pop() || 'image.png',
              });
              parts.push({
                type: 'text',
                text: `![Image](${fileUrl})`,
              });
            } else if (isPdf) {
              parts.push({
                type: 'file',
                url: fileUrl,
                mediaType: 'application/pdf',
                filename: fileUrl.split('/').pop() || 'document.pdf',
              });
              parts.push({
                type: 'text',
                text: `[${file.filename || 'Document'}](${fileUrl})`,
              });
            } else {
              parts.push({
                type: 'text',
                text: `[${file.filename || 'File'}](${fileUrl})`,
              });
            }
          } catch (err) {
            console.error('File upload error:', err);
          }
        }
        setIsUploading(false);
      }

      if (parts.length === 0) return;

      const userMessage = { role: 'user', parts };

      setInputValue('');
      await sendMessage(userMessage);
    },
    [status, sendMessage, chatMessages, isUploading]
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
    <div className="relative flex h-screen flex-col">
      <div className="flex-1 overflow-hidden">
        <ChatMessages
          messages={chatMessages}
          isLoading={status === 'submitted' || status === 'streaming'}
        />
      </div>
      <div className="sticky bottom-0 bg-background p-4">
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
