import { Redis } from "ioredis";
import type { Battle, Move } from "../types/battle.types.js";
import type { Pokemon } from "../types/team.types.js";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export const saveBattle = async (id: number, data: Battle) => {
  await redis.set(`battle:${id}`, JSON.stringify(data));
};

export const getBattle = async (id: number) => {
  const battle = await redis.get(`battle:${id}`);
  return battle ? JSON.parse(battle) : null;
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
