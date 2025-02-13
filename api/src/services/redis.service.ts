import { Redis } from "ioredis";
import type { WeatherData } from "../types/weather.types.js";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export const saveSession = async (
  sessionId: string,
  data: object,
  expiry: number
) => {
  await redis.setex(`session:${sessionId}`, expiry, JSON.stringify(data));
};

export const getSession = async (sessionId: string) => {
  const session = await redis.get(`session:${sessionId}`);
  return session ? JSON.parse(session) : null;
};

export const deleteSession = async (sessionId: string) => {
  await redis.unlink(`session:${sessionId}`);
};
