import { Hono } from "hono";
import { UserController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { sessionMiddleware } from "../middlewares/session.middleware.js";

const userRouter = new Hono();

userRouter.use("/*", authMiddleware, sessionMiddleware);

userRouter.get("/", UserController.getAllUsers);
userRouter.get("/:username/:code", UserController.getUser);
userRouter.get("/name", UserController.getUserByName);

export default userRouter;
