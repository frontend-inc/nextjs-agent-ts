"use client";

interface WeatherResult {
  location: string;
  temperature: number;
  units: "celsius" | "fahrenheit";
  condition: string;
  humidity: number;
  windSpeed: number;
}

interface GetWeatherResultToolProps {
  toolName: string;
  result: WeatherResult;
  isComplete: boolean;
}

function getDisplayText(isComplete: boolean): string {
  return isComplete ? "Weather fetched" : "Fetching weather...";
}

function formatToolName(toolName: string): string {
  return toolName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function ToolStatus({ toolName, isComplete }: { toolName: string; isComplete: boolean }) {
  const displayText = getDisplayText(isComplete);
  const formattedName = formatToolName(toolName);
  return (
    <div className="text-xs text-muted-foreground mb-2">
      <span className="font-medium">{formattedName}</span>
      <span className="mx-1">·</span>
      <span className={isComplete ? "" : "text-shine"}>
        {displayText}
      </span>
    </div>
  );
}

function formatTemperature(temp: number, units: "celsius" | "fahrenheit"): string {
  return `${temp}°${units === "celsius" ? "C" : "F"}`;
}

export function GetWeatherResultTool({ toolName, result, isComplete }: GetWeatherResultToolProps) {
  if (!isComplete) {
    return (
      <div className="my-2">
        <ToolStatus toolName={toolName} isComplete={false} />
      </div>
    );
  }

  if (!result?.location) {
    return (
      <div className="my-2">
        <ToolStatus toolName={toolName} isComplete={true} />
        <div className="text-sm text-muted-foreground">
          Unable to fetch weather data
        </div>
      </div>
    );
  }

  return (
    <div className="my-3">
      <ToolStatus toolName={toolName} isComplete={true} />
      <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
        <div className="font-medium text-sm">{result.location}</div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold">
            {formatTemperature(result.temperature, result.units)}
          </span>
          <span className="text-sm text-muted-foreground">{result.condition}</span>
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>Humidity: {result.humidity}%</span>
          <span>Wind: {result.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
}

export type { WeatherResult };
