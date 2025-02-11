import { Hono } from "hono";
import { FriendController } from "../controllers/friend.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { sessionMiddleware } from "../middlewares/session.middleware.js";

const friendRouter = new Hono();

friendRouter.use("/*", authMiddleware, sessionMiddleware);

friendRouter.get("/all", FriendController.getAllFriends);
friendRouter.get("/battle", FriendController.getAllFriendsForBattle);
friendRouter.post("/add", FriendController.addFriend);
friendRouter.put("/accept", FriendController.acceptFriend);
friendRouter.delete("/:id", FriendController.deleteFriend);

export default friendRouter;
