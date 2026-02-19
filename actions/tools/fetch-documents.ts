import { tool } from "ai";
import { z } from "zod";
import { fetchPublishedDocuments } from "@/actions/supabase/fetch-documents";

export const fetchDocuments = tool({
  description:
    "Search for published documents. Use this tool when the user wants to find or look up documents.",
  inputSchema: z.object({
    query: z
      .string()
      .optional()
      .describe("A search query to filter documents by title"),
  }),
  execute: async ({ query }) => {
    try {
      const documents = await fetchPublishedDocuments(query);
      return { success: true, documents };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
});
