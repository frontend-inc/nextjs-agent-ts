"use client";

import { UIMessage } from "@/packages/ai";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageAttachment,
  MessageAttachments,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";
import { ToolPartRenderer, getTextContent, getReasoningPart } from "./ChatMessageParts";

interface ChatMessagesProps {
  messages: UIMessage[];
  isLoading?: boolean;
}


function LoadingIndicator() {
  return (
    <Message from="assistant">
      <MessageContent from="assistant">
        <Loader />
      </MessageContent>
    </Message>
  );
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const isToolPart = (type: string) => type === "file" || type.startsWith("tool-");
  const hasReasoningPart = (parts: typeof messages[0]["parts"]) =>
    parts.some((p) => p.type === "reasoning" && p.text);

  const visibleMessages = messages.filter(
    (message) =>
      message.role === "user" ||
      getTextContent(message.parts).trim() !== "" ||
      message.parts.some((p) => isToolPart(p.type)) ||
      hasReasoningPart(message.parts)
  );

  const lastMessage = messages[messages.length - 1];
  const hasContent =
    getTextContent(lastMessage?.parts || []).trim() !== "" ||
    lastMessage?.parts.some((p) => isToolPart(p.type)) ||
    hasReasoningPart(lastMessage?.parts || []);
  const isStreaming = lastMessage?.role === "assistant" && hasContent;
  const showLoading = isLoading && !isStreaming;

  return (
    <Conversation>
      <ConversationContent className="mx-auto max-w-3xl px-4 pb-4">
        {visibleMessages.map((message) => {
          const textContent = getTextContent(message.parts);
          const reasoningPart = getReasoningPart(message.parts);
          const toolParts = message.parts.filter((p) => p.type.startsWith("tool-"));
          return (
            <Message key={message.id} from={message.role}>
              {message.role === "assistant" && reasoningPart && (
                <Reasoning isStreaming={reasoningPart.state !== "done"}>
                  <ReasoningTrigger />
                  <ReasoningContent>{reasoningPart.text || ""}</ReasoningContent>
                </Reasoning>
              )}

              {toolParts.map((part, index) => (
                <ToolPartRenderer key={`tool-${index}`} part={part} />
              ))}

              {textContent && (
                <MessageContent from={message.role}>
                  <MessageResponse>{textContent}</MessageResponse>
                </MessageContent>
              )}
            </Message>
          );
        })}
        {showLoading && <LoadingIndicator />}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
