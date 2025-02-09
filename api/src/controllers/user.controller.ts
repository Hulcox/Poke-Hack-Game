import { PrismaClient } from "@prisma/client";
import type { Context } from "hono";

const prisma = new PrismaClient();

export class UserController {
  static getAllUsers = async (c: Context) => {
    const users = await prisma.user.findMany();

    return c.json(users);
  };

  static getUser = async (c: Context) => {
    const username = c.req.param("username");
    const code = c.req.param("code");

    const user = await prisma.user.findFirst({
      where: { username: username, code: Number(code) },
    });

    if (!user) {
      return c.json({ error: "No user found" }, 404);
    }

    return c.json(user);
  };

  static getUserByName = async (c: Context) => {
    const username = c.req.query("username");
    const userId = 12;

    if (!username) {
      return c.json({ error: "No username given" }, 404);
    }

    const user = await prisma.user.findMany({
      where: {
        username: { startsWith: username, mode: "insensitive" },
        id: { not: userId },
        AND: [
          {
            friends: {
              none: {
                OR: [{ friendId: userId }, { userId: userId }],
              },
            },
          },
          {
            friendOf: {
              none: {
                OR: [{ userId: userId }, { friendId: userId }],
              },
            },
          },
        ],
      },
      omit: { passwordHash: true, passwordSalt: true },
    });

    if (!user) {
      return c.json({ error: "No user found" }, 404);
    }

    return c.json(user);
  };
}
