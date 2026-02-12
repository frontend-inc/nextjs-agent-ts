export interface LLMModel {
  id: string;
  name: string;
  chef: string;
  chefSlug: string;
}

export const models: LLMModel[] = [
  {
    id: "gpt-5.2",
    name: "GPT-5.2",
    chef: "OpenAI",
    chefSlug: "openai",
  },
  {
    id: "gpt-5-mini",
    name: "GPT-5 Mini",
    chef: "OpenAI",
    chefSlug: "openai",
  },
  {
    id: "gpt-5-nano",
    name: "GPT-5 Nano",
    chef: "OpenAI",
    chefSlug: "openai",
  },
];

export const DEFAULT_MODEL_ID = "gpt-5.2";

export function getModelById(id: string): LLMModel | undefined {
  return models.find((m) => m.id === id);
}
