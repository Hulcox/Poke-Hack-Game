import { Hono } from "hono";
import AuthController from "../controllers/auth.controller.js";

const authRouter = new Hono();

authRouter.use("/logout");

authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.get("/logout", AuthController.logout);

export default authRouter;
