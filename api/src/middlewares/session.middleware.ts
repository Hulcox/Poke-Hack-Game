import type { MiddlewareHandler } from "hono";
import { getSession } from "../services/redis.service.js";

export const sessionMiddleware: MiddlewareHandler = async (c, next) => {
  const payload = c.get("jwtPayload");
  if (!payload) return next();

  const user = await getSession(payload.sessionId);
  if (user) c.set("user", user);

  await next();
};
