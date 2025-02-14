import { Weather } from "@/lib/types";
import { DateTime } from "luxon";

interface Type {
  [key: string]: string;
}

export const TYPE_COLORS: Type = {
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

export const TYPE_WEAKNESSES: Type = {
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

export const WEATHER_TYPE_STRENGTH: Type = {
  Clear: "fire",
  Clouds: "normal",
  Snow: "ice",
  Rain: "water",
  Drizzle: "water",
  Thunderstorm: "electric",
  Mist: "fairy",
  Smoke: "poison",
  Haze: "dark",
  Dust: "ground",
  Fog: "ghost",
  Sand: "ground",
  Ash: "fire",
  Squall: "flying",
  Tornado: "flying",
};

export const WEATHER_TYPE_WEAKNESSES: Type = {
  Clear: "dark",
  Clouds: "psychic",
  Snow: "grass",
  Rain: "fire",
  Drizzle: "fire",
  Thunderstorm: "ground",
  Mist: "dark",
  Smoke: "water",
  Haze: "fairy",
  Dust: "water",
  Fog: "electric",
  Sand: "grass",
  Ash: "water",
  Squall: "rock",
  Tornado: "ice",
};

export const isNight = (sunrise: number, sunset: number) => {
  const now = DateTime.now();
  const sunriseTime = DateTime.fromSeconds(sunrise);
  const sunsetTime = DateTime.fromSeconds(sunset);
  return now < sunriseTime || now > sunsetTime;
};

export const typeWeaknessesByWeather = (weatherData: Weather) => {
  const weather = weatherData.weather[0].main;
  const temp = weatherData.main.temp;
  const wind = weatherData.wind.speed;
  const sunset = weatherData.sys.sunset;
  const sunrise = weatherData.sys.sunrise;

  const weaknesses = WEATHER_TYPE_WEAKNESSES[weather];
  const arr = [weaknesses];

  if (temp > 25 && !weaknesses?.includes("ice")) {
    arr.push("ice");
  }

  if (wind > 15) {
    if (!arr.includes("rock")) arr.push("rock");
    if (!arr.includes("bug")) arr.push("bug");
  }

  if (isNight(sunrise, sunset) && !arr.includes("fairy")) {
    arr.push("fairy");
  }

  return arr;
};

export const typeStrengthByWeather = (weatherData: Weather) => {
  const weather = weatherData.weather[0].main;
  const temp = weatherData.main.temp;
  const wind = weatherData.wind.speed;
  const sunset = weatherData.sys.sunset;
  const sunrise = weatherData.sys.sunrise;

  const weaknesses = WEATHER_TYPE_STRENGTH[weather];
  const arr = [weaknesses];

  if (temp <= 5 && arr.includes("fire")) {
    arr.pop();
  }

  if (wind > 15 && !arr.includes("flying")) {
    arr.push("flying");
  }

  if (isNight(sunrise, sunset) && !arr.includes("dark")) {
    arr.push("dark");
  }

  return arr;
};
