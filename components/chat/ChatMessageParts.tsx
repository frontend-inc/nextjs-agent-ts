"use client";

import { UIMessagePart } from "ai";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { Loader } from "@/components/ai-elements/loader";
import { toolComponents } from "@/chat.config";

// Helper functions
export function getTextContent(parts: UIMessagePart[]): string {
  return parts
    .filter((p) => p.type === "text")
    .map((p) => p.text || "")
    .join("");
}

export function getReasoningPart(parts: UIMessagePart[]): UIMessagePart | undefined {
  return parts.find((p) => p.type === "reasoning");
}

function extractToolName(part: UIMessagePart): string {
  if (part.type === "dynamic-tool") {
    return (part as any).toolName || "unknown";
  }
  if (part.type.startsWith("tool-")) {
    return part.type.slice(5);
  }
  return "unknown";
}

function DefaultToolRenderer({ part, toolName }: { part: UIMessagePart; toolName: string }) {
  const { input, output, state, errorText } = part as any;

  return (
    <Tool>
      <ToolHeader
        title={toolName}
        type={part.type as any}
        state={state || "input-streaming"}
      />
      <ToolContent>
        {input && <ToolInput input={input} />}
        <ToolOutput output={output} errorText={errorText} />
      </ToolContent>
    </Tool>
  );
}

function ToolLoadingIndicator({ toolName }: { toolName: string }) {
  return (
    <div className="mb-4 flex items-center gap-2 text-muted-foreground text-sm">
      <Loader size={14} />
      <span>Running {toolName}...</span>
    </div>
  );
}

function RenderTool({ part }: { part: UIMessagePart }) {
  const toolName = extractToolName(part);
  const state = (part as any).state;
  const isComplete = state === "output-available";

  const CustomRenderer = toolComponents[toolName];
  if (CustomRenderer) {
    return <CustomRenderer part={part} toolName={toolName} />;
  }

  if (!isComplete && !(part as any).input) {
    return <ToolLoadingIndicator toolName={toolName} />;
  }
  return <DefaultToolRenderer part={part} toolName={toolName} />;
}

export function ToolPartRenderer({ part }: { part: UIMessagePart }) {
  return <RenderTool part={part} />;
}

export function MessagePartRenderer({ part }: { part: UIMessagePart }) {
  if (part.type.startsWith("tool-") || part.type === "dynamic-tool") {
    return <RenderTool part={part} />;
  }
  return null;
}
