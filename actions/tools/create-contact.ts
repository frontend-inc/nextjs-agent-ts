import { tool } from "ai";
import { z } from "zod";
import { supabase } from "@/actions/supabase/client";

export const createContact = tool({
  description:
    "Create a new contact. Use this tool when the user wants to add or save a contact with their details.",
  inputSchema: z.object({
    name: z.string().optional().describe("The contact's full name"),
    email: z.string().describe("The contact's email address"),
    phone: z.string().optional().describe("The contact's phone number"),
    message: z.string().optional().describe("An optional message or note about the contact"),
  }),
  execute: async ({ name, email, phone, message }) => {
    const { data, error } = await supabase
      .from("contacts")
      .insert({ name, email, phone, message })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, contact: data };
  },
});
