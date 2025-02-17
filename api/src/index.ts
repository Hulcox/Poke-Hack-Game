import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import authRouter from "./routes/auth.route.js";
import battleRouter from "./routes/battle.route.js";
import friendRouter from "./routes/friends.route.js";
import hackRouter from "./routes/hack.route.js";
import historyRouter from "./routes/history.route.js";
import teamRouter from "./routes/team.route.js";
import userRouter from "./routes/user.route.js";
import weatherRoute from "./routes/weather.route.js";

const app = new Hono();

app.use(logger());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.route("/api/auth", authRouter);
app.route("/api/user", userRouter);
app.route("/api/team", teamRouter);
app.route("/api/friend", friendRouter);
app.route("/api/weather", weatherRoute);
app.route("/api/battle", battleRouter);
app.route("/api/hack", hackRouter);
app.route("/api/history", historyRouter);

app.onError((err, c) => {
  console.log("Error", err);
  return c.json({ error: "Error survey" }, 500);
});

const port = 3030;
console.log(`Server is running on ${process.env.API_URL}:${port}`);

const server = serve({
  fetch: app.fetch,
  port,
});

export default server;
