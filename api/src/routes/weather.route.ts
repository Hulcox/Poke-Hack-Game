import { Hono } from "hono";
import { WeatherController } from "../controllers/weather.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { sessionMiddleware } from "../middlewares/session.middleware.js";

const weatherRoute = new Hono();

weatherRoute.use("/*", authMiddleware, sessionMiddleware);

weatherRoute.get("/", WeatherController.getWeather);

export default weatherRoute;
