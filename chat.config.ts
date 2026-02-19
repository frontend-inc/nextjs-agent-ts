import { CreateContactTool } from "@/components/tools/create-contact-tool";
import { FetchDocumentsTool } from "@/components/tools/fetch-documents-tool";
import { createContact } from "@/actions/tools/create-contact";
import { fetchDocuments } from "@/actions/tools/fetch-documents";

export const tools = {
  createContact,
  fetchDocuments,
};

export const toolComponents = {
  createContact: CreateContactTool,
  fetchDocuments: FetchDocumentsTool,
};
