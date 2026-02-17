import { GetWeatherTool } from "@/components/tools/get-weather-tool";
import { getWeather } from "@/actions/tools/get-weather";

export const tools = {
  getWeather,
};

export const toolComponents= {
  getWeather: GetWeatherTool,
};
