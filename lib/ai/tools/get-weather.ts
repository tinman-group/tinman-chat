import { tool } from 'ai';
import { z } from 'zod';

const weatherSchema = z.object({
  latitude: z.number().min(-90, 'Latitude must be >= -90').max(90, 'Latitude must be <= 90'),
  longitude: z.number().min(-180, 'Longitude must be >= -180').max(180, 'Longitude must be <= 180'),
});

export const getWeather = tool({
  description: 'Get the current weather at a location',
  inputSchema: weatherSchema,
  execute: async (params) => {
    const { latitude, longitude } = weatherSchema.parse(params);
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
    );

    const weatherData = await response.json();
    return weatherData;
  },
});
