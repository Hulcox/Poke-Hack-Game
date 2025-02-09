import { FieldError, Path, UseFormRegister } from "react-hook-form";

export interface InputFormProps<T extends object> {
  type: string;
  placeholder: string;
  name: Path<T>;
  label?: string;
  register: UseFormRegister<T>;
  isRequired: boolean;
  isPassword?: boolean;
  error?: FieldError;
  className?: string;
}

export interface PokeCardProps {
  url: string;
  searchState: string;
  typesFilter: string[];
  className?: string;
  callback?: (data: PokemonFormSchema) => void;
}

export interface PokemonFormSchema {
  id: number;
  name: string;
  img: string;
  hp: number;
  attack: number;
}

export interface Team {
  id: number;
  name: string;
  userId: string;
  pokemonIds: string[];
  totalHp: number;
}

export interface PokemonData {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    front_shiny: string;
    official_artwork: string;
  };
  stats: { base_stat: number }[];
  types: string[];
}

export interface UserData {
  id: number;
  email: string;
  username: string;
  code: number;
}

export interface FriendData {
  id: number;
  userId: number;
  friendId: number;
  status: FriendStatus;
  friend: UserData;
  iDoRequest: boolean;
}

export enum FriendStatus {
  ACCEPTED = "ACCEPTED",
  PENDING = "PENDING",
}
