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

export interface PokemonFormSchema {
  id: number;
  name: string;
  img: string;
  img_back: string;
  hp: number;
  attack: number;
  types: string[];
}

export interface Team {
  id: number;
  name: string;
  userId: string;
  pokemons: PokemonFormSchema[];
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
  teams: Team[];
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
export interface PokeCardProps {
  url: string;
  searchState: string;
  typesFilter: string[];
  className?: string;
  callback?: (data: {
    id: number;
    name: string;
    img: string;
    img_back: string;
    hp: number;
    attack: number;
    types: string[];
  }) => void;
}

export interface Weather {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}
