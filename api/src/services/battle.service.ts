import { PrismaClient } from "@prisma/client";
import type { Battle, Move } from "../types/battle.types.js";
import type { Pokemon } from "../types/team.types.js";
import { redis } from "./redis.service.js";

const prisma = new PrismaClient();

export const saveBattle = async (id: number, data: Battle) => {
  await redis.set(`battle:${id}`, JSON.stringify(data));
};

export const getBattle = async (id: number) => {
  const battle = await redis.get(`battle:${id}`);
  return battle ? JSON.parse(battle) : null;
};

export const deleteBattle = async (id: number) => {
  await redis.unlink(`battle:${id}`);
};

export const updateTeamsAfterMove = (
  battleCache: Battle,
  move: Move
): Battle => {
  const attackerTeam =
    move.by === "DEFENDER"
      ? applyMove(battleCache.attackerTeam, move)
      : battleCache.attackerTeam;
  const defenderTeam =
    move.by === "ATTACKER"
      ? applyMove(battleCache.defenderTeam, move)
      : battleCache.defenderTeam;

  return {
    attackerTeam,
    defenderTeam,
    activeAttackerPokemon:
      attackerTeam.find((p) => p.id == battleCache.activeAttackerPokemon.id) ||
      battleCache.activeAttackerPokemon,
    activeDefenderPokemon:
      defenderTeam.find((p) => p.id == battleCache.activeDefenderPokemon.id) ||
      battleCache.activeDefenderPokemon,
  };
};

export const applyMove = (team: Pokemon[], move?: Move): Pokemon[] => {
  return team.map((pokemon) => {
    if (!move || pokemon.id !== move.to) return pokemon;
    return { ...pokemon, hp: Math.max(0, pokemon.hp - move.value) };
  });
};

export const isTeamDefeated = (team: Pokemon[]): boolean => {
  return team.every((pokemon) => pokemon.hp <= 0);
};

export const calculateAttack = (
  strengthType: string[],
  weakType: string[],
  from: Pokemon,
  to: Pokemon
): [number, string] => {
  let attackValue = from.attack;
  let attackEfficacy = "normal";

  if (to.types.some((type) => strengthType.includes(type))) {
    attackValue *= 0.5;
    attackEfficacy = "not very effective";
  }
  if (to.types.some((type) => weakType.includes(type))) {
    attackValue *= 1.5;
    attackEfficacy = "effective";
  }
  if (from.types.some((type) => strengthType.includes(type))) {
    attackValue *= 1.2;
    attackEfficacy = "effective";
  }
  if (from.types.some((type) => weakType.includes(type))) {
    attackValue *= 0.8;
    attackEfficacy = "not very effective";
  }

  return [Math.floor(attackValue), attackEfficacy];
};

export const calculateHackProbability = (
  weakTypes: string[],
  teams: Pokemon[]
) => {
  let baseChance = 10;
  let affectedPokemon = 0;

  teams.forEach((team) => {
    if (weakTypes.some((type) => team.types.includes(type))) {
      affectedPokemon++;
    }
  });

  return baseChance + affectedPokemon * 5;
};

export const getRandomHack = async () => {
  const hacks = await prisma.hack.findMany();
  return hacks[Math.floor(Math.random() * hacks.length)];
};

export const lostPokemons = (
  team: Pokemon[],
  lostCount: number,
  activePokemon: Pokemon
) => {
  const pokemonsAffected = team
    .filter((pokemon) => pokemon.id != activePokemon.id && pokemon.hp != 0)
    .map((pokemon, index) => {
      const isLost = index < lostCount;
      return { ...pokemon, hp: isLost ? 0 : pokemon.hp };
    });

  return team.map((pokemon) => {
    const pokemonAffected = pokemonsAffected.find(
      (elm) => elm.id == pokemon.id
    );
    return pokemonAffected ? pokemonAffected : pokemon;
  });
};

export const checkWin = async (team: Battle, id: number) => {
  if (isTeamDefeated(team.attackerTeam) || isTeamDefeated(team.defenderTeam)) {
    const winner = isTeamDefeated(team.attackerTeam) ? "DEFENDER" : "ATTACKER";

    const battleStatus = winner == "ATTACKER" ? "WIN" : "LOOSE";

    await prisma.battle.update({
      where: { id },
      data: { status: battleStatus },
    });

    await deleteBattle(id);
    return battleStatus;
  } else {
    return false;
  }
};
