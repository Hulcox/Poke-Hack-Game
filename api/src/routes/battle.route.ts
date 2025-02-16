import { Hono } from "hono";
import { BattleController } from "../controllers/battle.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { sessionMiddleware } from "../middlewares/session.middleware.js";

const battleRouter = new Hono();

battleRouter.use("/*", authMiddleware, sessionMiddleware);

battleRouter.get("/:id", BattleController.getBattle);
battleRouter.post("/start", BattleController.startBattle);
battleRouter.post("/attack", BattleController.attackBattle);
battleRouter.post("/switch", BattleController.switchBattle);
battleRouter.post("/hack", BattleController.hackBattle);

export default battleRouter;
