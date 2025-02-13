import type { Pokemon } from "./team.types.js";

export interface Battle {
  attackerTeam: Pokemon[];
  activeAttackerPokemon: Pokemon;
  defenderTeam: Pokemon[];
  activeDefenderPokemon: Pokemon;
}

export interface StartBattle {
  attackerTeamId: number;
  defenderTeamId: number;
}
export interface AttackBattle {
  id: number;
  by: string;
  type: string;
  from: Pokemon;
  to: Pokemon;
}

export interface Move {
  by: "ATTACKER" | "DEFENDER";
  type: "ATTACK" | "SWITCH";
  from: number;
  to: number;
  value: 0;
}

export interface Team {
  id: number;
  name: string;
  userId: string;
  pokemons: Pokemon[];
  totalHp: number;
}
