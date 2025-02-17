import type { InputJsonValue } from "@prisma/client/runtime/client.js";
import type { Context } from "hono";
import { prisma } from "../../prisma/prisma.js";
import {
  calculateAttack,
  calculateHackProbability,
  checkWin,
  getBattle,
  getRandomHack,
  lostPokemons,
  saveBattle,
  updateTeamsAfterMove,
} from "../services/battle.service.js";
import type {
  Move,
  MoveBattle,
  MoveHack,
  StartBattle,
} from "../types/battle.types.js";
import type { Pokemon } from "../types/team.types.js";
import {
  ERROR_INVALID_REQUEST_BODY,
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_INTERNAL_SERVER_ERROR,
  STATUS_CODE_NOT_FOUND,
} from "../utils/constants.js";

export class BattleController {
  static async getBattle(c: Context) {
    const { userId } = c.get("user");
    const id = Number(c.req.param("id"));

    if (isNaN(id)) {
      return c.json({ error: "Invalid battle ID" }, STATUS_CODE_BAD_REQUEST);
    }

    const battle = await prisma.battle.findFirst({
      where: { id, attackerId: userId, status: "ONGOING" },
      include: {
        attacker: true,
        attackerTeam: true,
        defender: true,
        defenderTeam: true,
      },
    });

    if (!battle) {
      return c.json({ error: "Battle not found" }, STATUS_CODE_NOT_FOUND);
    }

    const battleCache = await getBattle(id);

    if (battleCache) {
      return c.json({ ...battle, ...battleCache });
    }

    const attackerTeam = battle.attackerTeam?.pokemons as unknown as Pokemon[];
    const defenderTeam = battle.defenderTeam?.pokemons as unknown as Pokemon[];

    if (!attackerTeam || !defenderTeam) {
      return c.json(
        { error: "Invalid team data" },
        STATUS_CODE_INTERNAL_SERVER_ERROR
      );
    }

    const activeAttackerPokemon = attackerTeam[0];
    const activeDefenderPokemon = defenderTeam[0];

    await saveBattle(battle.id, {
      attackerTeam,
      defenderTeam,
      activeAttackerPokemon,
      activeDefenderPokemon,
    });

    return c.json({
      ...battle,
      attackerTeam,
      defenderTeam,
      activeAttackerPokemon,
      activeDefenderPokemon,
    });
  }

  static async startBattle(c: Context) {
    const { userId } = c.get("user");
    const { attackerTeamId, defenderTeamId } = await c.req.json<StartBattle>();

    if (!attackerTeamId || !defenderTeamId) {
      return c.json(
        { error: ERROR_INVALID_REQUEST_BODY },
        STATUS_CODE_BAD_REQUEST
      );
    }

    const defender = await prisma.team.findUnique({
      where: { id: defenderTeamId },
    });

    if (!defender) {
      return c.json(
        { error: "Defender team not found" },
        STATUS_CODE_NOT_FOUND
      );
    }

    const battle = await prisma.battle.create({
      data: {
        attackerId: userId,
        attackerTeamId,
        defenderId: defender.userId,
        defenderTeamId: defender.id,
      },
    });

    return c.json(battle);
  }

  static async attackBattle(c: Context) {
    const { id, by, type, from, to, strengthType, weakType } =
      await c.req.json<MoveBattle>();

    if (!id || !by || !type || !from || !to) {
      return c.json(
        { error: ERROR_INVALID_REQUEST_BODY },
        STATUS_CODE_BAD_REQUEST
      );
    }

    const battleCache = await getBattle(id);
    if (!battleCache) {
      return c.json(
        { error: "Battle not found in cache" },
        STATUS_CODE_NOT_FOUND
      );
    }

    const hackChance = calculateHackProbability(weakType, [
      ...battleCache.attackerTeam,
      ...battleCache.defenderTeam,
    ]);

    const isHacked = Math.random() * 100 < hackChance;

    if (isHacked && by == "ATTACKER") {
      const hack = await getRandomHack();
      return c.json({ hack: hack });
    }

    const [attackValue, attackEfficacy] = calculateAttack(
      strengthType,
      weakType,
      from,
      to
    );
    const move: Move = {
      by,
      type: type as "ATTACK" | "SWITCH",
      from: from.id,
      to: to.id,
      value: attackValue,
    };

    const updatedTeams = updateTeamsAfterMove(battleCache, move);
    const updatedBattle = updateBattle(id, move);

    await saveBattle(id, updatedTeams);

    const status = await checkWin(updatedTeams, id);
    if (status) {
      return c.json({
        status: status,
      });
    }

    return c.json({
      ...updatedBattle,
      attackEfficacy,
      ...updatedTeams,
      currentTurn: by == "ATTACKER" ? "DEFENDER" : "ATTACKER",
    });
  }

