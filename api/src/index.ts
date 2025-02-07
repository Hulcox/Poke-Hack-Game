import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";

const app = new Hono();

app.use(logger());

app.route("/auth", authRouter);
app.route("/users", userRouter);

app.onError((err, c) => {
  console.log("Erreur", err);
  return c.json({ error: "Error survey" }, 500);
});

const port = 3030;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
