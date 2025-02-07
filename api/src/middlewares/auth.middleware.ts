import type { MiddlewareHandler } from "hono";
import { jwt } from "hono/jwt";

const SECRET_KEY = process.env.JWT_SECRET || "";

export const authMiddleware: MiddlewareHandler = jwt({
  secret: SECRET_KEY,
  cookie: "auth_token",
  alg: "HS256",
});
