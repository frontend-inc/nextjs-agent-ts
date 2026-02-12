"use client";

import { UIMessagePart } from "@/packages/ai";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { Loader } from "@/components/ai-elements/loader";
import { GetWeatherResultTool, WeatherResult } from "./tools/GetWeatherResultTool";

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
  // For dynamic tools, toolName is a direct property
  if (part.type === "dynamic-tool") {
    return (part as any).toolName || "unknown";
  }
  // For static tools, the tool name is in the type: "tool-{toolName}"
  if (part.type.startsWith("tool-")) {
    return part.type.slice(5); // Remove "tool-" prefix
  }
  return "unknown";
}

// Tool-specific renderers
interface ToolResultRendererProps {
  part: UIMessagePart;
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

function WeatherToolRenderer({ part, toolName }: { part: UIMessagePart; toolName: string }) {
  const { output, state } = part as any;
  const isComplete = state === "output-available";

  return (
    <GetWeatherResultTool
      toolName={toolName}
      result={output as WeatherResult}
      isComplete={isComplete}
    />
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

export function ToolPartRenderer({ part }: ToolResultRendererProps) {
  const toolName = extractToolName(part);
  const state = (part as any).state;
  const isComplete = state === "output-available";

  switch (toolName) {
    case "getWeather":
      return <WeatherToolRenderer part={part} toolName={toolName} />;
    default:
      if (!isComplete && !(part as any).input) {
        return <ToolLoadingIndicator toolName={toolName} />;
      }
      return <DefaultToolRenderer part={part} toolName={toolName} />;
  }
}

export function MessagePartRenderer({ part }: { part: UIMessagePart }) {
  if (part.type.startsWith("tool-") || part.type === "dynamic-tool") {
    return <ToolPartRenderer part={part} />;
  }
  return null;
}
