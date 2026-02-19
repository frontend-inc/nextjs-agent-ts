"use client";

import { useState } from "react";
import type { ChatStatus } from "ai";
import { CheckIcon, PlusIcon } from "lucide-react";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorGroup,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import { models, DEFAULT_MODEL_ID } from "@/lib/llm-models";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (message: PromptInputMessage) => void;
  status?: ChatStatus;
  placeholder?: string;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  status = "ready",
  placeholder,
  selectedModel: controlledModel,
  onModelChange,
}: ChatInputProps) {
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [internalModel, setInternalModel] = useState(DEFAULT_MODEL_ID);

  const selectedModel = controlledModel ?? internalModel;
  const selectedModelData = models.find((m) => m.id === selectedModel);

  const handleModelSelect = (modelId: string) => {
    if (onModelChange) {
      onModelChange(modelId);
    } else {
      setInternalModel(modelId);
    }
    setModelSelectorOpen(false);
  };

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
          <ModelSelector
            onOpenChange={setModelSelectorOpen}
            open={modelSelectorOpen}
          >
            <ModelSelectorTrigger asChild>
              <PromptInputButton>
                {selectedModelData?.chefSlug && (
                  <ModelSelectorLogo provider={selectedModelData.chefSlug} />
                )}
                {selectedModelData?.name && (
                  <ModelSelectorName>{selectedModelData.name}</ModelSelectorName>
                )}
              </PromptInputButton>
            </ModelSelectorTrigger>
            <ModelSelectorContent>
              <ModelSelectorList>
                <ModelSelectorGroup heading="OpenAI">
                  {models.map((m) => (
                    <ModelSelectorItem
                      key={m.id}
                      onSelect={() => handleModelSelect(m.id)}
                      value={m.id}
                    >
                      <ModelSelectorLogo provider={m.chefSlug} />
                      <ModelSelectorName>{m.name}</ModelSelectorName>
                      {selectedModel === m.id ? (
                        <CheckIcon className="ml-auto size-4" />
                      ) : (
                        <div className="ml-auto size-4" />
                      )}
                    </ModelSelectorItem>
                  ))}
                </ModelSelectorGroup>
              </ModelSelectorList>
            </ModelSelectorContent>
          </ModelSelector>
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
