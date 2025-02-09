import { Hono } from "hono";
import { UserController } from "../controllers/user.controller.js";

const userRouter = new Hono();

userRouter.get("/", UserController.getAllUsers);
userRouter.get("/:username/:code", UserController.getUser);
userRouter.get("/name", UserController.getUserByName);

export default userRouter;
