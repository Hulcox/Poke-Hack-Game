import { User } from "@prisma/client";
import { sign } from "hono/jwt";
import { prisma } from "../../prisma/prisma";
import { saveSession } from "../../src/services/session.service";

const SECRET_KEY = process.env.JWT_SECRET || "";
const SESSION_EXPIRY = 60 * 10;

export const createUserForTest = async (numberOfuser: number = 1) => {
  await prisma.user.deleteMany();

  let userList = [] as { token: string; user: User }[];

  for (let i = 0; i < numberOfuser; i++) {
    const user = await prisma.user.create({
      data: {
        username: `test${i}`,
        email: `test${i}@test.com`,
        code: 111111,
        passwordSalt: "123456",
        passwordHash: "123456",
      },
    });

    const sessionId = crypto.randomUUID();
    await saveSession(
      sessionId,
      { userId: user.id, email: user.email },
      SESSION_EXPIRY
    );

    //generate token team
    const token = await sign(
      { sessionId, exp: Math.floor(Date.now() / 1000) + 60 * 10 },
      SECRET_KEY,
      "HS256"
    );

    userList.push({ token: token, user: user });
  }

  return userList;
};
