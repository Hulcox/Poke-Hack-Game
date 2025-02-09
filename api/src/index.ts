import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import authRouter from "./routes/auth.route.js";
import friendRouter from "./routes/friends.route.js";
import teamRouter from "./routes/team.route.js";
import userRouter from "./routes/user.route.js";

const app = new Hono();

app.use(logger());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.route("/auth", authRouter);
app.route("/user", userRouter);
app.route("/team", teamRouter);
app.route("/friend", friendRouter);

app.onError((err, c) => {
  console.log("Erreur", err);
  return c.json({ error: "Error survey" }, 500);
});

const port = 3030;
console.log(`Server is running on ${process.env.API_URL}:${port}`);

serve({
  fetch: app.fetch,
  port,
});
