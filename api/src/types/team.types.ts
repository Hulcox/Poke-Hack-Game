export interface CreateTeam {
  name: string;
  team: Pokemon[];
}

export interface UpdateTeam {
  name: string;
  team: Pokemon[];
}

export interface Pokemon {
  id: number;
  name: string;
  img: string;
  hp: number;
  attack: number;
  types: string[];
}
