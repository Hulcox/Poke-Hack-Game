import type { Context } from "hono";
import { prisma } from "../../prisma/prisma.js";
import {
  ERROR_INTERNAL_SERVER,
  ERROR_INVALID_REQUEST,
  STATUS_CODE_INTERNAL_SERVER_ERROR,
  STATUS_CODE_NOT_FOUND,
  STATUS_CODE_OK,
} from "../utils/constants.js";

export class HistoryController {
  static async getHistory(c: Context) {
    try {
      const { userId } = c.get("user");

      const friend = await prisma.friend.findMany({
        where: {
          OR: [{ friendId: userId }, { userId: userId }],
        },
        include: { user: true, friend: true },
        orderBy: { updatedAt: "asc" },
      });

      const battle = await prisma.battle.findMany({
        where: {
          OR: [{ attackerId: userId }, { defenderId: userId }],
          status: { not: "ONGOING" },
        },
        include: { attacker: true, defender: true },
        orderBy: { updatedAt: "asc" },
      });

      if (friend.length == 0 && battle.length == 0) {
        return c.json(ERROR_INVALID_REQUEST, STATUS_CODE_NOT_FOUND);
      }

      const friendHistory = friend.map((elm) => {
        const isMe = userId == elm.userId;
        return {
          type: "friend",
          user: isMe ? elm.friend : elm.user,
          status: elm.status,
          time: elm.updatedAt,
          isMe: isMe,
        };
      });

      const battleHistory = battle.map((elm) => {
        const isMe = userId == elm.attackerId;

        return {
          type: "battle",
          user: isMe ? elm.defender : elm.attacker,
          status: elm.status,
          time: elm.updatedAt,
          isMe: isMe,
        };
      });

      const history = [...friendHistory, ...battleHistory];

      return c.json(history, STATUS_CODE_OK);
    } catch (error) {
      return c.json(
        { error: ERROR_INTERNAL_SERVER },
        STATUS_CODE_INTERNAL_SERVER_ERROR
      );
    }
  }
}
