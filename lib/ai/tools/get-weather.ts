import { tool } from 'ai';
import { z } from 'zod';
import { AISDKZodV4Adapter } from '@/lib/ai/zod-v4-adapter';

// Create Zod v4 schema with enhanced validation
const weatherSchemaV4 = z.object({
  latitude: z.number().min(-90, { error: 'Latitude must be >= -90' }).max(90, { error: 'Latitude must be <= 90' }),
  longitude: z.number().min(-180, { error: 'Longitude must be >= -180' }).max(180, { error: 'Longitude must be <= 180' }),
});

// Use compatibility adapter for AI SDK integration
const adapterSchema = AISDKZodV4Adapter.createStreamingToolSchema(
  weatherSchemaV4
);

export const getWeather = tool({
  description: 'Get the current weather at a location',
  inputSchema: adapterSchema.aiSdkSchema,
  execute: async (params) => {
    // Validate with v4 for enhanced type safety
    const { latitude, longitude } = adapterSchema.validate(params);
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
    );

    const weatherData = await response.json();
    return weatherData;
  },
});
