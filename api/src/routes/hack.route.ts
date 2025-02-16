import { Hono } from "hono";
import { HackController } from "../controllers/hack.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { sessionMiddleware } from "../middlewares/session.middleware.js";

const hackRouter = new Hono();

hackRouter.use("/*", authMiddleware, sessionMiddleware);

hackRouter.post("/verify", HackController.verifyHack);

export default hackRouter;
