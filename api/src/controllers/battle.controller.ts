import { PrismaClient } from "@prisma/client";
import type { Context } from "hono";
import type { StartBattle } from "../types/battle.types.js";
import {
  ERROR_INTERNAL_SERVER,
  ERROR_INVALID_REQUEST_BODY,
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_INTERNAL_SERVER_ERROR,
} from "../utils/constants.js";

const prisma = new PrismaClient();

export class BattleController {
  static startBattle = async (c: Context) => {
    try {
      const { userId } = c.get("user");
      const { attackerTeamId, defenderTeamId } =
        await c.req.json<StartBattle>();

      console.log(attackerTeamId, defenderTeamId);

      const defender = await prisma.team.findFirst({
        where: { id: defenderTeamId },
      });

      if (!defender) {
        return c.json(
          { error: ERROR_INVALID_REQUEST_BODY },
          STATUS_CODE_BAD_REQUEST
        );
      }
      //TODO check if the attacker's team and defender's team

      const battle = await prisma.battle.create({
        data: {
          attackerId: userId,
          attackerTeamId: attackerTeamId,
          defenderId: defender?.userId,
          defenderTeamId: defender?.id,
        },
      });
      return c.json(battle);
    } catch (error) {
      return c.json(
        { error: ERROR_INTERNAL_SERVER },
        STATUS_CODE_INTERNAL_SERVER_ERROR
      );
    }
  };

  static moveBattle = async (c: Context) => {};
}
