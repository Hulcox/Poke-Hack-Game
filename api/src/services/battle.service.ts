import { Redis } from "ioredis";
import type { Battle } from "../types/battle.types.js";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export const saveBattle = async (id: number, data: Battle) => {
  await redis.set(`battle:${id}`, JSON.stringify(data));
};

export const getBattle = async (id: number) => {
  const battle = await redis.get(`battle:${id}`);
  return battle ? JSON.parse(battle) : null;
};
