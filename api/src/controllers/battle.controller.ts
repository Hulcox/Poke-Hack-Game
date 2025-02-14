import { PrismaClient } from "@prisma/client";
import type { Context } from "hono";
import { getBattle, saveBattle } from "../services/battle.service.js";
import type { AttackBattle, Move, StartBattle } from "../types/battle.types.js";
import type { Pokemon } from "../types/team.types.js";
import {
  ERROR_INTERNAL_SERVER,
  ERROR_INVALID_REQUEST_BODY,
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_INTERNAL_SERVER_ERROR,
  STATUS_CODE_NOT_FOUND,
} from "../utils/constants.js";

const prisma = new PrismaClient();

export class BattleController {
  static async getBattle(c: Context) {
    //try {
    const { userId } = c.get("user");
    const id = Number(c.req.param("id"));

    if (isNaN(id)) {
      return c.json({ error: "Invalid battle ID" }, STATUS_CODE_BAD_REQUEST);
    }

    const battle = await prisma.battle.findFirst({
      where: { id, attackerId: userId },
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
    // } catch (error) {
    //   return c.json(
    //     { error: ERROR_INTERNAL_SERVER },
    //     STATUS_CODE_INTERNAL_SERVER_ERROR
    //   );
    // }
  }

  static async startBattle(c: Context) {
    try {
      const { userId } = c.get("user");
      const { attackerTeamId, defenderTeamId } =
        await c.req.json<StartBattle>();

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
    } catch (error) {
      return c.json(
        { error: ERROR_INTERNAL_SERVER },
        STATUS_CODE_INTERNAL_SERVER_ERROR
      );
    }
  }

  static async attackBattle(c: Context) {
    //try {
    const { id, by, type, from, to } = await c.req.json<AttackBattle>();

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

    const move = {
      by,
      type,
      from: from.id,
      to: to.id,
      value: from.attack,
    } as Move;

    const battle = await prisma.battle.update({
      where: { id },
      data: {
        movesHistory: {
          push: {
            by,
            type,
            from: from.id,
            to: to.id,
            value: from.attack,
          },
        },
      },
    });

    let attackerTeam: Pokemon[] = [];
    let defenderTeam: Pokemon[] = [];

    if (by == "DEFENDER") {
      attackerTeam = applyMove(battleCache.attackerTeam, move);
      defenderTeam = battleCache.defenderTeam;
    }
    if (by == "ATTACKER") {
      attackerTeam = battleCache.attackerTeam;
      defenderTeam = applyMove(battleCache.defenderTeam, move);
    }

    const activeAttackerPokemon = attackerTeam.find(
      (pokemon: Pokemon) => pokemon.id == battleCache.activeAttackerPokemon.id
    );
    const activeDefenderPokemon = defenderTeam.find(
      (pokemon: Pokemon) => pokemon.id == battleCache.activeDefenderPokemon.id
    );

    if (activeAttackerPokemon && activeDefenderPokemon)
      await saveBattle(id, {
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

    // } catch (error) {
    //   return c.json(
    //     { error: ERROR_INTERNAL_SERVER },
    //     STATUS_CODE_INTERNAL_SERVER_ERROR
    //   );
    // }
  }

  static async switchBattle(c: Context) {
    //try {
    const { id, by, type, from, to } = await c.req.json<AttackBattle>();

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

    const battle = await prisma.battle.update({
      where: { id },
      data: {
        movesHistory: {
          push: {
            by,
            type,
            from: from.id,
            to: to.id,
            value: null,
          },
        },
      },
    });

    const activeAttackerPokemon = battleCache.attackerTeam.find(
      (pokemon: Pokemon) => pokemon.id == to.id
    );
    const activeDefenderPokemon = battleCache.defenderTeam.find(
      (pokemon: Pokemon) => pokemon.id == to.id
    );

    console.log(activeDefenderPokemon);

    const savedData = {
      attackerTeam: battleCache.attackerTeam,
      defenderTeam: battleCache.defenderTeam,
      activeAttackerPokemon:
        by == "ATTACKER"
          ? activeAttackerPokemon
          : battleCache.activeAttackerPokemon,
      activeDefenderPokemon:
        by == "DEFENDER"
          ? activeDefenderPokemon
          : battleCache.activeDefenderPokemon,
    };

    await saveBattle(id, savedData);

    return c.json({
      ...battle,
      ...savedData,
    });

    // } catch (error) {
    //   return c.json(
    //     { error: ERROR_INTERNAL_SERVER },
    //     STATUS_CODE_INTERNAL_SERVER_ERROR
    //   );
    // }
  }
}

const applyMove = (pokemon: Pokemon[], lastMove?: Move): Pokemon[] => {
  return pokemon.map((pokemon) => {
    if (!lastMove) return pokemon;

    if (pokemon.id === lastMove.to) {
      return {
        ...pokemon,
        hp: Math.max(0, pokemon.hp - lastMove.value),
      };
    }

    return pokemon;
  });
};
