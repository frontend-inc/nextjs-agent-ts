export interface LLMModel {
  id: string;
  name: string;
  chef: string;
  chefSlug: string;
}

export const models: LLMModel[] = [
  {
    id: "anthropic/claude-opus-4.6",
    name: "Claude Opus 4.6",
    chef: "Anthropic",
    chefSlug: "anthropic",
  },
  {
    id: "anthropic/claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    chef: "Anthropic",
    chefSlug: "anthropic",
  },
  {
    id: "anthropic/claude-haiku-4.5",
    name: "Claude Haiku 4.5",
    chef: "Anthropic",
    chefSlug: "anthropic",
  },
  {
    id: "openai/gpt-5.3",
    name: "GPT-5.3",
    chef: "OpenAI",
    chefSlug: "openai",
  },
  {
    id: "moonshotai/kimi-k2.5",
    name: "Kimi K2.5",
    chef: "Moonshot AI",
    chefSlug: "moonshotai",
  },
];

export const DEFAULT_MODEL_ID = "anthropic/claude-haiku-4.5";

export function getModelById(id: string): LLMModel | undefined {
  return models.find((m) => m.id === id);
}
