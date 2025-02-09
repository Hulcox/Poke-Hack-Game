import { PrismaClient } from "@prisma/client";
import type { Context } from "hono";
import type { CreateTeam, UpdateTeam } from "../types/team.types.js";
import {
  ERROR_INVALID_REQUEST,
  ERROR_INVALID_REQUEST_BODY,
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_NOT_FOUND,
} from "../utils/constants.js";

const prisma = new PrismaClient();

export class TeamController {
  static getAllTeam = async (c: Context) => {
    const user = c.get("user");

    try {
      const teams = await prisma.team.findMany({
        where: { userId: user.userId },
        orderBy: { id: "asc" },
      });

      if (teams.length == 0) {
        return c.json({ message: "Teams not found" }, STATUS_CODE_NOT_FOUND);
      }

      return c.json(teams);
    } catch (error) {
      return c.json({ error: ERROR_INVALID_REQUEST }, STATUS_CODE_BAD_REQUEST);
    }
  };

  static getById = async (c: Context) => {
    const id = c.req.param("id");

    try {
      const teams = await prisma.team.findFirst({
        where: { id: Number(id) },
      });

      if (!teams) {
        return c.json({ message: "Team not found" }, STATUS_CODE_NOT_FOUND);
      }

      return c.json(teams);
    } catch (error) {
      return c.json({ error: ERROR_INVALID_REQUEST }, STATUS_CODE_BAD_REQUEST);
    }
  };

  static createTeam = async (c: Context) => {
    const user = c.get("user");
    const { name, team } = await c.req.json<CreateTeam>();

    try {
      const createdTeam = await prisma.team.create({
        data: {
          name: name,
          pokemonIds: team.map((pokemon) => pokemon.id.toString()),
          totalHp: team.reduce((acc, pokemon) => {
            return acc + pokemon.hp;
          }, 0),
          userId: user.userId,
        },
      });

      return c.json(createdTeam);
    } catch (error) {
      return c.json(
        { error: ERROR_INVALID_REQUEST_BODY },
        STATUS_CODE_BAD_REQUEST
      );
    }
  };

  static updateTeam = async (c: Context) => {
    const user = c.get("user");
    const id = c.req.param("id");
    const { name, team } = await c.req.json<UpdateTeam>();

    try {
      const updateTeam = await prisma.team.update({
        data: {
          name: name,
          pokemonIds: team.map((pokemon) => pokemon.id.toString()),
          totalHp: team.reduce((acc, pokemon) => {
            return acc + pokemon.hp;
          }, 0),
        },
        where: {
          id: Number(id),
          userId: user.userId,
        },
      });

      return c.json(updateTeam);
    } catch (error) {
      return c.json(
        { error: ERROR_INVALID_REQUEST_BODY },
        STATUS_CODE_BAD_REQUEST
      );
    }
  };

  static deleteTeam = async (c: Context) => {
    const user = c.get("user");
    const id = c.req.param("id");

    try {
      await prisma.team.delete({
        where: { id: Number(id), userId: user.userId },
      });

      return c.json({ message: "Team has correctly deleted" });
    } catch (error) {
      return c.json({ error: ERROR_INVALID_REQUEST }, STATUS_CODE_BAD_REQUEST);
    }
  };
}
