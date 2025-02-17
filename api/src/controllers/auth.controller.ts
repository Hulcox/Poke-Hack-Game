import { type User } from "@prisma/client";
import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { prisma } from "../../prisma/prisma.js";
import { deleteSession, saveSession } from "../services/session.service.js";
import type { LoginUser, RegisterUser } from "../types/user.types.js";
import {
  ERROR_INTERNAL_SERVER,
  ERROR_INVALID_REQUEST_BODY,
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_FORBIDDEN,
  STATUS_CODE_INTERNAL_SERVER_ERROR,
} from "../utils/constants.js";
import { hashPassword } from "../utils/hashPassword.js";
import { loginSchema, registerSchema } from "../utils/schema.js";

const SECRET_KEY = process.env.JWT_SECRET || "";
const SESSION_EXPIRY = 3600 * 24; //24h

export class AuthController {
  static login = async (c: Context) => {
    try {
      const { email, password } = await c.req.json<LoginUser>();

      const validate = loginSchema.safeParse({ email, password });

      if (!validate.success) {
        return c.json(ERROR_INVALID_REQUEST_BODY, STATUS_CODE_BAD_REQUEST);
      }

      const user = await prisma.user.findFirst({ where: { email: email } });

      const [passwordHash] = hashPassword(password, user?.passwordSalt);

      if (user?.passwordHash !== passwordHash) {
        return c.json(
          { error: "Email or Password is invalid" },
          STATUS_CODE_FORBIDDEN
        );
      }

      const sessionId = crypto.randomUUID();
      await saveSession(
        sessionId,
        { userId: user.id, email: email },
        SESSION_EXPIRY
      );

      const token = await sign(
        { sessionId, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
        SECRET_KEY,
        "HS256"
      );

      setCookie(c, "auth_token", token, {
        httpOnly: process.env.COOKIE_HTTP_ONLY === "true",
        secure: process.env.COOKIE_SECURE === "true",
        sameSite: process.env.COOKIE_SAME_SITE as "None" | "Lax" | "Strict",
        path: "/",
        maxAge: SESSION_EXPIRY,
      });

      return c.json({ message: "Logged in ok", token });
    } catch (error) {
      return c.json(
        { error: ERROR_INTERNAL_SERVER },
        STATUS_CODE_INTERNAL_SERVER_ERROR
      );
    }
  };

  static register = async (c: Context) => {
    try {
      const { username, email, password } = await c.req.json<RegisterUser>();

      const validate = registerSchema.safeParse({ username, email, password });

      if (!validate.success) {
        return c.json(ERROR_INVALID_REQUEST_BODY, STATUS_CODE_BAD_REQUEST);
      }

      const [passwordHash, passwordSalt] = hashPassword(password);

      let code: number;
      let codeExists: boolean;

      do {
        code = Math.floor(100000 + Math.random() * 900000);
        const existingUser = await prisma.user.findFirst({
          where: { username: username, code: code },
        });
        codeExists = !!existingUser;
      } while (codeExists);

      const user = await prisma.user.create({
        data: {
          username: username,
          email: email,
          passwordHash: passwordHash,
          passwordSalt: passwordSalt,
          code: code,
        },
      });

      await addBotFirend(user);

      return c.json(user);
    } catch (error) {
      return c.json(
        { error: ERROR_INTERNAL_SERVER },
        STATUS_CODE_INTERNAL_SERVER_ERROR
      );
    }
  };

  static logout = async (c: Context) => {
    const token = getCookie(c, "auth_token");
    if (token) {
      try {
        const payload = c.get("jwtPayload");
        if (payload) await deleteSession(payload.sessionId);
      } catch (error) {
        console.log("Logout error:", error);
      }
    }

    setCookie(c, "auth_token", "", { maxAge: 0 });
    return c.json({ message: "Logged out" });
  };
}

const addBotFirend = async (user: User) => {
  const bot = await prisma.user.findFirst({
    where: { username: "FriendBot", code: 111111 },
  });

  if (bot) {
    await prisma.friend.create({
      data: {
        userId: user.id,
        friendId: bot?.id,
        status: "ACCEPTED",
      },
    });
  }
};

export default AuthController;
