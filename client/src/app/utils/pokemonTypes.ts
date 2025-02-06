interface TypeColors {
  [key: string]: string;
}

interface TypeWeaknesses {
  [key: string]: string;
}

export const TYPE_COLORS: TypeColors = {
  normal: "bg-gray-400",
  fire: "bg-orange-600",
  water: "bg-blue-500",
  electric: "bg-yellow-500",
  grass: "bg-green-500",
  ice: "bg-cyan-300",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-700",
  flying: "bg-indigo-300",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-amber-700",
  ghost: "bg-violet-700",
  dragon: "bg-indigo-800",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
};

export const TYPE_WEAKNESSES: TypeWeaknesses = {
  normal: "fighting",
  fire: "water",
  water: "electric",
  electric: "ground",
  grass: "fire",
  ice: "fire",
  fighting: "flying",
  poison: "ground",
  ground: "water",
  flying: "electric",
  psychic: "bug",
  bug: "fire",
  rock: "water",
  ghost: "ghost",
  dragon: "ice",
  dark: "fighting",
  steel: "fire",
  fairy: "poison",
};
