"use client";

import type { ChatStatus } from "ai";
import { ChatInput, type PromptInputMessage } from "./ChatInput";
import { Suggestion } from "@/components/ai-elements/suggestion";

export interface PromptSuggestion {
  key: string;
  value: string;
}

interface ChatPromptProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (message: PromptInputMessage) => void;
  status?: ChatStatus;
  suggestions?: PromptSuggestion[];
  selectedModel?: string;
  onModelChange?: (model: string) => void;
}

const defaultSuggestions: PromptSuggestion[] = [
  {
    key: "Write a story",
    value: "Write a short creative story about a robot learning to paint",
  },
  {
    key: "Explain a concept",
    value: "Explain quantum computing in simple terms that anyone can understand",
  },
  {
    key: "Help me code",
    value: "Help me write a function that calculates the fibonacci sequence",
  },
  {
    key: "Plan a trip",
    value: "Help me plan a 5-day itinerary for visiting Tokyo, Japan",
  },
];

export function ChatPrompt({
  value,
  onChange,
  onSubmit,
  status = "ready",
  suggestions = defaultSuggestions,
  selectedModel,
  onModelChange,
}: ChatPromptProps) {
  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          How can I help you today?
        </h1>
        <p className="text-muted-foreground">
          Start a conversation or try one of the suggestions below
        </p>
      </div>

      <div className="w-full max-w-2xl">
        <ChatInput
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          status={status}
          selectedModel={selectedModel}
          onModelChange={onModelChange}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((suggestion) => (
          <Suggestion
            key={suggestion.key}
            suggestion={suggestion.key}
            onClick={() => handleSuggestionClick(suggestion.value)}
          />
        ))}
      </div>
    </div>
  );
}
