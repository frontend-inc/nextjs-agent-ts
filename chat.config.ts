import { CreateContactTool } from "@/components/tools/create-contact-tool";
import { createContact } from "@/actions/tools/create-contact";

export const tools = {
  createContact,
};

export const toolComponents = {
  createContact: CreateContactTool,
};
