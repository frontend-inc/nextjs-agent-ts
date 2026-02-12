import { tool } from "ai";
import { z } from "zod";

export const getWeather = tool({
  description:
    "Get the current weather for a location. Use this tool when the user asks about the weather in a specific city or place.",
  inputSchema: z.object({
    location: z.string().describe("The city and country, e.g. 'San Francisco, CA' or 'London, UK'"),
    units: z
      .enum(["celsius", "fahrenheit"])
      .optional()
      .describe("The temperature unit to use. Defaults to celsius."),
  }),
  execute: async ({ location, units = "celsius" }) => {
    // Mock weather data for demonstration
    const mockWeather = {
      location,
      temperature: units === "celsius" ? 22 : 72,
      units,
      condition: "Partly cloudy",
      humidity: 65,
      windSpeed: 12,
    };

    return mockWeather;
  },
});
