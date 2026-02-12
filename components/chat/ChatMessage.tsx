"use client";

import { cn } from "@/lib/utils";
import { Tool, UIMessage, UIMessagePart } from "ai";
import { MessagePartRenderer } from "./ChatMessageParts";

interface ChatMessageProps {
  message: UIMessage;
}

function getTextContent(parts: UIMessagePart<any, any>[]): string {
  return parts
    .filter((p) => p.type === "text")
    .map((p) => p.text || "")
    .join("");
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        <div
          className={cn(
            "prose prose-sm max-w-none",
            isUser
              ? "prose-invert prose-p:text-primary-foreground prose-headings:text-primary-foreground prose-strong:text-primary-foreground prose-code:text-primary-foreground"
              : "prose-p:text-foreground prose-headings:text-foreground prose-strong:text-foreground"
          )}
        >
          {message.parts.map((part, index) => (
            <MessagePartRenderer key={index} part={part} />
          ))}
        </div>
      </div>
    </div>
  );
}

export { getTextContent };
export type { UIMessage as Message };
