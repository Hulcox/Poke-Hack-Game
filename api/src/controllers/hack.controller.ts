import type { Context } from "hono";
import { prisma } from "../../prisma/prisma.js";
import type { verifyHack } from "../types/hack.types.js";
import {
  ERROR_INTERNAL_SERVER,
  ERROR_INVALID_REQUEST_BODY,
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_INTERNAL_SERVER_ERROR,
  STATUS_CODE_OK,
} from "../utils/constants.js";

export class HackController {
  static async verifyHack(c: Context) {
    try {
      const { id, solution } = await c.req.json<verifyHack>();

      const hack = await prisma.hack.findUnique({
        where: { id },
      });

      if (!hack) {
        return c.json(
          { message: ERROR_INVALID_REQUEST_BODY },
          STATUS_CODE_BAD_REQUEST
        );
      }

      if (hack.solution === solution.toUpperCase()) {
        return c.json(
          { success: true, message: "Hack resolve" },
          STATUS_CODE_OK
        );
      }

      return c.json({ success: false, message: "bad reponse" }, STATUS_CODE_OK);
    } catch (error) {
      return c.json(
        { error: ERROR_INTERNAL_SERVER },
        STATUS_CODE_INTERNAL_SERVER_ERROR
      );
    }
  }
}
