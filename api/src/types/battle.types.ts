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
export interface MoveBattle {
  id: number;
  by: string;
  type: string;
  from: Pokemon;
  to: Pokemon;
  strengthType: string[];
  weakType: string[];
  hackDifficulty: string;
}

export interface Move {
  by: string;
  type: "ATTACK" | "SWITCH";
  from: number;
  to: number;
  value: number;
}

export interface MoveHack {
  type: "HACK";
  difficulty: string;
  lostPokemon: number;
  hpLost: number;
}

export interface Team {
  id: number;
  name: string;
  userId: string;
  pokemons: Pokemon[];
  totalHp: number;
}
