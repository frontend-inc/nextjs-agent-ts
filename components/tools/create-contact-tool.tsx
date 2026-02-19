"use client";

import { Task, TaskContent, TaskItem, TaskTrigger } from "@/components/ai-elements/task";
import { RiUser3Line } from "@remixicon/react";
import type { ToolComponentProps } from "./types";

export function CreateContactTool({ part, toolName }: ToolComponentProps) {
  const { output, state } = part as any;
  const isComplete = state === "output-available";

  const title = isComplete ? "Contact created" : "Creating contact...";

  return (
    <Task defaultOpen={isComplete}>
      <TaskTrigger title={title} icon={<RiUser3Line className="size-4" />} />
      <TaskContent>
        {isComplete && output?.success && (
          <TaskItem>
            Saved {output.contact?.name ?? output.contact?.email}
          </TaskItem>
        )}
        {isComplete && !output?.success && (
          <TaskItem className="text-destructive">
            {output?.error ?? "Failed to create contact"}
          </TaskItem>
        )}
      </TaskContent>
    </Task>
  );
}