  static async switchBattle(c: Context) {
    const { id, by, type, from, to } = await c.req.json<MoveBattle>();

    if (!id || !by || !type || !from || !to) {
      return c.json(
        { error: ERROR_INVALID_REQUEST_BODY },
        STATUS_CODE_BAD_REQUEST
      );
    }

    const battleCache = await getBattle(id);
    if (!battleCache) {
      return c.json(
        { error: "Battle not found in cache" },
        STATUS_CODE_NOT_FOUND
      );
    }

    const move: Move = {
      by,
      type: type as "ATTACK" | "SWITCH",
      from: from.id,
      to: to.id,
      value: 0,
    };

    const battle = updateBattle(id, move);

    const savedData = {
      attackerTeam: battleCache.attackerTeam,
      defenderTeam: battleCache.defenderTeam,
      activeAttackerPokemon:
        by === "ATTACKER" ? to : battleCache.activeAttackerPokemon,
      activeDefenderPokemon:
        by === "DEFENDER" ? to : battleCache.activeDefenderPokemon,
    };

    await saveBattle(id, savedData);

    return c.json({
      ...battle,
      currentTurn: from.hp == 0 ? "ATTACKER" : "DEFENDER",
      ...savedData,
    });
  }

  static async hackBattle(c: Context) {
    const { id, type, to, hackDifficulty } = await c.req.json<MoveBattle>();

    if (!id || !type || !to || !hackDifficulty) {
      return c.json(
        { error: ERROR_INVALID_REQUEST_BODY },
        STATUS_CODE_BAD_REQUEST
      );
    }

    const battleCache = await getBattle(id);
    if (!battleCache) {
      return c.json(
        { error: "Battle not found in cache" },
        STATUS_CODE_NOT_FOUND
      );
    }

    const isEasy = ["Facile", "Moyenne"].includes(hackDifficulty);
    const move: MoveHack = {
      type: "HACK",
      difficulty: hackDifficulty,
      lostPokemon: isEasy
        ? Math.min(
            Math.floor(Math.random() * 3) + 1,
            battleCache.attackerTeam.length
          )
        : 0,
      hpLost: isEasy ? 0 : hackDifficulty === "Difficile" ? 25 : 15,
    };

    const updatedAttackerTeam = isEasy
      ? lostPokemons(battleCache.attackerTeam, move.lostPokemon, to)
      : battleCache.attackerTeam.map((pokemon: Pokemon) => ({
          ...pokemon,
          hp:
            pokemon.id == to.id ? Math.max(0, to.hp - move.hpLost) : pokemon.hp,
        }));

    const savedData = {
      attackerTeam: updatedAttackerTeam,
      defenderTeam: battleCache.defenderTeam,
      activeAttackerPokemon: isEasy
        ? battleCache.activeAttackerPokemon
        : updatedAttackerTeam.find((p: Pokemon) => p.id == to.id),
      activeDefenderPokemon: battleCache.activeDefenderPokemon,
    };

    const status = await checkWin(savedData, id);
    if (status) {
      return c.json({
        status: status,
      });
    }

    const battle = await updateBattle(id, move);
    await saveBattle(id, savedData);

    return c.json({
      ...battle,
      currentTurn: "ATTACKER",
      ...savedData,
      hackMessage: isEasy ? "You lost some pokemon" : "You lost some Hp",
    });
  }
}
const updateBattle = async (id: number, move: Move | MoveHack) => {
  return await prisma.battle.update({
    where: { id },
    data: { movesHistory: { push: move as unknown as InputJsonValue[] } },
  });
};
