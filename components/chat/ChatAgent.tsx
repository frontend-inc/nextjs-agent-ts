'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { ChatStatus } from 'ai';
import { ChatInput, type PromptInputMessage } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { ChatPrompt, PromptSuggestion } from './ChatPrompt';
import { ChatSidebar, type Chat } from './ChatSidebar';
import { useChat, UIMessage } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { DEFAULT_MODEL_ID } from '@/lib/llm-models';
import { getUserId } from '@/actions/supabase/chat-store';
import { uploadFile } from '@/actions/supabase/upload-file';
import { createChat, listChats, deleteChat } from '@/actions/supabase/chats';
import { getMessages } from '@/actions/supabase/messages';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';

interface ChatAgentProps {
  suggestions?: PromptSuggestion[];
}

export function ChatAgent({ suggestions }: ChatAgentProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL_ID);
  const [chatId, setChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const selectedModelRef = useRef(selectedModel);
  const chatIdRef = useRef(chatId);
  selectedModelRef.current = selectedModel;
  chatIdRef.current = chatId;

  const transportRef = useRef(
    new DefaultChatTransport({
      api: '/api/chat',
      headers: () => ({
        'X-Agent-Id': selectedModelRef.current,
        ...(chatIdRef.current ? { 'x-chat-id': chatIdRef.current } : {}),
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
      // Refresh chat list after message completion
      fetchChats();
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

  const fetchChats = useCallback(async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const fetchedChats = await listChats(userId);
      setChats(fetchedChats || []);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleSelectChat = useCallback(
    async (selectedChatId: string) => {
      try {
        const messages = await getMessages(selectedChatId);
        setChatId(selectedChatId);

        const uiMessages: UIMessage[] = messages.map((msg: { role: string; parts: Array<{ type: string; text?: string }> }, index: number) => ({
          id: `${selectedChatId}-${index}`,
          role: msg.role,
          parts: msg.parts,
          content: msg.parts
            .filter((p: { type: string }) => p.type === 'text')
            .map((p: { text?: string }) => p.text)
            .join(''),
        }));

        setChatMessages(uiMessages);
      } catch (error) {
        console.error('Failed to load chat:', error);
      }
    },
    [setChatMessages]
  );

  const handleNewChat = useCallback(() => {
    setChatId(null);
    setChatMessages([]);
    setInputValue('');
  }, [setChatMessages]);

  const handleDeleteChat = useCallback(
    async (deletedChatId: string) => {
      try {
        await deleteChat(deletedChatId);
        setChats((prev) => prev.filter((c) => c.id !== deletedChatId));
        if (chatId === deletedChatId) {
          setChatId(null);
          setChatMessages([]);
        }
      } catch (error) {
        console.error('Failed to delete chat:', error);
      }
    },
    [chatId, setChatMessages]
  );

  const handleSendMessage = useCallback(
    async (message: PromptInputMessage) => {
      const trimmedValue = message.text?.trim();
      if (!trimmedValue && !message.files?.length) return;
      if (status === 'submitted' || status === 'streaming' || isUploading) return;

      // Create chat on first message
      if (!chatIdRef.current) {
        const newChatId = crypto.randomUUID();
        const userId = getUserId();
        const title = trimmedValue
          ? trimmedValue.slice(0, 100)
          : 'New Chat';

        setChatId(newChatId);

        try {
          await createChat(newChatId, title, userId);
        } catch (error) {
          console.error('Failed to create chat:', error);
        }
      }

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
            const fileToUpload = new File(
              [blob],
              file.filename || 'file',
              { type: file.mediaType }
            );

            const formData = new FormData();
            formData.append('file', fileToUpload);
            const { url: fileUrl } = await uploadFile(formData);

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

  return (
    <SidebarProvider defaultOpen={false}>
      <ChatSidebar
        chats={chats}
        activeChatId={chatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />
      <SidebarInset>
        {!hasMessages ? (
          <div className="relative">
            <div className="absolute top-2 left-2 z-10">
              <SidebarTrigger />
            </div>
            <ChatPrompt
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSendMessage}
              status={chatStatus}
              suggestions={suggestions}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
          </div>
        ) : (
          <div className="relative flex h-screen flex-col">
            <div className="absolute top-2 left-2 z-10">
              <SidebarTrigger />
            </div>
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
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}

export type { UIMessage as Message };
