"use client";

import type { ChatStatus } from "ai";
import { PlusIcon } from "lucide-react";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (message: PromptInputMessage) => void;
  status?: ChatStatus;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  status = "ready",
  placeholder,
}: ChatInputProps) {
  return (
    <PromptInput globalDrop multiple onSubmit={onSubmit}>
      <PromptInputHeader>
        <PromptInputAttachments>
          {(attachment) => <PromptInputAttachment data={attachment} />}
        </PromptInputAttachments>
      </PromptInputHeader>
      <PromptInputBody>
        <PromptInputTextarea
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          value={value}
        />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger>
              <PlusIcon className="size-4" />
            </PromptInputActionMenuTrigger>
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
        </PromptInputTools>
        <PromptInputSubmit
          disabled={!value.trim() || status === "streaming"}
          status={status}
        />
      </PromptInputFooter>
    </PromptInput>
  );
}

export type { PromptInputMessage };
