"use client";

import { Task, TaskContent, TaskItem, TaskTrigger } from "@/components/ai-elements/task";
import { RiFileTextLine } from "@remixicon/react";
import type { ToolComponentProps } from "./types";

export function FetchDocumentsTool({ part, toolName }: ToolComponentProps) {
  const { output, state } = part as any;
  const isComplete = state === "output-available";

  const title = isComplete ? "Knowledge found" : "Searching knowledge...";

  return (
    <Task defaultOpen={isComplete}>
      <TaskTrigger title={title} icon={<RiFileTextLine className="size-4" />} />
      <TaskContent>
        {isComplete && output?.success && (
          <>
            {output.documents?.length > 0 ? (
              output.documents.map((doc: any, i: number) => (
                <TaskItem key={doc.id ?? i}>{doc.title}</TaskItem>
              ))
            ) : (
              <TaskItem>No knowledge found</TaskItem>
            )}
          </>
        )}
        {isComplete && !output?.success && (
          <TaskItem className="text-destructive">
            {output?.error ?? "Failed to fetch documents"}
          </TaskItem>
        )}
      </TaskContent>
    </Task>
  );
}
