import { Hono } from "hono";
import AuthController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { sessionMiddleware } from "../middlewares/session.middleware.js";

const authRouter = new Hono();

authRouter.use("/logout", authMiddleware, sessionMiddleware);

authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.get("/logout", AuthController.logout);

export default authRouter;
