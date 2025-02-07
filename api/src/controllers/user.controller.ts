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
}
