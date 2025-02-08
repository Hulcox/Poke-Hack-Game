interface TypeColors {
  [key: string]: string;
}

interface TypeWeaknesses {
  [key: string]: string;
}

export const TYPE_COLORS: TypeColors = {
  normal: "#9CA3AF",
  fire: "#EA580C",
  water: "#3B82F6",
  electric: "#EAB308",
  grass: "#22C55E",
  ice: "#67E8F9",
  fighting: "#B91C1C",
  poison: "#9333EA",
  ground: "#A16207",
  flying: "#A5B4FC",
  psychic: "#EC4899",
  bug: "#84CC16",
  rock: "#92400E",
  ghost: "#6D28D9",
  dragon: "#3730A3",
  dark: "#1F2937",
  steel: "#6B7280",
  fairy: "#F9A8D4",
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
