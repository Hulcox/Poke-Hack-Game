import { Hono } from "hono";
import { TeamController } from "../controllers/team.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { sessionMiddleware } from "../middlewares/session.middleware.js";

const teamRouter = new Hono();

teamRouter.use("/*", authMiddleware, sessionMiddleware);

teamRouter.get("/all", TeamController.getAllTeam);
teamRouter.get("/:id", TeamController.getById);
teamRouter.post("/", TeamController.createTeam);
teamRouter.put("/:id", TeamController.updateTeam);
teamRouter.delete("/:id", TeamController.deleteTeam);

export default teamRouter;
