import type { Config } from "@puckeditor/core";
import { FieldLabel } from "@puckeditor/core";
import { ChatAgent } from "@/components/chat/ChatAgent";
import { ThemeProvider } from "@/components/tailwind-theme"

type Props = {
  Agent: {
    avatar: string;
    title: string;
    subtitle: string;
    placeholder: string;
    suggestions: { label: string; value: string }[];
    enableImageUploads: string;
    enableModelSelect: string;
    llmModel: string;
    apiKey: string;
  };
};

const colorField = (label: string, defaultValue: string) => ({
  type: "custom" as const,
  label,
  render: ({ field, name, onChange, value }: { field: { label: string }; name: string; onChange: (val: string) => void; value: string }) => (
    <FieldLabel label={field.label}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="color"
          name={name}
          value={value || defaultValue}
          onChange={(e) => onChange(e.currentTarget.value)}
          style={{ width: 40, height: 40, padding: 0, borderRadius: 6, overflow: 'hidden', cursor: "pointer" }}
        />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.currentTarget.value)}
          placeholder={defaultValue}
          style={{ flex: 1, padding: "6px 8px", border: "1px solid #e2e2e2", borderRadius: 6, backgroundColor: 'white', fontSize: 14 }}
        />
      </div>
    </FieldLabel>
  ),
});

export const config: Config<Props> = {
  root: {
    fields: {
      primaryColor: colorField("Primary Color", "#1a1a1a"),
      secondaryColor: colorField("Secondary Color", "#f5f5f5"),
      fontHeader: {
        label: "Header Font",
        type: "select",
        options: [
          { label: "Inter", value: "Inter" },
          { label: "Space Grotesk", value: "Space Grotesk" },
          { label: "Playfair Display", value: "Playfair Display" },
          { label: "Lato", value: "Lato" },
          { label: "Roboto", value: "Roboto" },
          { label: "Open Sans", value: "Open Sans" },
          { label: "Montserrat", value: "Montserrat" },
          { label: "Poppins", value: "Poppins" },
          { label: "Raleway", value: "Raleway" },
          { label: "Nunito", value: "Nunito" },
          { label: "DM Sans", value: "DM Sans" },
          { label: "Sora", value: "Sora" },
        ],
      },
      fontBody: {
        label: "Body Font",
        type: "select",
        options: [
          { label: "Inter", value: "Inter" },
          { label: "Space Grotesk", value: "Space Grotesk" },
          { label: "Playfair Display", value: "Playfair Display" },
          { label: "Lato", value: "Lato" },
          { label: "Roboto", value: "Roboto" },
          { label: "Open Sans", value: "Open Sans" },
          { label: "Montserrat", value: "Montserrat" },
          { label: "Poppins", value: "Poppins" },
          { label: "Raleway", value: "Raleway" },
          { label: "Nunito", value: "Nunito" },
          { label: "DM Sans", value: "DM Sans" },
          { label: "Sora", value: "Sora" },
        ],
      },
    },
    defaultProps: {
      title: "My App",
      primaryColor: "#1a1a1a",
      secondaryColor: "#f5f5f5",
      fontHeader: "Inter",
      fontBody: "Inter",
    },
    render: ({
      children,
      primaryColor,
      secondaryColor,
      fontHeader,
      fontBody,
    }) => (
      <ThemeProvider
        primaryColor={primaryColor || undefined}
        secondaryColor={secondaryColor || undefined}
        fontHeader={fontHeader || undefined}
        fontBody={fontBody || undefined}
      >
        {children}
      </ThemeProvider>
    ),
  },
  components: {
    Agent: {
      fields: {
        avatar: { label: "Avatar URL", type: "text" },
        title: { label: "Title", type: "text", contentEditable: true },
        subtitle: { label: "Subtitle", type: "text", contentEditable: true },
        placeholder: { label: "Placeholder", type: "text" },
        suggestions: {
          label: "Suggestions",
          type: "array",
          arrayFields: {
            label: { type: "text" },
            value: { type: "text" },
          },
          defaultItemProps: { label: "Suggestion", value: "Suggestion" },
          getItemSummary: (item: { label: string; value: string }) => item.label || "Empty suggestion",
        },
        enableImageUploads: {
          label: "Enable Image Uploads",
          type: "radio",
          options: [
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
          ],
        },
        enableModelSelect: {
          label: "Enable Model Select",
          type: "radio",
          options: [
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
          ],
        },
        llmModel: {
          label: "LLM Model",
          type: "select",
          options: [
            { label: "Claude Haiku 4.5", value: "anthropic/claude-haiku-4.5" },
            { label: "Claude Sonnet 4.6", value: "anthropic/claude-sonnet-4.6" },
          ],
        },
        apiKey: { label: "API Key", type: "text" },
      },
      defaultProps: {
        avatar: "",
        title: "How can I help you today?",
        subtitle: "Start a conversation or try one of the suggestions below",
        placeholder: "Type a message...",
        suggestions: [],
        enableImageUploads: "true",
        enableModelSelect: "true",
        llmModel: "anthropic/claude-haiku-4.5",
        apiKey: "",
      },
      render: ({
        avatar,
        title,
        subtitle,
        placeholder,
        suggestions,
        enableImageUploads,
        enableModelSelect,
        llmModel,
        apiKey,
      }) => (
        <ChatAgent
          avatar={avatar || undefined}
          title={title || undefined}
          subtitle={subtitle || undefined}
          placeholder={placeholder || undefined}
          suggestions={suggestions?.length ? suggestions : undefined}
          enableImageUploads={enableImageUploads === "true"}
          enableModelSelect={enableModelSelect === "true"}
          llmModel={llmModel || undefined}
          apiKey={apiKey || undefined}
        />
      ),
    },
  },
};

export default config;
