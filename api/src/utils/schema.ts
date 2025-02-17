import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().nonempty("Username is required"),
  email: z.string().email("Invalid email").nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email").nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
});

const pokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  img: z.string(),
  img_back: z.string(),
  hp: z.number(),
  hp_base: z.number(),
  attack: z.number(),
  types: z.array(z.string()),
});

export const teamSchema = z.object({
  name: z.string().nonempty("Name team is required"),
  team: z
    .array(pokemonSchema)
    .max(6, "You can only have up to 6 Pokémons")
    .min(6, "6 pokémons is required in your team"),
});
