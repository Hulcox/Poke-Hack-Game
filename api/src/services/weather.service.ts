import { Redis } from "ioredis";
import type { WeatherData } from "../types/weather.types.js";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export const saveWeather = async (
  lat: string,
  lon: string,
  weatherData: WeatherData,
  expiry: number
) => {
  await redis.setex(
    `weather:${lat},${lon}`,
    expiry,
    JSON.stringify(weatherData)
  );
};

export const getWeather = async (lat: string, lon: string) => {
  const weather = await redis.get(`weather:${lat},${lon}`);
  return weather ? JSON.parse(weather) : null;
};
