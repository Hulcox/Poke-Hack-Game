import { Hono } from "hono";
import { HistoryController } from "../controllers/history.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { sessionMiddleware } from "../middlewares/session.middleware.js";

const historyRouter = new Hono();

historyRouter.use("/*", authMiddleware, sessionMiddleware);

historyRouter.get("/", HistoryController.getHistory);

export default historyRouter;
